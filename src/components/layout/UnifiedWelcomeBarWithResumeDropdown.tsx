'use client';

import Link from 'next/link';
import React, { useEffect } from 'react';

import { Button } from '@/components/atoms/Button/Button';
import { UserProfile } from '@/components/auth/UserProfile';
import { Icons } from '@/components/ui/SVG/SVG';
import { useMultiResumeStore } from '@/store/multiResumeStore';
import { useResumeStore } from '@/store/resumeStore';
import { ResumeDropdownContent } from './ResumeDropdownContent';

interface UnifiedWelcomeBarWithResumeDropdownProps {
  currentPage: 'ats-checker' | 'builder' | 'templates' | 'manager';
  analysisResult?: {
    jobType?: string;
    atsScore?: string | number;
  } | null;
  resumeData?: unknown;
  onBackToManager?: () => void;
  onEditInBuilder?: () => void;
  onViewTemplates?: () => void;
  showActionButtons?: boolean;
}

export const UnifiedWelcomeBarWithResumeDropdown: React.FC<
  UnifiedWelcomeBarWithResumeDropdownProps
> = ({
  currentPage,
  analysisResult,
  resumeData,
  onBackToManager,
  onEditInBuilder,
  onViewTemplates,
  showActionButtons = false,
}) => {
  // Use global multi-resume state
  const {
    groups: resumeGroups,
    currentResume,
    isDropdownOpen: showResumeDropdown,
    setDropdownOpen: setShowResumeDropdown,
    selectResume,
    loadGroups,
  } = useMultiResumeStore();

  // Load groups on mount
  useEffect(() => {
    loadGroups();
  }, [loadGroups]);

  const handleResumeSelect = (groupId: string, variantId: string) => {
    selectResume(groupId, variantId);
    // Load resume data into the main resume store
    const resume = useMultiResumeStore.getState().currentResume;
    if (resume) {
      useResumeStore.getState().setResumeData(resume.data);
    }
  };

  const handleGroupsUpdate = () => {
    loadGroups();
  };

  const getPageContent = (): {
    title: string;
    description: string;
    showWelcome: boolean;
    showTemplates: boolean;
    showBuilder: boolean;
    showNavigation: boolean;
  } => {
    switch (currentPage) {
      case 'ats-checker':
        return {
          title: 'ATS Resume Checker',
          description:
            'Get your resume analyzed for ATS compatibility across all job profiles. Receive detailed feedback and optimization suggestions.',
          showWelcome: false,
          showTemplates: !!(resumeData || currentResume),
          showBuilder: !!(resumeData || currentResume),
          showNavigation: false,
        };
      case 'builder':
        return {
          title: 'Resume Builder',
          description:
            'Build and customize your professional resume with our intuitive editor. Your changes are automatically saved and reflected in templates.',
          showWelcome: true,
          showTemplates: true,
          showBuilder: false,
          showNavigation: false,
        };
      case 'templates':
        return {
          title: 'Resume Templates',
          description:
            'Choose from our collection of modern, professional resume templates. Preview with your data and export in multiple formats.',
          showWelcome: false,
          showTemplates: true,
          showBuilder: true,
          showNavigation: false,
        };
      case 'manager':
        return {
          title: 'Resume Manager',
          description:
            'Manage all your resumes, create variants, and compare ATS scores across different versions.',
          showWelcome: false,
          showTemplates: false,
          showBuilder: false,
          showNavigation: false,
        };
      default:
        return {
          title: 'ATS Resume Checker',
          description:
            'Get your resume analyzed for ATS compatibility across all job profiles. Receive detailed feedback and optimization suggestions.',
          showWelcome: false,
          showTemplates: false,
          showBuilder: false,
          showNavigation: false,
        };
    }
  };

  const content = getPageContent();

  return (
    <header className='bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700'>
      <div className='container mx-auto px-4 py-3'>
        <div className='flex items-center justify-between'>
          {/* Logo */}
          <div className='flex items-center space-x-4'>
            <Link
              href='/'
              className='text-2xl font-bold text-blue-600 dark:text-blue-400'
            >
              ResumeAI
            </Link>
          </div>

          {/* Navigation */}
          <nav className='hidden md:flex items-center space-x-6'>
            <Link
              href='/resume/ats-checker'
              className={`nav-link ${currentPage === 'ats-checker' ? 'text-blue-600 font-medium' : 'text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white'}`}
            >
              ATS Checker
            </Link>
            <Link
              href='/resume/builder'
              className={`nav-link ${currentPage === 'builder' ? 'text-blue-600 font-medium' : 'text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white'}`}
            >
              Resume Builder
            </Link>
            <Link
              href='/resume/templates'
              className={`nav-link ${currentPage === 'templates' ? 'text-blue-600 font-medium' : 'text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white'}`}
            >
              Templates
            </Link>
            <Link
              href='/resume/manager'
              className={`nav-link ${currentPage === 'manager' ? 'text-blue-600 font-medium' : 'text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white'}`}
            >
              My Resumes
            </Link>
          </nav>

          {/* Right Side - Resume Dropdown + User Profile */}
          <div className='flex items-center space-x-4'>
            {/* Resume Dropdown */}
            <div className='relative'>
              <button
                onClick={() => setShowResumeDropdown(!showResumeDropdown)}
                className='flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors'
              >
                <span>📄 My Resumes</span>
                <Icons.ChevronDown className='w-4 h-4' />
              </button>

              {showResumeDropdown && (
                <>
                  {/* Backdrop */}
                  <div
                    className='fixed inset-0 z-40'
                    onClick={() => setShowResumeDropdown(false)}
                  />

                  {/* Dropdown */}
                  <div className='absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50'>
                    <ResumeDropdownContent
                      groups={resumeGroups}
                      currentResume={currentResume}
                      onResumeSelect={handleResumeSelect}
                      onClose={() => setShowResumeDropdown(false)}
                      onGroupsUpdate={handleGroupsUpdate}
                    />
                  </div>
                </>
              )}
            </div>

            {/* User Profile */}
            <UserProfile />
          </div>
        </div>

        {/* Page Content */}
        <div className='mt-6'>
          <div className='text-center'>
            <h1 className='text-3xl font-bold text-gray-900 dark:text-white mb-2'>
              {content.title}
            </h1>
            <p className='text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto'>
              {content.description}
            </p>
          </div>

          {/* Action Buttons */}
          {showActionButtons && (
            <div className='flex justify-center space-x-4 mt-6'>
              {onBackToManager && (
                <Button onClick={onBackToManager} variant='outline'>
                  ← Back to Manager
                </Button>
              )}
              {onEditInBuilder && (
                <Button onClick={onEditInBuilder}>✏️ Edit in Builder</Button>
              )}
              {onViewTemplates && (
                <Button onClick={onViewTemplates} variant='outline'>
                  🎨 View Templates
                </Button>
              )}
            </div>
          )}

          {/* Current Resume Info */}
          {currentResume && (
            <div className='mt-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4'>
              <div className='flex items-center justify-between'>
                <div>
                  <h3 className='font-medium text-blue-900 dark:text-blue-100'>
                    Currently Selected: {currentResume.name}
                  </h3>
                  <p className='text-sm text-blue-700 dark:text-blue-300'>
                    Last updated:{' '}
                    {new Date(currentResume.updatedAt).toLocaleDateString()}
                  </p>
                </div>
                {currentResume.bestScore && (
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      currentResume.bestScore >= 80
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300'
                        : currentResume.bestScore >= 60
                          ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300'
                          : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300'
                    }`}
                  >
                    Best: {currentResume.bestScore}%
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
