/**
 * Unified Resume Storage Service
 * Consolidates cloudStorage and multiResumeStorage functionality
 * Eliminates duplication and provides a single interface for resume management
 */

import { getSessionStorageKey } from '@/lib/utils/userSession';
import {
  ATSAnalysisResult,
  ResumeGroup,
  ResumeVariant,
} from '@/types/multiResume';
import { ResumeData } from '@/types/resume';

// ============================================================================
// TYPES
// ============================================================================

export interface ResumeVersion {
  id: string;
  data: ResumeData;
  timestamp: Date;
  version: number;
  name: string;
  isAutoSave: boolean;
}

export interface CloudResume {
  id: string;
  name: string;
  templateId: string;
  currentVersion: number;
  versions: ResumeVersion[];
  createdAt: Date;
  updatedAt: Date;
  isPublic: boolean;
  tags: string[];
}

export interface UnifiedResumeGroup extends ResumeGroup {
  // Additional fields for backward compatibility
  cloudResume?: CloudResume;
}

// ============================================================================
// UNIFIED STORAGE SERVICE
// ============================================================================

class UnifiedResumeStorageService {
  private baseStorageKey = 'unified-resume-storage';
  private maxVersions = 10;

  // Get session-specific storage key
  private getStorageKey(): string {
    return getSessionStorageKey(this.baseStorageKey);
  }

  // ============================================================================
  // CORE STORAGE OPERATIONS
  // ============================================================================

  private getStorageData(): {
    groups: ResumeGroup[];
    cloudResumes: CloudResume[];
  } {
    if (typeof window === 'undefined') return { groups: [], cloudResumes: [] };

    try {
      const stored = localStorage.getItem(this.getStorageKey());
      if (!stored) return { groups: [], cloudResumes: [] };

      const data = JSON.parse(stored);
      return {
        groups: data.groups || [],
        cloudResumes: data.cloudResumes || [],
      };
    } catch {
      return { groups: [], cloudResumes: [] };
    }
  }

  private saveStorageData(data: {
    groups: ResumeGroup[];
    cloudResumes: CloudResume[];
  }): void {
    if (typeof window === 'undefined') return;

    try {
      localStorage.setItem(this.getStorageKey(), JSON.stringify(data));
    } catch {
      // Error saving to localStorage
    }
  }

  // ============================================================================
  // RESUME GROUPS MANAGEMENT (Multi-Resume System)
  // ============================================================================

