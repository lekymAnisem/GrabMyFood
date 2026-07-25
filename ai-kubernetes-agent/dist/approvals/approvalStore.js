import { randomUUID } from "node:crypto";
export class ApprovalStore {
    approvals = new Map();
    create(input) {
        const createdAt = new Date();
        const approval = {
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
    isApproved(incidentId, actionId) {
        const approval = this.approvals.get(`${incidentId}:${actionId}`);
        if (!approval || approval.status !== "approved")
            return false;
        return new Date(approval.expiresAt).getTime() > Date.now();
    }
}
