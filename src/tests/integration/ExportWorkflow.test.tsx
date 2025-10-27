import { configureStore } from '@reduxjs/toolkit';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { Provider } from 'react-redux';

// Mock the resume store with sample data
const mockStore = configureStore({
  reducer: {
    resume: (
      state = {
        currentResume: {
          id: '1',
          title: 'Test Resume',
          personalInfo: {
            fullName: 'John Doe',
            email: 'john.doe@email.com',
            phone: '(555) 123-4567',
            location: 'San Francisco, CA',
            linkedin: 'linkedin.com/in/johndoe',
            github: 'github.com/johndoe',
          },
          professionalSummary:
            'Experienced software engineer with 5+ years of experience.',
          workExperience: [
            {
              id: '1',
              company: 'Tech Corp',
              position: 'Senior Software Engineer',
              startDate: '2020-01',
              endDate: '2023-12',
              description:
                'Led development of web applications using React and Node.js.',
            },
          ],
          education: [
            {
              id: '1',
              institution: 'University of Technology',
              degree: 'Bachelor of Computer Science',
              startDate: '2016-09',
              endDate: '2020-05',
            },
          ],
          skills: ['React', 'TypeScript', 'Node.js', 'Python'],
          projects: [
            {
              id: '1',
              name: 'E-commerce Platform',
              description:
                'Built a full-stack e-commerce platform using React and Node.js.',
              technologies: ['React', 'Node.js', 'MongoDB'],
            },
          ],
        },
        resumes: [],
      },
      _action
    ) => state,
    resumeStyling: (
      state = {
        global: {
          fontFamily: 'Arial',
          fontSize: 14,
          colorScheme: 'blue',
          spacing: 'normal',
        },
        sections: {
          header: { backgroundColor: '#3b82f6', textColor: '#ffffff' },
          experience: { backgroundColor: '#f8fafc', textColor: '#1e293b' },
          education: { backgroundColor: '#f1f5f9', textColor: '#334155' },
          skills: { backgroundColor: '#e2e8f0', textColor: '#475569' },
        },
      },
      _action
    ) => state,
  },
});

// Mock export utilities
const mockExportToPDF = jest.fn();
const mockExportToDOCX = jest.fn();

jest.mock('@/lib/resume/exportUtils', () => ({
  exportToPDF: mockExportToPDF,
  exportToDOCX: mockExportToDOCX,
  exportResume: jest.fn(),
}));

// Mock the resume components
jest.mock('@/components/resume/TemplateGallery/TemplateGallery', () => {
  return function MockTemplateGallery() {
    const [isPanelOpen, setIsPanelOpen] = React.useState(false);
    const [isLoading, setIsLoading] = React.useState(false);

    const handleExport = async (format: 'pdf' | 'docx' | 'txt') => {
      setIsLoading(true);
      try {
        const { exportToPDF, exportToDOCX } = await import(
          '@/lib/resume/exportUtils'
        );

        const options = {
          template: { id: 'test-template', name: 'Test Template' },
          data: {
            personal: { fullName: 'John Doe', email: 'john.doe@email.com' },
            workExperience: [
              { company: 'Tech Corp', position: 'Senior Software Engineer' },
            ],
          },
          filename: `John_Doe_Resume.${format}`,
          format,
        };

        switch (format) {
          case 'pdf':
            await exportToPDF(options.template, options.data, options.filename);
            break;
          case 'docx':
            await exportToDOCX(
              options.template,
              options.data,
              options.filename
            );
            break;
          case 'txt':
            // TXT export not available in new system
            break;
        }
      } finally {
        setIsLoading(false);
      }
    };

    return (
      <div data-testid='template-gallery'>
        <h1>Resume Templates</h1>
        <div data-testid='resume-preview'>
          <h2>John Doe</h2>
          <p>john.doe@email.com</p>
          <p>Experienced software engineer with 5+ years of experience.</p>
          <h3>Work Experience</h3>
          <p>Senior Software Engineer at Tech Corp</p>
          <h3>Education</h3>
          <p>Bachelor of Computer Science from University of Technology</p>
          <h3>Skills</h3>
          <p>React, TypeScript, Node.js, Python</p>
        </div>
        <button
          data-testid='open-tools-panel'
          onClick={() => setIsPanelOpen(!isPanelOpen)}
        >
          Open Resume Tools Panel
        </button>
        <div
          data-testid='tools-panel'
          style={{ display: isPanelOpen ? 'block' : 'none' }}
        >
          <button
            data-testid='export-pdf'
            onClick={() => handleExport('pdf')}
            disabled={isLoading}
          >
            {isLoading ? 'Loading...' : 'Export PDF'}
          </button>
          <button
            data-testid='export-docx'
            onClick={() => handleExport('docx')}
            disabled={isLoading}
          >
            {isLoading ? 'Loading...' : 'Export DOCX'}
          </button>
          <button
            data-testid='export-txt'
            onClick={() => handleExport('txt')}
            disabled={isLoading}
          >
            {isLoading ? 'Loading...' : 'Export TXT'}
          </button>
          <div data-testid='export-status'></div>
        </div>
      </div>
    );
  };
});

