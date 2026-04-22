# Quick Start Guide

Get the Netflix DevOps platform running in minutes!

## 5-Minute Local Setup

### Option 1: Docker Compose (Easiest)

```bash
# Clone and enter directory
git clone <repo-url>
cd netflix-devops 

# Windows one-file startup
run-app.bat
```


Or run Docker Compose manually:

```bash
docker-compose up --build -d
docker-compose ps
```

✅ **Services ready at:**
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- Prometheus: http://localhost:9090
- Grafana: http://localhost:3001 (admin/admin)

### Option 2: Local Development

```bash
# Terminal 1 - Frontend
cd frontend
npm install
npm start

# Terminal 2 - Backend (new terminal)
cd backend
npm install
cp .env.example .env
npm run dev

# Terminal 3 - Start MongoDB (new terminal)
docker run -d -p 27017:27017 \
  -e MONGO_INITDB_ROOT_USERNAME=admin \
  -e MONGO_INITDB_ROOT_PASSWORD=password \
  mongo:6.0
```

## Test the Application

### Demo Account (auto-created on backend startup)

The backend now seeds a working demo user automatically, and the frontend signs in with it on load.

**Demo credentials**
- Email: `demo@netflix.local`
- Password: `demo123`

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "demo@netflix.local",
    "password": "demo123"
  }'

# You'll get a token, save it
TOKEN="your-token-here"
```

### Get Videos
```bash
curl http://localhost:5000/api/videos \
  -H "Authorization: Bearer $TOKEN"
```

### Check Health
```bash
curl http://localhost:5000/healthz
```

## Kubernetes Deployment (30 minutes)

### Prerequisites
- AWS account
- AWS CLI configured
- Docker installed
- kubectl installed
- Terraform installed

### Step 1: Setup Infrastructure

```bash
cd terraform

# Create terraform.tfvars
cat > terraform.tfvars <<EOF
aws_region = "us-east-1"
cluster_name = "netflix-devops"
node_group_desired_size = 3
EOF

# Deploy
terraform init
terraform plan
terraform apply
```

### Step 2: Configure kubectl

```bash
aws eks update-kubeconfig \
  --region us-east-1 \
  --name netflix-devops-cluster
```

### Step 3: Deploy Apps

```bash
# Apply all manifests
kubectl create namespace netflix-devops

# Secrets and configs
kubectl apply -f k8s/backend-deployment.yaml
kubectl apply -f k8s/auth-deployment.yaml
kubectl apply -f k8s/video-deployment.yaml
kubectl apply -f k8s/frontend-deployment.yaml
kubectl apply -f k8s/mongodb-statefulset.yaml

# Wait for deployment
kubectl rollout status deployment/netflix-backend -n netflix-devops

# Get service URL
kubectl get svc netflix-frontend -n netflix-devops
```

### Step 4: Access Application

```bash
# Port forward to access
kubectl port-forward svc/netflix-frontend 3000:80 -n netflix-devops

# Open browser
open http://localhost:3000
```

## Docker Compose Commands

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Remove volumes (clean slate)
docker-compose down -v

# Rebuild images
docker-compose build

# Run specific service
docker-compose up backend
```

## Useful Commands

### Frontend (React)
```bash
cd frontend

npm start           # Development server
npm run build      # Production build
npm test          # Run tests
npm run lint      # Check code style
```

### Backend (Node.js)
```bash
cd backend

npm run dev       # Development with auto-reload
npm start        # Production
npm test         # Run tests
npm run lint     # Check code style
```

### Kubernetes
```bash
# Monitor pods
kubectl get pods -n netflix-devops -w

# View logs
kubectl logs -f deployment/netflix-backend -n netflix-devops

# Scale service
kubectl scale deployment netflix-backend --replicas=5 -n netflix-devops

# Restart service
kubectl rollout restart deployment/netflix-backend -n netflix-devops

# Check resources
kubectl top pods -n netflix-devops
```

### Monitoring

Access metrics:
```bash
# Prometheus Queries
# http://localhost:9090

# Common queries:
# rate(http_requests_total[5m])
# histogram_quantile(0.95, rate(http_request_duration_ms_bucket[5m]))
```

Access dashboards:
```bash
# Grafana
# http://localhost:3001
# User: admin
# Password: admin
```

## Troubleshooting

### Pods not starting?
```bash
# Check pod status
kubectl describe pod <pod-name> -n netflix-devops

# View logs
kubectl logs <pod-name> -n netflix-devops
```

### Cannot connect to database?
```bash
# Wait for MongoDB
kubectl wait --for=condition=ready pod -l app=mongodb -n netflix-devops --timeout=300s

# Check connection
kubectl exec -it <pod> -n netflix-devops -- mongosh mongodb://admin:password@mongodb:27017/test
```

### Frontend not loading?
```bash
# Check frontend pod
kubectl logs deployment/netflix-frontend -n netflix-devops

# Check API connectivity
curl -I http://netflix-backend:5000/healthz
```

See [TROUBLESHOOTING.md](docs/TROUBLESHOOTING.md) for more solutions.

## Next Steps

1. **Explore Code**: Check out each service in their respective directories
2. **Read Docs**: Review [ARCHITECTURE.md](docs/ARCHITECTURE.md)
3. **Study DevOps**: Learn about Kubernetes, Docker, CI/CD
4. **Deploy**: Use the deployment guide to deploy to production
5. **Monitor**: Set up alerts in Grafana
6. **Contribute**: Follow [CONTRIBUTING.md](docs/CONTRIBUTING.md)

## Project Structure

```
netflix-devops/
├── frontend/           React web app
├── backend/            Main API service
├── auth-service/       Authentication microservice
├── video-service/      Video streaming microservice
├── docker/             Dockerfiles for all services
├── k8s/                Kubernetes manifests
├── terraform/          AWS infrastructure (IaC)
├── monitoring/         Prometheus & Grafana config
├── .github/workflows/  CI/CD pipelines
├── docs/              Documentation
└── docker-compose.yml  Local development
```

## Key Features

✅ Microservices architecture
✅ Containerized with Docker
✅ Orchestrated with Kubernetes
✅ Infrastructure as Code (Terraform)
✅ Automated CI/CD (GitHub Actions)
✅ Monitoring & Alerting
✅ Auto-scaling
✅ Zero downtime deployments
✅ Health checks
✅ Graceful shutdown

## Resources

- **Documentation**: See [docs/](docs/) folder
- **API Docs**: [docs/API.md](docs/API.md)
- **Architecture**: [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)
- **Deployment**: [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md)
- **Troubleshooting**: [docs/TROUBLESHOOTING.md](docs/TROUBLESHOOTING.md)

## Support

- 📖 Read the docs
- 🐛 Report bugs on GitHub Issues
- 💬 Join discussions
- 📧 Email support@example.com

---

**Happy learning! 🚀**

Start with Docker Compose → Learn concepts → Deploy to Kubernetes → Master DevOps!
