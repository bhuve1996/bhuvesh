// ============================================================================
// API TYPES
// ============================================================================

import { ApiResponse } from './index';

// ============================================================================
// REQUEST TYPES
// ============================================================================

export interface FileUploadRequest {
  file: File;
  jobDescription?: string;
  options?: {
    includeAnalysis?: boolean;
    includeImprovements?: boolean;
    includeRawData?: boolean;
  };
}

export interface ResumeAnalysisRequest {
  file: File;
  jobDescription: string;
  analysisOptions?: {
    includeSemanticAnalysis?: boolean;
    includeFormatAnalysis?: boolean;
    includeExperienceExtraction?: boolean;
    includeSkillsExtraction?: boolean;
    includeEducationExtraction?: boolean;
  };
}

export interface ImprovementPlanRequest {
  analysisResult: any;
  extractedData: any;
  jobDescription?: string;
  preferences?: {
    focusAreas?: string[];
    priority?: 'high' | 'medium' | 'low';
    timeFrame?: 'immediate' | 'short-term' | 'long-term';
  };
}

export interface JobDescriptionRequest {
  jobDescription: string;
  resumeText?: string;
  analysisType?: 'keyword' | 'semantic' | 'comprehensive';
}

// ============================================================================
// RESPONSE TYPES
// ============================================================================

export interface FileUploadResponse extends ApiResponse {
  data: {
    filename: string;
    fileSize: number;
    fileType: string;
    text: string;
    wordCount: number;
    characterCount: number;
    formattingAnalysis: any;
    parsedContent: any;
  };
}

export interface ResumeAnalysisResponse extends ApiResponse {
  data: {
    atsScore: number;
    matchCategory: string;
    detectedJobType?: string;
    jobDetectionConfidence?: number;
    keywordMatches?: string[];
    missingKeywords?: string[];
    semanticSimilarity?: number;
    suggestions?: string[];
    strengths?: string[];
    weaknesses?: string[];
    formattingIssues?: string[];
    atsFriendly?: boolean;
    wordCount?: number;
    detailedScores?: any;
    atsCompatibility?: any;
    formatAnalysis?: any;
    structuredExperience?: any;
    extractionDetails?: any;
    categorizedResume?: any;
    processingTime: number;
    analysisVersion: string;
    generatedAt: string;
  };
}

export interface ImprovementPlanResponse extends ApiResponse {
  data: {
    improvements: any[];
    summary: any;
    quickWins: any[];
    currentScore: number;
    targetScore: number;
    estimatedImpact: number;
    estimatedTime: string;
    generatedAt: string;
  };
}

export interface JobDescriptionAnalysisResponse extends ApiResponse {
  data: {
    keywords: string[];
    requirements: string[];
    responsibilities: string[];
    skills: string[];
    experience: string;
    education: string;
    industry: string;
    jobLevel: string;
    analysis: any;
  };
}

export interface SupportedFormatsResponse extends ApiResponse {
  data: {
    supportedFormats: string[];
    maxFileSize: string;
    description: string;
  };
}

// ============================================================================
// ERROR TYPES
// ============================================================================

export class ApiError extends Error {
  public code: string;
  public details?: any;
  public timestamp: string;
  public path?: string;
  public method?: string;

  constructor(
    code: string,
    message: string,
    details?: any,
    timestamp: string = new Date().toISOString(),
    path?: string,
    method?: string
  ) {
    super(message);
    this.name = 'ApiError';
    this.code = code;
    this.details = details;
    this.timestamp = timestamp;
    if (path !== undefined) this.path = path;
    if (method !== undefined) this.method = method;
  }
}

export interface ValidationError extends ApiError {
  field: string;
  value: any;
  constraint: string;
}

export interface FileUploadError extends ApiError {
  fileName?: string;
  fileSize?: number;
  fileType?: string;
  reason: 'size' | 'type' | 'corrupt' | 'permission' | 'network' | 'server';
}

export interface AnalysisError extends ApiError {
  analysisType?: string;
  step?: string;
  reason: 'parsing' | 'analysis' | 'ai' | 'validation' | 'timeout' | 'server';
}

// ============================================================================
// ENDPOINT TYPES
// ============================================================================

export interface ApiEndpoint {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  path: string;
  description: string;
  parameters?: ApiParameter[];
  requestBody?: any;
  responses: ApiResponseSchema[];
  tags?: string[];
  deprecated?: boolean;
}

