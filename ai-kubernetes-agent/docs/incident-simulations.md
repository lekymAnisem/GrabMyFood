# Incident Simulations

Send a CrashLoop alert payload:

```bash
curl -X POST http://localhost:8080/webhooks/alertmanager \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer replace-with-strong-webhook-secret' \
  --data @examples/alertmanager-crashloop.json
```

Approve a recommended action:

```bash
curl -X POST http://localhost:8080/incidents/inc-id/approve \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer replace-with-strong-token' \
  -H 'x-agent-role: approver' \
  -H 'x-agent-subject: sre@example.com' \
  --data '{"actionId":"restart-unhealthy-pod","ttlSeconds":3600}'
```

Execute the approved action:

```bash
curl -X POST http://localhost:8080/incidents/inc-id/remediate \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer replace-with-strong-token' \
  -H 'x-agent-role: operator' \
  --data '{"actionId":"restart-unhealthy-pod"}'
```