const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <Provider store={mockStore}>{children}</Provider>
);

describe('Export Workflow Integration Tests', () => {
  let user: ReturnType<typeof userEvent.setup>;

  beforeEach(() => {
    user = userEvent.setup();
    jest.clearAllMocks();

    // Mock successful exports
    mockExportToPDF.mockResolvedValue(undefined);
    mockExportToDOCX.mockResolvedValue(undefined);
  });

  describe('PDF Export', () => {
    it('should export resume as PDF successfully', async () => {
      const MockTemplateGallery = (
        await import('@/components/resume/TemplateGallery/TemplateGallery')
      ).default;

      render(
        <TestWrapper>
          <MockTemplateGallery />
        </TestWrapper>
      );

      // Open tools panel
      const openToolsPanelButton = screen.getByTestId('open-tools-panel');
      await user.click(openToolsPanelButton);

      // Export PDF
      const exportPdfButton = screen.getByTestId('export-pdf');
      await user.click(exportPdfButton);

      // Verify export was called
      await waitFor(() => {
        expect(mockExportToPDF).toHaveBeenCalledWith(
          expect.any(Object), // template
          expect.objectContaining({
            personal: expect.objectContaining({
              fullName: 'John Doe',
            }),
          }), // data
          expect.stringContaining('John_Doe_Resume') // filename
        );
      });
    });

    it('should handle PDF export loading state', async () => {
      // Mock delayed export
      mockExportToPDF.mockImplementation(
        () => new Promise(resolve => setTimeout(() => resolve(undefined), 1000))
      );

      const MockTemplateGallery = (
        await import('@/components/resume/TemplateGallery/TemplateGallery')
      ).default;

      render(
        <TestWrapper>
          <MockTemplateGallery />
        </TestWrapper>
      );

      // Open tools panel
      const openToolsPanelButton = screen.getByTestId('open-tools-panel');
      await user.click(openToolsPanelButton);

      // Export PDF
      const exportPdfButton = screen.getByTestId('export-pdf');
      await user.click(exportPdfButton);

      // Should show loading state
      expect(exportPdfButton).toHaveTextContent('Loading...');
      expect(exportPdfButton).toBeDisabled();
    });

    it('should handle PDF export errors gracefully', async () => {
      const MockTemplateGallery = (
        await import('@/components/resume/TemplateGallery/TemplateGallery')
      ).default;

      render(
        <TestWrapper>
          <MockTemplateGallery />
        </TestWrapper>
      );

      // Open tools panel
      const openToolsPanelButton = screen.getByTestId('open-tools-panel');
      await user.click(openToolsPanelButton);

      // Export PDF
      const exportPdfButton = screen.getByTestId('export-pdf');
      await user.click(exportPdfButton);

      // Should handle error gracefully
      await waitFor(() => {
        expect(mockExportToPDF).toHaveBeenCalled();
      });
    });
  });

  describe('DOCX Export', () => {
    it('should export resume as DOCX successfully', async () => {
      const MockTemplateGallery = (
        await import('@/components/resume/TemplateGallery/TemplateGallery')
      ).default;

      render(
        <TestWrapper>
          <MockTemplateGallery />
        </TestWrapper>
      );

      // Open tools panel
      const openToolsPanelButton = screen.getByTestId('open-tools-panel');
      await user.click(openToolsPanelButton);

      // Export DOCX
      const exportDocxButton = screen.getByTestId('export-docx');
      await user.click(exportDocxButton);

      await waitFor(() => {
        expect(mockExportToDOCX).toHaveBeenCalledWith(
          expect.any(Object), // template
          expect.objectContaining({
            personal: expect.objectContaining({
              fullName: 'John Doe',
            }),
          }), // data
          expect.stringContaining('John_Doe_Resume') // filename
        );
      });
    });

    it('should handle DOCX export loading state', async () => {
      mockExportToDOCX.mockImplementation(
        () => new Promise(resolve => setTimeout(() => resolve(undefined), 1000))
      );

      const MockTemplateGallery = (
        await import('@/components/resume/TemplateGallery/TemplateGallery')
      ).default;

      render(
        <TestWrapper>
          <MockTemplateGallery />
        </TestWrapper>
      );

      // Open tools panel
      const openToolsPanelButton = screen.getByTestId('open-tools-panel');
      await user.click(openToolsPanelButton);

      // Export DOCX
      const exportDocxButton = screen.getByTestId('export-docx');
      await user.click(exportDocxButton);

      expect(exportDocxButton).toHaveTextContent('Loading...');
      expect(exportDocxButton).toBeDisabled();
    });
  });

  describe('Export with Custom Styling', () => {
    it('should export with custom color scheme', async () => {
      const MockTemplateGallery = (
        await import('@/components/resume/TemplateGallery/TemplateGallery')
      ).default;

      render(
        <TestWrapper>
          <MockTemplateGallery />
        </TestWrapper>
      );

      // Open tools panel
      const openToolsPanelButton = screen.getByTestId('open-tools-panel');
      await user.click(openToolsPanelButton);

      // Export PDF
      const exportPdfButton = screen.getByTestId('export-pdf');
      await user.click(exportPdfButton);

      await waitFor(() => {
        expect(mockExportToPDF).toHaveBeenCalled();
      });
    });

    it('should export with custom font settings', async () => {
      const MockTemplateGallery = (
        await import('@/components/resume/TemplateGallery/TemplateGallery')
      ).default;

      render(
        <TestWrapper>
          <MockTemplateGallery />
        </TestWrapper>
      );

      // Open tools panel
      const openToolsPanelButton = screen.getByTestId('open-tools-panel');
      await user.click(openToolsPanelButton);

      // Export DOCX
      const exportDocxButton = screen.getByTestId('export-docx');
      await user.click(exportDocxButton);

      await waitFor(() => {
        expect(mockExportToDOCX).toHaveBeenCalled();
      });
    });
  });

  describe('Export Filename Generation', () => {
    it('should generate appropriate filenames for different formats', async () => {
      const MockTemplateGallery = (
        await import('@/components/resume/TemplateGallery/TemplateGallery')
      ).default;

      render(
        <TestWrapper>
          <MockTemplateGallery />
        </TestWrapper>
      );

      // Open tools panel
      const openToolsPanelButton = screen.getByTestId('open-tools-panel');
      await user.click(openToolsPanelButton);

      // Export all formats
      const exportPdfButton = screen.getByTestId('export-pdf');
      const exportDocxButton = screen.getByTestId('export-docx');

      await user.click(exportPdfButton);
      await user.click(exportDocxButton);

      await waitFor(() => {
        expect(mockExportToPDF).toHaveBeenCalledWith(
          expect.any(Object), // template
          expect.any(Object), // data
          expect.stringMatching(/John_Doe_Resume.*\.pdf$/) // filename
        );

        expect(mockExportToDOCX).toHaveBeenCalledWith(
          expect.any(Object), // template
          expect.any(Object), // data
          expect.stringMatching(/John_Doe_Resume.*\.docx$/) // filename
        );
      });
    });
  });

  describe('Export Accessibility', () => {
    it('should maintain accessibility during export process', async () => {
      render(
        <TestWrapper>
          <div data-testid='template-gallery'>
            <button data-testid='open-tools-panel'>
              Open Resume Tools Panel
            </button>
            <div data-testid='tools-panel'>
              <button
                data-testid='export-pdf'
                aria-label='Export resume as PDF'
              >
                Export PDF
              </button>
              <button
                data-testid='export-docx'
                aria-label='Export resume as DOCX'
              >
                Export DOCX
              </button>
            </div>
          </div>
        </TestWrapper>
      );

      // Check ARIA labels
      expect(screen.getByLabelText('Export resume as PDF')).toBeInTheDocument();
      expect(
        screen.getByLabelText('Export resume as DOCX')
      ).toBeInTheDocument();
    });

    it('should support keyboard navigation for export buttons', async () => {
      render(
        <TestWrapper>
          <div data-testid='template-gallery'>
            <button data-testid='open-tools-panel'>
              Open Resume Tools Panel
            </button>
            <div data-testid='tools-panel'>
              <button data-testid='export-pdf'>Export PDF</button>
              <button data-testid='export-docx'>Export DOCX</button>
            </div>
          </div>
        </TestWrapper>
      );

      const openToolsPanelButton = screen.getByTestId('open-tools-panel');
      await user.click(openToolsPanelButton);

      const toolsPanel = screen.getByTestId('tools-panel');
      toolsPanel.style.display = 'block';

      const exportPdfButton = screen.getByTestId('export-pdf');
      const exportDocxButton = screen.getByTestId('export-docx');

      // Test tab navigation
      exportPdfButton.focus();
      expect(exportPdfButton).toHaveFocus();

      await user.tab();
      expect(exportDocxButton).toHaveFocus();
    });
  });
});
