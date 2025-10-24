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
      action
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
      action
    ) => state,
  },
});

// Mock export utilities
const mockExportToPDFViaBrowserPrint = jest.fn();
const mockExportToDOCXViaDownload = jest.fn();
const mockExportToTXT = jest.fn();

jest.mock('@/lib/resume/unifiedExportUtils', () => ({
  exportToPDFViaBrowserPrint: mockExportToPDFViaBrowserPrint,
  exportToDOCXViaDownload: mockExportToDOCXViaDownload,
}));

jest.mock('@/lib/resume/exportUtils', () => ({
  exportToTXT: mockExportToTXT,
}));

// Mock the resume components
jest.mock('@/components/resume/TemplateGallery/TemplateGallery', () => {
  return function MockTemplateGallery() {
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
        <button data-testid='open-tools-panel'>Open Resume Tools Panel</button>
        <div data-testid='tools-panel' style={{ display: 'none' }}>
          <button data-testid='export-pdf'>Export PDF</button>
          <button data-testid='export-docx'>Export DOCX</button>
          <button data-testid='export-txt'>Export TXT</button>
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
    mockExportToPDFViaBrowserPrint.mockResolvedValue(true);
    mockExportToDOCXViaDownload.mockResolvedValue(true);
    mockExportToTXT.mockResolvedValue(true);
  });

  describe('PDF Export', () => {
    it('should export resume as PDF successfully', async () => {
      render(
        <TestWrapper>
          <div data-testid='template-gallery'>
            <button data-testid='open-tools-panel'>
              Open Resume Tools Panel
            </button>
            <div data-testid='tools-panel'>
              <button data-testid='export-pdf'>Export PDF</button>
              <div data-testid='export-status'></div>
            </div>
          </div>
        </TestWrapper>
      );

      // Open tools panel
      const openToolsPanelButton = screen.getByTestId('open-tools-panel');
      await user.click(openToolsPanelButton);

      // Show tools panel
      const toolsPanel = screen.getByTestId('tools-panel');
      toolsPanel.style.display = 'block';

      // Export PDF
      const exportPdfButton = screen.getByTestId('export-pdf');
      await user.click(exportPdfButton);

      // Verify export was called
      await waitFor(() => {
        expect(mockExportToPDFViaBrowserPrint).toHaveBeenCalledWith(
          expect.any(HTMLElement),
          expect.objectContaining({
            filename: expect.stringContaining('John_Doe_Resume'),
            title: 'Test Resume',
          })
        );
      });
    });

    it('should handle PDF export loading state', async () => {
      // Mock delayed export
      mockExportToPDFViaBrowserPrint.mockImplementation(
        () => new Promise(resolve => setTimeout(() => resolve(true), 1000))
      );

      render(
        <TestWrapper>
          <div data-testid='template-gallery'>
            <button data-testid='open-tools-panel'>
              Open Resume Tools Panel
            </button>
            <div data-testid='tools-panel'>
              <button data-testid='export-pdf'>Export PDF</button>
              <div data-testid='export-status'></div>
            </div>
          </div>
        </TestWrapper>
      );

      const openToolsPanelButton = screen.getByTestId('open-tools-panel');
      await user.click(openToolsPanelButton);

      const toolsPanel = screen.getByTestId('tools-panel');
      toolsPanel.style.display = 'block';

      const exportPdfButton = screen.getByTestId('export-pdf');
      await user.click(exportPdfButton);

      // Should show loading state
      expect(exportPdfButton).toHaveTextContent('Loading...');
      expect(exportPdfButton).toBeDisabled();
    });

    it('should handle PDF export errors gracefully', async () => {
      mockExportToPDFViaBrowserPrint.mockRejectedValue(
        new Error('Export failed')
      );

      render(
        <TestWrapper>
          <div data-testid='template-gallery'>
            <button data-testid='open-tools-panel'>
              Open Resume Tools Panel
            </button>
            <div data-testid='tools-panel'>
              <button data-testid='export-pdf'>Export PDF</button>
              <div data-testid='export-status'></div>
            </div>
          </div>
        </TestWrapper>
      );

      const openToolsPanelButton = screen.getByTestId('open-tools-panel');
      await user.click(openToolsPanelButton);

      const toolsPanel = screen.getByTestId('tools-panel');
      toolsPanel.style.display = 'block';

      const exportPdfButton = screen.getByTestId('export-pdf');
      await user.click(exportPdfButton);

      // Should handle error gracefully
      await waitFor(() => {
        expect(mockExportToPDFViaBrowserPrint).toHaveBeenCalled();
      });
    });
  });

  describe('DOCX Export', () => {
    it('should export resume as DOCX successfully', async () => {
      render(
        <TestWrapper>
          <div data-testid='template-gallery'>
            <button data-testid='open-tools-panel'>
              Open Resume Tools Panel
            </button>
            <div data-testid='tools-panel'>
              <button data-testid='export-docx'>Export DOCX</button>
              <div data-testid='export-status'></div>
            </div>
          </div>
        </TestWrapper>
      );

      const openToolsPanelButton = screen.getByTestId('open-tools-panel');
      await user.click(openToolsPanelButton);

      const toolsPanel = screen.getByTestId('tools-panel');
      toolsPanel.style.display = 'block';

      const exportDocxButton = screen.getByTestId('export-docx');
      await user.click(exportDocxButton);

      await waitFor(() => {
        expect(mockExportToDOCXViaDownload).toHaveBeenCalledWith(
          expect.any(HTMLElement),
          expect.objectContaining({
            filename: expect.stringContaining('John_Doe_Resume'),
            title: 'Test Resume',
          })
        );
      });
    });

    it('should handle DOCX export loading state', async () => {
      mockExportToDOCXViaDownload.mockImplementation(
        () => new Promise(resolve => setTimeout(() => resolve(true), 1000))
      );

      render(
        <TestWrapper>
          <div data-testid='template-gallery'>
            <button data-testid='open-tools-panel'>
              Open Resume Tools Panel
            </button>
            <div data-testid='tools-panel'>
              <button data-testid='export-docx'>Export DOCX</button>
              <div data-testid='export-status'></div>
            </div>
          </div>
        </TestWrapper>
      );

      const openToolsPanelButton = screen.getByTestId('open-tools-panel');
      await user.click(openToolsPanelButton);

      const toolsPanel = screen.getByTestId('tools-panel');
      toolsPanel.style.display = 'block';

      const exportDocxButton = screen.getByTestId('export-docx');
      await user.click(exportDocxButton);

      expect(exportDocxButton).toHaveTextContent('Loading...');
      expect(exportDocxButton).toBeDisabled();
    });
  });

  describe('TXT Export', () => {
    it('should export resume as TXT successfully', async () => {
      render(
        <TestWrapper>
          <div data-testid='template-gallery'>
            <button data-testid='open-tools-panel'>
              Open Resume Tools Panel
            </button>
            <div data-testid='tools-panel'>
              <button data-testid='export-txt'>Export TXT</button>
              <div data-testid='export-status'></div>
            </div>
          </div>
        </TestWrapper>
      );

      const openToolsPanelButton = screen.getByTestId('open-tools-panel');
      await user.click(openToolsPanelButton);

      const toolsPanel = screen.getByTestId('tools-panel');
      toolsPanel.style.display = 'block';

      const exportTxtButton = screen.getByTestId('export-txt');
      await user.click(exportTxtButton);

      await waitFor(() => {
        expect(mockExportToTXT).toHaveBeenCalledWith(
          expect.objectContaining({
            personalInfo: expect.objectContaining({
              fullName: 'John Doe',
              email: 'john.doe@email.com',
            }),
            workExperience: expect.arrayContaining([
              expect.objectContaining({
                company: 'Tech Corp',
                position: 'Senior Software Engineer',
              }),
            ]),
          }),
          expect.objectContaining({
            filename: expect.stringContaining('John_Doe_Resume'),
          })
        );
      });
    });
  });

  describe('Export with Custom Styling', () => {
    it('should export with custom color scheme', async () => {
      const customStore = configureStore({
        reducer: {
          resume: (
            state = {
              currentResume: {
                id: '1',
                title: 'Test Resume',
                personalInfo: { fullName: 'John Doe', email: 'john@email.com' },
              },
            },
            action
          ) => state,
          resumeStyling: (
            state = {
              global: { colorScheme: 'green' },
              sections: {
                header: { backgroundColor: '#10b981', textColor: '#ffffff' },
              },
            },
            action
          ) => state,
        },
      });

      render(
        <Provider store={customStore}>
          <div data-testid='template-gallery'>
            <button data-testid='open-tools-panel'>
              Open Resume Tools Panel
            </button>
            <div data-testid='tools-panel'>
              <button data-testid='export-pdf'>Export PDF</button>
            </div>
          </div>
        </Provider>
      );

      const openToolsPanelButton = screen.getByTestId('open-tools-panel');
      await user.click(openToolsPanelButton);

      const toolsPanel = screen.getByTestId('tools-panel');
      toolsPanel.style.display = 'block';

      const exportPdfButton = screen.getByTestId('export-pdf');
      await user.click(exportPdfButton);

      await waitFor(() => {
        expect(mockExportToPDFViaBrowserPrint).toHaveBeenCalled();
      });
    });

    it('should export with custom font settings', async () => {
      const customStore = configureStore({
        reducer: {
          resume: (
            state = {
              currentResume: {
                id: '1',
                title: 'Test Resume',
                personalInfo: { fullName: 'John Doe', email: 'john@email.com' },
              },
            },
            action
          ) => state,
          resumeStyling: (
            state = {
              global: {
                fontFamily: 'Times New Roman',
                fontSize: 16,
                spacing: 'spacious',
              },
            },
            action
          ) => state,
        },
      });

      render(
        <Provider store={customStore}>
          <div data-testid='template-gallery'>
            <button data-testid='open-tools-panel'>
              Open Resume Tools Panel
            </button>
            <div data-testid='tools-panel'>
              <button data-testid='export-docx'>Export DOCX</button>
            </div>
          </div>
        </Provider>
      );

      const openToolsPanelButton = screen.getByTestId('open-tools-panel');
      await user.click(openToolsPanelButton);

      const toolsPanel = screen.getByTestId('tools-panel');
      toolsPanel.style.display = 'block';

      const exportDocxButton = screen.getByTestId('export-docx');
      await user.click(exportDocxButton);

      await waitFor(() => {
        expect(mockExportToDOCXViaDownload).toHaveBeenCalled();
      });
    });
  });

  describe('Export Filename Generation', () => {
    it('should generate appropriate filenames for different formats', async () => {
      render(
        <TestWrapper>
          <div data-testid='template-gallery'>
            <button data-testid='open-tools-panel'>
              Open Resume Tools Panel
            </button>
            <div data-testid='tools-panel'>
              <button data-testid='export-pdf'>Export PDF</button>
              <button data-testid='export-docx'>Export DOCX</button>
              <button data-testid='export-txt'>Export TXT</button>
            </div>
          </div>
        </TestWrapper>
      );

      const openToolsPanelButton = screen.getByTestId('open-tools-panel');
      await user.click(openToolsPanelButton);

      const toolsPanel = screen.getByTestId('tools-panel');
      toolsPanel.style.display = 'block';

      // Export all formats
      const exportPdfButton = screen.getByTestId('export-pdf');
      const exportDocxButton = screen.getByTestId('export-docx');
      const exportTxtButton = screen.getByTestId('export-txt');

      await user.click(exportPdfButton);
      await user.click(exportDocxButton);
      await user.click(exportTxtButton);

      await waitFor(() => {
        expect(mockExportToPDFViaBrowserPrint).toHaveBeenCalledWith(
          expect.any(HTMLElement),
          expect.objectContaining({
            filename: expect.stringMatching(/John_Doe_Resume.*\.pdf$/),
          })
        );

        expect(mockExportToDOCXViaDownload).toHaveBeenCalledWith(
          expect.any(HTMLElement),
          expect.objectContaining({
            filename: expect.stringMatching(/John_Doe_Resume.*\.docx$/),
          })
        );

        expect(mockExportToTXT).toHaveBeenCalledWith(
          expect.any(Object),
          expect.objectContaining({
            filename: expect.stringMatching(/John_Doe_Resume.*\.txt$/),
          })
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
              <button
                data-testid='export-txt'
                aria-label='Export resume as TXT'
              >
                Export TXT
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
      expect(screen.getByLabelText('Export resume as TXT')).toBeInTheDocument();
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
              <button data-testid='export-txt'>Export TXT</button>
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
      const exportTxtButton = screen.getByTestId('export-txt');

      // Test tab navigation
      exportPdfButton.focus();
      expect(exportPdfButton).toHaveFocus();

      await user.tab();
      expect(exportDocxButton).toHaveFocus();

      await user.tab();
      expect(exportTxtButton).toHaveFocus();
    });
  });
});
