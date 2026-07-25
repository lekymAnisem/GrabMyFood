import pino from "pino";
import { createServer } from "./api/server.js";
import { IncidentAnalyzer } from "./analysis/analyzer.js";
import { ApprovalStore } from "./approvals/approvalStore.js";
import { AuditLog } from "./audit/auditLog.js";
import { config } from "./config/index.js";
import { KubernetesReader } from "./kubernetes/client.js";
import { Notifier } from "./notifications/notifier.js";
import { PrometheusClient } from "./prometheus/client.js";
import { RunbookExecutor } from "./remediation/runbookExecutor.js";
import { IncidentStore } from "./storage/incidentStore.js";

const logger = pino({ level: process.env.LOG_LEVEL ?? "info" });
const incidents = new IncidentStore();
const audit = new AuditLog(logger);
const analyzer = new IncidentAnalyzer(new PrometheusClient(config.PROMETHEUS_URL), new KubernetesReader());
const approvals = new ApprovalStore();
const runbooks = new RunbookExecutor(incidents);
const notifier = new Notifier(config.NOTIFICATION_WEBHOOK_URL);

const app = createServer({ analyzer, incidents, approvals, audit, runbooks, notifier, logger });

app.listen(config.PORT, () => {
  logger.info({ port: config.PORT, mode: config.AGENT_MODE, cluster: config.CLUSTER_NAME }, "AI Kubernetes agent listening");
});
