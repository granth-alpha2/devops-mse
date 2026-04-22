# Troubleshooting Guide

## Common Issues & Solutions

### 1. Pods Not Starting

#### Symptoms
- Pods stuck in `Pending` or `CrashLoopBackOff` state
- Error messages in pod description

#### Diagnosis
```bash
# Check pod status
kubectl describe pod <pod-name> -n netflix-devops

# View logs
kubectl logs <pod-name> -n netflix-devops

# Previous logs (if crashed)
kubectl logs <pod-name> --previous -n netflix-devops
```

#### Solutions

**Not enough resources:**
```bash
# Check node capacity
kubectl describe nodes

# Free up resources or add more nodes
```

**Image not found:**
```bash
# Check image name/tag
kubectl describe pod <pod-name> -n netflix-devops

# Pull image manually to verify
docker pull <image>

# Check docker credentials if using private registry
kubectl create secret docker-registry regcred \
  --docker-server=docker.io \
  --docker-username=<username> \
  --docker-password=<password>
```

**Database connection failed:**
```bash
# Wait for MongoDB
kubectl wait --for=condition=ready pod -l app=mongodb -n netflix-devops --timeout=300s

# Check MongoDB logs
kubectl logs mongodb-0 -n netflix-devops

# Verify connection string
kubectl describe deployment <service> -n netflix-devops | grep MONGODB_URI
```

### 2. Service Not Accessible

#### Diagnosis
```bash
# Check service status
kubectl get svc -n netflix-devops

# Check endpoints
kubectl get endpoints -n netflix-devops

# Check pod selector
kubectl get pods \
  -l app=<service> \
  -n netflix-devops
```

#### Solutions

**No endpoints:**
```bash
# Pod labels may not match selector
# Check Deployment selector matches pod labels
kubectl describe deployment <name> -n netflix-devops

# Fix by updating labels or selector
```

**Network connectivity:**
```bash
# Test from another pod
kubectl run -it --rm debug --image=busybox --restart=Never \
  -n netflix-devops -- sh

# Inside pod
wget http://netflix-backend:5000/healthz
```

**Ingress not working:**
```bash
# Check Ingress status
kubectl describe ingress netflix-ingress -n netflix-devops

# Verify Ingress Controller installed
kubectl get pods -n ingress-nginx

# Check DNS resolution
nslookup netflix.local
```

### 3. Database Connection Issues

#### MongoDB Connection Failed

```bash
# Check if MongoDB is running
kubectl get statefulset mongodb -n netflix-devops

# Connect to MongoDB pod
kubectl exec -it mongodb-0 -n netflix-devops -- mongosh

# Verify credentials
mongosh -u admin -p password --authenticationDatabase admin

# Check connection from service pod
kubectl exec -it <pod> -n netflix-devops -- \
  mongosh mongodb://admin:password@mongodb:27017/test
```

#### Connection Pool Exhausted

```bash
# Check pod metrics
kubectl top pods -n netflix-devops

# Increase connection pool in application config
# Increase MongoDB resources if needed
kubectl scale statefulset mongodb --replicas=3 -n netflix-devops
```

### 4. High CPU/Memory Usage

#### Diagnosis
```bash
# Check resource usage
kubectl top pods -n netflix-devops
kubectl top nodes

# Check resource limits
kubectl describe deployment <name> -n netflix-devops | grep -A 5 "Limits"
```

#### Solutions

**Increase resource limits:**
```bash
# Edit deployment
kubectl edit deployment <name> -n netflix-devops

# Update resources section:
# resources:
#   limits:
#     cpu: 1000m
#     memory: 1Gi
```

**Optimize application:**
- Check for memory leaks
- Profile CPU usage
- Optimize database queries
- Enable caching

**Add more replicas:**
```bash
kubectl scale deployment <name> --replicas=5 -n netflix-devops
```

### 5. Persistent Volume Issues

#### PVC Stuck in Pending

```bash
# Check PVC status
kubectl get pvc -n netflix-devops
kubectl describe pvc <pvc-name> -n netflix-devops

# Check storage class
kubectl get storageclass

# Create if missing
kubectl apply -f - <<EOF
apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata:
  name: ebs-sc
provisioner: ebs.csi.aws.com
EOF
```

### 6. Certificate/HTTPS Issues

#### SSL Certificate Error

```bash
# Check certificate
kubectl get certificate -n netflix-devops

# Check cert-manager
kubectl get pods -n cert-manager

# Recreate certificate
kubectl delete certificate <name> -n netflix-devops
kubectl apply -f cert.yaml -n netflix-devops
```

### 7. DNS Issues

#### Host Resolution Failing

