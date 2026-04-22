# Netflix DevOps - Architecture Overview

## System Architecture

### Microservices Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Load Balancer (ALB)                     │
└──────────────────────┬──────────────────────────────────────┘
                       │
        ┌──────────────┼──────────────┐
        │              │              │
   ┌────▼────┐ ┌──────▼──────┐ ┌────▼──────┐
   │ Frontend│ │  Backend    │ │Auth Service│
   │ (React) │ │(API Gateway)│ │  (JWT)    │
   └────┬────┘ └──────┬──────┘ └────┬──────┘
        │             │             │
        │       ┌─────▼─────┐       │
        │       │Video      │       │
        │       │Service    │       │
        │       └─────┬─────┘       │
        │             │             │
        └─────────────┼─────────────┘
                      │
       ┌──────────────┼──────────────┐
       │              │              │
   ┌───▼───┐  ┌──────▼──────┐ ┌────▼────┐
   │MongoDB│  │Cache(Redis) │ │  S3     │
   │       │  │             │ │(Storage)│
   └───────┘  └─────────────┘ └─────────┘
```

## Key Components

### 1. Frontend (React)
- **Port**: 3000
- **Responsibilities**:
  - User interface
  - Video browsing and search
  - Video player
  - User authentication UI
- **Features**:
  - Responsive design
  - Real-time updates
  - State management
  - Error handling

### 2. Backend API Gateway
- **Port**: 5000
- **Responsibilities**:
  - Route requests to microservices
  - Request validation
  - Response aggregation
  - Rate limiting
- **Features**:
  - REST API
  - Health checks
  - Metrics exposure
  - Graceful shutdown

### 3. Auth Service
- **Port**: 5001
- **Responsibilities**:
  - User registration
  - Login/logout
  - JWT token generation
  - Token validation
- **Features**:
  - Password hashing (bcrypt)
  - Token refresh
  - Email verification
  - Session management

### 4. Video Service
- **Port**: 5002
- **Responsibilities**:
  - Video metadata management
  - Streaming URLs
  - Search and filtering
  - View count tracking
- **Features**:
  - Adaptive bitrate
  - CDN integration
  - Transcoding status
  - Recommendations

### 5. Database Layer
- **MongoDB**: User data and metadata
- **Redis**: Caching and sessions
- **S3**: Video storage
- **Elasticsearch**: Full-text search (optional)

## Data Flow

### User Login
```
1. Frontend → Backend (POST /api/auth/login)
2. Backend → Auth Service (validate credentials)
3. Auth Service → MongoDB (lookup user)
4. Auth Service → Backend (return JWT)
5. Backend → Frontend (return token)
6. Frontend (store token in localStorage)
```

### Video Streaming
```
1. Frontend → Backend (GET /api/videos)
2. Backend → Video Service (fetch metadata)
3. Video Service → MongoDB (query videos)
4. Video Service → Backend (return list)
5. Backend → Frontend (render list)
6. User clicks play
7. Frontend → Video Service (GET /videos/:id)
8. Video Service → S3 (get streaming URL)
9. Frontend initiates HLS/DASH stream
```

## Kubernetes Architecture

### Deployments
- **Frontend**: 2-5 replicas (LoadBalancer)
- **Backend**: 3-10 replicas (ClusterIP)
- **Auth**: 2-5 replicas (ClusterIP)
- **Video**: 3-15 replicas (ClusterIP)
- **MongoDB**: 1 StatefulSet replica

### Auto-Scaling
- **CPU Target**: 70% average utilization
- **Memory Target**: 80% average utilization
- **Min Replicas**: Service dependent
- **Max Replicas**: 5-15 depending on service

### Ingress
```
netflix.local/              → Frontend
netflix.local/api/*         → Backend
netflix.local/api/auth/*    → Auth Service
netflix.local/api/videos/*  → Video Service
```

## Security Architecture

### Network Security
- **VPC**: Isolated network (10.0.0.0/16)
- **Public Subnets**: Load Balancer
- **Private Subnets**: Services & Databases
- **Security Groups**: Minimal permissions
- **Network Policies**: Pod-to-pod rules

### Data Security
- **Encryption in Transit**: HTTPS/TLS
- **Encryption at Rest**: RDS encrypted
- **Secrets Management**: AWS Secrets Manager
- **API Keys**: Rotated regularly
- **CORS**: Restricted origins

### Authentication & Authorization
- **Auth Method**: JWT tokens
- **Token Expiry**: 7 days (configurable)
- **Refresh Tokens**: Supported
- **User Roles**: Basic (free/premium)
- **Scope-based Access**: API-level

## Monitoring & Observability

### Metrics Collection
- **Prometheus**: 15-second intervals
- **Metrics Exported**:
  - HTTP request rate/latency
  - Error rates
  - Database connection pool
  - Container resource usage
  - Pod restart counts

### Dashboards
1. **System Overview**: Cluster health
2. **Application**: Request metrics
3. **Database**: Query performance
4. **Kubernetes**: Pod/node status

### Alerting
- **High Error Rate**: > 5% for 5 minutes
- **High Latency**: p99 > 1000ms
- **Memory**: > 90% for 5 minutes
- **Service Down**: Unreachable for 2+ minutes
- **Pod Crashes**: Any crash loops

## Deployment Strategy

### Blue-Green Deployment
- Maintain two identical environments
- Switch traffic atomically
- Instant rollback capability
- Zero downtime updates

### Canary Deployment
- Route 1% traffic to new version
- Monitor error rates
- Gradually increase to 100%
- Automatic rollback on errors

### Rolling Update (Default)
- Update pods gradually
- Maintain service uptime
- 1 max surge, 0 unavailable
- Health checks validated

## Performance Optimization

### Frontend
- Code splitting
- Lazy loading
- CDN distribution
- Service workers

### Backend
- Horizontal scaling (HPA)
- Database indexing
- Redis caching
- API rate limiting

### Network
- HTTP/2 multiplexing
- Gzip compression
- Connection pooling
- Load balancing

## Disaster Recovery

### Backup Strategy
- Database: Daily snapshots
- Code: Git version control
- Secrets: Encrypted backup
- Config: Infrastructure as Code

### Recovery Plans
- **RPO**: 24 hours
- **RTO**: < 1 hour
- **Runbooks**: Documented procedures
- **Testing**: Quarterly drills

## Cost Optimization

### Resource Allocation
- **Frontend**: 64-256 Mi RAM, 50-250m CPU
- **Backend**: 128-512 Mi RAM, 100-500m CPU
- **Video**: 150-512 Mi RAM, 100-500m CPU
- **RDS**: db.t3.micro (dev) → db.r6g.xlarge (prod)

### Cost Drivers
- EC2 instance types/count
- Data transfer
- Database storage
- EBS volumes
- ALB fees

## Compliance & Security

- ✅ HTTPS/TLS encryption
- ✅ GDPR compliant data handling
- ✅ Regular security audits
- ✅ Vulnerability scanning
- ✅ Access logging
- ✅ Secrets encryption
