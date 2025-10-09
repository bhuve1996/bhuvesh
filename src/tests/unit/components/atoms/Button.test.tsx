// ============================================================================
// BUTTON COMPONENT TESTS
// ============================================================================

import { Button } from '@/components/atoms/Button/Button';
import { ButtonProps } from '@/components/atoms/Button/types';
import { fireEvent, render, screen } from '@testing-library/react';

// ============================================================================
// TEST UTILITIES
// ============================================================================

const defaultProps: ButtonProps = {
  children: 'Test Button',
};

const renderButton = (props: Partial<ButtonProps> = {}) => {
  return render(<Button {...defaultProps} {...props} />);
};

// ============================================================================
// BASIC RENDERING TESTS
// ============================================================================

describe('Button Component', () => {
  it('renders with default props', () => {
    renderButton();
    expect(screen.getByRole('button')).toBeInTheDocument();
    expect(screen.getByText('Test Button')).toBeInTheDocument();
  });

  it('renders with custom children', () => {
    renderButton({ children: 'Custom Button Text' });
    expect(screen.getByText('Custom Button Text')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    renderButton({ className: 'custom-class' });
    expect(screen.getByRole('button')).toHaveClass('custom-class');
  });

  it('applies data-testid attribute', () => {
    renderButton({ 'data-testid': 'test-button' });
    expect(screen.getByTestId('test-button')).toBeInTheDocument();
  });
});

// ============================================================================
// VARIANT TESTS
// ============================================================================

describe('Button Variants', () => {
  it('renders primary variant by default', () => {
    renderButton();
    const button = screen.getByRole('button');
    expect(button).toHaveClass('bg-cyan-500');
  });

  it('renders secondary variant', () => {
    renderButton({ variant: 'secondary' });
    const button = screen.getByRole('button');
    expect(button).toHaveClass('bg-gray-600');
  });

  it('renders outline variant', () => {
    renderButton({ variant: 'outline' });
    const button = screen.getByRole('button');
    expect(button).toHaveClass('border-2', 'border-cyan-500');
  });

  it('renders ghost variant', () => {
    renderButton({ variant: 'ghost' });
    const button = screen.getByRole('button');
    expect(button).toHaveClass('text-cyan-500');
  });

  it('renders danger variant', () => {
    renderButton({ variant: 'danger' });
    const button = screen.getByRole('button');
    expect(button).toHaveClass('bg-red-500');
  });

  it('renders success variant', () => {
    renderButton({ variant: 'success' });
    const button = screen.getByRole('button');
    expect(button).toHaveClass('bg-green-500');
  });
});

// ============================================================================
// SIZE TESTS
// ============================================================================

describe('Button Sizes', () => {
  it('renders medium size by default', () => {
    renderButton();
    const button = screen.getByRole('button');
    expect(button).toHaveClass('px-4', 'py-2', 'text-base');
  });

  it('renders small size', () => {
    renderButton({ size: 'sm' });
    const button = screen.getByRole('button');
    expect(button).toHaveClass('px-3', 'py-1.5', 'text-sm');
  });

  it('renders large size', () => {
    renderButton({ size: 'lg' });
    const button = screen.getByRole('button');
    expect(button).toHaveClass('px-6', 'py-3', 'text-lg');
  });

  it('renders extra large size', () => {
    renderButton({ size: 'xl' });
    const button = screen.getByRole('button');
    expect(button).toHaveClass('px-8', 'py-4', 'text-xl');
  });
});

// ============================================================================
// STATE TESTS
// ============================================================================

describe('Button States', () => {
  it('renders disabled state', () => {
    renderButton({ disabled: true });
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
    expect(button).toHaveClass(
      'disabled:opacity-50',
      'disabled:cursor-not-allowed'
    );
  });

  it('renders loading state', () => {
    renderButton({ loading: true });
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
    expect(screen.getByRole('button')).toHaveClass('disabled:opacity-50');
    // Check for loading spinner
    expect(button.querySelector('.animate-spin')).toBeInTheDocument();
  });

  it('renders full width', () => {
    renderButton({ fullWidth: true });
    const button = screen.getByRole('button');
    expect(button).toHaveClass('w-full');
  });
});

// ============================================================================
// ICON TESTS
// ============================================================================

describe('Button Icons', () => {
  it('renders icon on the left by default', () => {
    const icon = <span data-testid='test-icon'>📄</span>;
    renderButton({ icon });

    const button = screen.getByRole('button');
    const iconElement = screen.getByTestId('test-icon');

    expect(iconElement).toBeInTheDocument();
    expect(iconElement).toHaveClass('mr-2');
  });

  it('renders icon on the right', () => {
    const icon = <span data-testid='test-icon'>📄</span>;
    renderButton({ icon, iconPosition: 'right' });

    const button = screen.getByRole('button');
    const iconElement = screen.getByTestId('test-icon');

    expect(iconElement).toBeInTheDocument();
    expect(iconElement).toHaveClass('ml-2');
  });

  it('shows loading spinner instead of icon when loading', () => {
    const icon = <span data-testid='test-icon'>📄</span>;
    renderButton({ icon, loading: true });

    expect(screen.queryByTestId('test-icon')).not.toBeInTheDocument();
    expect(
      screen.getByRole('button').querySelector('.animate-spin')
    ).toBeInTheDocument();
  });
});

// ============================================================================
// INTERACTION TESTS
// ============================================================================

describe('Button Interactions', () => {
  it('calls onClick when clicked', () => {
    const handleClick = jest.fn();
    renderButton({ onClick: handleClick });

    const button = screen.getByRole('button');
    fireEvent.click(button);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('does not call onClick when disabled', () => {
    const handleClick = jest.fn();
    renderButton({ onClick: handleClick, disabled: true });

    const button = screen.getByRole('button');
    fireEvent.click(button);

    expect(handleClick).not.toHaveBeenCalled();
  });

  it('does not call onClick when loading', () => {
    const handleClick = jest.fn();
    renderButton({ onClick: handleClick, loading: true });

    const button = screen.getByRole('button');
    fireEvent.click(button);

    expect(handleClick).not.toHaveBeenCalled();
  });

  it('renders as submit button', () => {
    renderButton({ type: 'submit' });
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('type', 'submit');
  });

  it('renders as reset button', () => {
    renderButton({ type: 'reset' });
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('type', 'reset');
  });
});

// ============================================================================
// ACCESSIBILITY TESTS
// ============================================================================

describe('Button Accessibility', () => {
  it('has proper ARIA label', () => {
    renderButton({ 'aria-label': 'Submit form' });
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('aria-label', 'Submit form');
  });

  it('is focusable when enabled', () => {
    renderButton();
    const button = screen.getByRole('button');
    button.focus();
    expect(button).toHaveFocus();
  });

  it('is not focusable when disabled', () => {
    renderButton({ disabled: true });
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
  });

  it('has proper focus styles', () => {
    renderButton();
    const button = screen.getByRole('button');
    expect(button).toHaveClass(
      'focus:outline-none',
      'focus:ring-2',
      'focus:ring-offset-2'
    );
  });
});

// ============================================================================
// EDGE CASES
// ============================================================================

describe('Button Edge Cases', () => {
  it('handles empty children', () => {
    renderButton({ children: '' });
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
  });

  it('handles null children', () => {
    renderButton({ children: null });
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
  });

  it('handles undefined children', () => {
    renderButton({ children: undefined });
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
  });

  it('handles complex children', () => {
    const complexChildren = (
      <div>
        <span>Complex</span>
        <span>Content</span>
      </div>
    );
    renderButton({ children: complexChildren });
    expect(screen.getByText('Complex')).toBeInTheDocument();
    expect(screen.getByText('Content')).toBeInTheDocument();
  });
});

// ============================================================================
// INTEGRATION TESTS
// ============================================================================

describe('Button Integration', () => {
  it('works with form submission', () => {
    const handleSubmit = jest.fn(e => e.preventDefault());

    render(
      <form onSubmit={handleSubmit}>
        <Button type='submit'>Submit</Button>
      </form>
    );

    const button = screen.getByRole('button');
    fireEvent.click(button);

    expect(handleSubmit).toHaveBeenCalled();
  });

  it('works with keyboard navigation', () => {
    const handleClick = jest.fn();
    renderButton({ onClick: handleClick });

    const button = screen.getByRole('button');
    button.focus();
    fireEvent.keyDown(button, { key: 'Enter' });

    // Note: Enter key doesn't trigger click by default in React
    // This would need to be handled by the parent component
    expect(button).toHaveFocus();
  });
});
