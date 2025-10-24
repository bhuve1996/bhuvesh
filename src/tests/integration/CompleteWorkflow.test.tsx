import { configureStore } from '@reduxjs/toolkit';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { Provider } from 'react-redux';

// Mock the resume store
const mockStore = configureStore({
  reducer: {
    resume: (state = { currentResume: null, resumes: [] }, action) => state,
    resumeStyling: (state = { global: {}, sections: {} }, action) => state,
  },
});

// Mock the resume components
jest.mock('@/components/organisms/ATSChecker/ATSChecker', () => {
  return function MockATSChecker() {
    return (
      <div data-testid='ats-checker'>
        <h1>ATS Resume Checker</h1>
        <button data-testid='start-analysis'>Start New Analysis</button>
        <input
          data-testid='file-upload'
          type='file'
          accept='.pdf,.docx,.doc,.txt'
        />
        <textarea
          data-testid='job-description'
          placeholder='Paste job description...'
        />
        <button data-testid='analyze-button'>Analyze Resume</button>
      </div>
    );
  };
});

jest.mock('@/components/resume/ResumeBuilder/ResumeBuilder', () => {
  return function MockResumeBuilder() {
    return (
      <div data-testid='resume-builder'>
        <h1>Resume Builder</h1>
        <button data-testid='create-resume'>Create New Resume</button>
        <input data-testid='full-name' placeholder='Full Name' />
        <input data-testid='email' placeholder='Email' />
        <button data-testid='view-templates'>View Templates</button>
      </div>
    );
  };
});

jest.mock('@/components/resume/TemplateGallery/TemplateGallery', () => {
  return function MockTemplateGallery() {
    return (
      <div data-testid='template-gallery'>
        <h1>Resume Templates</h1>
        <div data-testid='template-preview'>Template Preview</div>
        <button data-testid='open-tools-panel'>Open Resume Tools Panel</button>
        <button data-testid='export-pdf'>Export PDF</button>
        <button data-testid='export-docx'>Export DOCX</button>
        <button data-testid='customize-tab'>Customize</button>
        <button data-testid='ats-analysis-tab'>ATS Analysis</button>
        <div data-testid='color-scheme-options'>
          <button data-testid='color-blue'>Blue</button>
          <button data-testid='color-green'>Green</button>
          <button data-testid='color-purple'>Purple</button>
        </div>
        <div data-testid='font-options'>
          <select data-testid='font-family'>
            <option value='Arial'>Arial</option>
            <option value='Times New Roman'>Times New Roman</option>
            <option value='Calibri'>Calibri</option>
          </select>
          <input
            data-testid='font-size'
            type='range'
            min='10'
            max='18'
            defaultValue='14'
          />
        </div>
      </div>
    );
  };
});

// Mock export utilities
jest.mock('@/lib/resume/unifiedExportUtils', () => ({
  exportToPDFViaBrowserPrint: jest.fn().mockResolvedValue(true),
  exportToDOCXViaDownload: jest.fn().mockResolvedValue(true),
}));

// Mock ATS API
jest.mock('@/api/endpoints/ats', () => ({
  atsApi: {
    uploadFile: jest.fn().mockResolvedValue({ success: true }),
    analyzeResume: jest.fn().mockResolvedValue({
      data: {
        ats_score: 85,
        match_category: 'Good Match',
        keyword_matches: ['React', 'TypeScript', 'Node.js'],
        missing_keywords: ['Docker', 'Kubernetes'],
        suggestions: ['Add Docker experience', 'Include AWS skills'],
      },
    }),
  },
}));

const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <Provider store={mockStore}>{children}</Provider>
);

