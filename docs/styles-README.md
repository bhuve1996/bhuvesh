# Styles Directory

This directory contains all custom CSS styles for the portfolio project, organized by functionality.

## File Structure

```
src/styles/
├── index.css              # Main styles index file
├── loading-animations.css # Loading animation styles
└── README.md             # This documentation file
```

## Files Description

### `index.css`

- Main entry point for all custom styles
- Imports all other CSS files
- Can be used to add global custom styles

### `loading-animations.css`

- Contains all loading animation keyframes and utility classes
- Includes animations for:
  - `orbit-pulse`: Orbital ring segment pulsing
  - `pulse-glow`: Glowing effect for segments
  - `data-flow`: Data flow animation for dots
  - `loading-progress`: Progress ring animation
  - `loading-dots`: Bouncing dots animation
  - `particle-float`: Background particle movement
  - `core-pulse`: Center core pulsing effect
  - `ring-rotate`: Ring rotation animations
  - `text-fade`: Text fade animation

## Usage

The styles are automatically imported through the main `globals.css` file:

```css
/* In src/app/globals.css */
@import '../styles/index.css';
```

## Adding New Styles

1. Create a new CSS file in this directory (e.g., `components.css`)
2. Add the import to `index.css`:
   ```css
   @import './components.css';
   ```
3. The styles will be automatically available throughout the application

## Animation Classes

The loading animations provide utility classes that can be used directly in components:

```tsx
// Example usage in components
<div className="animate-orbit-pulse">...</div>
<div className="animate-pulse-glow">...</div>
<div className="animate-data-flow">...</div>
```

## Best Practices

- Keep related styles in separate files
- Use descriptive file names
- Document complex animations
- Follow CSS naming conventions
- Use CSS custom properties for consistent theming
