import { useMemo } from 'react';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import {
  AnalysisResult,
  Certification,
  ResumeData,
  ResumeTemplate,
} from '@/types';

interface ResumeState {
  // Core resume data
  resumeData: ResumeData | null;
  analysisResult: AnalysisResult | null;
  extractedDataBackup: ResumeData | null; // Backup of original extracted data
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

  // Section color state for consistent preview/export
  sectionColors: {
    [sectionId: string]: {
      primary: string;
      secondary: string;
      accent: string;
      text: string;
      background: string;
    };
  };

  // Actions
  setResumeData: (data: ResumeData) => void;
  setAnalysisResult: (result: AnalysisResult) => void;
  setExtractedDataBackup: (data: ResumeData) => void;
  setSelectedTemplate: (template: ResumeTemplate) => void;
  setCustomizedTemplate: (template: ResumeTemplate) => void;
  setCurrentStep: (step: ResumeState['currentStep']) => void;
  setPreviousStep: (step: string) => void;
  setUseUserData: (useUser: boolean) => void;
  setShowDataChoice: (show: boolean) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;

  // Section color actions
  setSectionColors: (
    sectionId: string,
    colors: ResumeState['sectionColors'][string]
  ) => void;
  getSectionColors: (
    sectionId: string
  ) => ResumeState['sectionColors'][string] | null;
  resetSectionColors: () => void;

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
  resetToExtractedData: () => void; // Reset to original extracted data

  // Utility functions
  hasResumeData: () => boolean;
  hasAnalysisResult: () => boolean;
  hasSelectedTemplate: () => boolean;
  getCurrentData: () => ResumeData | null;

  // Enhanced content management actions
  updatePersonalInfo: (personal: Partial<ResumeData['personal']>) => void;
  updateSummary: (summary: string) => void;
  addExperience: (experience: ResumeData['experience'][0]) => void;
  updateExperience: (
    id: string,
    experience: Partial<ResumeData['experience'][0]>
  ) => void;
  removeExperience: (id: string) => void;
  addEducation: (education: ResumeData['education'][0]) => void;
  updateEducation: (
    id: string,
    education: Partial<ResumeData['education'][0]>
  ) => void;
  removeEducation: (id: string) => void;
  updateSkills: (skills: Partial<ResumeData['skills']>) => void;
  addProject: (project: ResumeData['projects'][0]) => void;
  updateProject: (
    id: string,
    project: Partial<ResumeData['projects'][0]>
  ) => void;
  removeProject: (id: string) => void;
  updateAchievements: (achievements: string[]) => void;
  updateCertifications: (certifications: Certification[]) => void;
  updateHobbies: (hobbies: string[]) => void;
}

const initialState = {
  resumeData: null,
  analysisResult: null,
  extractedDataBackup: null,
  selectedTemplate: null,
  customizedTemplate: null,
  isLoading: false,
  error: null,
  currentStep: 'ats-checker' as const,
  previousStep: null,
  useUserData: false,
  showDataChoice: false,
  sectionColors: {},
};

// Helper function to create default resume data
// const createDefaultResumeData = (): ResumeData => ({
//   personal: {
//     fullName: '',
//     email: '',
//     phone: '',
//     location: '',
//     linkedin: '',
//     github: '',
//     portfolio: '',
//   },
//   summary: '',
//   experience: [],
//   education: [],
//   skills: {
//     technical: [],
//     business: [],
//     soft: [],
//     languages: [],
//     certifications: [],
//   },
//   projects: [],
//   achievements: [],
// });

