/**
 * Centralized API patterns and utilities
 * Eliminates DRY violations in API calls and error handling
 */

import { useState } from 'react';
import toast from 'react-hot-toast';

import { toastMessages } from './componentPatterns';
import { ERROR_MESSAGES, formatErrorForUser } from './errorHandling';

// ============================================================================
// API CALL WRAPPER
// ============================================================================

/**
 * Standard API call configuration
 */
export interface ApiCallConfig {
  loadingState?: {
    setter: (loading: boolean) => void;
    key?: string;
  };
  successMessage?: string;
  errorMessage?: string;
  showToast?: boolean;
  onSuccess?: (data: unknown) => void;
  onError?: (error: Error) => void;
  onFinally?: () => void;
}

/**
 * Wrapper for API calls with standardized error handling and loading states
 */
export async function withApiCall<T>(
  apiCall: () => Promise<T>,
  config: ApiCallConfig = {}
): Promise<T | null> {
  const {
    loadingState,
    successMessage,
    errorMessage,
    showToast = true,
    onSuccess,
    onError,
    onFinally,
  } = config;

  try {
    // Set loading state
    if (loadingState) {
      loadingState.setter(true);
    }

    // Execute API call
    const result = await apiCall();

    // Handle success
    if (successMessage && showToast) {
      toast.success(successMessage);
    }

    if (onSuccess) {
      onSuccess(result);
    }

    return result;
  } catch (error) {
    // Handle error
    const errorMsg =
      errorMessage || formatErrorForUser(error, ERROR_MESSAGES.UNKNOWN);

    if (showToast) {
      toast.error(errorMsg);
    }

    if (onError) {
      onError(error instanceof Error ? error : new Error(String(error)));
    }

    return null;
  } finally {
    // Reset loading state
    if (loadingState) {
      loadingState.setter(false);
    }

    if (onFinally) {
      onFinally();
    }
  }
}

// ============================================================================
// COMMON API PATTERNS
// ============================================================================

/**
 * Upload file pattern
 */
export async function withFileUpload<T>(
  uploadCall: () => Promise<T>,
  config: Partial<ApiCallConfig> = {}
): Promise<T | null> {
  return withApiCall(uploadCall, {
    successMessage: toastMessages.success.upload,
    errorMessage: toastMessages.error.upload,
    ...config,
  });
}

/**
 * ATS analysis pattern
 */
export async function withATSAnalysis<T>(
  analysisCall: () => Promise<T>,
  config: Partial<ApiCallConfig> = {}
): Promise<T | null> {
  return withApiCall(analysisCall, {
    successMessage: toastMessages.success.analysis,
    errorMessage: toastMessages.error.analysis,
    ...config,
  });
}

/**
 * Export pattern
 */
export async function withExport<T>(
  exportCall: () => Promise<T>,
  format: string,
  config: Partial<ApiCallConfig> = {}
): Promise<T | null> {
  return withApiCall(exportCall, {
    successMessage: toastMessages.success.export(format),
    errorMessage: toastMessages.error.export(format),
    ...config,
  });
}

/**
 * Save pattern
 */
export async function withSave<T>(
  saveCall: () => Promise<T>,
  config: Partial<ApiCallConfig> = {}
): Promise<T | null> {
  return withApiCall(saveCall, {
    successMessage: toastMessages.success.save,
    errorMessage: toastMessages.error.save,
    ...config,
  });
}

// ============================================================================
// LOADING STATE HOOKS
// ============================================================================

/**
 * Custom hook for creating loading state setters
 */
export function useLoadingStateSetters() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const resetError = () => setError(null);
  const setLoadingState = (isLoading: boolean) => {
    setLoading(isLoading);
    if (isLoading) resetError();
  };

  return {
    loading,
    error,
    setLoading: setLoadingState,
    setError,
    resetError,
  };
}

// ============================================================================
// VALIDATION UTILITIES
// ============================================================================

/**
 * Validate before API call
 */
export function validateBeforeCall(
  validationFn: () => boolean | string,
  errorMessage?: string
): boolean {
  const validation = validationFn();

  if (validation !== true) {
    const message =
      typeof validation === 'string'
        ? validation
        : errorMessage || 'Validation failed';
    toast.error(message);
    return false;
  }

  return true;
}

/**
 * Common validation patterns
 */
export const commonValidations = {
  hasFile: (file: File | null) => {
    if (!file) {
      toast.error('Please select a file first');
      return false;
    }
    return true;
  },

  hasData: (data: unknown) => {
    if (!data || (Array.isArray(data) && data.length === 0)) {
      toast.error(toastMessages.error.noData);
      return false;
    }
    return true;
  },

  hasRequiredFields: (
    data: Record<string, unknown>,
    requiredFields: string[]
  ) => {
    const missing = requiredFields.filter(field => !data[field]);
    if (missing.length > 0) {
      toast.error(`Missing required fields: ${missing.join(', ')}`);
      return false;
    }
    return true;
  },
};

const apiPatterns = {
  withApiCall,
  withFileUpload,
  withATSAnalysis,
  withExport,
  withSave,
  useLoadingStateSetters,
  validateBeforeCall,
  commonValidations,
};

export default apiPatterns;
