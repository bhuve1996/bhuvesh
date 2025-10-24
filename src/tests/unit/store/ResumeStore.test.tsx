import { renderHook, act } from '@testing-library/react';

import { useResumeStore, useResumeActions, useResumeData } from '@/store/resumeStore';
import { ResumeData, ResumeTemplate } from '@/types';

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

describe('ResumeStore', () => {
  beforeEach(() => {
    localStorageMock.getItem.mockClear();
    localStorageMock.setItem.mockClear();
    localStorageMock.removeItem.mockClear();
    localStorageMock.clear.mockClear();
  });

  const mockResumeData: ResumeData = {
    personal: {
      fullName: 'John Doe',
      email: 'john@example.com',
      phone: '+1234567890',
      location: 'New York, NY',
      linkedin: 'linkedin.com/in/johndoe',
      github: 'github.com/johndoe',
    },
    summary: 'Experienced software engineer with 5+ years of experience.',
    experience: [
      {
        id: 'exp1',
        company: 'Tech Corp',
        position: 'Senior Developer',
        location: 'San Francisco, CA',
        startDate: '2020-01-01',
        endDate: '2023-12-31',
        current: false,
        description: 'Led development of web applications.',
        achievements: ['Improved performance by 50%', 'Led team of 5 developers'],
      },
    ],
    education: [
      {
        id: 'edu1',
        institution: 'University of Technology',
        degree: 'Bachelor of Science',
        field: 'Computer Science',
        location: 'Boston, MA',
        startDate: '2016-09-01',
        endDate: '2020-05-31',
        current: false,
        gpa: '3.8',
      },
    ],
    skills: {
      technical: ['JavaScript', 'TypeScript', 'React'],
      business: ['Project Management', 'Team Leadership'],
      soft: ['Communication', 'Problem Solving'],
      languages: ['English', 'Spanish'],
      certifications: ['AWS Certified Developer'],
    },
    projects: [
      {
        id: 'proj1',
        name: 'E-commerce Platform',
        description: 'Built a full-stack e-commerce solution.',
        technologies: ['React', 'Node.js', 'MongoDB'],
        startDate: '2022-01-01',
        endDate: '2022-06-30',
      },
    ],
    achievements: ['Employee of the Year 2022'],
    certifications: [],
    hobbies: ['Photography', 'Hiking'],
  };

  const mockTemplate: ResumeTemplate = {
    id: 'modern',
    name: 'Modern Template',
    description: 'A modern, clean template',
    category: 'tech',
    experienceLevel: 'mid',
    style: 'modern',
    atsScore: 85,
    preview: 'data:image/png;base64,preview',
    layout: {
      sections: [],
      colors: {
        primary: '#3b82f6',
        secondary: '#64748b',
        accent: '#f59e0b',
        text: '#1f2937',
        background: '#ffffff',
      },
      fonts: {
        heading: 'Inter',
        body: 'Inter',
        size: {
          heading: '2rem',
          subheading: '1.5rem',
          body: '1rem',
          small: '0.875rem',
        },
      },
      spacing: {
        lineHeight: 1.5,
        sectionGap: '2rem',
        margins: '1rem',
        padding: '1rem',
      },
      columns: 1,
    },
  };

  describe('Basic Store Operations', () => {
    it('should initialize with default state', () => {
      const { result } = renderHook(() => useResumeStore());
      
      expect(result.current.resumeData).toBeNull();
      expect(result.current.analysisResult).toBeNull();
      expect(result.current.selectedTemplate).toBeNull();
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBeNull();
      expect(result.current.currentStep).toBe('ats-checker');
    });

    it('should set resume data', () => {
      const { result } = renderHook(() => useResumeStore());
      
      act(() => {
        result.current.setResumeData(mockResumeData);
      });

      expect(result.current.resumeData).toEqual(mockResumeData);
      expect(result.current.error).toBeNull();
    });

    it('should set selected template', () => {
      const { result } = renderHook(() => useResumeStore());
      
      act(() => {
        result.current.setSelectedTemplate(mockTemplate);
      });

      expect(result.current.selectedTemplate).toEqual(mockTemplate);
      expect(result.current.customizedTemplate).toEqual(mockTemplate);
    });

    it('should handle loading state', () => {
      const { result } = renderHook(() => useResumeStore());
      
      act(() => {
        result.current.setLoading(true);
      });

      expect(result.current.isLoading).toBe(true);

      act(() => {
        result.current.setLoading(false);
      });

      expect(result.current.isLoading).toBe(false);
    });

    it('should handle error state', () => {
      const { result } = renderHook(() => useResumeStore());
      
      act(() => {
        result.current.setError('Test error');
      });

      expect(result.current.error).toBe('Test error');

      act(() => {
        result.current.setError(null);
      });

      expect(result.current.error).toBeNull();
    });
  });

  describe('Navigation', () => {
    it('should navigate between steps', () => {
      const { result } = renderHook(() => useResumeStore());
      
      act(() => {
        result.current.navigateToStep('resume-builder');
      });

      expect(result.current.currentStep).toBe('resume-builder');
      expect(result.current.previousStep).toBe('ats-checker');
    });

    it('should go back to previous step', () => {
      const { result } = renderHook(() => useResumeStore());
      
      act(() => {
        result.current.navigateToStep('resume-builder');
        result.current.navigateToStep('templates');
      });

      expect(result.current.currentStep).toBe('templates');
      expect(result.current.previousStep).toBe('resume-builder');

      act(() => {
        result.current.goBack();
      });

      expect(result.current.currentStep).toBe('resume-builder');
      expect(result.current.previousStep).toBeNull();
    });

    it('should clear data when navigating without preserving', () => {
      const { result } = renderHook(() => useResumeStore());
      
      act(() => {
        result.current.setResumeData(mockResumeData);
        result.current.navigateToStep('ats-checker', false);
      });

      expect(result.current.analysisResult).toBeNull();
    });
  });

  describe('Section Colors', () => {
    it('should set and get section colors', () => {
      const { result } = renderHook(() => useResumeStore());
      const colors = {
        primary: '#3b82f6',
        secondary: '#64748b',
        accent: '#f59e0b',
        text: '#1f2937',
        background: '#ffffff',
      };

      act(() => {
        result.current.setSectionColors('header', colors);
      });

      expect(result.current.getSectionColors('header')).toEqual(colors);
      expect(result.current.sectionColors.header).toEqual(colors);
    });

    it('should reset section colors', () => {
      const { result } = renderHook(() => useResumeStore());
      const colors = {
        primary: '#3b82f6',
        secondary: '#64748b',
        accent: '#f59e0b',
        text: '#1f2937',
        background: '#ffffff',
      };

      act(() => {
        result.current.setSectionColors('header', colors);
        result.current.resetSectionColors();
      });

      expect(result.current.sectionColors).toEqual({});
    });
  });

  describe('Enhanced Content Management', () => {
    beforeEach(() => {
      const { result } = renderHook(() => useResumeStore());
      act(() => {
        result.current.setResumeData(mockResumeData);
      });
    });

    it('should update personal info', () => {
      const { result } = renderHook(() => useResumeStore());
      
      act(() => {
        result.current.updatePersonalInfo({
          fullName: 'Jane Doe',
          email: 'jane@example.com',
        });
      });

      expect(result.current.resumeData?.personal.fullName).toBe('Jane Doe');
      expect(result.current.resumeData?.personal.email).toBe('jane@example.com');
      expect(result.current.resumeData?.personal.phone).toBe('+1234567890'); // Should remain unchanged
    });

    it('should update summary', () => {
      const { result } = renderHook(() => useResumeStore());
      
      act(() => {
        result.current.updateSummary('New summary text');
      });

      expect(result.current.resumeData?.summary).toBe('New summary text');
    });

    it('should add experience', () => {
      const { result } = renderHook(() => useResumeStore());
      const newExperience = {
        id: 'exp2',
        company: 'New Corp',
        position: 'Lead Developer',
        location: 'Seattle, WA',
        startDate: '2024-01-01',
        current: true,
        description: 'Leading a team of developers.',
        achievements: ['Launched 3 major products'],
      };

      act(() => {
        result.current.addExperience(newExperience);
      });

      expect(result.current.resumeData?.experience).toHaveLength(2);
      expect(result.current.resumeData?.experience[1]).toEqual(newExperience);
    });

    it('should update experience', () => {
      const { result } = renderHook(() => useResumeStore());
      
      act(() => {
        result.current.updateExperience('exp1', {
          position: 'Principal Developer',
          description: 'Updated description',
        });
      });

      const updatedExp = result.current.resumeData?.experience.find(exp => exp.id === 'exp1');
      expect(updatedExp?.position).toBe('Principal Developer');
      expect(updatedExp?.description).toBe('Updated description');
      expect(updatedExp?.company).toBe('Tech Corp'); // Should remain unchanged
    });

    it('should remove experience', () => {
      const { result } = renderHook(() => useResumeStore());
      
      act(() => {
        result.current.removeExperience('exp1');
      });

      expect(result.current.resumeData?.experience).toHaveLength(0);
    });

    it('should add education', () => {
      const { result } = renderHook(() => useResumeStore());
      const newEducation = {
        id: 'edu2',
        institution: 'Graduate School',
        degree: 'Master of Science',
        field: 'Software Engineering',
        location: 'Chicago, IL',
        startDate: '2020-09-01',
        endDate: '2022-05-31',
        current: false,
        gpa: '3.9',
      };

      act(() => {
        result.current.addEducation(newEducation);
      });

      expect(result.current.resumeData?.education).toHaveLength(2);
      expect(result.current.resumeData?.education[1]).toEqual(newEducation);
    });

    it('should update education', () => {
      const { result } = renderHook(() => useResumeStore());
      
      act(() => {
        result.current.updateEducation('edu1', {
          degree: 'Bachelor of Engineering',
          gpa: '3.9',
        });
      });

      const updatedEdu = result.current.resumeData?.education.find(edu => edu.id === 'edu1');
      expect(updatedEdu?.degree).toBe('Bachelor of Engineering');
      expect(updatedEdu?.gpa).toBe('3.9');
      expect(updatedEdu?.institution).toBe('University of Technology'); // Should remain unchanged
    });

    it('should remove education', () => {
      const { result } = renderHook(() => useResumeStore());
      
      act(() => {
        result.current.removeEducation('edu1');
      });

      expect(result.current.resumeData?.education).toHaveLength(0);
    });

    it('should update skills', () => {
      const { result } = renderHook(() => useResumeStore());
      
      act(() => {
        result.current.updateSkills({
          technical: ['Python', 'Django', 'PostgreSQL'],
          soft: ['Leadership', 'Communication'],
        });
      });

      expect(result.current.resumeData?.skills.technical).toEqual(['Python', 'Django', 'PostgreSQL']);
      expect(result.current.resumeData?.skills.soft).toEqual(['Leadership', 'Communication']);
      expect(result.current.resumeData?.skills.business).toEqual(['Project Management', 'Team Leadership']); // Should remain unchanged
    });

    it('should add project', () => {
      const { result } = renderHook(() => useResumeStore());
      const newProject = {
        id: 'proj2',
        name: 'Mobile App',
        description: 'Built a cross-platform mobile application.',
        technologies: ['React Native', 'Firebase'],
        startDate: '2023-01-01',
        endDate: '2023-12-31',
      };

      act(() => {
        result.current.addProject(newProject);
      });

      expect(result.current.resumeData?.projects).toHaveLength(2);
      expect(result.current.resumeData?.projects[1]).toEqual(newProject);
    });

    it('should update project', () => {
      const { result } = renderHook(() => useResumeStore());
      
      act(() => {
        result.current.updateProject('proj1', {
          name: 'Updated E-commerce Platform',
          technologies: ['Next.js', 'Prisma', 'PostgreSQL'],
        });
      });

      const updatedProj = result.current.resumeData?.projects.find(proj => proj.id === 'proj1');
      expect(updatedProj?.name).toBe('Updated E-commerce Platform');
      expect(updatedProj?.technologies).toEqual(['Next.js', 'Prisma', 'PostgreSQL']);
      expect(updatedProj?.description).toBe('Built a full-stack e-commerce solution.'); // Should remain unchanged
    });

    it('should remove project', () => {
      const { result } = renderHook(() => useResumeStore());
      
      act(() => {
        result.current.removeProject('proj1');
      });

      expect(result.current.resumeData?.projects).toHaveLength(0);
    });

    it('should update achievements', () => {
      const { result } = renderHook(() => useResumeStore());
      
      act(() => {
        result.current.updateAchievements(['New Achievement 1', 'New Achievement 2']);
      });

      expect(result.current.resumeData?.achievements).toEqual(['New Achievement 1', 'New Achievement 2']);
    });

    it('should update certifications', () => {
      const { result } = renderHook(() => useResumeStore());
      const newCertifications = [
        {
          name: 'AWS Solutions Architect',
          issuer: 'Amazon Web Services',
          date: '2023-01-01',
          expiryDate: '2026-01-01',
          credentialId: 'AWS-SA-123456',
          url: 'https://aws.amazon.com/certification/',
        },
      ];

      act(() => {
        result.current.updateCertifications(newCertifications);
      });

      expect(result.current.resumeData?.certifications).toEqual(newCertifications);
    });

    it('should update hobbies', () => {
      const { result } = renderHook(() => useResumeStore());
      
      act(() => {
        result.current.updateHobbies(['Reading', 'Gaming', 'Cooking']);
      });

      expect(result.current.resumeData?.hobbies).toEqual(['Reading', 'Gaming', 'Cooking']);
    });
  });

  describe('Data Management', () => {
    it('should clear all data', () => {
      const { result } = renderHook(() => useResumeStore());
      
      act(() => {
        result.current.setResumeData(mockResumeData);
        result.current.setSelectedTemplate(mockTemplate);
        result.current.clearAllData();
      });

      expect(result.current.resumeData).toBeNull();
      expect(result.current.selectedTemplate).toBeNull();
      expect(result.current.customizedTemplate).toBeNull();
      expect(result.current.analysisResult).toBeNull();
    });

    it('should clear analysis data', () => {
      const { result } = renderHook(() => useResumeStore());
      
      act(() => {
        result.current.setResumeData(mockResumeData);
        result.current.setSelectedTemplate(mockTemplate);
        result.current.clearAnalysisData();
      });

      expect(result.current.resumeData).toEqual(mockResumeData); // Should remain
      expect(result.current.analysisResult).toBeNull();
      expect(result.current.selectedTemplate).toBeNull();
      expect(result.current.customizedTemplate).toBeNull();
    });

    it('should clear template data', () => {
      const { result } = renderHook(() => useResumeStore());
      
      act(() => {
        result.current.setResumeData(mockResumeData);
        result.current.setSelectedTemplate(mockTemplate);
        result.current.clearTemplateData();
      });

      expect(result.current.resumeData).toEqual(mockResumeData); // Should remain
      expect(result.current.selectedTemplate).toBeNull();
      expect(result.current.customizedTemplate).toBeNull();
    });
  });

  describe('Utility Functions', () => {
    it('should check if resume data exists', () => {
      const { result } = renderHook(() => useResumeStore());
      
      expect(result.current.hasResumeData()).toBe(false);

      act(() => {
        result.current.setResumeData(mockResumeData);
      });

      expect(result.current.hasResumeData()).toBe(true);
    });

    it('should check if analysis result exists', () => {
      const { result } = renderHook(() => useResumeStore());
      
      expect(result.current.hasAnalysisResult()).toBe(false);

      act(() => {
        result.current.setAnalysisResult({
          jobType: 'Software Engineer',
          atsScore: 85,
          keywordMatches: ['JavaScript', 'React'],
          missingKeywords: ['Python'],
          suggestions: ['Add Python experience'],
          strengths: ['Strong JavaScript skills'],
          weaknesses: ['Limited Python experience'],
          keywordDensity: { JavaScript: 0.1, React: 0.05 },
          wordCount: 500,
          characterCount: 2500,
        });
      });

      expect(result.current.hasAnalysisResult()).toBe(true);
    });

    it('should check if selected template exists', () => {
      const { result } = renderHook(() => useResumeStore());
      
      expect(result.current.hasSelectedTemplate()).toBe(false);

      act(() => {
        result.current.setSelectedTemplate(mockTemplate);
      });

      expect(result.current.hasSelectedTemplate()).toBe(true);
    });

    it('should get current data', () => {
      const { result } = renderHook(() => useResumeStore());
      
      expect(result.current.getCurrentData()).toBeNull();

      act(() => {
        result.current.setResumeData(mockResumeData);
      });

      expect(result.current.getCurrentData()).toEqual(mockResumeData);
    });
  });

  describe('Selectors', () => {
    it('should provide resume data selector', () => {
      const { result } = renderHook(() => useResumeData());
      
      expect(result.current).toBeNull();

      const { result: storeResult } = renderHook(() => useResumeStore());
      act(() => {
        storeResult.current.setResumeData(mockResumeData);
      });

      expect(result.current).toEqual(mockResumeData);
    });

    it('should provide resume actions', () => {
      const { result } = renderHook(() => useResumeActions());
      
      expect(typeof result.current.setResumeData).toBe('function');
      expect(typeof result.current.setSelectedTemplate).toBe('function');
      expect(typeof result.current.updatePersonalInfo).toBe('function');
      expect(typeof result.current.addExperience).toBe('function');
      expect(typeof result.current.updateSkills).toBe('function');
    });
  });

  describe('Error Handling', () => {
    it('should handle content management actions when no resume data exists', () => {
      const { result } = renderHook(() => useResumeStore());
      
      // These should not throw errors even when no resume data exists
      expect(() => {
        act(() => {
          result.current.updatePersonalInfo({ fullName: 'Test' });
          result.current.updateSummary('Test summary');
          result.current.addExperience(mockResumeData.experience[0]);
          result.current.updateSkills({ technical: ['Test'] });
        });
      }).not.toThrow();
    });
  });
});
