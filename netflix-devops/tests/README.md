# Tests

Integration and end-to-end tests for the Netflix DevOps project.

## Structure

- **integration/**: Integration tests for service interactions
- Individual services have unit tests in `apps/<service>/tests/`

## Running Tests

### All Tests

```bash
npm run test:all
```

### Integration Tests

```bash
cd tests
npm test
```

### Coverage Report

```bash
npm run test:coverage
```

## Writing Tests

Follow these patterns:
- Unit tests in service directories
- Integration tests in this directory
- Use Jest for JavaScript tests
- Maintain >80% code coverage
