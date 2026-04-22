# Netflix DevOps - Kubernetes Deployment

## Prerequisites

- Kubernetes cluster (1.24+)
- kubectl CLI
- Persistent volumes availability (for MongoDB)

## Deployment Instructions

### 1. Create Namespace
```bash
kubectl apply -f k8s/backend-deployment.yaml
```

### 2. Deploy All Services
```bash
# Deploy backend
kubectl apply -f k8s/backend-deployment.yaml

# Deploy auth service
kubectl apply -f k8s/auth-deployment.yaml

# Deploy video service
kubectl apply -f k8s/video-deployment.yaml

# Deploy frontend
kubectl apply -f k8s/frontend-deployment.yaml

# Deploy MongoDB
kubectl apply -f k8s/mongodb-statefulset.yaml

# Deploy ingress and network policies
kubectl apply -f k8s/ingress-network.yaml
```

### 3. Verify Deployments
```bash
# Check pods
kubectl get pods -n netflix-devops

# Check services
kubectl get svc -n netflix-devops

# Check deployments
kubectl get deployments -n netflix-devops
```

### 4. Access Applications

#### Port forwarding (local development)
```bash
# Frontend
kubectl port-forward -n netflix-devops svc/netflix-frontend 3000:80

# Backend
kubectl port-forward -n netflix-devops svc/netflix-backend 5000:5000

# Video Service
kubectl port-forward -n netflix-devops svc/netflix-video 5002:5002

# MongoDB
kubectl port-forward -n netflix-devops svc/mongodb 27017:27017
```

#### Ingress (production)
```bash
# Update /etc/hosts
echo "127.0.0.1 netflix.local" >> /etc/hosts

# Access via ingress
curl http://netflix.local
```

## Monitoring

### Check Pod Logs
```bash
kubectl logs -n netflix-devops deployment/netflix-backend -f
kubectl logs -n netflix-devops deployment/netflix-video -f
```

### Check Events
```bash
kubectl get events -n netflix-devops --sort-by='.lastTimestamp'
```

### Describe Deployment
```bash
kubectl describe deployment netflix-backend -n netflix-devops
```

## Scaling

### Manual Scaling
```bash
kubectl scale deployment netflix-backend --replicas=5 -n netflix-devops
```

### Auto-scaling is enabled via HPA (check metrics)
```bash
kubectl get hpa -n netflix-devops
kubectl top pods -n netflix-devops
```

## Updates and Rollouts

### Check Rollout Status
```bash
kubectl rollout status deployment/netflix-backend -n netflix-devops
```

### Rollback Deployment
```bash
kubectl rollout undo deployment/netflix-backend -n netflix-devops
```

### View Rollout History
```bash
kubectl rollout history deployment/netflix-backend -n netflix-devops
```

## Cleanup

### Delete entire deployment
```bash
kubectl delete namespace netflix-devops
```

### Delete specific resource
```bash
kubectl delete deployment netflix-backend -n netflix-devops
```