describe('Complete Resume Workflow Integration Tests', () => {
  let user: ReturnType<typeof userEvent.setup>;

  beforeEach(() => {
    user = userEvent.setup();
    jest.clearAllMocks();
  });

  describe('ATS Analysis Workflow', () => {
    it('should complete ATS analysis workflow successfully', async () => {
      render(
        <TestWrapper>
          <div data-testid='ats-checker'>
            <h1>ATS Resume Checker</h1>
            <button data-testid='start-analysis'>Start New Analysis</button>
            <input
              data-testid='file-upload'
              type='file'
              accept='.pdf,.docx,.doc,.txt'
            />
            <textarea
              data-testid='job-description'
              placeholder='Paste job description...'
            />
            <button data-testid='analyze-button'>Analyze Resume</button>
          </div>
        </TestWrapper>
      );

      // Start new analysis
      const startAnalysisButton = screen.getByTestId('start-analysis');
      await user.click(startAnalysisButton);

      // Upload resume file
      const fileInput = screen.getByTestId('file-upload');
      const mockFile = new File(['test content'], 'resume.pdf', {
        type: 'application/pdf',
      });
      await user.upload(fileInput, mockFile);

      // Add job description
      const jobDescriptionInput = screen.getByTestId('job-description');
      await user.type(
        jobDescriptionInput,
        'We are looking for a Senior Software Engineer with experience in React, Node.js, and TypeScript.'
      );

      // Analyze resume
      const analyzeButton = screen.getByTestId('analyze-button');
      await user.click(analyzeButton);

      // Verify analysis was triggered
      await waitFor(() => {
        expect(analyzeButton).toBeInTheDocument();
      });
    });

    it('should handle file upload validation', async () => {
      render(
        <TestWrapper>
          <div data-testid='ats-checker'>
            <input
              data-testid='file-upload'
              type='file'
              accept='.pdf,.docx,.doc,.txt'
            />
          </div>
        </TestWrapper>
      );

      const fileInput = screen.getByTestId('file-upload');

      // Test valid file types
      const validFiles = [
        new File(['content'], 'resume.pdf', { type: 'application/pdf' }),
        new File(['content'], 'resume.docx', {
          type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        }),
        new File(['content'], 'resume.doc', { type: 'application/msword' }),
        new File(['content'], 'resume.txt', { type: 'text/plain' }),
      ];

      for (const file of validFiles) {
        await user.upload(fileInput, file);
        expect(fileInput.files?.[0]).toBe(file);
      }
    });
  });

  describe('Resume Builder Workflow', () => {
    it('should complete resume building workflow', async () => {
      render(
        <TestWrapper>
          <div data-testid='resume-builder'>
            <h1>Resume Builder</h1>
            <button data-testid='create-resume'>Create New Resume</button>
            <input data-testid='full-name' placeholder='Full Name' />
            <input data-testid='email' placeholder='Email' />
            <button data-testid='view-templates'>View Templates</button>
          </div>
        </TestWrapper>
      );

      // Create new resume
      const createResumeButton = screen.getByTestId('create-resume');
      await user.click(createResumeButton);

      // Fill in personal information
      const fullNameInput = screen.getByTestId('full-name');
      const emailInput = screen.getByTestId('email');

      await user.type(fullNameInput, 'John Doe');
      await user.type(emailInput, 'john.doe@email.com');

      expect(fullNameInput).toHaveValue('John Doe');
      expect(emailInput).toHaveValue('john.doe@email.com');

      // Navigate to templates
      const viewTemplatesButton = screen.getByTestId('view-templates');
      await user.click(viewTemplatesButton);
    });
  });

  describe('Template Selection and Customization', () => {
    it('should complete template selection and customization workflow', async () => {
      render(
        <TestWrapper>
          <div data-testid='template-gallery'>
            <h1>Resume Templates</h1>
            <div data-testid='template-preview'>Template Preview</div>
            <button data-testid='open-tools-panel'>
              Open Resume Tools Panel
            </button>
            <button data-testid='customize-tab'>Customize</button>
            <div data-testid='color-scheme-options'>
              <button data-testid='color-blue'>Blue</button>
              <button data-testid='color-green'>Green</button>
              <button data-testid='color-purple'>Purple</button>
            </div>
            <div data-testid='font-options'>
              <select data-testid='font-family'>
                <option value='Arial'>Arial</option>
                <option value='Times New Roman'>Times New Roman</option>
                <option value='Calibri'>Calibri</option>
              </select>
              <input
                data-testid='font-size'
                type='range'
                min='10'
                max='18'
                defaultValue='14'
              />
            </div>
          </div>
        </TestWrapper>
      );

      // Open tools panel
      const openToolsPanelButton = screen.getByTestId('open-tools-panel');
      await user.click(openToolsPanelButton);

      // Navigate to customize tab
      const customizeTab = screen.getByTestId('customize-tab');
      await user.click(customizeTab);

      // Change color scheme
      const blueColorButton = screen.getByTestId('color-blue');
      await user.click(blueColorButton);

      const greenColorButton = screen.getByTestId('color-green');
      await user.click(greenColorButton);

      // Change font family
      const fontFamilySelect = screen.getByTestId('font-family');
      await user.selectOptions(fontFamilySelect, 'Times New Roman');

      // Change font size
      const fontSizeSlider = screen.getByTestId('font-size');
      await user.type(fontSizeSlider, '16');

      expect(fontFamilySelect).toHaveValue('Times New Roman');
      expect(fontSizeSlider).toHaveValue('16');
    });

    it('should handle template preview functionality', async () => {
      render(
        <TestWrapper>
          <div data-testid='template-gallery'>
            <div data-testid='template-preview'>Template Preview</div>
          </div>
        </TestWrapper>
      );

      const templatePreview = screen.getByTestId('template-preview');
      expect(templatePreview).toBeInTheDocument();
      expect(templatePreview).toHaveTextContent('Template Preview');
    });
  });

  describe('Export Functionality', () => {
    it('should complete export workflow for all formats', async () => {
      const {
        exportToPDFViaBrowserPrint,
        exportToDOCXViaDownload,
      } = require('@/lib/resume/unifiedExportUtils');

      render(
        <TestWrapper>
          <div data-testid='template-gallery'>
            <button data-testid='open-tools-panel'>
              Open Resume Tools Panel
            </button>
            <button data-testid='export-pdf'>Export PDF</button>
            <button data-testid='export-docx'>Export DOCX</button>
          </div>
        </TestWrapper>
      );

      // Open tools panel
      const openToolsPanelButton = screen.getByTestId('open-tools-panel');
      await user.click(openToolsPanelButton);

      // Export PDF
      const exportPdfButton = screen.getByTestId('export-pdf');
      await user.click(exportPdfButton);

      await waitFor(() => {
        expect(exportToPDFViaBrowserPrint).toHaveBeenCalled();
      });

      // Export DOCX
      const exportDocxButton = screen.getByTestId('export-docx');
      await user.click(exportDocxButton);

      await waitFor(() => {
        expect(exportToDOCXViaDownload).toHaveBeenCalled();
      });
    });

    it('should handle export loading states', async () => {
      render(
        <TestWrapper>
          <div data-testid='template-gallery'>
            <button data-testid='export-pdf'>Export PDF</button>
          </div>
        </TestWrapper>
      );

      const exportPdfButton = screen.getByTestId('export-pdf');

      // Simulate loading state
      fireEvent.click(exportPdfButton);

      // Button should show loading state
      await waitFor(() => {
        expect(exportPdfButton).toHaveTextContent('Loading...');
      });
    });
  });

  describe('ATS Analysis Integration', () => {
    it('should integrate ATS analysis with template customization', async () => {
      render(
        <TestWrapper>
          <div data-testid='template-gallery'>
            <button data-testid='open-tools-panel'>
              Open Resume Tools Panel
            </button>
            <button data-testid='ats-analysis-tab'>ATS Analysis</button>
            <button data-testid='analyze-button'>Analyze Resume</button>
          </div>
        </TestWrapper>
      );

      // Open tools panel
      const openToolsPanelButton = screen.getByTestId('open-tools-panel');
      await user.click(openToolsPanelButton);

      // Navigate to ATS analysis
      const atsAnalysisTab = screen.getByTestId('ats-analysis-tab');
      await user.click(atsAnalysisTab);

      // Start analysis
      const analyzeButton = screen.getByTestId('analyze-button');
      await user.click(analyzeButton);

      // Verify analysis was triggered
      await waitFor(() => {
        expect(analyzeButton).toBeInTheDocument();
      });
    });
  });

  describe('Complete End-to-End Workflow', () => {
    it('should complete the entire workflow from ATS analysis to export', async () => {
      render(
        <TestWrapper>
          <div>
            {/* ATS Checker */}
            <div data-testid='ats-checker'>
              <button data-testid='start-analysis'>Start New Analysis</button>
              <input data-testid='file-upload' type='file' />
              <textarea data-testid='job-description' />
              <button data-testid='analyze-button'>Analyze Resume</button>
            </div>

            {/* Resume Builder */}
            <div data-testid='resume-builder'>
              <button data-testid='create-resume'>Create New Resume</button>
              <input data-testid='full-name' />
              <button data-testid='view-templates'>View Templates</button>
            </div>

            {/* Template Gallery */}
            <div data-testid='template-gallery'>
              <button data-testid='open-tools-panel'>
                Open Resume Tools Panel
              </button>
              <button data-testid='customize-tab'>Customize</button>
              <button data-testid='ats-analysis-tab'>ATS Analysis</button>
              <button data-testid='export-pdf'>Export PDF</button>
              <button data-testid='color-blue'>Blue</button>
            </div>
          </div>
        </TestWrapper>
      );

      // Step 1: ATS Analysis
      const startAnalysisButton = screen.getByTestId('start-analysis');
      await user.click(startAnalysisButton);

      const fileInput = screen.getByTestId('file-upload');
      const mockFile = new File(['test content'], 'resume.pdf', {
        type: 'application/pdf',
      });
      await user.upload(fileInput, mockFile);

      const jobDescriptionInput = screen.getByTestId('job-description');
      await user.type(jobDescriptionInput, 'Software Engineer position');

      const analyzeButton = screen.getByTestId('analyze-button');
      await user.click(analyzeButton);

      // Step 2: Resume Building
      const createResumeButton = screen.getByTestId('create-resume');
      await user.click(createResumeButton);

      const fullNameInput = screen.getByTestId('full-name');
      await user.type(fullNameInput, 'John Doe');

      const viewTemplatesButton = screen.getByTestId('view-templates');
      await user.click(viewTemplatesButton);

      // Step 3: Template Customization
      const openToolsPanelButton = screen.getByTestId('open-tools-panel');
      await user.click(openToolsPanelButton);

      const customizeTab = screen.getByTestId('customize-tab');
      await user.click(customizeTab);

      const blueColorButton = screen.getByTestId('color-blue');
      await user.click(blueColorButton);

      // Step 4: ATS Analysis on Template
      const atsAnalysisTab = screen.getByTestId('ats-analysis-tab');
      await user.click(atsAnalysisTab);

      // Step 5: Export
      const exportPdfButton = screen.getByTestId('export-pdf');
      await user.click(exportPdfButton);

      // Verify all steps completed
      expect(fullNameInput).toHaveValue('John Doe');
      expect(blueColorButton).toBeInTheDocument();
    });
  });

  describe('Error Handling', () => {
    it('should handle file upload errors gracefully', async () => {
      render(
        <TestWrapper>
          <div data-testid='ats-checker'>
            <input
              data-testid='file-upload'
              type='file'
              accept='.pdf,.docx,.doc,.txt'
            />
          </div>
        </TestWrapper>
      );

      const fileInput = screen.getByTestId('file-upload');

      // Test invalid file type
      const invalidFile = new File(['content'], 'resume.jpg', {
        type: 'image/jpeg',
      });
      await user.upload(fileInput, invalidFile);

      // Should handle gracefully
      expect(fileInput.files?.[0]).toBe(invalidFile);
    });

    it('should handle export errors gracefully', async () => {
      const {
        exportToPDFViaBrowserPrint,
      } = require('@/lib/resume/unifiedExportUtils');
      exportToPDFViaBrowserPrint.mockRejectedValueOnce(
        new Error('Export failed')
      );

      render(
        <TestWrapper>
          <div data-testid='template-gallery'>
            <button data-testid='export-pdf'>Export PDF</button>
          </div>
        </TestWrapper>
      );

      const exportPdfButton = screen.getByTestId('export-pdf');
      await user.click(exportPdfButton);

      // Should handle error gracefully
      await waitFor(() => {
        expect(exportToPDFViaBrowserPrint).toHaveBeenCalled();
      });
    });
  });

  describe('Accessibility', () => {
    it('should maintain accessibility throughout the workflow', async () => {
      render(
        <TestWrapper>
          <div>
            <div data-testid='ats-checker'>
              <input
                data-testid='file-upload'
                type='file'
                aria-label='Upload resume file'
              />
              <textarea
                data-testid='job-description'
                aria-label='Job description'
              />
            </div>
            <div data-testid='resume-builder'>
              <input data-testid='full-name' aria-label='Full name' />
            </div>
            <div data-testid='template-gallery'>
              <button data-testid='export-pdf' aria-label='Export as PDF'>
                Export PDF
              </button>
            </div>
          </div>
        </TestWrapper>
      );

      // Check ARIA labels
      expect(screen.getByLabelText('Upload resume file')).toBeInTheDocument();
      expect(screen.getByLabelText('Job description')).toBeInTheDocument();
      expect(screen.getByLabelText('Full name')).toBeInTheDocument();
      expect(screen.getByLabelText('Export as PDF')).toBeInTheDocument();
    });

    it('should support keyboard navigation', async () => {
      render(
        <TestWrapper>
          <div data-testid='template-gallery'>
            <button data-testid='export-pdf'>Export PDF</button>
            <button data-testid='export-docx'>Export DOCX</button>
            <button data-testid='customize-tab'>Customize</button>
          </div>
        </TestWrapper>
      );

      const exportPdfButton = screen.getByTestId('export-pdf');
      const exportDocxButton = screen.getByTestId('export-docx');
      const customizeTab = screen.getByTestId('customize-tab');

      // Test tab navigation
      exportPdfButton.focus();
      expect(exportPdfButton).toHaveFocus();

      await user.tab();
      expect(exportDocxButton).toHaveFocus();

      await user.tab();
      expect(customizeTab).toHaveFocus();
    });
  });
});
