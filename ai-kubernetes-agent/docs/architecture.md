# Architecture

The agent sits after Alertmanager and before any remediation. It receives grouped alerts, collects Prometheus and Kubernetes evidence, classifies likely root causes, recommends predefined runbooks, and records every decision.

Phase 1 uses a local rule engine through the AI provider abstraction boundary. Production LLM integration should remain advisory and must never generate arbitrary executable commands.

Permanent changes follow GitOps. Temporary emergency actions may use the Kubernetes API only when explicitly permitted, approval-gated, logged, time-bound, and verified.
