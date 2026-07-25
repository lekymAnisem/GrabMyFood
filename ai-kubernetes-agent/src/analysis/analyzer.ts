import { randomUUID } from "node:crypto";
import { AlertmanagerWebhook, affectedServices } from "../alerts/alertmanager.js";
import { config } from "../config/index.js";
import { KubernetesReader } from "../kubernetes/client.js";
import { PrometheusClient, PrometheusQueryResult } from "../prometheus/client.js";
import { promql, renderQuery } from "../prometheus/queries.js";
import { Incident } from "../types/incident.js";

export class IncidentAnalyzer {
  constructor(
    private readonly prometheus: PrometheusClient,
    private readonly kubernetes: KubernetesReader
  ) {}

  async analyze(payload: AlertmanagerWebhook): Promise<Incident> {
    const alertName = payload.commonLabels.alertname ?? payload.alerts[0]?.labels.alertname ?? "UnknownAlert";
    const namespace = payload.commonLabels.namespace ?? config.KUBERNETES_NAMESPACE;
    const services = affectedServices(payload);
    const workload = services[0] ?? payload.commonLabels.deployment ?? ".*";
    const service = services.length ? services.join("|") : ".*";
    const severity = normalizeSeverity(payload.commonLabels.severity);

    const renderedQueries = [
      renderQuery(promql.podRestarts, { namespace, workload }),
      renderQuery(promql.cpuAgainstRequest, { namespace, workload }),
      renderQuery(promql.cpuThrottling, { namespace, workload }),
      renderQuery(promql.memoryAgainstLimit, { namespace, workload }),
      renderQuery(promql.latencyP95, { namespace, service }),
      renderQuery(promql.http5xxRate, { namespace, service }),
      renderQuery(promql.dbConnections, { namespace, workload })
    ];

    const [pods, events, ...metrics] = await Promise.all([
      this.kubernetes.listPods(namespace).catch((error) => [{ error: String(error) }]),
      this.kubernetes.listEvents(namespace).catch((error) => [{ error: String(error) }]),
      ...renderedQueries.map((query) => this.prometheus.safeQuery(query))
    ]);

    const evidence = (metrics as PrometheusQueryResult[]).map((metric) => ({
      source: "prometheus" as const,
      query: metric.query,
      value: metric.data,
      summary: metric.status === "success" ? "Prometheus query returned data" : "Prometheus query failed"
    }));

    const likely = classify(alertName);
    const recommended = recommend(alertName);
    const automaticAllowed =
      config.AGENT_MODE === "limited-auto" &&
      config.AUTOMATIC_REMEDIATION &&
      recommended.some((action) => action.risk === "low" && !action.requires_approval);

    return {
      incident_id: `inc-${randomUUID()}`,
      timestamp: new Date().toISOString(),
      severity,
      cluster: config.CLUSTER_NAME,
      namespace,
      affected_services: services,
      summary: `${alertName} detected in ${namespace}${services.length ? ` for ${services.join(", ")}` : ""}`,
      observations: [
        `${payload.alerts.length} Alertmanager alert(s) were correlated into this incident.`,
        `Kubernetes pod snapshot count: ${Array.isArray(pods) ? pods.length : 0}.`,
        `Recent Kubernetes event count: ${Array.isArray(events) ? events.length : 0}.`
      ],
      likely_root_causes: [
        {
          cause: likely.cause,
          confidence: likely.confidence,
          evidence: [
            ...evidence,
            { source: "kubernetes", resource: "pods", value: pods, summary: "Recent pod and container status inspected" },
            { source: "kubernetes", resource: "events", value: events, summary: "Recent namespace events inspected" }
          ]
        }
      ],
      recommended_actions: recommended,
      automatic_action: {
        allowed: automaticAllowed,
        runbook: automaticAllowed ? recommended.find((action) => action.risk === "low")?.runbook ?? null : null,
        reason: automaticAllowed
          ? "Limited automatic remediation is enabled and a low-risk runbook matched."
          : "Automatic remediation is disabled by default or the matching action requires approval."
      },
      verification_queries: [
        renderQuery(promql.unavailableReplicas, { namespace, workload }),
        renderQuery(promql.latencyP95, { namespace, service }),
        renderQuery(promql.http5xxRate, { namespace, service })
      ],
      status: "detected"
    };
  }
}

function normalizeSeverity(value?: string): "info" | "warning" | "critical" {
  if (value === "critical") return "critical";
  if (value === "warning") return "warning";
  return "info";
}

function classify(alertName: string) {
  if (/CrashLoop|Restart|OOM/i.test(alertName)) {
    return { cause: "A workload is repeatedly failing or exhausting resources.", confidence: 0.72 };
  }
  if (/Latency|5xx|Availability|Timeout/i.test(alertName)) {
    return { cause: "User-facing latency or errors are elevated; downstream saturation should be checked first.", confidence: 0.64 };
  }
  if (/Database|Connection|Deadlock/i.test(alertName)) {
    return { cause: "Database saturation or connection-pool pressure is affecting service health.", confidence: 0.68 };
  }
  if (/Node|Pending|Scheduling|Filesystem/i.test(alertName)) {
    return { cause: "Cluster capacity or node health is limiting workload scheduling or availability.", confidence: 0.66 };
  }
  return { cause: "The alert needs SRE review with the collected Kubernetes and Prometheus evidence.", confidence: 0.45 };
}

function recommend(alertName: string) {
  if (/CrashLoop|Restart/i.test(alertName)) {
    return [
      {
        id: "collect-pod-diagnostics",
        action: "Collect pod status, previous logs, deployment history, and recent events.",
        risk: "low" as const,
        requires_approval: false,
        expected_result: "Evidence identifies whether the failure is config, image, probe, dependency, or resource related.",
        rollback: "No rollback needed; read-only diagnostic action.",
        runbook: "collect-pod-diagnostics"
      },
      {
        id: "restart-unhealthy-pod",
        action: "Restart one unhealthy Deployment-managed pod only if healthy replicas remain.",
        risk: "low" as const,
        requires_approval: true,
        expected_result: "A replacement pod becomes Ready without reducing service availability.",
        rollback: "Deployment recreates the pod; stop further action if readiness does not recover.",
        runbook: "restart-unhealthy-pod"
      }
    ];
  }
  if (/Latency|CPU/i.test(alertName)) {
    return [
      {
        id: "investigate-high-latency",
        action: "Correlate latency with request rate, CPU throttling, memory, database connections, and recent deploys.",
        risk: "low" as const,
        requires_approval: false,
        expected_result: "Capacity, dependency, or deployment regression evidence is identified.",
        rollback: "No rollback needed; read-only diagnostic action.",
        runbook: "investigate-high-latency"
      },
      {
        id: "scale-deployment-within-policy",
        action: "Temporarily scale an approved stateless deployment within configured guardrails.",
        risk: "medium" as const,
        requires_approval: true,
        expected_result: "New pods become Ready and latency falls without increasing database pressure.",
        rollback: "Return deployment to previous replica count when the temporary action expires.",
        runbook: "scale-deployment-within-policy"
      }
    ];
  }
  return [
    {
      id: "collect-diagnostics",
      action: "Collect Kubernetes events, workload state, and relevant Prometheus evidence.",
      risk: "low" as const,
      requires_approval: false,
      expected_result: "Enough context is available for a safe human decision.",
      rollback: "No rollback needed; read-only diagnostic action.",
      runbook: "collect-pod-diagnostics"
    }
  ];
}
