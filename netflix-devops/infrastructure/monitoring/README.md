# Monitoring Configuration

Prometheus, Grafana, and alerting setup for the Netflix application.

## Files

- `prometheus.yml` - Prometheus scrape configuration
- `alerts.yml` - Alert rules
- `k8s-monitoring.yaml` - Kubernetes monitoring deployment

## Prometheus

Scrapes metrics from all services at `/metrics` endpoint.

### Configuration

- Target: All service endpoints
- Scrape interval: 15 seconds
- Retention: 15 days

### Starting Prometheus

```bash
docker run -p 9090:9090 -v $(pwd)/prometheus.yml:/etc/prometheus/prometheus.yml \
  prom/prometheus
```

Access at `http://localhost:9090`

## Grafana

Visualization and dashboarding.

### Starting Grafana

```bash
docker run -p 3000:3000 grafana/grafana
```

Default credentials: `admin/admin`

### Adding Data Source

- URL: `http://prometheus:9090`
- Type: Prometheus

### Available Dashboards

- Service health and uptime
- Request latency and throughput
- Error rates
- Resource utilization

## Alerts

Alert rules defined in `alerts.yml`:

- High error rate (>5%)
- Service down
- High latency (>1s)
- High CPU usage (>80%)
- High memory usage (>85%)

## Key Metrics

- `requests_total` - Total requests
- `request_duration_seconds` - Request latency
- `errors_total` - Error count
- `node_cpu_usage` - CPU utilization
- `node_memory_usage` - Memory utilization

## Kubernetes Deployment

```bash
kubectl apply -f k8s-monitoring.yaml
```

Creates:
- Prometheus StatefulSet
- Grafana Deployment
- ConfigMaps for configuration
- Services for access

## Accessing Dashboards

After Kubernetes deployment:

```bash
# Port forward Prometheus
kubectl port-forward svc/prometheus 9090:9090

# Port forward Grafana
kubectl port-forward svc/grafana 3000:3000
```

Then visit:
- Prometheus: `http://localhost:9090`
- Grafana: `http://localhost:3000`

## Custom Metrics

Add service-specific metrics in application code:

```javascript
const prometheus = require('prom-client');
const counter = new prometheus.Counter({
  name: 'custom_metric_name',
  help: 'Metric description'
});
```

## Alerting

Configure notification channels in Grafana:
- Email
- Slack
- PagerDuty
- Webhook

## Retention Policy

- Prometheus: 15 days retention
- Grafana: No limit (depends on database)
- Archive old metrics for long-term analysis

## Troubleshooting

```bash
# Check Prometheus targets
curl http://localhost:9090/api/v1/targets

# Query metrics
curl 'http://localhost:9090/api/v1/query?query=up'
```

## References

- [Prometheus Docs](https://prometheus.io/docs)
- [Grafana Docs](https://grafana.com/docs)
- [Alert Rules Best Practices](https://prometheus.io/docs/prometheus/latest/configuration/alerting_rules/)
