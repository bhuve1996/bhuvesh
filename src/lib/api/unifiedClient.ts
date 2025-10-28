/**
 * Unified API Client
 * Consolidates all API functionality with consistent error handling
 * Eliminates DRY violations in API layer
 */

import { formatErrorForUser } from '@/lib/utils/errorHandling';

// ============================================================================
// TYPES
// ============================================================================

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message: string;
  error?: string;
}

export interface ApiError extends Error {
  status?: number;
  response?: Response;
  code?: string;
  details?: unknown;
}

export interface RequestOptions extends RequestInit {
  timeout?: number;
  retries?: number;
  retryDelay?: number;
}

// ============================================================================
// CONFIGURATION
// ============================================================================

const DEFAULT_TIMEOUT = 30000; // 30 seconds
const DEFAULT_RETRIES = 3;
const DEFAULT_RETRY_DELAY = 1000; // 1 second

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// ============================================================================
// ERROR HANDLING
// ============================================================================

export class UnifiedApiError extends Error implements ApiError {
  public status?: number;
  public response?: Response;
  public code?: string;
  public details?: unknown;

  constructor(
    message: string,
    status?: number,
    response?: Response,
    code?: string,
    details?: unknown
  ) {
    super(message);
    this.name = 'UnifiedApiError';
    this.status = status;
    this.response = response;
    this.code = code;
    this.details = details;
  }
}

async function handleApiError(
  response: Response,
  context: string
): Promise<never> {
  let errorMessage = `HTTP ${response.status}: ${response.statusText}`;

  try {
    const errorData = await response.json();
    if (errorData.message) {
      errorMessage = errorData.message;
    } else if (errorData.error) {
      errorMessage = errorData.error;
    } else if (errorData.errors && Array.isArray(errorData.errors)) {
      errorMessage = errorData.errors.join(', ');
    }
  } catch (_parseError) {
    errorMessage = `Server error: ${response.status} ${response.statusText}`;
  }

  const formattedError = formatErrorForUser(errorMessage, context);
  const apiError = new UnifiedApiError(
    formattedError,
    response.status,
    response,
    'API_ERROR'
  );

  throw apiError;
}

// ============================================================================
// RETRY LOGIC
// ============================================================================

async function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function withRetry<T>(
  fn: () => Promise<T>,
  retries: number = DEFAULT_RETRIES,
  delay: number = DEFAULT_RETRY_DELAY
): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    if (
      retries > 0 &&
      error instanceof UnifiedApiError &&
      error.status &&
      error.status >= 500
    ) {
      await sleep(delay);
      return withRetry(fn, retries - 1, delay * 2);
    }
    throw error;
  }
}

// ============================================================================
// TIMEOUT HANDLING
// ============================================================================

async function withTimeout<T>(
  promise: Promise<T>,
  timeoutMs: number = DEFAULT_TIMEOUT
): Promise<T> {
  const timeoutPromise = new Promise<never>((_, reject) => {
    setTimeout(() => {
      reject(
        new UnifiedApiError(`Request timed out after ${timeoutMs}ms`, 408)
      );
    }, timeoutMs);
  });

  return Promise.race([promise, timeoutPromise]);
}

// ============================================================================
// MAIN API CLIENT
// ============================================================================

export class UnifiedApiClient {
  private baseUrl: string;
  private defaultTimeout: number;
  private defaultRetries: number;

  constructor(
    baseUrl: string = API_BASE_URL,
    defaultTimeout: number = DEFAULT_TIMEOUT,
    defaultRetries: number = DEFAULT_RETRIES
  ) {
    this.baseUrl = baseUrl;
    this.defaultTimeout = defaultTimeout;
    this.defaultRetries = defaultRetries;
  }

