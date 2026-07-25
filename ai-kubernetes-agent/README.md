# AI Kubernetes Monitoring Agent

Production-oriented starter for the GrabMyFood AI monitoring, incident-analysis, and remediation agent.

The default deployment is safe: `agent.mode=recommend` and `automaticRemediation=false`. Phase 1 observes, correlates alerts, gathers Prometheus and Kubernetes evidence, creates incident JSON, exposes metrics, and records audit events. Cluster mutation runbooks are present as policy definitions but intentionally not active in the TypeScript executor.

## Architecture

```mermaid
flowchart TD
  Apps[GrabMyFood services in gourmet-flow] --> SM[ServiceMonitor and exporters]
  K8s[Kubernetes events and workload state] --> Prom[Prometheus]
  SM --> Prom
  Prom --> Rules[PrometheusRule alerts]
  Rules --> AM[Alertmanager]
  AM --> Agent[AI monitoring agent webhook]
  Agent --> Prom
  Agent --> K8sApi[Kubernetes API]
  Agent --> Audit[Audit log / PostgreSQL]
  Agent --> Notify[Slack, Teams, Email, PagerDuty, Webhook]
  Agent --> Grafana[Grafana dashboards and annotations]
  Agent --> Human[Human approval]
  Human --> Agent
  Agent --> GitOps[Git branch and pull request]
  GitOps --> Argo[Argo CD]
  Argo --> K8s
```

## Repository Structure

- `src/`: TypeScript Express API, analyzers, clients, audit, approvals, and runbook executor.
- `runbooks/`: Predefined runbook policies. The model never executes arbitrary shell commands.
- `prometheus/`: PrometheusRule resources for Kubernetes, app, database, and monitoring health alerts.
- `dashboards/`: Importable Grafana dashboards.
- `helm-chart/`: Kubernetes deployment, RBAC, NetworkPolicy, PDB, ServiceMonitor, and agent alerts.
- `db/schema.sql`: PostgreSQL schema for persistent incidents, approvals, and audit records.
- `alertmanager/`: Webhook routing example.
- `examples/`: Example incident simulations.

## Phase 1 Deploy To GrabMyFood-production

1. Build and push the image:

```bash
docker build -t 919651863390.dkr.ecr.ap-southeast-2.amazonaws.com/grabmyfood-ai-kubernetes-agent:0.1.0 .
aws ecr get-login-password --region ap-southeast-2 | docker login --username AWS --password-stdin 919651863390.dkr.ecr.ap-southeast-2.amazonaws.com
docker push 919651863390.dkr.ecr.ap-southeast-2.amazonaws.com/grabmyfood-ai-kubernetes-agent:0.1.0
```

2. Create runtime secrets outside Git:

```bash
kubectl create namespace ai-agent
kubectl -n ai-agent create secret generic ai-kubernetes-agent-secrets \
  --from-literal=api-token='replace-with-strong-token' \
  --from-literal=alertmanager-secret='replace-with-strong-webhook-secret'
```

3. Install the chart:

```bash
helm upgrade --install ai-agent ./helm-chart \
  --namespace ai-agent \
  --set agent.mode=recommend \
  --set agent.automaticRemediation=false
```

4. Apply alert rules:

```bash
kubectl apply -f prometheus/
```

5. Configure Alertmanager with `alertmanager/alertmanager-route-example.yaml`, mounting the same shared secret as bearer credentials.

## Verify

```bash
kubectl -n ai-agent rollout status deploy/ai-agent-ai-kubernetes-agent
kubectl -n ai-agent port-forward svc/ai-agent-ai-kubernetes-agent 8080:8080
curl http://localhost:8080/health
curl http://localhost:8080/ready
curl http://localhost:8080/metrics
curl -H 'Authorization: Bearer replace-with-strong-token' -H 'x-agent-role: viewer' http://localhost:8080/incidents
curl -X POST http://localhost:8080/webhooks/alertmanager \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer replace-with-strong-webhook-secret' \
  --data @examples/alertmanager-crashloop.json
```

## Safe Operating Model

Use phases:

1. Observation: alert intake, incident correlation, read-only evidence, notifications, audit.
2. Recommendations: runbook matching, risk classification, rollback guidance.
3. Approval workflow: explicit approver, action ID, expiration, audit.
4. Limited auto: only after tests, locking, verification, and RBAC are proven.
5. GitOps automation: permanent changes go through PR review and Argo CD.

Never allow automatic namespace, Deployment, StatefulSet, PVC, PV, database, IAM, security group, or arbitrary command changes.

## API

- `POST /webhooks/alertmanager`
- `GET /incidents`
- `GET /incidents/:id`
- `POST /incidents/:id/investigate`
- `POST /incidents/:id/approve`
- `POST /incidents/:id/reject`
- `POST /incidents/:id/remediate`
- `POST /incidents/:id/verify`
- `GET /runbooks`
- `GET /health`
- `GET /ready`
- `GET /metrics`

Approval and remediation endpoints require bearer auth plus an `x-agent-role` of `operator`, `approver`, or `administrator` as appropriate.

## GitOps Workflow

Permanent changes must be made in Git:

1. Agent prepares evidence and recommended Helm values change.
2. Human approves.
3. Agent creates a branch.
4. Agent updates Helm values.
5. Agent opens a pull request with incident evidence and rollback notes.
6. Human reviews and merges.
7. Argo CD syncs the desired state.
8. Agent verifies the incident metrics.

## Local Development

```bash
npm install
npm run dev
```

Run tests:

```bash
npm test
```
