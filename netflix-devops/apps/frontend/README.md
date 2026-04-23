# Frontend Application

React-based user interface for the Netflix DevOps application.

## Overview

Modern single-page application providing user interface for authentication, video browsing, and streaming.

## Quick Start

```bash
npm install
npm start
```

Application runs on `http://localhost:3000`

## Structure

```
src/
├── components/        # Reusable React components
├── pages/            # Full page components
├── hooks/            # Custom React hooks
├── utils/            # Utility functions
├── App.js            # Main app component
└── index.js          # Entry point

public/
├── index.html        # HTML template
└── (static files)

tests/                # Unit and integration tests
```

## Available Scripts

```bash
npm start             # Start development server
npm run build         # Create production build
npm test              # Run tests
npm run eject         # Eject from Create React App
```

## Key Components

- **Header**: Navigation and user menu
- **Hero**: Landing page hero section
- **VideoGrid**: Video grid with filtering
- **VideoPlayer**: Video playback component
- **Footer**: Application footer

## Development

- Uses React Hooks for state management
- Responsive CSS design
- API integration with backend

## Environment Variables

Create `.env` file:
```
REACT_APP_API_URL=http://localhost:3000
REACT_APP_AUTH_URL=http://localhost:3001
```

## Testing

```bash
npm test              # Run test suite
npm run test:coverage # Generate coverage report
```

## Production Build

```bash
npm run build
# Builds optimized production bundle in build/ directory
```

## Deployment

The `build/` directory is ready to be deployed to any static hosting service.

## Learn More

- [React Documentation](https://reactjs.org)
- [Create React App Docs](https://create-react-app.dev)
