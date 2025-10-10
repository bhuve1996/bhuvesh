import { useCallback, useState } from 'react';

import { ProgressStep } from '@/types';

export interface AnalysisProgress {
  currentStep: number;
  steps: ProgressStep[];
  isAnalyzing: boolean;
  error: string | null;
}

export const useAnalysisProgress = () => {
  const [progress, setProgress] = useState<AnalysisProgress>({
    currentStep: 0,
    steps: [
      {
        id: 'upload',
        title: 'Uploading',
        description: 'Processing your resume file',
        icon: '📄',
        status: 'pending',
      },
      {
        id: 'parsing',
        title: 'Parsing',
        description: 'Extracting content and structure',
        icon: '🔍',
        status: 'pending',
      },
      {
        id: 'analyzing',
        title: 'Analyzing',
        description: 'Running ATS compatibility check',
        icon: '⚡',
        status: 'pending',
      },
      {
        id: 'results',
        title: 'Results',
        description: 'Generating your analysis report',
        icon: '📊',
        status: 'pending',
      },
    ],
    isAnalyzing: false,
    error: null,
  });

  const startAnalysis = useCallback(() => {
    setProgress(prev => ({
      ...prev,
      currentStep: 0,
      isAnalyzing: true,
      error: null,
      steps: prev.steps.map(step => ({
        ...step,
        status: 'pending' as const,
      })),
    }));
  }, []);

  const updateStep = useCallback(
    (stepIndex: number, status: ProgressStep['status'] = 'active') => {
      setProgress(prev => ({
        ...prev,
        currentStep: stepIndex,
        steps: prev.steps.map((step, index) => ({
          ...step,
          status:
            index < stepIndex
              ? 'completed'
              : index === stepIndex
                ? status
                : 'pending',
        })),
      }));
    },
    []
  );

  const completeStep = useCallback((stepIndex: number) => {
    setProgress(prev => ({
      ...prev,
      currentStep: stepIndex + 1,
      steps: prev.steps.map((step, index) => ({
        ...step,
        status: index <= stepIndex ? 'completed' : 'pending',
      })),
    }));
  }, []);

  const setError = useCallback((error: string, stepIndex?: number) => {
    setProgress(prev => ({
      ...prev,
      error,
      isAnalyzing: false,
      steps: prev.steps.map((step, index) => ({
        ...step,
        status:
          stepIndex !== undefined && index === stepIndex
            ? 'error'
            : step.status,
      })),
    }));
  }, []);

  const completeAnalysis = useCallback(() => {
    setProgress(prev => ({
      ...prev,
      isAnalyzing: false,
      currentStep: prev.steps.length - 1,
      steps: prev.steps.map(step => ({
        ...step,
        status: 'completed' as const,
      })),
    }));
  }, []);

  const resetProgress = useCallback(() => {
    setProgress(prev => ({
      ...prev,
      currentStep: 0,
      isAnalyzing: false,
      error: null,
      steps: prev.steps.map(step => ({
        ...step,
        status: 'pending' as const,
      })),
    }));
  }, []);

  return {
    progress,
    startAnalysis,
    updateStep,
    completeStep,
    setError,
    completeAnalysis,
    resetProgress,
  };
};
