import { getSessionStorageKey } from '@/lib/utils/userSession';
import { ResumeData } from '@/types/resume';

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

class CloudStorageService {
  private baseStorageKey = 'resume-cloud-storage';
  private maxVersions = 10;

  // Get session-specific storage key
  private getStorageKey(): string {
    return getSessionStorageKey(this.baseStorageKey);
  }

  // Get all saved resumes
  getResumes(): CloudResume[] {
    if (typeof window === 'undefined') return [];

    try {
      const stored = localStorage.getItem(this.getStorageKey());
      return stored ? JSON.parse(stored) : [];
    } catch {
      // Error loading resumes from cloud storage
      return [];
    }
  }

  // Save a new resume
  saveResume(
    name: string,
    data: ResumeData,
    templateId: string,
    isAutoSave = false
  ): string {
    const resumes = this.getResumes();
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

    resumes.push(newResume);
    this.saveResumes(resumes);

    return resumeId;
  }

  // Update an existing resume
  updateResume(
    resumeId: string,
    data: ResumeData,
    versionName?: string,
    isAutoSave = false
  ): void {
    const resumes = this.getResumes();
    const resumeIndex = resumes.findIndex(r => r.id === resumeId);

    if (resumeIndex === -1) {
      throw new Error('Resume not found');
    }

    const resume = resumes[resumeIndex];
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

    this.saveResumes(resumes);
  }

  // Get a specific resume
  getResume(resumeId: string): CloudResume | null {
    const resumes = this.getResumes();
    return resumes.find(r => r.id === resumeId) || null;
  }

  // Get the latest version of a resume
  getLatestResumeData(resumeId: string): ResumeData | null {
    const resume = this.getResume(resumeId);
    if (!resume || resume.versions.length === 0) return null;

    const latestVersion = resume.versions.sort(
      (a, b) => b.timestamp.getTime() - a.timestamp.getTime()
    )[0];

    return latestVersion?.data || null;
  }

  // Get a specific version of a resume
  getResumeVersion(resumeId: string, version: number): ResumeVersion | null {
    const resume = this.getResume(resumeId);
    if (!resume) return null;

    return resume.versions.find(v => v.version === version) || null;
  }

  // Delete a resume
  deleteResume(resumeId: string): void {
    const resumes = this.getResumes();
    const filteredResumes = resumes.filter(r => r.id !== resumeId);
    this.saveResumes(filteredResumes);
  }

  // Rename a resume
  renameResume(resumeId: string, newName: string): void {
    const resumes = this.getResumes();
    const resumeIndex = resumes.findIndex(r => r.id === resumeId);
    const resume = resumes[resumeIndex];

    if (resumeIndex !== -1 && resume) {
      resume.name = newName;
      resume.updatedAt = new Date();
      this.saveResumes(resumes);
    }
  }

  // Add tags to a resume
  addTags(resumeId: string, tags: string[]): void {
    const resumes = this.getResumes();
    const resumeIndex = resumes.findIndex(r => r.id === resumeId);
    const resume = resumes[resumeIndex];

    if (resumeIndex !== -1 && resume) {
      const existingTags = resume.tags;
      const newTags = [...new Set([...existingTags, ...tags])];
      resume.tags = newTags;
      resume.updatedAt = new Date();
      this.saveResumes(resumes);
    }
  }

  // Remove tags from a resume
  removeTags(resumeId: string, tags: string[]): void {
    const resumes = this.getResumes();
    const resumeIndex = resumes.findIndex(r => r.id === resumeId);
    const resume = resumes[resumeIndex];

    if (resumeIndex !== -1 && resume) {
      resume.tags = resume.tags.filter(tag => !tags.includes(tag));
      resume.updatedAt = new Date();
      this.saveResumes(resumes);
    }
  }

  // Search resumes
  searchResumes(query: string): CloudResume[] {
    const resumes = this.getResumes();
    const lowercaseQuery = query.toLowerCase();

    return resumes.filter(
      resume =>
        resume.name.toLowerCase().includes(lowercaseQuery) ||
        resume.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery)) ||
        resume.templateId.toLowerCase().includes(lowercaseQuery)
    );
  }

  // Get recent resumes
  getRecentResumes(limit = 5): CloudResume[] {
    const resumes = this.getResumes();
    return resumes
      .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
      .slice(0, limit);
  }

  // Export resume data
  exportResume(resumeId: string): string {
    const resume = this.getResume(resumeId);
    if (!resume) throw new Error('Resume not found');

    return JSON.stringify(resume, null, 2);
  }

  // Import resume data
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

      const resumes = this.getResumes();
      resumes.push(resume);
      this.saveResumes(resumes);

      return newId;
    } catch (error) {
      throw new Error(`Failed to import resume: ${(error as Error).message}`);
    }
  }

  // Auto-save functionality
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

  // Private method to save resumes to localStorage
  private saveResumes(resumes: CloudResume[]): void {
    if (typeof window === 'undefined') return;

    try {
      localStorage.setItem(this.getStorageKey(), JSON.stringify(resumes));
    } catch {
      // Error saving resumes to cloud storage
    }
  }
}

// Export singleton instance
export const cloudStorage = new CloudStorageService();
