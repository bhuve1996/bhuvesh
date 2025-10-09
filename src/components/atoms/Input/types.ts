export interface InputProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  error?: string;
  label?: string;
  helperText?: string;
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url';
  className?: string;
  name?: string;
  autoComplete?: string;
  maxLength?: number;
  minLength?: number;
  pattern?: string;
  readOnly?: boolean;
  autoFocus?: boolean;
  'data-testid'?: string;
}
