import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { multiResumeStorage } from '@/lib/resume/multiResumeStorage';
import { getSessionStorageKey } from '@/lib/utils/userSession';
import { ResumeGroup, ResumeVariant } from '@/types/multiResume';
import { ResumeData } from '@/types/resume';

interface MultiResumeState {
  // Data
  groups: ResumeGroup[];
  currentResume: ResumeVariant | null;
  currentGroup: ResumeGroup | null;

  // UI State
  isDropdownOpen: boolean;
  isLoading: boolean;
  error: string | null;

  // Actions
  loadGroups: () => void;
  addGroup: (name: string, description?: string) => string;
  updateGroup: (groupId: string, updates: Partial<ResumeGroup>) => void;
  deleteGroup: (groupId: string) => void;

  addResume: (
    groupId: string,
    name: string,
    data: ResumeData,
    templateId?: string,
    description?: string
  ) => string;
  updateResume: (
    groupId: string,
    variantId: string,
    updates: Partial<ResumeVariant>
  ) => void;
  deleteResume: (groupId: string, variantId: string) => void;
  duplicateResume: (
    groupId: string,
    variantId: string,
    newName?: string
  ) => string;

  selectResume: (groupId: string, variantId: string) => void;
  clearCurrentResume: () => void;

  setDropdownOpen: (open: boolean) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;

  // Refresh data from storage
  refresh: () => void;
}

export const useMultiResumeStore = create<MultiResumeState>()(
  persist(
    (set, get) => ({
      // Initial state
      groups: [],
      currentResume: null,
      currentGroup: null,
      isDropdownOpen: false,
      isLoading: false,
      error: null,

      // Load groups from storage
      loadGroups: () => {
        try {
          const groups = multiResumeStorage.getResumeGroups();
          set({ groups, error: null });
        } catch (_error) {
          set({ error: 'Failed to load resume groups' });
        }
      },

      // Add new group
      addGroup: (name: string, description?: string) => {
        try {
          const groupId = multiResumeStorage.createResumeGroup(
            name,
            description
          );
          get().loadGroups(); // Refresh groups
          return groupId;
        } catch (_error) {
          set({ error: 'Failed to create group' });
          throw _error;
        }
      },

      // Update group
      updateGroup: (groupId: string, updates: Partial<ResumeGroup>) => {
        try {
          multiResumeStorage.updateResumeGroup(groupId, updates);
          get().loadGroups(); // Refresh groups
        } catch (_error) {
          set({ error: 'Failed to update group' });
        }
      },

      // Delete group
      deleteGroup: (groupId: string) => {
        try {
          multiResumeStorage.deleteResumeGroup(groupId);
          get().loadGroups(); // Refresh groups

          // Clear current resume if it was in this group
          const { currentResume } = get();
          if (currentResume && currentResume.id === groupId) {
            set({ currentResume: null, currentGroup: null });
          }
        } catch (_error) {
          set({ error: 'Failed to delete group' });
        }
      },

      // Add resume to group
      addResume: (
        groupId: string,
        name: string,
        data: ResumeData,
        templateId = 'unknown',
        description?: string
      ) => {
        try {
          const variantId = multiResumeStorage.addResumeVariant(
            groupId,
            name,
            data,
            templateId,
            description
          );
          get().loadGroups(); // Refresh groups
          return variantId;
        } catch (_error) {
          set({ error: 'Failed to add resume' });
          throw _error;
        }
      },

      // Update resume
      updateResume: (
        groupId: string,
        variantId: string,
        updates: Partial<ResumeVariant>
      ) => {
        try {
          multiResumeStorage.updateResumeVariant(groupId, variantId, updates);
          get().loadGroups(); // Refresh groups

          // Update current resume if it's the one being updated
          const { currentResume } = get();
          if (currentResume && currentResume.id === variantId) {
            const updatedResume = multiResumeStorage.getResumeVariant(
              groupId,
              variantId
            );
            if (updatedResume) {
              set({ currentResume: updatedResume });
            }
          }
        } catch (_error) {
          set({ error: 'Failed to update resume' });
        }
      },

      // Delete resume
      deleteResume: (groupId: string, variantId: string) => {
        try {
          multiResumeStorage.deleteResumeVariant(groupId, variantId);
          get().loadGroups(); // Refresh groups

          // Clear current resume if it was deleted
          const { currentResume } = get();
          if (currentResume && currentResume.id === variantId) {
            set({ currentResume: null, currentGroup: null });
          }
        } catch (_error) {
          set({ error: 'Failed to delete resume' });
        }
      },

      // Duplicate resume
      duplicateResume: (
        groupId: string,
        variantId: string,
        newName?: string
      ) => {
        try {
          const newVariantId = multiResumeStorage.duplicateResumeVariant(
            groupId,
            variantId,
            newName
          );
          get().loadGroups(); // Refresh groups
          return newVariantId;
        } catch (_error) {
          set({ error: 'Failed to duplicate resume' });
          throw _error;
        }
      },

      // Select resume
      selectResume: (groupId: string, variantId: string) => {
        try {
          const resume = multiResumeStorage.getResumeVariant(
            groupId,
            variantId
          );
          const group = multiResumeStorage
            .getResumeGroups()
            .find(g => g.id === groupId);

          if (resume && group) {
            set({
              currentResume: resume,
              currentGroup: group,
              isDropdownOpen: false,
            });
          }
        } catch (_error) {
          set({ error: 'Failed to select resume' });
        }
      },

      // Clear current resume
      clearCurrentResume: () => {
        set({ currentResume: null, currentGroup: null });
      },

      // UI actions
      setDropdownOpen: (open: boolean) => {
        set({ isDropdownOpen: open });
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },

      setError: (error: string | null) => {
        set({ error });
      },

      // Refresh all data
      refresh: () => {
        get().loadGroups();
      },
    }),
    {
      name: 'multi-resume-store',
      storage: createJSONStorage(() => {
        const sessionStorageAdapter = {
          getItem: (name: string): string | null => {
            if (typeof window === 'undefined') return null;
            const sessionKey = getSessionStorageKey(name);
            return localStorage.getItem(sessionKey);
          },
          setItem: (name: string, value: string): void => {
            if (typeof window === 'undefined') return;
            const sessionKey = getSessionStorageKey(name);
            localStorage.setItem(sessionKey, value);
          },
          removeItem: (name: string): void => {
            if (typeof window === 'undefined') return;
            const sessionKey = getSessionStorageKey(name);
            localStorage.removeItem(sessionKey);
          },
        };
        return sessionStorageAdapter;
      }),
      // Only persist the current resume and group, not the full groups array
      partialize: state => ({
        currentResume: state.currentResume,
        currentGroup: state.currentGroup,
      }),
    }
  )
);
