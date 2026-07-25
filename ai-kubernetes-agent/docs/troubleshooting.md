# Troubleshooting

## Agent Does Not Receive Alerts

- Confirm Alertmanager route points to `/webhooks/alertmanager`.
- Confirm the shared secret in Alertmanager matches `alertmanager-secret`.
- Check `kubectl -n ai-agent logs deploy/ai-agent-ai-kubernetes-agent`.

## Incidents Lack Prometheus Evidence

- Verify `PROMETHEUS_URL`.
- Port-forward Prometheus and run the PromQL in `docs/promql.md`.
- Confirm kube-state-metrics, node-exporter, cAdvisor, app metrics, and postgres exporter are scraped.

## Kubernetes Evidence Fails

- Confirm the service account has the read ClusterRoleBinding.
- Check that the target namespace is `gourmet-flow`.
- Verify the agent pod can reach the Kubernetes API.

## Remediation Is Refused

- Phase 1 intentionally stubs mutation runbooks.
- Confirm the action ID exists on the incident.
- Confirm approval has not expired.
- Confirm the caller has `x-agent-role: operator` for remediation and `approver` for approvals.
