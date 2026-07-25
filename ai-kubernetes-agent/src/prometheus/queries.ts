export const promql = {
  podCpuByService:
    'sum by (pod) (rate(container_cpu_usage_seconds_total{namespace="$namespace",container!="",pod=~"$workload.*"}[5m]))',
  cpuAgainstRequest:
    'sum by (pod) (rate(container_cpu_usage_seconds_total{namespace="$namespace",container!="",pod=~"$workload.*"}[5m])) / sum by (pod) (kube_pod_container_resource_requests{namespace="$namespace",resource="cpu",pod=~"$workload.*"})',
  cpuThrottling:
    'sum by (pod) (rate(container_cpu_cfs_throttled_periods_total{namespace="$namespace",pod=~"$workload.*"}[5m])) / sum by (pod) (rate(container_cpu_cfs_periods_total{namespace="$namespace",pod=~"$workload.*"}[5m]))',
  memoryWorkingSet:
    'sum by (pod) (container_memory_working_set_bytes{namespace="$namespace",container!="",pod=~"$workload.*"})',
  memoryAgainstLimit:
    'sum by (pod) (container_memory_working_set_bytes{namespace="$namespace",container!="",pod=~"$workload.*"}) / sum by (pod) (kube_pod_container_resource_limits{namespace="$namespace",resource="memory",pod=~"$workload.*"})',
  podRestarts:
    'increase(kube_pod_container_status_restarts_total{namespace="$namespace",pod=~"$workload.*"}[15m])',
  unavailableReplicas:
    'kube_deployment_status_replicas_unavailable{namespace="$namespace",deployment="$workload"}',
  pendingPods:
    'kube_pod_status_phase{namespace="$namespace",phase="Pending"}',
  http5xxRate:
    'sum(rate(http_requests_total{namespace="$namespace",status=~"5..",service=~"$service"}[5m])) / clamp_min(sum(rate(http_requests_total{namespace="$namespace",service=~"$service"}[5m])), 1)',
  http4xxRate:
    'sum(rate(http_requests_total{namespace="$namespace",status=~"4..",service=~"$service"}[5m])) / clamp_min(sum(rate(http_requests_total{namespace="$namespace",service=~"$service"}[5m])), 1)',
  latencyP95:
    'histogram_quantile(0.95, sum by (le, service) (rate(http_request_duration_seconds_bucket{namespace="$namespace",service=~"$service"}[5m])))',
  latencyP99:
    'histogram_quantile(0.99, sum by (le, service) (rate(http_request_duration_seconds_bucket{namespace="$namespace",service=~"$service"}[5m])))',
  hpaReplicas:
    'kube_horizontalpodautoscaler_status_desired_replicas{namespace="$namespace"}',
  dbConnections:
    'pg_stat_activity_count{datname!~"template.*"} / pg_settings_max_connections',
  pvUtilization:
    'kubelet_volume_stats_used_bytes{namespace="$namespace"} / kubelet_volume_stats_capacity_bytes{namespace="$namespace"}'
};

export function renderQuery(template: string, vars: Record<string, string>): string {
  return Object.entries(vars).reduce((query, [key, value]) => query.replaceAll(`$${key}`, value), template);
}
