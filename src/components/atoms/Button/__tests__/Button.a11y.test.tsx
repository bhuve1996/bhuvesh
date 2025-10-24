import { render } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import React from 'react';

import { Button } from '../Button';

expect.extend(toHaveNoViolations);

describe('Button Accessibility', () => {
  it('should not have accessibility violations with default props', async () => {
    const { container } = render(<Button>Test Button</Button>);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should not have accessibility violations when disabled', async () => {
    const { container } = render(<Button disabled>Disabled Button</Button>);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should not have accessibility violations when loading', async () => {
    const { container } = render(<Button loading>Loading Button</Button>);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should not have accessibility violations with icon', async () => {
    const icon = <span aria-hidden='true'>🚀</span>;
    const { container } = render(<Button icon={icon}>Button with Icon</Button>);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should not have accessibility violations with different variants', async () => {
    const variants = [
      'primary',
      'secondary',
      'outline',
      'ghost',
      'destructive',
      'success',
      'warning',
      'default',
    ] as const;

    for (const variant of variants) {
      const { container, unmount } = render(
        <Button variant={variant}>{variant} Button</Button>
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
      unmount();
    }
  });

  it('should not have accessibility violations with different sizes', async () => {
    const sizes = ['sm', 'md', 'lg', 'xl'] as const;

    for (const size of sizes) {
      const { container, unmount } = render(
        <Button size={size}>{size} Button</Button>
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
      unmount();
    }
  });

  it('should have proper ARIA attributes when disabled', async () => {
    const { container } = render(<Button disabled>Disabled Button</Button>);
    const button = container.querySelector('button');

    expect(button).toHaveAttribute('aria-disabled', 'true');
    expect(button).toBeDisabled();

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should have proper ARIA attributes when loading', async () => {
    const { container } = render(<Button loading>Loading Button</Button>);
    const button = container.querySelector('button');

    expect(button).toHaveAttribute('aria-busy', 'true');
    expect(button).toBeDisabled();

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should have proper focus management', async () => {
    const { container } = render(<Button>Focusable Button</Button>);
    const button = container.querySelector('button');

    expect(button).toHaveAttribute('tabIndex', '0');

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should have proper button type', async () => {
    const { container } = render(<Button type='submit'>Submit Button</Button>);
    const button = container.querySelector('button');

    expect(button).toHaveAttribute('type', 'submit');

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
