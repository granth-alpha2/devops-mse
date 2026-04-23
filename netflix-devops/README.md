# 🎬 Netflix DevOps Project

A production-grade microservices architecture implementing a Netflix-like streaming application with modern DevOps best practices.

## 🏗️ Architecture

```
                    ┌──────────────┐
                    │   Frontend   │ :3000
                    │   (React)    │
                    └──────┬───────┘
                           │
                    ┌──────▼───────┐
                    │   Backend    │ :5000
                    │  (Express)   │
                    └──┬───────┬───┘
                       │       │
              ┌────────▼──┐ ┌──▼─────────┐
              │   Auth    │ │   Video    │
              │  Service  │ │  Service   │
              │   :5001   │ │   :5002    │
              └─────┬─────┘ └──┬─────────┘
                    │          │
                    └────┬─────┘
                    ┌────▼─────┐
                    │ MongoDB  │ :27017
                    └──────────┘

    Monitoring: Prometheus :9090 + Grafana :3001
```

## 🚀 Quick Start

### Prerequisites
- Node.js 16+
- Docker & Docker Compose
- kubectl (for Kubernetes deployment)
- Terraform (for infrastructure provisioning)

### Local Development

```bash
# Clone and setup
git clone <repo>
cd netflix-devops
cp .env.example .env

# Start with Docker Compose (recommended)
docker-compose up --build -d

# Or start services individually
npm install
npm run dev
```

**Access the application:**
| Service | URL |
|---------|-----|
| Frontend | http://localhost:3000 |
| Backend API | http://localhost:5000 |
| Auth Service | http://localhost:5001 |
| Video Service | http://localhost:5002 |
| Prometheus | http://localhost:9090 |
| Grafana | http://localhost:3001 |

**Demo credentials:** `demo@netflix.local` / `demo123`

## 📁 Project Structure

```
netflix-devops/
├── frontend/          # React 18 UI
├── backend/           # Express.js API gateway
├── auth-service/      # JWT authentication service
├── video-service/     # Video catalog & streaming
├── docker/            # Dockerfiles (multi-stage builds)
├── k8s/               # Kubernetes manifests
├── terraform/         # AWS infrastructure (EKS, VPC, RDS)
├── monitoring/        # Prometheus + Grafana configs
├── .github/workflows/ # CI/CD pipelines
├── docs/              # Architecture & API docs
└── docker-compose.yml # Local dev stack
```

See [STRUCTURE.md](STRUCTURE.md) for detailed organization.

## 🐳 Docker

All services use **multi-stage builds** with Alpine base images and non-root users.

```bash
docker-compose build        # Build all images
docker-compose up -d        # Start all services
docker-compose logs -f      # View logs
docker-compose down         # Stop everything
```

## ☸️ Kubernetes Deployment

```bash
# Deploy to Minikube
minikube start
kubectl apply -f k8s/
kubectl port-forward svc/netflix-frontend 3000:3000

# Deploy to AWS EKS
cd terraform && terraform init && terraform apply
aws eks update-kubeconfig --name netflix-devops-cluster --region us-east-1
kubectl apply -f k8s/
```

Features: Rolling updates, HPA auto-scaling (3-10 pods), health checks, pod disruption budgets, network policies.

See [k8s/README.md](k8s/README.md) for details.

## 🏗️ Infrastructure (Terraform)

```bash
npm run tf:init      # Initialize
npm run tf:plan      # Preview changes
npm run tf:apply     # Deploy infrastructure
npm run tf:destroy   # Tear down
```

Provisions: VPC, EKS cluster, RDS, ALB, security groups, auto-scaling.

See [terraform/README.md](terraform/README.md) for details.

## 📊 Monitoring

- **Prometheus** — Metrics collection from all services
- **Grafana** — Pre-built dashboards for request rate, latency, errors

See [monitoring/README.md](monitoring/README.md) for setup.

## 🔄 CI/CD Pipeline

GitHub Actions workflows (`.github/workflows/`):
1. **Lint & Test** — All services tested in parallel
2. **Build** — Multi-stage Docker images with BuildKit caching
3. **Push** — Container registry (GHCR)
4. **Deploy** — Kubernetes rolling deployment
5. **Security** — Trivy vulnerability scanning

## 📝 API Endpoints

```
Authentication:
  POST   /api/auth/register     # Create account
  POST   /api/auth/login        # Sign in
  GET    /api/auth/me           # Current user

Videos:
  GET    /api/videos            # List (paginated, filterable)
  GET    /api/videos/:id        # Details
  POST   /api/videos            # Create (auth required)
  PUT    /api/videos/:id        # Update (auth required)
  DELETE /api/videos/:id        # Delete (auth required)

System:
  GET    /api/health            # Health check
  GET    /healthz               # Kubernetes liveness
  GET    /readyz                # Kubernetes readiness
  GET    /metrics               # Prometheus metrics
```

Full docs: [docs/API.md](docs/API.md)

## 🔐 Security

- JWT authentication with bcrypt password hashing
- Helmet security headers
- Rate limiting (200 req/15min per IP)
- Non-root Docker containers
- Kubernetes network policies & secrets
- Trivy vulnerability scanning in CI

## 📦 Tech Stack

| Layer | Technologies |
|-------|-------------|
| Frontend | React 18, CSS3, Axios |
| Backend | Node.js, Express, MongoDB, Mongoose |
| Auth | JWT, bcrypt |
| Containers | Docker (multi-stage), Docker Compose |
| Orchestration | Kubernetes (EKS), HPA, Ingress |
| IaC | Terraform (AWS) |
| CI/CD | GitHub Actions |
| Monitoring | Prometheus, Grafana |

## 📖 Documentation

- [STRUCTURE.md](STRUCTURE.md) — Project organization
- [QUICKSTART.md](QUICKSTART.md) — Get started in 5 minutes
- [CONTRIBUTING.md](CONTRIBUTING.md) — Contributing guidelines
- [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) — System design
- [docs/API.md](docs/API.md) — API reference
- [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) — Deployment guide
- [docs/TROUBLESHOOTING.md](docs/TROUBLESHOOTING.md) — Common issues

## 🎯 Roadmap

- [ ] Redis caching layer
- [ ] Service mesh (Istio)
- [ ] Distributed tracing (Jaeger)
- [ ] Multi-region deployment
- [ ] Cost optimization dashboards

## 🤝 Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## 📄 License

MIT License

---

**Version**: 1.0.0 · **Status**: Production Ready
