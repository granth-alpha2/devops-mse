# Configuration

Centralized configuration management for the project.

## Files

- **.env.example**: Template for environment variables
- **docker-compose.yml**: Docker Compose configuration
- **services.config.json**: Service discovery and configuration

## Setup

1. Copy `.env.example` to `.env`
2. Update values for your environment
3. Each service can override with service-specific config in `apps/<service>/config/`

## Environment Management

- **development**: Local development settings
- **staging**: Staging environment settings
- **production**: Production settings
