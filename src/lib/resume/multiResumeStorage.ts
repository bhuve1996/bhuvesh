import { getSessionStorageKey } from '@/lib/utils/userSession';
import {
  ATSAnalysisResult,
  ResumeGroup,
  ResumeVariant,
} from '@/types/multiResume';
import { ResumeData } from '@/types/resume';

class MultiResumeStorageService {
  private baseKey = 'multi-resume-storage';

  private getStorageKey(): string {
    return getSessionStorageKey(this.baseKey);
  }

  // Resume Groups Management
  createResumeGroup(name: string, description?: string): string {
    const groups = this.getResumeGroups();
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
    this.saveResumeGroups(groups);
    return groupId;
  }

  getResumeGroups(): ResumeGroup[] {
    if (typeof window === 'undefined') return [];

    try {
      const stored = localStorage.getItem(this.getStorageKey());
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  updateResumeGroup(groupId: string, updates: Partial<ResumeGroup>): void {
    const groups = this.getResumeGroups();
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

    this.saveResumeGroups(groups);
  }

  deleteResumeGroup(groupId: string): void {
    const groups = this.getResumeGroups();
    const filteredGroups = groups.filter(g => g.id !== groupId);
    this.saveResumeGroups(filteredGroups);
  }

  // Resume Variant Management
  addResumeVariant(
    groupId: string,
    name: string,
    data: ResumeData,
    templateId: string = 'unknown',
    description?: string
  ): string {
    const groups = this.getResumeGroups();
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

    this.saveResumeGroups(groups);
    return variantId;
  }

  updateResumeVariant(
    groupId: string,
    variantId: string,
    updates: Partial<ResumeVariant>
  ): void {
    const groups = this.getResumeGroups();
    const group = groups.find(g => g.id === groupId);
    const variant = group?.variants.find(v => v.id === variantId);

    if (!group || !variant) throw new Error('Resume variant not found');

    Object.assign(variant, updates, { updatedAt: new Date() });
    group.updatedAt = new Date();

    this.saveResumeGroups(groups);
  }

  deleteResumeVariant(groupId: string, variantId: string): void {
    const groups = this.getResumeGroups();
    const group = groups.find(g => g.id === groupId);

    if (!group) throw new Error('Resume group not found');

    group.variants = group.variants.filter(v => v.id !== variantId);
    group.updatedAt = new Date();

    this.saveResumeGroups(groups);
  }

  duplicateResumeVariant(
    groupId: string,
    variantId: string,
    newName?: string
  ): string {
    const groups = this.getResumeGroups();
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

  // ATS Analysis Management
  addATSAnalysis(
    groupId: string,
    variantId: string,
    analysis: ATSAnalysisResult
  ): void {
    const groups = this.getResumeGroups();
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
    this.saveResumeGroups(groups);
  }

  // Comparison & Analytics
  getBestResumeForJob(jobCategory: string): ResumeVariant | null {
    const groups = this.getResumeGroups();
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
    const groups = this.getResumeGroups();
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
    const groups = this.getResumeGroups();
    return groups.flatMap(group => group.variants);
  }

  getResumeVariant(groupId: string, variantId: string): ResumeVariant | null {
    const groups = this.getResumeGroups();
    const group = groups.find(g => g.id === groupId);
    return group?.variants.find(v => v.id === variantId) || null;
  }

  // Utility functions
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

  // Generate unique name with incremental numbering
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

  private saveResumeGroups(groups: ResumeGroup[]): void {
    if (typeof window === 'undefined') return;

    try {
      localStorage.setItem(this.getStorageKey(), JSON.stringify(groups));
    } catch {
      // Error saving to localStorage
    }
  }
}

export const multiResumeStorage = new MultiResumeStorageService();
