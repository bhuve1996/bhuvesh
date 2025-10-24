# Accessibility Guide

This guide covers accessibility best practices, testing strategies, and implementation guidelines for the Bhuvesh Portfolio project.

## Table of Contents

- [Accessibility Standards](#accessibility-standards)
- [Implementation Guidelines](#implementation-guidelines)
- [Testing Strategies](#testing-strategies)
- [Common Issues and Solutions](#common-issues-and-solutions)
- [Tools and Resources](#tools-and-resources)
- [Checklist](#checklist)

## Accessibility Standards

### WCAG 2.1 Compliance

The project aims for WCAG 2.1 AA compliance, with AAA compliance where possible.

#### Level A (Minimum)

- All functionality must be keyboard accessible
- All images must have alt text
- All form controls must have labels
- All content must be readable and understandable

#### Level AA (Standard)

- Color contrast ratio of at least 4.5:1 for normal text
- Color contrast ratio of at least 3:1 for large text
- All interactive elements must be keyboard accessible
- All content must be navigable with screen readers

#### Level AAA (Enhanced)

- Color contrast ratio of at least 7:1 for normal text
- Color contrast ratio of at least 4.5:1 for large text
- All content must be understandable at a 9th-grade reading level
- All content must be navigable with voice commands

## Implementation Guidelines

### 1. Semantic HTML

#### Use Proper HTML Elements

```tsx
// ✅ Good - Semantic HTML
<nav role="navigation" aria-label="Main navigation">
  <ul role="menubar">
    <li role="menuitem">
      <a href="/about" aria-current="page">About</a>
    </li>
  </ul>
</nav>

// ❌ Bad - Non-semantic HTML
<div className="nav">
  <div className="menu">
    <div className="item">
      <span>About</span>
    </div>
  </div>
</div>
```

#### Headings Structure

```tsx
// ✅ Good - Proper heading hierarchy
<h1>Page Title</h1>
  <h2>Section Title</h2>
    <h3>Subsection Title</h3>

// ❌ Bad - Skipped heading levels
<h1>Page Title</h1>
  <h3>Subsection Title</h3> // Skipped h2
```

### 2. ARIA Labels and Descriptions

#### Labels

```tsx
// ✅ Good - Clear labels
<button aria-label="Close dialog">×</button>
<input aria-label="Search" type="search" />
<img src="chart.png" alt="Sales chart showing 25% growth" />

// ❌ Bad - Missing or unclear labels
<button>×</button>
<input type="search" />
<img src="chart.png" alt="chart" />
```

#### Descriptions

```tsx
// ✅ Good - Descriptive content
<button
  aria-label="Save document"
  aria-describedby="save-help"
>
  Save
</button>
<div id="save-help">
  Saves the current document to your computer
</div>
```

#### States and Properties

```tsx
// ✅ Good - Proper ARIA states
<button
  aria-expanded={isOpen}
  aria-controls="menu"
  aria-haspopup="true"
>
  Menu
</button>

<div
  id="menu"
  role="menu"
  aria-hidden={!isOpen}
>
  <div role="menuitem">Item 1</div>
</div>
```

### 3. Keyboard Navigation

#### Focus Management

```tsx
// ✅ Good - Proper focus management
const handleKeyDown = (event: KeyboardEvent) => {
  if (event.key === 'Escape') {
    onClose();
  }
  if (event.key === 'Tab') {
    // Handle focus trap
  }
};

<button onKeyDown={handleKeyDown} tabIndex={0}>
  Close
</button>;
```

#### Focus Indicators

```tsx
// ✅ Good - Visible focus indicators
<button className='focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'>
  Button
</button>
```

#### Tab Order

```tsx
// ✅ Good - Logical tab order
<nav>
  <a href='/' tabIndex={0}>
    Home
  </a>
  <a href='/about' tabIndex={0}>
    About
  </a>
  <a href='/contact' tabIndex={0}>
    Contact
  </a>
</nav>
```

### 4. Color and Contrast

#### Color Contrast

```tsx
// ✅ Good - Sufficient contrast
<button className="bg-blue-600 text-white">
  Button
</button>

// ❌ Bad - Insufficient contrast
<button className="bg-blue-300 text-blue-400">
  Button
</button>
```

#### Color Independence

```tsx
// ✅ Good - Not relying on color alone
<div className="flex items-center">
  <div className="w-4 h-4 bg-red-500 rounded-full mr-2"></div>
  <span className="text-red-600 font-semibold">Error</span>
</div>

// ❌ Bad - Relying on color alone
<span className="text-red-600">Error</span>
```

### 5. Motion and Animation

#### Respect Reduced Motion

```tsx
// ✅ Good - Respecting user preferences
const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)')

<motion.div
  animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
  transition={prefersReducedMotion ? {} : { duration: 0.3 }}
>
  Content
</motion.div>
```

#### Pause Controls

```tsx
// ✅ Good - Providing pause controls
<button
  aria-label={isPlaying ? 'Pause animation' : 'Play animation'}
  onClick={toggleAnimation}
>
  {isPlaying ? '⏸️' : '▶️'}
</button>
```

### 6. Form Accessibility

#### Labels and Descriptions

```tsx
// ✅ Good - Proper form labels
<div>
  <label htmlFor='email'>Email Address</label>
  <input
    id='email'
    type='email'
    aria-describedby='email-help'
    aria-required='true'
  />
  <div id='email-help'>We'll never share your email with anyone else</div>
</div>
```

#### Error Handling

```tsx
// ✅ Good - Accessible error messages
<div>
  <label htmlFor='password'>Password</label>
  <input
    id='password'
    type='password'
    aria-invalid={hasError}
    aria-describedby={hasError ? 'password-error' : undefined}
  />
  {hasError && (
    <div id='password-error' role='alert'>
      Password must be at least 8 characters long
    </div>
  )}
</div>
```

## Testing Strategies

### 1. Automated Testing

#### jest-axe Integration

```typescript
import { axe, toHaveNoViolations } from 'jest-axe'

describe('Component Accessibility', () => {
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

### 2. Manual Testing

#### Keyboard Navigation

1. Tab through all interactive elements
2. Verify focus indicators are visible
3. Test Enter and Space key activation
4. Verify focus trap in modals
5. Test arrow key navigation in menus

#### Screen Reader Testing

1. Test with NVDA (Windows)
2. Test with JAWS (Windows)
3. Test with VoiceOver (macOS)
4. Verify ARIA labels and descriptions
5. Test landmark navigation

#### Color Contrast Testing

1. Use WebAIM Contrast Checker
2. Test with color blindness simulators
3. Verify sufficient contrast ratios
4. Test with high contrast mode

### 3. User Testing

#### Assistive Technology Users

1. Test with real users who use assistive technologies
2. Gather feedback on usability
3. Test with different assistive technology combinations
4. Verify task completion rates

## Common Issues and Solutions

### 1. Missing Alt Text

```tsx
// ❌ Bad
<img src="chart.png" />

// ✅ Good
<img src="chart.png" alt="Sales chart showing 25% growth in Q3" />
```

### 2. Missing Labels

```tsx
// ❌ Bad
<input type="search" />

// ✅ Good
<label htmlFor="search">Search</label>
<input id="search" type="search" />
```

### 3. Poor Focus Management

```tsx
// ❌ Bad
<button onClick={openModal}>Open</button>

// ✅ Good
<button
  onClick={openModal}
  aria-expanded={isOpen}
  aria-controls="modal"
>
  Open
</button>
```

### 4. Insufficient Color Contrast

```tsx
// ❌ Bad
<button className="bg-blue-300 text-blue-400">Button</button>

// ✅ Good
<button className="bg-blue-600 text-white">Button</button>
```

### 5. Missing ARIA States

```tsx
// ❌ Bad
<div className={isOpen ? 'block' : 'hidden'}>Content</div>

// ✅ Good
<div
  className={isOpen ? 'block' : 'hidden'}
  aria-hidden={!isOpen}
  role="region"
  aria-labelledby="heading"
>
  Content
</div>
```

## Tools and Resources

### Automated Testing Tools

- **axe-core**: Automated accessibility testing
- **jest-axe**: Jest integration for axe-core
- **cypress-axe**: Cypress integration for axe-core
- **Lighthouse**: Performance and accessibility auditing

### Manual Testing Tools

- **NVDA**: Free screen reader for Windows
- **JAWS**: Commercial screen reader for Windows
- **VoiceOver**: Built-in screen reader for macOS
- **WebAIM Contrast Checker**: Color contrast testing

### Browser Extensions

- **axe DevTools**: Browser extension for accessibility testing
- **WAVE**: Web accessibility evaluation tool
- **ColorZilla**: Color picker and contrast checker
- **NoCoffee**: Vision impairment simulator

### Design Tools

- **Stark**: Accessibility plugin for Figma
- **Color Oracle**: Color blindness simulator
- **Contrast**: Color contrast checker for macOS

## Checklist

### Development Checklist

- [ ] All images have descriptive alt text
- [ ] All form controls have labels
- [ ] All interactive elements are keyboard accessible
- [ ] All content has proper heading structure
- [ ] All links have descriptive text
- [ ] All buttons have accessible names
- [ ] All modals have proper focus management
- [ ] All animations respect reduced motion preferences
- [ ] All content has sufficient color contrast
- [ ] All ARIA attributes are properly implemented

### Testing Checklist

- [ ] Automated accessibility tests pass
- [ ] Manual keyboard navigation testing completed
- [ ] Screen reader testing completed
- [ ] Color contrast testing completed
- [ ] Cross-browser testing completed
- [ ] Mobile accessibility testing completed
- [ ] User testing with assistive technology users completed

### Review Checklist

- [ ] Code review includes accessibility considerations
- [ ] Design review includes accessibility considerations
- [ ] Content review includes accessibility considerations
- [ ] Performance impact of accessibility features assessed
- [ ] Documentation updated with accessibility information

## Resources

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [WebAIM Resources](https://webaim.org/)
- [MDN Accessibility](https://developer.mozilla.org/en-US/docs/Web/Accessibility)
- [axe-core Documentation](https://github.com/dequelabs/axe-core)
- [React Accessibility](https://reactjs.org/docs/accessibility.html)
- [Next.js Accessibility](https://nextjs.org/docs/advanced-features/accessibility)
- [Tailwind CSS Accessibility](https://tailwindcss.com/docs/accessibility)
