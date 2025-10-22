'use client';

import React, { useEffect, useState } from 'react';

import { atsApi } from '@/api/endpoints/ats';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { CloudResume, cloudStorage } from '@/lib/resume/cloudStorage';

interface ResumeManagerProps {
  onResumeSelect: (resume: CloudResume) => void;
  onNewResume: () => void;
  currentResumeId?: string | undefined;
}

export const ResumeManager: React.FC<ResumeManagerProps> = ({
  onResumeSelect,
  onNewResume,
  currentResumeId,
}) => {
  const [resumes, setResumes] = useState<CloudResume[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showImportModal, setShowImportModal] = useState(false);
  const [importData, setImportData] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    loadResumes();
  }, []);

  const loadResumes = () => {
    const savedResumes = cloudStorage.getResumes();
    setResumes(savedResumes);
  };

  const handleDeleteResume = (resumeId: string) => {
    if (
      confirm(
        'Are you sure you want to delete this resume? This action cannot be undone.'
      )
    ) {
      cloudStorage.deleteResume(resumeId);
      loadResumes();
    }
  };

  const handleRenameResume = (resumeId: string, newName: string) => {
    cloudStorage.renameResume(resumeId, newName);
    loadResumes();
  };

  const handleExportResume = (resumeId: string) => {
    try {
      const data = cloudStorage.exportResume(resumeId);
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `resume-${resumeId}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch {
      alert('Failed to export resume');
    }
  };

  const handleImportResume = () => {
    try {
      cloudStorage.importResume(importData);
      setImportData('');
      setShowImportModal(false);
      loadResumes();
      alert('Resume imported successfully!');
    } catch (error) {
      alert(`Failed to import resume: ${(error as Error).message}`);
    }
  };

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Check file type
    const allowedTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/msword',
    ];
    if (!allowedTypes.includes(file.type)) {
      alert('Please upload a PDF or DOCX file.');
      return;
    }

    // Check file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert('File size must be less than 10MB.');
      return;
    }

    setIsUploading(true);

    try {
      // Use the existing ATS API to upload and parse the file
      const result = await atsApi.uploadFile(file);

      // Create a new resume from the uploaded file data
      const resumeName = file.name.replace(/\.[^/.]+$/, ''); // Remove file extension
      const newResumeId = cloudStorage.saveResume(
        resumeName,
        result as unknown as any, // Backend returns { success: true, data: {...}, message: "..." }
        'unknown'
      );

      loadResumes();
      alert('Resume uploaded and processed successfully!');

      // Auto-select the newly created resume
      const newResume = cloudStorage.getResume(newResumeId);
      if (newResume) {
        onResumeSelect(newResume);
      }
    } catch (error) {
      // console.error('Upload error:', error);
      alert('Failed to upload and process resume. Please try again.');
    } finally {
      setIsUploading(false);
      // Reset the file input
      event.target.value = '';
    }
  };

  const filteredResumes = resumes.filter(
    resume =>
      resume.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resume.tags.some(tag =>
        tag.toLowerCase().includes(searchQuery.toLowerCase())
      )
  );

  return (
    <div className='max-w-6xl mx-auto p-6'>
      <div className='mb-8'>
        <h1 className='text-3xl font-bold text-gray-900 mb-2'>
          Resume Manager
        </h1>
        <p className='text-gray-600'>
          Manage your saved resumes, create new ones, or import existing
          resumes.
        </p>
      </div>

      {/* Actions */}
      <div className='mb-6 flex flex-col sm:flex-row gap-4'>
        <Button onClick={onNewResume} className='bg-cyan-500 hover:bg-cyan-600'>
          <svg
            className='w-4 h-4 mr-2'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M12 4v16m8-8H4'
            />
          </svg>
          Create New Resume
        </Button>

        <div className='relative'>
          <input
            type='file'
            accept='.pdf,.docx,.doc'
            onChange={handleFileUpload}
            className='absolute inset-0 w-full h-full opacity-0 cursor-pointer'
            disabled={isUploading}
          />
          <Button
            variant='outline'
            className={`${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={isUploading}
          >
            <svg
              className='w-4 h-4 mr-2'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10'
              />
            </svg>
            {isUploading ? 'Uploading...' : 'Upload Resume File'}
          </Button>
        </div>

        <Button variant='outline' onClick={() => setShowImportModal(true)}>
          <svg
            className='w-4 h-4 mr-2'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10'
            />
          </svg>
          Import JSON
        </Button>
      </div>

      {/* Search */}
      <div className='mb-6'>
        <input
          type='text'
          placeholder='Search resumes...'
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-400 focus:border-transparent'
        />
      </div>

      {/* Resumes Grid */}
      {filteredResumes.length > 0 ? (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {filteredResumes.map(resume => (
            <Card
              key={resume.id}
              className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
                currentResumeId === resume.id
                  ? 'ring-2 ring-cyan-400 shadow-lg'
                  : 'hover:shadow-md'
              }`}
            >
              <div className='p-6'>
                <div className='flex items-start justify-between mb-4'>
                  <h3 className='text-lg font-semibold text-gray-900 truncate'>
                    {resume.name}
                  </h3>
                  <div className='flex space-x-1'>
                    <button
                      onClick={e => {
                        e.stopPropagation();
                        const newName = prompt('Enter new name:', resume.name);
                        if (newName && newName.trim()) {
                          handleRenameResume(resume.id, newName.trim());
                        }
                      }}
                      className='p-1 text-gray-400 hover:text-gray-600'
                      title='Rename'
                    >
                      <svg
                        className='w-4 h-4'
                        fill='none'
                        stroke='currentColor'
                        viewBox='0 0 24 24'
                      >
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth={2}
                          d='M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z'
                        />
                      </svg>
                    </button>
                    <button
                      onClick={e => {
                        e.stopPropagation();
                        handleExportResume(resume.id);
                      }}
                      className='p-1 text-gray-400 hover:text-gray-600'
                      title='Export'
                    >
                      <svg
                        className='w-4 h-4'
                        fill='none'
                        stroke='currentColor'
                        viewBox='0 0 24 24'
                      >
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth={2}
                          d='M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
                        />
                      </svg>
                    </button>
                    <button
                      onClick={e => {
                        e.stopPropagation();
                        handleDeleteResume(resume.id);
                      }}
                      className='p-1 text-gray-400 hover:text-red-600'
                      title='Delete'
                    >
                      <svg
                        className='w-4 h-4'
                        fill='none'
                        stroke='currentColor'
                        viewBox='0 0 24 24'
                      >
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth={2}
                          d='M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16'
                        />
                      </svg>
                    </button>
                  </div>
                </div>

                <div className='space-y-2 mb-4'>
                  <p className='text-sm text-gray-600'>
                    <strong>Template:</strong> {resume.templateId}
                  </p>
                  <p className='text-sm text-gray-600'>
                    <strong>Versions:</strong> {resume.versions.length}
                  </p>
                  <p className='text-sm text-gray-600'>
                    <strong>Last Updated:</strong>{' '}
                    {new Date(resume.updatedAt).toLocaleDateString()}
                  </p>
                </div>

                {resume.tags.length > 0 && (
                  <div className='mb-4'>
                    <div className='flex flex-wrap gap-1'>
                      {resume.tags.map((tag, index) => (
                        <span
                          key={index}
                          className='px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full'
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <Button
                  onClick={() => onResumeSelect(resume)}
                  className='w-full'
                  variant={
                    currentResumeId === resume.id ? 'default' : 'outline'
                  }
                >
                  {currentResumeId === resume.id
                    ? 'Currently Open'
                    : 'Open Resume'}
                </Button>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className='text-center py-12'>
          <div className='w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center'>
            <svg
              className='w-8 h-8 text-gray-400'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29-1.009-5.824-2.709M15 6.291A7.962 7.962 0 0012 5c-2.34 0-4.29 1.009-5.824 2.709'
              />
            </svg>
          </div>
          <h3 className='text-lg font-medium text-gray-900 mb-2'>
            {searchQuery ? 'No resumes found' : 'No resumes yet'}
          </h3>
          <p className='text-gray-600 mb-4'>
            {searchQuery
              ? 'Try adjusting your search criteria.'
              : 'Create your first resume to get started.'}
          </p>
          {!searchQuery && (
            <Button onClick={onNewResume}>Create Your First Resume</Button>
          )}
        </div>
      )}

      {/* Import Modal */}
      {showImportModal && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
          <div className='bg-white rounded-lg p-6 max-w-md w-full mx-4'>
            <h3 className='text-lg font-semibold mb-4'>Import Resume</h3>
            <textarea
              value={importData}
              onChange={e => setImportData(e.target.value)}
              placeholder='Paste your resume JSON data here...'
              className='w-full h-32 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-400 focus:border-transparent'
            />
            <div className='flex justify-end space-x-2 mt-4'>
              <Button
                variant='outline'
                onClick={() => {
                  setShowImportModal(false);
                  setImportData('');
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleImportResume}
                disabled={!importData.trim()}
              >
                Import
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResumeManager;
