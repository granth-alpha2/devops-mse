# Video Service

Video management and streaming microservice.

## Overview

Handles video uploads, metadata, streaming URLs, and video content management.

## Quick Start

```bash
npm install
npm run dev
```

Server runs on `http://localhost:3002`

## Structure

```
src/
├── index.js           # Server entry point
├── middleware/        # Auth, logger, prometheus middleware
├── models/            # Video schema
└── routes/            # Video API endpoints

tests/                 # Unit tests
```

## API Endpoints

- `GET /api/videos` - List videos
- `GET /api/videos/:id` - Get video details
- `POST /api/videos` - Create video metadata
- `PUT /api/videos/:id` - Update video
- `DELETE /api/videos/:id` - Delete video
- `GET /api/videos/:id/stream` - Stream video

## Environment Variables

```
PORT=3002
MONGODB_URI=mongodb://localhost:27017/netflix
```

## Testing

```bash
npm test
npm run test:coverage
```

## Development

```bash
npm run dev      # Start with live reload
```

## Monitoring

Prometheus metrics at `/metrics`

## Service Integration

Provides video data to Backend and Frontend services via REST API.
