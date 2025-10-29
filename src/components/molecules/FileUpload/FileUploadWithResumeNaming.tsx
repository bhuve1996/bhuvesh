'use client';

import React, { useState } from 'react';

import { ResumeNamingModal } from '@/components/modals/ResumeNamingModal';
import { atsApi } from '@/lib/ats/api';
import { formatFileSize, getFileIcon } from '@/lib/utils/componentUtils';
import { useMultiResumeStore } from '@/store/multiResumeStore';
import { useResumeStore } from '@/store/resumeStore';
import { ResumeData, ResumeDataUtils } from '@/types/resume';

interface FileUploadWithResumeNamingProps {
  accept?: string;
  maxSize?: number;
  onFileUpload?: (files: File[], resumeName?: string, groupId?: string) => void;
  onResumeCreated?: (groupId: string, variantId: string) => void;
  loading?: boolean;
  disabled?: boolean;
  className?: string;
}

export const FileUploadWithResumeNaming: React.FC<
  FileUploadWithResumeNamingProps
> = ({
  accept = '.pdf,.docx,.doc,.txt',
  maxSize = 10 * 1024 * 1024, // 10MB
  onFileUpload,
  onResumeCreated,
  loading = false,
  disabled = false,
  className = '',
}) => {
  // Remove unused theme
  const [dragActive, setDragActive] = useState(false);
  const [showNameModal, setShowNameModal] = useState(false);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file
    if (file.size > maxSize) {
      alert(`File size must be less than ${formatFileSize(maxSize)}`);
      return;
    }

    setPendingFile(file);
    setShowNameModal(true);
  };

  const { addResume, addGroup, groups } = useMultiResumeStore();

  const handleNameSubmit = async (resumeName: string, groupId?: string) => {
    if (!pendingFile) return;

    setIsProcessing(true);
    try {
      // Process the file first
      const result = await atsApi.uploadFile(pendingFile);

      if (result.success && result.data) {
        // Create basic ResumeData from parsed content
        const resumeData: ResumeData = {
          personal: {
            fullName: '',
            email: '',
            phone: '',
            location: '',
            linkedin: '',
            github: '',
            portfolio: '',
            jobTitle: '',
          },
          summary: result.data.text || '',
          experience: [],
          education: [],
          skills: {
            technical: [],
            business: [],
            soft: [],
            languages: [],
            certifications: [],
          },
          projects: [],
          achievements: [],
          certifications: [],
          hobbies: [],
        };

        // Clean the data using ResumeDataUtils
        const cleanedData = ResumeDataUtils.cleanResumeData(resumeData);

        // Save to multi-resume storage using global state
        let finalGroupId = groupId;
        if (!finalGroupId) {
          // Use first group or create default
          if (groups.length === 0) {
            finalGroupId = addGroup('My Resumes');
          } else {
            finalGroupId = groups[0]?.id;
          }
        }

        if (finalGroupId) {
          const variantId = addResume(
            finalGroupId,
            resumeName,
            cleanedData,
            'unknown'
          );

          // Call the original onFileUpload if provided
          if (onFileUpload) {
            onFileUpload([pendingFile], resumeName, finalGroupId);
          }

          // Call the resume created callback
          if (onResumeCreated) {
            onResumeCreated(finalGroupId, variantId);
          }

          // Load the resume data into the global store
          useResumeStore.getState().setResumeData(cleanedData);
        }
      } else {
        throw new Error(result.message || 'Failed to parse resume');
      }
    } catch (_error) {
      // Error processing file
      alert('Failed to process resume file. Please try again.');
    } finally {
      setIsProcessing(false);
      setShowNameModal(false);
      setPendingFile(null);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (disabled || loading) return;

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      const file = files[0];
      if (file && file.size <= maxSize) {
        setPendingFile(file);
        setShowNameModal(true);
      } else {
        alert(`File size must be less than ${formatFileSize(maxSize)}`);
      }
    }
  };

  // Remove unused variable

  return (
    <>
      <div
        className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          dragActive
            ? 'border-blue-400 bg-blue-50 dark:bg-blue-900/20'
            : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} ${className}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() =>
          !disabled &&
          !loading &&
          document.getElementById('file-upload')?.click()
        }
      >
        <input
          id='file-upload'
          type='file'
          accept={accept}
          onChange={handleFileChange}
          disabled={disabled || loading}
          className='hidden'
        />

        <div className='space-y-4'>
          <div className='text-4xl'>{getFileIcon(pendingFile?.name || '')}</div>

          <div>
            <h3 className='text-lg font-medium text-gray-900 dark:text-white'>
              {loading || isProcessing ? 'Processing...' : 'Upload Resume'}
            </h3>
            <p className='text-sm text-gray-500 dark:text-gray-400'>
              Drag and drop your resume here, or click to browse
            </p>
            <p className='text-xs text-gray-400 dark:text-gray-500 mt-1'>
              Supports {accept} files up to {formatFileSize(maxSize)}
            </p>
          </div>

          {loading || isProcessing ? (
            <div className='w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2'>
              <div
                className='bg-blue-600 h-2 rounded-full animate-pulse'
                style={{ width: '60%' }}
              />
            </div>
          ) : (
            <button
              type='button'
              disabled={disabled || loading}
              className='px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
            >
              Choose File
            </button>
          )}
        </div>
      </div>

      {/* Resume Naming Modal */}
      {showNameModal && pendingFile && (
        <ResumeNamingModal
          fileName={pendingFile.name}
          onSubmit={handleNameSubmit}
          onClose={() => {
            setShowNameModal(false);
            setPendingFile(null);
          }}
        />
      )}
    </>
  );
};
