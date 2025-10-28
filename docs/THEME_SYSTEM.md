# Theme System Documentation

This document provides comprehensive guidance on implementing and maintaining the dark/light theme system across the Bhuvesh Portfolio project.

## Overview

The theme system is built on top of:

- **CSS Custom Properties** for theme variables
- **Tailwind CSS** for utility classes
- **React Context** for theme state management
- **Custom Hooks** for theme-aware styling
- **Utility Functions** for consistent theme implementation

## Core Components

### 1. Theme Context (`src/contexts/ThemeContext.tsx`)

The central theme management system that provides:

- Theme state (`dark` | `light`)
- Theme switching functionality
- Local storage persistence
- System preference detection

```tsx
import { useTheme } from '@/contexts/ThemeContext';

const { theme, toggleTheme, setTheme } = useTheme();
```

### 2. Theme Utilities (`src/lib/utils/themeUtils.ts`)

Comprehensive utility functions for theme-aware styling:

```tsx
import { themeUtils, themeClasses } from '@/lib/utils/themeUtils';

// Get theme-aware score colors
const scoreColor = themeUtils.getScoreColor(85); // Returns appropriate color class

// Get category colors
const categoryColor = themeUtils.getCategoryColors('ats');

// Combine theme classes
const combinedClasses = themeUtils.combineThemeClasses(
  'bg-background',
  'text-foreground',
  'border-border'
);
```

### 3. Theme Styles Hook (`src/hooks/useThemeStyles.ts`)

Custom hook that provides theme-aware styling utilities:

```tsx
import { useThemeStyles } from '@/hooks/useThemeStyles';

const {
  theme,
  toggleTheme,
  getScoreColor,
  getCategoryColors,
  classes,
  card,
  button,
  input,
  // ... many more
} = useThemeStyles();
```

### 4. Theme-Aware Components (`src/components/ui/ThemeAware/`)

Pre-built components that automatically handle theme switching:

```tsx
import {
  ThemeAwareCard,
  ThemeAwareButton,
  ThemeAwareInput,
  ThemeAwareBadge,
} from '@/components/ui/ThemeAware';

// Automatically theme-aware
<ThemeAwareCard variant='elevated' title='My Card'>
  Content here
</ThemeAwareCard>;
```

## CSS Variables

The theme system uses CSS custom properties defined in `src/app/globals.css`:

### Light Theme Variables

```css
:root {
  --background: 0 0% 100%;
  --foreground: 0 0% 9%;
  --card: 0 0% 100%;
  --card-foreground: 0 0% 9%;
  --primary: 188 100% 45%;
  --primary-foreground: 0 0% 98%;
  --secondary: 0 0% 96.1%;
  --secondary-foreground: 0 0% 9%;
  --muted: 0 0% 96.1%;
  --muted-foreground: 0 0% 25%;
  --accent: 0 0% 96.1%;
  --accent-foreground: 0 0% 9%;
  --destructive: 0 84.2% 60.2%;
  --destructive-foreground: 0 0% 98%;
  --border: 0 0% 89.8%;
  --input: 0 0% 89.8%;
  --ring: 188 100% 45%;
}
```

### Dark Theme Variables

```css
.dark {
  --background: 0 0% 3.9%;
  --foreground: 0 0% 98%;
  --card: 0 0% 3.9%;
  --card-foreground: 0 0% 98%;
  --primary: 188 100% 45%;
  --primary-foreground: 0 0% 0%;
  --secondary: 0 0% 14.9%;
  --secondary-foreground: 0 0% 98%;
  --muted: 0 0% 14.9%;
  --muted-foreground: 0 0% 75%;
  --accent: 0 0% 14.9%;
  --accent-foreground: 0 0% 98%;
  --destructive: 0 62.8% 30.6%;
  --destructive-foreground: 0 0% 98%;
  --border: 0 0% 14.9%;
  --input: 0 0% 14.9%;
  --ring: 188 100% 45%;
}
```

## Tailwind Configuration

