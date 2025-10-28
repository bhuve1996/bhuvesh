// Re-export cn from the dedicated file
export { cn } from './cn';

// Local storage utilities with error handling
export const storage = {
  get: <T>(key: string, defaultValue: T): T => {
    if (typeof window === 'undefined') return defaultValue;
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch {
      // Error reading localStorage
      return defaultValue;
    }
  },

  set: <T>(key: string, value: T): boolean => {
    if (typeof window === 'undefined') return false;
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch {
      // Error setting localStorage
      return false;
    }
  },

  remove: (key: string): boolean => {
    if (typeof window === 'undefined') return false;
    try {
      window.localStorage.removeItem(key);
      return true;
    } catch {
      // Error removing localStorage
      return false;
    }
  },
};

// Animation delay utility for staggered animations
export function getAnimationDelay(
  index: number,
  baseDelay: number = 100
): string {
  return `${index * baseDelay}ms`;
}

// Re-export all utility modules for easy access
export * from './apiUtils';
export * from './componentUtils';
export * from './dataCleaningUtils';
export * from './errorHandling';
export * from './themeUtils';
