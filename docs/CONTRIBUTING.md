# Contributing Guide — Hospital CRM

## Welcome Contributors! 👋

Thank you for interest in contributing to the Hospital CRM project. This guide will help you get started.

## Getting Started

### 1. Fork & Clone
```bash
# Fork the repository on GitHub

# Clone your fork
git clone https://github.com/YOUR_USERNAME/Hospital-CRM.git
cd Hospital-CRM

# Add upstream remote
git remote add upstream https://github.com/vedantkulkarniii/Hospital-CRM.git
```

### 2. Create Feature Branch
```bash
# Create a new branch for your feature
git checkout -b feature/your-feature-name

# Or for bugfixes
git checkout -b fix/bug-description
```

### 3. Development Setup
```bash
# Backend
cd backend
cp .env.example .env
npm install
npm run dev

# Frontend (in new terminal)
cd frontend
npm install --legacy-peer-deps
npm run dev
```

## Development Workflow

### Making Changes

1. **Follow Code Conventions**
   - Read [CODE_CONVENTIONS.md](./CODE_CONVENTIONS.md)
   - Use consistent naming and formatting
   - Add meaningful comments

2. **Write Tests**
   - Add tests for new features
   - Ensure existing tests pass
   - Aim for 80%+ coverage

3. **Update Documentation**
   - Document new features
   - Update API docs if needed
   - Add comments to complex logic

### Testing

```bash
# Backend
cd backend
npm test
npm run test:coverage

# Frontend
cd frontend
npm test
npm run test:coverage
```

### Linting

```bash
# Backend
npm run lint
npm run lint:fix

# Frontend
npm run lint
npm run lint:fix
```

## Commit Guidelines

### Commit Message Format
```
type(scope): subject

body

footer
```

### Types
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Formatting changes
- `refactor`: Code restructuring
- `test`: Adding/updating tests
- `chore`: Dependency updates, config changes

### Examples
```bash
git commit -m "feat(auth): Add JWT token refresh mechanism"
git commit -m "fix(patients): Resolve search filter bug"
git commit -m "docs: Update API documentation"
git commit -m "test(appointments): Add appointment conflict tests"
```

## Pull Request Process

### Before Submitting PR

1. **Sync with upstream**
   ```bash
   git fetch upstream
   git rebase upstream/main
   ```

2. **Run all checks**
   ```bash
   npm run lint
   npm test
   npm run test:coverage
   ```

3. **Commit your changes**
   ```bash
   git add .
   git commit -m "feat: Your feature description"
   ```

4. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```

### Create Pull Request

1. Go to GitHub and create a PR
2. Use the PR template provided
3. Fill in:
   - **Title**: Clear, descriptive title
   - **Description**: What changes and why
   - **Screenshots**: If UI changes
   - **Testing**: How tested
   - **Checklist**: Mark completed items

### PR Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] New feature
- [ ] Bug fix
- [ ] Documentation update
- [ ] Performance improvement

## Related Issues
Closes #123

## Testing
How was this tested?

## Screenshots (if applicable)
Add screenshots for UI changes

## Checklist
- [ ] Code follows style guidelines
- [ ] Tests added/updated
- [ ] Documentation updated
- [ ] No new warnings generated
- [ ] Changes are backward compatible
```

## Code Review Process

### What Reviewers Look For

1. **Functionality**
   - Does it work as intended?
   - Are edge cases handled?
   - Error handling proper?

2. **Code Quality**
   - Follows conventions
   - No code duplication
   - Readable and maintainable

3. **Testing**
   - Adequate test coverage
   - Tests pass
   - Edge cases covered

4. **Documentation**
   - Changes documented
   - Comments clear
   - README updated if needed

5. **Performance**
   - No performance regressions
   - Queries optimized
   - Bundle size acceptable

### Addressing Review Comments

1. Make requested changes
2. Push new commits (don't force push)
3. Reply to comments with explanation
4. Request re-review when ready

## Issue Reporting

### Found a Bug?

Create an issue with:
```markdown
## Description
Clear description of the bug

## Steps to Reproduce
1. Step one
2. Step two
3. Bug occurs

## Expected Behavior
What should happen

## Actual Behavior
What actually happens

## Screenshots
Add if helpful

## Environment
- Browser: 
- OS:
- Node version:
```

### Feature Requests

```markdown
## Description
Clear feature description

## Use Case
Why is this needed?

## Implementation Ideas
How could this be implemented?

## Additional Context
Any other relevant information
```

## Areas for Contribution

### Backend
- [ ] New API endpoints
- [ ] Service optimization
- [ ] Error handling
- [ ] Testing improvements
- [ ] Documentation

### Frontend
- [ ] UI/UX improvements
- [ ] Component enhancements
- [ ] Performance optimization
- [ ] Accessibility improvements
- [ ] New pages/features

### Documentation
- [ ] User guides
- [ ] API documentation
- [ ] Setup guides
- [ ] Troubleshooting
- [ ] Video tutorials

### Testing
- [ ] Test coverage
- [ ] E2E tests
- [ ] Performance tests
- [ ] Security tests

## Development Best Practices

### Do's ✅
- Write clear commit messages
- Create small, focused PRs
- Add tests for new code
- Document complex logic
- Communicate in issues
- Ask for help if stuck
- Review others' PRs
- Follow conventions

### Don'ts ❌
- Don't make large PRs
- Don't skip tests
- Don't commit console.logs
- Don't use magic numbers
- Don't modify unrelated code
- Don't force push to main
- Don't hardcode credentials
- Don't skip documentation

## Getting Help

### Resources
- [GitHub Issues](https://github.com/vedantkulkarniii/Hospital-CRM/issues)
- [Discussions](https://github.com/vedantkulkarniii/Hospital-CRM/discussions)
- [Documentation](./README.md)

### Communication
- Ask questions in issues
- Discuss in pull requests
- Join our community
- Share ideas and feedback

## Code of Conduct

### Be Respectful
- Treat everyone with respect
- Welcome diverse perspectives
- No discrimination or harassment
- Constructive feedback only

### Be Professional
- Keep discussions relevant
- Stay focused on issues
- No spam or self-promotion
- Follow GitHub guidelines

## Recognition

Contributors will be recognized in:
- [CONTRIBUTORS.md](./CONTRIBUTORS.md)
- Release notes
- Project README
- GitHub acknowledgments

## Questions?

Feel free to:
1. Check existing documentation
2. Search closed issues
3. Ask in GitHub discussions
4. Open a new issue

---

**Thank you for contributing to Hospital CRM! 🙏**
