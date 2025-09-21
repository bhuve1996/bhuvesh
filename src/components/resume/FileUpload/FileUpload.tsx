'use client';

import React, { useCallback, useState } from 'react';

import { Card } from '@/components/ui/Card';

interface FileUploadProps {
  onFileUpload: (file: File) => void;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onFileUpload }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);

      const files = Array.from(e.dataTransfer.files);
      const file = files[0];

      if (file && isValidFileType(file)) {
        setUploadedFile(file);
        onFileUpload(file);
      }
    },
    [onFileUpload]
  );

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file && isValidFileType(file)) {
        setUploadedFile(file);
        onFileUpload(file);
      }
    },
    [onFileUpload]
  );

  const isValidFileType = (file: File): boolean => {
    const validTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/msword',
      'text/plain',
    ];
    return validTypes.includes(file.type);
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
  };

  return (
    <Card className='p-8'>
      <div className='text-center'>
        <h2 className='text-2xl font-bold mb-4 text-white'>
          Upload Your Resume
        </h2>
        <p className='text-gray-300 mb-6'>
          Drag and drop your resume file or click to browse
        </p>

        <div
          className={`border-2 border-dashed rounded-lg p-8 transition-colors ${
            isDragOver
              ? 'border-cyan-400 bg-cyan-400/10'
              : 'border-gray-600 hover:border-gray-500'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className='flex flex-col items-center space-y-4'>
            <div className='w-16 h-16 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full flex items-center justify-center'>
              <svg
                className='w-8 h-8 text-white'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12'
                />
              </svg>
            </div>

            <div>
              <p className='text-lg font-medium text-white'>
                {isDragOver
                  ? 'Drop your file here'
                  : 'Choose a file or drag it here'}
              </p>
              <p className='text-sm text-gray-400 mt-1'>
                Supports PDF, DOCX, DOC, and TXT files (Max 10MB)
              </p>
            </div>

            <input
              type='file'
              accept='.pdf,.docx,.doc,.txt'
              onChange={handleFileSelect}
              className='hidden'
              id='file-upload'
            />
            <label
              htmlFor='file-upload'
              className='px-6 py-3 bg-gradient-to-r from-cyan-400 to-blue-500 text-white rounded-lg hover:from-cyan-500 hover:to-blue-600 transition-all cursor-pointer font-medium'
            >
              Browse Files
            </label>
          </div>
        </div>

        {uploadedFile && (
          <div className='mt-6 p-4 bg-green-500/10 border border-green-500/20 rounded-lg'>
            <div className='flex items-center space-x-3'>
              <div className='w-8 h-8 bg-green-500 rounded-full flex items-center justify-center'>
                <svg
                  className='w-5 h-5 text-white'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M5 13l4 4L19 7'
                  />
                </svg>
              </div>
              <div>
                <p className='text-green-400 font-medium'>
                  {uploadedFile.name}
                </p>
                <p className='text-green-300 text-sm'>
                  {formatFileSize(uploadedFile.size)}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};
