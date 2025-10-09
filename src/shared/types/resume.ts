// ============================================================================
// RESUME TYPES
// ============================================================================

import { BaseEntity } from './index';

// ============================================================================
// RESUME DOCUMENT
// ============================================================================

export interface ResumeDocument extends BaseEntity {
  title: string;
  description?: string;
  version: string;
  status: 'draft' | 'published' | 'archived';
  template: string;
  sections: ResumeSection[];
  metadata: ResumeMetadata;
  settings: ResumeSettings;
  analytics: ResumeAnalytics;
}

export interface ResumeMetadata {
  fileName: string;
  fileSize: number;
  fileType: string;
  language: string;
  encoding: string;
  createdAt: Date;
  updatedAt: Date;
  lastAnalyzed?: Date;
  analysisCount: number;
  tags: string[];
  category: string;
  industry: string;
  experienceLevel: 'entry' | 'mid' | 'senior' | 'lead' | 'executive';
}

export interface ResumeSettings {
  theme: string;
  layout: string;
  font: string;
  fontSize: number;
  colorScheme: string;
  spacing: number;
  margins: {
    top: number;
    bottom: number;
    left: number;
    right: number;
  };
  showPageNumbers: boolean;
  showHeader: boolean;
  showFooter: boolean;
  watermark?: string;
}

export interface ResumeAnalytics {
  views: number;
  downloads: number;
  shares: number;
  lastViewed?: Date;
  lastDownloaded?: Date;
  lastShared?: Date;
  averageRating?: number;
  totalRatings: number;
  feedback: ResumeFeedback[];
}

export interface ResumeFeedback {
  id: string;
  rating: number;
  comment?: string;
  category: 'content' | 'design' | 'format' | 'overall';
  createdAt: Date;
  anonymous: boolean;
}

// ============================================================================
// RESUME SECTIONS
// ============================================================================

export interface ResumeSection {
  id: string;
  type: ResumeSectionType;
  title: string;
  order: number;
  visible: boolean;
  content: any;
  settings: SectionSettings;
}

export type ResumeSectionType =
  | 'header'
  | 'summary'
  | 'experience'
  | 'education'
  | 'skills'
  | 'projects'
  | 'certifications'
  | 'achievements'
  | 'publications'
  | 'volunteer'
  | 'languages'
  | 'interests'
  | 'references'
  | 'custom';

export interface SectionSettings {
  showTitle: boolean;
  showDates: boolean;
  showLocation: boolean;
  showDescription: boolean;
  maxItems?: number;
  sortOrder:
    | 'chronological'
    | 'reverse-chronological'
    | 'alphabetical'
    | 'custom';
  groupBy?: string;
  filterBy?: string[];
  customFields?: Record<string, any>;
}

// ============================================================================
// RESUME TEMPLATES
// ============================================================================

export interface ResumeTemplate {
  id: string;
  name: string;
  description: string;
  category:
    | 'professional'
    | 'creative'
    | 'academic'
    | 'technical'
    | 'executive';
  industry: string[];
  experienceLevel: string[];
  preview: string;
  thumbnail: string;
  sections: string[];
  layout: TemplateLayout;
  styling: TemplateStyling;
  features: string[];
  price: number;
  currency: string;
  isPremium: boolean;
  isPopular: boolean;
  rating: number;
  downloads: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface TemplateLayout {
  type: 'single-column' | 'two-column' | 'three-column' | 'mixed';
  sections: TemplateSection[];
  spacing: number;
  margins: {
    top: number;
    bottom: number;
    left: number;
    right: number;
  };
  pageSize: 'A4' | 'Letter' | 'Legal';
  orientation: 'portrait' | 'landscape';
}

export interface TemplateSection {
  id: string;
  type: ResumeSectionType;
  position: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  settings: SectionSettings;
}

export interface TemplateStyling {
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
    textSecondary: string;
  };
  typography: {
    fontFamily: string;
    headingFont: string;
    bodyFont: string;
    fontSize: {
      heading: number;
      subheading: number;
      body: number;
      small: number;
    };
    fontWeight: {
      heading: number;
      subheading: number;
      body: number;
    };
    lineHeight: number;
  };
  spacing: {
    section: number;
    item: number;
    line: number;
  };
  borders: {
    enabled: boolean;
    style: 'solid' | 'dashed' | 'dotted';
    width: number;
    color: string;
  };
  shadows: {
    enabled: boolean;
    color: string;
    blur: number;
    offset: {
      x: number;
      y: number;
    };
  };
}

// ============================================================================
// RESUME BUILDER
// ============================================================================

export interface ResumeBuilder {
  currentResume: ResumeDocument;
  templates: ResumeTemplate[];
  selectedTemplate: string;
  isEditing: boolean;
  hasUnsavedChanges: boolean;
  lastSaved?: Date;
  autoSave: boolean;
  autoSaveInterval: number;
  collaboration: CollaborationSettings;
}

export interface CollaborationSettings {
  enabled: boolean;
  participants: CollaborationParticipant[];
  permissions: CollaborationPermissions;
  realTimeSync: boolean;
  conflictResolution: 'manual' | 'automatic' | 'last-writer-wins';
}

