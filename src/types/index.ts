// Export all types from a central location
export * from './ui';
export * from './components';
export * from './api';
export * from './common';

// Export resume types with specific names to avoid conflicts
export type {
  PersonalInfo,
  WorkExperience as ResumeWorkExperience,
  Education as ResumeEducation,
  Project as ResumeProject,
  Skills,
  ResumeData,
  AnalysisResult,
  SectionConfig,
  ColorScheme,
  FontConfig,
  SpacingConfig,
  LayoutConfig,
  ResumeTemplate,
  BuilderState,
  ExportOptions as ResumeExportOptions,
  TemplateFilter,
  TemplateGalleryState,
} from './resume';

// Export ATS types with specific names to avoid conflicts
export type {
  ContactInfo,
  Education as ATSEducation,
  ProjectDetail,
  WorkExperience as ATSWorkExperience,
  SkillsFound,
  FormattingAnalysis,
  CategorizedResume,
  ExtractionDetails,
  ATSCompatibility,
  FormatAnalysis,
  DetailedScores,
  Project as ATSProject,
  Position,
  StructuredWorkExperience,
  StructuredContactInfo,
  Skill,
  SkillCategory,
  StructuredEducation,
  Certification,
  Award,
  Automation,
  StructuredExperience,
  ATSAnalysisBackendResponse,
} from './ats';
