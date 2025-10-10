// API and Data Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
  timestamp: string;
  path?: string;
  method?: string;
}

export interface ValidationError extends ApiError {
  field: string;
  value: unknown;
}

export interface NetworkError extends ApiError {
  code: 'NETWORK_ERROR' | 'TIMEOUT';
}

export interface ServerError extends ApiError {
  code: 'INTERNAL_SERVER_ERROR' | 'SERVICE_UNAVAILABLE';
}

export interface ClientError extends ApiError {
  code:
    | 'VALIDATION_ERROR'
    | 'BAD_REQUEST'
    | 'UNAUTHORIZED'
    | 'FORBIDDEN'
    | 'NOT_FOUND';
}

export interface FileUploadResponse {
  filename: string;
  size: number;
  type: string;
  url?: string;
}

export interface AnalysisRequest {
  file: File;
  jobDescription?: string;
}

export interface HealthCheckResponse {
  status: 'healthy' | 'unhealthy';
  timestamp: string;
  version: string;
  services: {
    database: boolean;
    ai_models: boolean;
    file_processing: boolean;
  };
}
