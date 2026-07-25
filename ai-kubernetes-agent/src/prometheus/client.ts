export interface PrometheusQueryResult {
  query: string;
  status: string;
  data: unknown;
}

export class PrometheusClient {
  constructor(private readonly baseUrl: string, private readonly fetchImpl: typeof fetch = fetch) {}

  async query(query: string, signal?: AbortSignal): Promise<PrometheusQueryResult> {
    const url = new URL("/api/v1/query", this.baseUrl);
    url.searchParams.set("query", query);
    const response = await this.fetchImpl(url, { signal });
    if (!response.ok) throw new Error(`Prometheus query failed: ${response.status} ${response.statusText}`);
    const body = await response.json();
    return { query, status: body.status, data: body.data };
  }

  async safeQuery(query: string, signal?: AbortSignal): Promise<PrometheusQueryResult> {
    try {
      return await this.query(query, signal);
    } catch (error) {
      return {
        query,
        status: "error",
        data: { message: error instanceof Error ? error.message : "unknown error" }
      };
    }
  }
}
