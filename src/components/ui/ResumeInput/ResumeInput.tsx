import React from 'react';

interface ResumeInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export const ResumeInput: React.FC<ResumeInputProps> = ({
  value,
  onChange,
  placeholder,
  className = '',
  ...props
}) => {
  return (
    <input
      {...props}
      type='text'
      value={value}
      onChange={e => onChange(e.target.value)}
      className={`w-full px-3 py-2 sm:px-4 sm:py-3 border-2 border-border rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-background text-foreground font-medium transition-all duration-200 text-sm sm:text-base ${className}`}
      placeholder={placeholder}
    />
  );
};

export default ResumeInput;
