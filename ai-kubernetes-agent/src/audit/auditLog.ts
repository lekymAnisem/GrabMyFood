import pino from "pino";

export interface AuditRecord {
  incidentId?: string;
  alertSource?: string;
  agentVersion: string;
  modelName: string;
  recommendation?: unknown;
  runbookId?: string;
  riskLevel?: string;
  approvalStatus?: "requested" | "approved" | "rejected" | "expired" | "not_required";
  approver?: string;
  actionExecuted?: string;
  parameters?: unknown;
  result?: unknown;
  timestamp: string;
}

export class AuditLog {
  private readonly records: AuditRecord[] = [];

  constructor(private readonly logger: pino.Logger) {}

  write(record: Omit<AuditRecord, "timestamp">) {
    const entry = { ...record, timestamp: new Date().toISOString() };
    this.records.push(entry);
    this.logger.info({ audit: sanitize(entry) }, "audit record written");
    return entry;
  }

  list() {
    return [...this.records];
  }
}

function sanitize(value: unknown): unknown {
  return JSON.parse(
    JSON.stringify(value, (key, item) => {
      if (/secret|token|password|credential|authorization/i.test(key)) return "[redacted]";
      return item;
    })
  );
}
