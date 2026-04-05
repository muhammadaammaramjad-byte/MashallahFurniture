# Contributing Guide

## Git Workflow

1. Create feature branch: `git checkout -b feature/name`
2. Make changes with tests
3. Run tests: `npm test`
4. Lint code: `npm run lint`
5. Format code: `npm run format`
6. Commit with conventional format: `git commit -m "feat: add new feature"`
7. Push and create PR

## Code Review Process

- All PRs require 1 approval
- CI must pass
- No merge conflicts
- Update documentation if needed

## Testing Requirements

- Unit tests for new functions
- Integration tests for components
- E2E tests for critical flows
- 80% code coverage minimum