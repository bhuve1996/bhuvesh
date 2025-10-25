import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';

import { Button } from '@/components/atoms/Button/Button';
import { FileUpload } from '@/components/molecules/FileUpload/FileUpload';
import { FormField } from '@/components/molecules/FormField/FormField';
import { StatusBadge } from '@/components/molecules/StatusBadge/StatusBadge';
import { FloatingPanel } from '@/components/organisms/FloatingPanel/FloatingPanel';
import { ResumeData, ResumeTemplate } from '@/types/resume';

// Mock react-hot-toast
jest.mock('react-hot-toast', () => ({
  error: jest.fn(),
  success: jest.fn(),
}));

// Mock API calls
jest.mock('@/api/endpoints/ats', () => ({
  atsApi: {
    extractExperience: jest.fn().mockResolvedValue({
      success: true,
      data: { ats_score: 85, issues: [], suggestions: [] },
    }),
    getImprovementPlan: jest.fn().mockResolvedValue({
      success: true,
      data: { improvements: ['Improve keyword usage'] },
    }),
  },
}));

describe('Component Integration Tests', () => {
  const mockResumeData: ResumeData = {
    personal: {
      fullName: 'John Doe',
      email: 'john@example.com',
      phone: '123-456-7890',
      location: 'New York, NY',
    },
    summary: 'Experienced software developer',
    experience: [],
    skills: {
      technical: ['JavaScript', 'React'],
      business: ['Project Management'],
      soft: ['Communication'],
    },
  };

  const mockTemplate: ResumeTemplate = {
    id: 'template-1',
    name: 'Professional Template',
    category: 'business',
    preview: '/preview.jpg',
    config: {},
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Form with Button Integration', () => {
    it('should handle form submission with button', async () => {
      const user = userEvent.setup();
      const handleSubmit = jest.fn();

      render(
        <form onSubmit={handleSubmit}>
          <FormField label='Name' required>
            <input type='text' name='name' />
          </FormField>
          <Button type='submit'>Submit</Button>
        </form>
      );

      const input = screen.getByRole('textbox', { name: /name/i });
      const submitButton = screen.getByRole('button', { name: /submit/i });

      await user.type(input, 'John Doe');
      await user.click(submitButton);

      expect(handleSubmit).toHaveBeenCalled();
    });

    it('should show validation errors with status badges', () => {
      render(
        <div>
          <FormField label='Email' error='Invalid email format'>
            <input type='email' />
          </FormField>
          <StatusBadge status='error' icon='⚠️'>
            Validation Error
          </StatusBadge>
        </div>
      );

      expect(screen.getByText('Invalid email format')).toBeInTheDocument();
      expect(screen.getByText('Validation Error')).toBeInTheDocument();
    });
  });

  describe('FileUpload with StatusBadge Integration', () => {
    it('should show success status after file upload', async () => {
      const user = userEvent.setup();
      const onUpload = jest.fn();

      render(
        <div>
          <FileUpload onUpload={onUpload} />
          <StatusBadge status='success' icon='✅'>
            File uploaded successfully
          </StatusBadge>
        </div>
      );

      const file = new File(['test content'], 'test.pdf', {
        type: 'application/pdf',
      });
      const input = screen.getByLabelText(/upload resume file/i);

      await user.upload(input, file);

      const uploadButton = screen.getByText(/upload 1 file/i);
      await user.click(uploadButton);

      expect(onUpload).toHaveBeenCalledWith([file]);
      expect(
        screen.getByText('File uploaded successfully')
      ).toBeInTheDocument();
    });

    it('should show error status for invalid files', async () => {
      const user = userEvent.setup();
      const onError = jest.fn();

      render(
        <div>
          <FileUpload onUpload={jest.fn()} onError={onError} maxSize={1024} />
          <StatusBadge status='error' icon='❌'>
            File too large
          </StatusBadge>
        </div>
      );

      const file = new File(['test content'], 'test.pdf', {
        type: 'application/pdf',
      });
      Object.defineProperty(file, 'size', { value: 2048 }); // 2KB, exceeds 1KB limit

      const input = screen.getByLabelText(/upload resume file/i);
      await user.upload(input, file);

      expect(onError).toHaveBeenCalledWith(
        expect.stringContaining('File size exceeds')
      );
      expect(screen.getByText('File too large')).toBeInTheDocument();
    });
  });

  describe('FloatingPanel Integration', () => {
    it('should integrate with all tab components', async () => {
      const user = userEvent.setup();
      const onResumeDataUpdate = jest.fn();
      const onTemplateChange = jest.fn();

      render(
        <FloatingPanel
          resumeData={mockResumeData}
          template={mockTemplate}
          onResumeDataUpdate={onResumeDataUpdate}
          onTemplateChange={onTemplateChange}
        />
      );

      // Open panel
      const floatingButton = screen.getByText('Quick Actions');
      await user.click(floatingButton);

      // Test all tabs are accessible
      expect(screen.getByText('ATS Analysis')).toBeInTheDocument();
      expect(screen.getByText('AI Content')).toBeInTheDocument();
      expect(screen.getByText('Customize')).toBeInTheDocument();
      expect(screen.getByText('Validate')).toBeInTheDocument();
      expect(screen.getAllByText('Export').length).toBeGreaterThan(0);
    });

    it('should handle tab switching with proper state management', async () => {
      const user = userEvent.setup();

      render(
        <FloatingPanel
          resumeData={mockResumeData}
          template={mockTemplate}
          onResumeDataUpdate={jest.fn()}
          onTemplateChange={jest.fn()}
        />
      );

      // Open panel
      const floatingButton = screen.getByText('Quick Actions');
      await user.click(floatingButton);

      // Switch between tabs
      const aiContentTab = screen.getByText('AI Content');
      await user.click(aiContentTab);
      expect(screen.getByText('AI Content')).toBeInTheDocument();

      const customizeTab = screen.getByText('Customize');
      await user.click(customizeTab);
      // Just verify the customize tab is clickable and the panel is still open
      expect(screen.getByText('Customize')).toBeInTheDocument();
    });
  });

  describe('Complete Form Workflow', () => {
    it('should handle complete form workflow with validation and status updates', async () => {
      const user = userEvent.setup();
      const handleSubmit = jest.fn();

      const TestForm = () => {
        const [isSubmitting, setIsSubmitting] = React.useState(false);
        const [status, setStatus] = React.useState<
          'idle' | 'success' | 'error'
        >('idle');
        const handleFormSubmit = async (e: React.FormEvent) => {
          e.preventDefault();
          setIsSubmitting(true);

          try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 100));
            setStatus('success');
            handleSubmit();
          } catch (_error) {
            setStatus('error');
          } finally {
            setIsSubmitting(false);
          }
        };

        return (
          <form onSubmit={handleFormSubmit}>
            <FormField label='Name' required>
              <input type='text' name='name' required />
            </FormField>
            <FormField label='Email' required>
              <input type='email' name='email' required />
            </FormField>
            <Button type='submit' loading={isSubmitting}>
              {isSubmitting ? 'Submitting...' : 'Submit'}
            </Button>
            {status === 'success' && (
              <StatusBadge status='success' icon='✅'>
                Form submitted successfully
              </StatusBadge>
            )}
            {status === 'error' && (
              <StatusBadge status='error' icon='❌'>
                Submission failed
              </StatusBadge>
            )}
          </form>
        );
      };

      render(<TestForm />);

      const nameInput = screen.getByRole('textbox', { name: /name/i });
      const emailInput = screen.getByRole('textbox', { name: /email/i });
      const submitButton = screen.getByRole('button', { name: /submit/i });

      await user.type(nameInput, 'John Doe');
      await user.type(emailInput, 'john@example.com');
      await user.click(submitButton);

      expect(screen.getByText('Submitting...')).toBeInTheDocument();

      await waitFor(() => {
        expect(
          screen.getByText('Form submitted successfully')
        ).toBeInTheDocument();
      });

      expect(handleSubmit).toHaveBeenCalled();
    });
  });

  describe('Component State Management', () => {
    it('should handle complex state interactions between components', async () => {
      const user = userEvent.setup();

      const TestComponent = () => {
        const [file, setFile] = React.useState<File | null>(null);
        const [isAnalyzing, setIsAnalyzing] = React.useState(false);
        const [analysisResult, setAnalysisResult] = React.useState<{
          score: number;
          status: 'success' | 'error' | 'idle';
        }>({ score: 0, status: 'idle' });
        const handleFileUpload = (files: File[]) => {
          setFile(files[0]);
        };

        const handleAnalysis = async () => {
          if (!file) return;

          setIsAnalyzing(true);
          try {
            // Simulate analysis
            await new Promise(resolve => setTimeout(resolve, 100));
            setAnalysisResult({ score: 85, status: 'success' });
          } catch (_error) {
            setAnalysisResult({ score: 0, status: 'error' });
          } finally {
            setIsAnalyzing(false);
          }
        };

        return (
          <div>
            <FileUpload onUpload={handleFileUpload} />
            {file && (
              <div>
                <p>File: {file.name}</p>
                <Button onClick={handleAnalysis} loading={isAnalyzing}>
                  Analyze
                </Button>
                {analysisResult.status === 'success' && (
                  <StatusBadge status='success'>
                    Score: {analysisResult.score}/100
                  </StatusBadge>
                )}
                {analysisResult.status === 'error' && (
                  <StatusBadge status='error'>Analysis failed</StatusBadge>
                )}
              </div>
            )}
          </div>
        );
      };

      render(<TestComponent />);

      // Upload file
      const testFile = new File(['test content'], 'test.pdf', {
        type: 'application/pdf',
      });
      const input = screen.getByLabelText(/upload resume file/i);
      await user.upload(input, testFile);

      const uploadButton = screen.getByText(/upload 1 file/i);
      await user.click(uploadButton);

      expect(screen.getByText('File: test.pdf')).toBeInTheDocument();

      // Analyze file
      const analyzeButton = screen.getByRole('button', { name: /analyze/i });
      await user.click(analyzeButton);

      expect(
        screen.getByRole('button', { name: /loading/i })
      ).toBeInTheDocument();

      await waitFor(() => {
        expect(screen.getByText('Score: 85/100')).toBeInTheDocument();
      });
    });
  });
});
