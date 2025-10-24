# Quick Start: Testing & Accessibility

A quick reference guide for testing and accessibility in the Bhuvesh Portfolio project.

## Quick Commands

```bash
# Development
npm run test:watch         # Watch mode for testing while coding

# Before Committing
npm run test              # Run all unit tests
npm run test:coverage     # Check coverage
npm run lint             # Check code quality

# Full Test Suite
npm run test:all          # Run all tests (unit + e2e + component)
npm run test:accessibility # Run accessibility tests

# E2E Testing
npm run test:e2e:open     # Open Cypress UI for visual testing
```

## Creating New Tests

### 1. Component Unit Test

Create `ComponentName/__tests__/ComponentName.test.tsx`:

```typescript
import { render, screen, fireEvent } from '@testing-library/react'
import { axe, toHaveNoViolations } from 'jest-axe'
import { ComponentName } from '../ComponentName'

expect.extend(toHaveNoViolations)

describe('ComponentName', () => {
  it('renders correctly', () => {
    render(<ComponentName />)
    expect(screen.getByRole('button')).toBeInTheDocument()
  })

  it('should not have accessibility violations', async () => {
    const { container } = render(<ComponentName />)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })
})
```

### 2. E2E Test

Create `cypress/e2e/feature.cy.js`:

```javascript
describe('Feature Tests', () => {
  beforeEach(() => {
    cy.visit('/feature');
    cy.injectAxe();
  });

  it('should work correctly', () => {
    cy.get('[data-testid="button"]').click();
    cy.get('[data-testid="result"]').should('be.visible');
  });

  it('should not have accessibility violations', () => {
    cy.checkA11y();
  });
});
```

## Accessibility Checklist

### For Every Component

- [ ] Semantic HTML (`nav`, `button`, `main`, etc.)
- [ ] ARIA labels where needed
- [ ] Keyboard accessible (Tab, Enter, Space)
- [ ] Focus indicators visible
- [ ] Color contrast meets AA (4.5:1)
- [ ] Screen reader compatible
- [ ] No accessibility violations in tests

### Quick Fixes

**Missing Label:**

```tsx
// ❌ Bad
<button>×</button>

// ✅ Good
<button aria-label="Close dialog">×</button>
```

**Not Keyboard Accessible:**

```tsx
// ❌ Bad
<div onClick={handleClick}>Click me</div>

// ✅ Good
<button onClick={handleClick}>Click me</button>
```

**Poor Focus Indicator:**

```tsx
// ❌ Bad
<button className="outline-none">Button</button>

// ✅ Good
<button className="focus:outline-none focus:ring-2 focus:ring-blue-500">
  Button
</button>
```

**Missing ARIA State:**

```tsx
// ❌ Bad
<button onClick={toggleMenu}>Menu</button>

// ✅ Good
<button
  onClick={toggleMenu}
  aria-expanded={isOpen}
  aria-controls="menu"
>
  Menu
</button>
```

## Common Testing Patterns

### Testing User Interactions

```typescript
it('handles user interaction', () => {
  const handleClick = jest.fn()
  render(<Button onClick={handleClick}>Click</Button>)

  fireEvent.click(screen.getByRole('button'))
  expect(handleClick).toHaveBeenCalledTimes(1)
})
```

### Testing Async Operations

```typescript
it('loads data', async () => {
  render(<DataComponent />)

  await waitFor(() => {
    expect(screen.getByText('Loaded')).toBeInTheDocument()
  })
})
```

### Testing Keyboard Navigation

```typescript
it('supports keyboard', () => {
  render(<Component />)
  const button = screen.getByRole('button')

  button.focus()
  expect(button).toHaveFocus()

  fireEvent.keyDown(button, { key: 'Enter' })
  // Assert expected behavior
})
```

## Debugging Tests

### View Test Output

```bash
# Verbose output
npm run test -- --verbose

# Run specific test file
npm run test Button.test.tsx

# Run specific test
npm run test -- -t "renders correctly"
```

### Common Issues

**Test failing due to async:**

```typescript
// Use waitFor
await waitFor(() => {
  expect(screen.getByText('Text')).toBeInTheDocument();
});
```

**Element not found:**

```typescript
// Use screen.debug() to see DOM
screen.debug();

// Or debug specific element
screen.debug(screen.getByRole('button'));
```

**Accessibility violations:**

```typescript
// Run axe and check results
const results = await axe(container);
console.log(results.violations); // See what's wrong
```

## Integration with CI/CD

Tests run automatically on:

- Every push to repository
- Every pull request
- Before deployment

## Performance Tips

1. **Use specific queries**: Prefer `getByRole` over `getByTestId`
2. **Mock heavy dependencies**: Mock APIs and external libraries
3. **Parallel testing**: Tests run in parallel by default
4. **Skip unnecessary tests**: Use `it.skip()` temporarily

## Getting Help

- **Full Testing Guide**: [docs/TESTING_GUIDE.md](./TESTING_GUIDE.md)
- **Accessibility Guide**: [docs/ACCESSIBILITY_GUIDE.md](./ACCESSIBILITY_GUIDE.md)
- **Summary**: [docs/ACCESSIBILITY_AND_TESTING_SUMMARY.md](./ACCESSIBILITY_AND_TESTING_SUMMARY.md)

## Quick Reference

### Test Matchers

```typescript
expect(element).toBeInTheDocument();
expect(element).toBeVisible();
expect(element).toHaveTextContent('text');
expect(element).toHaveAttribute('aria-label', 'label');
expect(element).toHaveFocus();
expect(element).toBeDisabled();
expect(element).toHaveClass('class-name');
```

### Accessibility Queries

```typescript
screen.getByRole('button', { name: /click me/i });
screen.getByLabelText('Email');
screen.getByAltText('Image description');
screen.getByTitle('Tooltip text');
```

### Cypress Commands

```javascript
cy.get('selector');
cy.click();
cy.type('text');
cy.should('be.visible');
cy.checkA11y(); // Check accessibility
```

---

**Remember**: Write tests as you develop, not after. It's easier and faster!
