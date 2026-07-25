export function dashboardLinks(baseUrl?: string) {
  if (!baseUrl) return {};
  return {
    executive: `${baseUrl}/d/grabmyfood-exec/executive-overview`,
    workloads: `${baseUrl}/d/grabmyfood-workloads/kubernetes-workloads`,
    application: `${baseUrl}/d/grabmyfood-app/application-performance`,
    database: `${baseUrl}/d/grabmyfood-db/database`,
    incidents: `${baseUrl}/d/grabmyfood-ai/ai-incidents`
  };
}
