/**
 * Unified API Client
 * Consolidates all API calls and eliminates duplication
 * Provides consistent error handling, loading states, and retry logic
 */

import { useState } from 'react';
import toast from 'react-hot-toast';

import { formatErrorForUser } from '@/lib/utils/errorHandling';

// ============================================================================
// TYPES
// ============================================================================

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface ApiCallConfig {
  loadingState?: {
    setter: (loading: boolean) => void;
    key?: string;
  };
  successMessage?: string;
  errorMessage?: string;
  showToast?: boolean;
  onSuccess?: (data: any) => void;
  onError?: (error: Error) => void;
  onFinally?: () => void;
  retries?: number;
  timeout?: number;
}

export interface ApiCallOptions extends RequestInit {
  timeout?: number;
  retries?: number;
}

// ============================================================================
// UNIFIED API CLIENT
// ============================================================================

class UnifiedApiClient {
  private baseURL: string;
  private defaultTimeout: number = 30000; // 30 seconds
  private defaultRetries: number = 3;

  constructor(baseURL: string = '') {
    this.baseURL = baseURL;
  }

  // ============================================================================
  // CORE HTTP METHODS
  // ============================================================================

  private async makeRequest<T>(
    endpoint: string,
    options: ApiCallOptions = {}
  ): Promise<ApiResponse<T>> {
    const {
      timeout = this.defaultTimeout,
      retries = this.defaultRetries,
      ...fetchOptions
    } = options;

    const url = `${this.baseURL}${endpoint}`;
    let lastError: Error | null = null;

    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeout);

        const response = await fetch(url, {
          ...fetchOptions,
          signal: controller.signal,
          headers: {
            'Content-Type': 'application/json',
            ...fetchOptions.headers,
          },
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        return {
          success: true,
          data,
        };
      } catch (error) {
        lastError = error as Error;
        
        // Don't retry on certain errors
        if (error instanceof Error && (
          error.name === 'AbortError' ||
          error.message.includes('400') ||
          error.message.includes('401') ||
          error.message.includes('403') ||
          error.message.includes('404')
        )) {
          break;
        }

        if (attempt < retries) {
          // Exponential backoff
          const delay = Math.pow(2, attempt) * 1000;
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    }

    return {
      success: false,
      error: lastError?.message || 'Request failed',
    };
  }

  // ============================================================================
  // HTTP METHODS
  // ============================================================================

  async get<T>(endpoint: string, options: ApiCallOptions = {}): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, { ...options, method: 'GET' });
  }

  async post<T>(endpoint: string, data?: any, options: ApiCallOptions = {}): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, {
      ...options,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T>(endpoint: string, data?: any, options: ApiCallOptions = {}): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(endpoint: string, options: ApiCallOptions = {}): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, { ...options, method: 'DELETE' });
  }

  async patch<T>(endpoint: string, data?: any, options: ApiCallOptions = {}): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, {
      ...options,
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  // ============================================================================
  // FILE UPLOAD METHODS
  // ============================================================================

  async uploadFile<T>(
    endpoint: string,
    file: File,
    additionalData: Record<string, any> = {},
    options: ApiCallOptions = {}
  ): Promise<ApiResponse<T>> {
    const formData = new FormData();
    formData.append('file', file);
    
    // Add additional data
    Object.entries(additionalData).forEach(([key, value]) => {
      formData.append(key, value);
    });

    return this.makeRequest<T>(endpoint, {
      ...options,
      method: 'POST',
      body: formData,
      headers: {
        // Don't set Content-Type for FormData, let browser set it
        ...options.headers,
      },
    });
  }

  // ============================================================================
  // ENHANCED API CALLS WITH CONFIGURATION
  // ============================================================================

  async callWithConfig<T>(
    apiCall: () => Promise<ApiResponse<T>>,
    config: ApiCallConfig = {}
  ): Promise<ApiResponse<T>> {
    const {
      loadingState,
      successMessage,
      errorMessage,
      showToast = true,
      onSuccess,
      onError,
      onFinally,
    } = config;

    // Set loading state
    if (loadingState) {
      loadingState.setter(true);
    }

    try {
      const response = await apiCall();

      if (response.success) {
        if (successMessage && showToast) {
          toast.success(successMessage);
        }
        onSuccess?.(response.data);
      } else {
        const error = new Error(response.error || 'API call failed');
        if (errorMessage && showToast) {
          toast.error(errorMessage);
        } else if (showToast) {
          toast.error(formatErrorForUser(error));
        }
        onError?.(error);
      }

      return response;
    } catch (error) {
      const apiError = error as Error;
      if (errorMessage && showToast) {
        toast.error(errorMessage);
      } else if (showToast) {
        toast.error(formatErrorForUser(apiError));
      }
      onError?.(apiError);
      
      return {
        success: false,
        error: apiError.message,
      };
    } finally {
      if (loadingState) {
        loadingState.setter(false);
      }
      onFinally?.();
    }
  }

  // ============================================================================
  // CONVENIENCE METHODS
  // ============================================================================

  async getWithConfig<T>(
    endpoint: string,
    config: ApiCallConfig = {},
    options: ApiCallOptions = {}
  ): Promise<ApiResponse<T>> {
    return this.callWithConfig(
      () => this.get<T>(endpoint, options),
      config
    );
  }

  async postWithConfig<T>(
    endpoint: string,
    data: any,
    config: ApiCallConfig = {},
    options: ApiCallOptions = {}
  ): Promise<ApiResponse<T>> {
    return this.callWithConfig(
      () => this.post<T>(endpoint, data, options),
      config
    );
  }

  async uploadFileWithConfig<T>(
    endpoint: string,
    file: File,
    additionalData: Record<string, any> = {},
    config: ApiCallConfig = {},
    options: ApiCallOptions = {}
  ): Promise<ApiResponse<T>> {
    return this.callWithConfig(
      () => this.uploadFile<T>(endpoint, file, additionalData, options),
      config
    );
  }
}

// ============================================================================
// HOOKS FOR REACT COMPONENTS
// ============================================================================

export function useApiCall() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const call = async <T>(
    apiCall: () => Promise<ApiResponse<T>>,
    config: ApiCallConfig = {}
  ): Promise<ApiResponse<T>> {
    setError(null);
    
    return unifiedClient.callWithConfig(apiCall, {
      ...config,
      loadingState: {
        setter: setIsLoading,
        ...config.loadingState,
      },
      onError: (err) => {
        setError(err.message);
        config.onError?.(err);
      },
    });
  };

  return {
    call,
    isLoading,
    error,
    clearError: () => setError(null),
  };
}

export function useLoadingStates(keys: string[]) {
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>(
    keys.reduce((acc, key) => ({ ...acc, [key]: false }), {})
  );

  const setLoading = (key: string, loading: boolean) => {
    setLoadingStates(prev => ({ ...prev, [key]: loading }));
  };

  const isLoading = (key: string) => loadingStates[key] || false;
  const isAnyLoading = Object.values(loadingStates).some(Boolean);

  return {
    setLoading,
    isLoading,
    isAnyLoading,
    loadingStates,
  };
}

// ============================================================================
// GLOBAL INSTANCE
// ============================================================================

// Create global instance
export const unifiedClient = new UnifiedApiClient();

// Export for backward compatibility
export default unifiedClient;
