/**
 * Legacy API utilities - DEPRECATED
 * Use @/lib/api/unifiedClient instead
 * @deprecated Use UnifiedApiClient from @/lib/api/unifiedClient
 */

import type { ApiError, ApiResponse } from '@/lib/api/unifiedClient';

import { formatErrorForUser, ERROR_MESSAGES } from './errorHandling';

// Re-export types from unified client
export type { ApiResponse, ApiError } from '@/lib/api/unifiedClient';

/**
 * Enhanced API error handler with consistent error formatting
 */
export async function handleApiError(
  response: Response,
  context: string
): Promise<never> {
  let errorMessage: string = ERROR_MESSAGES.SERVER;

  try {
    const error = await response.json();

    // Handle different error response formats consistently
    if (typeof error === 'string') {
      errorMessage = error;
    } else if (error.detail) {
      errorMessage = error.detail;
    } else if (error.message) {
      errorMessage = error.message;
    } else if (error.error) {
      errorMessage = error.error;
    } else if (Array.isArray(error)) {
      errorMessage = error.join(', ');
    } else if (error.errors && Array.isArray(error.errors)) {
      errorMessage = error.errors.join(', ');
    } else {
      errorMessage = `Server error: ${response.status} ${response.statusText}`;
    }
  } catch (_parseError) {
    errorMessage = `Server error: ${response.status} ${response.statusText}`;
  }

  const formattedError = formatErrorForUser(errorMessage, context);
  const apiError = new Error(formattedError) as ApiError;
  apiError.status = response.status;
  apiError.response = response;

  throw apiError;
}

/**
 * Generic API request handler with consistent error handling
 */
export async function apiRequest<T = unknown>(
  url: string,
  options: RequestInit = {},
  context: string = 'API request'
): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      await handleApiError(response, context);
    }

    const data = await response.json();
    return {
      success: true,
      data,
      message: 'Request successful',
    };
  } catch (error) {
    if (error instanceof Error && 'status' in error) {
      // Re-throw API errors as-is
      throw error;
    }

    // Handle network or other errors
    const errorMessage = formatErrorForUser(error, context);
    throw new Error(errorMessage);
  }
}

/**
 * Form data API request handler
 */
export async function apiFormRequest<T = unknown>(
  url: string,
  formData: FormData,
  context: string = 'Form upload'
): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(url, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      await handleApiError(response, context);
    }

    const data = await response.json();
    return {
      success: true,
      data,
      message: 'Upload successful',
    };
  } catch (error) {
    if (error instanceof Error && 'status' in error) {
      throw error;
    }

    const errorMessage = formatErrorForUser(error, context);
    throw new Error(errorMessage);
  }
}

/**
 * Health check utility
 */
export async function checkApiHealth(baseUrl: string): Promise<boolean> {
  try {
    const response = await fetch(`${baseUrl}/health`, {
      method: 'GET',
      signal: AbortSignal.timeout(5000), // 5 second timeout
    });

    if (!response.ok) return false;

    const data = await response.json();
    return data.status === 'healthy';
  } catch {
    return false;
  }
}

/**
 * Retry utility for failed requests
 */
export async function retryApiRequest<T>(
  requestFn: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<T> {
  let lastError: Error;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await requestFn();
    } catch (error) {
      lastError = error as Error;

      // Don't retry on client errors (4xx)
      if (
        error instanceof Error &&
        'status' in error &&
        typeof error.status === 'number' &&
        error.status >= 400 &&
        error.status < 500
      ) {
        throw error;
      }

      if (attempt === maxRetries) {
        throw lastError;
      }

      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, delay * attempt));
    }
  }

  throw lastError!;
}

/**
 * Request timeout utility
 */
export function withTimeout<T>(
  promise: Promise<T>,
  timeoutMs: number = 30000
): Promise<T> {
  return Promise.race([
    promise,
    new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error('Request timeout')), timeoutMs)
    ),
  ]);
}
