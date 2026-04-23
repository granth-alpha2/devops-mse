# CI/CD Workflows

Automated deployment pipelines using GitHub Actions.

## Workflows

### test.yml
Runs on every push and pull request:
- Unit and integration tests
- Linting
- Code coverage
- Coverage upload to Codecov

### docker.yml
Builds and pushes Docker images:
- Triggers on push to main
- Builds images for each service
- Pushes to Docker Hub
- Caches layers for faster builds

### deploy.yml
Deploys to Kubernetes:
- Triggered after successful Docker build
- Applies K8s manifests
- Waits for rollout
- Sends Slack notifications on failure

## Setup

### Required Secrets

Configure these in GitHub repository settings:

- `DOCKER_USERNAME`: Docker Hub username
- `DOCKER_PASSWORD`: Docker Hub access token
- `KUBE_CONFIG`: Base64-encoded kubeconfig file
- `SLACK_WEBHOOK`: Slack webhook URL for notifications

### Setting Up a Secret

1. Go to repository Settings
2. Click "Secrets and variables" → "Actions"
3. Click "New repository secret"
4. Enter name and value

Example for KUBE_CONFIG:
```bash
cat ~/.kube/config | base64 -w 0 | xclip -selection clipboard
```

## Trigger Manually

```bash
# Manually trigger from GitHub UI
# Or use GitHub CLI:
gh workflow run test.yml -r main
gh workflow run docker.yml -r main
gh workflow run deploy.yml -r main
```

## Monitoring

View workflow runs:
- GitHub: Actions tab
- CLI: `gh run list`

View specific run:
- `gh run view <run-id>`

Watch logs:
- `gh run watch <run-id>`

## Best Practices

1. ✅ Always test before deploying
2. ✅ Use branch protection rules
3. ✅ Require PR reviews
4. ✅ Monitor workflow performance
5. ✅ Keep secrets secure
6. ✅ Document workflow purposes
7. ✅ Regular security updates

## Troubleshooting

### Workflow Fails

1. Check logs in GitHub Actions tab
2. View full error: `gh run view <run-id> --log`
3. Check if secrets are configured
4. Verify Docker Hub credentials

### Slow Builds

1. Enable Docker layer caching
2. Use matrix builds for parallelization
3. Cache dependencies (npm, etc.)
4. Use Alpine base images

### Deployment Issues

1. Check kubeconfig is valid
2. Verify K8s cluster access
3. Check resource quotas
4. Review rollout status

## Next Steps

- Set up monitoring for deployments
- Configure slack notifications
- Add security scanning
- Set up automated rollbacks
- Add performance testing
