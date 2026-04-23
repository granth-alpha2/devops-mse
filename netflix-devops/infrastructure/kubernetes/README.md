# Kubernetes Manifests

Configuration files for deploying the Netflix application to Kubernetes.

## Files

- `auth-deployment.yaml` - Auth service deployment
- `backend-deployment.yaml` - Backend service deployment
- `frontend-deployment.yaml` - Frontend service deployment
- `video-deployment.yaml` - Video service deployment
- `mongodb-statefulset.yaml` - MongoDB stateful set
- `ingress-network.yaml` - Ingress and network policies

## Deployment

### Apply All Manifests

```bash
kubectl apply -f .
```

### Apply Specific Resource

```bash
kubectl apply -f auth-deployment.yaml
```

### Check Status

```bash
kubectl get deployments
kubectl get pods
kubectl describe deployment auth-deployment
```

## Configuration

### Environment Variables

Set in deployment manifests via `env:` or ConfigMaps

### Secrets

Create secrets for sensitive data:

```bash
kubectl create secret generic app-secrets \
  --from-literal=jwt_secret=<your_secret>
```

## Scaling

```bash
kubectl scale deployment backend --replicas=3
```

## Rolling Updates

```bash
kubectl set image deployment/backend \
  backend=netflix/backend:v1.1.0
```

## Monitoring

```bash
kubectl logs <pod-name>
kubectl exec -it <pod-name> -- /bin/bash
```

## ClusterIP vs LoadBalancer

- ClusterIP: Internal service discovery
- LoadBalancer: External access (ingress)

## Ingress Configuration

Configure DNS and routing in `ingress-network.yaml`

## Prerequisites

- Kubernetes cluster running
- kubectl configured
- Docker images available in registry

## Troubleshooting

```bash
kubectl describe pod <pod-name>
kubectl logs deployment/backend
kubectl get events
```

See main [docs/DEPLOYMENT.md](../../docs/DEPLOYMENT.md) for detailed instructions.
