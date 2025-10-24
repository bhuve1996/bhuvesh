import { render, screen } from '@testing-library/react';
import React from 'react';

import { FormField } from '../FormField';

describe('FormField Component', () => {
  const defaultProps = {
    children: <input type='text' placeholder='Enter text' />,
  };

  it('renders with basic props', () => {
    render(<FormField {...defaultProps} label='Test Label' />);

    expect(screen.getByText('Test Label')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter text')).toBeInTheDocument();
  });

  it('renders without label', () => {
    render(<FormField {...defaultProps} />);
    expect(screen.getByPlaceholderText('Enter text')).toBeInTheDocument();
  });

  it('shows required indicator', () => {
    render(<FormField {...defaultProps} label='Required Field' required />);

    const label = screen.getByText('Required Field');
    const requiredIndicator = screen.getByText('*');

    expect(requiredIndicator).toBeInTheDocument();
    expect(requiredIndicator).toHaveAttribute('aria-label', 'required');
    expect(requiredIndicator).toHaveClass('text-error-500');
  });

  it('shows help text', () => {
    render(
      <FormField
        {...defaultProps}
        label='Test Field'
        helpText='This is help text'
      />
    );

    expect(screen.getByText('This is help text')).toBeInTheDocument();
  });

  it('shows error message', () => {
    render(
      <FormField
        {...defaultProps}
        label='Test Field'
        error='This is an error'
      />
    );

    const errorMessage = screen.getByText('This is an error');
    expect(errorMessage).toBeInTheDocument();
    expect(errorMessage).toHaveAttribute('role', 'alert');
    expect(errorMessage).toHaveAttribute('aria-live', 'polite');
  });

  it('prioritizes error over help text', () => {
    render(
      <FormField
        {...defaultProps}
        label='Test Field'
        helpText='This is help text'
        error='This is an error'
      />
    );

    expect(screen.getByText('This is an error')).toBeInTheDocument();
    expect(screen.queryByText('This is help text')).not.toBeInTheDocument();
  });

  it('applies correct ARIA attributes to child input', () => {
    render(
      <FormField
        {...defaultProps}
        label='Test Field'
        error='This is an error'
        helpText='This is help text'
      />
    );

    const input = screen.getByPlaceholderText('Enter text');
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(input).toHaveAttribute('aria-describedby');
  });

  it('generates unique IDs for accessibility', () => {
    const { rerender } = render(
      <FormField {...defaultProps} label='Field 1' />
    );
    const firstInput = screen.getByLabelText('Field 1');
    const firstId = firstInput.id;

    rerender(<FormField {...defaultProps} label='Field 2' />);
    const secondInput = screen.getByLabelText('Field 2');
    const secondId = secondInput.id;

    expect(firstId).not.toBe(secondId);
  });

  it('uses custom ID when provided', () => {
    render(<FormField {...defaultProps} label='Test Field' id='custom-id' />);

    const input = screen.getByLabelText('Test Field');
    expect(input).toHaveAttribute('id', 'custom-id');
  });

  it('applies disabled styling to label', () => {
    render(<FormField {...defaultProps} label='Test Field' disabled />);

    const label = screen.getByText('Test Field');
    expect(label).toHaveClass('text-neutral-400', 'dark:text-neutral-500');
  });

  it('applies error styling to label', () => {
    render(
      <FormField {...defaultProps} label='Test Field' error='Error message' />
    );

    const label = screen.getByText('Test Field');
    expect(label).toHaveClass('text-error-600', 'dark:text-error-400');
  });

  it('applies custom className', () => {
    render(<FormField {...defaultProps} className='custom-class' />);

    const container = screen
      .getByPlaceholderText('Enter text')
      .closest('.space-y-2');
    expect(container).toHaveClass('custom-class');
  });

  it('forwards props to child element', () => {
    render(
      <FormField {...defaultProps}>
        <input type='email' data-testid='email-input' />
      </FormField>
    );

    const input = screen.getByTestId('email-input');
    expect(input).toHaveAttribute('type', 'email');
  });

  it('handles complex child components', () => {
    const ComplexInput = () => (
      <div data-testid='complex-input'>
        <input type='text' />
        <button type='button'>Clear</button>
      </div>
    );

    render(
      <FormField label='Complex Field'>
        <ComplexInput />
      </FormField>
    );

    expect(screen.getByTestId('complex-input')).toBeInTheDocument();
    expect(screen.getByText('Complex Field')).toBeInTheDocument();
  });
});
