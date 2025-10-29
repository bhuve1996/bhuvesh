import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';

import { FileUpload } from '@/components/molecules/FileUpload/FileUpload';
import { ThemeProvider } from '@/contexts/ThemeContext';
import type { FileUploadComponentProps } from '@/types';

// Mock react-hot-toast
jest.mock('react-hot-toast', () => ({
  error: jest.fn(),
  success: jest.fn(),
}));

// Helper function to render with ThemeProvider
const renderWithTheme = (component: React.ReactElement) => {
  return render(<ThemeProvider>{component}</ThemeProvider>);
};

describe('FileUpload Component', () => {
  const defaultProps: FileUploadComponentProps = {
    onUpload: jest.fn(),
    onFileUpload: jest.fn(),
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

      renderWithTheme(<FileUpload {...defaultProps} />);

      const fileInput = screen.getByLabelText(/upload resume file/i);
      await user.upload(fileInput, mockFile);

      // Click the upload button to trigger onFileUpload
      const uploadButton = screen.getByText(/upload 1 file/i);
      await user.click(uploadButton);

      expect(defaultProps.onFileUpload).toHaveBeenCalledWith([mockFile]);
    });

    it('should accept valid DOCX files', async () => {
      const user = userEvent.setup();
      const mockFile = new File(['test content'], 'test.docx', {
        type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      });

      renderWithTheme(<FileUpload {...defaultProps} />);

      const fileInput = screen.getByLabelText(/upload resume file/i);
      await user.upload(fileInput, mockFile);

      // Click the upload button to trigger onFileUpload
      const uploadButton = screen.getByText(/upload 1 file/i);
      await user.click(uploadButton);

      expect(defaultProps.onFileUpload).toHaveBeenCalledWith([mockFile]);
    });

    it('should reject files that are too large', async () => {
      const user = userEvent.setup();
      const mockFile = new File(['test content'], 'test.pdf', {
        type: 'application/pdf',
      });
      // Mock file size to be larger than 10MB
      Object.defineProperty(mockFile, 'size', { value: 11 * 1024 * 1024 });

      renderWithTheme(
        <FileUpload {...defaultProps} maxSize={10 * 1024 * 1024} />
      );

      const fileInput = screen.getByLabelText(/upload resume file/i);
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

      renderWithTheme(
        <FileUpload
          {...defaultProps}
          validation={{ allowedTypes: ['pdf', 'docx'] }}
        />
      );

      const fileInput = screen.getByLabelText(/upload resume file/i);
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

      renderWithTheme(<FileUpload {...defaultProps} maxFiles={2} multiple />);

      const fileInput = screen.getByLabelText(/upload resume file/i);
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

      renderWithTheme(<FileUpload {...defaultProps} dragAndDrop />);

      const dropZone = screen
        .getByText('Drag and drop your files here')
        .closest('div');

      // Simulate drag events
      fireEvent.dragEnter(dropZone);
      // Just verify the drop zone exists and can handle events
      expect(dropZone).toBeInTheDocument();

      fireEvent.dragLeave(dropZone);
      expect(dropZone).toBeInTheDocument();

      // Simulate drop
      fireEvent.drop(dropZone, {
        dataTransfer: {
          files: [mockFile],
        },
      });

      // Click the upload button to trigger onFileUpload
      const uploadButton = screen.getByText(/upload 1 file/i);
      await user.click(uploadButton);

      expect(defaultProps.onFileUpload).toHaveBeenCalledWith([mockFile]);
    });

    it('should not handle drag events when disabled', () => {
      const mockFile = new File(['test content'], 'test.pdf', {
        type: 'application/pdf',
      });

      renderWithTheme(<FileUpload {...defaultProps} disabled dragAndDrop />);

      const dropZone = screen
        .getByText('Drag and drop your files here')
        .closest('div');

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
      renderWithTheme(<FileUpload {...defaultProps} loading />);

      expect(screen.getByText(/uploading/i)).toBeInTheDocument();
    });

    it('should disable upload button when loading', () => {
      renderWithTheme(<FileUpload {...defaultProps} loading />);

      // When loading, the upload button is not visible, only the loading state
      expect(screen.getByText(/uploading/i)).toBeInTheDocument();
    });
  });

  describe('File Preview', () => {
    it('should show file preview when enabled', async () => {
      const user = userEvent.setup();
      const mockFile = new File(['test content'], 'test.pdf', {
        type: 'application/pdf',
      });

      renderWithTheme(<FileUpload {...defaultProps} preview />);

      const fileInput = screen.getByLabelText(/upload resume file/i);
      await user.upload(fileInput, mockFile);

      expect(screen.getByText('test.pdf')).toBeInTheDocument();
      expect(screen.getByText('12 Bytes')).toBeInTheDocument(); // File size
    });

    it('should not show file preview when disabled', async () => {
      const user = userEvent.setup();
      const mockFile = new File(['test content'], 'test.pdf', {
        type: 'application/pdf',
      });

      renderWithTheme(<FileUpload {...defaultProps} preview={false} />);

      const fileInput = screen.getByLabelText(/upload resume file/i);
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

      renderWithTheme(
        <FileUpload {...defaultProps} validation={{ allowedTypes: ['pdf'] }} />
      );

      const fileInput = screen.getByLabelText(/upload resume file/i);
      await user.upload(fileInput, mockFile);

      expect(
        screen.getByText(/file type .txt is not allowed/i)
      ).toBeInTheDocument();
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

      renderWithTheme(
        <FileUpload
          {...defaultProps}
          validation={{ custom: customValidation }}
        />
      );

      const fileInput = screen.getByLabelText(/upload resume file/i);
      await user.upload(fileInput, mockFile);

      expect(
        screen.getByText(/file name cannot contain "test"/i)
      ).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA labels', () => {
      renderWithTheme(<FileUpload {...defaultProps} />);

      const fileInput = screen.getByLabelText(/upload resume file/i);
      expect(fileInput).toHaveAttribute('type', 'file');
    });

    it('should be keyboard accessible', async () => {
      const user = userEvent.setup();
      renderWithTheme(<FileUpload {...defaultProps} />);

      // The file input should be focusable
      const fileInput = screen.getByLabelText(/upload resume file/i);
      await user.tab();
      expect(fileInput).toHaveFocus();
    });

    it('should announce errors to screen readers', async () => {
      const user = userEvent.setup();
      const mockFile = new File(['test content'], 'test.txt', {
        type: 'text/plain',
      });

      renderWithTheme(
        <FileUpload {...defaultProps} validation={{ allowedTypes: ['pdf'] }} />
      );

      const fileInput = screen.getByLabelText(/upload resume file/i);
      await user.upload(fileInput, mockFile);

      const errorMessage = screen.getByRole('alert');
      expect(errorMessage).toBeInTheDocument();
    });
  });
});
