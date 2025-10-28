'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

import { UnifiedWelcomeBar } from '@/components/layout/UnifiedWelcomeBar';
import { FloatingPanel } from '@/components/organisms/FloatingPanel/FloatingPanel';
import { CollapsedCarouselHint } from '@/components/resume/CollapsedCarouselHint';
import { DataChoiceDialog } from '@/components/resume/DataChoiceDialog';
import { ImprovedPaginatedTemplatePreview } from '@/components/resume/templates/ImprovedPaginatedTemplatePreview';
import { ResumeTemplateRenderer } from '@/components/resume/templates/ResumeTemplateRenderer';
import { TemplateCarousel } from '@/components/resume/templates/TemplateCarousel';
import { TemplateSearch } from '@/components/resume/TemplateSearch';
import { ValidationModal } from '@/components/resume/ValidationModal';
import { ViewModeToggle } from '@/components/resume/ViewModeToggle';
import { Card } from '@/components/ui/Card';
import { useContentRestructuring } from '@/hooks/useContentRestructuring';
import { cloudStorage } from '@/lib/resume/cloudStorage';
import { exportResume } from '@/lib/resume/exportUtils';
import { sampleResumeData } from '@/lib/resume/sampleData';
import { modernTemplates } from '@/lib/resume/templates';
import { ValidationResult } from '@/lib/resume/validation';
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
    setTemplateCustomizations,
    showDataChoice,
    setShowDataChoice,
  } = useResumeStore();

  // Local state
  const [customizedTemplate, setCustomizedTemplate] =
    useState<ResumeTemplate | null>(null);
  const resumeElementRef = useRef<HTMLDivElement>(null);

  // Wrap setCustomizedTemplate with logging
  const handleTemplateChange = (template: ResumeTemplate) => {
    setCustomizedTemplate(template);
  };
  const [searchQuery, setSearchQuery] = useState('');
  const [showValidationModal, setShowValidationModal] = useState(false);
  const [validationResult, setValidationResult] =
    useState<ValidationResult | null>(null);
  const [pendingExportFormat, setPendingExportFormat] = useState<
    'pdf' | 'docx' | 'txt' | null
  >(null);
  const [viewMode, setViewMode] = useState<'grid' | 'carousel'>('carousel');
  const [isMobile, setIsMobile] = useState(false);

  // Force carousel view on mobile/tablet devices
  const effectiveViewMode = isMobile ? 'carousel' : viewMode;
  const [isCarouselCollapsed, setIsCarouselCollapsed] = useState(false);
  const [previewMode, setPreviewMode] = useState<'full' | 'paginated'>('full');

  // Filter templates
  const filteredTemplates = modernTemplates.filter(template => {
    const matchesSearch =
      template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  // Get preview data - prioritize extracted data over sample data
  const getPreviewData = (): ResumeData => {
    // First priority: User's extracted data (if available and user wants to use it)
    if (userResumeData) {
      return userResumeData;
    }

    // Second priority: Use the comprehensive sample data for better preview
    return sampleResumeData;
  };

  // Use content restructuring hook
  const { restructuredData } = useContentRestructuring(getPreviewData(), {
    autoRestructure: true,
    enableAIAnalysis: true,
  });

  // Use restructured data if available, otherwise fall back to original
  const previewData = restructuredData || getPreviewData();

  // Initialize template customizations when a template is already selected
  useEffect(() => {
    if (selectedTemplate) {
      setTemplateCustomizations({
        layout: {
          columns: selectedTemplate.layout?.columns || 1,
          sidebar: selectedTemplate.layout?.sidebar || false,
          margins: selectedTemplate.layout?.spacing?.margins || '1in',
        },
        typography: {
          fontFamily: selectedTemplate.fontFamily || 'Arial',
          fontSize: selectedTemplate.fontSize || '14',
          lineHeight: selectedTemplate.layout?.spacing?.lineHeight || 1.5,
          letterSpacing: '0',
        },
        colors: {
          colorScheme: selectedTemplate.colorScheme || 'blue',
          primaryColor: selectedTemplate.layout?.colors?.primary || '#3b82f6',
          secondaryColor:
            selectedTemplate.layout?.colors?.secondary || '#64748b',
          accentColor: selectedTemplate.layout?.colors?.accent || '#06b6d4',
          textColor: selectedTemplate.layout?.colors?.text || '#1f2937',
          backgroundColor:
            selectedTemplate.layout?.colors?.background || '#ffffff',
        },
        spacing: {
          sectionGap: selectedTemplate.layout?.spacing?.sectionGap || '1rem',
          padding: selectedTemplate.layout?.spacing?.padding || '1rem',
        },
        content: {
          bulletStyle: 'disc',
          dateFormat: 'MMM YYYY',
          showIcons: true,
        },
        sectionCustomizations: {},
      });
    }
  }, [selectedTemplate, setTemplateCustomizations]);

  // Handle template selection
  const handleTemplateSelect = (template: ResumeTemplate) => {
    setSelectedTemplate(template);
    setCustomizedTemplate(null);

    // Initialize template customizations with template's default values
    setTemplateCustomizations({
      layout: {
        columns: template.layout?.columns || 1,
        sidebar: template.layout?.sidebar || false,
        margins: template.layout?.spacing?.margins || '1in',
      },
      typography: {
        fontFamily: template.fontFamily || 'Arial',
        fontSize: template.fontSize || '14',
        lineHeight: template.layout?.spacing?.lineHeight || 1.5,
        letterSpacing: '0',
      },
      colors: {
        colorScheme: template.colorScheme || 'blue',
        primaryColor: template.layout?.colors?.primary || '#3b82f6',
        secondaryColor: template.layout?.colors?.secondary || '#64748b',
        accentColor: template.layout?.colors?.accent || '#06b6d4',
        textColor: template.layout?.colors?.text || '#1f2937',
        backgroundColor: template.layout?.colors?.background || '#ffffff',
      },
      spacing: {
        sectionGap: template.layout?.spacing?.sectionGap || '1rem',
        padding: template.layout?.spacing?.padding || '1rem',
      },
      content: {
        bulletStyle: 'disc',
        dateFormat: 'MMM YYYY',
        showIcons: true,
      },
      sectionCustomizations: {},
    });
  };

  // Handle validation modal actions
  const handleValidationProceed = async () => {
    if (!pendingExportFormat || !selectedTemplate) return;

    try {
      await exportResume(
        pendingExportFormat as 'pdf' | 'docx',
        customizedTemplate || selectedTemplate,
        previewData
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
      if (effectiveViewMode === 'carousel') {
        if (event.key === 'Escape' && !isCarouselCollapsed) {
          setIsCarouselCollapsed(true);
        } else if (event.key === 'Enter' && isCarouselCollapsed) {
          setIsCarouselCollapsed(false);
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [effectiveViewMode, isCarouselCollapsed]);

  // Handle responsive behavior
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 1024); // lg breakpoint
    };

    // Check on mount
    checkIsMobile();

    // Add resize listener
    window.addEventListener('resize', checkIsMobile);
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

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

  return (
    <div className='min-h-screen bg-gradient-to-br from-background to-muted'>
      {/* Data Choice Dialog */}
      <DataChoiceDialog
        isOpen={showDataChoice}
        onClose={() => setShowDataChoice(false)}
        onUseUserData={() => handleDataChoice(true)}
        onUseSampleData={() => handleDataChoice(false)}
      />

      <div className='max-w-7xl mx-auto px-2 sm:px-2 lg:px-3 py-2'>
        {/* Unified Welcome Bar */}
        <div data-tour='welcome'>
          <UnifiedWelcomeBar
            currentPage='templates'
            analysisResult={null}
            resumeData={userResumeData}
          />
        </div>

        {/* View Mode Toggle - Compact and always visible, hidden on mobile */}
        {!isMobile && (
          <ViewModeToggle
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            isCarouselCollapsed={isCarouselCollapsed}
            onCarouselToggle={() =>
              setIsCarouselCollapsed(!isCarouselCollapsed)
            }
          />
        )}

        {effectiveViewMode === 'carousel' ? (
          /* Carousel Layout - Mobile First */
          <div
            className={`space-y-6 ${isCarouselCollapsed ? 'pb-8' : 'pb-32'}`}
            data-tour='template-selection'
          >
            {/* Main Content - Template Preview */}
            <div className='max-w-5xl mx-auto bg-gradient-to-br from-card via-background to-muted dark:from-card dark:via-background dark:to-muted rounded-xl shadow-xl border border-border p-4 sm:p-6 backdrop-blur-sm'>
              {selectedTemplate ? (
                <div className='space-y-4'>
                  <div className='flex items-center justify-between'>
                    <h2 className='text-xl font-bold text-foreground'>
                      {selectedTemplate.name}
                    </h2>
                  </div>

                  {/* Preview Mode Toggle */}
                  <div className='flex items-center justify-between mb-4'>
                    <h3 className='text-lg font-semibold text-foreground'>
                      Preview
                    </h3>
                    <div className='flex items-center space-x-2'>
                      <button
                        onClick={() => setPreviewMode('paginated')}
                        className={`px-3 py-1 text-sm rounded-md transition-colors ${
                          previewMode === 'paginated'
                            ? 'bg-primary-500 text-primary-foreground'
                            : 'bg-muted text-muted-foreground hover:bg-accent'
                        }`}
                      >
                        📄 Paginated
                      </button>
                      <button
                        onClick={() => setPreviewMode('full')}
                        className={`px-3 py-1 text-sm rounded-md transition-colors ${
                          previewMode === 'full'
                            ? 'bg-primary-500 text-primary-foreground'
                            : 'bg-muted text-muted-foreground hover:bg-accent'
                        }`}
                      >
                        📋 Full View
                      </button>
                    </div>
                  </div>

                  {/* Template Preview */}
                  <div className='border border-border rounded-lg overflow-hidden'>
                    {previewMode === 'paginated' ? (
                      <ImprovedPaginatedTemplatePreview
                        template={customizedTemplate || selectedTemplate}
                        data={previewData}
                        className='w-full'
                        maxHeight='600px'
                      />
                    ) : (
                      <ResumeTemplateRenderer
                        template={customizedTemplate || selectedTemplate}
                        data={previewData}
                        className='w-full'
                      />
                    )}
                  </div>
                </div>
              ) : (
                <div className='text-center py-6'>
                  <div className='w-16 h-16 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center'>
                    <svg
                      className='w-8 h-8 text-muted-foreground'
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
                  <h3 className='text-lg font-semibold text-foreground mb-2'>
                    Select a Template
                  </h3>
                  <p className='text-muted-foreground'>
                    Choose a template from the carousel below to get started
                  </p>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* Grid Layout - Desktop */
          <div className='grid grid-cols-1 lg:grid-cols-5 xl:grid-cols-6 gap-4 lg:gap-6 xl:gap-8'>
            {/* Left Sidebar - Template Gallery */}
            <div
              className='lg:col-span-1 xl:col-span-1 order-2 lg:order-1 xl:order-1'
              data-tour='template-selection'
            >
              {/* Search and Filters */}
              <TemplateSearch
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
              />

              {/* Template Grid */}
              <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-2 sm:gap-1.5'>
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
                            className='aspect-square rounded-md mb-1 overflow-hidden shadow-sm border border-border relative group-hover:shadow-lg transition-all duration-300'
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
                            <h3 className='font-bold text-xs text-foreground truncate'>
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
            <div className='lg:col-span-4 xl:col-span-5 order-1 lg:order-2 xl:order-2'>
              {selectedTemplate ? (
                <div className='space-y-6'>
                  {/* Live Preview */}
                  <div className='bg-card rounded-xl shadow-sm border border-border p-6'>
                    <div className='flex items-center justify-between mb-4'>
                      <h2 className='text-xl font-bold text-foreground'>
                        {selectedTemplate.name}
                      </h2>
                    </div>

                    <div className='border border-border rounded-lg overflow-hidden'>
                      <div ref={resumeElementRef}>
                        <ResumeTemplateRenderer
                          key={customizedTemplate ? 'customized' : 'original'}
                          template={customizedTemplate || selectedTemplate}
                          data={previewData}
                          className='w-full'
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className='bg-card rounded-xl shadow-sm border border-border p-12 text-center'>
                  <div className='w-16 h-16 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center'>
                    <svg
                      className='w-8 h-8 text-muted-foreground'
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
                  <h3 className='text-lg font-semibold text-foreground mb-2'>
                    Select a Template
                  </h3>
                  <p className='text-muted-foreground text-sm'>
                    Choose a template from the gallery to see the live preview.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Bottom Template Carousel - Conditionally visible based on collapse state */}
        {effectiveViewMode === 'carousel' && !isCarouselCollapsed && (
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
        <CollapsedCarouselHint
          isVisible={effectiveViewMode === 'carousel' && isCarouselCollapsed}
          onShowCarousel={() => setIsCarouselCollapsed(false)}
        />

        {/* Mobile Export Button and Menu removed from templates page */}

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
        <div data-tour='completion'>
          <FloatingPanel
            resumeData={previewData}
            template={customizedTemplate || selectedTemplate}
            onTemplateChange={handleTemplateChange}
            resumeElement={
              resumeElementRef.current?.querySelector('.resume-template') ||
              document.querySelector('.resume-template') ||
              null
            }
          />
        </div>
      )}
    </div>
  );
}
