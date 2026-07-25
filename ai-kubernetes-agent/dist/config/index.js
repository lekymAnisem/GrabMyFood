import { readFileSync } from "node:fs";
import { z } from "zod";
const envSchema = z.object({
    NODE_ENV: z.string().default("development"),
    PORT: z.coerce.number().int().positive().default(8080),
    AGENT_VERSION: z.string().default("0.1.0"),
    AGENT_MODE: z.enum(["observe", "recommend", "approval-required", "limited-auto"]).default("recommend"),
    AUTOMATIC_REMEDIATION: z.coerce.boolean().default(false),
    AWS_REGION: z.string().default("ap-southeast-2"),
    AWS_ACCOUNT_ID: z.string().default("919651863390"),
    CLUSTER_NAME: z.string().default("GrabMyFood-production"),
    KUBERNETES_NAMESPACE: z.string().default("gourmet-flow"),
    PROMETHEUS_URL: z.string().url().default("http://localhost:9090"),
    GRAFANA_URL: z.string().url().optional(),
    ALERTMANAGER_SHARED_SECRET: z.string().optional(),
    ALERTMANAGER_SHARED_SECRET_FILE: z.string().optional(),
    AUTH_TOKEN: z.string().optional(),
    AUTH_TOKEN_FILE: z.string().optional(),
    DATABASE_URL: z.string().optional(),
    MODEL_PROVIDER: z.enum(["disabled", "openai-compatible"]).default("disabled"),
    MODEL_NAME: z.string().default("local-rule-engine"),
    OPENAI_API_KEY: z.string().optional(),
    OPENAI_API_KEY_FILE: z.string().optional(),
    NOTIFICATION_WEBHOOK_URL: z.string().url().optional()
});
function fileValue(path) {
    if (!path)
        return undefined;
    return readFileSync(path, "utf8").trim();
}
const parsed = envSchema.parse(process.env);
export const config = {
    ...parsed,
    ALERTMANAGER_SHARED_SECRET: parsed.ALERTMANAGER_SHARED_SECRET ?? fileValue(parsed.ALERTMANAGER_SHARED_SECRET_FILE),
    AUTH_TOKEN: parsed.AUTH_TOKEN ?? fileValue(parsed.AUTH_TOKEN_FILE),
    OPENAI_API_KEY: parsed.OPENAI_API_KEY ?? fileValue(parsed.OPENAI_API_KEY_FILE)
};
