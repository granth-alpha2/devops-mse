# Scripts

Utility scripts for development, deployment, and maintenance.

## Available Scripts

- **setup.sh**: Initial project setup
- **build.sh**: Build all services
- **deploy.sh**: Deploy to Kubernetes
- **health-check.sh**: Check service health
- **logs.sh**: Aggregate logs from all services

## Usage

```bash
./scripts/setup.sh
./scripts/build.sh
./scripts/deploy.sh
```

## Requirements

- Bash shell
- Docker
- kubectl (for Kubernetes operations)
- jq (for JSON processing)