export interface CollaborationParticipant {
  id: string;
  name: string;
  email: string;
  role: 'owner' | 'editor' | 'viewer' | 'commenter';
  avatar?: string;
  lastActive?: Date;
  cursor?: {
    position: number;
    selection?: {
      start: number;
      end: number;
    };
  };
}

export interface CollaborationPermissions {
  canEdit: boolean;
  canComment: boolean;
  canShare: boolean;
  canExport: boolean;
  canDelete: boolean;
  canInvite: boolean;
  canManagePermissions: boolean;
}

// ============================================================================
// RESUME EXPORT
// ============================================================================

export interface ResumeExport {
  id: string;
  resumeId: string;
  format: ExportFormat;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress: number;
  fileUrl?: string;
  fileName: string;
  fileSize?: number;
  expiresAt?: Date;
  createdAt: Date;
  completedAt?: Date;
  error?: string;
  options: ExportOptions;
}

export type ExportFormat = 'pdf' | 'docx' | 'html' | 'txt' | 'json' | 'xml';

export interface ExportOptions {
  includeAnalysis?: boolean;
  includeImprovements?: boolean;
  includeRawData?: boolean;
  template?: string;
  quality?: 'draft' | 'standard' | 'high' | 'print';
  watermark?: string;
  password?: string;
  metadata?: Record<string, any>;
}

// ============================================================================
// RESUME VALIDATION
// ============================================================================

export interface ResumeValidation {
  isValid: boolean;
  score: number;
  errors: ValidationError[];
  warnings: ValidationWarning[];
  suggestions: ValidationSuggestion[];
  sections: SectionValidation[];
  overall: OverallValidation;
}

export interface ValidationError {
  id: string;
  type: 'critical' | 'major' | 'minor';
  section: string;
  field: string;
  message: string;
  suggestion?: string;
  impact: number; // 0-100
}

export interface ValidationWarning {
  id: string;
  type: 'format' | 'content' | 'style' | 'ats';
  section: string;
  field: string;
  message: string;
  suggestion?: string;
  impact: number; // 0-100
}

export interface ValidationSuggestion {
  id: string;
  type: 'improvement' | 'optimization' | 'enhancement';
  section: string;
  field: string;
  message: string;
  impact: number; // 0-100
  effort: 'low' | 'medium' | 'high';
}

export interface SectionValidation {
  section: string;
  isValid: boolean;
  score: number;
  errors: ValidationError[];
  warnings: ValidationWarning[];
  suggestions: ValidationSuggestion[];
}

export interface OverallValidation {
  completeness: number; // 0-100
  atsCompatibility: number; // 0-100
  contentQuality: number; // 0-100
  formatQuality: number; // 0-100
  keywordOptimization: number; // 0-100
  readability: number; // 0-100
}

// ============================================================================
// RESUME ANALYTICS
// ============================================================================

export interface ResumeAnalyticsData {
  resumeId: string;
  period: 'day' | 'week' | 'month' | 'quarter' | 'year';
  metrics: AnalyticsMetrics;
  trends: AnalyticsTrends;
  comparisons: AnalyticsComparisons;
  insights: AnalyticsInsights[];
}

export interface AnalyticsMetrics {
  views: number;
  downloads: number;
  shares: number;
  timeSpent: number;
  bounceRate: number;
  conversionRate: number;
  averageRating: number;
  totalRatings: number;
  uniqueViewers: number;
  returningViewers: number;
}

export interface AnalyticsTrends {
  views: TrendData[];
  downloads: TrendData[];
  shares: TrendData[];
  ratings: TrendData[];
  engagement: TrendData[];
}

export interface TrendData {
  date: string;
  value: number;
  change: number;
  changePercent: number;
}

export interface AnalyticsComparisons {
  industry: ComparisonData[];
  experienceLevel: ComparisonData[];
  template: ComparisonData[];
  region: ComparisonData[];
}

export interface ComparisonData {
  category: string;
  value: number;
  rank: number;
  percentile: number;
}

export interface AnalyticsInsights {
  id: string;
  type: 'performance' | 'optimization' | 'trend' | 'recommendation';
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  actionable: boolean;
  category: string;
  data: any;
  createdAt: Date;
}

// ============================================================================
// RESUME SHARING
// ============================================================================

export interface ResumeShare {
  id: string;
  resumeId: string;
  type: 'public' | 'private' | 'password-protected' | 'expiring';
  url: string;
  password?: string;
  expiresAt?: Date;
  maxViews?: number;
  currentViews: number;
  allowDownload: boolean;
  allowPrint: boolean;
  allowCopy: boolean;
  tracking: ShareTracking;
  createdAt: Date;
  createdBy: string;
}

export interface ShareTracking {
  enabled: boolean;
  trackViews: boolean;
  trackDownloads: boolean;
  trackTime: boolean;
  trackLocation: boolean;
  trackDevice: boolean;
  trackReferrer: boolean;
  analytics: ShareAnalytics;
}

export interface ShareAnalytics {
  totalViews: number;
  uniqueViews: number;
  totalDownloads: number;
  averageTimeSpent: number;
  topCountries: Array<{ country: string; views: number }>;
  topDevices: Array<{ device: string; views: number }>;
  topReferrers: Array<{ referrer: string; views: number }>;
  hourlyViews: Array<{ hour: number; views: number }>;
  dailyViews: Array<{ date: string; views: number }>;
}
