export type IncidentSeverity = "info" | "warning" | "critical";
export type IncidentStatus =
  | "detected"
  | "investigating"
  | "waiting_for_approval"
  | "remediating"
  | "resolved"
  | "failed";

export interface Evidence {
  source: "prometheus" | "kubernetes" | "alertmanager" | "grafana" | "agent";
  query?: string;
  resource?: string;
  value?: unknown;
  summary: string;
}

export interface RecommendedAction {
  id: string;
  action: string;
  risk: "low" | "medium" | "high";
  requires_approval: boolean;
  expected_result: string;
  rollback: string;
  runbook?: string;
}

export interface Incident {
  incident_id: string;
  timestamp: string;
  severity: IncidentSeverity;
  cluster: string;
  namespace: string;
  affected_services: string[];
  summary: string;
  observations: string[];
  likely_root_causes: Array<{
    cause: string;
    confidence: number;
    evidence: Evidence[];
  }>;
  recommended_actions: RecommendedAction[];
  automatic_action: {
    allowed: boolean;
    runbook: string | null;
    reason: string;
  };
  verification_queries: string[];
  status: IncidentStatus;
}