The `tailwind.config.js` includes theme-aware color definitions:

```javascript
colors: {
  background: 'hsl(var(--background))',
  foreground: 'hsl(var(--foreground))',
  card: {
    DEFAULT: 'hsl(var(--card))',
    foreground: 'hsl(var(--card-foreground))',
  },
  primary: {
    DEFAULT: 'hsl(var(--primary))',
    foreground: 'hsl(var(--primary-foreground))',
  },
  // ... more theme-aware colors
}
```

## Best Practices

### 1. Always Use Theme Variables

❌ **Don't use hardcoded colors:**

```tsx
<div className="bg-white text-black dark:bg-black dark:text-white">
```

✅ **Use theme variables:**

```tsx
<div className="bg-background text-foreground">
```

### 2. Use Theme Utilities for Dynamic Colors

❌ **Don't hardcode score colors:**

```tsx
const getScoreColor = score => {
  if (score >= 80) return 'text-green-500';
  if (score >= 60) return 'text-yellow-500';
  return 'text-red-500';
};
```

✅ **Use theme utilities:**

```tsx
import { useThemeStyles } from '@/hooks/useThemeStyles';

const { getScoreColor } = useThemeStyles();
const scoreColor = getScoreColor(score);
```

### 3. Use Theme-Aware Components

❌ **Don't create custom styled components:**

```tsx
<button className='bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded'>
  Click me
</button>
```

✅ **Use theme-aware components:**

```tsx
<ThemeAwareButton variant='primary'>Click me</ThemeAwareButton>
```

### 4. Combine Classes Properly

❌ **Don't concatenate strings:**

```tsx
const className = 'bg-background ' + 'text-foreground ' + customClass;
```

✅ **Use theme utilities:**

```tsx
import { combineThemeClasses } from '@/lib/utils/themeUtils';

const className = combineThemeClasses(
  'bg-background',
  'text-foreground',
  customClass
);
```

## Common Patterns

### 1. Score-Based Colors

```tsx
import { useThemeStyles } from '@/hooks/useThemeStyles';

const { getScoreColor, getScoreBgColor } = useThemeStyles();

const ScoreDisplay = ({ score }) => (
  <div className={`${getScoreBgColor(score)} rounded-lg p-4`}>
    <span className={`text-2xl font-bold ${getScoreColor(score)}`}>
      {score}
    </span>
  </div>
);
```

### 2. Category-Based Colors

```tsx
import { useThemeStyles } from '@/hooks/useThemeStyles';

const { getCategoryColors } = useThemeStyles();

const CategoryCard = ({ category, children }) => (
  <div
    className={`bg-gradient-to-r ${getCategoryColors(category)} rounded-lg p-4`}
  >
    {children}
  </div>
);
```

### 3. Status-Based Colors

```tsx
import { useThemeStyles } from '@/hooks/useThemeStyles';

const { getStatusBadgeClasses } = useThemeStyles();

const StatusBadge = ({ status, children }) => (
  <span className={getStatusBadgeClasses(status)}>{children}</span>
);
```

### 4. Conditional Theme Classes

```tsx
import { useThemeStyles } from '@/hooks/useThemeStyles';

const { getThemeClass } = useThemeStyles();

const ConditionalComponent = () => (
  <div
    className={getThemeClass(
      'bg-white text-black', // light theme
      'bg-black text-white' // dark theme
    )}
  >
    Content
  </div>
);
```

## Component Guidelines

### 1. Card Components

Always use theme-aware card classes:

```tsx
// Basic card
<div className="bg-card border border-border rounded-lg p-6">

// Elevated card
<div className="bg-card border border-border rounded-lg p-6 shadow-md hover:shadow-lg">

// Glass card
<div className="bg-card/80 backdrop-blur-sm border border-border/50 rounded-lg p-6">

// Interactive card
<div className="bg-card border border-border rounded-lg p-6 hover:border-primary-500/30 cursor-pointer transition-all">
```

### 2. Button Components

Use theme-aware button variants:

