import { describe, expect, it } from "vitest";
import { affectedServices, alertmanagerWebhookSchema } from "../src/alerts/alertmanager.js";

describe("Alertmanager webhook parsing", () => {
  it("extracts affected services from deployment labels", () => {
    const payload = alertmanagerWebhookSchema.parse({
      status: "firing",
      alerts: [
        {
          status: "firing",
          startsAt: "2026-07-22T00:00:00Z",
          labels: { deployment: "payment-service" },
          annotations: {}
        }
      ]
    });

    expect(affectedServices(payload)).toEqual(["payment-service"]);
  });
});
