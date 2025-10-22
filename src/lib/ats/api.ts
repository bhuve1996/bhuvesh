/**
 * API Service for Enhanced ATS Backend
 * Connects to Python FastAPI backend with semantic matching
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export interface ATSAnalysisResult {
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
}

export interface ATSAnalysisResponse {
  success: boolean;
  data: ATSAnalysisResult;
  message: string;
}

/**
 * Check if backend is healthy
 */
export async function checkBackendHealth(): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/health`);
    const data = await response.json();
    return data.status === 'healthy';
  } catch {
    return false;
  }
}

/**
 * Analyze resume with job description using enhanced backend
 */
export async function analyzeResumeWithJobDescription(
  file: File,
  jobDescription: string
): Promise<ATSAnalysisResponse> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('job_description', jobDescription);

  try {
    const response = await fetch(`${API_BASE_URL}/api/upload/analyze`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Analysis failed');
    }

    return response.json();
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Failed to connect to analysis server');
  }
}

/**
 * Parse resume only (without job description)
 */
export async function parseResume(file: File) {
  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await fetch(`${API_BASE_URL}/api/upload/parse`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to parse file');
    }

    return response.json();
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Failed to parse resume');
  }
}

/**
 * Get supported file formats
 */
export async function getSupportedFormats() {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/upload/supported-formats`
    );
    return response.json();
  } catch {
    return {
      supported_formats: ['.pdf', '.docx', '.doc', '.txt'],
      max_file_size: '10MB',
    };
  }
}