  /**
   * Generic request method with error handling, retries, and timeout
   */
  private async request<T>(
    endpoint: string,
    options: RequestOptions = {}
  ): Promise<ApiResponse<T>> {
    const {
      timeout = this.defaultTimeout,
      retries = this.defaultRetries,
      retryDelay = DEFAULT_RETRY_DELAY,
      ...fetchOptions
    } = options;

    const url = `${this.baseUrl}${endpoint}`;

    const requestFn = async (): Promise<ApiResponse<T>> => {
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...fetchOptions.headers,
        },
        ...fetchOptions,
      });

      if (!response.ok) {
        await handleApiError(response, `API request to ${endpoint}`);
      }

      const data = await response.json();
      return {
        success: true,
        data,
        message: 'Request successful',
      };
    };

    const requestWithTimeout = withTimeout(requestFn, timeout);
    return withRetry(requestWithTimeout, retries, retryDelay);
  }

  /**
   * Form data request method
   */
  private async formRequest<T>(
    endpoint: string,
    formData: FormData,
    options: RequestOptions = {}
  ): Promise<ApiResponse<T>> {
    const {
      timeout = this.defaultTimeout,
      retries = this.defaultRetries,
      retryDelay = DEFAULT_RETRY_DELAY,
      ...fetchOptions
    } = options;

    const url = `${this.baseUrl}${endpoint}`;

    const requestFn = async (): Promise<ApiResponse<T>> => {
      const response = await fetch(url, {
        method: 'POST',
        body: formData,
        ...fetchOptions,
      });

      if (!response.ok) {
        await handleApiError(response, `Form upload to ${endpoint}`);
      }

      const data = await response.json();
      return {
        success: true,
        data,
        message: 'Upload successful',
      };
    };

    const requestWithTimeout = withTimeout(requestFn, timeout);
    return withRetry(requestWithTimeout, retries, retryDelay);
  }

  // ============================================================================
  // HEALTH CHECK
  // ============================================================================

  async checkHealth(): Promise<
    ApiResponse<{ status: string; timestamp: string }>
  > {
    return this.request('/health');
  }

  // ============================================================================
  // FILE UPLOAD
  // ============================================================================

  async uploadFile(file: File): Promise<
    ApiResponse<{
      filename: string;
      size: number;
      content_type: string;
      extracted_text: string;
    }>
  > {
    const formData = new FormData();
    formData.append('file', file);

    return this.formRequest('/upload', formData, {
      timeout: 60000, // 60 seconds for file uploads
    });
  }

  // ============================================================================
  // ATS ANALYSIS
  // ============================================================================

  async analyzeResume(data: {
    resume_text: string;
    job_description?: string;
  }): Promise<
    ApiResponse<{
      ats_score: number;
      match_category: string;
      keyword_matches: string[];
      missing_keywords: string[];
      semantic_similarity: number;
      suggestions: string[];
      strengths: string[];
      weaknesses: string[];
      formatting_issues: string[];
      ats_friendly: boolean;
      word_count: number;
      detailed_scores: {
        keyword_score: number;
        semantic_score: number;
        format_score: number;
        content_score: number;
        ats_score: number;
      };
    }>
  > {
    return this.request('/analyze', {
      method: 'POST',
      body: JSON.stringify(data),
      timeout: 120000, // 2 minutes for analysis
    });
  }

  // ============================================================================
  // RESUME IMPROVEMENT
  // ============================================================================

  async improveResume(data: {
    resume_text: string;
    job_description?: string;
    improvement_type: 'content' | 'format' | 'keywords';
  }): Promise<
    ApiResponse<{
      improved_text: string;
      changes: string[];
      score_improvement: number;
    }>
  > {
    return this.request('/improve', {
      method: 'POST',
      body: JSON.stringify(data),
      timeout: 120000, // 2 minutes for improvement
    });
  }

  // ============================================================================
  // JOB DETECTION
  // ============================================================================

  async detectJobRole(resumeText: string): Promise<
    ApiResponse<{
      detected_role: string;
      confidence: number;
      related_roles: string[];
    }>
  > {
    return this.request('/detect-job', {
      method: 'POST',
      body: JSON.stringify({ resume_text: resumeText }),
    });
  }

  // ============================================================================
  // KEYWORD EXTRACTION
  // ============================================================================

  async extractKeywords(jobDescription: string): Promise<
    ApiResponse<{
      keywords: string[];
      categories: {
        technical: string[];
        soft_skills: string[];
        experience: string[];
        education: string[];
      };
    }>
  > {
    return this.request('/extract-keywords', {
      method: 'POST',
      body: JSON.stringify({ job_description: jobDescription }),
    });
  }
}

// ============================================================================
// SINGLETON INSTANCE
// ============================================================================

export const apiClient = new UnifiedApiClient();

// ============================================================================
// CONVENIENCE FUNCTIONS
// ============================================================================

export const checkApiHealth = () => apiClient.checkHealth();
export const uploadFile = (file: File) => apiClient.uploadFile(file);
export const analyzeResume = (
  data: Parameters<typeof apiClient.analyzeResume>[0]
) => apiClient.analyzeResume(data);
export const improveResume = (
  data: Parameters<typeof apiClient.improveResume>[0]
) => apiClient.improveResume(data);
export const detectJobRole = (resumeText: string) =>
  apiClient.detectJobRole(resumeText);
export const extractKeywords = (jobDescription: string) =>
  apiClient.extractKeywords(jobDescription);

export default apiClient;
