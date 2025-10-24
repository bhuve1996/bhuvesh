// Form-related Types
// Consolidated to eliminate FormFieldProps duplications

export interface FormFieldProps {
  label?: string;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  children: React.ReactNode;
  helpText?: string;
  helperText?: string;
  id?: string;
}

export interface FormField {
  name: string;
  label: string;
  type:
    | 'text'
    | 'email'
    | 'password'
    | 'number'
    | 'select'
    | 'textarea'
    | 'file';
  required?: boolean;
  placeholder?: string;
  options?: SelectOption[];
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
    message?: string;
  };
}

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}
