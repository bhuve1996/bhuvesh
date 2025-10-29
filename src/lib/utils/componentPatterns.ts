/**
 * Shared Component Utilities
 * Provides common patterns and utilities for consistent component behavior
 * Eliminates DRY violations across components
 *
 * @deprecated Use unifiedComponentPatterns from './unifiedComponentPatterns' instead
 */

import { cn } from '@/lib/utils/cn';

// Re-export from unified patterns for backward compatibility
export {
  animationClasses,
  badgeVariants,
  buttonSizes,
  buttonVariants,
  cardVariants,
  createAccessibleButtonProps,
  createAccessibleInputProps,
  createBadgeClasses,
  createButtonClasses,
  createCardClasses,
  createFormFieldClasses,
  createInputClasses,
  createLabelClasses,
  createLoadingButtonClasses,
  createLoadingButtonProps,
  createLoadingStateClasses,
  createStaggeredDelay,
  createThemeAwareClasses,
  inputVariants,
  responsivePadding,
  responsiveSpacing,
  responsiveTextSizes,
  themePatterns,
  toastMessages,
} from './unifiedComponentPatterns';

// ============================================================================
// COMMON COMPONENT PATTERNS
// ============================================================================

/**
 * Standard button variants with consistent styling
 */
export const buttonVariants = {
  primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
  secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-500',
  outline:
    'border border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-gray-500',
  ghost: 'text-gray-700 hover:bg-gray-100 focus:ring-gray-500',
  danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
  success: 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500',
} as const;

/**
 * Standard button sizes
 */
export const buttonSizes = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-base',
  lg: 'px-6 py-3 text-lg',
} as const;

/**
 * Standard input variants
 */
export const inputVariants = {
  default: 'border-gray-300 focus:border-blue-500 focus:ring-blue-500',
  error: 'border-red-300 focus:border-red-500 focus:ring-red-500',
  success: 'border-green-300 focus:border-green-500 focus:ring-green-500',
} as const;

/**
 * Standard card variants
 */
export const cardVariants = {
  default: 'bg-white border border-gray-200 shadow-sm',
  elevated: 'bg-white border border-gray-200 shadow-lg',
  glass: 'bg-white/80 backdrop-blur-sm border border-white/20',
} as const;

// ============================================================================
// COMPONENT UTILITIES
// ============================================================================

/**
 * Create consistent button classes
 */
export function createButtonClasses(
  variant: keyof typeof buttonVariants = 'primary',
  size: keyof typeof buttonSizes = 'md',
  disabled: boolean = false,
  className?: string
): string {
  return cn(
    'inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none',
    buttonVariants[variant],
    buttonSizes[size],
    disabled && 'opacity-50 cursor-not-allowed',
    className
  );
}

/**
 * Create consistent input classes
 */
export function createInputClasses(
  variant: keyof typeof inputVariants = 'default',
  className?: string
): string {
  return cn(
    'block w-full rounded-md border px-3 py-2 text-sm placeholder-gray-400 focus:outline-none focus:ring-1',
    inputVariants[variant],
    className
  );
}

/**
 * Create consistent card classes
 */
export function createCardClasses(
  variant: keyof typeof cardVariants = 'default',
  className?: string
): string {
  return cn('rounded-lg p-6', cardVariants[variant], className);
}

// ============================================================================
// FORM UTILITIES
// ============================================================================

/**
 * Standard form field props
 */
export interface FormFieldProps {
  label: string;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
}

/**
 * Create form field classes
 */
export function createFormFieldClasses(
  hasError: boolean = false,
  disabled: boolean = false,
  className?: string
): string {
  return cn(
    'space-y-2',
    hasError && 'text-red-600',
    disabled && 'opacity-50',
    className
  );
}

/**
 * Create label classes
 */
export function createLabelClasses(
  required: boolean = false,
  className?: string
): string {
  return cn(
    'block text-sm font-medium text-gray-700',
    required && 'after:content-["*"] after:ml-0.5 after:text-red-500',
    className
  );
}

// ============================================================================
// LOADING STATES
// ============================================================================

/**
 * Loading spinner classes
 */
export const loadingSpinnerClasses =
  'animate-spin rounded-full border-2 border-gray-300 border-t-blue-600';

/**
 * Create loading button classes
 */
export function createLoadingButtonClasses(
  baseClasses: string,
  loading: boolean = false
): string {
  return cn(baseClasses, loading && 'cursor-not-allowed opacity-75');
}

// ============================================================================
// ACCESSIBILITY UTILITIES
// ============================================================================

/**
 * Create accessible button props
 */
export function createAccessibleButtonProps(options: {
  disabled?: boolean;
  loading?: boolean;
  describedBy?: string;
  label?: string;
  ariaLabel?: string;
}) {
  const { disabled, loading, describedBy, label, ariaLabel } = options;

  return {
    disabled: disabled || loading,
    'aria-disabled': disabled || loading,
    'aria-describedby': describedBy,
    'aria-label': ariaLabel || label,
    'aria-busy': loading,
  };
}

/**
 * Create accessible input props
 */
export function createAccessibleInputProps(options: {
  id: string;
  label: string;
  error?: string;
  required?: boolean;
  disabled?: boolean;
}) {
  const { id, label, error, required, disabled } = options;

  return {
    id,
    'aria-label': label,
    'aria-describedby': error ? `${id}-error` : undefined,
    'aria-required': required,
    'aria-invalid': !!error,
    disabled,
  };
}

// ============================================================================
// RESPONSIVE UTILITIES
// ============================================================================

/**
 * Responsive padding classes
 */
export const responsivePadding = {
  sm: 'p-4 sm:p-6',
  md: 'p-6 sm:p-8',
  lg: 'p-8 sm:p-12',
} as const;