  createResumeGroup(name: string, description?: string): string {
    const { groups, cloudResumes } = this.getStorageData();
    const groupId = `group-${Date.now()}`;

    const newGroup: ResumeGroup = {
      id: groupId,
      name,
      description: description || undefined,
      variants: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    groups.push(newGroup);
    this.saveStorageData({ groups, cloudResumes });
    return groupId;
  }

  getResumeGroups(): ResumeGroup[] {
    const { groups } = this.getStorageData();
    return groups;
  }

  updateResumeGroup(groupId: string, updates: Partial<ResumeGroup>): void {
    const { groups, cloudResumes } = this.getStorageData();
    const groupIndex = groups.findIndex(g => g.id === groupId);

    if (groupIndex === -1) throw new Error('Resume group not found');

    const existingGroup = groups[groupIndex];
    if (!existingGroup) throw new Error('Resume group not found');

    groups[groupIndex] = {
      id: existingGroup.id,
      name: existingGroup.name,
      description: existingGroup.description,
      variants: existingGroup.variants,
      createdAt: existingGroup.createdAt,
      ...updates,
      updatedAt: new Date(),
    };

    this.saveStorageData({ groups, cloudResumes });
  }

  deleteResumeGroup(groupId: string): void {
    const { groups, cloudResumes } = this.getStorageData();
    const filteredGroups = groups.filter(g => g.id !== groupId);
    this.saveStorageData({ groups: filteredGroups, cloudResumes });
  }

  // ============================================================================
  // RESUME VARIANTS MANAGEMENT
  // ============================================================================

  addResumeVariant(
    groupId: string,
    name: string,
    data: ResumeData,
    templateId: string = 'unknown',
    description?: string
  ): string {
    const { groups, cloudResumes } = this.getStorageData();
    const group = groups.find(g => g.id === groupId);

    if (!group) throw new Error('Resume group not found');

    // Generate unique name if duplicate exists
    const uniqueName = this.generateUniqueName(
      name,
      group.variants.map(v => v.name)
    );

    const variantId = `variant-${Date.now()}`;
    const newVariant: ResumeVariant = {
      id: variantId,
      name: uniqueName,
      description: description || undefined,
      data,
      templateId,
      createdAt: new Date(),
      updatedAt: new Date(),
      tags: [],
      analyses: [],
    };

    group.variants.push(newVariant);
    group.updatedAt = new Date();

    this.saveStorageData({ groups, cloudResumes });
    return variantId;
  }

  updateResumeVariant(
    groupId: string,
    variantId: string,
    updates: Partial<ResumeVariant>
  ): void {
    const { groups, cloudResumes } = this.getStorageData();
    const group = groups.find(g => g.id === groupId);
    const variant = group?.variants.find(v => v.id === variantId);

    if (!group || !variant) throw new Error('Resume variant not found');

    Object.assign(variant, updates, { updatedAt: new Date() });
    group.updatedAt = new Date();

    this.saveStorageData({ groups, cloudResumes });
  }

  deleteResumeVariant(groupId: string, variantId: string): void {
    const { groups, cloudResumes } = this.getStorageData();
    const group = groups.find(g => g.id === groupId);

    if (!group) throw new Error('Resume group not found');

    group.variants = group.variants.filter(v => v.id !== variantId);
    group.updatedAt = new Date();

    this.saveStorageData({ groups, cloudResumes });
  }

  duplicateResumeVariant(
    groupId: string,
    variantId: string,
    newName?: string
  ): string {
    const { groups } = this.getStorageData();
    const group = groups.find(g => g.id === groupId);
    const variant = group?.variants.find(v => v.id === variantId);

    if (!group || !variant) throw new Error('Resume variant not found');

    const duplicateName = newName || `${variant.name} (Copy)`;
    return this.addResumeVariant(
      groupId,
      duplicateName,
      variant.data,
      variant.templateId,
      variant.description
    );
  }

  getResumeVariant(groupId: string, variantId: string): ResumeVariant | null {
    const { groups } = this.getStorageData();
    const group = groups.find(g => g.id === groupId);
    return group?.variants.find(v => v.id === variantId) || null;
  }

  // ============================================================================
  // CLOUD RESUME MANAGEMENT (Legacy Support)
  // ============================================================================

  saveResume(
    name: string,
    data: ResumeData,
    templateId: string,
    isAutoSave = false
  ): string {
    const { groups, cloudResumes } = this.getStorageData();
    const resumeId = `resume-${Date.now()}`;

    const newResume: CloudResume = {
      id: resumeId,
      name,
      templateId,
      currentVersion: 1,
      versions: [
        {
          id: `version-${Date.now()}`,
          data,
          timestamp: new Date(),
          version: 1,
          name: isAutoSave ? 'Auto-save' : 'Initial version',
          isAutoSave,
        },
      ],
      createdAt: new Date(),
      updatedAt: new Date(),
      isPublic: false,
      tags: [],
    };

    cloudResumes.push(newResume);
    this.saveStorageData({ groups, cloudResumes });

    return resumeId;
  }

  getResumes(): CloudResume[] {
    const { cloudResumes } = this.getStorageData();
    return cloudResumes;
  }

  updateResume(
    resumeId: string,
    data: ResumeData,
    versionName?: string,
    isAutoSave = false
  ): void {
    const { groups, cloudResumes } = this.getStorageData();
    const resumeIndex = cloudResumes.findIndex(r => r.id === resumeId);

    if (resumeIndex === -1) {
      throw new Error('Resume not found');
    }

    const resume = cloudResumes[resumeIndex];
    if (!resume) {
      throw new Error('Resume not found');
    }

    const newVersion: ResumeVersion = {
      id: `version-${Date.now()}`,
      data,
      timestamp: new Date(),
      version: resume.currentVersion + 1,
      name:
        versionName ||
        (isAutoSave ? 'Auto-save' : `Version ${resume.currentVersion + 1}`),
      isAutoSave,
    };

    // Add new version
    resume.versions.push(newVersion);
    resume.currentVersion = newVersion.version;
    resume.updatedAt = new Date();

    // Keep only the latest versions
    if (resume.versions.length > this.maxVersions) {
      resume.versions = resume.versions
        .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
        .slice(0, this.maxVersions);
    }

    this.saveStorageData({ groups, cloudResumes });
  }

  getResume(resumeId: string): CloudResume | null {
    const { cloudResumes } = this.getStorageData();
    return cloudResumes.find(r => r.id === resumeId) || null;
  }

  getLatestResumeData(resumeId: string): ResumeData | null {
    const resume = this.getResume(resumeId);
    if (!resume || resume.versions.length === 0) return null;

    const latestVersion = resume.versions.sort(
      (a, b) => b.timestamp.getTime() - a.timestamp.getTime()
    )[0];

    return latestVersion?.data || null;
  }

  deleteResume(resumeId: string): void {
    const { groups, cloudResumes } = this.getStorageData();
    const filteredResumes = cloudResumes.filter(r => r.id !== resumeId);
    this.saveStorageData({ groups, cloudResumes: filteredResumes });
  }

  renameResume(resumeId: string, newName: string): void {
    const { groups, cloudResumes } = this.getStorageData();
    const resumeIndex = cloudResumes.findIndex(r => r.id === resumeId);
    const resume = cloudResumes[resumeIndex];

    if (resumeIndex !== -1 && resume) {
      resume.name = newName;
      resume.updatedAt = new Date();
      this.saveStorageData({ groups, cloudResumes });
    }
  }

  // ============================================================================
  // ATS ANALYSIS MANAGEMENT
  // ============================================================================

  addATSAnalysis(
    groupId: string,
    variantId: string,
    analysis: ATSAnalysisResult
  ): void {
    const { groups, cloudResumes } = this.getStorageData();
    const group = groups.find(g => g.id === groupId);
    const variant = group?.variants.find(v => v.id === variantId);

    if (!group || !variant) throw new Error('Resume variant not found');

    variant.analyses.push(analysis);
    variant.lastAnalysisAt = new Date();

    // Update best score
    const bestAnalysis = variant.analyses.reduce((best, current) =>
      current.atsScore > best.atsScore ? current : best
    );
    variant.bestScore = bestAnalysis.atsScore;
    variant.bestJobCategory = bestAnalysis.jobCategory;

    group.updatedAt = new Date();
    this.saveStorageData({ groups, cloudResumes });
  }

  // ============================================================================
  // UTILITY FUNCTIONS
  // ============================================================================

  private generateUniqueName(
    baseName: string,
    existingNames: string[]
  ): string {
    if (!existingNames.includes(baseName)) {
      return baseName;
    }

    let counter = 1;
    let uniqueName = `${baseName} ${counter}`;

    while (existingNames.includes(uniqueName)) {
      counter++;
      uniqueName = `${baseName} ${counter}`;
    }

    return uniqueName;
  }

  generateFileHash(data: ResumeData): string {
    // Simple hash based on resume data
    const dataString = JSON.stringify(data);
    let hash = 0;
    for (let i = 0; i < dataString.length; i++) {
      const char = dataString.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return hash.toString();
  }

  extractJobTitle(jobDescription: string): string | undefined {
    // Simple extraction - look for common patterns
    const lines = jobDescription.split('\n');
    const firstLine = lines[0]?.trim();

    if (firstLine && firstLine.length < 100) {
      return firstLine;
    }

    return undefined;
  }

  // ============================================================================
  // SEARCH AND FILTERING
  // ============================================================================

  searchResumes(query: string): CloudResume[] {
    const { cloudResumes } = this.getStorageData();
    const lowercaseQuery = query.toLowerCase();

    return cloudResumes.filter(
      resume =>
        resume.name.toLowerCase().includes(lowercaseQuery) ||
        resume.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery)) ||
        resume.templateId.toLowerCase().includes(lowercaseQuery)
    );
  }

