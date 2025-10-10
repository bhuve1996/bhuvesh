// ============================================================================
// ATS API ENDPOINTS
// ============================================================================

import {
  ApiError,
  FileUploadResponse,
  ImprovementPlanResponse,
  ResumeAnalysisResponse,
  SupportedFormatsResponse,
} from '@/shared/types/api';
import { AnalysisResult } from '@/shared/types/ats';
import { ResumeDocument } from '@/shared/types/resume';

// ============================================================================
// API CONFIGURATION
// ============================================================================

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// ============================================================================
// API CLIENT
// ============================================================================

class ATSApiClient {
  private baseUrl: string;
  private timeout: number;

  constructor(baseUrl: string = API_BASE_URL, timeout: number = 30000) {
    this.baseUrl = baseUrl;
    this.timeout = timeout;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
        headers: {
          Accept: 'application/json',
          ...options.headers,
        },
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new ApiError(
          errorData.code || 'API_ERROR',
          errorData.message ||
            `HTTP ${response.status}: ${response.statusText}`,
          errorData.details,
          new Date().toISOString(),
          endpoint,
          options.method || 'GET'
        );
      }

      return await response.json();
    } catch (error) {
      clearTimeout(timeoutId);

      if (error instanceof ApiError) {
        throw error;
      }

      if (error instanceof Error && error.name === 'AbortError') {
        throw new ApiError(
          'TIMEOUT',
          'Request timed out',
          { timeout: this.timeout },
          new Date().toISOString(),
          endpoint,
          options.method || 'GET'
        );
      }

      throw new ApiError(
        'NETWORK_ERROR',
        error instanceof Error ? error.message : 'Network error occurred',
        { originalError: error },
        new Date().toISOString(),
        endpoint,
        options.method || 'GET'
      );
    }
  }

  // ============================================================================
  // FILE UPLOAD ENDPOINTS
  // ============================================================================

  async uploadFile(file: File): Promise<FileUploadResponse> {
    const formData = new FormData();
    formData.append('file', file);

    return this.request<FileUploadResponse>('/api/upload/parse', {
      method: 'POST',
      body: formData,
    });
  }

  async analyzeResume(
    file: File,
    jobDescription: string
  ): Promise<ResumeAnalysisResponse> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('job_description', jobDescription);

    return this.request<ResumeAnalysisResponse>('/api/upload/analyze', {
      method: 'POST',
      body: formData,
    });
  }

  async extractExperience(file: File): Promise<ResumeAnalysisResponse> {
    const formData = new FormData();
    formData.append('file', file);

    return this.request<ResumeAnalysisResponse>(
      '/api/upload/extract-experience',
      {
        method: 'POST',
        body: formData,
      }
    );
  }

  async getImprovementPlan(
    analysisResult: AnalysisResult,
    extractedData: ResumeDocument,
    jobDescription?: string
  ): Promise<ImprovementPlanResponse> {
    return this.request<ImprovementPlanResponse>(
      '/api/upload/improvement-plan',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          analysis_result: analysisResult,
          extracted_data: extractedData,
          job_description: jobDescription,
        }),
      }
    );
  }

  async getSupportedFormats(): Promise<SupportedFormatsResponse> {
    return this.request<SupportedFormatsResponse>(
      '/api/upload/supported-formats'
    );
  }

  // ============================================================================
  // UTILITY METHODS
  // ============================================================================

  async healthCheck(): Promise<{ status: string; timestamp: string }> {
    return this.request<{ status: string; timestamp: string }>('/health');
  }

  async getApiVersion(): Promise<{ version: string; build: string }> {
    return this.request<{ version: string; build: string }>('/version');
  }
}

// ============================================================================
// API INSTANCE
// ============================================================================

export const atsApi = new ATSApiClient();

// ============================================================================
// CONVENIENCE FUNCTIONS
// ============================================================================

export const uploadResume = (file: File) => atsApi.uploadFile(file);

export const analyzeResume = (file: File, jobDescription: string) =>
  atsApi.analyzeResume(file, jobDescription);

export const extractResumeExperience = (file: File) =>
  atsApi.extractExperience(file);

export const getResumeImprovementPlan = (
  analysisResult: AnalysisResult,
  extractedData: ResumeDocument,
  jobDescription?: string
) => atsApi.getImprovementPlan(analysisResult, extractedData, jobDescription);

export const getSupportedFileFormats = () => atsApi.getSupportedFormats();

export const checkApiHealth = () => atsApi.healthCheck();

export const getApiVersion = () => atsApi.getApiVersion();

// ============================================================================
// ERROR HANDLING
// ============================================================================

export class ATSApiError extends Error {
  public code: string;
  public details?: Record<string, unknown>;
  public timestamp: string;
  public endpoint?: string;
  public method?: string;

  constructor(
    code: string,
    message: string,
    details?: Record<string, unknown>,
    timestamp: string = new Date().toISOString(),
    endpoint?: string,
    method?: string
  ) {
    super(message);
    this.name = 'ATSApiError';
    this.code = code;
    this.details = details;
    this.timestamp = timestamp;
    if (endpoint !== undefined) this.endpoint = endpoint;
    if (method !== undefined) this.method = method;
  }
}

// ============================================================================
// TYPE GUARDS
// ============================================================================

export const isATSApiError = (error: unknown): error is ATSApiError => {
  return error instanceof ATSApiError;
};

export const isNetworkError = (error: unknown): boolean => {
  return error.code === 'NETWORK_ERROR' || error.code === 'TIMEOUT';
};

export const isValidationError = (error: unknown): boolean => {
  return error.code === 'VALIDATION_ERROR' || error.code === 'BAD_REQUEST';
};

export const isServerError = (error: unknown): boolean => {
  return (
    error.code === 'INTERNAL_SERVER_ERROR' ||
    error.code === 'SERVICE_UNAVAILABLE'
  );
};

// ============================================================================
// RETRY LOGIC
// ============================================================================

export const withRetry = async <T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<T> => {
  let lastError: Error;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error as Error;

      // Don't retry on validation errors or client errors
      if (
        isValidationError(error) ||
        ((error as Error & { status?: number }).status &&
          (error as Error & { status?: number }).status! >= 400 &&
          (error as Error & { status?: number }).status! < 500)
      ) {
        throw error;
      }

      // Don't retry on last attempt
      if (attempt === maxRetries) {
        break;
      }

      // Wait before retrying
      await new Promise(resolve =>
        setTimeout(resolve, delay * Math.pow(2, attempt))
      );
    }
  }

  throw lastError!;
};

// ============================================================================
// CACHING
// ============================================================================

const cache = new Map<
  string,
  { data: unknown; timestamp: number; ttl: number }
>();

export const withCache = async <T>(
  key: string,
  operation: () => Promise<T>,
  ttl: number = 300000 // 5 minutes
): Promise<T> => {
  const cached = cache.get(key);

  if (cached && Date.now() - cached.timestamp < cached.ttl) {
    return cached.data;
  }

  const data = await operation();
  cache.set(key, {
    data,
    timestamp: Date.now(),
    ttl,
  });

  return data;
};

// ============================================================================
// PROGRESS TRACKING
// ============================================================================

export const withProgress = async <T>(
  operation: () => Promise<T>,
  onProgress: (progress: number) => void
): Promise<T> => {
  return new Promise((resolve, reject) => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 10;
      if (progress >= 90) {
        progress = 90;
      }
      onProgress(progress);
    }, 100);

    operation()
      .then(result => {
        clearInterval(interval);
        onProgress(100);
        resolve(result);
      })
      .catch(error => {
        clearInterval(interval);
        reject(error);
      });
  });
};
