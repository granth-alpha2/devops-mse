# Contributing Guide

Guidelines for contributing to the Netflix DevOps project.

## Code Organization

### Services Structure

Each microservice follows this pattern:
```
service/
├── src/
│   ├── index.js          # Entry point
│   ├── middleware/       # Express middleware
│   ├── models/           # Data models
│   ├── routes/           # API routes
│   └── utils/            # Utilities
├── tests/                # Unit tests
├── config/               # Service config
├── package.json
└── README.md
```

### Frontend Structure

```
frontend/
├── src/
│   ├── components/       # Reusable React components
│   ├── pages/            # Page components
│   ├── hooks/            # Custom React hooks
│   ├── utils/            # Utility functions
│   ├── App.js
│   └── index.js
├── tests/
└── package.json
```

## Development Workflow

1. Create a feature branch
2. Make changes following the structure above
3. Write/update tests
4. Run linting and tests locally
5. Create a pull request

## Best Practices

### Code Quality
- Maintain consistent code style
- Add meaningful comments
- Keep functions focused and small
- Use descriptive variable names

### Testing
- Write unit tests for new features
- Aim for >80% code coverage
- Test edge cases
- Integration tests for cross-service communication

### Documentation
- Update relevant .md files
- Add comments for complex logic
- Document API endpoints
- Keep README files current

### Git Practices
- Use descriptive commit messages
- Squash related commits
- Reference issues in commits
- Keep commits logically separate

## Running Tests

```bash
# Service-specific tests
cd apps/<service-name>
npm test

# All tests
npm run test:all

# With coverage
npm run test:coverage
```

## Linting and Formatting

```bash
npm run lint
npm run format
```

## Before Submitting

- [ ] Code follows project structure
- [ ] Tests added/updated
- [ ] All tests passing
- [ ] No linting errors
- [ ] Documentation updated
- [ ] Commit messages descriptive

## Questions?

See [docs/](docs/) for comprehensive documentation.
