import { AnalysisResult } from '@/shared/types/ats';

export interface ATSCheckerProps {
  onAnalysisComplete?: (result: AnalysisResult) => void;
  onError?: (error: string) => void;
  className?: string;
  'data-testid'?: string;
}
