# Monitoring Configuration

## Overview

This directory contains monitoring and observability configurations for the Netflix DevOps platform:

- **Prometheus**: Metrics collection and alerting
- **Grafana**: Visualization and dashboards
- **Alert Rules**: Predefined alerts for critical issues

## Quick Start (Docker Compose)

```bash
docker-compose up -d prometheus grafana
```

Access:
- Prometheus: http://localhost:9090
- Grafana: http://localhost:3001 (admin/admin)

## Kubernetes Deployment

```bash
kubectl apply -f monitoring/k8s-monitoring.yaml
```

### Port Forward
```bash
kubectl port-forward -n monitoring svc/prometheus 9090:9090
kubectl port-forward -n monitoring svc/grafana 3000:3000
```

## Prometheus Queries

### Key Metrics

```promql
# Request rate
rate(http_request_duration_ms_count[5m])

# Error rate
rate(http_requests_total{status=~"5.."}[5m])

# 95th percentile latency
histogram_quantile(0.95, rate(http_request_duration_ms_bucket[5m]))

# Container memory usage
container_memory_usage_bytes / 1024 / 1024

# Pod restart count
kube_pod_container_status_restarts_total
```

## Grafana Dashboards

Pre-configured dashboards:

1. **System Overview**
   - CPU, Memory, Disk usage
   - Network I/O
   - Pod count and status

2. **Application Metrics**
   - Request rate (RPS)
   - Error rate
   - Response latency (p50, p95, p99)
   - Active connections

3. **Database**
   - Connection pool usage
   - Query latency
   - Slow queries

4. **Kubernetes**
   - Cluster capacity
   - Pod resource usage
   - Deployment status

## Alerting

Alerts are configured in `alerts.yml`:

- **Application Errors**: Error rate > 5% for 5 minutes
- **High Latency**: p99 latency > 1000ms
- **Memory**: Usage > 90% for 5 minutes
- **Pod Crashes**: Restart rate > 0/hour
- **Service Down**: Service unreachable for 2+ minutes

### Receiving Alerts

Configure alertmanager to send alerts via:
- Email
- Slack
- PagerDuty
- Webhook

Example Slack webhook:
```yaml
- slack_configs:
  - api_url: https://hooks.slack.com/services/YOUR/WEBHOOK/URL
    channel: '#alerts'
```

## Metrics Collected

### Application Level
- HTTP requests per second
- Request latency
- Error rates
- Active connections
- Cache hit/miss rates

### Infrastructure Level
- CPU utilization
- Memory usage
- Disk I/O
- Network throughput
- Container counts

### Database Level
- Connection pool
- Query latency
- Index usage
- Replication lag

## Best Practices

1. **Retention**: Keep 7+ days of metrics
2. **Scrape Interval**: 15-30 seconds
3. **Alerting**: Use meaningful alert names
4. **Dashboards**: Organize by service/function
5. **Testing**: Test alerts in staging first

## Troubleshooting

### Prometheus not scraping metrics
```bash
# Check targets in Prometheus UI
http://prometheus:9090/targets
```

### Grafana not showing data
```bash
# Verify data source configuration
# Check Prometheus connectivity
```

### High storage usage
```bash
# Reduce retention time in prometheus.yml
# Use down-sampling for old metrics
```

## References

- [Prometheus Docs](https://prometheus.io/docs)
- [Grafana Docs](https://grafana.com/docs)
- [PromQL Guide](https://prometheus.io/docs/prometheus/latest/querying/basics/)
