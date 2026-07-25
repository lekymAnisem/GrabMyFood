import { Incident } from "../types/incident.js";

export class IncidentStore {
  private readonly incidents = new Map<string, Incident>();

  list(): Incident[] {
    return [...this.incidents.values()].sort((a, b) => b.timestamp.localeCompare(a.timestamp));
  }

  get(id: string): Incident | undefined {
    return this.incidents.get(id);
  }

  save(incident: Incident): Incident {
    this.incidents.set(incident.incident_id, incident);
    return incident;
  }

  update(id: string, patch: Partial<Incident>): Incident {
    const existing = this.incidents.get(id);
    if (!existing) throw new Error(`Incident not found: ${id}`);
    const next = { ...existing, ...patch };
    this.incidents.set(id, next);
    return next;
  }
}
