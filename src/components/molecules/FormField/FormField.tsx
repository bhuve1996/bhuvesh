import React from 'react';

import {
  createAccessibleFormFieldProps,
  createAccessibleStatusProps,
  createAriaDescribedBy,
  createAriaLabelledBy,
  generateId,
} from '@/lib/accessibility';
import { cn } from '@/lib/design-tokens';
import type { FormFieldProps } from '@/types';

export const FormField: React.FC<FormFieldProps> = ({
  label,
  error,
  required = false,
  disabled = false,
  className = '',
  children,
  helpText,
  id,
  ...props
}) => {
  const fieldId = id || generateId('field');
  const labelId = label ? `${fieldId}-label` : undefined;
  const helpId = helpText ? `${fieldId}-help` : undefined;
  const errorId = error ? `${fieldId}-error` : undefined;
  const requiredId = required ? `${fieldId}-required` : undefined;

  const describedBy = createAriaDescribedBy(errorId, helpId);
  const labelledBy = label
    ? createAriaLabelledBy(labelId, requiredId)
    : undefined;

  const accessibleFieldProps = createAccessibleFormFieldProps({
    required,
    invalid: !!error,
    describedBy,
    labelledBy,
  } as Record<string, unknown>);

  const errorStatusProps = error
    ? createAccessibleStatusProps('error', errorId)
    : {};

  return (
    <div className={cn('space-y-2', className)} {...props}>
      {label && (
        <label
          id={labelId}
          htmlFor={fieldId}
          className={cn(
            'block text-xs sm:text-sm font-medium text-neutral-700 dark:text-neutral-300',
            error && 'text-error-600 dark:text-error-400',
            disabled && 'text-neutral-400 dark:text-neutral-500'
          )}
        >
          {label}
          {required && (
            <span
              id={requiredId}
              className='ml-1 text-error-500'
              aria-label='required'
            >
              *
            </span>
          )}
        </label>
      )}

      <div className='relative'>
        {React.isValidElement(children) &&
          React.cloneElement(children, {
            ...accessibleFieldProps,
            ...(children.props as Record<string, unknown>),
            id: fieldId,
          } as Record<string, unknown>)}
      </div>

      {helpText && !error && (
        <p
          id={helpId}
          className='text-xs sm:text-sm text-neutral-500 dark:text-neutral-400'
        >
          {helpText}
        </p>
      )}

      {error && (
        <p
          id={errorId}
          className='text-xs sm:text-sm text-error-600 dark:text-error-400'
          role='alert'
          {...errorStatusProps}
        >
          {error}
        </p>
      )}
    </div>
  );
};

export default FormField;
