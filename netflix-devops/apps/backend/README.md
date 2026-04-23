# Backend Service

Main API backend microservice for the Netflix DevOps application.

## Overview

Core business logic service handling video listings, user data, and orchestration between other services.

## Quick Start

```bash
npm install
npm run dev
```

Server runs on `http://localhost:3000`

## Structure

```
src/
├── index.js           # Server entry point
├── middleware/        # Auth, logger, prometheus middleware
├── models/            # Data models (User, Video)
└── routes/            # API endpoints

tests/                 # Unit and integration tests
config/               # Service configuration
```

## API Endpoints

- `GET /api/videos` - List all videos
- `GET /api/videos/:id` - Get video details
- `POST /api/videos` - Create video
- `PUT /api/videos/:id` - Update video
- `DELETE /api/videos/:id` - Delete video
- `GET /api/health` - Health check

## Environment Variables

See `.env.example` in project root.

## Testing

```bash
npm test
npm run test:coverage
```

## Development

```bash
npm run dev      # Start with live reload
npm run watch    # Watch for changes
```

## Production Build

```bash
npm run build
npm start
```

## Monitoring

Prometheus metrics: `/metrics`
Health status: `/api/health`

## Communication with Other Services

- Auth Service: Validates JWT tokens
- Video Service: Retrieves video information
- Frontend: REST API queries

## Dependencies

See `package.json` for complete list.
