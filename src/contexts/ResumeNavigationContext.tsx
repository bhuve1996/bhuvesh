'use client';

import { useNavigation } from '@/store/resumeStore';
import { usePathname, useRouter } from 'next/navigation';
import React, { createContext, useContext, useEffect } from 'react';

interface ResumeNavigationContextType {
  navigateToAtsChecker: () => void;
  navigateToResumeBuilder: () => void;
  navigateToTemplates: () => void;
  navigateToPreview: () => void;
  goBack: () => void;
  canGoBack: () => boolean;
  getCurrentStep: () => string;
}

const ResumeNavigationContext =
  createContext<ResumeNavigationContextType | null>(null);

export const useResumeNavigation = () => {
  const context = useContext(ResumeNavigationContext);
  if (!context) {
    throw new Error(
      'useResumeNavigation must be used within ResumeNavigationProvider'
    );
  }
  return context;
};

interface ResumeNavigationProviderProps {
  children: React.ReactNode;
}

export const ResumeNavigationProvider: React.FC<
  ResumeNavigationProviderProps
> = ({ children }) => {
  const router = useRouter();
  const pathname = usePathname();
  const { navigateToStep, goBack, currentStep, previousStep } = useNavigation();
  // const { hasResumeData, hasAnalysisResult, hasSelectedTemplate } =
  //   useResumeUtils();

  // Sync URL with store state
  useEffect(() => {
    const pathToStep: Record<string, string> = {
      '/resume/ats-checker': 'ats-checker',
      '/resume/builder': 'resume-builder',
      '/resume/templates': 'templates',
      '/resume/preview': 'preview',
    };

    const currentPathStep = pathToStep[pathname];
    if (currentPathStep && currentPathStep !== currentStep) {
      navigateToStep(currentPathStep as any, true);
    }
  }, [pathname, currentStep, navigateToStep]);

  const navigateToAtsChecker = () => {
    navigateToStep('ats-checker', true);
    router.push('/resume/ats-checker');
  };

  const navigateToResumeBuilder = () => {
    navigateToStep('resume-builder', true);
    router.push('/resume/builder');
  };

  const navigateToTemplates = () => {
    navigateToStep('templates', true);
    router.push('/resume/templates');
  };

  const navigateToPreview = () => {
    navigateToStep('preview', true);
    router.push('/resume/preview');
  };

  const canGoBack = () => {
    return !!previousStep;
  };

  const getCurrentStep = () => {
    return currentStep;
  };

  const contextValue: ResumeNavigationContextType = {
    navigateToAtsChecker,
    navigateToResumeBuilder,
    navigateToTemplates,
    navigateToPreview,
    goBack,
    canGoBack,
    getCurrentStep,
  };

  return (
    <ResumeNavigationContext.Provider value={contextValue}>
      {children}
    </ResumeNavigationContext.Provider>
  );
};
