import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FileUpload } from '@/components/molecules/FileUpload/FileUpload';
import type { FileUploadComponentProps } from '@/types';

// Mock react-hot-toast
jest.mock('react-hot-toast', () => ({
  error: jest.fn(),
  success: jest.fn(),
}));

describe('FileUpload Component', () => {
  const defaultProps: FileUploadComponentProps = {
    onUpload: jest.fn(),
    onError: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('File Validation', () => {
    it('should accept valid PDF files', async () => {
      const user = userEvent.setup();
      const mockFile = new File(['test content'], 'test.pdf', {
        type: 'application/pdf',
      });

      render(<FileUpload {...defaultProps} />);
      
      const fileInput = screen.getByLabelText(/upload/i);
      await user.upload(fileInput, mockFile);

      expect(defaultProps.onUpload).toHaveBeenCalledWith([mockFile]);
    });

    it('should accept valid DOCX files', async () => {
      const user = userEvent.setup();
      const mockFile = new File(['test content'], 'test.docx', {
        type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      });

      render(<FileUpload {...defaultProps} />);
      
      const fileInput = screen.getByLabelText(/upload/i);
      await user.upload(fileInput, mockFile);

      expect(defaultProps.onUpload).toHaveBeenCalledWith([mockFile]);
    });

    it('should reject files that are too large', async () => {
      const user = userEvent.setup();
      const mockFile = new File(['test content'], 'test.pdf', {
        type: 'application/pdf',
      });
      // Mock file size to be larger than 10MB
      Object.defineProperty(mockFile, 'size', { value: 11 * 1024 * 1024 });

      render(<FileUpload {...defaultProps} maxSize={10 * 1024 * 1024} />);
      
      const fileInput = screen.getByLabelText(/upload/i);
      await user.upload(fileInput, mockFile);

      expect(defaultProps.onError).toHaveBeenCalledWith(
        expect.stringContaining('File size exceeds 10MB limit')
      );
    });

    it('should reject unsupported file types', async () => {
      const user = userEvent.setup();
      const mockFile = new File(['test content'], 'test.txt', {
        type: 'text/plain',
      });

      render(
        <FileUpload 
          {...defaultProps} 
          validation={{ allowedTypes: ['pdf', 'docx'] }}
        />
      );
      
      const fileInput = screen.getByLabelText(/upload/i);
      await user.upload(fileInput, mockFile);

      expect(defaultProps.onError).toHaveBeenCalledWith(
        expect.stringContaining('File type .txt is not allowed')
      );
    });

    it('should enforce maximum file count', async () => {
      const user = userEvent.setup();
      const mockFiles = [
        new File(['test1'], 'test1.pdf', { type: 'application/pdf' }),
        new File(['test2'], 'test2.pdf', { type: 'application/pdf' }),
        new File(['test3'], 'test3.pdf', { type: 'application/pdf' }),
      ];

      render(<FileUpload {...defaultProps} maxFiles={2} multiple />);
      
      const fileInput = screen.getByLabelText(/upload/i);
      await user.upload(fileInput, mockFiles);

      expect(defaultProps.onError).toHaveBeenCalledWith(
        expect.stringContaining('Maximum 2 file(s) allowed')
      );
    });
  });

  describe('Drag and Drop', () => {
    it('should handle drag and drop events', async () => {
      const user = userEvent.setup();
      const mockFile = new File(['test content'], 'test.pdf', {
        type: 'application/pdf',
      });

      render(<FileUpload {...defaultProps} dragAndDrop />);
      
      const dropZone = screen.getByTestId('file-upload-dropzone');
      
      // Simulate drag events
      fireEvent.dragEnter(dropZone);
      expect(dropZone).toHaveClass('drag-active');

      fireEvent.dragLeave(dropZone);
      expect(dropZone).not.toHaveClass('drag-active');

      // Simulate drop
      fireEvent.drop(dropZone, {
        dataTransfer: {
          files: [mockFile],
        },
      });

      await waitFor(() => {
        expect(defaultProps.onUpload).toHaveBeenCalledWith([mockFile]);
      });
    });

    it('should not handle drag events when disabled', () => {
      const mockFile = new File(['test content'], 'test.pdf', {
        type: 'application/pdf',
      });

      render(<FileUpload {...defaultProps} disabled dragAndDrop />);
      
      const dropZone = screen.getByTestId('file-upload-dropzone');
      
      fireEvent.drop(dropZone, {
        dataTransfer: {
          files: [mockFile],
        },
      });

      expect(defaultProps.onUpload).not.toHaveBeenCalled();
    });
  });

  describe('Upload Progress', () => {
    it('should show upload progress when loading', () => {
      render(<FileUpload {...defaultProps} loading />);
      
      expect(screen.getByRole('progressbar')).toBeInTheDocument();
      expect(screen.getByText(/uploading/i)).toBeInTheDocument();
    });

    it('should disable upload button when loading', () => {
      render(<FileUpload {...defaultProps} loading />);
      
      const uploadButton = screen.getByRole('button', { name: /upload/i });
      expect(uploadButton).toBeDisabled();
    });
  });

  describe('File Preview', () => {
    it('should show file preview when enabled', async () => {
      const user = userEvent.setup();
      const mockFile = new File(['test content'], 'test.pdf', {
        type: 'application/pdf',
      });

      render(<FileUpload {...defaultProps} preview />);
      
      const fileInput = screen.getByLabelText(/upload/i);
      await user.upload(fileInput, mockFile);

      expect(screen.getByText('test.pdf')).toBeInTheDocument();
      expect(screen.getByText('10 B')).toBeInTheDocument(); // File size
    });

    it('should not show file preview when disabled', async () => {
      const user = userEvent.setup();
      const mockFile = new File(['test content'], 'test.pdf', {
        type: 'application/pdf',
      });

      render(<FileUpload {...defaultProps} preview={false} />);
      
      const fileInput = screen.getByLabelText(/upload/i);
      await user.upload(fileInput, mockFile);

      expect(screen.queryByText('test.pdf')).not.toBeInTheDocument();
    });
  });

  describe('Error Handling', () => {
    it('should display validation errors', async () => {
      const user = userEvent.setup();
      const mockFile = new File(['test content'], 'test.txt', {
        type: 'text/plain',
      });

      render(
        <FileUpload 
          {...defaultProps} 
          validation={{ allowedTypes: ['pdf'] }}
        />
      );
      
      const fileInput = screen.getByLabelText(/upload/i);
      await user.upload(fileInput, mockFile);

      expect(screen.getByText(/file type .txt is not allowed/i)).toBeInTheDocument();
    });

    it('should handle custom validation errors', async () => {
      const user = userEvent.setup();
      const mockFile = new File(['test content'], 'test.pdf', {
        type: 'application/pdf',
      });

      const customValidation = (file: File) => {
        if (file.name.includes('test')) {
          return 'File name cannot contain "test"';
        }
        return null;
      };

      render(
        <FileUpload 
          {...defaultProps} 
          validation={{ custom: customValidation }}
        />
      );
      
      const fileInput = screen.getByLabelText(/upload/i);
      await user.upload(fileInput, mockFile);

      expect(screen.getByText(/file name cannot contain "test"/i)).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA labels', () => {
      render(<FileUpload {...defaultProps} />);
      
      const fileInput = screen.getByLabelText(/upload/i);
      expect(fileInput).toHaveAttribute('type', 'file');
    });

    it('should be keyboard accessible', async () => {
      const user = userEvent.setup();
      render(<FileUpload {...defaultProps} />);
      
      const uploadButton = screen.getByRole('button', { name: /upload/i });
      await user.tab();
      expect(uploadButton).toHaveFocus();
    });

    it('should announce errors to screen readers', async () => {
      const user = userEvent.setup();
      const mockFile = new File(['test content'], 'test.txt', {
        type: 'text/plain',
      });

      render(
        <FileUpload 
          {...defaultProps} 
          validation={{ allowedTypes: ['pdf'] }}
        />
      );
      
      const fileInput = screen.getByLabelText(/upload/i);
      await user.upload(fileInput, mockFile);

      const errorMessage = screen.getByRole('alert');
      expect(errorMessage).toBeInTheDocument();
    });
  });
});
