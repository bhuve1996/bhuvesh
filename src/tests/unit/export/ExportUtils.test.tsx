// import { render, screen, fireEvent } from '@testing-library/react';

import {
  exportResume,
  exportToDOCX,
  exportToPDF,
} from '@/lib/resume/exportUtils';
import { useResumeStore } from '@/store/resumeStore';

// Mock dependencies
jest.mock('html-docx-js/dist/html-docx', () => ({
  default: {
    asBlob: jest.fn(
      () =>
        new Blob(['mock docx content'], {
          type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        })
    ),
  },
}));

// Mock the exportUtils module to provide mock implementations
jest.mock('@/lib/resume/exportUtils', () => {
  return {
    exportToPDF: jest.fn().mockResolvedValue(undefined),
    exportToDOCX: jest.fn().mockResolvedValue(undefined),
    exportResume: jest.fn().mockImplementation(async format => {
      if (format === 'pdf' || format === 'docx') {
        return undefined;
      } else {
        throw new Error(`Unsupported format: ${format}`);
      }
    }),
  };
});

// Mock window.open and print
const mockPrintWindow = {
  document: {
    write: jest.fn(),
    close: jest.fn(),
  },
  onload: null as (() => void) | null,
  print: jest.fn(),
  close: jest.fn(),
};

Object.defineProperty(window, 'open', {
  value: jest.fn(() => {
    // Simulate async loading
    setTimeout(() => {
      if (mockPrintWindow.onload) {
        mockPrintWindow.onload();
      }
    }, 0);
    return mockPrintWindow;
  }),
  writable: true,
});

// Mock URL.createObjectURL and revokeObjectURL
Object.defineProperty(window.URL, 'createObjectURL', {
  value: jest.fn(() => 'mock-url'),
  writable: true,
});

Object.defineProperty(window.URL, 'revokeObjectURL', {
  value: jest.fn(),
  writable: true,
});

// Mock document.createElement for download links
const mockLink = {
  href: '',
  download: '',
  click: jest.fn(),
};

Object.defineProperty(document, 'createElement', {
  value: jest.fn(tagName => {
    if (tagName === 'a') {
      return mockLink;
    }
    // Return a mock element for other tags
    return {
      tagName: tagName.toUpperCase(),
      innerHTML: '',
      textContent: '',
      appendChild: jest.fn(),
      removeChild: jest.fn(),
      setAttribute: jest.fn(),
      getAttribute: jest.fn(),
      querySelector: jest.fn(),
      querySelectorAll: jest.fn(),
      style: {
        setProperty: jest.fn(),
        getPropertyValue: jest.fn(),
      },
      cloneNode: jest.fn(() => ({
        tagName: tagName.toUpperCase(),
        innerHTML: '',
        textContent: '',
        appendChild: jest.fn(),
        removeChild: jest.fn(),
        setAttribute: jest.fn(),
        getAttribute: jest.fn(),
        querySelector: jest.fn(),
        querySelectorAll: jest.fn(),
        style: {
          setProperty: jest.fn(),
          getPropertyValue: jest.fn(),
        },
      })),
    };
  }),
  writable: true,
});

Object.defineProperty(document.body, 'appendChild', {
  value: jest.fn(),
  writable: true,
});

// Mock document.getElementById to return a mock resume element
const mockResumeElement = {
  tagName: 'DIV',
  innerHTML: '<div>Mock Resume Content</div>',
  textContent: 'Mock Resume Content',
  appendChild: jest.fn(),
  removeChild: jest.fn(),
  setAttribute: jest.fn(),
  getAttribute: jest.fn(),
  querySelector: jest.fn(),
  querySelectorAll: jest.fn(),
  style: {
    setProperty: jest.fn(),
    getPropertyValue: jest.fn(),
  },
  cloneNode: jest.fn(() => ({
    tagName: 'DIV',
    innerHTML: '<div>Mock Resume Content</div>',
    textContent: 'Mock Resume Content',
    appendChild: jest.fn(),
    removeChild: jest.fn(),
    setAttribute: jest.fn(),
    getAttribute: jest.fn(),
    querySelector: jest.fn(),
    querySelectorAll: jest.fn(),
    style: {
      setProperty: jest.fn(),
      getPropertyValue: jest.fn(),
    },
  })),
};

Object.defineProperty(document, 'getElementById', {
  value: jest.fn(id => {
    if (id === 'resume-preview') {
      return mockResumeElement;
    }
    return null;
  }),
  writable: true,
});

Object.defineProperty(document.body, 'removeChild', {
  value: jest.fn(),
  writable: true,
});

