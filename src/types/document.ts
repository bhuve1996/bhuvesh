// Document and Export Types
// For DOCX and other document-related types

export interface DocumentSpacing {
  before?: number;
  after?: number;
}

export interface DocumentStyle {
  spacing: DocumentSpacing;
  alignment?: 'left' | 'center' | 'right' | 'justify';
  fontSize?: number;
  fontFamily?: string;
  bold?: boolean;
  italic?: boolean;
}

export interface ExportOptions {
  format: 'pdf' | 'docx' | 'html';
  quality?: 'draft' | 'standard' | 'high';
  includeMetadata?: boolean;
  watermark?: string;
}

// Predefined spacing configurations for common use cases
export const DOCUMENT_SPACING = {
  SMALL: { after: 50 },
  MEDIUM: { after: 100 },
  LARGE: { after: 200 },
  EXTRA_LARGE: { after: 300 },
  SECTION_BREAK: { before: 200, after: 200 },
  PARAGRAPH_BREAK: { before: 200, after: 300 },
} as const;

// Export format types
export type ExportFormat = 'pdf' | 'docx' | 'txt';