  getRecentResumes(limit = 5): CloudResume[] {
    const { cloudResumes } = this.getStorageData();
    return cloudResumes
      .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
      .slice(0, limit);
  }

  getBestResumeForJob(jobCategory: string): ResumeVariant | null {
    const { groups } = this.getStorageData();
    let bestVariant: ResumeVariant | null = null;
    let bestScore = 0;

    for (const group of groups) {
      for (const variant of group.variants) {
        const analysis = variant.analyses.find(
          a => a.jobCategory === jobCategory
        );
        if (analysis && analysis.atsScore > bestScore) {
          bestScore = analysis.atsScore;
          bestVariant = variant;
        }
      }
    }

    return bestVariant;
  }

  getResumeComparison(groupId: string, jobCategory?: string): ResumeVariant[] {
    const { groups } = this.getStorageData();
    const group = groups.find(g => g.id === groupId);

    if (!group) return [];

    let variants = group.variants;

    if (jobCategory) {
      variants = variants.filter(v =>
        v.analyses.some(a => a.jobCategory === jobCategory)
      );
    }

    return variants.sort((a, b) => (b.bestScore || 0) - (a.bestScore || 0));
  }

  getAllResumeVariants(): ResumeVariant[] {
    const { groups } = this.getStorageData();
    return groups.flatMap(group => group.variants);
  }

  // ============================================================================
  // EXPORT/IMPORT
  // ============================================================================

  exportResume(resumeId: string): string {
    const resume = this.getResume(resumeId);
    if (!resume) throw new Error('Resume not found');

    return JSON.stringify(resume, null, 2);
  }

  importResume(data: string): string {
    try {
      const resume: CloudResume = JSON.parse(data);

      // Validate the data structure
      if (
        !resume.id ||
        !resume.name ||
        !resume.versions ||
        !Array.isArray(resume.versions)
      ) {
        throw new Error('Invalid resume data format');
      }

      // Generate new ID to avoid conflicts
      const newId = `resume-${Date.now()}`;
      resume.id = newId;
      resume.createdAt = new Date();
      resume.updatedAt = new Date();

      const { groups, cloudResumes } = this.getStorageData();
      cloudResumes.push(resume);
      this.saveStorageData({ groups, cloudResumes });

      return newId;
    } catch (error) {
      throw new Error(`Failed to import resume: ${(error as Error).message}`);
    }
  }

  // ============================================================================
  // AUTO-SAVE FUNCTIONALITY
  // ============================================================================

  autoSave(resumeId: string, data: ResumeData): void {
    try {
      this.updateResume(resumeId, data, undefined, true);
    } catch (error) {
      // If resume doesn't exist, create a new one
      if (error instanceof Error && error.message === 'Resume not found') {
        this.saveResume('Auto-saved Resume', data, 'unknown', true);
      }
    }
  }
}

// Export singleton instance
export const unifiedResumeStorage = new UnifiedResumeStorageService();

// Export for backward compatibility
export const multiResumeStorage = unifiedResumeStorage;
export const cloudStorage = unifiedResumeStorage;
