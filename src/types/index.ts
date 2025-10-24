// Export all types from a central location
export * from './analytics';
export * from './api';
export * from './common';
export * from './components';
export type { DocumentStyle } from './document';
export * from './forms';
export * from './panels';
export * from './portfolio';
export * from './theme';
export * from './ui';
export type { ATSAnalysisProps as UIATSAnalysisProps } from './ui-components';

// Export resume types with specific names to avoid conflicts
export type {
  AnalysisResult,
  BuilderState,
  ColorScheme,
  FontConfig,
  LayoutConfig,
  PersonalInfo,
  ResumeData,
  Education as ResumeEducation,
  ExportOptions as ResumeExportOptions,
  Project as ResumeProject,
  ResumeTemplate,
  WorkExperience as ResumeWorkExperience,
  SectionConfig,
  Skills,
  SpacingConfig,
  TemplateFilter,
  TemplateGalleryState,
} from './resume';

// Export ATS types with specific names to avoid conflicts
export type {
  ATSAnalysisBackendResponse,
  ATSCompatibility,
  Education as ATSEducation,
  Project as ATSProject,
  WorkExperience as ATSWorkExperience,
  Automation,
  Award,
  CategorizedResume,
  Certification,
  ContactInfo,
  DetailedScores,
  ExtractionDetails,
  FormatAnalysis,
  FormattingAnalysis,
  Position,
  ProjectDetail,
  Skill,
  SkillCategory,
  SkillsFound,
  StructuredContactInfo,
  StructuredEducation,
  StructuredExperience,
  StructuredWorkExperience,
} from './ats';

// Export ATS-specific types from lib
export type { JobProfile } from '@/lib/ats/jobProfiles';