```tsx
// Primary button
<button className="bg-primary text-primary-foreground hover:bg-primary/90">

// Secondary button
<button className="bg-secondary text-secondary-foreground hover:bg-secondary/80">

// Outline button
<button className="border border-border text-foreground hover:bg-muted">

// Ghost button
<button className="text-foreground hover:bg-muted">
```

### 3. Input Components

Use theme-aware input styling:

```tsx
<input className='bg-background border border-input text-foreground placeholder:text-muted-foreground focus:border-ring focus:ring-2 focus:ring-ring/20' />
```

### 4. Text Components

Use semantic text colors:

```tsx
// Primary text
<span className="text-foreground">

// Secondary text
<span className="text-muted-foreground">

// Accent text
<span className="text-accent-foreground">
```

## Testing Theme Implementation

### 1. Visual Testing

- Test both light and dark themes
- Verify all components switch properly
- Check contrast ratios meet accessibility standards
- Test theme persistence across page reloads

### 2. Automated Testing

```tsx
import { render, screen } from '@testing-library/react';
import { ThemeProvider } from '@/contexts/ThemeContext';

const renderWithTheme = (component, theme = 'light') => {
  return render(
    <ThemeProvider defaultTheme={theme}>{component}</ThemeProvider>
  );
};

test('component respects theme', () => {
  renderWithTheme(<MyComponent />, 'dark');
  expect(screen.getByTestId('my-component')).toHaveClass('dark:bg-black');
});
```

## Migration Guide

### Converting Existing Components

1. **Replace hardcoded colors:**

   ```tsx
   // Before
   className = 'bg-white text-black dark:bg-black dark:text-white';

   // After
   className = 'bg-background text-foreground';
   ```

2. **Use theme utilities:**

   ```tsx
   // Before
   const getColor = score => (score > 80 ? 'text-green-500' : 'text-red-500');

   // After
   const { getScoreColor } = useThemeStyles();
   const color = getScoreColor(score);
   ```

3. **Replace custom components:**

   ```tsx
   // Before
   <div className="bg-blue-500 text-white px-4 py-2 rounded">

   // After
   <ThemeAwareButton variant="primary">
   ```

## Troubleshooting

### Common Issues

1. **Hydration Mismatch**
   - Ensure theme is initialized properly
   - Use `suppressHydrationWarning` for theme-dependent content

2. **Colors Not Switching**
   - Check CSS variables are defined
   - Verify Tailwind classes are using theme variables
   - Ensure theme context is properly wrapped

3. **Performance Issues**
   - Use `useMemo` for expensive theme calculations
   - Avoid inline theme-dependent styles
   - Use CSS variables instead of JavaScript calculations

### Debug Tools

```tsx
// Theme debug component
const ThemeDebugger = () => {
  const { theme } = useTheme();

  return (
    <div className='fixed bottom-4 right-4 bg-background border border-border p-2 rounded'>
      Current theme: {theme}
    </div>
  );
};
```

## Accessibility Considerations

1. **Contrast Ratios**
   - All theme colors meet WCAG AA standards
   - Test with accessibility tools
   - Provide high contrast mode support

2. **Reduced Motion**
   - Respect `prefers-reduced-motion`
   - Provide alternative animations
   - Use CSS media queries

3. **Color Independence**
   - Don't rely solely on color for information
   - Use icons and text alongside colors
   - Test with colorblind users

## Future Enhancements

1. **Additional Themes**
   - High contrast theme
   - Custom color themes
   - Seasonal themes

2. **Advanced Features**
   - Theme transitions
   - Theme-specific animations
   - Dynamic theme generation

3. **Performance Optimizations**
   - Theme-specific CSS splitting
   - Lazy loading of theme assets
   - Optimized theme switching

## Resources

- [Tailwind CSS Dark Mode](https://tailwindcss.com/docs/dark-mode)
- [CSS Custom Properties](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties)
- [WCAG Color Contrast](https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html)
- [React Context API](https://reactjs.org/docs/context.html)
