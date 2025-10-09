export interface FileUploadProps {
  accept?: string;
  multiple?: boolean;
  maxSize?: number;
  maxFiles?: number;
  onUpload: (files: File[]) => void;
  onError?: (error: string) => void;
  loading?: boolean;
  disabled?: boolean;
  dragAndDrop?: boolean;
  preview?: boolean;
  validation?: {
    allowedTypes?: string[];
    maxSize?: number;
    minSize?: number;
    custom?: (file: File) => string | null;
  };
  className?: string;
  'data-testid'?: string;
}
