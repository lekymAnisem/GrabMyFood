# Security Hardening

- Keep `agent.automaticRemediation=false` until observation, alerting, approvals, locking, verification, and RBAC have been tested.
- Store API tokens, Alertmanager shared secrets, model keys, and database passwords outside Git.
- Prefer AWS Secrets Manager plus External Secrets Operator for production.
- Do not grant `cluster-admin`, wildcard verbs, Secret value reads, namespace deletion, PVC/PV deletion, RBAC modification, or unrestricted patch permissions.
- Route permanent changes through GitOps and Argo CD.
- Require TLS for ingress, Prometheus, Grafana, notification webhooks, and PostgreSQL.
- Keep high-risk runbooks approval-only.
- Log evidence and decisions, but redact passwords, tokens, credentials, SQL parameters, PII, and payment data.
- Rate-limit remediation and stop execution when Prometheus data is unavailable.
