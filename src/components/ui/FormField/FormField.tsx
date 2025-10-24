import React from 'react';

import type { FormFieldProps } from '@/types';

export const FormField: React.FC<FormFieldProps> = ({
  label,
  required = false,
  children,
  helperText,
  className = '',
}) => {
  return (
    <div className={className}>
      <label className='block text-sm font-semibold text-foreground mb-2 uppercase tracking-wide'>
        {label}
        {required && <span className='text-red-500 ml-1'>*</span>}
      </label>
      {children}
      {helperText && (
        <p className='text-xs text-muted-foreground mt-1'>{helperText}</p>
      )}
    </div>
  );
};

export default FormField;
