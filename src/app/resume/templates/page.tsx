'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';

import { ImprovedPaginatedTemplatePreview } from '@/components/resume/templates/ImprovedPaginatedTemplatePreview';
import { ResumeTemplateRenderer } from '@/components/resume/templates/ResumeTemplateRenderer';
import { TemplateCarousel } from '@/components/resume/templates/TemplateCarousel';
import { UnifiedFloatingPanel } from '@/components/resume/UnifiedFloatingPanel';
import { ValidationModal } from '@/components/resume/ValidationModal';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { cloudStorage } from '@/lib/resume/cloudStorage';
import { exportResume } from '@/lib/resume/exportUtils';
import { modernTemplates } from '@/lib/resume/templates';
import { validateResumeData, ValidationResult } from '@/lib/resume/validation';
import { useResumeStore } from '@/store/resumeStore';
import { ResumeData, ResumeTemplate } from '@/types/resume';

export default function TemplateGalleryPage() {
  // Use global state
  const userResumeData = useResumeStore(state => state.resumeData);
  const selectedTemplate = useResumeStore(state => state.selectedTemplate);
  const {
    setUseUserData,
    setResumeData,
    setSelectedTemplate,
    useUserData,
    showDataChoice,
    setShowDataChoice,
  } = useResumeStore();

  // Local state
  const [customizedTemplate, setCustomizedTemplate] =
    useState<ResumeTemplate | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showValidationModal, setShowValidationModal] = useState(false);
  const [validationResult, setValidationResult] =
    useState<ValidationResult | null>(null);
  const [pendingExportFormat, setPendingExportFormat] = useState<
    'pdf' | 'docx' | 'txt' | null
  >(null);
  const [viewMode, setViewMode] = useState<'grid' | 'carousel'>('carousel');
  const [showMobileExportMenu, setShowMobileExportMenu] = useState(false);
  const [isCarouselCollapsed, setIsCarouselCollapsed] = useState(false);
  const [previewMode, setPreviewMode] = useState<'full' | 'paginated'>(
    'paginated'
  );

  // Filter templates
  const filteredTemplates = modernTemplates.filter(template => {
    const matchesSearch =
      template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  // Get preview data
  const getPreviewData = (): ResumeData => {
    if (useUserData && userResumeData) {
      return userResumeData;
    }

    // Return sample data
    return {
      personal: {
        fullName: 'John Doe',
        email: 'john.doe@email.com',
        phone: '+1 (555) 123-4567',
        location: 'San Francisco, CA',
        linkedin: 'linkedin.com/in/johndoe',
        github: 'github.com/johndoe',
        portfolio: 'johndoe.dev',
      },
      summary:
        'Experienced software engineer with 5+ years of experience in full-stack development. Passionate about creating scalable web applications and leading development teams.',
      experience: [
        {
          id: '1',
          company: 'Tech Corp',
          position: 'Senior Software Engineer',
          location: 'San Francisco, CA',
          startDate: '2022-01',
          endDate: 'present',
          current: true,
          description:
            'Led development of microservices architecture serving 1M+ users. Implemented CI/CD pipelines reducing deployment time by 60%.',
          achievements: [
            'Reduced system latency by 40%',
            'Mentored 3 junior developers',
            'Implemented automated testing suite',
          ],
        },
      ],
      education: [
        {
          id: '1',
          institution: 'University of California',
          degree: 'Bachelor of Science in Computer Science',
          field: 'Computer Science',
          location: 'Berkeley, CA',
          startDate: '2016-09',
          endDate: '2020-05',
          current: false,
          gpa: '3.8',
        },
      ],
      skills: {
        technical: [
          'JavaScript',
          'TypeScript',
          'React',
          'Node.js',
          'Python',
          'AWS',
        ],
        business: [
          'Project Management',
          'Team Leadership',
          'Agile Development',
        ],
        soft: ['Communication', 'Problem Solving', 'Critical Thinking'],
        languages: ['English (Native)', 'Spanish (Conversational)'],
        certifications: [
          'AWS Certified Developer',
          'Google Cloud Professional',
        ],
      },
      projects: [
        {
          id: '1',
          name: 'E-commerce Platform',
          description:
            'Full-stack e-commerce solution with React frontend and Node.js backend',
          technologies: ['React', 'Node.js', 'MongoDB', 'Stripe API'],
          url: 'https://example.com',
          startDate: '2023-01',
          endDate: '2023-06',
        },
      ],
      achievements: [
        'Led team of 5 developers in successful product launch',
        'Reduced application load time by 50% through optimization',
        'Implemented automated testing reducing bugs by 30%',
      ],
    };
  };

  // Handle template selection
  const handleTemplateSelect = (template: ResumeTemplate) => {
    setSelectedTemplate(template);
    setCustomizedTemplate(null);
  };

  // Handle validation modal actions
  const handleValidationProceed = async () => {
    if (!pendingExportFormat || !selectedTemplate) return;

    try {
      await exportResume(
        pendingExportFormat,
        customizedTemplate || selectedTemplate,
        getPreviewData()
      );
    } catch {
      // Export failed
    } finally {
      setShowValidationModal(false);
      setPendingExportFormat(null);
      setValidationResult(null);
    }
  };

  const handleValidationCancel = () => {
    setShowValidationModal(false);
    setPendingExportFormat(null);
    setValidationResult(null);
  };

  // Handle data choice
  const handleDataChoice = (useUserData: boolean) => {
    setUseUserData(useUserData);
    setShowDataChoice(false);
  };

  // Keyboard shortcuts for carousel toggle
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (viewMode === 'carousel') {
        if (event.key === 'Escape' && !isCarouselCollapsed) {
          setIsCarouselCollapsed(true);
        } else if (event.key === 'Enter' && isCarouselCollapsed) {
          setIsCarouselCollapsed(false);
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [viewMode, isCarouselCollapsed]);

  // Load user data on mount
  useEffect(() => {
    const loadUserData = async () => {
      try {
        if (userResumeData) {
          setResumeData(userResumeData);
        } else {
          // Check cloud storage for saved resumes
          const savedResumes = cloudStorage.getResumes();
          if (savedResumes.length > 0) {
            const latestResume = savedResumes[0];
            if (latestResume) {
              const resumeData = cloudStorage.getResume(latestResume.id);
              if (resumeData && resumeData.versions.length > 0) {
                const latestVersion =
                  resumeData.versions[resumeData.versions.length - 1];
                if (latestVersion) {
                  setResumeData(latestVersion.data);
                }
              }
            }
          }
        }
      } catch {
        // Error fetching user data
      }
    };

    loadUserData();
  }, [userResumeData, setResumeData]);

  const handleResumeDataUpdate = (updatedData: ResumeData) => {
    setResumeData(updatedData);
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-50 to-blue-50'>
      {/* Data Choice Dialog */}
      <AnimatePresence>
        {showDataChoice && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className='fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4'
            onClick={() => setShowDataChoice(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className='bg-white rounded-xl shadow-2xl p-6 max-w-md w-full relative'
              onClick={e => e.stopPropagation()}
            >
              <button
                onClick={() => setShowDataChoice(false)}
                className='absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors'
                aria-label='Close dialog'
              >
                <svg
                  className='w-5 h-5'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M6 18L18 6M6 6l12 12'
                  />
                </svg>
              </button>

              <h3 className='text-xl font-bold text-slate-900 mb-4 pr-8'>
                Choose Data Source
              </h3>
              <p className='text-slate-600 mb-6'>
                We found your existing resume data. Would you like to use it for
                the preview, or use sample data instead?
              </p>

              <div className='space-y-3'>
                <Button
                  onClick={() => handleDataChoice(true)}
                  className='w-full bg-blue-600 hover:bg-blue-700 text-white'
                >
                  Use My Resume Data
                </Button>
                <Button
                  onClick={() => handleDataChoice(false)}
                  variant='outline'
                  className='w-full'
                >
                  Use Sample Data
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className='bg-gradient-to-r from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 border-b border-slate-200 dark:border-slate-700'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6'>
          <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4'>
            <div>
              <h1 className='text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-slate-900 via-blue-800 to-slate-700 dark:from-blue-400 dark:via-blue-300 dark:to-slate-200 bg-clip-text text-transparent'>
                Resume Templates
              </h1>
              <p className='text-sm sm:text-base text-slate-600 dark:text-slate-400 mt-1'>
                Choose from our collection of modern, professional resume
                templates
              </p>
            </div>
            <Button
              variant='outline'
              onClick={() => {
                if (userResumeData) {
                  localStorage.setItem(
                    'resumeBuilderData',
                    JSON.stringify(userResumeData)
                  );
                }
                window.location.href = '/resume/builder';
              }}
              className='flex items-center justify-center w-10 h-10 rounded-full bg-white border-2 border-slate-300 hover:bg-slate-50 hover:border-slate-400 transition-all duration-200 shadow-sm hover:shadow-md'
              title='Back to Builder'
            >
              <svg
                className='w-5 h-5 text-slate-700'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2.5}
                  d='M15 19l-7-7 7-7'
                />
              </svg>
            </Button>
          </div>
        </div>
      </div>

      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        {/* View Mode Toggle - Compact and always visible */}
        <div className='flex justify-center mb-6'>
          <div className='bg-slate-100 dark:bg-slate-800 rounded-lg p-1 flex items-center gap-1 shadow-sm border border-slate-200 dark:border-slate-700'>
            <div className='flex'>
              <button
                onClick={() => setViewMode('carousel')}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                  viewMode === 'carousel'
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                📱 Carousel
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                  viewMode === 'grid'
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                🔲 Grid
              </button>
            </div>

            {/* Always show collapse toggle for better UX */}
            <div className='h-4 w-px bg-slate-300 mx-1'></div>
            <button
              onClick={() => setIsCarouselCollapsed(!isCarouselCollapsed)}
              className={`px-2 py-1.5 rounded-md text-xs font-medium transition-all ${
                isCarouselCollapsed
                  ? 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                  : 'bg-white text-slate-900 shadow-sm hover:bg-slate-50'
              }`}
              title={
                isCarouselCollapsed
                  ? 'Show carousel (Enter)'
                  : 'Hide carousel (Esc)'
              }
            >
              <svg
                className={`w-3 h-3 transition-transform ${
                  isCarouselCollapsed ? 'rotate-180' : ''
                }`}
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M5 15l7-7 7 7'
                />
              </svg>
            </button>
          </div>
        </div>

        {viewMode === 'carousel' ? (
          /* Carousel Layout - Mobile First */
          <div
            className={`space-y-6 ${isCarouselCollapsed ? 'pb-8' : 'pb-32'}`}
          >
            {/* Main Content - Template Preview */}
            <div className='max-w-5xl mx-auto bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-4 sm:p-6'>
              {selectedTemplate ? (
                <div className='space-y-4'>
                  <div className='flex items-center justify-between'>
                    <h2 className='text-xl font-bold text-slate-900 dark:text-slate-100'>
                      {selectedTemplate.name}
                    </h2>
                  </div>

                  {/* Preview Mode Toggle */}
                  <div className='flex items-center justify-between mb-4'>
                    <h3 className='text-lg font-semibold text-slate-900'>
                      Preview
                    </h3>
                    <div className='flex items-center space-x-2'>
                      <button
                        onClick={() => setPreviewMode('paginated')}
                        className={`px-3 py-1 text-sm rounded-md transition-colors ${
                          previewMode === 'paginated'
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                      >
                        📄 Paginated
                      </button>
                      <button
                        onClick={() => setPreviewMode('full')}
                        className={`px-3 py-1 text-sm rounded-md transition-colors ${
                          previewMode === 'full'
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                      >
                        📋 Full View
                      </button>
                    </div>
                  </div>

                  {/* Template Preview */}
                  <div className='border border-slate-200 rounded-lg overflow-hidden'>
                    {previewMode === 'paginated' ? (
                      <ImprovedPaginatedTemplatePreview
                        template={customizedTemplate || selectedTemplate}
                        data={getPreviewData()}
                        className='w-full'
                        maxHeight='600px'
                      />
                    ) : (
                      <ResumeTemplateRenderer
                        template={customizedTemplate || selectedTemplate}
                        data={getPreviewData()}
                        className='w-full'
                      />
                    )}
                  </div>

                </div>
              ) : (
                <div className='text-center py-12'>
                  <div className='w-16 h-16 mx-auto mb-4 bg-slate-100 rounded-full flex items-center justify-center'>
                    <svg
                      className='w-8 h-8 text-slate-400'
                      fill='none'
                      stroke='currentColor'
                      viewBox='0 0 24 24'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
                      />
                    </svg>
                  </div>
                  <h3 className='text-lg font-semibold text-slate-900 mb-2'>
                    Select a Template
                  </h3>
                  <p className='text-slate-600'>
                    Choose a template from the carousel below to get started
                  </p>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* Grid Layout - Desktop */
          <div className='grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6 xl:gap-8'>
            {/* Left Sidebar - Template Gallery */}
            <div className='lg:col-span-1 xl:col-span-1 order-2 lg:order-1 xl:order-1'>
              {/* Search and Filters */}
              <div className='bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6'>
                <div className='flex flex-col md:flex-row gap-4'>
                  {/* Search */}
                  <div className='flex-1'>
                    <div className='relative'>
                      <input
                        type='text'
                        placeholder='Search templates...'
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        className='w-full px-4 py-3 pl-10 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-slate-900 placeholder-slate-500'
                      />
                      <svg
                        className='absolute left-3 top-3.5 h-5 w-5 text-slate-400'
                        fill='none'
                        stroke='currentColor'
                        viewBox='0 0 24 24'
                      >
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth={2}
                          d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              {/* Template Grid */}
              <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2 sm:gap-1.5'>
                <AnimatePresence>
                  {filteredTemplates.map((template, index) => (
                    <motion.div
                      key={template.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ delay: index * 0.05 }}
                      className='group relative'
                    >
                      <Card
                        className={`cursor-pointer transition-all duration-500 hover:shadow-2xl hover:scale-105 hover:z-10 ${
                          selectedTemplate?.id === template.id
                            ? 'ring-2 ring-blue-500 shadow-xl scale-105'
                            : 'hover:shadow-lg'
                        }`}
                        onClick={() => handleTemplateSelect(template)}
                      >
                        <div className='p-1.5'>
                          {/* Template Preview */}
                          <div
                            className='aspect-square rounded-md mb-1 overflow-hidden shadow-sm border border-slate-200 relative group-hover:shadow-lg transition-all duration-300'
                            style={{
                              background: `linear-gradient(135deg, ${template.layout.colors.primary}20, ${template.layout.colors.accent}20)`,
                            }}
                          >
                            <div className='w-full h-full flex items-center justify-center relative'>
                              {/* Theme Color Bars */}
                              <div className='absolute inset-0 flex flex-col'>
                                <div
                                  className='h-1/3 w-full'
                                  style={{
                                    backgroundColor:
                                      template.layout.colors.primary,
                                  }}
                                />
                                <div
                                  className='h-1/3 w-full'
                                  style={{
                                    backgroundColor:
                                      template.layout.colors.accent,
                                  }}
                                />
                                <div
                                  className='h-1/3 w-full'
                                  style={{
                                    backgroundColor:
                                      template.layout.colors.secondary,
                                  }}
                                />
                              </div>

                              {/* Template Icon */}
                              <div className='relative z-10 text-center'>
                                <div
                                  className='w-8 h-8 mx-auto mb-1 rounded-full flex items-center justify-center shadow-lg'
                                  style={{
                                    backgroundColor:
                                      template.layout.colors.primary,
                                  }}
                                >
                                  <span
                                    className='text-xs font-bold'
                                    style={{
                                      color:
                                        template.layout.colors.sidebarText ||
                                        '#ffffff',
                                    }}
                                  >
                                    {template.name
                                      .split(' ')
                                      .map(word => word[0])
                                      .join('')
                                      .substring(0, 2)}
                                  </span>
                                </div>
                                <div
                                  className='w-6 h-1 rounded-full mx-auto'
                                  style={{
                                    backgroundColor:
                                      template.layout.colors.accent,
                                  }}
                                />
                              </div>
                            </div>
                          </div>

                          {/* Template Info */}
                          <div className='text-center'>
                            <h3 className='font-bold text-xs text-slate-900 truncate'>
                              {template.name
                                .split(' ')
                                .map(word => word[0])
                                .join('')
                                .substring(0, 3)}
                            </h3>
                            <div className='text-xs text-green-600 font-medium'>
                              {template.atsScore}%
                            </div>
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>

            {/* Main Content Area - Template Customizer + Preview */}
            <div className='lg:col-span-2 xl:col-span-3 order-1 lg:order-2 xl:order-2'>
              {selectedTemplate ? (
                <div className='space-y-6'>
                  {/* Live Preview */}
                  <div className='bg-white rounded-xl shadow-sm border border-slate-200 p-6'>
                    <div className='flex items-center justify-between mb-4'>
                      <h2 className='text-xl font-bold text-slate-900'>
                        {selectedTemplate.name}
                      </h2>
                    </div>

                    <div className='border border-slate-200 rounded-lg overflow-hidden'>
                      <ResumeTemplateRenderer
                        template={customizedTemplate || selectedTemplate}
                        data={getPreviewData()}
                        className='w-full'
                      />
                    </div>
                  </div>

                </div>
              ) : (
                <div className='bg-white rounded-xl shadow-sm border border-slate-200 p-12 text-center'>
                  <div className='w-16 h-16 mx-auto mb-4 bg-slate-100 rounded-full flex items-center justify-center'>
                    <svg
                      className='w-8 h-8 text-slate-400'
                      fill='none'
                      stroke='currentColor'
                      viewBox='0 0 24 24'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
                      />
                    </svg>
                  </div>
                  <h3 className='text-lg font-semibold text-slate-900 mb-2'>
                    Select a Template
                  </h3>
                  <p className='text-slate-600 text-sm'>
                    Choose a template from the gallery to see the live preview.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Bottom Template Carousel - Conditionally visible based on collapse state */}
        {viewMode === 'carousel' && !isCarouselCollapsed && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className='mt-8'
          >
            <TemplateCarousel
              templates={filteredTemplates}
              selectedTemplate={selectedTemplate}
              onTemplateSelect={handleTemplateSelect}
              position='bottom'
              showLabels={true}
            />
          </motion.div>
        )}

        {/* Collapsed Carousel Hint */}
        {viewMode === 'carousel' && isCarouselCollapsed && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
            className='fixed bottom-4 left-1/2 transform -translate-x-1/2 z-30'
          >
            <button
              onClick={() => setIsCarouselCollapsed(false)}
              className='bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-full text-sm shadow-lg flex items-center gap-2 transition-colors duration-200'
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
                  d='M19 9l-7 7-7-7'
                />
              </svg>
              <span>Click to show templates</span>
            </button>
          </motion.div>
        )}

        {/* Floating Action Button for Mobile Export - Only show in carousel mode */}
        {viewMode === 'carousel' && selectedTemplate && (
          <div className='fixed bottom-20 right-4 z-50 sm:hidden'>
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 260, damping: 20 }}
            >
              <Button
                onClick={() => setShowMobileExportMenu(!showMobileExportMenu)}
                className='w-14 h-14 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center'
                aria-label='Export Resume'
              >
                <svg
                  className='w-6 h-6'
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
              </Button>
            </motion.div>
          </div>
        )}

        {/* Mobile Export Menu */}
        {viewMode === 'carousel' &&
          selectedTemplate &&
          showMobileExportMenu && (
            <div className='fixed bottom-32 right-4 z-40 sm:hidden'>
              <motion.div
                initial={{ scale: 0, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0, opacity: 0, y: 20 }}
                transition={{ type: 'spring', stiffness: 260, damping: 20 }}
                className='bg-white rounded-xl shadow-xl border border-slate-200 p-4 min-w-[200px]'
              >
                <div className='space-y-2'>
                  <h3 className='text-sm font-semibold text-slate-900 mb-3'>
                    Export Resume
                  </h3>
                  <Button
                    onClick={() => {
                      setShowMobileExportMenu(false);
                      // Handle PDF export
                      const validation = validateResumeData(getPreviewData());
                      if (validation.errors.length > 0) {
                        setValidationResult(validation);
                        setPendingExportFormat('pdf');
                        setShowValidationModal(true);
                      } else {
                        setPendingExportFormat('pdf');
                        handleValidationProceed();
                      }
                    }}
                    className='w-full justify-start text-sm'
                    variant='outline'
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
                        d='M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z'
                      />
                    </svg>
                    Export as PDF
                  </Button>
                  <Button
                    onClick={() => {
                      // Handle DOCX export
                      const validation = validateResumeData(getPreviewData());
                      if (validation.errors.length > 0) {
                        setValidationResult(validation);
                        setPendingExportFormat('docx');
                        setShowValidationModal(true);
                      } else {
                        handleValidationProceed();
                      }
                    }}
                    className='w-full justify-start text-sm'
                    variant='outline'
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
                        d='M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
                      />
                    </svg>
                    Export as DOCX
                  </Button>
                  <Button
                    onClick={() => {
                      // Handle TXT export
                      const validation = validateResumeData(getPreviewData());
                      if (validation.errors.length > 0) {
                        setValidationResult(validation);
                        setPendingExportFormat('txt');
                        setShowValidationModal(true);
                      } else {
                        handleValidationProceed();
                      }
                    }}
                    className='w-full justify-start text-sm'
                    variant='outline'
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
                        d='M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
                      />
                    </svg>
                    Export as TXT
                  </Button>
                </div>
              </motion.div>
            </div>
          )}

        {/* Validation Modal */}
        {validationResult && (
          <ValidationModal
            isOpen={showValidationModal}
            onClose={handleValidationCancel}
            onProceed={handleValidationProceed}
            validationResult={validationResult}
            actionType='export'
          />
        )}
      </div>

      {/* Unified Floating Panel - All tools in one place */}
      {selectedTemplate && (
        <UnifiedFloatingPanel
          resumeData={getPreviewData()}
          template={customizedTemplate || selectedTemplate}
          onResumeDataUpdate={handleResumeDataUpdate}
          onTemplateChange={setCustomizedTemplate}
        />
      )}
    </div>
  );
}
