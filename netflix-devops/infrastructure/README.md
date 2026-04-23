# Infrastructure

This directory contains all infrastructure-as-code and deployment configurations.

## Structure

- **docker/**: Docker images and build configurations
- **kubernetes/**: Kubernetes manifests and deployments
- **terraform/**: Infrastructure provisioning (AWS, EKS, RDS, etc.)
- **monitoring/**: Prometheus, Grafana, and alerting configurations
- **ci-cd/**: GitHub Actions and deployment pipelines

## Quick Start

### 1. Docker Builds

```bash
cd docker
docker-compose build
docker-compose up
```

### 2. Kubernetes Deployment

```bash
cd kubernetes
kubectl apply -f .
```

### 3. Terraform Infrastructure

```bash
cd terraform
terraform init
terraform plan
terraform apply
```

### 4. Monitoring Setup

```bash
cd monitoring
kubectl apply -f k8s-monitoring.yaml
```

## Prerequisites

- Docker & Docker Compose
- kubectl
- Terraform
- AWS CLI (for cloud deployments)

See individual directory READMEs for detailed instructions.
