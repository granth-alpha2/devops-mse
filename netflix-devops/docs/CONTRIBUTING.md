# Contributing Guide

## Getting Started

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes
4. Commit: `git commit -m 'Add amazing feature'`
5. Push: `git push origin feature/amazing-feature`
6. Open a Pull Request

## Development Workflow

### Setup Local Environment

```bash
# Clone repo
git clone <your-fork>
cd netflix-devops

# Create branch
git checkout -b feature/your-feature

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Start development
npm run dev
```

### Code Standards

- **JavaScript**: Use ES6+ syntax
- **Formatting**: Run `prettier` before committing
- **Linting**: Ensure `eslint` passes
- **Tests**: Write tests for new features
- **Commits**: Use conventional commits

### Conventional Commits

```
feat: Add new feature
fix: Fix bug
docs: Update documentation
style: Format code
refactor: Refactor code
test: Add tests
chore: Update dependencies
```

### Testing Requirements

```bash
# Run tests
npm test

# Run with coverage
npm test -- --coverage

# Integration tests
npm run test:integration
```

## Pull Request Process

1. **Title**: Use conventional commit format
2. **Description**: Explain what and why
3. **Tests**: Include tests for changes
4. **Docs**: Update if needed
5. **Screenshots**: Include if UI changes
6. **Checklist**: Complete the PR template

### PR Template

```markdown
## Description
Brief explanation of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Unit tests added
- [ ] Integration tests passed
- [ ] Manual testing done

## Checklist
- [ ] Code follows standards
- [ ] Tests pass
- [ ] Docs updated
- [ ] No breaking changes (unless noted)
```

## Commit Message Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

Example:
```
feat(auth): add JWT token refresh

Implement refresh token functionality to extend session duration.
Tokens now expire after 7 days and can be refreshed.

Closes #123
```

## Code Review

### For Reviewers

- Check logic and correctness
- Verify tests are adequate
- Ensure code standards met
- Look for performance issues
- Verify security practices

### For Authors

- Address all comments
- Push fixes to same branch
- Re-request review after changes
- Squash commits if requested

## DevOps Specific Guidelines

### Infrastructure Changes (Terraform)

```bash
# Validate
terraform validate

# Format
terraform fmt -recursive

# Plan
terraform plan -out=tfplan

# Document changes
```

### Kubernetes Manifests

```bash
# Validate YAML
kubectl apply -f file.yaml --dry-run=client

# Check syntax
kubeval k8s/*.yaml
```

### Docker Changes

```bash
# Build and test
docker build -f Dockerfile -t netflix:test .

# Run tests
docker run -it netflix:test npm test

# Check size
docker history netflix:test
```

### GitHub Actions

```bash
# Test workflow locally
act -j test-backend

# Validate workflow syntax
yq eval '.jobs' .github/workflows/ci-cd.yml
```

## Documentation

### Adding Documentation

Create markdown files in `/docs/`:
- `FEATURE.md` for new features
- `DEPLOYMENT.md` for deployment info
- `API.md` for API changes

### README Updates

Update README.md if you:
- Add a feature
- Change setup process
- Update dependencies
- Modify architecture

### Code Comments

```javascript
/**
 * Fetch videos with filtering
 * @param {Object} options - Filter options
 * @param {string} options.genre - Video genre
 * @param {number} options.limit - Results limit
 * @returns {Promise<Array>} List of videos
 */
async function fetchVideos(options) {
  // Implementation
}
```

## Reporting Issues

### Bug Report Template

```markdown
## Description
Clear description of the issue

## Steps to Reproduce
1. Step 1
2. Step 2
3. etc.

## Expected Behavior
What should happen

## Actual Behavior
What actually happens

## Environment
- OS: Ubuntu 22.04
- Node: 18.0.0
- Kubernetes: 1.27

## Logs
Include relevant logs
```

### Feature Request Template

```markdown
## Description
Why do we need this feature?

## Use Case
Describe the use case

## Proposed Solution
How should it work?

## Alternatives
Other approaches considered

## Acceptance Criteria
- [ ] Criterion 1
- [ ] Criterion 2
```

## Release Process

### Version Numbers

Follow [Semantic Versioning](https://semver.org/):
- `MAJOR.MINOR.PATCH` (e.g., 1.2.3)
- Increment MAJOR for breaking changes
- Increment MINOR for new features
- Increment PATCH for bug fixes

### Creating a Release

```bash
# Update version in package.json
npm version minor

# Create tag
git tag v1.2.0

# Push changes and tags
git push origin main --tags

# Create GitHub release with changelog
```

## Community

- **Discussions**: GitHub Discussions for ideas
- **Slack**: Join community Slack
- **Twitter**: Follow @netflix-devops
- **Email**: devops@example.com

## Code of Conduct

Be respectful, inclusive, and professional:
- No harassment
- Respect different opinions
- Help others learn
- Report violations

## License

By contributing, you agree your work is licensed under the project license.

## Questions?

- Check [FAQ](./FAQ.md)
- Read [Troubleshooting](./TROUBLESHOOTING.md)
- Open an issue with question label
- Reach out to maintainers

Thank you for contributing! 🎉
