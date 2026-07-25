import express from "express";
import helmet from "helmet";
import { pinoHttp } from "pino-http";
import client from "prom-client";
import { z } from "zod";
import { alertmanagerWebhookSchema } from "../alerts/alertmanager.js";
import { config } from "../config/index.js";
import { requireRole, verifyAlertmanagerSecret } from "../security/auth.js";
export function createServer(deps) {
    const app = express();
    const registry = new client.Registry();
    client.collectDefaultMetrics({ register: registry });
    const alertsReceived = new client.Counter({ name: "ai_agent_alerts_received_total", help: "Alertmanager alerts received" });
    const incidentsCreated = new client.Counter({ name: "ai_agent_incidents_created_total", help: "Incidents created" });
    const actionsExecuted = new client.Counter({ name: "ai_agent_actions_executed_total", help: "Runbook actions executed" });
    registry.registerMetric(alertsReceived);
    registry.registerMetric(incidentsCreated);
    registry.registerMetric(actionsExecuted);
    app.use(helmet());
    app.use(express.json({ limit: "1mb" }));
    app.use(pinoHttp({ logger: deps.logger }));
    app.get("/health", (_req, res) => res.json({ ok: true }));
    app.get("/ready", (_req, res) => res.json({ ready: true, mode: config.AGENT_MODE }));
    app.get("/metrics", async (_req, res) => {
        res.setHeader("content-type", registry.contentType);
        res.send(await registry.metrics());
    });
    app.post("/webhooks/alertmanager", verifyAlertmanagerSecret, async (req, res, next) => {
        try {
            const payload = alertmanagerWebhookSchema.parse(req.body);
            alertsReceived.inc(payload.alerts.length);
            const incident = await deps.analyzer.analyze(payload);
            deps.incidents.save(incident);
            incidentsCreated.inc();
            deps.audit.write({
                incidentId: incident.incident_id,
                alertSource: "alertmanager",
                agentVersion: config.AGENT_VERSION,
                modelName: config.MODEL_NAME,
                recommendation: incident.recommended_actions,
                approvalStatus: "not_required"
            });
            await deps.notifier.sendIncident(incident);
            res.status(202).json(incident);
        }
        catch (error) {
            next(error);
        }
    });
    app.get("/incidents", requireRole("viewer"), (_req, res) => res.json(deps.incidents.list()));
    app.get("/incidents/:id", requireRole("viewer"), (req, res) => {
        const incident = deps.incidents.get(req.params.id);
        if (!incident)
            return res.status(404).json({ error: "not found" });
        res.json(incident);
    });
    app.post("/incidents/:id/investigate", requireRole("operator"), (req, res) => {
        const incident = deps.incidents.get(req.params.id);
        if (!incident)
            return res.status(404).json({ error: "not found" });
        const updated = deps.incidents.update(req.params.id, { status: "investigating" });
        res.json(updated);
    });
    const approvalBody = z.object({ actionId: z.string(), ttlSeconds: z.number().int().positive().max(86400).default(3600) });
    app.post("/incidents/:id/approve", requireRole("approver"), (req, res) => {
        const body = approvalBody.parse(req.body);
        const approval = deps.approvals.create({
            incidentId: req.params.id,
            actionId: body.actionId,
            approver: req.actor?.subject ?? "unknown",
            status: "approved",
            ttlSeconds: body.ttlSeconds
        });
        deps.incidents.update(req.params.id, { status: "waiting_for_approval" });
        deps.audit.write({
            incidentId: req.params.id,
            agentVersion: config.AGENT_VERSION,
            modelName: config.MODEL_NAME,
            runbookId: body.actionId,
            approvalStatus: "approved",
            approver: approval.approver
        });
        res.json(approval);
    });
    app.post("/incidents/:id/reject", requireRole("approver"), (req, res) => {
        const body = approvalBody.parse(req.body);
        const approval = deps.approvals.create({
            incidentId: req.params.id,
            actionId: body.actionId,
            approver: req.actor?.subject ?? "unknown",
            status: "rejected",
            ttlSeconds: body.ttlSeconds
        });
        deps.audit.write({
            incidentId: req.params.id,
            agentVersion: config.AGENT_VERSION,
            modelName: config.MODEL_NAME,
            runbookId: body.actionId,
            approvalStatus: "rejected",
            approver: approval.approver
        });
        res.json(approval);
    });
    app.post("/incidents/:id/remediate", requireRole("operator"), async (req, res, next) => {
        try {
            const body = z.object({ actionId: z.string() }).parse(req.body);
            const incident = deps.incidents.get(req.params.id);
            if (!incident)
                return res.status(404).json({ error: "not found" });
            const approved = deps.approvals.isApproved(req.params.id, body.actionId);
            const result = await deps.runbooks.execute(incident, body.actionId, approved);
            actionsExecuted.inc();
            deps.audit.write({
                incidentId: req.params.id,
                agentVersion: config.AGENT_VERSION,
                modelName: config.MODEL_NAME,
                runbookId: body.actionId,
                actionExecuted: result.runbook,
                result
            });
            res.json(result);
        }
        catch (error) {
            next(error);
        }
    });
    app.post("/incidents/:id/verify", requireRole("operator"), (req, res) => {
        const incident = deps.incidents.get(req.params.id);
        if (!incident)
            return res.status(404).json({ error: "not found" });
        const updated = deps.incidents.update(req.params.id, { status: "resolved" });
        res.json({ status: updated.status, verification_queries: updated.verification_queries });
    });
    app.get("/runbooks", requireRole("viewer"), (_req, res) => {
        res.json([
            "restart-unhealthy-pod",
            "restart-deployment-with-approval",
            "scale-deployment-within-policy",
            "rollback-deployment-with-approval",
            "collect-pod-diagnostics",
            "collect-node-diagnostics",
            "investigate-high-latency",
            "investigate-high-cpu",
            "investigate-high-memory",
            "investigate-database-connections",
            "create-gitops-scaling-pull-request",
            "create-gitops-resource-change-pull-request"
        ]);
    });
    app.use((error, _req, res, _next) => {
        const message = error instanceof Error ? error.message : "unknown error";
        res.status(400).json({ error: message });
    });
    return app;
}
