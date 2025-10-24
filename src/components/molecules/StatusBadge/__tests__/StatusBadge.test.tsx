import { render, screen } from '@testing-library/react';
import React from 'react';

import { StatusBadge } from '../StatusBadge';

describe('StatusBadge Component', () => {
  const defaultProps = {
    status: 'success' as const,
    children: 'Success Message',
  };

  it('renders with default props', () => {
    render(<StatusBadge {...defaultProps} />);
    const badge = screen.getByText('Success Message');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass(
      'inline-flex',
      'items-center',
      'gap-1.5',
      'rounded-full'
    );
  });

  it('renders with different status types', () => {
    const { rerender } = render(
      <StatusBadge {...defaultProps} status='success' />
    );
    expect(screen.getByText('Success Message')).toHaveClass(
      'bg-success-50',
      'text-success-700'
    );

    rerender(<StatusBadge {...defaultProps} status='error' />);
    expect(screen.getByText('Success Message')).toHaveClass(
      'bg-error-50',
      'text-error-700'
    );

    rerender(<StatusBadge {...defaultProps} status='warning' />);
    expect(screen.getByText('Success Message')).toHaveClass(
      'bg-warning-50',
      'text-warning-700'
    );

    rerender(<StatusBadge {...defaultProps} status='info' />);
    expect(screen.getByText('Success Message')).toHaveClass(
      'bg-primary-50',
      'text-primary-700'
    );

    rerender(<StatusBadge {...defaultProps} status='neutral' />);
    expect(screen.getByText('Success Message')).toHaveClass(
      'bg-neutral-50',
      'text-neutral-700'
    );
  });

  it('renders with different variants', () => {
    const { rerender } = render(
      <StatusBadge {...defaultProps} variant='solid' />
    );
    expect(screen.getByText('Success Message')).toHaveClass(
      'bg-success-500',
      'text-success-50'
    );

    rerender(<StatusBadge {...defaultProps} variant='outline' />);
    expect(screen.getByText('Success Message')).toHaveClass(
      'border',
      'border-success-500',
      'text-success-600',
      'bg-transparent'
    );

    rerender(<StatusBadge {...defaultProps} variant='soft' />);
    expect(screen.getByText('Success Message')).toHaveClass(
      'bg-success-50',
      'text-success-700',
      'border',
      'border-success-200'
    );
  });

  it('renders with different sizes', () => {
    const { rerender } = render(<StatusBadge {...defaultProps} size='sm' />);
    expect(screen.getByText('Success Message')).toHaveClass(
      'px-2',
      'py-1',
      'text-xs'
    );

    rerender(<StatusBadge {...defaultProps} size='md' />);
    expect(screen.getByText('Success Message')).toHaveClass(
      'px-3',
      'py-1.5',
      'text-sm'
    );

    rerender(<StatusBadge {...defaultProps} size='lg' />);
    expect(screen.getByText('Success Message')).toHaveClass(
      'px-4',
      'py-2',
      'text-base'
    );
  });

  it('renders with icon', () => {
    const icon = <span data-testid='icon'>✅</span>;
    render(<StatusBadge {...defaultProps} icon={icon} />);

    const badge = screen.getByText('Success Message');
    const iconElement = screen.getByTestId('icon');

    expect(iconElement).toBeInTheDocument();
    expect(badge).toContainElement(iconElement);
  });

  it('applies correct icon size classes', () => {
    const icon = <span data-testid='icon'>✅</span>;

    const { rerender } = render(
      <StatusBadge {...defaultProps} icon={icon} size='sm' />
    );
    const iconWrapper = screen.getByTestId('icon').parentElement;
    expect(iconWrapper).toHaveClass('w-3', 'h-3');

    rerender(<StatusBadge {...defaultProps} icon={icon} size='md' />);
    expect(iconWrapper).toHaveClass('w-4', 'h-4');

    rerender(<StatusBadge {...defaultProps} icon={icon} size='lg' />);
    expect(iconWrapper).toHaveClass('w-5', 'h-5');
  });

  it('does not render icon when not provided', () => {
    render(<StatusBadge {...defaultProps} />);
    const badge = screen.getByText('Success Message');

    // Should not contain any icon elements
    expect(badge.querySelector('[data-testid="icon"]')).not.toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(<StatusBadge {...defaultProps} className='custom-class' />);
    expect(screen.getByText('Success Message')).toHaveClass('custom-class');
  });

  it('renders with complex children', () => {
    render(
      <StatusBadge {...defaultProps}>
        <span>Complex</span>
        <span>Content</span>
      </StatusBadge>
    );

    expect(screen.getByText('Complex')).toBeInTheDocument();
    expect(screen.getByText('Content')).toBeInTheDocument();
  });

  it('combines multiple props correctly', () => {
    const icon = <span data-testid='icon'>⚠️</span>;
    render(
      <StatusBadge
        {...defaultProps}
        status='warning'
        variant='outline'
        size='lg'
        icon={icon}
        className='custom-class'
      />
    );

    const badge = screen.getByText('Success Message');
    expect(badge).toHaveClass(
      'border-warning-500',
      'text-warning-600',
      'bg-transparent',
      'px-4',
      'py-2',
      'text-base',
      'custom-class'
    );

    const iconWrapper = screen.getByTestId('icon').parentElement;
    expect(iconWrapper).toHaveClass('w-5', 'h-5');
  });

  it('handles all status and variant combinations', () => {
    const statuses = [
      'success',
      'error',
      'warning',
      'info',
      'neutral',
    ] as const;
    const variants = ['solid', 'outline', 'soft'] as const;

    statuses.forEach(status => {
      variants.forEach(variant => {
        const { unmount } = render(
          <StatusBadge status={status} variant={variant}>
            {`${status} ${variant}`}
          </StatusBadge>
        );

        const badge = screen.getByText(`${status} ${variant}`);
        expect(badge).toBeInTheDocument();
        expect(badge).toHaveClass(
          'inline-flex',
          'items-center',
          'gap-1.5',
          'rounded-full'
        );

        unmount();
      });
    });
  });
});
