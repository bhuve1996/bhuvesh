'use client';

import { useEffect, useState } from 'react';

import { UnifiedWelcomeBarWithResumeDropdown } from '@/components/layout/UnifiedWelcomeBarWithResumeDropdown';
import { FileUploadWithResumeNaming } from '@/components/molecules/FileUpload/FileUploadWithResumeNaming';
import { multiResumeStorage } from '@/lib/resume/multiResumeStorage';
import { ResumeGroup } from '@/types/multiResume';

export default function ResumeDemoPage() {
  const [groups, setGroups] = useState<ResumeGroup[]>([]);

  useEffect(() => {
    setGroups(multiResumeStorage.getResumeGroups());
  }, []);

  const handleFileUpload = (
    _files: File[],
    _resumeName?: string,
    _groupId?: string
  ) => {
    // File uploaded successfully
  };

  const handleResumeCreated = (_groupId: string, _variantId: string) => {
    // Resume created successfully
    // Refresh groups
    setGroups(multiResumeStorage.getResumeGroups());
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-background to-muted'>
      <UnifiedWelcomeBarWithResumeDropdown currentPage='manager' />

      <main className='container mx-auto px-4 py-6'>
        <div className='max-w-4xl mx-auto space-y-8'>
          {/* Header */}
          <div className='text-center'>
            <h1 className='text-3xl font-bold text-gray-900 dark:text-white mb-4'>
              Multi-Resume Management Demo
            </h1>
            <p className='text-lg text-gray-600 dark:text-gray-400'>
              Upload resumes, organize them into groups, and manage multiple
              variants
            </p>
          </div>

          {/* File Upload */}
          <div className='bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700'>
            <h2 className='text-xl font-semibold text-gray-900 dark:text-white mb-4'>
              Upload New Resume
            </h2>
            <FileUploadWithResumeNaming
              onFileUpload={handleFileUpload}
              onResumeCreated={handleResumeCreated}
            />
          </div>

          {/* Current Groups */}
          <div className='bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700'>
            <h2 className='text-xl font-semibold text-gray-900 dark:text-white mb-4'>
              Resume Groups ({groups.length})
            </h2>

            {groups.length === 0 ? (
              <div className='text-center py-8 text-gray-500 dark:text-gray-400'>
                <div className='text-4xl mb-2'>📄</div>
                <p>No resume groups yet</p>
                <p className='text-sm'>Upload a resume to get started</p>
              </div>
            ) : (
              <div className='space-y-4'>
                {groups.map(group => (
                  <div
                    key={group.id}
                    className='border border-gray-200 dark:border-gray-700 rounded-lg p-4'
                  >
                    <div className='flex items-center justify-between mb-2'>
                      <h3 className='font-medium text-gray-900 dark:text-white'>
                        {group.name}
                      </h3>
                      <span className='text-sm text-gray-500 dark:text-gray-400'>
                        {group.variants.length} resume
                        {group.variants.length !== 1 ? 's' : ''}
                      </span>
                    </div>

                    {group.description && (
                      <p className='text-sm text-gray-600 dark:text-gray-400 mb-3'>
                        {group.description}
                      </p>
                    )}

                    <div className='space-y-2'>
                      {group.variants.map(variant => (
                        <div
                          key={variant.id}
                          className='flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded'
                        >
                          <div>
                            <div className='font-medium text-gray-900 dark:text-white'>
                              {variant.name}
                            </div>
                            <div className='text-xs text-gray-500 dark:text-gray-400'>
                              Updated:{' '}
                              {new Date(variant.updatedAt).toLocaleDateString()}
                            </div>
                          </div>
                          <div className='flex items-center space-x-2'>
                            {variant.bestScore && (
                              <span
                                className={`px-2 py-1 rounded text-xs font-medium ${
                                  variant.bestScore >= 80
                                    ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300'
                                    : variant.bestScore >= 60
                                      ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300'
                                      : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300'
                                }`}
                              >
                                {variant.bestScore}%
                              </span>
                            )}
                            <span className='text-xs text-gray-500 dark:text-gray-400'>
                              {variant.analyses.length} analysis
                              {variant.analyses.length !== 1 ? 'es' : ''}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Instructions */}
          <div className='bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6'>
            <h3 className='font-semibold text-blue-900 dark:text-blue-100 mb-2'>
              How to use:
            </h3>
            <ul className='text-sm text-blue-800 dark:text-blue-200 space-y-1'>
              <li>• Upload a resume file using the upload area above</li>
              <li>• Give it a name (or use the filename as backup)</li>
              <li>• Choose an existing group or create a new one</li>
              <li>
                • Duplicate names will automatically get numbers (e.g.,
                &quot;Resume 1&quot;, &quot;Resume 2&quot;)
              </li>
              <li>
                • Use the &quot;My Resumes&quot; dropdown in the top navigation
                to manage resumes
              </li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}