export const useResumeStore = create<ResumeState>()(
  persist(
    (set, get) => ({
      ...initialState,

      // Core setters
      setResumeData: data => set({ resumeData: data, error: null }),
      setAnalysisResult: result => set({ analysisResult: result, error: null }),
      setExtractedDataBackup: data => set({ extractedDataBackup: data }),
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

      // Section color actions
      setSectionColors: (sectionId, colors) =>
        set(state => ({
          sectionColors: {
            ...state.sectionColors,
            [sectionId]: colors,
          },
        })),
      getSectionColors: sectionId => {
        const state = get();
        return state.sectionColors[sectionId] || null;
      },
      resetSectionColors: () => set({ sectionColors: {} }),

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
      resetToExtractedData: () => {
        const state = get();
        if (state.extractedDataBackup) {
          set({
            resumeData: state.extractedDataBackup,
            error: null,
          });
        }
      },

      // Utility functions
      hasResumeData: () => !!get().resumeData,
      hasAnalysisResult: () => !!get().analysisResult,
      hasSelectedTemplate: () => !!get().selectedTemplate,
      getCurrentData: () => {
        const { resumeData } = get();
        return resumeData;
      },

      // Enhanced content management actions
      updatePersonalInfo: personal => {
        const state = get();
        if (state.resumeData) {
          set({
            resumeData: {
              ...state.resumeData,
              personal: { ...state.resumeData.personal, ...personal },
            },
          });
        }
        // If no resumeData exists, the ResumeBuilder should initialize it first
      },

      updateSummary: summary => {
        const state = get();
        if (state.resumeData) {
          set({
            resumeData: {
              ...state.resumeData,
              summary,
            },
          });
        }
        // If no resumeData exists, the ResumeBuilder should initialize it first
      },

      addExperience: experience => {
        const state = get();
        if (state.resumeData) {
          set({
            resumeData: {
              ...state.resumeData,
              experience: [...state.resumeData.experience, experience],
            },
          });
        } else {
          // Create new resume data if none exists
          const defaultResumeData: ResumeData = {
            personal: {
              fullName: '',
              email: '',
              phone: '',
              location: '',
              linkedin: '',
              github: '',
              portfolio: '',
            },
            summary: '',
            experience: [],
            education: [],
            skills: {
              technical: [],
              business: [],
              soft: [],
              languages: [],
              certifications: [],
            },
            projects: [],
            achievements: [],
          };
          set({
            resumeData: {
              ...defaultResumeData,
              experience: [experience],
            },
          });
        }
      },

      updateExperience: (id, experience) => {
        const state = get();
        if (state.resumeData) {
          set({
            resumeData: {
              ...state.resumeData,
              experience: state.resumeData.experience.map(exp =>
                exp.id === id ? { ...exp, ...experience } : exp
              ),
            },
          });
        }
        // Note: updateExperience requires existing data, so we don't create new data here
      },

      removeExperience: id => {
        const state = get();
        if (state.resumeData) {
          set({
            resumeData: {
              ...state.resumeData,
              experience: state.resumeData.experience.filter(
                exp => exp.id !== id
              ),
            },
          });
        }
        // Note: removeExperience requires existing data, so we don't create new data here
      },

      addEducation: education => {
        const state = get();
        if (state.resumeData) {
          set({
            resumeData: {
              ...state.resumeData,
              education: [...state.resumeData.education, education],
            },
          });
        } else {
          // Create new resume data if none exists
          const defaultResumeData: ResumeData = {
            personal: {
              fullName: '',
              email: '',
              phone: '',
              location: '',
              linkedin: '',
              github: '',
              portfolio: '',
            },
            summary: '',
            experience: [],
            education: [],
            skills: {
              technical: [],
              business: [],
              soft: [],
              languages: [],
              certifications: [],
            },
            projects: [],
            achievements: [],
          };
          set({
            resumeData: {
              ...defaultResumeData,
              education: [education],
            },
          });
        }
      },

      updateEducation: (id, education) => {
        const state = get();
        if (state.resumeData) {
          set({
            resumeData: {
              ...state.resumeData,
              education: state.resumeData.education.map(edu =>
                edu.id === id ? { ...edu, ...education } : edu
              ),
            },
          });
        }
      },

      removeEducation: id => {
        const state = get();
        if (state.resumeData) {
          set({
            resumeData: {
              ...state.resumeData,
              education: state.resumeData.education.filter(
                edu => edu.id !== id
              ),
            },
          });
        }
      },

      updateSkills: skills => {
        const state = get();
        if (state.resumeData) {
          set({
            resumeData: {
              ...state.resumeData,
              skills: { ...state.resumeData.skills, ...skills },
            },
          });
        } else {
          // Create new resume data if none exists
          const defaultResumeData: ResumeData = {
            personal: {
              fullName: '',
              email: '',
              phone: '',
              location: '',
              linkedin: '',
              github: '',
              portfolio: '',
            },
            summary: '',
            experience: [],
            education: [],
            skills: {
              technical: [],
              business: [],
              soft: [],
              languages: [],
              certifications: [],
            },
            projects: [],
            achievements: [],
          };
          set({
            resumeData: {
              ...defaultResumeData,
              skills: { ...defaultResumeData.skills, ...skills },
            },
          });
        }
      },

      addProject: project => {
        const state = get();
        if (state.resumeData) {
          set({
            resumeData: {
              ...state.resumeData,
              projects: [...state.resumeData.projects, project],
            },
          });
        }
      },

      updateProject: (id, project) => {
        const state = get();
        if (state.resumeData) {
          set({
            resumeData: {
              ...state.resumeData,
              projects: state.resumeData.projects.map(proj =>
                proj.id === id ? { ...proj, ...project } : proj
              ),
            },
          });
        }
      },

      removeProject: id => {
        const state = get();
        if (state.resumeData) {
          set({
            resumeData: {
              ...state.resumeData,
              projects: state.resumeData.projects.filter(
                proj => proj.id !== id
              ),
            },
          });
        }
      },

      updateAchievements: achievements => {
        const state = get();
        if (state.resumeData) {
          set({
            resumeData: {
              ...state.resumeData,
              achievements,
            },
          });
        }
      },

      updateCertifications: certifications => {
        const state = get();
        if (state.resumeData) {
          set({
            resumeData: {
              ...state.resumeData,
              certifications,
            },
          });
        }
      },

      updateHobbies: hobbies => {
        const state = get();
        if (state.resumeData) {
          set({
            resumeData: {
              ...state.resumeData,
              hobbies,
            },
          });
        }
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
        sectionColors: state.sectionColors,
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
  const setExtractedDataBackup = useResumeStore(
    state => state.setExtractedDataBackup
  );
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
  const resetToExtractedData = useResumeStore(
    state => state.resetToExtractedData
  );
  const setSectionColors = useResumeStore(state => state.setSectionColors);
  const getSectionColors = useResumeStore(state => state.getSectionColors);
  const resetSectionColors = useResumeStore(state => state.resetSectionColors);

  // Enhanced content management actions
  const updatePersonalInfo = useResumeStore(state => state.updatePersonalInfo);
  const updateSummary = useResumeStore(state => state.updateSummary);
  const addExperience = useResumeStore(state => state.addExperience);
  const updateExperience = useResumeStore(state => state.updateExperience);
  const removeExperience = useResumeStore(state => state.removeExperience);
  const addEducation = useResumeStore(state => state.addEducation);
  const updateEducation = useResumeStore(state => state.updateEducation);
  const removeEducation = useResumeStore(state => state.removeEducation);
  const updateSkills = useResumeStore(state => state.updateSkills);
  const addProject = useResumeStore(state => state.addProject);
  const updateProject = useResumeStore(state => state.updateProject);
  const removeProject = useResumeStore(state => state.removeProject);
  const updateAchievements = useResumeStore(state => state.updateAchievements);
  const updateCertifications = useResumeStore(
    state => state.updateCertifications
  );
  const updateHobbies = useResumeStore(state => state.updateHobbies);

  return useMemo(
    () => ({
      setResumeData,
      setAnalysisResult,
      setExtractedDataBackup,
      setSelectedTemplate,
      setCustomizedTemplate,
      setUseUserData,
      setShowDataChoice,
      setLoading,
      setError,
      clearAllData,
      clearAnalysisData,
      clearTemplateData,
      resetToExtractedData,
      setSectionColors,
      getSectionColors,
      resetSectionColors,
      // Enhanced content management
      updatePersonalInfo,
      updateSummary,
      addExperience,
      updateExperience,
      removeExperience,
      addEducation,
      updateEducation,
      removeEducation,
      updateSkills,
      addProject,
      updateProject,
      removeProject,
      updateAchievements,
      updateCertifications,
      updateHobbies,
    }),
    [
      setResumeData,
      setAnalysisResult,
      setExtractedDataBackup,
      setSelectedTemplate,
      setCustomizedTemplate,
      setUseUserData,
      setShowDataChoice,
      setLoading,
      setError,
      clearAllData,
      clearAnalysisData,
      clearTemplateData,
      resetToExtractedData,
      setSectionColors,
      getSectionColors,
      resetSectionColors,
      updatePersonalInfo,
      updateSummary,
      addExperience,
      updateExperience,
      removeExperience,
      addEducation,
      updateEducation,
      removeEducation,
      updateSkills,
      addProject,
      updateProject,
      removeProject,
      updateAchievements,
      updateCertifications,
      updateHobbies,
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

// Section color selectors
export const useSectionColors = (sectionId: string) => {
  const sectionColors = useResumeStore(state => state.sectionColors[sectionId]);
  const setSectionColors = useResumeStore(state => state.setSectionColors);

  return useMemo(
    () => ({
      colors: sectionColors,
      setColors: (colors: ResumeState['sectionColors'][string]) =>
        setSectionColors(sectionId, colors),
    }),
    [sectionColors, setSectionColors, sectionId]
  );
};

export const useAllSectionColors = () =>
  useResumeStore(state => state.sectionColors);
