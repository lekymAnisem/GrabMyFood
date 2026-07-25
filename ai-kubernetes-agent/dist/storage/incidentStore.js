export class IncidentStore {
    incidents = new Map();
    list() {
        return [...this.incidents.values()].sort((a, b) => b.timestamp.localeCompare(a.timestamp));
    }
    get(id) {
        return this.incidents.get(id);
    }
    save(incident) {
        this.incidents.set(incident.incident_id, incident);
        return incident;
    }
    update(id, patch) {
        const existing = this.incidents.get(id);
        if (!existing)
            throw new Error(`Incident not found: ${id}`);
        const next = { ...existing, ...patch };
        this.incidents.set(id, next);
        return next;
    }
}