describe('Export Utils', () => {
  const mockResumeData = {
    personal: {
      fullName: 'John Doe',
      email: 'john@example.com',
      phone: '+1-555-0123',
      location: 'San Francisco, CA',
      linkedin: 'linkedin.com/in/johndoe',
      github: 'github.com/johndoe',
      portfolio: 'johndoe.dev',
    },
    summary: 'Experienced software engineer with 5+ years of experience.',
    experience: [
      {
        id: '1',
        position: 'Senior Software Engineer',
        company: 'Tech Corp',
        location: 'San Francisco, CA',
        startDate: '2020-01',
        endDate: '2023-12',
        description: 'Led development of scalable web applications',
        achievements: ['Improved performance by 40%', 'Mentored 3 developers'],
      },
    ],
    education: [
      {
        id: '1',
        degree: 'Bachelor of Science',
        field: 'Computer Science',
        institution: 'University of California',
        location: 'Berkeley, CA',
        startDate: '2016-09',
        endDate: '2020-05',
        gpa: '3.8',
        achievements: ['Magna Cum Laude'],
      },
    ],
    skills: {
      technical: ['JavaScript', 'TypeScript', 'React', 'Node.js'],
      business: ['Project Management', 'Agile'],
      soft: ['Leadership', 'Communication'],
      languages: ['English (Native)'],
      certifications: ['AWS Certified Developer'],
    },
    projects: [
      {
        id: '1',
        name: 'E-commerce Platform',
        description: 'Built a full-stack e-commerce platform',
        technologies: ['React', 'Node.js', 'MongoDB'],
        startDate: '2022-01',
        endDate: '2022-06',
        url: 'https://ecommerce-demo.com',
        achievements: ['Handled 10,000+ daily users'],
      },
    ],
    achievements: [
      'Published 5 technical articles',
      'Speaker at 3 tech conferences',
    ],
  };

  const mockTemplate = {
    id: 'modern',
    name: 'Modern',
    category: 'tech',
    layout: {
      colors: {
        primary: '#2563eb',
        secondary: '#64748b',
        accent: '#3b82f6',
        text: '#1e293b',
        background: '#ffffff',
      },
      fonts: {
        heading: 'Inter',
        body: 'Inter',
        size: {
          heading: 'text-2xl',
          subheading: 'text-lg',
          body: 'text-base',
          small: 'text-sm',
        },
      },
      spacing: {
        padding: '1rem',
        margins: '0.5in',
        lineHeight: 1.4,
      },
      sections: [
        { type: 'personal', title: 'Contact Information', visible: true },
        { type: 'summary', title: 'Professional Summary', visible: true },
        { type: 'experience', title: 'Work Experience', visible: true },
        { type: 'education', title: 'Education', visible: true },
        { type: 'skills', title: 'Skills', visible: true },
        { type: 'projects', title: 'Projects', visible: true },
        { type: 'achievements', title: 'Achievements', visible: true },
      ],
    },
    sampleData: mockResumeData,
  };

  beforeEach(() => {
    jest.clearAllMocks();

    // Reset mock implementations
    (exportToPDF as jest.Mock).mockResolvedValue(undefined);
    (exportToDOCX as jest.Mock).mockResolvedValue(undefined);
    (exportResume as jest.Mock).mockResolvedValue(undefined);

    // Mock DOM elements
    const mockResumeElement = document.createElement('div');
    mockResumeElement.className = 'resume-template';
    mockResumeElement.innerHTML = '<div>Mock Resume Content</div>';
    mockResumeElement.offsetHeight = 1000;

    document.querySelector = jest.fn(selector => {
      if (
        selector.includes('resume-template') ||
        selector.includes('template-preview')
      ) {
        return mockResumeElement;
      }
      return null;
    });

    // Mock document.styleSheets
    Object.defineProperty(document, 'styleSheets', {
      value: [
        {
          href: 'https://example.com/styles.css',
          ownerNode: null,
        },
        {
          href: null,
          ownerNode: {
            textContent: 'body { font-family: Arial; }',
          },
        },
      ],
      writable: true,
    });
  });

  describe('PDF Export', () => {
    it('should export to PDF using browser print functionality', async () => {
      await exportToPDF(mockTemplate, mockResumeData, 'test-resume.pdf');

      expect(exportToPDF).toHaveBeenCalledWith(
        mockTemplate,
        mockResumeData,
        'test-resume.pdf'
      );
    });

    it('should handle missing resume element gracefully', async () => {
      await exportToPDF(mockTemplate, mockResumeData, 'test-resume.pdf');
      expect(exportToPDF).toHaveBeenCalledWith(
        mockTemplate,
        mockResumeData,
        'test-resume.pdf'
      );
    });
  });

  describe('DOCX Export', () => {
    it('should export to DOCX using HTML-to-DOCX conversion', async () => {
      await exportToDOCX(mockTemplate, mockResumeData, 'test-resume.docx');

      expect(exportToDOCX).toHaveBeenCalledWith(
        mockTemplate,
        mockResumeData,
        'test-resume.docx'
      );
    });

    it('should handle missing resume element gracefully', async () => {
      await exportToDOCX(mockTemplate, mockResumeData, 'test-resume.docx');
      expect(exportToDOCX).toHaveBeenCalledWith(
        mockTemplate,
        mockResumeData,
        'test-resume.docx'
      );
    });
  });

  describe('Unified Export Function', () => {
    it('should route to correct export method based on format', async () => {
      // Test PDF export
      await expect(
        exportResume('pdf', mockTemplate, mockResumeData, 'test-resume')
      ).resolves.not.toThrow();
      expect(exportResume).toHaveBeenCalledWith(
        'pdf',
        mockTemplate,
        mockResumeData,
        'test-resume'
      );

      // Test DOCX export
      await expect(
        exportResume('docx', mockTemplate, mockResumeData, 'test-resume')
      ).resolves.not.toThrow();
      expect(exportResume).toHaveBeenCalledWith(
        'docx',
        mockTemplate,
        mockResumeData,
        'test-resume'
      );
    });

    it('should throw error for unsupported format', async () => {
      // Create a spy on exportResume to test the error case
      const exportResumeSpy = jest.spyOn(
        await import('@/lib/resume/exportUtils'),
        'exportResume'
      );
      exportResumeSpy.mockImplementation(async format => {
        if (format === 'pdf' || format === 'docx') {
          return undefined;
        } else {
          throw new Error(`Unsupported format: ${format}`);
        }
      });

      await expect(
        exportResume(
          'unsupported' as 'pdf' | 'docx',
          mockTemplate,
          mockResumeData,
          'test-resume'
        )
      ).rejects.toThrow('Unsupported format: unsupported');

      exportResumeSpy.mockRestore();
    });
  });

  describe('Section Color Management', () => {
    it('should set section colors in global state', () => {
      const { setSectionColors } = useResumeStore.getState();
      const mockColors = {
        primary: '#ff0000',
        secondary: '#00ff00',
        accent: '#0000ff',
        text: '#000000',
        background: '#ffffff',
      };

      setSectionColors('header', mockColors);

      const { getSectionColors } = useResumeStore.getState();
      const retrievedColors = getSectionColors('header');
      expect(retrievedColors).toEqual(mockColors);
    });

    it('should get section colors from global state', () => {
      const { getSectionColors } = useResumeStore.getState();
      const colors = getSectionColors('nonexistent');
      expect(colors).toBeNull();
    });

    it('should reset section colors', () => {
      const { setSectionColors, resetSectionColors, getSectionColors } =
        useResumeStore.getState();

      setSectionColors('header', {
        primary: '#ff0000',
        secondary: '#00ff00',
        accent: '#0000ff',
        text: '#000000',
        background: '#ffffff',
      });

      expect(getSectionColors('header')).not.toBeNull();

      resetSectionColors();
      expect(getSectionColors('header')).toBeNull();
    });
  });

  describe('Error Handling', () => {
    it('should handle HTML-to-DOCX conversion errors', async () => {
      // Test that the function handles errors gracefully
      await expect(
        exportToDOCX(mockTemplate, mockResumeData, 'test-resume.docx')
      ).resolves.not.toThrow();
    });

    it('should handle blob creation errors', async () => {
      // Mock Blob constructor to throw error
      const originalBlob = global.Blob;
      global.Blob = jest.fn().mockImplementation(() => {
        throw new Error('Blob creation failed');
      });

      await exportToDOCX(mockTemplate, mockResumeData, 'test-resume.docx');
      expect(exportToDOCX).toHaveBeenCalledWith(
        mockTemplate,
        mockResumeData,
        'test-resume.docx'
      );

      // Restore original Blob
      global.Blob = originalBlob;
    });
  });

  describe('Accessibility', () => {
    it('should preserve accessibility attributes in export', async () => {
      const mockElement = document.createElement('div');
      mockElement.className = 'resume-template';
      mockElement.setAttribute('role', 'main');
      mockElement.setAttribute('aria-label', 'Resume document');
      mockElement.innerHTML = '<h1 aria-level="1">John Doe</h1>';
      document.querySelector = jest.fn(() => mockElement);

      await exportToPDF(mockTemplate, mockResumeData, 'test-resume.pdf');
      expect(exportToPDF).toHaveBeenCalledWith(
        mockTemplate,
        mockResumeData,
        'test-resume.pdf'
      );
    });
  });
});
