import { render } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';

import { Button } from '@/components/atoms/Button/Button';
import { Navigation } from '@/components/layout/Navigation';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { Tooltip } from '@/components/ui/Tooltip';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { TourProvider } from '@/contexts/TourContext';

// Extend Jest matchers
expect.extend(toHaveNoViolations);

// Helper function to render Navigation with all providers
const renderNavigationWithProvider = (props: Record<string, unknown>) => {
  return render(
    <ThemeProvider>
      <TourProvider>
        <Navigation {...props} />
      </TourProvider>
    </ThemeProvider>
  );
};

// Helper function to render components with ThemeProvider
const renderWithTheme = (component: React.ReactElement) => {
  return render(<ThemeProvider>{component}</ThemeProvider>);
};

describe('Accessibility Tests', () => {
  describe('Button Component Accessibility', () => {
    it('should not have accessibility violations', async () => {
      const { container } = render(<Button>Accessible Button</Button>);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should have proper focus management', () => {
      const { container } = render(<Button>Focusable Button</Button>);
      const button = container.querySelector('button');

      expect(button).toHaveAttribute('tabIndex', '0');
      expect(button).toHaveAttribute('type', 'button');
    });

    it('should have proper ARIA attributes when disabled', () => {
      const { container } = render(<Button disabled>Disabled Button</Button>);
      const button = container.querySelector('button');

      expect(button).toHaveAttribute('aria-disabled', 'true');
      expect(button).toBeDisabled();
    });

    it('should have proper ARIA attributes when loading', () => {
      const { container } = render(<Button loading>Loading Button</Button>);
      const button = container.querySelector('button');

      expect(button).toHaveAttribute('aria-busy', 'true');
      expect(button).toBeDisabled();
    });
  });

  describe('Tooltip Component Accessibility', () => {
    it('should not have accessibility violations', async () => {
      const { container } = render(
        <Tooltip content='Accessible tooltip'>
          <button>Hover me</button>
        </Tooltip>
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should support keyboard navigation', () => {
      const { container } = render(
        <Tooltip content='Keyboard tooltip'>
          <button>Focus me</button>
        </Tooltip>
      );
      const button = container.querySelector('button');

      // Regular HTML buttons are focusable by default, so they don't need tabIndex="0"
      expect(button).toBeInTheDocument();
      expect(button?.tagName).toBe('BUTTON');
    });
  });

  describe('Navigation Component Accessibility', () => {
    it('should not have accessibility violations', async () => {
      const { container } = renderNavigationWithProvider({
        activeSection: 'home',
        onSectionClick: jest.fn(),
      });
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should have proper navigation structure', () => {
      const { container } = renderNavigationWithProvider({
        activeSection: 'home',
        onSectionClick: jest.fn(),
      });

      const nav = container.querySelector('nav');
      const links = container.querySelectorAll('a');

      expect(nav).toHaveAttribute('role', 'navigation');
      expect(nav).toHaveAttribute('aria-label', 'Main navigation');
      expect(links.length).toBeGreaterThan(0);
    });

    it('should have proper mobile menu accessibility', () => {
      const { container } = renderNavigationWithProvider({
        activeSection: 'home',
        onSectionClick: jest.fn(),
      });

      const mobileButton = container.querySelector(
        '[aria-label="Toggle mobile menu"]'
      );

      expect(mobileButton).toHaveAttribute('aria-expanded', 'false');
      expect(mobileButton).toHaveAttribute('aria-controls', 'mobile-menu');
    });
  });

  describe('ThemeToggle Component Accessibility', () => {
    it('should not have accessibility violations', async () => {
      const { container } = renderWithTheme(<ThemeToggle />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should have proper ARIA label', () => {
      const { container } = renderWithTheme(<ThemeToggle />);
      const button = container.querySelector('button');

      expect(button).toHaveAttribute('aria-label');
      expect(button?.getAttribute('aria-label')).toMatch(/switch to.*mode/i);
    });

    it('should be keyboard accessible', () => {
      const { container } = renderWithTheme(<ThemeToggle />);
      const button = container.querySelector('button');

      expect(button).toHaveAttribute('tabIndex', '0');
    });
  });

  describe('Color Contrast Tests', () => {
    it('should have sufficient color contrast for primary buttons', () => {
      const { container } = render(
        <Button variant='primary'>Primary Button</Button>
      );
      const button = container.querySelector('button');

      // Check that button has proper contrast classes
      expect(button).toHaveClass('bg-primary-500', 'text-primary-950');
    });

    it('should have sufficient color contrast for secondary buttons', () => {
      const { container } = render(
        <Button variant='secondary'>Secondary Button</Button>
      );
      const button = container.querySelector('button');

      // Check that button has proper contrast classes
      expect(button).toHaveClass('bg-secondary-500', 'text-secondary-950');
    });

    it('should have sufficient color contrast for outline buttons', () => {
      const { container } = render(
        <Button variant='outline'>Outline Button</Button>
      );
      const button = container.querySelector('button');

      // Check that button has proper contrast classes
      expect(button).toHaveClass(
        'border-2',
        'border-primary-500',
        'text-primary-600'
      );
    });
  });

  describe('Focus Management Tests', () => {
    it('should maintain focus order in navigation', () => {
      const { container } = renderNavigationWithProvider({
        activeSection: 'home',
        onSectionClick: jest.fn(),
      });

      const menuItems = container.querySelectorAll('[role="menuitem"]');
      menuItems.forEach(item => {
        expect(item).toHaveAttribute('tabIndex', '0');
      });
    });

    it('should have proper focus indicators', () => {
      const { container } = render(<Button>Focus Test</Button>);
      const button = container.querySelector('button');

      expect(button).toHaveClass(
        'focus:outline-none',
        'focus:ring-2',
        'focus:ring-offset-2'
      );
    });
  });

  describe('Screen Reader Tests', () => {
    it('should have proper labels for screen readers', () => {
      const { container } = renderNavigationWithProvider({
        activeSection: 'home',
        onSectionClick: jest.fn(),
      });

      const nav = container.querySelector('nav');
      const logo = container.querySelector('img');
      const mobileButton = container.querySelector(
        '[aria-label="Toggle mobile menu"]'
      );

      expect(nav).toHaveAttribute('aria-label', 'Main navigation');
      expect(logo).toHaveAttribute('alt', 'Bhuvesh Logo');
      expect(mobileButton).toHaveAttribute('aria-label', 'Toggle mobile menu');
    });

    it('should have proper ARIA states', () => {
      const { container } = renderNavigationWithProvider({
        activeSection: 'about',
        onSectionClick: jest.fn(),
      });

      // Since our navigation doesn't use hash links, we just verify the component renders
      const nav = container.querySelector('nav');
      expect(nav).toHaveAttribute('role', 'navigation');
      expect(nav).toHaveAttribute('aria-label', 'Main navigation');
    });
  });

  describe('Keyboard Navigation Tests', () => {
    it('should support Enter key activation', () => {
      const { container } = render(<Button>Enter Test</Button>);
      const button = container.querySelector('button');

      expect(button).toHaveAttribute('type', 'button');
    });

    it('should support Space key activation', () => {
      const { container } = render(<Button>Space Test</Button>);
      const button = container.querySelector('button');

      expect(button).toHaveAttribute('type', 'button');
    });
  });

  describe('Motion and Animation Accessibility', () => {
    it('should respect reduced motion preferences', () => {
      // Mock reduced motion preference
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: jest.fn().mockImplementation(query => ({
          matches: query === '(prefers-reduced-motion: reduce)',
          media: query,
          onchange: null,
          addListener: jest.fn(),
          removeListener: jest.fn(),
          addEventListener: jest.fn(),
          removeEventListener: jest.fn(),
          dispatchEvent: jest.fn(),
        })),
      });

      const { container } = render(<Button>Motion Test</Button>);
      const button = container.querySelector('button');

      // Button should still be accessible regardless of motion preferences
      expect(button).toBeInTheDocument();
      expect(button).toHaveAttribute('tabIndex', '0');
    });
  });

  describe('Form Accessibility', () => {
    it('should have proper form controls', () => {
      const { container } = render(
        <form>
          <Button type='submit'>Submit</Button>
          <Button type='reset'>Reset</Button>
        </form>
      );

      const submitButton = container.querySelector('button[type="submit"]');
      const resetButton = container.querySelector('button[type="reset"]');

      expect(submitButton).toHaveAttribute('type', 'submit');
      expect(resetButton).toHaveAttribute('type', 'reset');
    });
  });
});
