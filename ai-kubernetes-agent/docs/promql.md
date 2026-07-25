# PromQL Reference

CPU usage by Pod:

```promql
sum by (pod) (rate(container_cpu_usage_seconds_total{namespace="gourmet-flow",container!=""}[5m]))
```

CPU utilization against requests:

```promql
sum by (pod) (rate(container_cpu_usage_seconds_total{namespace="gourmet-flow",container!=""}[5m])) / sum by (pod) (kube_pod_container_resource_requests{namespace="gourmet-flow",resource="cpu"})
```

CPU throttling:

```promql
sum by (pod) (rate(container_cpu_cfs_throttled_periods_total{namespace="gourmet-flow"}[5m])) / sum by (pod) (rate(container_cpu_cfs_periods_total{namespace="gourmet-flow"}[5m]))
```

Memory working set:

```promql
sum by (pod) (container_memory_working_set_bytes{namespace="gourmet-flow",container!=""})
```

P95 latency:

```promql
histogram_quantile(0.95, sum by (le, service) (rate(http_request_duration_seconds_bucket{namespace="gourmet-flow"}[5m])))
```

5xx percentage:

```promql
sum(rate(http_requests_total{namespace="gourmet-flow",status=~"5.."}[5m])) / clamp_min(sum(rate(http_requests_total{namespace="gourmet-flow"}[5m])), 1)
```

Database connection utilization:

```promql
pg_stat_activity_count / pg_settings_max_connections
```

Persistent volume utilization:

```promql
kubelet_volume_stats_used_bytes{namespace="gourmet-flow"} / kubelet_volume_stats_capacity_bytes{namespace="gourmet-flow"}
```
