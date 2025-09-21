# Development Setup Guide

This document outlines the comprehensive development setup for the Bhuvesh Portfolio project, including TypeScript configuration, ESLint rules, Prettier formatting, and Git hooks.

## 🛠️ Configuration Overview

### TypeScript Configuration (`tsconfig.json`)

The project uses strict TypeScript configuration with the following key settings:

- **Strict Mode**: All strict type checking enabled
- **No Unused Locals/Parameters**: Catches unused variables
- **Exact Optional Properties**: Ensures optional properties are exactly as defined
- **No Implicit Returns**: Functions must have explicit return statements
- **No Fallthrough Cases**: Switch statements must handle all cases
- **No Unchecked Indexed Access**: Array/object access is type-safe
- **No Implicit Override**: Override keyword required for overridden methods

### ESLint Configuration (`eslint.config.mjs`)

ESLint is configured with:

- **Next.js Rules**: Core web vitals and TypeScript support
- **Prettier Integration**: Prevents conflicts between ESLint and Prettier
- **Import Ordering**: Enforces consistent import organization
- **TypeScript Rules**: Strict type checking and best practices
- **React Rules**: Optimized for Next.js development

#### Key Rules:

- `@typescript-eslint/no-unused-vars`: Prevents unused variables
- `@typescript-eslint/no-explicit-any`: Warns against `any` type usage
- `import/order`: Enforces import organization
- `no-console`: Warns about console statements
- `prefer-const`: Enforces const usage where appropriate

### Prettier Configuration (`.prettierrc`)

Code formatting is handled by Prettier with:

- **Single Quotes**: Consistent quote style
- **Semicolons**: Always required
- **Trailing Commas**: ES5 compatible
- **Print Width**: 80 characters
- **Tab Width**: 2 spaces
- **JSX Single Quotes**: Consistent JSX formatting

## 🔧 Development Scripts

### Available Commands

```bash
# Development
npm run dev              # Start development server with Turbopack
npm run build            # Build for production
npm run start            # Start production server

# Code Quality
npm run lint             # Run ESLint
npm run lint:fix         # Fix ESLint issues automatically
npm run format           # Format code with Prettier
npm run format:check     # Check code formatting
npm run type-check       # Run TypeScript type checking

# Combined Commands
npm run check-all        # Run all checks (type, lint, format)
npm run fix-all          # Fix all issues (lint + format)
```

## 🪝 Git Hooks

### Pre-commit Hook (`.husky/pre-commit`)

Runs automatically before each commit:

1. **TypeScript Check**: `npx tsc --noEmit`
2. **Lint-staged**: ESLint + Prettier on staged files
3. **Build Check**: Ensures the project builds successfully

### Pre-push Hook (`.husky/pre-push`)

Runs automatically before each push:

1. **TypeScript Check**: Type validation
2. **ESLint**: Code quality checks
3. **Format Check**: Code formatting validation

### Lint-staged Configuration

Automatically processes staged files:

- **JavaScript/TypeScript**: ESLint fix + Prettier format
- **JSON/Markdown/CSS**: Prettier format only

## 🎯 VS Code Integration

### Recommended Extensions (`.vscode/extensions.json`)

- **Prettier**: Code formatting
- **ESLint**: Code linting
- **Tailwind CSS**: CSS class completion
- **TypeScript**: Enhanced TypeScript support
- **Auto Rename Tag**: HTML/JSX tag management
- **Path Intellisense**: Import path completion

### VS Code Settings (`.vscode/settings.json`)

- **Format on Save**: Automatic code formatting
- **ESLint Auto-fix**: Automatic linting fixes
- **Import Organization**: Automatic import sorting
- **TypeScript Preferences**: Optimized for the project
- **Tailwind CSS**: Enhanced CSS support

## 📁 Project Structure

### Component Organization

Each component is organized in its own folder:

```
src/components/
├── ui/
│   ├── Button/
│   │   ├── Button.tsx
│   │   ├── types.ts
│   │   └── index.ts
│   ├── Card/
│   │   ├── Card.tsx
│   │   ├── types.ts
│   │   └── index.ts
│   └── ...
├── layout/
│   └── Navigation/
│       ├── Navigation.tsx
│       ├── types.ts
│       └── index.ts
└── sections/
    ├── Hero/
    │   ├── HeroSection.tsx
    │   ├── types.ts
    │   └── index.ts
    └── ...
```

### Type Organization

Types are co-located with their components:

- **Component Types**: `src/components/[category]/[Component]/types.ts`
- **Data Types**: `src/lib/data-types.ts`
- **Global Types**: Shared across multiple components

## 🚀 Getting Started

### Initial Setup

1. **Install Dependencies**:

   ```bash
   npm install
   ```

2. **Install Husky Hooks**:

   ```bash
   npm run prepare
   ```

3. **Verify Setup**:
   ```bash
   npm run check-all
   ```

### Development Workflow

1. **Start Development**:

   ```bash
   npm run dev
   ```

2. **Before Committing**:

   ```bash
   npm run fix-all
   ```

3. **Verify Everything**:
   ```bash
   npm run check-all
   ```

## 🔍 Troubleshooting

### Common Issues

1. **TypeScript Errors**: Run `npm run type-check` to identify issues
2. **ESLint Errors**: Run `npm run lint:fix` to auto-fix
3. **Formatting Issues**: Run `npm run format` to fix formatting
4. **Build Failures**: Check TypeScript and ESLint errors first

### Pre-commit Hook Failures

If the pre-commit hook fails:

1. **Fix Issues Manually**:

   ```bash
   npm run fix-all
   ```

2. **Re-stage Files**:

   ```bash
   git add .
   ```

3. **Commit Again**:
   ```bash
   git commit -m "your message"
   ```

## 📚 Best Practices

### Code Quality

- Always run `npm run check-all` before committing
- Use TypeScript strict mode features
- Follow ESLint rules and fix warnings
- Maintain consistent code formatting

### Component Development

- Co-locate types with components
- Use descriptive type names
- Export components and types from index files
- Follow the established folder structure

### Git Workflow

- Use conventional commit messages
- Ensure all hooks pass before pushing
- Keep commits atomic and focused
- Use meaningful commit descriptions

## 🎉 Benefits

This setup provides:

- **Type Safety**: Comprehensive TypeScript checking
- **Code Quality**: Automated linting and formatting
- **Consistency**: Enforced coding standards
- **Developer Experience**: VS Code integration and helpful scripts
- **CI/CD Ready**: Pre-commit hooks prevent bad code
- **Maintainability**: Organized structure and clear patterns

The development environment is now optimized for productivity, code quality, and team collaboration!
