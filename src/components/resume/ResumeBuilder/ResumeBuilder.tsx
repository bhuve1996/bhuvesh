'use client';

import React, { useEffect, useState } from 'react';

import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { CollapsibleSection } from '@/components/ui/CollapsibleSection';
import { FormField } from '@/components/ui/FormField';
import { ItemCard } from '@/components/ui/ItemCard';
import { ResumeInput } from '@/components/ui/ResumeInput';
import { RichTextInput } from '@/components/ui/RichTextInput';
import { validateResumeData, ValidationResult } from '@/lib/resume/validation';
import { ResumeData } from '@/types/resume';

import { AIAssistant } from '../AIAssistant';
import { ATSIntegration } from '../ATSIntegration';
import { DOCXExporter } from '../DOCXExporter';
import { PDFExporter } from '../PDFExporter';
import { RichTextEditor } from '../RichTextEditor';
import { ValidationModal } from '../ValidationModal';

interface ResumeBuilderProps {
  initialData?: Partial<ResumeData> | undefined;
  onSave?: (data: ResumeData) => void;
  onExport?: (data: ResumeData, format: 'pdf' | 'docx' | 'txt') => void;
}

export const ResumeBuilder: React.FC<ResumeBuilderProps> = ({
  initialData,
  onSave,
  onExport,
}) => {
  const [currentStep, setCurrentStep] = useState<
    'builder' | 'preview' | 'sections'
  >('builder');
  const [currentTab, setCurrentTab] = useState<'content' | 'sections' | 'ats'>(
    'content'
  );
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
    summary: false,
    experience: false,
    education: false,
    skills: false,
    projects: false,
    achievements: false,
  });
  const [resumeData, setResumeData] = useState<ResumeData>({
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
  });

  // Initialize with ATS data
  useEffect(() => {
    if (initialData) {
      setResumeData(_prev => {
        // Use ONLY parsed data - no sample data at all
        return {
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
        };
      });
    }
  }, [initialData]);

  const handleDataUpdate = (section: keyof ResumeData, data: unknown) => {
    setResumeData(prev => ({
      ...prev,
      [section]: data,
    }));
  };

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const capitalizeFirstLetter = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };

  const handleSave = () => {
    // Validate resume data before saving
    const validation = validateResumeData(resumeData);
    setValidationResult(validation);
    setPendingAction({ type: 'save' });
    setShowValidationModal(true);
  };

  const handleExport = (format: 'pdf' | 'docx' | 'txt') => {
    // Validate resume data before exporting
    const validation = validateResumeData(resumeData);
    setValidationResult(validation);
    setPendingAction({ type: 'export', format });
    setShowValidationModal(true);
  };

  const handleValidationProceed = () => {
    if (!pendingAction) return;

    if (pendingAction.type === 'save') {
      if (onSave) {
        onSave(resumeData);
      }
      // Also save to localStorage (client-side only)
      if (typeof window !== 'undefined') {
        localStorage.setItem('resume-builder-data', JSON.stringify(resumeData));
      }
    } else if (pendingAction.type === 'export' && pendingAction.format) {
      if (onExport) {
        onExport(resumeData, pendingAction.format);
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
          <div className='max-w-7xl mx-auto p-6'>
            <div className='mb-6'>
              <div className='flex items-center justify-between'>
                <div>
                  <h2 className='text-2xl font-bold text-foreground'>
                    Build Your Resume
                  </h2>
                  <p className='text-muted-foreground'>
                    Build your professional resume
                  </p>
                </div>
                <div className='flex space-x-2'>
                  <Button
                    variant='outline'
                    onClick={() => setCurrentStep('preview')}
                  >
                    Preview
                  </Button>
                </div>
              </div>

              {/* Tabs */}
              <div className='mt-6'>
                <div className='border-b border-border'>
                  <nav className='-mb-px flex space-x-8'>
                    <button
                      onClick={() => setCurrentTab('content')}
                      className={`py-2 px-1 border-b-2 font-medium text-sm ${
                        currentTab === 'content'
                          ? 'border-cyan-500 text-cyan-600'
                          : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
                      }`}
                    >
                      Content
                    </button>
                    <button
                      onClick={() => setCurrentTab('sections')}
                      className={`py-2 px-1 border-b-2 font-medium text-sm ${
                        currentTab === 'sections'
                          ? 'border-cyan-500 text-cyan-600'
                          : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
                      }`}
                    >
                      Sections
                    </button>
                    <button
                      onClick={() => setCurrentTab('ats')}
                      className={`py-2 px-1 border-b-2 font-medium text-sm ${
                        currentTab === 'ats'
                          ? 'border-cyan-500 text-cyan-600'
                          : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
                      }`}
                    >
                      ATS Analysis
                    </button>
                  </nav>
                </div>
              </div>
            </div>

            {/* Tab Content */}
            {currentTab === 'content' ? (
              <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
                {/* Builder Form */}
                <div className='lg:col-span-2 space-y-8'>
                  {/* Personal Information */}
                  <Card>
                    <CollapsibleSection
                      title='Personal Information'
                      icon='👤'
                      color='primary'
                      count={
                        Object.values(resumeData.personal).filter(
                          value => value && value.trim() !== ''
                        ).length
                      }
                      countLabel='fields'
                      isExpanded={expandedSections.personal || false}
                      onToggle={() => toggleSection('personal')}
                    >
                      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                        <div>
                          <label className='block text-sm font-semibold text-foreground mb-2 uppercase tracking-wide'>
                            Full Name *
                          </label>
                          <input
                            type='text'
                            value={resumeData.personal.fullName}
                            onChange={e =>
                              handleDataUpdate('personal', {
                                ...resumeData.personal,
                                fullName: e.target.value,
                              })
                            }
                            className='w-full px-4 py-3 border-2 border-border rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-background text-foreground font-medium transition-all duration-200'
                            placeholder='John Smith'
                          />
                        </div>
                        <div>
                          <label className='block text-sm font-semibold text-foreground mb-2 uppercase tracking-wide'>
                            Email *
                          </label>
                          <input
                            type='email'
                            value={resumeData.personal.email}
                            onChange={e =>
                              handleDataUpdate('personal', {
                                ...resumeData.personal,
                                email: e.target.value,
                              })
                            }
                            className='w-full px-4 py-3 border-2 border-border rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-background text-foreground font-medium transition-all duration-200'
                            placeholder='john.smith@email.com'
                          />
                        </div>
                        <div>
                          <label className='block text-sm font-semibold text-foreground mb-2 uppercase tracking-wide'>
                            Phone
                          </label>
                          <input
                            type='tel'
                            value={resumeData.personal.phone}
                            onChange={e =>
                              handleDataUpdate('personal', {
                                ...resumeData.personal,
                                phone: e.target.value,
                              })
                            }
                            className='w-full px-4 py-3 border-2 border-border rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-background text-foreground font-medium transition-all duration-200'
                            placeholder='(555) 123-4567'
                          />
                        </div>
                        <div>
                          <label className='block text-sm font-semibold text-foreground mb-2 uppercase tracking-wide'>
                            Location
                          </label>
                          <input
                            type='text'
                            value={resumeData.personal.location}
                            onChange={e =>
                              handleDataUpdate('personal', {
                                ...resumeData.personal,
                                location: e.target.value,
                              })
                            }
                            className='w-full px-4 py-3 border-2 border-border rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-background text-foreground font-medium transition-all duration-200'
                            placeholder='San Francisco, CA'
                          />
                        </div>
                        <div>
                          <label className='block text-sm font-semibold text-foreground mb-2 uppercase tracking-wide'>
                            LinkedIn
                          </label>
                          <input
                            type='url'
                            value={resumeData.personal.linkedin || ''}
                            onChange={e =>
                              handleDataUpdate('personal', {
                                ...resumeData.personal,
                                linkedin: e.target.value,
                              })
                            }
                            className='w-full px-4 py-3 border-2 border-border rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-background text-foreground font-medium transition-all duration-200'
                            placeholder='linkedin.com/in/johnsmith'
                          />
                        </div>
                        <div>
                          <label className='block text-sm font-semibold text-foreground mb-2 uppercase tracking-wide'>
                            GitHub
                          </label>
                          <input
                            type='url'
                            value={resumeData.personal.github || ''}
                            onChange={e =>
                              handleDataUpdate('personal', {
                                ...resumeData.personal,
                                github: e.target.value,
                              })
                            }
                            className='w-full px-4 py-3 border-2 border-border rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-background text-foreground font-medium transition-all duration-200'
                            placeholder='github.com/johnsmith'
                          />
                        </div>
                      </div>
                      <div className='mt-4'>
                        <AIAssistant
                          onSuggestion={_suggestion => {
                            // AI can suggest improvements for personal information
                            // console.log(
                            //   'AI suggestion for personal info:',
                            //   suggestion
                            // );
                          }}
                          context={`Personal information for ${resumeData.personal.fullName || 'resume'}`}
                          type='personal'
                        />
                      </div>
                    </CollapsibleSection>
                  </Card>

                  {/* Professional Summary */}
                  <Card>
                    <CollapsibleSection
                      title='Professional Summary'
                      icon='📝'
                      color='blue'
                      count={resumeData.summary ? 1 : 0}
                      countLabel='summary'
                      isExpanded={expandedSections.summary || false}
                      onToggle={() => toggleSection('summary')}
                    >
                      <RichTextEditor
                        content={resumeData.summary || ''}
                        onChange={content =>
                          handleDataUpdate('summary', content)
                        }
                        placeholder='Write a brief summary of your professional background and key strengths...'
                        maxLength={500}
                      />
                      <div className='mt-4'>
                        <AIAssistant
                          onSuggestion={suggestion =>
                            handleDataUpdate('summary', suggestion)
                          }
                          context={
                            resumeData.personal.fullName
                              ? `Professional summary for ${resumeData.personal.fullName}`
                              : ''
                          }
                          type='summary'
                        />
                      </div>
                    </CollapsibleSection>
                  </Card>

                  {/* Work Experience */}
                  <Card>
                    <CollapsibleSection
                      title='Work Experience'
                      icon='💼'
                      color='green'
                      count={resumeData.experience.length}
                      countLabel={
                        resumeData.experience.length === 1 ? 'job' : 'jobs'
                      }
                      isExpanded={expandedSections.experience || false}
                      onToggle={() => toggleSection('experience')}
                    >
                      {resumeData.experience.map((job, index) => (
                        <ItemCard
                          key={job.id}
                          onRemove={() => {
                            const newExperience = resumeData.experience.filter(
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
                                    ...resumeData.experience,
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
                                    ...resumeData.experience,
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
                                    ...resumeData.experience,
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
                                    ...resumeData.experience,
                                  ];
                                  const [startDate, endDate] =
                                    value.split(' - ');
                                  newExperience[index] = {
                                    ...job,
                                    startDate: startDate || '',
                                    endDate:
                                      endDate === 'Present'
                                        ? ''
                                        : endDate || '',
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
                                  ...resumeData.experience,
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
                            title: '',
                            company: '',
                            location: '',
                            period: '',
                            description: '',
                            achievements: [],
                            technologies: [],
                          };
                          handleDataUpdate('experience', [
                            ...resumeData.experience,
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
                      title='Education'
                      icon='🎓'
                      color='purple'
                      count={resumeData.education.length}
                      countLabel={
                        resumeData.education.length === 1 ? 'degree' : 'degrees'
                      }
                      isExpanded={expandedSections.education || false}
                      onToggle={() => toggleSection('education')}
                    >
                      {resumeData.education.map((edu, index) => (
                        <ItemCard
                          key={edu.id}
                          onRemove={() => {
                            const newEducation = resumeData.education.filter(
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
                                    ...resumeData.education,
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
                                    ...resumeData.education,
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
                            <FormField label='Location'>
                              <ResumeInput
                                value={edu.location}
                                onChange={value => {
                                  const newEducation = [
                                    ...resumeData.education,
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
                                    ...resumeData.education,
                                  ];
                                  const [startDate, endDate] =
                                    value.split(' - ');
                                  newEducation[index] = {
                                    ...edu,
                                    startDate: startDate || '',
                                    endDate:
                                      endDate === 'Present'
                                        ? ''
                                        : endDate || '',
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
                                    ...resumeData.education,
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
                            school: '',
                            location: '',
                            period: '',
                            gpa: '',
                            relevant_courses: [],
                          };
                          handleDataUpdate('education', [
                            ...resumeData.education,
                            newEducation,
                          ]);
                        }}
                        className='w-full'
                      >
                        ➕ Add Education
                      </Button>
                      <div className='mt-4'>
                        <AIAssistant
                          onSuggestion={_suggestion => {
                            // AI can suggest education improvements
                            // console.log(
                            //   'AI suggestion for education:',
                            //   suggestion
                            // );
                          }}
                          context={`Education section for ${resumeData.personal.fullName || 'resume'}`}
                          type='education'
                        />
                      </div>
                    </CollapsibleSection>
                  </Card>

                  {/* Projects */}
                  <Card>
                    <CollapsibleSection
                      title='Projects'
                      icon='🚀'
                      color='orange'
                      count={resumeData.projects?.length || 0}
                      countLabel={
                        resumeData.projects?.length === 1
                          ? 'project'
                          : 'projects'
                      }
                      isExpanded={expandedSections.projects || false}
                      onToggle={() => toggleSection('projects')}
                    >
                      {resumeData.projects?.map((project, index) => (
                        <ItemCard
                          key={project.id}
                          onRemove={() => {
                            const newProjects = (
                              resumeData.projects || []
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
                                    ...(resumeData.projects || []),
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
                            <FormField label='Project Link (Optional)'>
                              <ResumeInput
                                type='url'
                                value={project.url || ''}
                                onChange={value => {
                                  const newProjects = [
                                    ...(resumeData.projects || []),
                                  ];
                                  newProjects[index] = {
                                    ...project,
                                    url: value,
                                  };
                                  handleDataUpdate('projects', newProjects);
                                }}
                                placeholder='https://github.com/username/project'
                              />
                            </FormField>
                          </div>
                          <FormField label='Project Description'>
                            <RichTextInput
                              content={project.description}
                              onChange={content => {
                                const newProjects = [
                                  ...(resumeData.projects || []),
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
                                  ...(resumeData.projects || []),
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
                            link: '',
                          };
                          handleDataUpdate('projects', [
                            ...(resumeData.projects || []),
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
                      title='Skills'
                      icon='⚡'
                      color='cyan'
                      count={
                        resumeData.skills.technical.length +
                        resumeData.skills.soft.length
                      }
                      countLabel='skills'
                      isExpanded={expandedSections.skills || false}
                      onToggle={() => toggleSection('skills')}
                    >
                      <FormField
                        label='Technical Skills'
                        required
                        helperText='Separate skills with commas'
                      >
                        <ResumeInput
                          value={resumeData.skills.technical.join(', ')}
                          onChange={value =>
                            handleDataUpdate('skills', {
                              ...resumeData.skills,
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
                        label='Soft Skills'
                        helperText='Separate skills with commas'
                      >
                        <ResumeInput
                          value={resumeData.skills.soft.join(', ')}
                          onChange={value =>
                            handleDataUpdate('skills', {
                              ...resumeData.skills,
                              soft: value
                                .split(',')
                                .map(s => capitalizeFirstLetter(s.trim()))
                                .filter(s => s),
                            })
                          }
                          placeholder='Leadership, Communication, Problem Solving...'
                        />
                      </FormField>
                      <div className='mt-4'>
                        <AIAssistant
                          onSuggestion={_suggestion => {
                            // AI can suggest skills improvements
                            // console.log(
                            //   'AI suggestion for skills:',
                            //   suggestion
                            // );
                          }}
                          context={`Skills section for ${resumeData.personal.fullName || 'resume'}`}
                          type='skills'
                        />
                      </div>
                    </CollapsibleSection>
                  </Card>

                  {/* Certifications */}
                  <Card className='p-6'>
                    <h3 className='text-lg font-semibold mb-4'>
                      Certifications
                    </h3>
                    <div className='space-y-4'>
                      {resumeData.certifications?.map((cert, index) => (
                        <div
                          key={index}
                          className='flex items-center space-x-2'
                        >
                          <input
                            type='text'
                            value={typeof cert === 'string' ? cert : cert.name}
                            onChange={e => {
                              const newCerts = [
                                ...(resumeData.certifications || []),
                              ];
                              newCerts[index] = {
                                name: e.target.value,
                                issuer: '',
                                date: '',
                              };
                              handleDataUpdate('certifications', newCerts);
                            }}
                            className='flex-1 px-4 py-3 border-2 border-border rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-background text-foreground font-medium transition-all duration-200'
                            placeholder='AWS Certified Solutions Architect'
                          />
                          <Button
                            variant='outline'
                            size='sm'
                            onClick={() => {
                              const newCerts = (
                                resumeData.certifications || []
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
                            ...(resumeData.certifications || []),
                            '',
                          ]);
                        }}
                        className='w-full'
                      >
                        + Add Certification
                      </Button>
                    </div>
                    <div className='mt-4'>
                      <AIAssistant
                        onSuggestion={_suggestion => {
                          // AI can suggest certifications improvements
                          // console.log(
                          //   'AI suggestion for certifications:',
                          //   suggestion
                          // );
                        }}
                        context={`Certifications section for ${resumeData.personal.fullName || 'resume'}`}
                        type='certifications'
                      />
                    </div>
                  </Card>

                  {/* Achievements */}
                  <Card>
                    <CollapsibleSection
                      title='Achievements'
                      icon='🏆'
                      color='purple'
                      count={resumeData.achievements?.length || 0}
                      countLabel={
                        resumeData.achievements?.length === 1
                          ? 'achievement'
                          : 'achievements'
                      }
                      isExpanded={expandedSections.achievements || false}
                      onToggle={() => toggleSection('achievements')}
                    >
                      <div className='space-y-4'>
                        {resumeData.achievements?.map((achievement, index) => (
                          <div
                            key={index}
                            className='flex items-center space-x-2'
                          >
                            <input
                              type='text'
                              value={achievement}
                              onChange={e => {
                                const newAchievements = [
                                  ...(resumeData.achievements || []),
                                ];
                                newAchievements[index] = e.target.value;
                                handleDataUpdate(
                                  'achievements',
                                  newAchievements
                                );
                              }}
                              className='flex-1 px-4 py-3 border-2 border-border rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-background text-foreground font-medium transition-all duration-200'
                              placeholder='Led team of 5 developers to deliver project 2 weeks early'
                            />
                            <Button
                              variant='outline'
                              size='sm'
                              onClick={() => {
                                const newAchievements = (
                                  resumeData.achievements || []
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
                        ))}
                        <Button
                          variant='outline'
                          onClick={() => {
                            handleDataUpdate('achievements', [
                              ...(resumeData.achievements || []),
                              '',
                            ]);
                          }}
                          className='w-full'
                        >
                          + Add Achievement
                        </Button>
                      </div>
                      <div className='mt-4'>
                        <AIAssistant
                          onSuggestion={_suggestion => {
                            // AI can suggest achievements improvements
                            // console.log(
                            //   'AI suggestion for achievements:',
                            //   suggestion
                            // );
                          }}
                          context={`Achievements section for ${resumeData.personal.fullName || 'resume'}`}
                          type='achievements'
                        />
                      </div>
                    </CollapsibleSection>
                  </Card>
                </div>

                {/* Preview Panel */}
                <div className='lg:col-span-1'>
                  <Card className='p-6 sticky top-6'>
                    <h3 className='text-lg font-semibold mb-4'>Live Preview</h3>
                    <div className='space-y-4'>
                      <div className='text-center'>
                        <h4 className='font-semibold text-lg'>
                          {resumeData.personal.fullName || 'Your Name'}
                        </h4>
                        <p className='text-sm text-gray-600'>
                          {resumeData.personal.email ||
                            'your.email@example.com'}
                        </p>
                        <p className='text-sm text-gray-600'>
                          {resumeData.personal.phone || '(555) 123-4567'}
                        </p>
                        <p className='text-sm text-gray-600'>
                          {resumeData.personal.location || 'Your Location'}
                        </p>
                      </div>

                      {resumeData.summary && (
                        <div>
                          <h5 className='font-medium text-sm text-gray-700 mb-1'>
                            Summary
                          </h5>
                          <p className='text-xs text-gray-600 line-clamp-3'>
                            {resumeData.summary}
                          </p>
                        </div>
                      )}

                      {resumeData.skills.technical.length > 0 && (
                        <div>
                          <h5 className='font-medium text-sm text-gray-700 mb-1'>
                            Technical Skills
                          </h5>
                          <div className='flex flex-wrap gap-1'>
                            {resumeData.skills.technical
                              .slice(0, 6)
                              .map((skill, index) => (
                                <span
                                  key={index}
                                  className='px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded'
                                >
                                  {skill}
                                </span>
                              ))}
                            {resumeData.skills.technical.length > 6 && (
                              <span className='text-xs text-gray-500'>
                                +{resumeData.skills.technical.length - 6} more
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className='mt-6 space-y-2'>
                      <Button onClick={handleSave} className='w-full'>
                        Save Resume
                      </Button>
                      <Button
                        onClick={() => setCurrentTab('ats')}
                        className='w-full bg-purple-500 hover:bg-purple-600'
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
                      <div className='grid grid-cols-3 gap-2'>
                        <PDFExporter
                          resumeData={resumeData}
                          template={null}
                          onExport={() => {
                            /* PDF exported */
                          }}
                        />
                        <DOCXExporter
                          resumeData={resumeData}
                          template={null}
                          onExport={() => {
                            /* DOCX exported */
                          }}
                        />
                        <Button
                          variant='outline'
                          size='sm'
                          onClick={() => handleExport('txt')}
                        >
                          TXT
                        </Button>
                      </div>
                    </div>
                  </Card>
                </div>
              </div>
            ) : currentTab === 'sections' ? (
              /* Sections Tab */
              <div className='max-w-4xl mx-auto'>
                <div className='text-center py-12'>
                  <h3 className='text-lg font-medium text-muted-foreground'>
                    Template sections are managed in the Templates page
                  </h3>
                  <p className='text-sm text-muted-foreground mt-2'>
                    Go to the Templates page to customize template layouts
                  </p>
                </div>
              </div>
            ) : (
              /* ATS Analysis Tab */
              <div className='max-w-4xl mx-auto'>
                <ATSIntegration
                  resumeData={resumeData}
                  onAnalysisComplete={_result => {
                    // ATS Analysis completed
                  }}
                />
              </div>
            )}
          </div>
        );

      case 'preview':
        return (
          <div className='max-w-4xl mx-auto p-6'>
            <div className='mb-6'>
              <div className='flex items-center justify-between'>
                <h2 className='text-2xl font-bold text-gray-900'>
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
            <Card className='p-8 bg-white shadow-lg'>
              <div className='max-w-2xl mx-auto'>
                {/* Header */}
                <div className='text-center mb-6'>
                  <h1 className='text-2xl font-bold text-gray-900 mb-2'>
                    {resumeData.personal.fullName || 'Your Name'}
                  </h1>
                  <div className='text-sm text-gray-600 space-y-1'>
                    <p>
                      {resumeData.personal.email || 'your.email@example.com'}
                    </p>
                    <p>{resumeData.personal.phone || '(555) 123-4567'}</p>
                    <p>{resumeData.personal.location || 'Your Location'}</p>
                    {resumeData.personal.linkedin && (
                      <p>LinkedIn: {resumeData.personal.linkedin}</p>
                    )}
                    {resumeData.personal.github && (
                      <p>GitHub: {resumeData.personal.github}</p>
                    )}
                  </div>
                </div>

                {/* Summary */}
                {resumeData.summary && (
                  <div className='mb-6'>
                    <h2 className='text-lg font-semibold text-gray-900 mb-2'>
                      Professional Summary
                    </h2>
                    <p className='text-gray-700'>{resumeData.summary}</p>
                  </div>
                )}

                {/* Skills */}
                {resumeData.skills.technical.length > 0 && (
                  <div className='mb-6'>
                    <h2 className='text-lg font-semibold text-gray-900 mb-2'>
                      Technical Skills
                    </h2>
                    <p className='text-gray-700'>
                      {resumeData.skills.technical.join(', ')}
                    </p>
                  </div>
                )}

                {/* Soft Skills */}
                {resumeData.skills.soft.length > 0 && (
                  <div className='mb-6'>
                    <h2 className='text-lg font-semibold text-gray-900 mb-2'>
                      Soft Skills
                    </h2>
                    <p className='text-gray-700'>
                      {resumeData.skills.soft.join(', ')}
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
                <Button
                  onClick={() => {
                    setCurrentStep('builder');
                    setCurrentTab('ats');
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
                <div className='flex gap-2'>
                  <PDFExporter
                    resumeData={resumeData}
                    template={null}
                    onExport={() => {
                      /* PDF exported */
                    }}
                  />
                  <DOCXExporter
                    resumeData={resumeData}
                    template={null}
                    onExport={() => {
                      /* DOCX exported */
                    }}
                  />
                  <Button variant='outline' onClick={() => handleExport('txt')}>
                    Export as TXT
                  </Button>
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
    <div className='min-h-screen bg-gray-50'>
      {/* Progress Steps */}
      <div className='bg-white border-b'>
        <div className='max-w-7xl mx-auto px-6 py-4 mt-8'>
          <div className='flex items-center justify-center space-x-8'>
            <div
              className={`flex items-center space-x-2 ${currentStep === 'builder' || currentStep === 'preview' ? 'text-green-600' : 'text-gray-400'}`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep === 'builder' || currentStep === 'preview' ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-500'}`}
              >
                1
              </div>
              <span className='font-medium'>Build Resume</span>
            </div>
            <div
              className={`flex items-center space-x-2 ${currentStep === 'builder' ? 'text-cyan-600' : currentStep === 'preview' ? 'text-green-600' : 'text-gray-400'}`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep === 'builder' ? 'bg-cyan-600 text-white' : currentStep === 'preview' ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-500'}`}
              >
                2
              </div>
              <span className='font-medium'>Build Resume</span>
            </div>
            <div
              className={`flex items-center space-x-2 ${currentStep === 'preview' ? 'text-cyan-600' : 'text-gray-400'}`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep === 'preview' ? 'bg-cyan-600 text-white' : 'bg-gray-200 text-gray-500'}`}
              >
                3
              </div>
              <span className='font-medium'>Preview & Export</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      {renderStepContent()}

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