```bash
# Test DNS from pod
kubectl run -it --rm debug --image=busybox --restart=Never \
  -- nslookup netflix-backend.netflix-devops.svc.cluster.local

# Check CoreDNS
kubectl logs -l k8s-app=kube-dns -n kube-system

# Restart CoreDNS if needed
kubectl rollout restart deployment coredns -n kube-system
```

### 8. Network Policy Issues

#### Traffic Blocked

```bash
# Check network policies
kubectl get networkpolicy -n netflix-devops
kubectl describe networkpolicy <name> -n netflix-devops

# Test connectivity
kubectl run -it --rm debug --image=busybox --restart=Never \
  -n netflix-devops -- wget http://netflix-backend:5000/healthz

# If blocked, examine policy rules
```

### 9. Deployment Stuck During Update

#### Rollout Stuck

```bash
# Check rollout status
kubectl rollout status deployment/<name> -n netflix-devops

# Check pod events
kubectl describe pod <pod> -n netflix-devops

# Force rollback if needed
kubectl rollout undo deployment/<name> -n netflix-devops
```

### 10. Application Errors

#### 500 Internal Server Error

```bash
# Check application logs
kubectl logs -f deployment/<name> -n netflix-devops

# Stream multiple pods
kubectl logs -f deployment/<name> -n netflix-devops --all-containers=true

# Describe pod for events
kubectl describe pod <pod> -n netflix-devops
```

#### Authentication Failures

```bash
# Check JWT secret
kubectl get secret netflix-secrets -n netflix-devops -o jsonpath='{.data.jwt-secret}' | base64 -d

# Verify token
curl -X POST http://localhost:5001/auth/verify \
  -H "Authorization: Bearer <token>"
```

## Debugging Tools

### kubectl Debug Pod

```bash
# Attach to running pod
kubectl debug <pod> -n netflix-devops -it --image=busybox

# Or create debug pod
kubectl debug <pod> --image=debian
```

### Port Forwarding

```bash
# Forward local port to pod
kubectl port-forward pod/<name> 5000:5000 -n netflix-devops

# Access at localhost:5000
curl http://localhost:5000
```

### Exec into Pod

```bash
kubectl exec -it <pod> -n netflix-devops -- /bin/bash
```

### Get Resources

```bash
# All resources
kubectl get all -n netflix-devops

# Specific type with details
kubectl get deployment -n netflix-devops -o wide

# In YAML format
kubectl get pod <name> -n netflix-devops -o yaml
```

## Performance Debugging

### Memory Leaks

```bash
# Monitor memory over time
watch 'kubectl top pods -n netflix-devops | grep <service>'

# If growing, check application logs
kubectl logs -f deployment/<name> -n netflix-devops
```

### High Latency

```bash
# Check API metrics
curl http://prometheus:9090/api/v1/query?query=rate(http_request_duration_ms_bucket[5m])

# Check database slow queries
kubectl logs -f pod/mongodb-0 -n netflix-devops | grep "slow query"
```

## Log Aggregation

### View Logs from All Pods

```bash
# All pods in namespace
kubectl logs -f deployment/<name> -n netflix-devops --all-containers=true

# With timestamps
kubectl logs -f deployment/<name> -n netflix-devops --timestamps=true

# Previous pod logs
kubectl logs <pod> --previous -n netflix-devops
```

## Recovery Procedures

### Pod Keeps Crashing

```bash
1. Check logs: kubectl logs <pod> -n netflix-devops
2. Check events: kubectl describe pod <pod> -n netflix-devops
3. Check resource limits: kubectl describe deployment <name> -n netflix-devops
4. Rollback: kubectl rollout undo deployment/<name> -n netflix-devops
5. Scale down: kubectl scale deployment/<name> --replicas=1 -n netflix-devops
```

### Service Unavailable

```bash
1. Check endpoints: kubectl get endpoints <service> -n netflix-devops
2. Check pod status: kubectl get pods -l app=<service> -n netflix-devops
3. Restart deployment: kubectl rollout restart deployment/<name> -n netflix-devops
4. Check ingress: kubectl describe ingress <name> -n netflix-devops
```

### Database Corruption

```bash
1. Backup data: kubectl exec mongodb-0 -n netflix-devops -- mongodump
2. Restart MongoDB: kubectl rollout restart statefulset/mongodb -n netflix-devops
3. If persists, restore from backup:
   - Scale down: kubectl scale statefulset mongodb --replicas=0
   - Delete PVC: kubectl delete pvc/mongodb-storage-mongodb-0
   - Scale up: kubectl scale statefulset mongodb --replicas=1
```

## Contact Support

- GitHub Issues: Report bugs and request features
- Slack: Join #netflix-devops for discussion
- Email: devops@example.com for urgent issues
