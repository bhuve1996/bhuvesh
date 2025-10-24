import { render } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import React from 'react';

import { FormField } from '../FormField';

expect.extend(toHaveNoViolations);

describe('FormField Accessibility', () => {
  it('should not have accessibility violations with basic props', async () => {
    const { container } = render(
      <FormField label='Test Field'>
        <input type='text' />
      </FormField>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should not have accessibility violations with required field', async () => {
    const { container } = render(
      <FormField label='Required Field' required>
        <input type='text' />
      </FormField>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should not have accessibility violations with help text', async () => {
    const { container } = render(
      <FormField label='Test Field' helpText='This is help text'>
        <input type='text' />
      </FormField>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should not have accessibility violations with error message', async () => {
    const { container } = render(
      <FormField label='Test Field' error='This is an error'>
        <input type='text' />
      </FormField>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should not have accessibility violations when disabled', async () => {
    const { container } = render(
      <FormField label='Disabled Field' disabled>
        <input type='text' />
      </FormField>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should have proper label association', async () => {
    const { container } = render(
      <FormField label='Test Field'>
        <input type='text' />
      </FormField>
    );

    const label = container.querySelector('label');
    const input = container.querySelector('input');

    expect(label).toHaveAttribute('for', input?.id);
    expect(input).toHaveAttribute('id');

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should have proper ARIA attributes for error state', async () => {
    const { container } = render(
      <FormField label='Test Field' error='This is an error'>
        <input type='text' />
      </FormField>
    );

    const input = container.querySelector('input');
    const errorMessage = container.querySelector('[role="alert"]');

    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(input).toHaveAttribute('aria-describedby');
    expect(errorMessage).toHaveAttribute('role', 'alert');
    expect(errorMessage).toHaveAttribute('aria-live', 'polite');

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should have proper ARIA attributes for help text', async () => {
    const { container } = render(
      <FormField label='Test Field' helpText='This is help text'>
        <input type='text' />
      </FormField>
    );

    const input = container.querySelector('input');
    const helpText = container.querySelector('p');

    expect(input).toHaveAttribute('aria-describedby');
    expect(helpText).toHaveAttribute('id');

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should have proper required indicator', async () => {
    const { container } = render(
      <FormField label='Required Field' required>
        <input type='text' />
      </FormField>
    );

    const requiredIndicator = container.querySelector(
      '[aria-label="required"]'
    );
    expect(requiredIndicator).toBeInTheDocument();
    expect(requiredIndicator).toHaveTextContent('*');

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should work with different input types', async () => {
    const inputTypes = [
      'text',
      'email',
      'password',
      'number',
      'tel',
      'url',
    ] as const;

    for (const type of inputTypes) {
      const { container, unmount } = render(
        <FormField label={`${type} Field`}>
          <input type={type} />
        </FormField>
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
      unmount();
    }
  });

  it('should work with textarea', async () => {
    const { container } = render(
      <FormField label='Textarea Field'>
        <textarea />
      </FormField>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should work with select', async () => {
    const { container } = render(
      <FormField label='Select Field'>
        <select>
          <option value='option1'>Option 1</option>
          <option value='option2'>Option 2</option>
        </select>
      </FormField>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should handle complex form controls', async () => {
    const { container } = render(
      <FormField label='Complex Field' helpText='This is a complex field'>
        <div>
          <input type='text' placeholder='First name' />
          <input type='text' placeholder='Last name' />
        </div>
      </FormField>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
