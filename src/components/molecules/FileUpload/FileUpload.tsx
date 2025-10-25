import React, { useCallback, useState } from 'react';
import toast from 'react-hot-toast';

import type { FileUploadComponentProps } from '@/types';

import { Alert } from '../../atoms/Alert/Alert';
import { Button } from '../../atoms/Button/Button';
import { Progress } from '../../atoms/Progress/Progress';

export const FileUpload: React.FC<FileUploadComponentProps> = ({
  accept = '.pdf,.docx,.doc,.txt',
  multiple = false,
  maxSize = 10 * 1024 * 1024, // 10MB
  maxFiles = 1,
  onFileUpload,
  onUpload,
  onError,
  loading = false,
  disabled = false,
  dragAndDrop = true,
  preview = true,
  validation,
  className = '',
  showToast = true,
  ...props
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [errors, setErrors] = useState<string[]>([]);

  const validateFile = useCallback(
    (file: File): string | null => {
      // Check file size
      if (file.size > maxSize) {
        return `File size exceeds ${Math.round(maxSize / (1024 * 1024))}MB limit`;
      }

      // Check file type - default validation for common resume formats
      const fileExtension = file.name.split('.').pop()?.toLowerCase();
      const allowedExtensions = validation?.allowedTypes || [
        'pdf',
        'docx',
        'doc',
        'txt',
      ];
      if (!allowedExtensions.includes(fileExtension || '')) {
        return `File type .${fileExtension} is not allowed`;
      }

      // Custom validation
      if (validation?.custom) {
        return validation.custom(file);
      }

      return null;
    },
    [maxSize, validation]
  );

  const handleFiles = useCallback(
    (files: FileList | File[]) => {
      const fileArray = Array.from(files);
      const newErrors: string[] = [];
      const validFiles: File[] = [];

      // Check file count
      if (fileArray.length > maxFiles) {
        const errorMsg = `Maximum ${maxFiles} file(s) allowed`;
        newErrors.push(errorMsg);
        if (showToast) toast.error(errorMsg);
      }

      // Validate each file
      fileArray.forEach(file => {
        const error = validateFile(file);
        if (error) {
          const errorMsg = `${file.name}: ${error}`;
          newErrors.push(errorMsg);
          if (showToast) toast.error(errorMsg);
        } else {
          validFiles.push(file);
        }
      });

      setErrors(newErrors);
      setSelectedFiles(validFiles);

      // Call onFileUpload immediately when files are selected (for ATSChecker compatibility)
      if (validFiles.length > 0 && onFileUpload) {
        onFileUpload(validFiles);
      }

      if (newErrors.length > 0 && onError) {
        onError(newErrors.join(', '));
      }
    },
    [maxFiles, validateFile, onError, showToast, onFileUpload]
  );

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);

      if (disabled || loading) return;

      const files = e.dataTransfer.files;
      if (files && files.length > 0) {
        handleFiles(files);
      }
    },
    [disabled, loading, handleFiles]
  );

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (files && files.length > 0) {
        handleFiles(files);
      }
    },
    [handleFiles]
  );

  const handleUpload = useCallback(() => {
    if (selectedFiles.length > 0 && onUpload) {
      setUploadProgress(0);
      onUpload(selectedFiles);
    }
  }, [selectedFiles, onUpload]);

  const removeFile = useCallback((index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    setErrors([]);
  }, []);

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
  };

  const getFileIcon = (file: File): string => {
    const extension = file.name.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'pdf':
        return '📄';
      case 'docx':
      case 'doc':
        return '📝';
      case 'txt':
        return '📃';
      default:
        return '📁';
    }
  };

  return (
    <div
      className={`file-upload ${className} ${dragActive ? 'border-cyan-500' : ''}`}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
      {...props}
    >
      {/* Upload Area */}
      <div
        className={`
          relative border-2 border-dashed rounded-lg p-8 text-center transition-colors
          ${dragActive ? 'border-cyan-500 bg-cyan-50' : 'border-gray-300 hover:border-gray-400'}
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          ${loading ? 'pointer-events-none' : ''}
        `}
        onClick={() =>
          !disabled &&
          !loading &&
          document.getElementById('file-input')?.click()
        }
      >
        <input
          id='file-input'
          type='file'
          accept={accept}
          multiple={multiple}
          onChange={handleFileInput}
          className='hidden'
          disabled={disabled || loading}
          aria-label='Upload resume file'
        />
        <label htmlFor='file-input' className='sr-only'>
          Upload resume file
        </label>

        <div className='space-y-4'>
          <div className='text-4xl'>📁</div>
          <div>
            <p className='text-lg font-medium text-gray-900'>
              {dragAndDrop
                ? 'Drag and drop your files here'
                : 'Choose files to upload'}
            </p>
            <p className='text-sm text-gray-500 mt-1'>or click to browse</p>
          </div>
          <div className='text-xs text-gray-400'>
            <p>Supports: {accept}</p>
            <p>Max size: {formatFileSize(maxSize)}</p>
            {maxFiles > 1 && <p>Max files: {maxFiles}</p>}
          </div>
        </div>

        {loading && (
          <div className='absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center rounded-lg'>
            <div className='text-center'>
              <div className='w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-2'></div>
              <p className='text-sm text-gray-600'>Uploading...</p>
            </div>
          </div>
        )}
      </div>

      {/* Progress Bar */}
      {loading && uploadProgress > 0 && (
        <div className='mt-4'>
          <Progress value={uploadProgress} max={100} />
        </div>
      )}

      {/* Error Messages */}
      {errors.length > 0 && (
        <div className='mt-4'>
          {errors.map((error, index) => (
            <Alert key={index} variant='error' className='mb-2'>
              {error}
            </Alert>
          ))}
        </div>
      )}

      {/* File Preview */}
      {preview && selectedFiles.length > 0 && (
        <div className='mt-4 space-y-2'>
          <h4 className='text-sm font-medium text-gray-900'>Selected Files:</h4>
          {selectedFiles.map((file, index) => (
            <div
              key={index}
              className='flex items-center justify-between p-3 bg-gray-50 rounded-lg'
            >
              <div className='flex items-center space-x-3'>
                <span className='text-2xl'>{getFileIcon(file)}</span>
                <div>
                  <p className='text-sm font-medium text-gray-900'>
                    {file.name}
                  </p>
                  <p className='text-xs text-gray-500'>
                    {formatFileSize(file.size)}
                  </p>
                </div>
              </div>
              <button
                onClick={() => removeFile(index)}
                className='text-red-500 hover:text-red-700 text-sm'
                disabled={loading}
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Upload Button */}
      {selectedFiles.length > 0 && !loading && (
        <div className='mt-4'>
          <Button
            onClick={handleUpload}
            variant='primary'
            fullWidth
            disabled={disabled || errors.length > 0}
          >
            Upload {selectedFiles.length} file
            {selectedFiles.length > 1 ? 's' : ''}
          </Button>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
