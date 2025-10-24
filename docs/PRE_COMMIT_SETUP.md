# Pre-Commit Hooks Setup

This document explains the pre-commit hooks setup for the Bhuvesh Portfolio project, ensuring code quality and preventing broken code from being committed.

## Overview

The project includes multiple pre-commit hook configurations to suit different development scenarios:

1. **Fast Pre-Commit** (`.husky/pre-commit-fast`) - Quick checks for development
2. **Standard Pre-Commit** (`.husky/pre-commit`) - Balanced checks
3. **Comprehensive Pre-Commit** (`.husky/pre-commit-comprehensive`) - Full test suite

## Available Pre-Commit Hooks

### 1. Fast Pre-Commit Hook (Recommended for Development)

**File**: `.husky/pre-commit-fast`

**What it runs**:

- ✅ TypeScript type checking
- ✅ ESLint code linting
- ✅ Unit tests (CI mode)
- ✅ Accessibility tests

**Duration**: ~30-60 seconds

**Use when**: Daily development, frequent commits

### 2. Standard Pre-Commit Hook

**File**: `.husky/pre-commit`

**What it runs**:

- ✅ TypeScript type checking
- ✅ ESLint code linting
- ✅ Code formatting check
- ✅ Unit tests (CI mode)
- ✅ Accessibility tests

**Duration**: ~1-2 minutes

**Use when**: Regular development workflow

### 3. Comprehensive Pre-Commit Hook

**File**: `.husky/pre-commit-comprehensive`

**What it runs**:

- ✅ TypeScript type checking
- ✅ ESLint code linting
- ✅ Code formatting check
- ✅ Unit tests (CI mode)
- ✅ Accessibility tests
- ✅ E2E tests (if not in CI)
- ✅ Build verification

**Duration**: ~3-5 minutes

**Use when**: Before major releases, important commits

## Setting Up Pre-Commit Hooks

### 1. Choose Your Pre-Commit Hook

For **development** (recommended):

```bash
# Use the fast pre-commit hook
cp .husky/pre-commit-fast .husky/pre-commit
chmod +x .husky/pre-commit
```

For **standard workflow**:

```bash
# Use the standard pre-commit hook (already set)
# No action needed
```

For **comprehensive checks**:

```bash
# Use the comprehensive pre-commit hook
cp .husky/pre-commit-comprehensive .husky/pre-commit
chmod +x .husky/pre-commit
```

### 2. Verify Setup

```bash
# Test the pre-commit hook
git add .
git commit -m "test: verify pre-commit hooks"
```

## Pre-Commit Hook Details

### What Each Check Does

#### TypeScript Type Checking

```bash
npm run type-check
```

- Validates TypeScript types
- Catches type errors before commit
- Ensures code compiles correctly

#### ESLint Linting

```bash
npm run lint
```

- Enforces code style rules
- Catches potential bugs
- Ensures consistent code quality

#### Code Formatting

```bash
npm run format:check
```

- Verifies Prettier formatting
- Ensures consistent code style
- Prevents formatting inconsistencies

#### Unit Tests

```bash
npm run test:ci
```

- Runs all unit tests
- Ensures no regressions
- Validates component functionality

#### Accessibility Tests

```bash
npm run test:a11y
```

- Runs accessibility compliance tests
- Ensures WCAG 2.1 AA compliance
- Validates screen reader compatibility

#### E2E Tests (Comprehensive only)

```bash
npm run test:e2e
```

- Runs end-to-end tests
- Validates user workflows
- Ensures application functionality

#### Build Verification (Comprehensive only)

```bash
npm run build
```

- Verifies production build
- Catches build-time errors
- Ensures deployable code

## Customizing Pre-Commit Hooks

### Skip Specific Checks

You can skip specific checks by setting environment variables:

```bash
# Skip E2E tests
SKIP_E2E=true git commit -m "commit message"

# Skip all tests (not recommended)
SKIP_TESTS=true git commit -m "commit message"
```

### Modify Hook Behavior

Edit the pre-commit hook file to:

- Add custom checks
- Remove specific checks
- Change error handling
- Add custom messages

### Example: Custom Pre-Commit Hook

```bash
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

echo "🔍 Running custom pre-commit checks..."

# Your custom checks here
npm run type-check
npm run lint
npm run test:ci

echo "✅ Custom checks passed!"
```

