/**
 * Utility functions for consistent error handling across the application
 */

/**
 * Extracts a readable error message from various error types
 */
export function extractErrorMessage(
  error: unknown,
  defaultMessage: string
): string {
  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === 'string') {
    return error;
  }

  if (error && typeof error === 'object') {
    // Handle object errors
    if ('message' in error) {
      return String(error.message);
    }
    if ('detail' in error) {
      return String(error.detail);
    }
    if ('error' in error) {
      return String(error.error);
    }
    if ('errors' in error && Array.isArray(error.errors)) {
      return error.errors.join(', ');
    }
    // Handle case where error is an object but we can't extract a message
    try {
      return JSON.stringify(error);
    } catch {
      return String(error);
    }
  }

  return defaultMessage;
}

/**
 * Formats error messages for user display
 */
export function formatErrorForUser(error: unknown, context: string): string {
  const message = extractErrorMessage(error, `${context} failed`);

  // Clean up common error patterns
  let cleanMessage = message
    .replace(/^Error:\s*/i, '')
    .replace(/^Failed to\s*/i, '')
    .trim();

  // Capitalize first letter
  cleanMessage = cleanMessage.charAt(0).toUpperCase() + cleanMessage.slice(1);

  return cleanMessage;
}

/**
 * Common error messages for different contexts
 */
export const ERROR_MESSAGES = {
  UPLOAD: 'Failed to upload resume',
  PARSE: 'Failed to parse resume',
  ANALYSIS: 'Analysis failed',
  NETWORK: 'Network connection failed',
  SERVER: 'Server error occurred',
  VALIDATION: 'Invalid input provided',
  UNKNOWN: 'An unexpected error occurred',
} as const;
