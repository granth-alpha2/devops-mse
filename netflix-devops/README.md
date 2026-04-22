# Netflix-Style Streaming Platform with DevOps

A scalable, microservices-based video streaming platform with full DevOps infrastructure, automated CI/CD pipelines, and Kubernetes orchestration.

## 🎯 Overview

This project demonstrates enterprise-level DevOps practices for a Netflix-like streaming service:

- **Microservices Architecture**: Independent, scalable services
- **Containerization**: Docker for consistent deployment
- **Orchestration**: Kubernetes for auto-scaling and self-healing
- **CI/CD**: GitHub Actions for automated testing and deployment
- **Infrastructure as Code**: Terraform for AWS resources
- **Monitoring & Logging**: Prometheus, Grafana, and ELK Stack
- **Zero Downtime Deployment**: Rolling updates and health checks

## 📁 Project Structure

```
netflix-devops/
├── frontend/              # React web application
├── backend/               # API gateway & main service
├── auth-service/          # JWT authentication service
├── video-service/         # Video streaming service
├── docker/                # Dockerfile configurations
├── k8s/                   # Kubernetes manifests
├── terraform/             # AWS infrastructure
├── monitoring/            # Prometheus & Grafana configs
├── .github/workflows/     # CI/CD pipelines
└── docs/                  # Documentation
```

## 🚀 Quick Start

### Prerequisites
- Docker
- Kubernetes (minikube for local dev)
- Terraform
- Node.js 18+
- Git

### Local Development

1. **Clone and Setup**
```bash
cd netflix-devops
npm install
docker-compose up -d
```

2. **Start Services**
```bash
# Terminal 1: Frontend
cd frontend && npm start

# Terminal 2: Backend
cd backend && npm start

# Terminal 3: Auth Service
cd auth-service && npm start

# Terminal 4: Video Service
cd video-service && npm start
```

3. **Access Application**
- Frontend: http://localhost:3000
- API: http://localhost:5000
- Monitoring: http://localhost:3001 (Grafana)

## ☸️ Kubernetes Deployment

### Deploy to Minikube
```bash
minikube start
kubectl apply -f k8s/
kubectl port-forward svc/netflix-frontend 3000:3000
```

### Deploy to AWS
```bash
cd terraform
terraform init
terraform plan
terraform apply
kubectl apply -f k8s/
```

## 🔄 CI/CD Pipeline

The GitHub Actions pipeline:
1. Runs linting and tests
2. Builds Docker images
3. Pushes to registry
4. Deploys to Kubernetes
5. Runs smoke tests

Push any branch and watch the pipeline in `.github/workflows/`

## 📊 Monitoring

### Prometheus
- Metrics: http://localhost:9090
- Queries performance and availability

### Grafana  
- Dashboards: http://localhost:3001
- Visualize system health

### ELK Stack
- Elasticsearch: Search and analyze logs
- Kibana: Log visualization

## 🔐 Security

- HTTPS/TLS encryption
- JWT authentication
- Kubernetes secrets for sensitive data
- Network policies for pod isolation
- Rate limiting and DDoS protection

## 📈 Features

✅ User authentication & authorization
✅ Video browsing and discovery
✅ Streaming with adaptive bitrate
✅ Auto-scaling (0-1000 pods)
✅ Self-healing infrastructure
✅ Zero downtime deployments
✅ Real-time monitoring
✅ Centralized logging
✅ Disaster recovery
✅ Cost optimization

## 💡 DevOps Concepts Demonstrated

- **Containerization**: Docker services
- **Orchestration**: Kubernetes (Deployments, StatefulSets, Services)
- **IaC**: Terraform AWS resources
- **CI/CD**: GitHub Actions pipelines
- **Monitoring**: Prometheus + Grafana
- **Logging**: ELK Stack
- **Auto-scaling**: HPA (Horizontal Pod Autoscaler)
- **Service Mesh**: Optional Istio integration
- **GitOps**: ArgoCD for continuous deployment

## 📚 Documentation

- [Architecture](docs/ARCHITECTURE.md)
- [Deployment Guide](docs/DEPLOYMENT.md)
- [Troubleshooting](docs/TROUBLESHOOTING.md)
- [API Documentation](docs/API.md)

## 👥 Contributing

1. Create a feature branch
2. Make changes
3. Push and create PR
4. CI/CD pipeline validates
5. Merge and auto-deploy

## 📄 License

MIT
