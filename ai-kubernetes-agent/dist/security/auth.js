import { config } from "../config/index.js";
const roleRank = {
    viewer: 0,
    operator: 1,
    approver: 2,
    administrator: 3
};
export function requireRole(role) {
    return (req, res, next) => {
        const auth = req.header("authorization");
        const expected = config.AUTH_TOKEN;
        if (!expected) {
            req.actor = { role: "administrator", subject: "local-dev" };
            return next();
        }
        if (!auth?.startsWith("Bearer ") || auth.slice(7) !== expected) {
            return res.status(401).json({ error: "unauthorized" });
        }
        const headerRole = (req.header("x-agent-role") ?? "viewer");
        if (!(headerRole in roleRank) || roleRank[headerRole] < roleRank[role]) {
            return res.status(403).json({ error: "forbidden", requiredRole: role });
        }
        req.actor = { role: headerRole, subject: req.header("x-agent-subject") ?? "api-user" };
        next();
    };
}
export function verifyAlertmanagerSecret(req, res, next) {
    if (!config.ALERTMANAGER_SHARED_SECRET)
        return next();
    const bearer = req.header("authorization")?.startsWith("Bearer ")
        ? req.header("authorization")?.slice(7)
        : undefined;
    if (req.header("x-alertmanager-secret") !== config.ALERTMANAGER_SHARED_SECRET && bearer !== config.ALERTMANAGER_SHARED_SECRET) {
        return res.status(401).json({ error: "invalid alertmanager secret" });
    }
    next();
}
