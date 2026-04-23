# Auth Service

User authentication and management microservice.

## Overview

Handles user registration, login, JWT token generation, and user profile management.

## Quick Start

```bash
npm install
npm run dev
```

Server runs on `http://localhost:3001`

## Structure

```
src/
├── index.js           # Server entry point
├── middleware/        # Auth, logger, prometheus middleware
├── models/            # User schema and database models
└── routes/            # API endpoints

tests/                 # Unit and integration tests
config/               # Service configuration
```

## API Endpoints

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile

## Environment Variables

See `.env.example` in project root. Key variables:

```
JWT_SECRET=your_secret_key
JWT_EXPIRE=7d
MONGODB_URI=mongodb://localhost:27017/netflix
```

## Testing

```bash
npm test
npm run test:coverage
```

## Development

Watch for changes:
```bash
npm run watch
```

## Production Build

```bash
npm run build
npm start
```

## Monitoring

Prometheus metrics available at `/metrics`

## Dependencies

- Express.js - Web framework
- JWT - Token generation
- MongoDB - Database
- Prometheus - Metrics

See `package.json` for all dependencies.
