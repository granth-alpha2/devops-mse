# Project Structure

A comprehensive guide to the Netflix DevOps project organization.

## Directory Layout

```
netflix-devops/
├── apps/                          # All microservices and client applications
│   ├── auth-service/              # Authentication service
│   │   ├── src/
│   │   │   ├── index.js
│   │   │   ├── middleware/
│   │   │   ├── models/
│   │   │   └── routes/
│   │   ├── tests/
│   │   ├── config/
│   │   └── package.json
│   ├── backend/                   # Main API service
│   │   ├── src/
│   │   ├── tests/
│   │   ├── config/
│   │   └── package.json
│   ├── frontend/                  # React frontend
│   │   ├── src/
│   │   │   ├── components/
│   │   │   ├── pages/
│   │   │   ├── hooks/
│   │   │   └── utils/
│   │   ├── tests/
│   │   └── package.json
│   └── video-service/             # Video management service
│       ├── src/
│       ├── tests/
│       └── package.json
│
├── infrastructure/                # Infrastructure and deployment
│   ├── docker/                    # Docker build configurations
│   │   ├── Dockerfile.auth
│   │   ├── Dockerfile.backend
│   │   ├── Dockerfile.frontend
│   │   └── Dockerfile.video
│   ├── kubernetes/                # K8s manifests
│   │   ├── auth-deployment.yaml
│   │   ├── backend-deployment.yaml
│   │   ├── frontend-deployment.yaml
│   │   ├── video-deployment.yaml
│   │   ├── mongodb-statefulset.yaml
│   │   ├── ingress-network.yaml
│   │   └── README.md
│   ├── terraform/                 # IaC for AWS/cloud
│   │   ├── main.tf
│   │   ├── eks.tf
│   │   ├── rds.tf
│   │   ├── vpc.tf
│   │   ├── load_balancer.tf
│   │   ├── variables.tf
│   │   ├── outputs.tf
│   │   └── README.md
│   ├── monitoring/                # Prometheus, Grafana, alerts
│   │   ├── prometheus.yml
│   │   ├── alerts.yml
│   │   ├── k8s-monitoring.yaml
│   │   └── README.md
│   ├── ci-cd/                     # Deployment pipelines
│   │   └── workflows/
│   └── README.md
│
├── tests/                         # Integration and E2E tests
│   ├── integration/
│   └── README.md
│
├── scripts/                       # Utility and automation scripts
│   ├── setup.sh
│   ├── build.sh
│   ├── deploy.sh
│   └── README.md
│
├── config/                        # Centralized configuration
│   ├── .env.example
│   └── README.md
│
├── docs/                          # Project documentation
│   ├── API.md
│   ├── ARCHITECTURE.md
│   ├── CONTRIBUTING.md
│   ├── DEPLOYMENT.md
│   ├── TROUBLESHOOTING.md
│   └── README.md
│
├── .github/                       # GitHub-specific configs
│   └── workflows/                 # GitHub Actions CI/CD
│
├── .gitignore
├── .dockerignore
├── .env.example
├── docker-compose.yml
├── package.json (root)
├── README.md
├── STRUCTURE.md                   # This file
├── QUICKSTART.md
├── PROJECT_SUMMARY.md
└── run-app.bat
```

## Key Principles

### 1. **Separation of Concerns**
- Applications in `apps/`
- Infrastructure in `infrastructure/`
- Tests in dedicated `tests/` directory

### 2. **Consistency**
- All services follow the same structure
- Shared configuration patterns
- Unified scripts and tooling

### 3. **Scalability**
- Easy to add new services
- Clear dependencies
- Modular infrastructure code

### 4. **Development**
- Each service is independently runnable
- Local development with Docker Compose
- CI/CD ready

## Common Tasks

### Add a New Service

1. Create `apps/new-service/`
2. Follow structure of existing services
3. Add to `docker-compose.yml`
4. Create Kubernetes manifests in `infrastructure/kubernetes/`
5. Add Terraform configuration if needed

### Deploy Changes

```bash
./scripts/build.sh
./scripts/deploy.sh
```

### Check Application Health

```bash
./scripts/health-check.sh
```

### View All Logs

```bash
./scripts/logs.sh
```

## Environment Configuration

- Copy `.env.example` to `.env`
- Update values for your environment
- Each service can override with local config

## Next Steps

- Read [README.md](README.md) for project overview
- Check [QUICKSTART.md](QUICKSTART.md) for getting started
- Review [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) for system design
- See [infrastructure/README.md](infrastructure/README.md) for deployment
