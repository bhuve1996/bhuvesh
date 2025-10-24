import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';

import { FileUpload } from '../FileUpload';

// Mock react-hot-toast
jest.mock('react-hot-toast', () => ({
  error: jest.fn(),
  success: jest.fn(),
}));

describe('FileUpload Component', () => {
  const defaultProps = {
    onUpload: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders with default props', () => {
    render(<FileUpload {...defaultProps} />);

    expect(
      screen.getByText(/drag and drop your files here/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/or click to browse/i)).toBeInTheDocument();
    expect(
      screen.getByText(/supports: \.pdf,\.docx,\.doc,\.txt/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/max size: 10 mb/i)).toBeInTheDocument();
  });

  it('renders with custom accept types', () => {
    render(<FileUpload {...defaultProps} accept='.pdf,.jpg,.png' />);
    expect(
      screen.getByText(/supports: \.pdf,\.jpg,\.png/i)
    ).toBeInTheDocument();
  });

  it('renders with custom max size', () => {
    render(<FileUpload {...defaultProps} maxSize={5 * 1024 * 1024} />);
    expect(screen.getByText(/max size: 5 mb/i)).toBeInTheDocument();
  });

  it('renders with custom max files', () => {
    render(<FileUpload {...defaultProps} maxFiles={3} />);
    expect(screen.getByText(/max files: 3/i)).toBeInTheDocument();
  });

  it('handles file selection via input', async () => {
    const user = userEvent.setup();
    render(<FileUpload {...defaultProps} />);

    const file = new File(['test content'], 'test.pdf', {
      type: 'application/pdf',
    });
    const input = screen.getByLabelText(/file-input/i);

    await user.upload(input, file);

    expect(screen.getByText('test.pdf')).toBeInTheDocument();
    expect(screen.getByText(/upload 1 file/i)).toBeInTheDocument();
  });

  it('handles drag and drop', async () => {
    render(<FileUpload {...defaultProps} />);

    const dropZone = screen
      .getByText(/drag and drop your files here/i)
      .closest('div');
    const file = new File(['test content'], 'test.pdf', {
      type: 'application/pdf',
    });

    fireEvent.dragEnter(dropZone!);
    expect(dropZone).toHaveClass('border-cyan-500', 'bg-cyan-50');

    fireEvent.drop(dropZone!, {
      dataTransfer: {
        files: [file],
      },
    });

    await waitFor(() => {
      expect(screen.getByText('test.pdf')).toBeInTheDocument();
    });
  });

  it('validates file size', async () => {
    const user = userEvent.setup();
    const onError = jest.fn();
    render(<FileUpload {...defaultProps} onError={onError} maxSize={1024} />);

    const file = new File(['test content'], 'test.pdf', {
      type: 'application/pdf',
    });
    Object.defineProperty(file, 'size', { value: 2048 }); // 2KB, exceeds 1KB limit

    const input = screen.getByLabelText(/file-input/i);
    await user.upload(input, file);

    expect(onError).toHaveBeenCalledWith(
      expect.stringContaining('File size exceeds')
    );
  });

  it('validates file type', async () => {
    const user = userEvent.setup();
    const onError = jest.fn();
    render(
      <FileUpload
        {...defaultProps}
        onError={onError}
        validation={{ allowedTypes: ['pdf'] }}
      />
    );

    const file = new File(['test content'], 'test.txt', { type: 'text/plain' });
    const input = screen.getByLabelText(/file-input/i);
    await user.upload(input, file);

    expect(onError).toHaveBeenCalledWith(
      expect.stringContaining('File type .txt is not allowed')
    );
  });

  it('validates max files', async () => {
    const user = userEvent.setup();
    const onError = jest.fn();
    render(
      <FileUpload {...defaultProps} onError={onError} maxFiles={1} multiple />
    );

    const file1 = new File(['test content 1'], 'test1.pdf', {
      type: 'application/pdf',
    });
    const file2 = new File(['test content 2'], 'test2.pdf', {
      type: 'application/pdf',
    });
    const input = screen.getByLabelText(/file-input/i);

    await user.upload(input, [file1, file2]);

    expect(onError).toHaveBeenCalledWith(
      expect.stringContaining('Maximum 1 file(s) allowed')
    );
  });

  it('handles custom validation', async () => {
    const user = userEvent.setup();
    const onError = jest.fn();
    const customValidation = jest
      .fn()
      .mockReturnValue('Custom validation error');

    render(
      <FileUpload
        {...defaultProps}
        onError={onError}
        validation={{ custom: customValidation }}
      />
    );

    const file = new File(['test content'], 'test.pdf', {
      type: 'application/pdf',
    });
    const input = screen.getByLabelText(/file-input/i);
    await user.upload(input, file);

    expect(customValidation).toHaveBeenCalledWith(file);
    expect(onError).toHaveBeenCalledWith(
      expect.stringContaining('Custom validation error')
    );
  });

  it('shows loading state', () => {
    render(<FileUpload {...defaultProps} loading />);

    expect(screen.getByText(/uploading\.\.\./i)).toBeInTheDocument();
    expect(screen.getByLabelText(/file-input/i)).toBeDisabled();
  });

  it('shows disabled state', () => {
    render(<FileUpload {...defaultProps} disabled />);

    expect(screen.getByLabelText(/file-input/i)).toBeDisabled();
    expect(
      screen.getByText(/drag and drop your files here/i).closest('div')
    ).toHaveClass('opacity-50', 'cursor-not-allowed');
  });

  it('removes files when remove button is clicked', async () => {
    const user = userEvent.setup();
    render(<FileUpload {...defaultProps} />);

    const file = new File(['test content'], 'test.pdf', {
      type: 'application/pdf',
    });
    const input = screen.getByLabelText(/file-input/i);
    await user.upload(input, file);

    expect(screen.getByText('test.pdf')).toBeInTheDocument();

    const removeButton = screen.getByText(/remove/i);
    await user.click(removeButton);

    expect(screen.queryByText('test.pdf')).not.toBeInTheDocument();
  });

  it('calls onUpload when upload button is clicked', async () => {
    const user = userEvent.setup();
    render(<FileUpload {...defaultProps} />);

    const file = new File(['test content'], 'test.pdf', {
      type: 'application/pdf',
    });
    const input = screen.getByLabelText(/file-input/i);
    await user.upload(input, file);

    const uploadButton = screen.getByText(/upload 1 file/i);
    await user.click(uploadButton);

    expect(defaultProps.onUpload).toHaveBeenCalledWith([file]);
  });

  it('disables upload button when there are errors', async () => {
    const user = userEvent.setup();
    const onError = jest.fn();
    render(<FileUpload {...defaultProps} onError={onError} maxSize={1024} />);

    const file = new File(['test content'], 'test.pdf', {
      type: 'application/pdf',
    });
    Object.defineProperty(file, 'size', { value: 2048 });

    const input = screen.getByLabelText(/file-input/i);
    await user.upload(input, file);

    const uploadButton = screen.getByText(/upload 1 file/i);
    expect(uploadButton).toBeDisabled();
  });

  it('formats file size correctly', () => {
    render(<FileUpload {...defaultProps} />);

    // Test different file sizes
    expect(screen.getByText(/max size: 10 mb/i)).toBeInTheDocument();
  });

  it('shows correct file icons', async () => {
    const user = userEvent.setup();
    render(<FileUpload {...defaultProps} />);

    const pdfFile = new File(['test content'], 'test.pdf', {
      type: 'application/pdf',
    });
    const docxFile = new File(['test content'], 'test.docx', {
      type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    });
    const txtFile = new File(['test content'], 'test.txt', {
      type: 'text/plain',
    });

    const input = screen.getByLabelText(/file-input/i);

    await user.upload(input, pdfFile);
    expect(screen.getByText('📄')).toBeInTheDocument();

    await user.upload(input, docxFile);
    expect(screen.getByText('📝')).toBeInTheDocument();

    await user.upload(input, txtFile);
    expect(screen.getByText('📃')).toBeInTheDocument();
  });

  it('handles multiple files', async () => {
    const user = userEvent.setup();
    render(<FileUpload {...defaultProps} multiple maxFiles={3} />);

    const file1 = new File(['test content 1'], 'test1.pdf', {
      type: 'application/pdf',
    });
    const file2 = new File(['test content 2'], 'test2.pdf', {
      type: 'application/pdf',
    });
    const input = screen.getByLabelText(/file-input/i);

    await user.upload(input, [file1, file2]);

    expect(screen.getByText('test1.pdf')).toBeInTheDocument();
    expect(screen.getByText('test2.pdf')).toBeInTheDocument();
    expect(screen.getByText(/upload 2 files/i)).toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(<FileUpload {...defaultProps} className='custom-class' />);

    const container = screen
      .getByText(/drag and drop your files here/i)
      .closest('.file-upload');
    expect(container).toHaveClass('custom-class');
  });
});
