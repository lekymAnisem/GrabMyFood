import { z } from "zod";

export const alertmanagerWebhookSchema = z.object({
  receiver: z.string().optional(),
  status: z.string(),
  groupLabels: z.record(z.string()).default({}),
  commonLabels: z.record(z.string()).default({}),
  commonAnnotations: z.record(z.string()).default({}),
  alerts: z.array(
    z.object({
      status: z.string(),
      labels: z.record(z.string()).default({}),
      annotations: z.record(z.string()).default({}),
      startsAt: z.string(),
      endsAt: z.string().optional(),
      generatorURL: z.string().optional(),
      fingerprint: z.string().optional()
    })
  )
});

export type AlertmanagerWebhook = z.infer<typeof alertmanagerWebhookSchema>;

export function affectedServices(payload: AlertmanagerWebhook): string[] {
  const services = new Set<string>();
  for (const alert of payload.alerts) {
    const service = alert.labels.service ?? alert.labels.deployment ?? alert.labels.job ?? alert.labels.pod;
    if (service) services.add(service);
  }
  return [...services].sort();
}
