import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';

import { Button } from '../Button';

describe('Button Component', () => {
  const defaultProps = {
    children: 'Test Button',
  };

  it('renders with default props', () => {
    render(<Button {...defaultProps} />);
    const button = screen.getByRole('button', { name: /test button/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('inline-flex', 'items-center', 'justify-center');
  });

  it('renders with different variants', () => {
    const { rerender } = render(<Button {...defaultProps} variant='primary' />);
    expect(screen.getByRole('button')).toHaveClass('bg-primary-500');

    rerender(<Button {...defaultProps} variant='secondary' />);
    expect(screen.getByRole('button')).toHaveClass('bg-secondary-500');

    rerender(<Button {...defaultProps} variant='outline' />);
    expect(screen.getByRole('button')).toHaveClass(
      'border-2',
      'border-primary-500'
    );

    rerender(<Button {...defaultProps} variant='ghost' />);
    expect(screen.getByRole('button')).toHaveClass('text-primary-600');

    rerender(<Button {...defaultProps} variant='destructive' />);
    expect(screen.getByRole('button')).toHaveClass('bg-error-500');
  });

  it('renders with different sizes', () => {
    const { rerender } = render(<Button {...defaultProps} size='sm' />);
    expect(screen.getByRole('button')).toHaveClass('px-3', 'py-2', 'text-sm');

    rerender(<Button {...defaultProps} size='md' />);
    expect(screen.getByRole('button')).toHaveClass('px-6', 'py-3', 'text-base');

    rerender(<Button {...defaultProps} size='lg' />);
    expect(screen.getByRole('button')).toHaveClass('px-8', 'py-4', 'text-lg');

    rerender(<Button {...defaultProps} size='xl' />);
    expect(screen.getByRole('button')).toHaveClass('px-10', 'py-5', 'text-xl');
  });

  it('handles click events', async () => {
    const handleClick = jest.fn();
    render(<Button {...defaultProps} onClick={handleClick} />);

    const button = screen.getByRole('button');
    await userEvent.click(button);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('handles keyboard events', async () => {
    const handleClick = jest.fn();
    render(<Button {...defaultProps} onClick={handleClick} />);

    const button = screen.getByRole('button');
    button.focus();
    await userEvent.keyboard('{Enter}');

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('shows loading state', () => {
    render(<Button {...defaultProps} loading />);
    const button = screen.getByRole('button');

    expect(button).toBeDisabled();
    expect(button).toHaveAttribute('aria-busy', 'true');
    expect(screen.getByRole('button')).toContainHTML('animate-spin');
  });

  it('shows disabled state', () => {
    render(<Button {...defaultProps} disabled />);
    const button = screen.getByRole('button');

    expect(button).toBeDisabled();
    expect(button).toHaveAttribute('aria-disabled', 'true');
    expect(button).toHaveClass('disabled:opacity-50');
  });

  it('renders with icon', () => {
    const icon = <span data-testid='icon'>🚀</span>;
    render(<Button {...defaultProps} icon={icon} />);

    expect(screen.getByTestId('icon')).toBeInTheDocument();
  });

  it('renders with icon on right side', () => {
    const icon = <span data-testid='icon'>🚀</span>;
    render(<Button {...defaultProps} icon={icon} iconPosition='right' />);

    const button = screen.getByRole('button');
    const iconElement = screen.getByTestId('icon');

    expect(button).toContainElement(iconElement);
    expect(iconElement).toHaveClass('ml-2');
  });

  it('applies full width class', () => {
    render(<Button {...defaultProps} fullWidth />);
    expect(screen.getByRole('button')).toHaveClass('w-full');
  });

  it('applies custom className', () => {
    render(<Button {...defaultProps} className='custom-class' />);
    expect(screen.getByRole('button')).toHaveClass('custom-class');
  });

  it('does not call onClick when disabled', async () => {
    const handleClick = jest.fn();
    render(<Button {...defaultProps} onClick={handleClick} disabled />);

    const button = screen.getByRole('button');
    await userEvent.click(button);

    expect(handleClick).not.toHaveBeenCalled();
  });

  it('does not call onClick when loading', async () => {
    const handleClick = jest.fn();
    render(<Button {...defaultProps} onClick={handleClick} loading />);

    const button = screen.getByRole('button');
    await userEvent.click(button);

    expect(handleClick).not.toHaveBeenCalled();
  });

  it('renders with correct button type', () => {
    render(<Button {...defaultProps} type='submit' />);
    expect(screen.getByRole('button')).toHaveAttribute('type', 'submit');
  });

  it('forwards additional props', () => {
    render(<Button {...defaultProps} data-testid='custom-button' />);
    expect(screen.getByTestId('custom-button')).toBeInTheDocument();
  });
});
