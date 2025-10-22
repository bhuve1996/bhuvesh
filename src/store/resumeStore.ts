import { useMemo } from 'react';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { AnalysisResult, ResumeData, ResumeTemplate } from '@/types';

interface ResumeState {
  // Core resume data
  resumeData: ResumeData | null;
  analysisResult: AnalysisResult | null;
  selectedTemplate: ResumeTemplate | null;
  customizedTemplate: ResumeTemplate | null;

  // UI state
  isLoading: boolean;
  error: string | null;

  // Navigation state
  currentStep: 'ats-checker' | 'resume-builder' | 'templates' | 'preview';
  previousStep: string | null;

  // Template customization
  useUserData: boolean;
  showDataChoice: boolean;

  // Actions
  setResumeData: (data: ResumeData) => void;
  setAnalysisResult: (result: AnalysisResult) => void;
  setSelectedTemplate: (template: ResumeTemplate) => void;
  setCustomizedTemplate: (template: ResumeTemplate) => void;
  setCurrentStep: (step: ResumeState['currentStep']) => void;
  setPreviousStep: (step: string) => void;
  setUseUserData: (useUser: boolean) => void;
  setShowDataChoice: (show: boolean) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;

  // Navigation helpers
  navigateToStep: (
    step: ResumeState['currentStep'],
    preserveData?: boolean
  ) => void;
  goBack: () => void;

  // Data management
  clearAllData: () => void;
  clearAnalysisData: () => void;
  clearTemplateData: () => void;

  // Utility functions
  hasResumeData: () => boolean;
  hasAnalysisResult: () => boolean;
  hasSelectedTemplate: () => boolean;
  getCurrentData: () => ResumeData | null;
}

const initialState = {
  resumeData: null,
  analysisResult: null,
  selectedTemplate: null,
  customizedTemplate: null,
  isLoading: false,
  error: null,
  currentStep: 'ats-checker' as const,
  previousStep: null,
  useUserData: false,
  showDataChoice: false,
};

export const useResumeStore = create<ResumeState>()(
  persist(
    (set, get) => ({
      ...initialState,

      // Core setters
      setResumeData: data => set({ resumeData: data, error: null }),
      setAnalysisResult: result => set({ analysisResult: result, error: null }),
      setSelectedTemplate: template =>
        set({
          selectedTemplate: template,
          customizedTemplate: template,
          error: null,
        }),
      setCustomizedTemplate: template => set({ customizedTemplate: template }),

      // UI state setters
      setCurrentStep: step => set({ currentStep: step }),
      setPreviousStep: step => set({ previousStep: step }),
      setUseUserData: useUser => set({ useUserData: useUser }),
      setShowDataChoice: show => set({ showDataChoice: show }),
      setLoading: loading => set({ isLoading: loading }),
      setError: error => set({ error }),

      // Navigation helpers
      navigateToStep: (step, preserveData = true) => {
        const currentStep = get().currentStep;
        set({
          previousStep: currentStep,
          currentStep: step,
          error: null,
        });

        // If not preserving data, clear relevant data
        if (!preserveData) {
          switch (step) {
            case 'ats-checker':
              set({ analysisResult: null });
              break;
            case 'resume-builder':
              // Keep resume data but clear analysis
              break;
            case 'templates':
              // Keep resume data and analysis
              break;
            case 'preview':
              // Keep everything
              break;
          }
        }
      },

      goBack: () => {
        const { previousStep } = get();
        if (previousStep) {
          set({
            currentStep: previousStep as ResumeState['currentStep'],
            previousStep: null,
          });
        }
      },

      // Data management
      clearAllData: () => set(initialState),
      clearAnalysisData: () =>
        set({
          analysisResult: null,
          selectedTemplate: null,
          customizedTemplate: null,
        }),
      clearTemplateData: () =>
        set({
          selectedTemplate: null,
          customizedTemplate: null,
        }),

      // Utility functions
      hasResumeData: () => !!get().resumeData,
      hasAnalysisResult: () => !!get().analysisResult,
      hasSelectedTemplate: () => !!get().selectedTemplate,
      getCurrentData: () => {
        const { resumeData } = get();
        return resumeData;
      },
    }),
    {
      name: 'resume-store',
      storage: createJSONStorage(() => localStorage),
      // Only persist essential data, not UI state
      partialize: state => ({
        resumeData: state.resumeData,
        analysisResult: state.analysisResult,
        selectedTemplate: state.selectedTemplate,
        customizedTemplate: state.customizedTemplate,
        useUserData: state.useUserData,
        currentStep: state.currentStep,
      }),
    }
  )
);