export interface ApiParameter {
  name: string;
  type: string;
  required: boolean;
  description: string;
  example?: any;
  schema?: any;
}

export interface ApiResponseSchema {
  status: number;
  description: string;
  schema: any;
  example?: any;
}

// ============================================================================
// API CONFIGURATION
// ============================================================================

export interface ApiConfig {
  baseUrl: string;
  timeout: number;
  retries: number;
  retryDelay: number;
  headers: Record<string, string>;
  interceptors?: {
    request?: (config: any) => any;
    response?: (response: any) => any;
    error?: (error: any) => any;
  };
}

export interface ApiClient {
  get: <T = any>(url: string, config?: any) => Promise<T>;
  post: <T = any>(url: string, data?: any, config?: any) => Promise<T>;
  put: <T = any>(url: string, data?: any, config?: any) => Promise<T>;
  delete: <T = any>(url: string, config?: any) => Promise<T>;
  patch: <T = any>(url: string, data?: any, config?: any) => Promise<T>;
  upload: <T = any>(
    url: string,
    formData: FormData,
    config?: any
  ) => Promise<T>;
}

// ============================================================================
// WEBSOCKET TYPES
// ============================================================================

export interface WebSocketMessage {
  type: string;
  data: any;
  timestamp: string;
  id?: string;
}

export interface WebSocketConfig {
  url: string;
  protocols?: string[];
  reconnectInterval?: number;
  maxReconnectAttempts?: number;
  heartbeatInterval?: number;
  onOpen?: () => void;
  onClose?: () => void;
  onError?: (error: Event) => void;
  onMessage?: (message: WebSocketMessage) => void;
}

// ============================================================================
// CACHE TYPES
// ============================================================================

export interface CacheConfig {
  ttl: number; // Time to live in seconds
  maxSize: number; // Maximum number of items
  strategy: 'lru' | 'fifo' | 'lfu'; // Cache eviction strategy
}

export interface CacheItem<T = any> {
  key: string;
  value: T;
  timestamp: number;
  ttl: number;
  hits: number;
}

export interface CacheManager {
  get: <T = any>(key: string) => Promise<T | null>;
  set: <T = any>(key: string, value: T, ttl?: number) => Promise<void>;
  delete: (key: string) => Promise<void>;
  clear: () => Promise<void>;
  has: (key: string) => Promise<boolean>;
  keys: () => Promise<string[]>;
  size: () => Promise<number>;
}

// ============================================================================
// RATE LIMITING
// ============================================================================

export interface RateLimitConfig {
  windowMs: number; // Time window in milliseconds
  maxRequests: number; // Maximum requests per window
  skipSuccessfulRequests?: boolean;
  skipFailedRequests?: boolean;
  keyGenerator?: (req: any) => string;
}

export interface RateLimitInfo {
  limit: number;
  remaining: number;
  reset: number;
  retryAfter?: number;
}

// ============================================================================
// MONITORING TYPES
// ============================================================================

export interface ApiMetrics {
  requestCount: number;
  responseTime: number;
  errorRate: number;
  successRate: number;
  throughput: number;
  lastRequest?: string;
  endpoints: Record<string, EndpointMetrics>;
}

export interface EndpointMetrics {
  requestCount: number;
  averageResponseTime: number;
  errorCount: number;
  successCount: number;
  lastRequest?: string;
}

export interface HealthCheck {
  status: 'healthy' | 'unhealthy' | 'degraded';
  timestamp: string;
  uptime: number;
  version: string;
  dependencies: Record<string, DependencyHealth>;
  metrics: ApiMetrics;
}

export interface DependencyHealth {
  status: 'healthy' | 'unhealthy' | 'degraded';
  responseTime?: number;
  lastCheck: string;
  error?: string;
}

// ============================================================================
// AUTHENTICATION TYPES
// ============================================================================

export interface AuthToken {
  accessToken: string;
  refreshToken?: string;
  expiresIn: number;
  tokenType: string;
  scope?: string[];
}

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: string;
  permissions: string[];
  lastLogin?: string;
}

export interface AuthConfig {
  tokenKey: string;
  refreshTokenKey: string;
  tokenExpiry: number;
  refreshTokenExpiry: number;
  autoRefresh: boolean;
  refreshThreshold: number; // Refresh when token expires in X seconds
}
