'use client';

import React, { useEffect, useState } from 'react';

import { Button } from '@/components/atoms/Button/Button';
import { FormField } from '@/components/molecules/FormField/FormField';
import { Card } from '@/components/ui/Card';
import { CollapsibleSection } from '@/components/ui/CollapsibleSection';
import { ItemCard } from '@/components/ui/ItemCard';
import { ResumeInput } from '@/components/ui/ResumeInput';
import { RichTextInput } from '@/components/ui/RichTextInput';
import { Tooltip } from '@/components/ui/Tooltip/Tooltip';
import { validateResumeData, ValidationResult } from '@/lib/resume/validation';
import { useResumeStore } from '@/store/resumeStore';
import { ResumeData } from '@/types/resume';

import { DOCXExporter } from '../DOCXExporter';
import { FloatingActions } from '../FloatingActions/FloatingActions';
import { RichTextEditor } from '../RichTextEditor';
import { SectionValidation } from '../SectionValidation/SectionValidation';
import { UnifiedAIContentImprover } from '../UnifiedAIContentImprover';
import { ValidationModal } from '../ValidationModal';

interface ResumeBuilderProps {
  initialData?: Partial<ResumeData> | undefined;
  onSave?: (data: ResumeData) => void;
}

export const ResumeBuilder: React.FC<ResumeBuilderProps> = ({
  initialData,
  onSave,
}) => {
  // Use global store for all data management
  const {
    updatePersonalInfo,
    updateSummary,
    updateSkills,
    setResumeData,
    updateAchievements,
    updateCertifications,
    updateHobbies,
  } = useResumeStore();
  const resumeData = useResumeStore(state => state.resumeData);

  const [currentStep, setCurrentStep] = useState<
    'builder' | 'preview' | 'sections'
  >('builder');
  const [showValidationModal, setShowValidationModal] = useState(false);
  const [validationResult, setValidationResult] =
    useState<ValidationResult | null>(null);
  const [pendingAction, setPendingAction] = useState<{
    type: 'save' | 'export';
    format?: 'pdf' | 'docx' | 'txt';
  } | null>(null);
  const [expandedSections, setExpandedSections] = useState<{
    [key: string]: boolean;
  }>({
    personal: true, // Only first section expanded by default
    summary: true, // Expand summary for tests
    experience: false,
    education: false,
    skills: false,
    projects: false,
    achievements: false,
    certifications: false,
  });
  // Create default resume data structure if none exists
  const defaultResumeData: ResumeData = {
    personal: {
      fullName: '',
      email: '',
      phone: '',
      location: '',
      linkedin: '',
      github: '',
      portfolio: '',
    },
    summary: '',
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
  };

  // Use global data or default if none exists - ensure it's never null
  const currentResumeData: ResumeData = resumeData || defaultResumeData;

  // Initialize with ATS data - only run once when initialData changes
  useEffect(() => {
    if (initialData) {
      // Update if we have new initialData with experience or education
      const hasNewData =
        (initialData.experience?.length || 0) > 0 ||
        (initialData.education?.length || 0) > 0;
      const hasExistingData =
        (resumeData?.experience?.length || 0) > 0 ||
        (resumeData?.education?.length || 0) > 0;

      // Update if we don't have resume data OR if we have new data from ATS analysis
      if (!resumeData || (hasNewData && !hasExistingData)) {
        // console.log('📝 Updating resume data from initialData:', initialData);
        setResumeData({
          personal: {
            fullName: initialData.personal?.fullName || '',
            email: initialData.personal?.email || '',
            phone: initialData.personal?.phone || '',
            location: initialData.personal?.location || '',
            linkedin: initialData.personal?.linkedin || '',
            github: initialData.personal?.github || '',
            portfolio: initialData.personal?.portfolio || '',
          },
          summary: initialData.summary || '',
          experience: initialData.experience || [],
          education: initialData.education || [],
          skills: {
            technical: initialData.skills?.technical || [],
            business: initialData.skills?.business || [],
            soft: initialData.skills?.soft || [],
            languages: initialData.skills?.languages || [],
            certifications: initialData.skills?.certifications || [],
          },
          projects: initialData.projects || [],
          achievements: initialData.achievements || [],
        });
      }
    }
  }, [initialData, resumeData, setResumeData]);

  // Additional useEffect to handle store updates
  useEffect(() => {
    if (initialData && resumeData) {
      // Check if initialData has more complete data than current resumeData
      const initialHasMoreData =
        (initialData.experience?.length || 0) >
          (resumeData.experience?.length || 0) ||
        (initialData.education?.length || 0) >
          (resumeData.education?.length || 0) ||
        (initialData.summary?.length || 0) > (resumeData.summary?.length || 0);

      if (initialHasMoreData) {
        // console.log(
        //   '🔄 Updating resume data with more complete data from store'
        // );
        setResumeData({
          personal: {
            fullName: initialData.personal?.fullName || '',
            email: initialData.personal?.email || '',
            phone: initialData.personal?.phone || '',
            location: initialData.personal?.location || '',
            linkedin: initialData.personal?.linkedin || '',
            github: initialData.personal?.github || '',
            portfolio: initialData.personal?.portfolio || '',
          },
          summary: initialData.summary || '',
          experience: initialData.experience || [],
          education: initialData.education || [],
          skills: {
            technical: initialData.skills?.technical || [],
            business: initialData.skills?.business || [],
            soft: initialData.skills?.soft || [],
            languages: initialData.skills?.languages || [],
            certifications: initialData.skills?.certifications || [],
          },
          projects: initialData.projects || [],
          achievements: initialData.achievements || [],
        });
      }
    }
  }, [initialData, resumeData, setResumeData]); // Include all dependencies

  const handleDataUpdate = (section: keyof ResumeData, data: unknown) => {
    // Update global store for all changes
    if (section === 'personal' && typeof data === 'object' && data !== null) {
      updatePersonalInfo(data as Partial<ResumeData['personal']>);
    } else if (section === 'summary' && typeof data === 'string') {
      updateSummary(data);
    } else if (
      section === 'skills' &&
      typeof data === 'object' &&
      data !== null
    ) {
      updateSkills(data as Partial<ResumeData['skills']>);
    } else if (section === 'achievements' && Array.isArray(data)) {
      updateAchievements(data);
    } else if (section === 'certifications' && Array.isArray(data)) {
      updateCertifications(data);
    } else if (section === 'hobbies' && Array.isArray(data)) {
      updateHobbies(data);
    } else {
      // For other sections, update the entire resume data
      const updatedData = {
        ...currentResumeData,
        [section]: data,
      };
      setResumeData(updatedData);
    }
  };

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const capitalizeFirstLetter = (str: string) => {
    if (!str) return str;
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  const handleSave = () => {
    // Validate resume data before saving
    const validation = validateResumeData(currentResumeData);
    setValidationResult(validation);
    setPendingAction({ type: 'save' });
    setShowValidationModal(true);
  };

  const handleValidationProceed = () => {
    if (!pendingAction) return;

    if (pendingAction.type === 'save') {
      if (onSave) {
        onSave(currentResumeData);
      }
      // Also save to localStorage (client-side only)
      if (typeof window !== 'undefined') {
        localStorage.setItem(
          'resume-builder-data',
          JSON.stringify(currentResumeData)
        );
      }
    }

    // Close modal and reset state
    setShowValidationModal(false);
    setPendingAction(null);
    setValidationResult(null);
  };

  const handleValidationCancel = () => {
    setShowValidationModal(false);
    setPendingAction(null);
    setValidationResult(null);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 'builder':
        return (
          <div className='w-full'>
            {/* Content */}
            <div className='mt-6'>
              <div className='w-full space-y-8'>
                {/* Personal Information */}
                <Card data-section='personal'>
                  <CollapsibleSection
                    title='Personal Information'
                    icon='👤'
                    color='primary'
                    count={
                      Object.values(currentResumeData.personal).filter(
                        value => value && value.trim() !== ''
                      ).length
                    }
                    countLabel='fields'
                    isExpanded={expandedSections.personal || false}
                    onToggle={() => toggleSection('personal')}
                  >
                    <SectionValidation
                      section='personal'
                      resumeData={currentResumeData}
                      className='mb-4'
                    />
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                      <div>
                        <label
                          htmlFor='full-name'
                          className='block text-xs sm:text-sm font-semibold text-foreground mb-2 uppercase tracking-wide'
                        >
                          Full Name <span className='text-red-500'>*</span>
                        </label>
                        <input
                          id='full-name'
                          type='text'
                          value={currentResumeData.personal.fullName}
                          onChange={e =>
                            handleDataUpdate('personal', {
                              ...currentResumeData.personal,
                              fullName: e.target.value,
                            })
                          }
                          className='w-full px-3 py-2 sm:px-4 sm:py-3 border-2 border-border rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-background text-foreground font-medium transition-all duration-200 text-sm sm:text-base'
                          placeholder='John Smith'
                        />
                      </div>
                      <div>
                        <label
                          htmlFor='email'
                          className='block text-xs sm:text-sm font-semibold text-foreground mb-2 uppercase tracking-wide'
                        >
                          Email <span className='text-red-500'>*</span>
                        </label>
                        <input
                          id='email'
                          type='email'
                          value={currentResumeData.personal.email}
                          onChange={e =>
                            handleDataUpdate('personal', {
                              ...currentResumeData.personal,
                              email: e.target.value,
                            })
                          }
                          className='w-full px-3 py-2 sm:px-4 sm:py-3 border-2 border-border rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-background text-foreground font-medium transition-all duration-200 text-sm sm:text-base'
                          placeholder='john.smith@email.com'
                        />
                      </div>
                      <div>
                        <label
                          htmlFor='phone'
                          className='block text-xs sm:text-sm font-semibold text-foreground mb-2 uppercase tracking-wide'
                        >
                          Phone <span className='text-red-500'>*</span>
                        </label>
                        <input
                          id='phone'
                          type='tel'
                          value={currentResumeData.personal.phone}
                          onChange={e =>
                            handleDataUpdate('personal', {
                              ...currentResumeData.personal,
                              phone: e.target.value,
                            })
                          }
                          className='w-full px-3 py-2 sm:px-4 sm:py-3 border-2 border-border rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-background text-foreground font-medium transition-all duration-200 text-sm sm:text-base'
                          placeholder='(555) 123-4567'
                        />
                      </div>
                      <div>
                        <label
                          htmlFor='location'
                          className='block text-xs sm:text-sm font-semibold text-foreground mb-2 uppercase tracking-wide'
                        >
                          Location <span className='text-red-500'>*</span>
                        </label>
                        <input
                          id='location'
                          type='text'
                          value={currentResumeData.personal.location}
                          onChange={e =>
                            handleDataUpdate('personal', {
                              ...currentResumeData.personal,
                              location: e.target.value,
                            })
                          }
                          className='w-full px-3 py-2 sm:px-4 sm:py-3 border-2 border-border rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-background text-foreground font-medium transition-all duration-200 text-sm sm:text-base'
                          placeholder='San Francisco, CA'
                        />
                      </div>
                      <div>
                        <label
                          htmlFor='linkedin'
                          className='block text-xs sm:text-sm font-semibold text-foreground mb-2 uppercase tracking-wide'
                        >
                          LinkedIn
                        </label>
                        <input
                          id='linkedin'
                          type='url'
                          value={currentResumeData.personal.linkedin || ''}
                          onChange={e =>
                            handleDataUpdate('personal', {
                              ...currentResumeData.personal,
                              linkedin: e.target.value,
                            })
                          }
                          className='w-full px-3 py-2 sm:px-4 sm:py-3 border-2 border-border rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-background text-foreground font-medium transition-all duration-200 text-sm sm:text-base'
                          placeholder='linkedin.com/in/johnsmith'
                        />
                      </div>
                      <div>
                        <label
                          htmlFor='github'
                          className='block text-xs sm:text-sm font-semibold text-foreground mb-2 uppercase tracking-wide'
                        >
                          GitHub
                        </label>
                        <input
                          id='github'
                          type='url'
                          value={currentResumeData.personal.github || ''}
                          onChange={e =>
                            handleDataUpdate('personal', {
                              ...currentResumeData.personal,
                              github: e.target.value,
                            })
                          }
                          className='w-full px-3 py-2 sm:px-4 sm:py-3 border-2 border-border rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-background text-foreground font-medium transition-all duration-200 text-sm sm:text-base'
                          placeholder='github.com/johnsmith'
                        />
                      </div>
                      <div>
                        <label
                          htmlFor='portfolio'
                          className='block text-xs sm:text-sm font-semibold text-foreground mb-2 uppercase tracking-wide'
                        >
                          Portfolio
                        </label>
                        <input
                          id='portfolio'
                          type='url'
                          value={currentResumeData.personal.portfolio || ''}
                          onChange={e =>
                            handleDataUpdate('personal', {
                              ...currentResumeData.personal,
                              portfolio: e.target.value,
                            })
                          }
                          className='w-full px-3 py-2 sm:px-4 sm:py-3 border-2 border-border rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-background text-foreground font-medium transition-all duration-200 text-sm sm:text-base'
                          placeholder='yourportfolio.com'
                        />
                      </div>
                      <div>
                        <label
                          htmlFor='job-title'
                          className='block text-xs sm:text-sm font-semibold text-foreground mb-2 uppercase tracking-wide'
                        >
                          Current Job Title
                        </label>
                        <input
                          id='job-title'
                          type='text'
                          value={currentResumeData.personal.jobTitle || ''}
                          onChange={e =>
                            handleDataUpdate('personal', {
                              ...currentResumeData.personal,
                              jobTitle: e.target.value,
                            })
                          }
                          className='w-full px-3 py-2 sm:px-4 sm:py-3 border-2 border-border rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-background text-foreground font-medium transition-all duration-200 text-sm sm:text-base'
                          placeholder='Software Engineer'
                        />
                      </div>
                    </div>
                  </CollapsibleSection>
                </Card>

                {/* Professional Summary */}
                <Card>
                  <CollapsibleSection
                    title='Professional Summary'
                    icon='📝'
                    color='blue'
                    count={currentResumeData.summary ? 1 : 0}
                    countLabel='summary'
                    isExpanded={expandedSections.summary || false}
                    onToggle={() => toggleSection('summary')}
                  >
                    <RichTextEditor
                      key={`summary-${currentResumeData.summary?.length || 0}`}
                      id='professional-summary'
                      aria-label='Professional Summary'
                      content={currentResumeData.summary || ''}
                      onChange={content => handleDataUpdate('summary', content)}
                      placeholder='Write a brief summary of your professional background and key strengths...'
                      maxLength={500}
                    />
                  </CollapsibleSection>
                </Card>

                {/* Work Experience */}
                <Card>
                  <CollapsibleSection
                    title='Work Experience *'
                    icon='💼'
                    color='green'
                    count={currentResumeData.experience.length}
                    countLabel={
                      currentResumeData.experience.length === 1 ? 'job' : 'jobs'
                    }
                    isExpanded={expandedSections.experience || false}
                    onToggle={() => toggleSection('experience')}
                  >
                    <SectionValidation
                      section='experience'
                      resumeData={currentResumeData}
                      className='mb-4'
                    />
                    {currentResumeData.experience.map((job, index) => (
                      <ItemCard
                        key={job.id}
                        onRemove={() => {
                          const newExperience =
                            currentResumeData.experience.filter(
                              (_, i) => i !== index
                            );
                          handleDataUpdate('experience', newExperience);
                        }}
                        removeLabel='Remove Job'
                      >
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-4'>
                          <FormField label='Job Title' required>
                            <ResumeInput
                              value={job.position}
                              onChange={value => {
                                const newExperience = [
                                  ...currentResumeData.experience,
                                ];
                                newExperience[index] = {
                                  ...job,
                                  position: value,
                                };
                                handleDataUpdate('experience', newExperience);
                              }}
                              placeholder='Software Engineer'
                            />
                          </FormField>
                          <FormField label='Company' required>
                            <ResumeInput
                              value={job.company}
                              onChange={value => {
                                const newExperience = [
                                  ...currentResumeData.experience,
                                ];
                                newExperience[index] = {
                                  ...job,
                                  company: value,
                                };
                                handleDataUpdate('experience', newExperience);
                              }}
                              placeholder='Google Inc.'
                            />
                          </FormField>
                          <FormField label='Location'>
                            <ResumeInput
                              value={job.location}
                              onChange={value => {
                                const newExperience = [
                                  ...currentResumeData.experience,
                                ];
                                newExperience[index] = {
                                  ...job,
                                  location: value,
                                };
                                handleDataUpdate('experience', newExperience);
                              }}
                              placeholder='San Francisco, CA'
                            />
                          </FormField>
                          <FormField label='Period' required>
                            <ResumeInput
                              value={`${job.startDate} - ${job.endDate || 'Present'}`}
                              onChange={value => {
                                const newExperience = [
                                  ...currentResumeData.experience,
                                ];
                                const [startDate, endDate] = value.split(' - ');
                                newExperience[index] = {
                                  ...job,
                                  startDate: startDate || '',
                                  endDate:
                                    endDate === 'Present' ? '' : endDate || '',
                                };
                                handleDataUpdate('experience', newExperience);
                              }}
                              placeholder='Jan 2020 - Present'
                            />
                          </FormField>
                        </div>
                        <FormField label='Job Description'>
                          <RichTextInput
                            content={job.description}
                            onChange={content => {
                              const newExperience = [
                                ...currentResumeData.experience,
                              ];
                              newExperience[index] = {
                                ...job,
                                description: content,
                              };
                              handleDataUpdate('experience', newExperience);
                            }}
                            placeholder='Describe your role and key responsibilities...'
                            maxLength={1000}
                            context={`${job.position} at ${job.company}`}
                            type='experience'
                          />
                        </FormField>
                      </ItemCard>
                    ))}
                    <Button
                      variant='outline'
                      onClick={() => {
                        const newJob = {
                          id: `job-${Date.now()}`,
                          position: '',
                          company: '',
                          location: '',
                          startDate: '',
                          endDate: '',
                          current: false,
                          description: '',
                          achievements: [],
                          keyTechnologies: [],
                        };
                        handleDataUpdate('experience', [
                          ...currentResumeData.experience,
                          newJob,
                        ]);
                      }}
                      className='w-full'
                    >
                      ➕ Add Work Experience
                    </Button>
                  </CollapsibleSection>
                </Card>

                {/* Education */}
                <Card>
                  <CollapsibleSection
                    title='Education *'
                    icon='🎓'
                    color='purple'
                    count={currentResumeData.education.length}
                    countLabel={
                      currentResumeData.education.length === 1
                        ? 'degree'
                        : 'degrees'
                    }
                    isExpanded={expandedSections.education || false}
                    onToggle={() => toggleSection('education')}
                  >
                    {currentResumeData.education.map((edu, index) => (
                      <ItemCard
                        key={edu.id}
                        onRemove={() => {
                          const newEducation =
                            currentResumeData.education.filter(
                              (_, i) => i !== index
                            );
                          handleDataUpdate('education', newEducation);
                        }}
                        removeLabel='Remove Education'
                      >
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-4'>
                          <FormField label='Degree' required>
                            <ResumeInput
                              value={edu.degree}
                              onChange={value => {
                                const newEducation = [
                                  ...currentResumeData.education,
                                ];
                                newEducation[index] = {
                                  ...edu,
                                  degree: value,
                                };
                                handleDataUpdate('education', newEducation);
                              }}
                              placeholder='Bachelor of Science in Computer Science'
                            />
                          </FormField>
                          <FormField label='School' required>
                            <ResumeInput
                              value={edu.institution}
                              onChange={value => {
                                const newEducation = [
                                  ...currentResumeData.education,
                                ];
                                newEducation[index] = {
                                  ...edu,
                                  institution: value,
                                };
                                handleDataUpdate('education', newEducation);
                              }}
                              placeholder='Stanford University'
                            />
                          </FormField>
                          <FormField label='Field of Study' required>
                            <ResumeInput
                              value={edu.field}
                              onChange={value => {
                                const newEducation = [
                                  ...currentResumeData.education,
                                ];
                                newEducation[index] = {
                                  ...edu,
                                  field: value,
                                };
                                handleDataUpdate('education', newEducation);
                              }}
                              placeholder='Computer Science'
                            />
                          </FormField>
                          <FormField label='Location'>
                            <ResumeInput
                              value={edu.location}
                              onChange={value => {
                                const newEducation = [
                                  ...currentResumeData.education,
                                ];
                                newEducation[index] = {
                                  ...edu,
                                  location: value,
                                };
                                handleDataUpdate('education', newEducation);
                              }}
                              placeholder='Stanford, CA'
                            />
                          </FormField>
                          <FormField label='Period' required>
                            <ResumeInput
                              value={`${edu.startDate} - ${edu.endDate || 'Present'}`}
                              onChange={value => {
                                const newEducation = [
                                  ...currentResumeData.education,
                                ];
                                const [startDate, endDate] = value.split(' - ');
                                newEducation[index] = {
                                  ...edu,
                                  startDate: startDate || '',
                                  endDate:
                                    endDate === 'Present' ? '' : endDate || '',
                                };
                                handleDataUpdate('education', newEducation);
                              }}
                              placeholder='2016 - 2020'
                            />
                          </FormField>
                          <FormField label='GPA (Optional)'>
                            <ResumeInput
                              value={edu.gpa || ''}
                              onChange={value => {
                                const newEducation = [
                                  ...currentResumeData.education,
                                ];
                                newEducation[index] = { ...edu, gpa: value };
                                handleDataUpdate('education', newEducation);
                              }}
                              placeholder='3.8/4.0'
                            />
                          </FormField>
                        </div>
                      </ItemCard>
                    ))}
                    <Button
                      variant='outline'
                      onClick={() => {
                        const newEducation = {
                          id: `edu-${Date.now()}`,
                          degree: '',
                          institution: '',
                          field: '',
                          location: '',
                          startDate: '',
                          endDate: '',
                          current: false,
                          gpa: '',
                          honors: [],
                        };
                        handleDataUpdate('education', [
                          ...currentResumeData.education,
                          newEducation,
                        ]);
                      }}
                      className='w-full'
                    >
                      ➕ Add Education
                    </Button>
                  </CollapsibleSection>
                </Card>

                {/* Projects */}
                <Card>
                  <CollapsibleSection
                    title='Projects'
                    icon='🚀'
                    color='orange'
                    count={currentResumeData.projects?.length || 0}
                    countLabel={
                      currentResumeData.projects?.length === 1
                        ? 'project'
                        : 'projects'
                    }
                    isExpanded={expandedSections.projects || false}
                    onToggle={() => toggleSection('projects')}
                  >
                    {currentResumeData.projects?.map((project, index) => (
                      <ItemCard
                        key={project.id}
                        onRemove={() => {
                          const newProjects = (
                            currentResumeData.projects || []
                          ).filter((_, i) => i !== index);
                          handleDataUpdate('projects', newProjects);
                        }}
                        removeLabel='Remove Project'
                      >
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-4'>
                          <FormField label='Project Name' required>
                            <ResumeInput
                              value={project.name}
                              onChange={value => {
                                const newProjects = [
                                  ...(currentResumeData.projects || []),
                                ];
                                newProjects[index] = {
                                  ...project,
                                  name: value,
                                };
                                handleDataUpdate('projects', newProjects);
                              }}
                              placeholder='E-commerce Platform'
                            />
                          </FormField>
                          <FormField label='Project URL (Optional)'>
                            <ResumeInput
                              type='url'
                              value={project.url || ''}
                              onChange={value => {
                                const newProjects = [
                                  ...(currentResumeData.projects || []),
                                ];
                                newProjects[index] = {
                                  ...project,
                                  url: value,
                                };
                                handleDataUpdate('projects', newProjects);
                              }}
                              placeholder='https://yourproject.com'
                            />
                          </FormField>
                          <FormField label='GitHub Repository (Optional)'>
                            <ResumeInput
                              type='url'
                              value={project.github || ''}
                              onChange={value => {
                                const newProjects = [
                                  ...(currentResumeData.projects || []),
                                ];
                                newProjects[index] = {
                                  ...project,
                                  github: value,
                                };
                                handleDataUpdate('projects', newProjects);
                              }}
                              placeholder='https://github.com/username/project'
                            />
                          </FormField>
                          <FormField label='Start Date'>
                            <ResumeInput
                              value={project.startDate || ''}
                              onChange={value => {
                                const newProjects = [
                                  ...(currentResumeData.projects || []),
                                ];
                                newProjects[index] = {
                                  ...project,
                                  startDate: value,
                                };
                                handleDataUpdate('projects', newProjects);
                              }}
                              placeholder='Jan 2023'
                            />
                          </FormField>
                          <FormField label='End Date (Optional)'>
                            <ResumeInput
                              value={project.endDate || ''}
                              onChange={value => {
                                const newProjects = [
                                  ...(currentResumeData.projects || []),
                                ];
                                newProjects[index] = {
                                  ...project,
                                  endDate: value,
                                };
                                handleDataUpdate('projects', newProjects);
                              }}
                              placeholder='Dec 2023 or Present'
                            />
                          </FormField>
                        </div>
                        <FormField label='Project Description'>
                          <RichTextInput
                            content={project.description}
                            onChange={content => {
                              const newProjects = [
                                ...(currentResumeData.projects || []),
                              ];
                              newProjects[index] = {
                                ...project,
                                description: content,
                              };
                              handleDataUpdate('projects', newProjects);
                            }}
                            placeholder='Describe your project, technologies used, and your role...'
                            maxLength={800}
                            context={`${project.name} project`}
                            type='project'
                          />
                        </FormField>
                        <FormField
                          label='Technologies Used'
                          helperText='Separate technologies with commas'
                        >
                          <ResumeInput
                            value={project.technologies.join(', ')}
                            onChange={value => {
                              const newProjects = [
                                ...(currentResumeData.projects || []),
                              ];
                              newProjects[index] = {
                                ...project,
                                technologies: value
                                  .split(',')
                                  .map(s => s.trim())
                                  .filter(s => s),
                              };
                              handleDataUpdate('projects', newProjects);
                            }}
                            placeholder='React, Node.js, MongoDB, AWS...'
                          />
                        </FormField>
                      </ItemCard>
                    ))}
                    <Button
                      variant='outline'
                      onClick={() => {
                        const newProject = {
                          id: `project-${Date.now()}`,
                          name: '',
                          description: '',
                          technologies: [],
                          url: '',
                          github: '',
                          startDate: '',
                          endDate: '',
                        };
                        handleDataUpdate('projects', [
                          ...(currentResumeData.projects || []),
                          newProject,
                        ]);
                      }}
                      className='w-full'
                    >
                      ➕ Add Project
                    </Button>
                  </CollapsibleSection>
                </Card>

                {/* Skills */}
                <Card>
                  <CollapsibleSection
                    title='Skills *'
                    icon='⚡'
                    color='cyan'
                    count={
                      currentResumeData.skills.technical.length +
                      currentResumeData.skills.business.length +
                      currentResumeData.skills.soft.length +
                      currentResumeData.skills.languages.length +
                      currentResumeData.skills.certifications.length
                    }
                    countLabel='skills'
                    isExpanded={expandedSections.skills || false}
                    onToggle={() => toggleSection('skills')}
                  >
                    <SectionValidation
                      section='skills'
                      resumeData={currentResumeData}
                      className='mb-4'
                    />
                    <FormField
                      label='Technical Skills'
                      required
                      helperText='Separate skills with commas'
                    >
                      <ResumeInput
                        value={currentResumeData.skills.technical.join(', ')}
                        onChange={value =>
                          handleDataUpdate('skills', {
                            ...currentResumeData.skills,
                            technical: value
                              .split(',')
                              .map(s => capitalizeFirstLetter(s.trim()))
                              .filter(s => s),
                          })
                        }
                        placeholder='JavaScript, React, Node.js, Python...'
                      />
                    </FormField>
                    <FormField
                      label='Business Skills'
                      helperText='Separate skills with commas'
                    >
                      <ResumeInput
                        value={currentResumeData.skills.business.join(', ')}
                        onChange={value =>
                          handleDataUpdate('skills', {
                            ...currentResumeData.skills,
                            business: value
                              .split(',')
                              .map(s => capitalizeFirstLetter(s.trim()))
                              .filter(s => s),
                          })
                        }
                        placeholder='Project Management, Sales, Marketing, Finance...'
                      />
                    </FormField>
                    <FormField
                      label='Soft Skills'
                      helperText='Separate skills with commas'
                    >
                      <ResumeInput
                        value={currentResumeData.skills.soft.join(', ')}
                        onChange={value =>
                          handleDataUpdate('skills', {
                            ...currentResumeData.skills,
                            soft: value
                              .split(',')
                              .map(s => capitalizeFirstLetter(s.trim()))
                              .filter(s => s),
                          })
                        }
                        placeholder='Leadership, Communication, Problem Solving...'
                      />
                    </FormField>
                    <FormField
                      label='Languages'
                      helperText='Separate languages with commas'
                    >
                      <ResumeInput
                        value={currentResumeData.skills.languages.join(', ')}
                        onChange={value =>
                          handleDataUpdate('skills', {
                            ...currentResumeData.skills,
                            languages: value
                              .split(',')
                              .map(s => capitalizeFirstLetter(s.trim()))
                              .filter(s => s),
                          })
                        }
                        placeholder='English (Native), Spanish (Fluent), French (Intermediate)...'
                      />
                    </FormField>
                    <FormField
                      label='Certifications'
                      helperText='Separate certifications with commas'
                    >
                      <ResumeInput
                        value={currentResumeData.skills.certifications.join(
                          ', '
                        )}
                        onChange={value =>
                          handleDataUpdate('skills', {
                            ...currentResumeData.skills,
                            certifications: value
                              .split(',')
                              .map(s => capitalizeFirstLetter(s.trim()))
                              .filter(s => s),
                          })
                        }
                        placeholder='AWS Certified, PMP, Google Analytics...'
                      />
                    </FormField>
                  </CollapsibleSection>
                </Card>

                {/* Certifications */}
                <Card>
                  <CollapsibleSection
                    title='Certifications'
                    icon='🏆'
                    color='purple'
                    count={currentResumeData.certifications?.length || 0}
                    countLabel='certifications'
                    isExpanded={expandedSections.certifications || false}
                    onToggle={() => toggleSection('certifications')}
                  >
                    <SectionValidation
                      section='certifications'
                      resumeData={currentResumeData}
                      className='mb-4'
                    />
                    <div className='space-y-4'>
                      {currentResumeData.certifications?.map((cert, index) => (
                        <div
                          key={index}
                          className='flex items-center space-x-2'
                        >
                          <input
                            type='text'
                            value={typeof cert === 'string' ? cert : cert.name}
                            onChange={e => {
                              const newCerts = [
                                ...(currentResumeData.certifications || []),
                              ];
                              newCerts[index] = {
                                name: e.target.value,
                                issuer: '',
                                date: '',
                              };
                              handleDataUpdate('certifications', newCerts);
                            }}
                            className='flex-1 px-3 py-2 sm:px-4 sm:py-3 border-2 border-border rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-background text-foreground font-medium transition-all duration-200 text-sm sm:text-base'
                            placeholder='AWS Certified Solutions Architect'
                          />
                          <Button
                            variant='outline'
                            size='sm'
                            onClick={() => {
                              const newCerts = (
                                currentResumeData.certifications || []
                              ).filter((_, i) => i !== index);
                              handleDataUpdate('certifications', newCerts);
                            }}
                            className='text-red-600 hover:bg-red-50'
                          >
                            Remove
                          </Button>
                        </div>
                      ))}
                      <Button
                        variant='outline'
                        onClick={() => {
                          handleDataUpdate('certifications', [
                            ...(currentResumeData.certifications || []),
                            '',
                          ]);
                        }}
                        className='w-full'
                      >
                        + Add Certification
                      </Button>
                    </div>
                  </CollapsibleSection>
                </Card>

                {/* Achievements */}
                <Card>
                  <CollapsibleSection
                    title='Achievements'
                    icon='🏆'
                    color='purple'
                    count={currentResumeData.achievements?.length || 0}
                    countLabel={
                      currentResumeData.achievements?.length === 1
                        ? 'achievement'
                        : 'achievements'
                    }
                    isExpanded={expandedSections.achievements || false}
                    onToggle={() => toggleSection('achievements')}
                  >
                    <div className='space-y-4'>
                      {currentResumeData.achievements?.map(
                        (achievement, index) => (
                          <div
                            key={index}
                            className='flex items-center space-x-2'
                          >
                            <input
                              type='text'
                              value={achievement}
                              onChange={e => {
                                const newAchievements = [
                                  ...(currentResumeData.achievements || []),
                                ];
                                newAchievements[index] = e.target.value;
                                handleDataUpdate(
                                  'achievements',
                                  newAchievements
                                );
                              }}
                              className='flex-1 px-3 py-2 sm:px-4 sm:py-3 border-2 border-border rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-background text-foreground font-medium transition-all duration-200 text-sm sm:text-base'
                              placeholder='Led team of 5 developers to deliver project 2 weeks early'
                            />
                            <Button
                              variant='outline'
                              size='sm'
                              onClick={() => {
                                const newAchievements = (
                                  currentResumeData.achievements || []
                                ).filter((_, i) => i !== index);
                                handleDataUpdate(
                                  'achievements',
                                  newAchievements
                                );
                              }}
                              className='text-red-600 hover:bg-red-50'
                            >
                              Remove
                            </Button>
                          </div>
                        )
                      )}
                      <Button
                        variant='outline'
                        onClick={() => {
                          handleDataUpdate('achievements', [
                            ...(currentResumeData.achievements || []),
                            '',
                          ]);
                        }}
                        className='w-full'
                      >
                        + Add Achievement
                      </Button>
                    </div>
                  </CollapsibleSection>
                </Card>

                {/* Bottom spacing to prevent touching footer */}
                <div className='h-8'></div>
              </div>
            </div>
          </div>
        );

      case 'preview':
        return (
          <div className='max-w-4xl mx-auto p-6'>
            <div className='mb-6'>
              <div className='flex items-center justify-between'>
                <h2 className='text-2xl font-bold text-foreground'>
                  Resume Preview
                </h2>
                <div className='flex space-x-2'>
                  <Button
                    variant='outline'
                    onClick={() => setCurrentStep('builder')}
                  >
                    Edit Resume
                  </Button>
                  <Button onClick={handleSave}>Save Resume</Button>
                </div>
              </div>
            </div>

            {/* Resume Preview */}
            <Card className='p-8 bg-card shadow-lg'>
              <div className='max-w-2xl mx-auto'>
                {/* Header */}
                <div className='text-center mb-6'>
                  <h1 className='text-2xl font-bold text-card-foreground mb-2'>
                    {currentResumeData.personal.fullName || 'Your Name'}
                  </h1>
                  <div className='text-sm text-muted-foreground space-y-1'>
                    <p>
                      {currentResumeData.personal.email ||
                        'your.email@example.com'}
                    </p>
                    <p>
                      {currentResumeData.personal.phone || '(555) 123-4567'}
                    </p>
                    <p>
                      {currentResumeData.personal.location || 'Your Location'}
                    </p>
                    {currentResumeData.personal.linkedin && (
                      <p>LinkedIn: {currentResumeData.personal.linkedin}</p>
                    )}
                    {currentResumeData.personal.github && (
                      <p>GitHub: {currentResumeData.personal.github}</p>
                    )}
                    {currentResumeData.personal.portfolio && (
                      <p>Portfolio: {currentResumeData.personal.portfolio}</p>
                    )}
                    {currentResumeData.personal.jobTitle && (
                      <p>Current Role: {currentResumeData.personal.jobTitle}</p>
                    )}
                  </div>
                </div>

                {/* Summary */}
                {currentResumeData.summary && (
                  <div className='mb-6'>
                    <h2 className='text-lg font-semibold text-card-foreground mb-2'>
                      Professional Summary
                    </h2>
                    <p className='text-muted-foreground'>
                      {currentResumeData.summary}
                    </p>
                  </div>
                )}

                {/* Skills */}
                {currentResumeData.skills.technical.length > 0 && (
                  <div className='mb-6'>
                    <h2 className='text-lg font-semibold text-card-foreground mb-2'>
                      Technical Skills
                    </h2>
                    <p className='text-muted-foreground'>
                      {currentResumeData.skills.technical.join(', ')}
                    </p>
                  </div>
                )}

                {/* Business Skills */}
                {currentResumeData.skills.business.length > 0 && (
                  <div className='mb-6'>
                    <h2 className='text-lg font-semibold text-card-foreground mb-2'>
                      Business Skills
                    </h2>
                    <p className='text-muted-foreground'>
                      {currentResumeData.skills.business.join(', ')}
                    </p>
                  </div>
                )}

                {/* Soft Skills */}
                {currentResumeData.skills.soft.length > 0 && (
                  <div className='mb-6'>
                    <h2 className='text-lg font-semibold text-card-foreground mb-2'>
                      Soft Skills
                    </h2>
                    <p className='text-muted-foreground'>
                      {currentResumeData.skills.soft.join(', ')}
                    </p>
                  </div>
                )}

                {/* Languages */}
                {currentResumeData.skills.languages.length > 0 && (
                  <div className='mb-6'>
                    <h2 className='text-lg font-semibold text-card-foreground mb-2'>
                      Languages
                    </h2>
                    <p className='text-muted-foreground'>
                      {currentResumeData.skills.languages.join(', ')}
                    </p>
                  </div>
                )}

                {/* Certifications */}
                {currentResumeData.skills.certifications.length > 0 && (
                  <div className='mb-6'>
                    <h2 className='text-lg font-semibold text-card-foreground mb-2'>
                      Certifications
                    </h2>
                    <p className='text-muted-foreground'>
                      {currentResumeData.skills.certifications.join(', ')}
                    </p>
                  </div>
                )}

                {/* Hobbies */}
                {currentResumeData.hobbies &&
                  currentResumeData.hobbies.length > 0 && (
                    <div className='mb-6'>
                      <h2 className='text-lg font-semibold text-card-foreground mb-2'>
                        Hobbies & Interests
                      </h2>
                      <p className='text-muted-foreground'>
                        {currentResumeData.hobbies.join(', ')}
                      </p>
                    </div>
                  )}
              </div>
            </Card>

            {/* Preview with Templates */}
            <div className='mt-8 text-center'>
              <Button
                onClick={() => {
                  // Save current data to localStorage and navigate to templates
                  localStorage.setItem(
                    'resumeBuilderData',
                    JSON.stringify(resumeData)
                  );
                  window.location.href = '/resume/templates';
                }}
                className='bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white px-8 py-3 text-lg font-semibold mb-6'
              >
                <span className='mr-2'>👁️</span>
                Preview with Templates
              </Button>
            </div>

            {/* Export Options */}
            <div className='mt-8 text-center'>
              <h3 className='text-lg font-semibold mb-4'>Export Options</h3>
              <div className='flex flex-col sm:flex-row gap-4 justify-center items-center'>
                <Tooltip
                  content='Ready to Improve Your Resume? Take action based on your ATS analysis results to boost your score.'
                  position='top'
                  delay={200}
                >
                  <Button
                    onClick={() => {
                      setCurrentStep('builder');
                    }}
                    className='bg-purple-500 hover:bg-purple-600'
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
                        d='M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z'
                      />
                    </svg>
                    Check ATS Score
                  </Button>
                </Tooltip>
                <div className='flex gap-2'>
                  <DOCXExporter
                    resumeData={currentResumeData}
                    template={null}
                    onExport={() => {
                      /* DOCX exported */
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className='min-h-screen bg-background'>
      {/* Main Content */}
      {renderStepContent()}

      {/* Floating Actions */}
      {currentStep === 'builder' && (
        <FloatingActions resumeData={currentResumeData} onSave={handleSave} />
      )}

      {/* Floating AI Content Improver */}
      {currentStep === 'builder' && (
        <UnifiedAIContentImprover
          resumeData={currentResumeData}
          onContentUpdate={setResumeData}
          className='fixed bottom-20 right-4 z-40'
        />
      )}

      {/* Validation Modal */}
      {validationResult && pendingAction && (
        <ValidationModal
          isOpen={showValidationModal}
          onClose={handleValidationCancel}
          onProceed={handleValidationProceed}
          validationResult={validationResult}
          actionType={pendingAction.type}
        />
      )}
    </div>
  );
};

export default ResumeBuilder;
