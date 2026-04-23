# Docker Configuration

Docker images and build files for all services.

## Files

- `Dockerfile.auth` - Auth service container
- `Dockerfile.backend` - Backend service container
- `Dockerfile.frontend` - Frontend service container
- `Dockerfile.video` - Video service container

## Building Images

### Build All Services

```bash
docker-compose build
```

### Build Specific Service

```bash
docker build -f Dockerfile.auth -t netflix/auth-service:latest .
```

## Running Containers

### Using Docker Compose

```bash
docker-compose up -d
docker-compose logs -f
docker-compose down
```

### Docker CLI

```bash
docker run -p 3001:3001 netflix/auth-service:latest
```

## Image Tags

- `latest` - Latest version
- `dev` - Development build
- `v1.0.0` - Specific version

## Best Practices

- Keep images minimal
- Use Alpine base images when possible
- Set health checks
- Use multi-stage builds
- Never hardcode secrets

## Pushing to Registry

```bash
docker tag netflix/auth-service:latest <registry>/auth-service:latest
docker push <registry>/auth-service:latest
```

## Docker Compose Services

- auth-service
- backend
- frontend
- video-service
- mongodb
- prometheus
- grafana

See `docker-compose.yml` for configuration.