// Selectors for better performance
export const useResumeData = () => useResumeStore(state => state.resumeData);
export const useAnalysisResult = () =>
  useResumeStore(state => state.analysisResult);
export const useSelectedTemplate = () =>
  useResumeStore(state => state.selectedTemplate);
export const useCustomizedTemplate = () =>
  useResumeStore(state => state.customizedTemplate);
export const useCurrentStep = () => useResumeStore(state => state.currentStep);
export const useNavigation = () => {
  const navigateToStep = useResumeStore(state => state.navigateToStep);
  const goBack = useResumeStore(state => state.goBack);
  const currentStep = useResumeStore(state => state.currentStep);
  const previousStep = useResumeStore(state => state.previousStep);

  return useMemo(
    () => ({
      navigateToStep,
      goBack,
      currentStep,
      previousStep,
    }),
    [navigateToStep, goBack, currentStep, previousStep]
  );
};

// Action selectors
export const useResumeActions = () => {
  const setResumeData = useResumeStore(state => state.setResumeData);
  const setAnalysisResult = useResumeStore(state => state.setAnalysisResult);
  const setSelectedTemplate = useResumeStore(
    state => state.setSelectedTemplate
  );
  const setCustomizedTemplate = useResumeStore(
    state => state.setCustomizedTemplate
  );
  const setUseUserData = useResumeStore(state => state.setUseUserData);
  const setShowDataChoice = useResumeStore(state => state.setShowDataChoice);
  const setLoading = useResumeStore(state => state.setLoading);
  const setError = useResumeStore(state => state.setError);
  const clearAllData = useResumeStore(state => state.clearAllData);
  const clearAnalysisData = useResumeStore(state => state.clearAnalysisData);
  const clearTemplateData = useResumeStore(state => state.clearTemplateData);

  return useMemo(
    () => ({
      setResumeData,
      setAnalysisResult,
      setSelectedTemplate,
      setCustomizedTemplate,
      setUseUserData,
      setShowDataChoice,
      setLoading,
      setError,
      clearAllData,
      clearAnalysisData,
      clearTemplateData,
    }),
    [
      setResumeData,
      setAnalysisResult,
      setSelectedTemplate,
      setCustomizedTemplate,
      setUseUserData,
      setShowDataChoice,
      setLoading,
      setError,
      clearAllData,
      clearAnalysisData,
      clearTemplateData,
    ]
  );
};

// Utility selectors
export const useResumeUtils = () => {
  const hasResumeData = useResumeStore(state => state.hasResumeData);
  const hasAnalysisResult = useResumeStore(state => state.hasAnalysisResult);
  const hasSelectedTemplate = useResumeStore(
    state => state.hasSelectedTemplate
  );
  const getCurrentData = useResumeStore(state => state.getCurrentData);
  const isLoading = useResumeStore(state => state.isLoading);
  const error = useResumeStore(state => state.error);

  return useMemo(
    () => ({
      hasResumeData,
      hasAnalysisResult,
      hasSelectedTemplate,
      getCurrentData,
      isLoading,
      error,
    }),
    [
      hasResumeData,
      hasAnalysisResult,
      hasSelectedTemplate,
      getCurrentData,
      isLoading,
      error,
    ]
  );
};