## Troubleshooting

### Common Issues

#### 1. Pre-Commit Hook Too Slow

**Problem**: Pre-commit hooks take too long to run.

**Solution**: Use the fast pre-commit hook:

```bash
cp .husky/pre-commit-fast .husky/pre-commit
```

#### 2. Tests Failing in Pre-Commit

**Problem**: Tests pass locally but fail in pre-commit.

**Solutions**:

- Check for uncommitted changes
- Run `npm run test:ci` locally
- Ensure all dependencies are installed
- Check for environment differences

#### 3. TypeScript Errors

**Problem**: TypeScript errors preventing commit.

**Solution**:

```bash
# Fix TypeScript errors
npm run type-check

# Or skip type checking temporarily (not recommended)
SKIP_TYPE_CHECK=true git commit -m "commit message"
```

#### 4. Linting Errors

**Problem**: ESLint errors preventing commit.

**Solution**:

```bash
# Auto-fix linting errors
npm run lint:fix

# Or fix manually
npm run lint
```

#### 5. Accessibility Test Failures

**Problem**: Accessibility tests failing.

**Solution**:

```bash
# Run accessibility tests locally
npm run test:a11y

# Fix accessibility issues
# Check the test output for specific violations
```

### Bypassing Pre-Commit Hooks

**⚠️ Use with caution - only in emergencies**

```bash
# Skip all pre-commit hooks
git commit --no-verify -m "emergency commit"

# Or temporarily disable
mv .husky/pre-commit .husky/pre-commit.disabled
git commit -m "commit message"
mv .husky/pre-commit.disabled .husky/pre-commit
```

## Best Practices

### 1. Regular Maintenance

- Keep dependencies updated
- Review and update pre-commit hooks periodically
- Monitor hook performance
- Update test coverage requirements

### 2. Team Workflow

- Ensure all team members use the same pre-commit hooks
- Document any customizations
- Share hook configurations
- Train team on troubleshooting

### 3. CI/CD Integration

- Pre-commit hooks should align with CI/CD checks
- Use similar test commands in both
- Ensure consistent environments
- Monitor for discrepancies

### 4. Performance Optimization

- Use fast hooks for development
- Run comprehensive checks before releases
- Optimize test execution time
- Use parallel execution where possible

## Available Commands

### Pre-Commit Scripts

```bash
# Run fast pre-commit checks
npm run pre-commit:fast

# Run full pre-commit checks
npm run pre-commit:full

# Run standard pre-commit checks
npm run pre-commit:check
```

### Testing Scripts

```bash
# Test only changed files
npm run test:changed

# Test staged files
npm run test:staged

# Run all tests
npm run test:all

# Run accessibility tests
npm run test:accessibility
```

## Configuration Files

### Husky Configuration

- `.husky/pre-commit` - Active pre-commit hook
- `.husky/pre-commit-fast` - Fast development hook
- `.husky/pre-commit-comprehensive` - Full test suite hook

### Package.json Scripts

- `pre-commit:fast` - Fast pre-commit checks
- `pre-commit:full` - Full pre-commit checks
- `pre-commit:check` - Standard pre-commit checks
- `test:changed` - Test only changed files
- `test:staged` - Test staged files

### Lint-Staged Configuration

- Runs tests only on changed files
- Integrates with pre-commit hooks
- Optimizes performance
- Ensures code quality

## Monitoring and Metrics

### Track Hook Performance

```bash
# Time pre-commit execution
time git commit -m "test commit"

# Monitor test execution
npm run test:ci -- --verbose

# Check coverage
npm run test:coverage
```

### Common Metrics

- **Fast Hook**: 30-60 seconds
- **Standard Hook**: 1-2 minutes
- **Comprehensive Hook**: 3-5 minutes
- **Test Coverage**: >70% (configurable)
- **Accessibility Score**: 100% (no violations)

## Conclusion

Pre-commit hooks are essential for maintaining code quality and preventing broken code from being committed. Choose the appropriate hook for your workflow:

- **Development**: Use fast hooks
- **Regular commits**: Use standard hooks
- **Releases**: Use comprehensive hooks

Remember to keep hooks updated and monitor their performance to ensure they remain effective and efficient.
