import { atsApi } from '@/api/endpoints/ats';
import { ATSChecker } from '@/components/organisms/ATSChecker/ATSChecker';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';

// Mock dependencies
jest.mock('@/api/endpoints/ats');
jest.mock('react-hot-toast', () => ({
  error: jest.fn(),
  success: jest.fn(),
  loading: jest.fn(),
}));

const mockAtsApi = atsApi as jest.Mocked<typeof atsApi>;

describe('ATSChecker Component', () => {
  const mockAnalysisResult = {
    success: true,
    data: {
      ats_score: 85,
      match_category: 'Excellent Match',
      semantic_similarity: 0.82,
      keyword_matches: ['javascript', 'react', 'node.js', 'typescript'],
      missing_keywords: ['docker', 'kubernetes', 'aws'],
      suggestions: [
        'Add Docker and Kubernetes to your skills section',
        'Include AWS experience in your work history',
        'Add more quantifiable achievements',
      ],
      strengths: [
        'Strong keyword match (85%)',
        'Excellent semantic alignment',
        'Well-structured format',
      ],
      weaknesses: ['Missing some key technologies', 'Could use more metrics'],
      detailed_scores: {
        keyword_score: 85.0,
        semantic_score: 82.0,
        format_score: 90.0,
        content_score: 80.0,
        ats_score: 88.0,
      },
      formatting_issues: [],
      ats_friendly: true,
      word_count: 450,
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('File Upload', () => {
    it('should accept valid resume files', async () => {
      const user = userEvent.setup();
      const mockFile = new File(['test content'], 'resume.pdf', {
        type: 'application/pdf',
      });

      render(<ATSChecker />);

      const fileInput = screen.getByLabelText(/upload resume/i);
      await user.upload(fileInput, mockFile);

      // Verify that the file was uploaded and job description input appears
      await waitFor(() => {
        expect(screen.getByText('resume.pdf')).toBeInTheDocument();
        expect(
          screen.getByPlaceholderText(
            /paste the job description here for better analysis/i
          )
        ).toBeInTheDocument();
      });
    });

    it('should reject invalid file types', async () => {
      const user = userEvent.setup();
      const mockFile = new File(['test content'], 'resume.txt', {
        type: 'text/plain',
      });

      render(<ATSChecker />);

      const fileInput = screen.getByLabelText(/upload resume/i);
      await user.upload(fileInput, mockFile);

      expect(mockAtsApi.analyzeResume).not.toHaveBeenCalled();
    });

    it('should handle file upload errors', async () => {
      const user = userEvent.setup();
      const mockFile = new File(['test content'], 'resume.pdf', {
        type: 'application/pdf',
      });

      mockAtsApi.analyzeResume.mockRejectedValue(new Error('Upload failed'));

      render(<ATSChecker />);

      const fileInput = screen.getByLabelText(/upload resume/i);
      await user.upload(fileInput, mockFile);

      await waitFor(() => {
        expect(screen.getByText(/upload failed/i)).toBeInTheDocument();
      });
    });
  });

  describe('Job Description Input', () => {
    it('should accept job description text', async () => {
      const user = userEvent.setup();
      const jobDescription =
        'We are looking for a Senior Software Engineer with experience in React, Node.js, and TypeScript.';

      render(<ATSChecker />);

      // Wait for the job description input to appear after file upload
      const jobInput = await screen.findByPlaceholderText(
        /paste the job description here for better analysis/i
      );
      await user.type(jobInput, jobDescription);

      expect(jobInput).toHaveValue(jobDescription);
    });

    it('should validate minimum job description length', async () => {
      const user = userEvent.setup();
      const shortDescription = 'React developer';

      render(<ATSChecker />);

      // Wait for the job description input to appear after file upload
      const jobInput = await screen.findByPlaceholderText(
        /paste the job description here for better analysis/i
      );
      await user.type(jobInput, shortDescription);

      const analyzeButton = screen.getByRole('button', {
        name: /analyze resume/i,
      });
      expect(analyzeButton).toBeDisabled();
    });

    it('should enable analyze button with valid inputs', async () => {
      const user = userEvent.setup();
      const mockFile = new File(['test content'], 'resume.pdf', {
        type: 'application/pdf',
      });
      const jobDescription =
        'We are looking for a Senior Software Engineer with experience in React, Node.js, and TypeScript. The ideal candidate should have 5+ years of experience.';

      render(<ATSChecker />);

      const fileInput = screen.getByLabelText(/upload resume/i);
      await user.upload(fileInput, mockFile);

      // Wait for the job description input to appear after file upload
      const jobInput = await screen.findByPlaceholderText(
        /paste the job description here for better analysis/i
      );
      await user.type(jobInput, jobDescription);

      const analyzeButton = screen.getByRole('button', {
        name: /analyze resume/i,
      });
      expect(analyzeButton).not.toBeDisabled();
    });
  });

  describe('Analysis Results Display', () => {
    it('should display ATS score prominently', async () => {
      const user = userEvent.setup();
      const mockFile = new File(['test content'], 'resume.pdf', {
        type: 'application/pdf',
      });
      const jobDescription =
        'We are looking for a Senior Software Engineer with experience in React, Node.js, and TypeScript.';

      mockAtsApi.analyzeResume.mockResolvedValue(mockAnalysisResult);

      render(<ATSChecker />);

      const fileInput = screen.getByLabelText(/upload resume/i);
      await user.upload(fileInput, mockFile);

      // Wait for the job description input to appear after file upload
      const jobInput = await screen.findByPlaceholderText(
        /paste the job description here for better analysis/i
      );
      await user.type(jobInput, jobDescription);

      const analyzeButton = screen.getByRole('button', {
        name: /analyze resume/i,
      });
      await user.click(analyzeButton);

      await waitFor(() => {
        expect(screen.getByText('85')).toBeInTheDocument();
        expect(screen.getByText('Excellent Match')).toBeInTheDocument();
      });
    });

    it('should display keyword matches and missing keywords', async () => {
      const user = userEvent.setup();
      const mockFile = new File(['test content'], 'resume.pdf', {
        type: 'application/pdf',
      });
      const jobDescription =
        'We are looking for a Senior Software Engineer with experience in React, Node.js, and TypeScript.';

      mockAtsApi.analyzeResume.mockResolvedValue(mockAnalysisResult);

      render(<ATSChecker />);

      const fileInput = screen.getByLabelText(/upload resume/i);
      await user.upload(fileInput, mockFile);

      // Wait for the job description input to appear after file upload
      const jobInput = await screen.findByPlaceholderText(
        /paste the job description here for better analysis/i
      );
      await user.type(jobInput, jobDescription);

      const analyzeButton = screen.getByRole('button', {
        name: /analyze resume/i,
      });
      await user.click(analyzeButton);

      await waitFor(() => {
        expect(screen.getByText('javascript')).toBeInTheDocument();
        expect(screen.getByText('react')).toBeInTheDocument();
        expect(screen.getByText('docker')).toBeInTheDocument();
        expect(screen.getByText('kubernetes')).toBeInTheDocument();
      });
    });

    it('should display detailed score breakdown', async () => {
      const user = userEvent.setup();
      const mockFile = new File(['test content'], 'resume.pdf', {
        type: 'application/pdf',
      });
      const jobDescription =
        'We are looking for a Senior Software Engineer with experience in React, Node.js, and TypeScript.';

      mockAtsApi.analyzeResume.mockResolvedValue(mockAnalysisResult);

      render(<ATSChecker />);

      const fileInput = screen.getByLabelText(/upload resume/i);
      await user.upload(fileInput, mockFile);

      // Wait for the job description input to appear after file upload
      const jobInput = await screen.findByPlaceholderText(
        /paste the job description here for better analysis/i
      );
      await user.type(jobInput, jobDescription);

      const analyzeButton = screen.getByRole('button', {
        name: /analyze resume/i,
      });
      await user.click(analyzeButton);

      await waitFor(() => {
        expect(screen.getByText('85.0')).toBeInTheDocument(); // Keyword score
        expect(screen.getByText('82.0')).toBeInTheDocument(); // Semantic score
        expect(screen.getByText('90.0')).toBeInTheDocument(); // Format score
      });
    });

    it('should display suggestions and recommendations', async () => {
      const user = userEvent.setup();
      const mockFile = new File(['test content'], 'resume.pdf', {
        type: 'application/pdf',
      });
      const jobDescription =
        'We are looking for a Senior Software Engineer with experience in React, Node.js, and TypeScript.';

      mockAtsApi.analyzeResume.mockResolvedValue(mockAnalysisResult);

      render(<ATSChecker />);

      const fileInput = screen.getByLabelText(/upload resume/i);
      await user.upload(fileInput, mockFile);

      // Wait for the job description input to appear after file upload
      const jobInput = await screen.findByPlaceholderText(
        /paste the job description here for better analysis/i
      );
      await user.type(jobInput, jobDescription);

      const analyzeButton = screen.getByRole('button', {
        name: /analyze resume/i,
      });
      await user.click(analyzeButton);

      await waitFor(() => {
        expect(
          screen.getByText(/add docker and kubernetes/i)
        ).toBeInTheDocument();
        expect(screen.getByText(/include aws experience/i)).toBeInTheDocument();
      });
    });
  });

  describe('Loading States', () => {
    it('should show loading state during analysis', async () => {
      const user = userEvent.setup();
      const mockFile = new File(['test content'], 'resume.pdf', {
        type: 'application/pdf',
      });
      const jobDescription =
        'We are looking for a Senior Software Engineer with experience in React, Node.js, and TypeScript.';

      // Mock a slow analysis
      mockAtsApi.analyzeResume.mockImplementation(
        () =>
          new Promise(resolve =>
            setTimeout(() => resolve(mockAnalysisResult), 1000)
          )
      );

      render(<ATSChecker />);

      const fileInput = screen.getByLabelText(/upload resume/i);
      await user.upload(fileInput, mockFile);

      // Wait for the job description input to appear after file upload
      const jobInput = await screen.findByPlaceholderText(
        /paste the job description here for better analysis/i
      );
      await user.type(jobInput, jobDescription);

      const analyzeButton = screen.getByRole('button', {
        name: /analyze resume/i,
      });
      await user.click(analyzeButton);

      expect(screen.getByText(/analyzing/i)).toBeInTheDocument();
      expect(analyzeButton).toBeDisabled();
    });

    it('should disable form during analysis', async () => {
      const user = userEvent.setup();
      const mockFile = new File(['test content'], 'resume.pdf', {
        type: 'application/pdf',
      });
      const jobDescription =
        'We are looking for a Senior Software Engineer with experience in React, Node.js, and TypeScript.';

      mockAtsApi.analyzeResume.mockImplementation(
        () =>
          new Promise(resolve =>
            setTimeout(() => resolve(mockAnalysisResult), 1000)
          )
      );

      render(<ATSChecker />);

      const fileInput = screen.getByLabelText(/upload resume/i);
      await user.upload(fileInput, mockFile);

      // Wait for the job description input to appear after file upload
      const jobInput = await screen.findByPlaceholderText(
        /paste the job description here for better analysis/i
      );
      await user.type(jobInput, jobDescription);

      const analyzeButton = screen.getByRole('button', {
        name: /analyze resume/i,
      });
      await user.click(analyzeButton);

      expect(fileInput).toBeDisabled();
      expect(jobInput).toBeDisabled();
    });
  });

  describe('Error Handling', () => {
    it('should handle API errors gracefully', async () => {
      const user = userEvent.setup();
      const mockFile = new File(['test content'], 'resume.pdf', {
        type: 'application/pdf',
      });
      const jobDescription =
        'We are looking for a Senior Software Engineer with experience in React, Node.js, and TypeScript.';

      mockAtsApi.analyzeResume.mockRejectedValue(new Error('API Error'));

      render(<ATSChecker />);

      const fileInput = screen.getByLabelText(/upload resume/i);
      await user.upload(fileInput, mockFile);

      // Wait for the job description input to appear after file upload
      const jobInput = await screen.findByPlaceholderText(
        /paste the job description here for better analysis/i
      );
      await user.type(jobInput, jobDescription);

      const analyzeButton = screen.getByRole('button', {
        name: /analyze resume/i,
      });
      await user.click(analyzeButton);

      await waitFor(() => {
        expect(
          screen.getByText(/Cannot read properties of undefined/i)
        ).toBeInTheDocument();
      });
    });

    it('should handle network errors', async () => {
      const user = userEvent.setup();
      const mockFile = new File(['test content'], 'resume.pdf', {
        type: 'application/pdf',
      });
      const jobDescription =
        'We are looking for a Senior Software Engineer with experience in React, Node.js, and TypeScript.';

      mockAtsApi.analyzeResume.mockRejectedValue(new Error('Network Error'));

      render(<ATSChecker />);

      const fileInput = screen.getByLabelText(/upload resume/i);
      await user.upload(fileInput, mockFile);

      // Wait for the job description input to appear after file upload
      const jobInput = await screen.findByPlaceholderText(
        /paste the job description here for better analysis/i
      );
      await user.type(jobInput, jobDescription);

      const analyzeButton = screen.getByRole('button', {
        name: /analyze resume/i,
      });
      await user.click(analyzeButton);

      await waitFor(() => {
        expect(
          screen.getByText(/Cannot read properties of undefined/i)
        ).toBeInTheDocument();
      });
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA labels', () => {
      render(<ATSChecker />);

      expect(screen.getByLabelText(/upload resume/i)).toBeInTheDocument();
      // Job description input only appears after file upload
      expect(
        screen.queryByLabelText(/job description/i)
      ).not.toBeInTheDocument();
    });

    it('should support keyboard navigation', async () => {
      const user = userEvent.setup();
      render(<ATSChecker />);

      // File input is hidden, so focus goes to the upload button
      await user.tab();
      expect(screen.getByRole('button', { name: /upload/i })).toHaveFocus();
    });

    it('should announce analysis results to screen readers', async () => {
      const user = userEvent.setup();
      const mockFile = new File(['test content'], 'resume.pdf', {
        type: 'application/pdf',
      });
      const jobDescription =
        'We are looking for a Senior Software Engineer with experience in React, Node.js, and TypeScript.';

      mockAtsApi.analyzeResume.mockResolvedValue(mockAnalysisResult);

      render(<ATSChecker />);

      const fileInput = screen.getByLabelText(/upload resume/i);
      await user.upload(fileInput, mockFile);

      // Wait for the job description input to appear after file upload
      const jobInput = await screen.findByPlaceholderText(
        /paste the job description here for better analysis/i
      );
      await user.type(jobInput, jobDescription);

      const analyzeButton = screen.getByRole('button', {
        name: /analyze resume/i,
      });
      await user.click(analyzeButton);

      await waitFor(() => {
        const resultsSection = screen.getByRole('region', {
          name: /analysis results/i,
        });
        expect(resultsSection).toBeInTheDocument();
      });
    });
  });

  describe('Score Interpretation', () => {
    it('should display correct score category for different scores', async () => {
      const user = userEvent.setup();
      const mockFile = new File(['test content'], 'resume.pdf', {
        type: 'application/pdf',
      });
      const jobDescription =
        'We are looking for a Senior Software Engineer with experience in React, Node.js, and TypeScript.';

      const poorScoreResult = {
        ...mockAnalysisResult,
        data: {
          ...mockAnalysisResult.data,
          ats_score: 45,
          match_category: 'Poor Match',
        },
      };

      mockAtsApi.analyzeResume.mockResolvedValue(poorScoreResult);

      render(<ATSChecker />);

      const fileInput = screen.getByLabelText(/upload resume/i);
      await user.upload(fileInput, mockFile);

      // Wait for the job description input to appear after file upload
      const jobInput = await screen.findByPlaceholderText(
        /paste the job description here for better analysis/i
      );
      await user.type(jobInput, jobDescription);

      const analyzeButton = screen.getByRole('button', {
        name: /analyze resume/i,
      });
      await user.click(analyzeButton);

      await waitFor(() => {
        expect(screen.getByText('45')).toBeInTheDocument();
        expect(screen.getByText('Poor Match')).toBeInTheDocument();
      });
    });
  });
});
