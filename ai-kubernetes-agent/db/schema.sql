CREATE TABLE IF NOT EXISTS incidents (
  incident_id text PRIMARY KEY,
  payload jsonb NOT NULL,
  status text NOT NULL,
  severity text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS approvals (
  approval_id text PRIMARY KEY,
  incident_id text NOT NULL REFERENCES incidents(incident_id),
  action_id text NOT NULL,
  approver text NOT NULL,
  status text NOT NULL CHECK (status IN ('approved', 'rejected', 'expired')),
  created_at timestamptz NOT NULL DEFAULT now(),
  expires_at timestamptz NOT NULL
);

CREATE TABLE IF NOT EXISTS audit_records (
  audit_id bigserial PRIMARY KEY,
  incident_id text,
  agent_version text NOT NULL,
  model_name text NOT NULL,
  runbook_id text,
  risk_level text,
  approval_status text,
  approver text,
  action_executed text,
  record jsonb NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS audit_records_incident_idx ON audit_records (incident_id);
CREATE INDEX IF NOT EXISTS incidents_status_idx ON incidents (status);
