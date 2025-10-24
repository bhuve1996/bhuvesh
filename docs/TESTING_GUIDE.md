# Testing Guide

This guide covers comprehensive testing strategies for the Bhuvesh Portfolio project, including unit tests, integration tests, end-to-end tests, and accessibility testing.

## Table of Contents

- [Testing Framework Setup](#testing-framework-setup)
- [Unit Testing](#unit-testing)
- [Integration Testing](#integration-testing)
- [End-to-End Testing](#end-to-end-testing)
- [Accessibility Testing](#accessibility-testing)
- [Running Tests](#running-tests)
- [Best Practices](#best-practices)
- [Continuous Integration](#continuous-integration)

## Testing Framework Setup

### Dependencies

The project uses the following testing frameworks:

- **Jest**: Unit testing framework
- **React Testing Library**: Component testing utilities
- **Cypress**: End-to-end testing
- **jest-axe**: Accessibility testing
- **cypress-axe**: E2E accessibility testing

### Configuration Files

- `jest.config.js`: Jest configuration
- `jest.setup.js`: Jest setup and mocks
- `cypress.config.js`: Cypress configuration
- `cypress/support/`: Cypress support files

## Unit Testing

### Component Testing

Unit tests are located in `src/**/__tests__/` directories alongside their components.

#### Example: Button Component Test

```typescript
import { render, screen, fireEvent } from '@testing-library/react'
import { axe, toHaveNoViolations } from 'jest-axe'
import { Button } from '../Button'

describe('Button Component', () => {
  it('renders with default props', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByRole('button')).toBeInTheDocument()
  })

  it('should not have accessibility violations', async () => {
    const { container } = render(<Button>Accessible Button</Button>)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })
})
```

### Testing Patterns

#### 1. Component Rendering

```typescript
it('renders component correctly', () => {
  render(<Component />)
  expect(screen.getByRole('button')).toBeInTheDocument()
})
```

#### 2. User Interactions

```typescript
it('handles user interactions', () => {
  const handleClick = jest.fn()
  render(<Button onClick={handleClick}>Click me</Button>)

  fireEvent.click(screen.getByRole('button'))
  expect(handleClick).toHaveBeenCalled()
})
```

#### 3. Accessibility Testing

```typescript
it('should not have accessibility violations', async () => {
  const { container } = render(<Component />)
  const results = await axe(container)
  expect(results).toHaveNoViolations()
})
```

#### 4. State Management

```typescript
it('manages state correctly', () => {
  render(<Component />)
  const button = screen.getByRole('button')

  fireEvent.click(button)
  expect(button).toHaveAttribute('aria-expanded', 'true')
})
```

## Integration Testing

### User Flow Testing

Integration tests verify that multiple components work together correctly.

#### Example: Navigation Flow

```typescript
describe('Navigation Integration', () => {
  it('navigates between sections', () => {
    render(<App />)

    const aboutLink = screen.getByRole('menuitem', { name: /about/i })
    fireEvent.click(aboutLink)

    expect(screen.getByRole('main')).toHaveTextContent('About')
  })
})
```

### API Integration

```typescript
describe('API Integration', () => {
  it('fetches data successfully', async () => {
    const mockData = { id: 1, name: 'Test' }
    jest.spyOn(global, 'fetch').mockResolvedValue({
      json: () => Promise.resolve(mockData)
    })

    render(<DataComponent />)

    await waitFor(() => {
      expect(screen.getByText('Test')).toBeInTheDocument()
    })
  })
})
```

## End-to-End Testing

### Cypress Tests

E2E tests are located in `cypress/e2e/` and test complete user journeys.

#### Example: Homepage Navigation

```javascript
describe('Homepage Navigation', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.injectAxe();
  });

  it('should navigate to about section', () => {
    cy.get('[role="menuitem"]').contains('About').click();
    cy.url().should('include', '#about');
  });

  it('should not have accessibility violations', () => {
    cy.checkA11y();
  });
});
```

### Component Testing with Cypress

```javascript
describe('Button Component', () => {
  beforeEach(() => {
    cy.mount(<Button>Test Button</Button>);
  });

  it('should be clickable', () => {
    cy.get('button').click();
    cy.get('button').should('have.focus');
  });

  it('should not have accessibility violations', () => {
    cy.checkA11y();
  });
});
```

## Accessibility Testing

### Automated Accessibility Testing

#### jest-axe Integration

```typescript
import { axe, toHaveNoViolations } from 'jest-axe'

describe('Accessibility Tests', () => {
  it('should not have accessibility violations', async () => {
    const { container } = render(<Component />)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })
})
```

#### cypress-axe Integration

```javascript
describe('Accessibility E2E Tests', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.injectAxe();
  });

  it('should not have accessibility violations', () => {
    cy.checkA11y();
  });
});
```

### Manual Accessibility Testing

#### Keyboard Navigation

- Tab through all interactive elements
- Ensure focus indicators are visible
- Test Enter and Space key activation
- Verify focus trap in modals

#### Screen Reader Testing

- Test with NVDA (Windows)
- Test with JAWS (Windows)
- Test with VoiceOver (macOS)
- Verify ARIA labels and descriptions

#### Color Contrast Testing

- Use WebAIM Contrast Checker
- Test with color blindness simulators
- Verify sufficient contrast ratios (4.5:1 for AA, 7:1 for AAA)

## Running Tests

### Unit Tests

```bash
# Run all unit tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run specific test file
npm run test Button.test.tsx

# Run tests matching pattern
npm run test -- --testNamePattern="accessibility"
```

### Integration Tests

```bash
# Run integration tests
npm run test:integration

# Run tests with specific pattern
npm run test -- --testPathPattern="integration"
```

### End-to-End Tests

```bash
# Run E2E tests headlessly
npm run test:e2e

# Open Cypress Test Runner
npm run test:e2e:open

# Run component tests
npm run test:component

# Open component test runner
npm run test:component:open
```

### Accessibility Tests

```bash
# Run accessibility tests
npm run test:a11y

# Run all accessibility tests
npm run test:accessibility
```

### All Tests

```bash
# Run all tests
npm run test:all
```

## Best Practices

### 1. Test Structure

- Use descriptive test names
- Group related tests with `describe` blocks
- Use `beforeEach` and `afterEach` for setup/cleanup
- Keep tests independent and isolated

### 2. Accessibility Testing

- Test with real users when possible
- Use automated tools as a starting point
- Test with different assistive technologies
- Verify keyboard navigation
- Check color contrast ratios

### 3. Performance Testing

- Test component rendering performance
- Verify lazy loading works correctly
- Test with slow network conditions
- Monitor bundle size impact

### 4. Error Handling

- Test error states and edge cases
- Verify error messages are accessible
- Test recovery from errors
- Ensure graceful degradation

### 5. Cross-Browser Testing

- Test on major browsers (Chrome, Firefox, Safari, Edge)
- Test on different devices and screen sizes
- Verify responsive design works correctly
- Test with different input methods

## Continuous Integration

### GitHub Actions

```yaml
name: Tests
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run test:ci
      - run: npm run test:e2e
      - run: npm run test:accessibility
```

### Pre-commit Hooks

```json
{
  "husky": {
    "hooks": {
      "pre-commit": "lint-staged"
    }
  },
  "lint-staged": {
    "*.{js,jsx,ts,tsx}": [
      "eslint --fix",
      "prettier --write",
      "jest --bail --findRelatedTests"
    ]
  }
}
```

## Testing Checklist

### Before Committing

- [ ] All unit tests pass
- [ ] Integration tests pass
- [ ] E2E tests pass
- [ ] Accessibility tests pass
- [ ] No accessibility violations
- [ ] Code coverage meets threshold
- [ ] Tests are properly documented

### Before Release

- [ ] All tests pass in CI
- [ ] Manual accessibility testing completed
- [ ] Cross-browser testing completed
- [ ] Performance testing completed
- [ ] Error handling tested
- [ ] User acceptance testing completed

## Troubleshooting

### Common Issues

1. **Tests failing due to async operations**
   - Use `waitFor` for async operations
   - Mock external dependencies
   - Use proper cleanup in `afterEach`

2. **Accessibility violations**
   - Add proper ARIA labels
   - Ensure keyboard navigation works
   - Fix color contrast issues
   - Add semantic HTML structure

3. **Cypress tests flaky**
   - Use proper selectors
   - Wait for elements to be visible
   - Use `cy.intercept()` for API calls
   - Avoid hard-coded timeouts

4. **Performance issues**
   - Mock heavy dependencies
   - Use `React.memo` for expensive components
   - Optimize test data
   - Use `act()` for state updates

## Resources

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Cypress Documentation](https://docs.cypress.io/)
- [WebAIM Accessibility Testing](https://webaim.org/)
- [WCAG Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [axe-core Documentation](https://github.com/dequelabs/axe-core)
