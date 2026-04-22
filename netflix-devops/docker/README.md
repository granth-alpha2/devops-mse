# Netflix DevOps - Docker Build Configuration

## Building Individual Services

### Build Frontend
```bash
docker build -f docker/Dockerfile.frontend -t netflix-frontend:latest ./frontend
```

### Build Backend
```bash
docker build -f docker/Dockerfile.backend -t netflix-backend:latest ./backend
```

### Build Auth Service
```bash
docker build -f docker/Dockerfile.auth -t netflix-auth:latest ./auth-service
```

### Build Video Service
```bash
docker build -f docker/Dockerfile.video -t netflix-video:latest ./video-service
```

## Running with Docker Compose

### Start all services
```bash
docker-compose up -d
```

### View logs
```bash
docker-compose logs -f
```

### Stop all services
```bash
docker-compose down
```

### Remove volumes (clean slate)
```bash
docker-compose down -v
```

## Accessing Services

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **Auth Service**: http://localhost:5001
- **Video Service**: http://localhost:5002
- **MongoDB**: localhost:27017 (user: admin, pass: password)
- **Prometheus**: http://localhost:9090
- **Grafana**: http://localhost:3001 (admin/admin)

## Image Registry

Push to Docker Hub or ECR:

```bash
# Login
docker login

# Tag
docker tag netflix-backend:latest your-registry/netflix-backend:v1

# Push
docker push your-registry/netflix-backend:v1
```
