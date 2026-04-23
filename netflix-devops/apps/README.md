# Applications

This directory contains all microservices and client applications for the Netflix DevOps project.

## Structure

- **auth-service**: Authentication and user management service
- **backend**: Main API backend service
- **frontend**: React-based user interface
- **video-service**: Video management and streaming service

## Service Development

Each service follows a consistent structure:
- `src/`: Source code
- `tests/`: Unit and integration tests
- `config/`: Service-specific configuration
- `package.json`: Dependencies and scripts

### Getting Started

```bash
cd apps/<service-name>
npm install
npm run dev
```

### Running Tests

```bash
npm test
```

### Building for Production

```bash
npm run build
```

See individual service READMEs for specific instructions.
