import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ResumeManager } from '@/components/resume/ResumeManager/ResumeManager';
import { cloudStorage } from '@/lib/storage/cloudStorage';
import { atsApi } from '@/api/endpoints/ats';

// Mock dependencies
jest.mock('@/lib/storage/cloudStorage');
jest.mock('@/api/endpoints/ats');
jest.mock('react-hot-toast', () => ({
  error: jest.fn(),
  success: jest.fn(),
}));

const mockCloudStorage = cloudStorage as jest.Mocked<typeof cloudStorage>;
const mockAtsApi = atsApi as jest.Mocked<typeof atsApi>;

describe('ResumeManager Component', () => {
  const defaultProps = {
    onResumeSelect: jest.fn(),
    onNewResume: jest.fn(),
    currentResumeId: null,
  };

  const mockResumes = [
    {
      id: '1',
      name: 'Software Engineer Resume',
      data: {
        personal: { fullName: 'John Doe', email: 'john@example.com' },
        summary: 'Experienced software engineer',
        experience: [],
        education: [],
        skills: { technical: [], business: [], soft: [], languages: [], certifications: [] },
        projects: [],
        achievements: [],
      },
      template: 'modern',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '2',
      name: 'Product Manager Resume',
      data: {
        personal: { fullName: 'Jane Smith', email: 'jane@example.com' },
        summary: 'Product management expert',
        experience: [],
        education: [],
        skills: { technical: [], business: [], soft: [], languages: [], certifications: [] },
        projects: [],
        achievements: [],
      },
      template: 'classic',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    mockCloudStorage.getAllResumes.mockReturnValue(mockResumes);
    mockCloudStorage.getResume.mockImplementation((id) => 
      mockResumes.find(r => r.id === id) || null
    );
  });

  describe('Resume List Display', () => {
    it('should display all saved resumes', () => {
      render(<ResumeManager {...defaultProps} />);
      
      expect(screen.getByText('Software Engineer Resume')).toBeInTheDocument();
      expect(screen.getByText('Product Manager Resume')).toBeInTheDocument();
    });

    it('should show resume metadata', () => {
      render(<ResumeManager {...defaultProps} />);
      
      expect(screen.getByText('john@example.com')).toBeInTheDocument();
      expect(screen.getByText('jane@example.com')).toBeInTheDocument();
    });

    it('should highlight current resume', () => {
      render(<ResumeManager {...defaultProps} currentResumeId="1" />);
      
      const currentResume = screen.getByText('Software Engineer Resume').closest('div');
      expect(currentResume).toHaveClass('bg-blue-50', 'border-blue-200');
    });
  });

  describe('Resume Selection', () => {
    it('should call onResumeSelect when resume is clicked', () => {
      render(<ResumeManager {...defaultProps} />);
      
      const resumeItem = screen.getByText('Software Engineer Resume');
      fireEvent.click(resumeItem);

      expect(defaultProps.onResumeSelect).toHaveBeenCalledWith(mockResumes[0]);
    });

    it('should handle resume selection with keyboard', async () => {
      const user = userEvent.setup();
      render(<ResumeManager {...defaultProps} />);
      
      const resumeItem = screen.getByText('Software Engineer Resume');
      await user.tab();
      await user.keyboard('{Enter}');

      expect(defaultProps.onResumeSelect).toHaveBeenCalledWith(mockResumes[0]);
    });
  });

  describe('File Upload', () => {
    it('should handle valid file upload', async () => {
      const user = userEvent.setup();
      const mockFile = new File(['test content'], 'resume.pdf', {
        type: 'application/pdf',
      });

      mockAtsApi.uploadFile.mockResolvedValue({
        success: true,
        data: {
          filename: 'resume.pdf',
          text: 'Extracted resume content',
          word_count: 100,
        },
      });

      mockCloudStorage.saveResume.mockReturnValue('new-resume-id');
      mockCloudStorage.getResume.mockReturnValue({
        id: 'new-resume-id',
        name: 'resume',
        data: {
          personal: { fullName: 'resume', email: '' },
          summary: '',
          experience: [],
          education: [],
          skills: { technical: [], business: [], soft: [], languages: [], certifications: [] },
          projects: [],
          achievements: [],
        },
        template: 'unknown',
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      render(<ResumeManager {...defaultProps} />);
      
      const fileInput = screen.getByLabelText(/upload resume/i);
      await user.upload(fileInput, mockFile);

      await waitFor(() => {
        expect(mockAtsApi.uploadFile).toHaveBeenCalledWith(mockFile);
        expect(mockCloudStorage.saveResume).toHaveBeenCalled();
        expect(defaultProps.onResumeSelect).toHaveBeenCalled();
      });
    });

    it('should reject invalid file types', async () => {
      const user = userEvent.setup();
      const mockFile = new File(['test content'], 'resume.txt', {
        type: 'text/plain',
      });

      render(<ResumeManager {...defaultProps} />);
      
      const fileInput = screen.getByLabelText(/upload resume/i);
      await user.upload(fileInput, mockFile);

      await waitFor(() => {
        expect(mockAtsApi.uploadFile).not.toHaveBeenCalled();
      });
    });

    it('should reject files that are too large', async () => {
      const user = userEvent.setup();
      const mockFile = new File(['test content'], 'resume.pdf', {
        type: 'application/pdf',
      });
      Object.defineProperty(mockFile, 'size', { value: 11 * 1024 * 1024 });

      render(<ResumeManager {...defaultProps} />);
      
      const fileInput = screen.getByLabelText(/upload resume/i);
      await user.upload(fileInput, mockFile);

      await waitFor(() => {
        expect(mockAtsApi.uploadFile).not.toHaveBeenCalled();
      });
    });

    it('should handle upload errors gracefully', async () => {
      const user = userEvent.setup();
      const mockFile = new File(['test content'], 'resume.pdf', {
        type: 'application/pdf',
      });

      mockAtsApi.uploadFile.mockRejectedValue(new Error('Upload failed'));

      render(<ResumeManager {...defaultProps} />);
      
      const fileInput = screen.getByLabelText(/upload resume/i);
      await user.upload(fileInput, mockFile);

      await waitFor(() => {
        expect(mockAtsApi.uploadFile).toHaveBeenCalledWith(mockFile);
        expect(mockCloudStorage.saveResume).not.toHaveBeenCalled();
      });
    });
  });

  describe('Resume Management', () => {
    it('should create new resume when new button is clicked', () => {
      render(<ResumeManager {...defaultProps} />);
      
      const newButton = screen.getByRole('button', { name: /new resume/i });
      fireEvent.click(newButton);

      expect(defaultProps.onNewResume).toHaveBeenCalled();
    });

    it('should delete resume when delete button is clicked', async () => {
      const user = userEvent.setup();
      mockCloudStorage.deleteResume.mockReturnValue(true);

      render(<ResumeManager {...defaultProps} />);
      
      const deleteButton = screen.getAllByRole('button', { name: /delete/i })[0];
      await user.click(deleteButton);

      // Confirm deletion in modal
      const confirmButton = screen.getByRole('button', { name: /confirm/i });
      await user.click(confirmButton);

      await waitFor(() => {
        expect(mockCloudStorage.deleteResume).toHaveBeenCalledWith('1');
      });
    });

    it('should cancel deletion when cancel button is clicked', async () => {
      const user = userEvent.setup();

      render(<ResumeManager {...defaultProps} />);
      
      const deleteButton = screen.getAllByRole('button', { name: /delete/i })[0];
      await user.click(deleteButton);

      // Cancel deletion in modal
      const cancelButton = screen.getByRole('button', { name: /cancel/i });
      await user.click(cancelButton);

      expect(mockCloudStorage.deleteResume).not.toHaveBeenCalled();
    });

    it('should duplicate resume when duplicate button is clicked', () => {
      mockCloudStorage.duplicateResume.mockReturnValue('duplicated-resume-id');

      render(<ResumeManager {...defaultProps} />);
      
      const duplicateButton = screen.getAllByRole('button', { name: /duplicate/i })[0];
      fireEvent.click(duplicateButton);

      expect(mockCloudStorage.duplicateResume).toHaveBeenCalledWith('1');
    });
  });

  describe('Search and Filter', () => {
    it('should filter resumes by search term', async () => {
      const user = userEvent.setup();
      render(<ResumeManager {...defaultProps} />);
      
      const searchInput = screen.getByPlaceholderText(/search resumes/i);
      await user.type(searchInput, 'Software');

      expect(screen.getByText('Software Engineer Resume')).toBeInTheDocument();
      expect(screen.queryByText('Product Manager Resume')).not.toBeInTheDocument();
    });

    it('should show no results message when no matches found', async () => {
      const user = userEvent.setup();
      render(<ResumeManager {...defaultProps} />);
      
      const searchInput = screen.getByPlaceholderText(/search resumes/i);
      await user.type(searchInput, 'NonExistent');

      expect(screen.getByText(/no resumes found/i)).toBeInTheDocument();
    });

    it('should clear search when clear button is clicked', async () => {
      const user = userEvent.setup();
      render(<ResumeManager {...defaultProps} />);
      
      const searchInput = screen.getByPlaceholderText(/search resumes/i);
      await user.type(searchInput, 'Software');

      const clearButton = screen.getByRole('button', { name: /clear/i });
      await user.click(clearButton);

      expect(searchInput).toHaveValue('');
      expect(screen.getByText('Product Manager Resume')).toBeInTheDocument();
    });
  });

  describe('Loading States', () => {
    it('should show loading state during file upload', async () => {
      const user = userEvent.setup();
      const mockFile = new File(['test content'], 'resume.pdf', {
        type: 'application/pdf',
      });

      // Mock a slow upload
      mockAtsApi.uploadFile.mockImplementation(
        () => new Promise(resolve => setTimeout(resolve, 1000))
      );

      render(<ResumeManager {...defaultProps} />);
      
      const fileInput = screen.getByLabelText(/upload resume/i);
      await user.upload(fileInput, mockFile);

      expect(screen.getByText(/uploading/i)).toBeInTheDocument();
    });

    it('should disable interactions during upload', async () => {
      const user = userEvent.setup();
      const mockFile = new File(['test content'], 'resume.pdf', {
        type: 'application/pdf',
      });

      mockAtsApi.uploadFile.mockImplementation(
        () => new Promise(resolve => setTimeout(resolve, 1000))
      );

      render(<ResumeManager {...defaultProps} />);
      
      const fileInput = screen.getByLabelText(/upload resume/i);
      await user.upload(fileInput, mockFile);

      const newButton = screen.getByRole('button', { name: /new resume/i });
      expect(newButton).toBeDisabled();
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA labels for all interactive elements', () => {
      render(<ResumeManager {...defaultProps} />);
      
      expect(screen.getByLabelText(/upload resume/i)).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/search resumes/i)).toBeInTheDocument();
    });

    it('should support keyboard navigation', async () => {
      const user = userEvent.setup();
      render(<ResumeManager {...defaultProps} />);
      
      await user.tab();
      expect(screen.getByRole('button', { name: /new resume/i })).toHaveFocus();
      
      await user.tab();
      expect(screen.getByPlaceholderText(/search resumes/i)).toHaveFocus();
    });

    it('should announce resume selection to screen readers', () => {
      render(<ResumeManager {...defaultProps} currentResumeId="1" />);
      
      const selectedResume = screen.getByText('Software Engineer Resume').closest('div');
      expect(selectedResume).toHaveAttribute('aria-selected', 'true');
    });
  });
});
