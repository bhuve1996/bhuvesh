# Husky Git Hooks

This project uses Husky to manage Git hooks for code quality and consistency.

## Hooks

### Pre-commit Hook

Runs before each commit to ensure code quality:

- **Linting**: Runs ESLint to check for code style and potential issues
- **Type Checking**: Runs TypeScript compiler to check for type errors
- **Tests**: Runs tests if they exist

### Commit Message Hook

Validates commit messages to follow conventional commit format:

- Format: `type(scope): description`
- Types: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `chore`, `ci`, `build`, `revert`
- Example: `feat(auth): add login functionality`

## Usage

The hooks run automatically when you:

- `git commit` - Pre-commit and commit-msg hooks run
- `git commit -m "message"` - Both hooks run

## Bypassing Hooks

If you need to bypass hooks (not recommended):

```bash
git commit --no-verify -m "message"
```

## Manual Testing

You can test the hooks manually:

```bash
# Test pre-commit hook
.husky/pre-commit

# Test commit-msg hook
.husky/commit-msg .git/COMMIT_EDITMSG
```
