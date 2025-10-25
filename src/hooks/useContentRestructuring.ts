/**
 * Hook for AI-powered content restructuring
 * Automatically restructures resume content for better presentation
 */

import { useCallback, useEffect, useState } from 'react';

import { ContentRestructuringService } from '@/lib/ai/contentRestructuring';
import { ResumeData } from '@/types/resume';

export interface UseContentRestructuringOptions {
  autoRestructure?: boolean;
  enableAIAnalysis?: boolean;
}

export interface UseContentRestructuringReturn {
  restructuredData: ResumeData | null;
  isRestructuring: boolean;
  restructureContent: (data: ResumeData) => Promise<ResumeData>;
  error: string | null;
}

export const useContentRestructuring = (
  originalData: ResumeData | null,
  options: UseContentRestructuringOptions = {}
): UseContentRestructuringReturn => {
  const { autoRestructure = true, enableAIAnalysis = true } = options;

  const [restructuredData, setRestructuredData] = useState<ResumeData | null>(
    null
  );
  const [isRestructuring, setIsRestructuring] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const restructureContent = useCallback(
    async (data: ResumeData): Promise<ResumeData> => {
      if (!enableAIAnalysis) {
        return data;
      }

      setIsRestructuring(true);
      setError(null);

      try {
        // Simulate AI processing time
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Restructure the content
        const restructured =
          ContentRestructuringService.restructureResumeData(data);

        // Generate improved summary
        const improvedSummary =
          ContentRestructuringService.generateImprovedSummary(data);
        restructured.summary = improvedSummary;

        setRestructuredData(restructured);
        return restructured;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Failed to restructure content';
        setError(errorMessage);
        return data; // Return original data on error
      } finally {
        setIsRestructuring(false);
      }
    },
    [enableAIAnalysis]
  );

  // Auto-restructure when original data changes
  useEffect(() => {
    if (autoRestructure && originalData && enableAIAnalysis) {
      restructureContent(originalData);
    }
  }, [originalData, autoRestructure, enableAIAnalysis, restructureContent]);

  return {
    restructuredData,
    isRestructuring,
    restructureContent,
    error,
  };
};
