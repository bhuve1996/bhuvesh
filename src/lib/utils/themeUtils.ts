/**
 * Centralized theme utilities to reduce DRY violations
 * Provides consistent theme-based styling across components
 */

export interface ThemeClasses {
  text: {
    primary: string;
    secondary: string;
    muted: string;
    inverse: string;
  };
  background: {
    primary: string;
    secondary: string;
    card: string;
    hover: string;
  };
  border: {
    primary: string;
    secondary: string;
    focus: string;
  };
  button: {
    primary: string;
    secondary: string;
    outline: string;
    ghost: string;
  };
  input: {
    background: string;
    border: string;
    text: string;
    placeholder: string;
    focus: string;
  };
}

/**
 * Get theme-based classes for consistent styling
 */
export function getThemeClasses(theme: 'light' | 'dark'): ThemeClasses {
  if (theme === 'dark') {
    return {
      text: {
        primary: 'text-white',
        secondary: 'text-gray-300',
        muted: 'text-gray-400',
        inverse: 'text-gray-900',
      },
      background: {
        primary: 'bg-slate-900',
        secondary: 'bg-slate-800',
        card: 'bg-slate-800/50',
        hover: 'hover:bg-slate-700',
      },
      border: {
        primary: 'border-gray-600',
        secondary: 'border-gray-700',
        focus: 'border-cyan-400',
      },
      button: {
        primary: 'bg-cyan-600 text-white hover:bg-cyan-700',
        secondary: 'bg-slate-700 text-cyan-400 hover:bg-slate-600',
        outline:
          'border border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-white',
        ghost: 'text-gray-300 hover:text-white hover:bg-slate-700',
      },
      input: {
        background: 'bg-transparent',
        border: 'border-gray-600',
        text: 'text-white',
        placeholder: 'placeholder-gray-400',
        focus: 'focus:border-cyan-400 focus:outline-none',
      },
    };
  }

  // Light theme
  return {
    text: {
      primary: 'text-gray-900',
      secondary: 'text-gray-600',
      muted: 'text-gray-500',
      inverse: 'text-white',
    },
    background: {
      primary: 'bg-white',
      secondary: 'bg-gray-50',
      card: 'bg-white/50',
      hover: 'hover:bg-gray-100',
    },
    border: {
      primary: 'border-gray-300',
      secondary: 'border-gray-200',
      focus: 'border-cyan-500',
    },
    button: {
      primary: 'bg-blue-600 text-white hover:bg-blue-700',
      secondary: 'bg-white text-blue-600 hover:bg-gray-50',
      outline:
        'border border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white',
      ghost: 'text-gray-600 hover:text-gray-800 hover:bg-gray-100',
    },
    input: {
      background: 'bg-transparent',
      border: 'border-gray-300',
      text: 'text-gray-800',
      placeholder: 'placeholder-gray-500',
      focus: 'focus:border-cyan-500 focus:outline-none',
    },
  };
}

/**
 * Get conditional theme classes for common patterns
 */
export function getConditionalThemeClasses(
  theme: 'light' | 'dark',
  lightClass: string,
  darkClass: string
): string {
  return theme === 'dark' ? darkClass : lightClass;
}

/**
 * Get gradient background classes based on theme
 */
export function getGradientBackground(theme: 'light' | 'dark'): string {
  return theme === 'dark'
    ? 'bg-gradient-to-br from-slate-900 to-slate-800'
    : 'bg-gradient-to-br from-slate-50 to-blue-50';
}

/**
 * Get tab button classes based on theme and state
 */
export function getTabButtonClasses(
  theme: 'light' | 'dark',
  isActive: boolean,
  isDisabled: boolean = false
): string {
  const baseClasses =
    'px-6 py-3 rounded-md font-medium transition-all duration-200';

  if (isDisabled) {
    return `${baseClasses} ${
      theme === 'dark'
        ? 'text-gray-500 cursor-not-allowed'
        : 'text-gray-400 cursor-not-allowed'
    }`;
  }

  if (isActive) {
    return `${baseClasses} ${
      theme === 'dark'
        ? 'bg-slate-700 text-cyan-400 shadow-sm'
        : 'bg-white text-blue-600 shadow-sm'
    }`;
  }

  return `${baseClasses} ${
    theme === 'dark'
      ? 'text-gray-300 hover:text-white'
      : 'text-gray-600 hover:text-gray-800'
  }`;
}

/**
 * Get error message classes based on theme
 */
export function getErrorClasses(theme: 'light' | 'dark'): string {
  return theme === 'dark'
    ? 'bg-red-900/20 border border-red-800 text-red-300'
    : 'bg-red-50 border border-red-200 text-red-800';
}

/**
 * Get success message classes based on theme
 */
export function getSuccessClasses(theme: 'light' | 'dark'): string {
  return theme === 'dark'
    ? 'bg-green-900/20 border border-green-800 text-green-300'
    : 'bg-green-50 border border-green-200 text-green-800';
}

/**
 * Combine multiple theme classes
 */
export const combineThemeClasses = (
  ...classes: (string | undefined | null | false)[]
): string => {
  return classes.filter(Boolean).join(' ');
};
