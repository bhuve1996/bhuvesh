// import { render, screen, fireEvent } from '@testing-library/react';

import { exportResumeUnified, exportToPDFUnified, exportToDOCXUnified, exportToTXTUnified } from '@/lib/resume/unifiedExportUtils';
import { useResumeStore } from '@/store/resumeStore';

// Mock dependencies
jest.mock('html-docx-js', () => ({
  default: {
    asBlob: jest.fn(() => new Blob(['mock docx content'], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' })),
  },
}));

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
  value: jest.fn(() => mockPrintWindow),
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
  value: jest.fn((tagName) => {
    if (tagName === 'a') {
      return mockLink;
    }
    return document.createElement(tagName);
  }),
  writable: true,
});

Object.defineProperty(document.body, 'appendChild', {
  value: jest.fn(),
  writable: true,
});

Object.defineProperty(document.body, 'removeChild', {
  value: jest.fn(),
  writable: true,
});

describe('Unified Export Utils', () => {
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
    
    // Mock DOM elements
    const mockResumeElement = document.createElement('div');
    mockResumeElement.className = 'resume-template';
    mockResumeElement.innerHTML = '<div>Mock Resume Content</div>';
    mockResumeElement.offsetHeight = 1000;
    
    document.querySelector = jest.fn((selector) => {
      if (selector.includes('resume-template') || selector.includes('template-preview')) {
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
      const options = {
        template: mockTemplate,
        data: mockResumeData,
        filename: 'test-resume.pdf',
        format: 'pdf' as const,
      };

      await exportToPDFUnified(options);

      expect(window.open).toHaveBeenCalledWith('', '_blank');
      expect(mockPrintWindow.document.write).toHaveBeenCalled();
      expect(mockPrintWindow.print).toHaveBeenCalled();
    });

    it('should handle missing resume element gracefully', async () => {
      document.querySelector = jest.fn(() => null);

      const options = {
        template: mockTemplate,
        data: mockResumeData,
        filename: 'test-resume.pdf',
        format: 'pdf' as const,
      };

      await expect(exportToPDFUnified(options)).rejects.toThrow(
        'Resume preview not found. Please ensure the resume is visible on screen.'
      );
    });

    it('should handle popup blocking', async () => {
      (window.open as jest.Mock).mockReturnValue(null);

      const options = {
        template: mockTemplate,
        data: mockResumeData,
        filename: 'test-resume.pdf',
        format: 'pdf' as const,
      };

      await expect(exportToPDFUnified(options)).rejects.toThrow(
        'Unable to open print window. Please allow popups.'
      );
    });

    it('should apply consistent styling to exported content', async () => {
      const options = {
        template: mockTemplate,
        data: mockResumeData,
        filename: 'test-resume.pdf',
        format: 'pdf' as const,
      };

      await exportToPDFUnified(options);

      const writtenContent = mockPrintWindow.document.write.mock.calls[0][0];
      expect(writtenContent).toContain('color-adjust: exact');
      expect(writtenContent).toContain('print-color-adjust: exact');
      expect(writtenContent).toContain('@media print');
    });
  });

  describe('DOCX Export', () => {
    it('should export to DOCX using HTML-to-DOCX conversion', async () => {
      const options = {
        template: mockTemplate,
        data: mockResumeData,
        filename: 'test-resume.docx',
        format: 'docx' as const,
      };

      await exportToDOCXUnified(options);

      expect(mockLink.download).toBe('test-resume.docx');
      expect(mockLink.click).toHaveBeenCalled();
    });

    it('should handle missing resume element gracefully', async () => {
      document.querySelector = jest.fn(() => null);

      const options = {
        template: mockTemplate,
        data: mockResumeData,
        filename: 'test-resume.docx',
        format: 'docx' as const,
      };

      await expect(exportToDOCXUnified(options)).rejects.toThrow(
        'Resume preview not found. Please ensure the resume is visible on screen.'
      );
    });

    it('should create proper HTML content for DOCX conversion', async () => {
      const options = {
        template: mockTemplate,
        data: mockResumeData,
        filename: 'test-resume.docx',
        format: 'docx' as const,
      };

      await exportToDOCXUnified(options);

      // Verify that html-docx-js was called
      const { default: htmlDocx } = await import('html-docx-js');
      expect(htmlDocx.asBlob).toHaveBeenCalled();
    });
  });

  describe('TXT Export', () => {
    it('should export to TXT with clean formatting', async () => {
      const options = {
        template: mockTemplate,
        data: mockResumeData,
        filename: 'test-resume.txt',
        format: 'txt' as const,
      };

      await exportToTXTUnified(options);

      expect(mockLink.download).toBe('test-resume.txt');
      expect(mockLink.click).toHaveBeenCalled();
    });

    it('should handle missing resume element gracefully', async () => {
      document.querySelector = jest.fn(() => null);

      const options = {
        template: mockTemplate,
        data: mockResumeData,
        filename: 'test-resume.txt',
        format: 'txt' as const,
      };

      await expect(exportToTXTUnified(options)).rejects.toThrow(
        'Resume preview not found. Please ensure the resume is visible on screen.'
      );
    });

    it('should clean up text formatting', async () => {
      const mockElement = document.createElement('div');
      mockElement.innerText = '  Multiple   spaces\n\n\nMultiple\n\n\nline breaks  ';
      document.querySelector = jest.fn(() => mockElement);

      const options = {
        template: mockTemplate,
        data: mockResumeData,
        filename: 'test-resume.txt',
        format: 'txt' as const,
      };

      await exportToTXTUnified(options);

      // Verify that the text was cleaned up
      expect(mockElement.innerText).toContain('Multiple spaces');
    });
  });

  describe('Unified Export Function', () => {
    it('should route to correct export method based on format', async () => {
      const pdfSpy = jest.spyOn(await import('@/lib/resume/unifiedExportUtils'), 'exportToPDFUnified');
      const docxSpy = jest.spyOn(await import('@/lib/resume/unifiedExportUtils'), 'exportToDOCXUnified');
      const txtSpy = jest.spyOn(await import('@/lib/resume/unifiedExportUtils'), 'exportToTXTUnified');

      const options = {
        template: mockTemplate,
        data: mockResumeData,
        filename: 'test-resume',
        format: 'pdf' as const,
      };

      await exportResumeUnified(options);
      expect(pdfSpy).toHaveBeenCalledWith(options);

      options.format = 'docx';
      await exportResumeUnified(options);
      expect(docxSpy).toHaveBeenCalledWith(options);

      options.format = 'txt';
      await exportResumeUnified(options);
      expect(txtSpy).toHaveBeenCalledWith(options);
    });

    it('should throw error for unsupported format', async () => {
      const options = {
        template: mockTemplate,
        data: mockResumeData,
        filename: 'test-resume',
        format: 'unsupported' as 'pdf' | 'docx' | 'txt',
      };

      await expect(exportResumeUnified(options)).rejects.toThrow(
        'Unsupported export format: unsupported'
      );
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
      const { setSectionColors, resetSectionColors, getSectionColors } = useResumeStore.getState();
      
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
      const { default: htmlDocx } = await import('html-docx-js');
      (htmlDocx.asBlob as jest.Mock).mockRejectedValue(new Error('Conversion failed'));

      const options = {
        template: mockTemplate,
        data: mockResumeData,
        filename: 'test-resume.docx',
        format: 'docx' as const,
      };

      await expect(exportToDOCXUnified(options)).rejects.toThrow(
        'DOCX export failed: Conversion failed'
      );
    });

    it('should handle blob creation errors', async () => {
      // Mock Blob constructor to throw error
      const originalBlob = global.Blob;
      global.Blob = jest.fn().mockImplementation(() => {
        throw new Error('Blob creation failed');
      });

      const options = {
        template: mockTemplate,
        data: mockResumeData,
        filename: 'test-resume.txt',
        format: 'txt' as const,
      };

      await expect(exportToTXTUnified(options)).rejects.toThrow(
        'TXT export failed: Blob creation failed'
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

      const options = {
        template: mockTemplate,
        data: mockResumeData,
        filename: 'test-resume.pdf',
        format: 'pdf' as const,
      };

      await exportToPDFUnified(options);

      const writtenContent = mockPrintWindow.document.write.mock.calls[0][0];
      expect(writtenContent).toContain('role="main"');
      expect(writtenContent).toContain('aria-label="Resume document"');
      expect(writtenContent).toContain('aria-level="1"');
    });
  });
});
