# Contributing to Junior News Digest

Thank you for your interest in contributing to Junior News Digest! We welcome contributions from the community and are grateful for your help in making this project better.

## Code of Conduct

This project adheres to a code of conduct. By participating, you are expected to uphold this code. Please report unacceptable behavior to [conduct@example.com](mailto:conduct@example.com).

## How to Contribute

### Reporting Issues

- Use the GitHub issue tracker
- Search existing issues before creating new ones
- Use clear, descriptive titles
- Include steps to reproduce bugs
- Specify your environment (OS, Node.js version, etc.)

### Suggesting Enhancements

- Use the "Enhancement" issue template
- Provide clear use cases and benefits
- Consider the target audience (children aged 6-12)
- Ensure suggestions align with the project's educational goals

### Pull Requests

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Make your changes**
4. **Test thoroughly**
5. **Commit with clear messages**
6. **Push to your fork**
7. **Open a Pull Request**

## Development Setup

### Prerequisites

- Node.js 18+
- Python 3.12+
- Git
- Expo CLI

### Local Development

1. **Clone your fork**
   ```bash
   git clone https://github.com/yourusername/junior-news-digest.git
   cd junior-news-digest
   ```

2. **Install dependencies**
   ```bash
   # App dependencies
   cd app
   npm install
   
   # Backend dependencies
   cd ../backend
   pip install -r requirements.txt
   ```

3. **Set up environment**
   ```bash
   cp .env.example .env
   # Add your API keys
   ```

4. **Start development servers**
   ```bash
   # Terminal 1: Backend
   cd backend
   python integrated_backend.py
   
   # Terminal 2: App
   cd app
   npx expo start
   ```

## Code Style

### TypeScript/JavaScript

- Use TypeScript for all new code
- Follow ESLint configuration
- Use meaningful variable names
- Add JSDoc comments for functions
- Prefer functional components with hooks

### Python

- Follow PEP 8 style guide
- Use type hints
- Add docstrings for functions and classes
- Keep functions small and focused

### React Native

- Use functional components
- Implement proper error boundaries
- Follow the established design system
- Ensure accessibility compliance

## Testing

### Frontend Testing

```bash
cd app
npm test
```

### Backend Testing

```bash
cd backend
python -m pytest
```

### Manual Testing

- Test on both iOS and Android
- Verify all user flows
- Check accessibility features
- Test with different screen sizes

## Design Guidelines

### UI/UX Principles

- **Child-friendly**: Bright colors, large buttons, simple navigation
- **Educational**: Content should be informative and age-appropriate
- **Accessible**: Support for different abilities and learning styles
- **Consistent**: Follow the established design system

### Content Guidelines

- **Age-appropriate**: Content suitable for ages 6-12
- **Positive tone**: Avoid scary or overly complex topics
- **Educational value**: Each story should teach something
- **Inclusive**: Represent diverse perspectives and experiences

## Commit Message Format

Use conventional commits:

```
type(scope): description

feat(auth): add user authentication
fix(video): resolve video playback issue
docs(readme): update installation instructions
style(ui): improve button styling
refactor(api): simplify content loading
test(quiz): add quiz component tests
```

## Pull Request Guidelines

### Before Submitting

- [ ] Code follows style guidelines
- [ ] Tests pass locally
- [ ] Documentation updated
- [ ] No console errors
- [ ] Accessibility tested
- [ ] Mobile responsive

### PR Description

Include:
- What changes were made
- Why the changes were necessary
- How to test the changes
- Screenshots (for UI changes)
- Breaking changes (if any)

## Review Process

1. **Automated checks** must pass
2. **Code review** by maintainers
3. **Testing** on multiple devices
4. **Documentation** review
5. **Approval** and merge

## Release Process

- Releases are created from the main branch
- Version numbers follow semantic versioning
- Changelog is updated automatically
- Releases are tagged in Git

## Getting Help

- 💬 **Discussions**: Use GitHub Discussions for questions
- 📧 **Email**: dev@example.com for direct contact
- 📖 **Documentation**: Check the wiki for detailed guides

## Recognition

Contributors will be:
- Listed in the README
- Mentioned in release notes
- Invited to the contributors team (for significant contributions)

Thank you for contributing to Junior News Digest! 🎉
