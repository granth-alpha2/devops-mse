# API Documentation

## Base URL

- Development: `http://localhost:5000/api`
- Production: `https://api.netflix.com`

## Authentication

All endpoints (except login/signup) require a JWT token in the Authorization header:

```
Authorization: Bearer <token>
```

## Endpoints

### Authentication Service

#### Register User
```
POST /auth/signup
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword"
}

Response (201):
{
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

#### Login
```
POST /auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securepassword"
}

Response (200):
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

#### Get Current User
```
GET /auth/me
Authorization: Bearer <token>

Response (200):
{
  "id": "507f1f77bcf86cd799439011",
  "name": "John Doe",
  "email": "john@example.com",
  "subscriptionTier": "premium"
}
```

### Video Management

#### Get All Videos
```
GET /videos?page=1&limit=20&genre=action&search=matrix
Authorization: Bearer <token>

Query Parameters:
- page: Page number (default: 1)
- limit: Items per page (default: 20)
- genre: Filter by genre (optional)
- search: Search title (optional)

Response (200):
{
  "videos": [
    {
      "id": "507f1f77bcf86cd799439011",
      "title": "The Matrix",
      "description": "A hacker discovers reality is a simulation",
      "thumbnail": "https://...",
      "streamUrl": "https://...",
      "duration": 136,
      "genre": ["action", "sci-fi"],
      "rating": 8.7,
      "views": 5000000,
      "likes": 500000
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 1500,
    "pages": 75
  }
}
```

#### Get Video by ID
```
GET /videos/:id
Authorization: Bearer <token>

Response (200):
{
  "id": "507f1f77bcf86cd799439011",
  "title": "The Matrix",
  "description": "A hacker discovers reality is a simulation",
  "thumbnail": "https://...",
  "streamUrl": "https://...",
  "duration": 136,
  "genre": ["action", "sci-fi"],
  "rating": 8.7,
  "views": 5000001,
  "likes": 500000,
  "resolution": ["360p", "720p", "1080p", "4K"]
}
```

#### Get Trending Videos
```
GET /videos/trending
Authorization: Bearer <token>

Response (200):
[
  {
    "id": "507f1f77bcf86cd799439011",
    "title": "The Matrix",
    ...
  }
]
```

#### Create Video
```
POST /videos
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "New Movie",
  "description": "Amazing movie",
  "thumbnail": "https://...",
  "streamUrl": "https://...",
  "duration": 120,
  "genre": ["action"],
  "rating": 8.5,
  "uploadedBy": "507f1f77bcf86cd799439011"
}

Response (201):
{
  "id": "507f1f77bcf86cd799439012",
  "title": "New Movie",
  ...
}
```

#### Update Video
```
PUT /videos/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Updated Title",
  "rating": 8.8
}

Response (200):
{
  "id": "507f1f77bcf86cd799439011",
  "title": "Updated Title",
  ...
}
```

#### Like Video
```
POST /videos/:id/like
Authorization: Bearer <token>

Response (200):
{
  "message": "Video liked",
  "likes": 500001
}
```

## Health Checks

### Liveness Probe
```
GET /healthz

Response (200):
{
  "status": "ok"
}
```

### Readiness Probe
```
GET /readyz

Response (200):
{
  "status": "ready"
}
```

## Metrics

```
GET /metrics
Prometheus format
```

## Error Responses

### 400 Bad Request
```json
{
  "error": "Invalid request parameters"
}
```

### 401 Unauthorized
```json
{
  "error": "No token provided"
}
```

### 403 Forbidden
```json
{
  "error": "Invalid token"
}
```

### 404 Not Found
```json
{
  "error": "Video not found"
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal server error"
}
```

## Rate Limiting

- **Global**: 1000 requests/minute
- **Per User**: 500 requests/minute
- **Headers**:
  - `X-RateLimit-Limit`
  - `X-RateLimit-Remaining`
  - `X-RateLimit-Reset`

## Pagination

Default: 20 items per page

Query parameters:
- `page`: Page number
- `limit`: Items per page (max 100)

Response includes:
```json
{
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 1000,
    "pages": 50
  }
}
```

## Versioning

API is versioned via URL path:

- `/api/v1/...` (current)
- `/api/v2/...` (beta)

## Webhooks

Available events:
- `video.uploaded`
- `video.transcoded`
- `user.registered`
- `user.watched`

Configure webhooks in settings.

## Code Examples

### JavaScript/Node.js
```javascript
const axios = require('axios');

const client = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Authorization': `Bearer ${token}`
  }
});

// Get videos
const videos = await client.get('/videos');

// Create video
const video = await client.post('/videos', {
  title: 'My Video'
});
```

### Python
```python
import requests

headers = {'Authorization': f'Bearer {token}'}
response = requests.get('http://localhost:5000/api/videos', headers=headers)
videos = response.json()
```

### cURL
```bash
curl -H "Authorization: Bearer <token>" \
  http://localhost:5000/api/videos?page=1&limit=10
```

## References

- [OpenAPI Specification](./openapi.yaml)
- [Postman Collection](./netflix-api.postman_collection.json)
