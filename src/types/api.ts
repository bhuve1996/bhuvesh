// API and Data Types
import type { AnalysisResult } from './resume';

export interface ApiResponse<T = unknown> {
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

export interface ResumeAnalysisResponse {
  success: boolean;
  data: AnalysisResult;
  message: string;
}

export interface ImprovementPlanResponse {
  success: boolean;
  data: {
    improvements: string[];
    summary: string;
    quick_wins: string[];
  };
  message: string;
}

export interface SupportedFormatsResponse {
  success: boolean;
  data: {
    formats: string[];
    max_size: number;
  };
  message: string;
}
