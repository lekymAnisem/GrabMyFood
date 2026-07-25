import { randomUUID } from "node:crypto";

export interface Approval {
  id: string;
  incidentId: string;
  actionId: string;
  approver: string;
  status: "approved" | "rejected";
  createdAt: string;
  expiresAt: string;
}

export class ApprovalStore {
  private readonly approvals = new Map<string, Approval>();

  create(input: { incidentId: string; actionId: string; approver: string; status: "approved" | "rejected"; ttlSeconds: number }) {
    const createdAt = new Date();
    const approval: Approval = {
      id: `appr-${randomUUID()}`,
      incidentId: input.incidentId,
      actionId: input.actionId,
      approver: input.approver,
      status: input.status,
      createdAt: createdAt.toISOString(),
      expiresAt: new Date(createdAt.getTime() + input.ttlSeconds * 1000).toISOString()
    };
    this.approvals.set(`${input.incidentId}:${input.actionId}`, approval);
    return approval;
  }

  isApproved(incidentId: string, actionId: string) {
    const approval = this.approvals.get(`${incidentId}:${actionId}`);
    if (!approval || approval.status !== "approved") return false;
    return new Date(approval.expiresAt).getTime() > Date.now();
  }
}