/**
 * Responsive text sizes
 */
export const responsiveTextSizes = {
  xs: 'text-xs sm:text-sm',
  sm: 'text-sm sm:text-base',
  md: 'text-base sm:text-lg',
  lg: 'text-lg sm:text-xl',
  xl: 'text-xl sm:text-2xl',
  '2xl': 'text-2xl sm:text-3xl',
} as const;

/**
 * Responsive spacing
 */
export const responsiveSpacing = {
  xs: 'space-y-2 sm:space-y-3',
  sm: 'space-y-3 sm:space-y-4',
  md: 'space-y-4 sm:space-y-6',
  lg: 'space-y-6 sm:space-y-8',
} as const;

// ============================================================================
// ANIMATION UTILITIES
// ============================================================================

/**
 * Standard animation classes
 */
export const animationClasses = {
  fadeIn: 'animate-fade-in',
  slideUp: 'animate-slide-up',
  slideDown: 'animate-slide-down',
  scaleIn: 'animate-scale-in',
  pulse: 'animate-pulse',
  bounce: 'animate-bounce',
} as const;

/**
 * Create staggered animation delay
 */
export function createStaggeredDelay(
  index: number,
  baseDelay: number = 100
): string {
  return `delay-[${index * baseDelay}ms]`;
}

// ============================================================================
// BADGE/TAG UTILITIES
// ============================================================================

/**
 * Standard badge variants
 */
export const badgeVariants = {
  default: 'px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full',
  success: 'px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full',
  warning: 'px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded-full',
  error: 'px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full',
  info: 'px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full',
  purple: 'px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full',
  cyan: 'px-2 py-1 bg-cyan-100 text-cyan-800 text-xs rounded-full',
} as const;

/**
 * Create badge classes with optional custom styling
 */
export function createBadgeClasses(
  variant: keyof typeof badgeVariants = 'default',
  className?: string
): string {
  return cn(badgeVariants[variant], className);
}

/**
 * Create tag classes for keywords, skills, etc.
 */
export function createTagClasses(
  variant: keyof typeof badgeVariants = 'default',
  size: 'sm' | 'md' | 'lg' = 'sm',
  className?: string
): string {
  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base',
  };

  return cn(
    badgeVariants[variant],
    sizeClasses[size],
    'rounded-full',
    className
  );
}

// ============================================================================
// TOAST UTILITIES
// ============================================================================

/**
 * Standard toast messages for common actions
 */
export const toastMessages = {
  success: {
    upload: 'Resume uploaded and parsed successfully!',
    analysis: 'ATS analysis completed successfully!',
    export: (format: string) => `Resume exported as ${format.toUpperCase()}!`,
    save: 'Resume saved successfully!',
    clear: 'All data cleared successfully',
  },
  error: {
    upload: 'Failed to upload resume',
    analysis: 'Failed to analyze resume',
    export: (format: string) => `Failed to export as ${format.toUpperCase()}`,
    save: 'Failed to save resume',
    noData: 'No resume data available',
    validation: 'Please fix validation errors before proceeding',
  },
  info: {
    processing: 'Processing your request...',
    analyzing: 'Analyzing resume...',
    exporting: 'Exporting resume...',
  },
} as const;

// ============================================================================
// LOADING STATE UTILITIES
// ============================================================================

/**
 * Standard loading state configuration
 */
export interface LoadingStateConfig {
  loading: boolean;
  disabled?: boolean;
  showSpinner?: boolean;
  loadingText?: string;
}

/**
 * Create loading state classes
 */
export function createLoadingStateClasses(
  config: LoadingStateConfig,
  baseClasses: string
): string {
  const { loading, disabled } = config;
  return cn(
    baseClasses,
    (loading || disabled) && 'cursor-not-allowed opacity-75',
    loading && 'relative'
  );
}

/**
 * Create loading button props
 */
export function createLoadingButtonProps(config: LoadingStateConfig) {
  const { loading, disabled, loadingText } = config;

  return {
    disabled: disabled || loading,
    'aria-disabled': disabled || loading,
    'aria-busy': loading,
    'aria-label': loading ? loadingText : undefined,
  };
}

// ============================================================================
// THEME UTILITIES
// ============================================================================

/**
 * Theme-aware class combinations
 */
export function createThemeAwareClasses(
  lightClasses: string,
  darkClasses: string,
  theme: 'light' | 'dark'
): string {
  return theme === 'dark' ? darkClasses : lightClasses;
}

/**
 * Common theme patterns
 */
export const themePatterns = {
  card: {
    light: 'bg-white border-gray-200 text-gray-900',
    dark: 'bg-slate-800 border-gray-700 text-white',
  },
  button: {
    light: 'bg-blue-600 text-white hover:bg-blue-700',
    dark: 'bg-cyan-600 text-white hover:bg-cyan-700',
  },
  input: {
    light: 'bg-white border-gray-300 text-gray-900',
    dark: 'bg-slate-700 border-gray-600 text-white',
  },
} as const;

const componentPatterns = {
  buttonVariants,
  buttonSizes,
  inputVariants,
  cardVariants,
  createButtonClasses,
  createInputClasses,
  createCardClasses,
  createFormFieldClasses,
  createLabelClasses,
  createLoadingButtonClasses,
  createAccessibleButtonProps,
  createAccessibleInputProps,
  responsivePadding,
  responsiveTextSizes,
  responsiveSpacing,
  animationClasses,
  createStaggeredDelay,
  createThemeAwareClasses,
  themePatterns,
  // New utilities
  badgeVariants,
  createBadgeClasses,
  createTagClasses,
  toastMessages,
  createLoadingStateClasses,
  createLoadingButtonProps,
};

export default componentPatterns;
