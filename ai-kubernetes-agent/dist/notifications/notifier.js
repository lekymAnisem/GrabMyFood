export class Notifier {
    webhookUrl;
    fetchImpl;
    constructor(webhookUrl, fetchImpl = fetch) {
        this.webhookUrl = webhookUrl;
        this.fetchImpl = fetchImpl;
    }
    async sendIncident(incident) {
        if (!this.webhookUrl)
            return { sent: false, reason: "No notification webhook configured" };
        const message = {
            severity: incident.severity,
            affected_service: incident.affected_services.join(", "),
            current_symptom: incident.summary,
            likely_cause: incident.likely_root_causes[0]?.cause,
            supporting_evidence: incident.likely_root_causes[0]?.evidence.map((item) => item.summary),
            recommended_action: incident.recommended_actions[0]?.action,
            incident_id: incident.incident_id
        };
        const response = await this.fetchImpl(this.webhookUrl, {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify(message)
        });
        return { sent: response.ok, status: response.status };
    }
}
