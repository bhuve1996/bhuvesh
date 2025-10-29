import { AnalysisResult } from './ats';
import { ResumeData } from './resume';

export interface ATSAnalysisResult {
  id: string;
  jobDescription: string;
  jobCategory: string;
  jobTitle?: string;
  atsScore: number;
  results: AnalysisResult; // Full analysis from backend
  analyzedAt: Date;
  fileHash: string; // To detect if resume changed
}

export interface ResumeVariant {
  id: string;
  name: string;
  description?: string | undefined;
  data: ResumeData;
  templateId: string;
  createdAt: Date;
  updatedAt: Date;
  tags: string[];

  // ATS Analysis Results
  analyses: ATSAnalysisResult[];
  lastAnalysisAt?: Date | undefined;
  bestScore?: number | undefined;
  bestJobCategory?: string | undefined;
}

export interface ResumeGroup {
  id: string;
  name: string; // "Software Engineer Resumes"
  description?: string | undefined;
  variants: ResumeVariant[];
  createdAt: Date;
  updatedAt: Date;
}
