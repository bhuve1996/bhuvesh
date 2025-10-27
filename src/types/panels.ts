// Panel and Tab Types
// Consolidated from component-specific types

export type PanelTab =
  | 'ats'
  | 'customize'
  | 'validate'
  | 'export'
  | 'page-breaks';

export interface FloatingPanelProps {
  resumeData: import('./resume').ResumeData;
  template: import('./resume').ResumeTemplate;
  onTemplateChange: (template: import('./resume').ResumeTemplate) => void;
  resumeElement?: HTMLElement | null;
  className?: string;
}

// Base tab props interface
export interface BaseTabProps {
  resumeData: import('./resume').ResumeData;
  className?: string;
}

// Specific tab props interfaces
export type ValidationTabProps = BaseTabProps;

export type ATSAnalysisTabProps = BaseTabProps;

export interface ExportTabProps extends BaseTabProps {
  template: import('./resume').ResumeTemplate;
  onTemplateChange: (template: import('./resume').ResumeTemplate) => void;
  resumeElement?: HTMLElement | null;
}

export interface PageBreaksTabProps extends BaseTabProps {
  template: import('./resume').ResumeTemplate;
  onTemplateChange: (template: import('./resume').ResumeTemplate) => void;
  resumeElement?: HTMLElement | null;
}

export interface TemplateCustomizerTabProps extends BaseTabProps {
  template: import('./resume').ResumeTemplate;
  onTemplateChange: (template: import('./resume').ResumeTemplate) => void;
}

// Section-related props
export interface SectionValidationProps {
  section: string;
  data: unknown;
  onValidate: (isValid: boolean, errors: string[]) => void;
  className?: string;
}

export interface SectionSeparatorProps {
  variant?: 'line' | 'gradient' | 'dots' | 'shadow';
  color?: 'primary' | 'secondary' | 'accent' | 'neutral' | 'muted';
  className?: string;
}

export interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  className?: string;
}
