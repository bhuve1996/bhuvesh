// API and Data Types
import type { AnalysisResult } from './resume';

// Re-export unified API types
export type { ApiResponse, ApiError } from '@/lib/api/unifiedClient';

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
