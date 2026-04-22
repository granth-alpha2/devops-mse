# Deployment Guide

## Prerequisites

- Docker & Docker Compose
- Kubernetes cluster (v1.24+)
- kubectl CLI
- Terraform (v1.0+)
- AWS CLI configured
- Node.js 18+

## Local Development (Docker Compose)

### Quick Start

```bash
# Clone repository
git clone <repo-url>
cd netflix-devops

# Build images
docker-compose build

# Start services
docker-compose up -d

# Verify services
docker-compose ps
```

### Access Services

```
Frontend:    http://localhost:3000
Backend:     http://localhost:5000
Auth:        http://localhost:5001
Video:       http://localhost:5002
Prometheus:  http://localhost:9090
Grafana:     http://localhost:3001 (admin/admin)
MongoDB:     localhost:27017 (admin:password)
```

### Stopping Services

```bash
docker-compose down
docker-compose down -v  # Also remove volumes
```

## Development Setup

### 1. Frontend Development

```bash
cd frontend
npm install
npm start

# In another terminal
npm run build
```

### 2. Backend Development

```bash
cd backend
npm install

# Create .env file
cp .env.example .env

# Start development server
npm run dev
```

### 3. Testing

```bash
# Run all tests
npm test

# Run with coverage
npm test -- --coverage

# Watch mode
npm test -- --watch
```

## Kubernetes Deployment

### Prerequisites

```bash
# Create S3 buckets and DynamoDB table for Terraform
aws s3 mb s3://netflix-devops-terraform-state --region us-east-1
aws dynamodb create-table \
  --table-name netflix-terraform-locks \
  --attribute-definitions AttributeName=LockID,AttributeType=S \
  --key-schema AttributeName=LockID,KeyType=HASH \
  --provisioned-throughput ReadCapacityUnits=5,WriteCapacityUnits=5
```

### Step 1: Provision Infrastructure with Terraform

```bash
cd terraform

# Initialize
terraform init

# Create terraform.tfvars
cat > terraform.tfvars <<EOF
aws_region = "us-east-1"
cluster_name = "netflix-devops"
EOF

# Plan
terraform plan

# Apply
terraform apply

# Get outputs
terraform output
```

### Step 2: Configure kubectl

```bash
aws eks update-kubeconfig \
  --region us-east-1 \
  --name netflix-devops-cluster

# Verify
kubectl cluster-info
kubectl get nodes
```

### Step 3: Deploy Applications

```bash
# Create namespace and apply all resources
kubectl apply -f k8s/backend-deployment.yaml
kubectl apply -f k8s/auth-deployment.yaml
kubectl apply -f k8s/video-deployment.yaml
kubectl apply -f k8s/frontend-deployment.yaml
kubectl apply -f k8s/mongodb-statefulset.yaml
kubectl apply -f k8s/ingress-network.yaml

# Verify deployments
kubectl get deployments -n netflix-devops
kubectl get pods -n netflix-devops
kubectl get services -n netflix-devops
```

### Step 4: Deploy Monitoring

```bash
kubectl apply -f monitoring/k8s-monitoring.yaml

# Access Grafana
kubectl port-forward -n monitoring svc/grafana 3000:3000
```

## CI/CD Pipeline

### GitHub Actions Setup

#### 1. Create Secrets

```bash
# Docker registry credentials
DOCKER_USERNAME=<your-username>
DOCKER_PASSWORD=<your-token>

# AWS credentials
AWS_ACCESS_KEY_ID=<key>
AWS_SECRET_ACCESS_KEY=<secret>

# Kubernetes config (base64 encoded)
KUBE_CONFIG=$(cat ~/.kube/config | base64)

# Docker registry for deployments
REGISTRY=<registry-url>
```

#### 2. Push to GitHub

```bash
git remote add origin <github-url>
git push -u origin main
```

The CI/CD pipeline will automatically:
1. Run tests
2. Build Docker images
3. Push to registry
4. Deploy to Kubernetes
5. Run smoke tests

### Manual Deployment

```bash
# Trigger workflow via GitHub CLI
gh workflow run deploy-k8s.yml -f environment=production
```

## Production Checklist

### Pre-Deployment

- [ ] All tests passing
- [ ] Code reviewed and approved
- [ ] Security scan passed
- [ ] Terraform validated
- [ ] Backup created
- [ ] Rollback plan documented

### Deployment

- [ ] Deploy to staging first
- [ ] Run integration tests
- [ ] Monitor error rates & latency
- [ ] Check logs for errors
- [ ] Verify all pods running

### Post-Deployment

- [ ] Smoke tests passed
- [ ] Users can access service
- [ ] Metrics normal
- [ ] No alerts triggered
- [ ] Document deployment

## Common Issues

### Pods not starting

```bash
# Check pod status
kubectl describe pod <pod-name> -n netflix-devops

# View logs
kubectl logs <pod-name> -n netflix-devops
```

### Database connection issues

```bash
# Wait for MongoDB to be ready
kubectl wait --for=condition=ready pod -l app=mongodb -n netflix-devops --timeout=300s

# Connect to MongoDB
kubectl exec -it mongodb-0 -n netflix-devops -- mongosh -u admin -p password
```

### Service not accessible

```bash
# Check service
kubectl get svc -n netflix-devops

# Port forward
kubectl port-forward svc/netflix-backend 5000:5000 -n netflix-devops

# Test endpoint
curl http://localhost:5000/healthz
```

## Scaling

### Manual Scaling

```bash
# Scale backend to 5 replicas
kubectl scale deployment netflix-backend --replicas=5 -n netflix-devops

# Check HPA status
kubectl get hpa -n netflix-devops
```

### Auto-Scaling Configuration

Edit HPA in k8s manifests:

```yaml
spec:
  minReplicas: 3
  maxReplicas: 10
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        averageUtilization: 70
```

## Monitoring & Alerts

### Access Dashboards

```bash
# Prometheus
kubectl port-forward -n monitoring svc/prometheus 9090:9090

# Grafana
kubectl port-forward -n monitoring svc/grafana 3000:3000
```

### Check Metrics

```bash
# Pod resource usage
kubectl top pods -n netflix-devops

# Node resource usage
kubectl top nodes
```

## Rollback

### Kubernetes Rollback

```bash
# View rollout history
kubectl rollout history deployment/netflix-backend -n netflix-devops

# Rollback to previous version
kubectl rollout undo deployment/netflix-backend -n netflix-devops

# Rollback to specific revision
kubectl rollout undo deployment/netflix-backend --to-revision=2 -n netflix-devops
```

## Cleanup

### Remove All Resources

```bash
# Delete Kubernetes resources
kubectl delete namespace netflix-devops

# Destroy infrastructure
cd terraform
terraform destroy
```

## Support

For issues or questions:
1. Check logs: `kubectl logs -f deployment/<name> -n netflix-devops`
2. Check events: `kubectl get events -n netflix-devops`
3. Review alerts in Grafana
4. Check AWS CloudWatch logs
