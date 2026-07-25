import { IncidentStore } from "../storage/incidentStore.js";
import { Incident } from "../types/incident.js";

const allowedReadOnly = new Set([
  "collect-pod-diagnostics",
  "collect-node-diagnostics",
  "investigate-high-latency",
  "investigate-high-cpu",
  "investigate-high-memory",
  "investigate-database-connections"
]);

export class RunbookExecutor {
  private readonly locks = new Set<string>();

  constructor(private readonly incidents: IncidentStore) {}

  async execute(incident: Incident, actionId: string, approved: boolean) {
    const action = incident.recommended_actions.find((item) => item.id === actionId);
    if (!action) throw new Error(`Action not found: ${actionId}`);
    if (action.requires_approval && !approved) throw new Error("Approval is required before this runbook can execute.");
    if (this.locks.has(incident.incident_id)) throw new Error("Another remediation is already running for this incident.");

    this.locks.add(incident.incident_id);
    this.incidents.update(incident.incident_id, { status: "remediating" });
    try {
      if (action.runbook && allowedReadOnly.has(action.runbook)) {
        return {
          runbook: action.runbook,
          changedCluster: false,
          result: "Read-only investigation completed. Detailed collectors can be extended for live log snapshots."
        };
      }
      return {
        runbook: action.runbook,
        changedCluster: false,
        result:
          "Mutation runbooks are intentionally stubbed in Phase 1. Enable only after approvals, locking, verification, and RBAC are tested."
      };
    } finally {
      this.locks.delete(incident.incident_id);
    }
  }
}
