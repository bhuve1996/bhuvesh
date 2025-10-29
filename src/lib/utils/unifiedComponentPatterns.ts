/**
 * Unified Component Patterns
 * Consolidates all component styling and behavior patterns
 * Eliminates duplication across UI components
 */

import { cn } from '@/lib/utils';

// ============================================================================
// BUTTON PATTERNS
// ============================================================================

export const buttonVariants = {
  primary: 'bg-blue-600 hover:bg-blue-700 text-white',
  secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-900',
  outline: 'border border-gray-300 hover:bg-gray-50 text-gray-700',
  ghost: 'hover:bg-gray-100 text-gray-700',
  destructive: 'bg-red-600 hover:bg-red-700 text-white',
  success: 'bg-green-600 hover:bg-green-700 text-white',
  warning: 'bg-yellow-600 hover:bg-yellow-700 text-white',
  info: 'bg-cyan-600 hover:bg-cyan-700 text-white',
} as const;

export const buttonSizes = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-base',
  lg: 'px-6 py-3 text-lg',
  xl: 'px-8 py-4 text-xl',
} as const;

export const createButtonClasses = (
  variant: keyof typeof buttonVariants = 'primary',
  size: keyof typeof buttonSizes = 'md',
  className?: string
) => {
  return cn(
    'inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none',
    buttonVariants[variant],
    buttonSizes[size],
    className
  );
};

// ============================================================================
// INPUT PATTERNS
// ============================================================================

export const inputVariants = {
  default: 'border-gray-300 focus:border-blue-500 focus:ring-blue-500',
  error: 'border-red-300 focus:border-red-500 focus:ring-red-500',
  success: 'border-green-300 focus:border-green-500 focus:ring-green-500',
  warning: 'border-yellow-300 focus:border-yellow-500 focus:ring-yellow-500',
} as const;

export const inputSizes = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-3 py-2 text-base',
  lg: 'px-4 py-3 text-lg',
} as const;

export const createInputClasses = (
  variant: keyof typeof inputVariants = 'default',
  size: keyof typeof inputSizes = 'md',
  className?: string
) => {
  return cn(
    'block w-full rounded-md border shadow-sm transition-colors focus:outline-none focus:ring-1 disabled:opacity-50 disabled:pointer-events-none',
    inputVariants[variant],
    inputSizes[size],
    className
  );
};

// ============================================================================
// CARD PATTERNS
// ============================================================================

export const cardVariants = {
  default: 'bg-white border border-gray-200 shadow-sm',
  elevated: 'bg-white border border-gray-200 shadow-md',
  outlined: 'bg-white border-2 border-gray-200',
  filled: 'bg-gray-50 border border-gray-200',
} as const;

export const createCardClasses = (
  variant: keyof typeof cardVariants = 'default',
  className?: string
) => {
  return cn(
    'rounded-lg p-6 transition-shadow',
    cardVariants[variant],
    className
  );
};

// ============================================================================
// FORM FIELD PATTERNS
// ============================================================================

export const createFormFieldClasses = (hasError?: boolean) => {
  return cn('space-y-2', hasError && 'text-red-600');
};

export const createLabelClasses = (hasError?: boolean, required?: boolean) => {
  return cn(
    'block text-sm font-medium text-gray-700',
    hasError && 'text-red-600',
    required && 'after:content-["*"] after:ml-0.5 after:text-red-500'
  );
};

// ============================================================================
// BADGE PATTERNS
// ============================================================================

export const badgeVariants = {
  default: 'bg-gray-100 text-gray-800',
  primary: 'bg-blue-100 text-blue-800',
  secondary: 'bg-gray-100 text-gray-800',
  success: 'bg-green-100 text-green-800',
  warning: 'bg-yellow-100 text-yellow-800',
  error: 'bg-red-100 text-red-800',
  info: 'bg-cyan-100 text-cyan-800',
} as const;

export const badgeSizes = {
  sm: 'px-2 py-1 text-xs',
  md: 'px-2.5 py-0.5 text-sm',
  lg: 'px-3 py-1 text-base',
} as const;

export const createBadgeClasses = (
  variant: keyof typeof badgeVariants = 'default',
  size: keyof typeof badgeSizes = 'md',
  className?: string
) => {
  return cn(
    'inline-flex items-center rounded-full font-medium',
    badgeVariants[variant],
    badgeSizes[size],
    className
  );
};

// ============================================================================
// LOADING PATTERNS
// ============================================================================

export const createLoadingButtonClasses = (
  isLoading: boolean,
  baseClasses: string
) => {
  return cn(baseClasses, isLoading && 'opacity-50 pointer-events-none');
};

export const createLoadingStateClasses = (isLoading: boolean) => {
  return cn(
    'transition-opacity duration-200',
    isLoading ? 'opacity-50' : 'opacity-100'
  );
};

export const createLoadingButtonProps = (isLoading: boolean) => ({
  disabled: isLoading,
  className: isLoading ? 'opacity-50 pointer-events-none' : '',
});

// ============================================================================
// RESPONSIVE PATTERNS
// ============================================================================

export const responsivePadding = {
  sm: 'p-2 sm:p-4',
  md: 'p-4 sm:p-6',
  lg: 'p-6 sm:p-8',
  xl: 'p-8 sm:p-12',
} as const;

