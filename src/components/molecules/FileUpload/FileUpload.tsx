import React, { useCallback, useState } from 'react';
import toast from 'react-hot-toast';

import { useTheme } from '@/contexts/ThemeContext';
import { formatFileSize, getFileIcon } from '@/lib/utils/componentUtils';
import { getThemeClasses } from '@/lib/utils/themeUtils';
import type { FileUploadComponentProps } from '@/types';

import { Alert } from '../../atoms/Alert/Alert';
import { Progress } from '../../atoms/Progress/Progress';

export const FileUpload: React.FC<FileUploadComponentProps> = ({
  accept = '.pdf,.docx,.doc,.txt',
  multiple = false,
  maxSize = 10 * 1024 * 1024, // 10MB
  maxFiles = 1,
  onFileUpload,
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
  const { theme } = useTheme();
  const [dragActive, setDragActive] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploadProgress] = useState(0);
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

  const removeFile = useCallback((index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    setErrors([]);
  }, []);

  // Using centralized utilities for file operations

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
          relative border-2 border-dashed rounded-lg p-4 sm:p-6 md:p-8 text-center transition-colors
          ${
            dragActive
              ? theme === 'dark'
                ? 'border-cyan-400 bg-cyan-900/20'
                : 'border-cyan-500 bg-cyan-50'
              : theme === 'dark'
                ? 'border-gray-600 hover:border-gray-500'
                : 'border-gray-300 hover:border-gray-400'
          }
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

        <div className='space-y-3 sm:space-y-4'>
          <div className='text-3xl sm:text-4xl'>📁</div>
          <div>
            <p
              className={`text-base sm:text-lg font-medium ${getThemeClasses(theme).text.primary}`}
            >
              {dragAndDrop
                ? 'Drag and drop your files here'
                : 'Choose files to upload'}
            </p>
            <p
              className={`text-xs sm:text-sm mt-1 ${getThemeClasses(theme).text.muted}`}
            >
              or click to browse
            </p>
          </div>
          <div
            className={`text-xs ${
              theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
            }`}
          >
            <p>Supports: {accept}</p>
            <p>Max size: {formatFileSize(maxSize)}</p>
            {maxFiles > 1 && <p>Max files: {maxFiles}</p>}
          </div>
        </div>

        {loading && (
          <div
            className={`absolute inset-0 flex items-center justify-center rounded-lg ${
              theme === 'dark'
                ? 'bg-slate-900 bg-opacity-90'
                : 'bg-white bg-opacity-75'
            }`}
          >
            <div className='text-center'>
              <div
                className={`w-8 h-8 border-2 border-t-transparent rounded-full animate-spin mx-auto mb-2 ${
                  theme === 'dark' ? 'border-cyan-400' : 'border-cyan-500'
                }`}
              ></div>
              <p
                className={`text-sm ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                }`}
              >
                Uploading...
              </p>
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
          <h4
            className={`text-sm font-medium ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}
          >
            Selected Files:
          </h4>
          {selectedFiles.map((file, index) => (
            <div
              key={index}
              className={`flex items-center justify-between p-3 rounded-lg ${
                theme === 'dark' ? 'bg-slate-800' : 'bg-gray-50'
              }`}
            >
              <div className='flex items-center space-x-3'>
                <span className='text-2xl'>{getFileIcon(file.name)}</span>
                <div>
                  <p
                    className={`text-sm font-medium ${
                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}
                  >
                    {file.name}
                  </p>
                  <p
                    className={`text-xs ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                    }`}
                  >
                    {formatFileSize(file.size)}
                  </p>
                </div>
              </div>
              <button
                onClick={() => removeFile(index)}
                className={`text-sm ${
                  theme === 'dark'
                    ? 'text-red-400 hover:text-red-300'
                    : 'text-red-500 hover:text-red-700'
                }`}
                disabled={loading}
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Upload Button - Removed for immediate processing */}
    </div>
  );
};

export default FileUpload;
