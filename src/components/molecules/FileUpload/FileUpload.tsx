import React, { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';

import { useTheme } from '@/contexts/ThemeContext';
import { formatFileSize, getFileIcon } from '@/lib/utils/componentUtils';
import {
  detectMobileDevice,
  getAdaptiveUploadConfig,
  hasMobileChromeIssues,
} from '@/lib/utils/mobileDetection';
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
  const [mobileConfig, setMobileConfig] = useState(detectMobileDevice());
  const [adaptiveConfig, setAdaptiveConfig] = useState(
    getAdaptiveUploadConfig()
  );
  const [showMobileTips, setShowMobileTips] = useState(true);

  // Update mobile config on mount and when window resizes
  useEffect(() => {
    const updateConfig = () => {
      setMobileConfig(detectMobileDevice());
      setAdaptiveConfig(getAdaptiveUploadConfig());
    };

    updateConfig();
    window.addEventListener('resize', updateConfig);
    return () => window.removeEventListener('resize', updateConfig);
  }, []);

  // Load mobile tips preference from localStorage
  useEffect(() => {
    if (mobileConfig.isMobile) {
      const savedPreference = localStorage.getItem('mobile-upload-tips-hidden');
      if (savedPreference === 'true') {
        setShowMobileTips(false);
      }
    }
  }, [mobileConfig.isMobile]);

  // Save mobile tips preference to localStorage
  const handleToggleMobileTips = useCallback(
    (show: boolean) => {
      setShowMobileTips(show);
      if (mobileConfig.isMobile) {
        localStorage.setItem('mobile-upload-tips-hidden', (!show).toString());
      }
    },
    [mobileConfig.isMobile]
  );

  // Use adaptive max size for mobile devices
  const effectiveMaxSize = mobileConfig.isMobile
    ? adaptiveConfig.maxSize
    : maxSize;
  const effectiveDragAndDrop = mobileConfig.supportsDragDrop && dragAndDrop;

  const validateFile = useCallback(
    (file: File): string | null => {
      // Check file size against effective max size
      if (file.size > effectiveMaxSize) {
        return `File size exceeds ${Math.round(effectiveMaxSize / (1024 * 1024))}MB limit${mobileConfig.isMobile ? ' (mobile)' : ''}`;
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

      // Mobile-specific validations
      if (mobileConfig.isMobileChrome && hasMobileChromeIssues()) {
        // Additional validation for problematic mobile Chrome
        if (file.name.includes(' ')) {
          return 'File names with spaces may cause issues on mobile Chrome. Please rename the file.';
        }
      }

      // Custom validation
      if (validation?.custom) {
        return validation.custom(file);
      }

      return null;
    },
    [effectiveMaxSize, validation, mobileConfig]
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

  const handleDrag = useCallback(
    (e: React.DragEvent) => {
      // Only handle drag events on desktop devices
      if (!effectiveDragAndDrop) return;

      e.preventDefault();
      e.stopPropagation();
      if (e.type === 'dragenter' || e.type === 'dragover') {
        setDragActive(true);
      } else if (e.type === 'dragleave') {
        setDragActive(false);
      }
    },
    [effectiveDragAndDrop]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      // Only handle drop events on desktop devices
      if (!effectiveDragAndDrop) return;

      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);

      if (disabled || loading) return;

      const files = e.dataTransfer.files;
      if (files && files.length > 0) {
        handleFiles(files);
      }
    },
    [disabled, loading, handleFiles, effectiveDragAndDrop]
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
            dragActive && effectiveDragAndDrop
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
        onClick={() => {
          const fileInput = document.getElementById(
            'file-input'
          ) as HTMLInputElement;
          if (fileInput && !fileInput.disabled) {
            fileInput.click();
          }
        }}
        onDragEnter={effectiveDragAndDrop ? handleDrag : undefined}
        onDragLeave={effectiveDragAndDrop ? handleDrag : undefined}
        onDragOver={effectiveDragAndDrop ? handleDrag : undefined}
        onDrop={effectiveDragAndDrop ? handleDrop : undefined}
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
              {effectiveDragAndDrop
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
            <p>
              Max size: {formatFileSize(effectiveMaxSize)}
              {mobileConfig.isMobile ? ' (mobile)' : ''}
            </p>
            {maxFiles > 1 && <p>Max files: {maxFiles}</p>}
          </div>

          {/* Mobile-specific messaging */}
          {mobileConfig.isMobile && showMobileTips && (
            <div
              className={`
                text-xs sm:text-sm p-3 rounded-md mt-2 relative
                ${theme === 'dark' ? 'bg-blue-900/20 text-blue-300 border border-blue-800' : 'bg-blue-50 text-blue-700 border border-blue-200'}
              `}
            >
              {/* Close button */}
              <button
                onClick={() => handleToggleMobileTips(false)}
                className={`
                  absolute top-2 right-2 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold
                  ${theme === 'dark' ? 'hover:bg-blue-800 text-blue-200' : 'hover:bg-blue-100 text-blue-600'}
                  transition-colors duration-200
                `}
                aria-label='Close mobile tips'
                title='Close tips'
              >
                ×
              </button>

              <div className='pr-6'>
                <p className='font-medium mb-2 flex items-center'>
                  📱 Mobile Upload Tips
                </p>
                <ul className='text-left space-y-1'>
                  <li>
                    • Max file size:{' '}
                    {Math.round(effectiveMaxSize / (1024 * 1024))}MB
                  </li>
                  <li>• Avoid files with spaces in names</li>
                  <li>• Ensure stable internet connection</li>
                  {mobileConfig.isMobileChrome && (
                    <li>• If upload fails, try refreshing the page</li>
                  )}
                </ul>
              </div>
            </div>
          )}

          {/* Show tips button when tips are hidden */}
          {mobileConfig.isMobile && !showMobileTips && (
            <button
              onClick={() => handleToggleMobileTips(true)}
              className={`
                text-xs sm:text-sm p-2 rounded-md mt-2 w-full
                ${theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' : 'bg-gray-100 hover:bg-gray-200 text-gray-600'}
                transition-colors duration-200 flex items-center justify-center space-x-2
              `}
            >
              <span>📱</span>
              <span>Show Mobile Upload Tips</span>
            </button>
          )}
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