export const responsiveTextSizes = {
  sm: 'text-sm sm:text-base',
  md: 'text-base sm:text-lg',
  lg: 'text-lg sm:text-xl',
  xl: 'text-xl sm:text-2xl',
} as const;

export const responsiveSpacing = {
  sm: 'space-y-2 sm:space-y-4',
  md: 'space-y-4 sm:space-y-6',
  lg: 'space-y-6 sm:space-y-8',
  xl: 'space-y-8 sm:space-y-12',
} as const;

// ============================================================================
// ANIMATION PATTERNS
// ============================================================================

export const animationClasses = {
  fadeIn: 'animate-in fade-in duration-300',
  slideIn: 'animate-in slide-in-from-bottom-4 duration-300',
  scaleIn: 'animate-in zoom-in-95 duration-200',
  bounce: 'animate-bounce',
  pulse: 'animate-pulse',
  spin: 'animate-spin',
} as const;

export const createStaggeredDelay = (
  index: number,
  baseDelay: number = 100
) => {
  return `animation-delay-${index * baseDelay}ms`;
};

// ============================================================================
// THEME PATTERNS
// ============================================================================

export const createThemeAwareClasses = (isDark: boolean) => {
  return {
    background: isDark ? 'bg-gray-900' : 'bg-white',
    surface: isDark ? 'bg-gray-800' : 'bg-gray-50',
    text: isDark ? 'text-white' : 'text-gray-900',
    textSecondary: isDark ? 'text-gray-300' : 'text-gray-600',
    border: isDark ? 'border-gray-700' : 'border-gray-200',
    input: isDark
      ? 'bg-gray-800 border-gray-700 text-white'
      : 'bg-white border-gray-300 text-gray-900',
  };
};

export const themePatterns = {
  light: 'bg-white border-gray-200 text-gray-900',
  dark: 'bg-slate-700 border-gray-600 text-white',
} as const;

// ============================================================================
// ACCESSIBILITY PATTERNS
// ============================================================================

export const createAccessibleButtonProps = (
  label: string,
  disabled?: boolean,
  loading?: boolean
) => ({
  'aria-label': label,
  'aria-disabled': disabled || loading,
  role: 'button',
  tabIndex: disabled || loading ? -1 : 0,
});

export const createAccessibleInputProps = (
  label: string,
  required?: boolean,
  hasError?: boolean
) => ({
  'aria-label': label,
  'aria-required': required,
  'aria-invalid': hasError,
  'aria-describedby': hasError ? `${label}-error` : undefined,
});

// ============================================================================
// TOAST MESSAGES
// ============================================================================

export const toastMessages = {
  success: {
    saved: 'Changes saved successfully',
    created: 'Created successfully',
    updated: 'Updated successfully',
    deleted: 'Deleted successfully',
    uploaded: 'File uploaded successfully',
    exported: 'Exported successfully',
    imported: 'Imported successfully',
  },
  error: {
    save: 'Failed to save changes',
    create: 'Failed to create',
    update: 'Failed to update',
    delete: 'Failed to delete',
    upload: 'Failed to upload file',
    export: 'Failed to export',
    import: 'Failed to import',
    network: 'Network error. Please check your connection.',
    server: 'Server error. Please try again later.',
    validation: 'Please check your input and try again.',
    noData: 'No data available',
    unauthorized: 'You are not authorized to perform this action',
    forbidden: 'Access denied',
    notFound: 'Resource not found',
  },
  info: {
    loading: 'Loading...',
    processing: 'Processing...',
    saving: 'Saving...',
    uploading: 'Uploading...',
    exporting: 'Exporting...',
    importing: 'Importing...',
  },
} as const;

// ============================================================================
// LAYOUT PATTERNS
// ============================================================================

export const layoutPatterns = {
  container: 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8',
  section: 'py-12 sm:py-16 lg:py-20',
  grid: {
    cols1: 'grid grid-cols-1',
    cols2: 'grid grid-cols-1 md:grid-cols-2',
    cols3: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    cols4: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  },
  flex: {
    center: 'flex items-center justify-center',
    between: 'flex items-center justify-between',
    start: 'flex items-center justify-start',
    end: 'flex items-center justify-end',
    col: 'flex flex-col',
    row: 'flex flex-row',
  },
} as const;

// ============================================================================
// EXPORT ALL PATTERNS
// ============================================================================

export const unifiedComponentPatterns = {
  // Button patterns
  buttonVariants,
  buttonSizes,
  createButtonClasses,

  // Input patterns
  inputVariants,
  inputSizes,
  createInputClasses,

  // Card patterns
  cardVariants,
  createCardClasses,

  // Form patterns
  createFormFieldClasses,
  createLabelClasses,

  // Badge patterns
  badgeVariants,
  badgeSizes,
  createBadgeClasses,

  // Loading patterns
  createLoadingButtonClasses,
  createLoadingStateClasses,
  createLoadingButtonProps,

  // Responsive patterns
  responsivePadding,
  responsiveTextSizes,
  responsiveSpacing,

  // Animation patterns
  animationClasses,
  createStaggeredDelay,

  // Theme patterns
  createThemeAwareClasses,
  themePatterns,

  // Accessibility patterns
  createAccessibleButtonProps,
  createAccessibleInputProps,

  // Toast messages
  toastMessages,

  // Layout patterns
  layoutPatterns,
};

export default unifiedComponentPatterns;
