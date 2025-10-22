'use client';

import React, { useEffect, useState } from 'react';

import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { loadTemplate } from '@/lib/resume/templateLoader';
import { ResumeData, ResumeTemplate } from '@/types/resume';

import { AIAssistant } from '../AIAssistant';
import { ATSIntegration } from '../ATSIntegration';
import { DataSelectionModal } from '../DataSelectionModal';
import { DOCXExporter } from '../DOCXExporter';
import { DragDropSections } from '../DragDropSections';
import { PDFExporter } from '../PDFExporter';
import { RichTextEditor } from '../RichTextEditor';
import { TemplateGallery } from '../TemplateGallery';

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
    'template' | 'builder' | 'preview' | 'sections'
  >('template');
  const [selectedTemplate, setSelectedTemplate] =
    useState<ResumeTemplate | null>(null);
  const [currentTab, setCurrentTab] = useState<'content' | 'sections' | 'ats'>(
    'content'
  );
  const [showDataSelectionModal, setShowDataSelectionModal] = useState(false);
  const [pendingTemplate, setPendingTemplate] = useState<ResumeTemplate | null>(
    null
  );
  const [resumeData, setResumeData] = useState<ResumeData>({
    personal: {
      fullName: '',
      email: '',
      phone: '',
      location: '',
      linkedin: '',
      github: '',
      portfolio: '',
      website: '',
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

  // Initialize with ATS data (only if no template is selected yet)
  useEffect(() => {
    if (initialData && !selectedTemplate) {
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
            website: initialData.personal?.website || '',
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
  }, [initialData, selectedTemplate]);

  const handleTemplateSelect = async (template: ResumeTemplate) => {
    try {
      // Load the full template data
      const fullTemplate = await loadTemplate(template.id);
      if (fullTemplate) {
        // If we have ATS data, show the selection modal
        if (initialData && Object.keys(initialData).length > 0) {
          setPendingTemplate(fullTemplate);
          setShowDataSelectionModal(true);
        } else {
          // No ATS data, proceed directly with template sample data
          applyTemplateData(fullTemplate, false);
        }
      }
    } catch {
      // Error loading template
    }
  };

  const applyTemplateData = (
    template: ResumeTemplate,
    useParsedData: boolean
  ) => {
    setSelectedTemplate(template);
    setShowDataSelectionModal(false);
    setPendingTemplate(null);

    setResumeData(prev => {
      if (useParsedData && initialData) {
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
            website: initialData.personal?.website || '',
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
      } else {
        // Use template sample data as actual content
        let mergedData = { ...prev };

        if (template.sampleData) {
          mergedData = {
            ...mergedData,
            ...template.sampleData,
            personal: {
              ...mergedData.personal,
              ...template.sampleData?.personal,
            },
          };
        }

        return mergedData;
      }
    });

    setCurrentStep('builder');
  };

  const handleDataUpdate = (section: keyof ResumeData, data: unknown) => {
    setResumeData(prev => ({
      ...prev,
      [section]: data,
    }));
  };

  const handleSave = () => {
    if (onSave) {
      onSave(resumeData);
    }
    // Also save to localStorage (client-side only)
    if (typeof window !== 'undefined') {
      localStorage.setItem('resume-builder-data', JSON.stringify(resumeData));
    }
  };

  const handleExport = (format: 'pdf' | 'docx' | 'txt') => {
    if (onExport) {
      onExport(resumeData, format);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 'template':
        return (
          <TemplateGallery
            onTemplateSelect={handleTemplateSelect}
            selectedTemplateId={selectedTemplate?.id}
          />
        );

      case 'builder':
        return (
          <div className='max-w-7xl mx-auto p-6'>
            <div className='mb-6'>
              <div className='flex items-center justify-between'>
                <div>
                  <h2 className='text-2xl font-bold text-gray-900'>
                    Build Your Resume
                  </h2>
                  <p className='text-gray-600'>
                    Using template: {selectedTemplate?.name}
                  </p>
                </div>
                <div className='flex space-x-2'>
                  <Button
                    variant='outline'
                    onClick={() => setCurrentStep('template')}
                  >
                    Change Template
                  </Button>
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
                <div className='border-b border-gray-200'>
                  <nav className='-mb-px flex space-x-8'>
                    <button
                      onClick={() => setCurrentTab('content')}
                      className={`py-2 px-1 border-b-2 font-medium text-sm ${
                        currentTab === 'content'
                          ? 'border-cyan-500 text-cyan-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      Content
                    </button>
                    <button
                      onClick={() => setCurrentTab('sections')}
                      className={`py-2 px-1 border-b-2 font-medium text-sm ${
                        currentTab === 'sections'
                          ? 'border-cyan-500 text-cyan-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      Sections
                    </button>
                    <button
                      onClick={() => setCurrentTab('ats')}
                      className={`py-2 px-1 border-b-2 font-medium text-sm ${
                        currentTab === 'ats'
                          ? 'border-cyan-500 text-cyan-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
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
                <div className='lg:col-span-2 space-y-6'>
                  {/* Personal Information */}
                  <Card className='p-6'>
                    <h3 className='text-lg font-semibold mb-4'>
                      Personal Information
                    </h3>
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                      <div>
                        <label className='block text-sm font-medium text-gray-700 mb-1'>
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
                          className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-400 focus:border-transparent'
                          placeholder='John Smith'
                        />
                      </div>
                      <div>
                        <label className='block text-sm font-medium text-gray-700 mb-1'>
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
                          className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-400 focus:border-transparent'
                          placeholder='john.smith@email.com'
                        />
                      </div>
                      <div>
                        <label className='block text-sm font-medium text-gray-700 mb-1'>
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
                          className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-400 focus:border-transparent'
                          placeholder='(555) 123-4567'
                        />
                      </div>
                      <div>
                        <label className='block text-sm font-medium text-gray-700 mb-1'>
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
                          className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-400 focus:border-transparent'
                          placeholder='San Francisco, CA'
                        />
                      </div>
                      <div>
                        <label className='block text-sm font-medium text-gray-700 mb-1'>
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
                          className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-400 focus:border-transparent'
                          placeholder='linkedin.com/in/johnsmith'
                        />
                      </div>
                      <div>
                        <label className='block text-sm font-medium text-gray-700 mb-1'>
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
                          className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-400 focus:border-transparent'
                          placeholder='github.com/johnsmith'
                        />
                      </div>
                    </div>
                  </Card>

                  {/* Professional Summary */}
                  <Card className='p-6'>
                    <h3 className='text-lg font-semibold mb-4'>
                      Professional Summary
                    </h3>
                    <RichTextEditor
                      content={resumeData.summary || ''}
                      onChange={content => handleDataUpdate('summary', content)}
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
                  </Card>

                  {/* Work Experience */}
                  <Card className='p-6'>
                    <h3 className='text-lg font-semibold mb-4'>
                      Work Experience
                    </h3>
                    <div className='space-y-4'>
                      {resumeData.experience.map((job, index) => (
                        <div
                          key={job.id}
                          className='border border-gray-200 rounded-lg p-4'
                        >
                          <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-4'>
                            <div>
                              <label className='block text-sm font-medium text-gray-700 mb-1'>
                                Job Title *
                              </label>
                              <input
                                type='text'
                                value={job.title}
                                onChange={e => {
                                  const newExperience = [
                                    ...resumeData.experience,
                                  ];
                                  newExperience[index] = {
                                    ...job,
                                    title: e.target.value,
                                  };
                                  handleDataUpdate('experience', newExperience);
                                }}
                                className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-400 focus:border-transparent'
                                placeholder='Software Engineer'
                              />
                            </div>
                            <div>
                              <label className='block text-sm font-medium text-gray-700 mb-1'>
                                Company *
                              </label>
                              <input
                                type='text'
                                value={job.company}
                                onChange={e => {
                                  const newExperience = [
                                    ...resumeData.experience,
                                  ];
                                  newExperience[index] = {
                                    ...job,
                                    company: e.target.value,
                                  };
                                  handleDataUpdate('experience', newExperience);
                                }}
                                className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-400 focus:border-transparent'
                                placeholder='Google Inc.'
                              />
                            </div>
                            <div>
                              <label className='block text-sm font-medium text-gray-700 mb-1'>
                                Location
                              </label>
                              <input
                                type='text'
                                value={job.location}
                                onChange={e => {
                                  const newExperience = [
                                    ...resumeData.experience,
                                  ];
                                  newExperience[index] = {
                                    ...job,
                                    location: e.target.value,
                                  };
                                  handleDataUpdate('experience', newExperience);
                                }}
                                className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-400 focus:border-transparent'
                                placeholder='San Francisco, CA'
                              />
                            </div>
                            <div>
                              <label className='block text-sm font-medium text-gray-700 mb-1'>
                                Period *
                              </label>
                              <input
                                type='text'
                                value={job.period}
                                onChange={e => {
                                  const newExperience = [
                                    ...resumeData.experience,
                                  ];
                                  newExperience[index] = {
                                    ...job,
                                    period: e.target.value,
                                  };
                                  handleDataUpdate('experience', newExperience);
                                }}
                                className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-400 focus:border-transparent'
                                placeholder='Jan 2020 - Present'
                              />
                            </div>
                          </div>
                          <div className='mb-4'>
                            <label className='block text-sm font-medium text-gray-700 mb-1'>
                              Job Description
                            </label>
                            <RichTextEditor
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
                            />
                            <div className='mt-2'>
                              <AIAssistant
                                onSuggestion={suggestion => {
                                  const newExperience = [
                                    ...resumeData.experience,
                                  ];
                                  newExperience[index] = {
                                    ...job,
                                    description: suggestion,
                                  };
                                  handleDataUpdate('experience', newExperience);
                                }}
                                context={`${job.title} at ${job.company}`}
                                type='experience'
                              />
                            </div>
                          </div>
                          <div className='flex justify-end'>
                            <Button
                              variant='outline'
                              size='sm'
                              onClick={() => {
                                const newExperience =
                                  resumeData.experience.filter(
                                    (_, i) => i !== index
                                  );
                                handleDataUpdate('experience', newExperience);
                              }}
                              className='text-red-600 hover:bg-red-50'
                            >
                              Remove Job
                            </Button>
                          </div>
                        </div>
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
                        + Add Work Experience
                      </Button>
                    </div>
                  </Card>

                  {/* Education */}
                  <Card className='p-6'>
                    <h3 className='text-lg font-semibold mb-4'>Education</h3>
                    <div className='space-y-4'>
                      {resumeData.education.map((edu, index) => (
                        <div
                          key={edu.id}
                          className='border border-gray-200 rounded-lg p-4'
                        >
                          <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-4'>
                            <div>
                              <label className='block text-sm font-medium text-gray-700 mb-1'>
                                Degree *
                              </label>
                              <input
                                type='text'
                                value={edu.degree}
                                onChange={e => {
                                  const newEducation = [
                                    ...resumeData.education,
                                  ];
                                  newEducation[index] = {
                                    ...edu,
                                    degree: e.target.value,
                                  };
                                  handleDataUpdate('education', newEducation);
                                }}
                                className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-400 focus:border-transparent'
                                placeholder='Bachelor of Science in Computer Science'
                              />
                            </div>
                            <div>
                              <label className='block text-sm font-medium text-gray-700 mb-1'>
                                School *
                              </label>
                              <input
                                type='text'
                                value={edu.school}
                                onChange={e => {
                                  const newEducation = [
                                    ...resumeData.education,
                                  ];
                                  newEducation[index] = {
                                    ...edu,
                                    school: e.target.value,
                                  };
                                  handleDataUpdate('education', newEducation);
                                }}
                                className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-400 focus:border-transparent'
                                placeholder='Stanford University'
                              />
                            </div>
                            <div>
                              <label className='block text-sm font-medium text-gray-700 mb-1'>
                                Location
                              </label>
                              <input
                                type='text'
                                value={edu.location}
                                onChange={e => {
                                  const newEducation = [
                                    ...resumeData.education,
                                  ];
                                  newEducation[index] = {
                                    ...edu,
                                    location: e.target.value,
                                  };
                                  handleDataUpdate('education', newEducation);
                                }}
                                className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-400 focus:border-transparent'
                                placeholder='Stanford, CA'
                              />
                            </div>
                            <div>
                              <label className='block text-sm font-medium text-gray-700 mb-1'>
                                Period *
                              </label>
                              <input
                                type='text'
                                value={edu.period}
                                onChange={e => {
                                  const newEducation = [
                                    ...resumeData.education,
                                  ];
                                  newEducation[index] = {
                                    ...edu,
                                    period: e.target.value,
                                  };
                                  handleDataUpdate('education', newEducation);
                                }}
                                className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-400 focus:border-transparent'
                                placeholder='2016 - 2020'
                              />
                            </div>
                            <div>
                              <label className='block text-sm font-medium text-gray-700 mb-1'>
                                GPA (Optional)
                              </label>
                              <input
                                type='text'
                                value={edu.gpa || ''}
                                onChange={e => {
                                  const newEducation = [
                                    ...resumeData.education,
                                  ];
                                  newEducation[index] = {
                                    ...edu,
                                    gpa: e.target.value,
                                  };
                                  handleDataUpdate('education', newEducation);
                                }}
                                className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-400 focus:border-transparent'
                                placeholder='3.8/4.0'
                              />
                            </div>
                          </div>
                          <div className='flex justify-end'>
                            <Button
                              variant='outline'
                              size='sm'
                              onClick={() => {
                                const newEducation =
                                  resumeData.education.filter(
                                    (_, i) => i !== index
                                  );
                                handleDataUpdate('education', newEducation);
                              }}
                              className='text-red-600 hover:bg-red-50'
                            >
                              Remove Education
                            </Button>
                          </div>
                        </div>
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
                        + Add Education
                      </Button>
                    </div>
                  </Card>

                  {/* Projects */}
                  <Card className='p-6'>
                    <h3 className='text-lg font-semibold mb-4'>Projects</h3>
                    <div className='space-y-4'>
                      {resumeData.projects?.map((project, index) => (
                        <div
                          key={project.id}
                          className='border border-gray-200 rounded-lg p-4'
                        >
                          <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-4'>
                            <div>
                              <label className='block text-sm font-medium text-gray-700 mb-1'>
                                Project Name *
                              </label>
                              <input
                                type='text'
                                value={project.name}
                                onChange={e => {
                                  const newProjects = [
                                    ...(resumeData.projects || []),
                                  ];
                                  newProjects[index] = {
                                    ...project,
                                    name: e.target.value,
                                  };
                                  handleDataUpdate('projects', newProjects);
                                }}
                                className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-400 focus:border-transparent'
                                placeholder='E-commerce Platform'
                              />
                            </div>
                            <div>
                              <label className='block text-sm font-medium text-gray-700 mb-1'>
                                Project Link (Optional)
                              </label>
                              <input
                                type='url'
                                value={project.link || ''}
                                onChange={e => {
                                  const newProjects = [
                                    ...(resumeData.projects || []),
                                  ];
                                  newProjects[index] = {
                                    ...project,
                                    link: e.target.value,
                                  };
                                  handleDataUpdate('projects', newProjects);
                                }}
                                className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-400 focus:border-transparent'
                                placeholder='https://github.com/username/project'
                              />
                            </div>
                          </div>
                          <div className='mb-4'>
                            <label className='block text-sm font-medium text-gray-700 mb-1'>
                              Project Description
                            </label>
                            <RichTextEditor
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
                            />
                            <div className='mt-2'>
                              <AIAssistant
                                onSuggestion={suggestion => {
                                  const newProjects = [
                                    ...(resumeData.projects || []),
                                  ];
                                  newProjects[index] = {
                                    ...project,
                                    description: suggestion,
                                  };
                                  handleDataUpdate('projects', newProjects);
                                }}
                                context={`${project.name} project`}
                                type='project'
                              />
                            </div>
                          </div>
                          <div className='mb-4'>
                            <label className='block text-sm font-medium text-gray-700 mb-1'>
                              Technologies Used
                            </label>
                            <input
                              type='text'
                              value={project.technologies.join(', ')}
                              onChange={e => {
                                const newProjects = [
                                  ...(resumeData.projects || []),
                                ];
                                newProjects[index] = {
                                  ...project,
                                  technologies: e.target.value
                                    .split(',')
                                    .map(s => s.trim())
                                    .filter(s => s),
                                };
                                handleDataUpdate('projects', newProjects);
                              }}
                              className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-400 focus:border-transparent'
                              placeholder='React, Node.js, MongoDB, AWS...'
                            />
                            <p className='text-xs text-gray-500 mt-1'>
                              Separate technologies with commas
                            </p>
                          </div>
                          <div className='flex justify-end'>
                            <Button
                              variant='outline'
                              size='sm'
                              onClick={() => {
                                const newProjects = (
                                  resumeData.projects || []
                                ).filter((_, i) => i !== index);
                                handleDataUpdate('projects', newProjects);
                              }}
                              className='text-red-600 hover:bg-red-50'
                            >
                              Remove Project
                            </Button>
                          </div>
                        </div>
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
                        + Add Project
                      </Button>
                    </div>
                  </Card>

                  {/* Skills */}
                  <Card className='p-6'>
                    <h3 className='text-lg font-semibold mb-4'>Skills</h3>
                    <div className='space-y-4'>
                      <div>
                        <label className='block text-sm font-medium text-gray-700 mb-2'>
                          Technical Skills
                        </label>
                        <input
                          type='text'
                          value={resumeData.skills.technical.join(', ')}
                          onChange={e =>
                            handleDataUpdate('skills', {
                              ...resumeData.skills,
                              technical: e.target.value
                                .split(',')
                                .map(s => s.trim())
                                .filter(s => s),
                            })
                          }
                          className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-400 focus:border-transparent'
                          placeholder='JavaScript, React, Node.js, Python...'
                        />
                        <p className='text-xs text-gray-500 mt-1'>
                          Separate skills with commas
                        </p>
                      </div>
                      <div>
                        <label className='block text-sm font-medium text-gray-700 mb-2'>
                          Soft Skills
                        </label>
                        <input
                          type='text'
                          value={resumeData.skills.soft.join(', ')}
                          onChange={e =>
                            handleDataUpdate('skills', {
                              ...resumeData.skills,
                              soft: e.target.value
                                .split(',')
                                .map(s => s.trim())
                                .filter(s => s),
                            })
                          }
                          className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-400 focus:border-transparent'
                          placeholder='Leadership, Communication, Problem Solving...'
                        />
                      </div>
                    </div>
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
                                id: `cert-${index}`,
                                name: e.target.value,
                                issuer: '',
                                date: '',
                              };
                              handleDataUpdate('certifications', newCerts);
                            }}
                            className='flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-400 focus:border-transparent'
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
                  </Card>

                  {/* Achievements */}
                  <Card className='p-6'>
                    <h3 className='text-lg font-semibold mb-4'>Achievements</h3>
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
                              handleDataUpdate('achievements', newAchievements);
                            }}
                            className='flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-400 focus:border-transparent'
                            placeholder='Led team of 5 developers to deliver project 2 weeks early'
                          />
                          <Button
                            variant='outline'
                            size='sm'
                            onClick={() => {
                              const newAchievements = (
                                resumeData.achievements || []
                              ).filter((_, i) => i !== index);
                              handleDataUpdate('achievements', newAchievements);
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
                          template={selectedTemplate}
                          onExport={() => {
                            /* PDF exported */
                          }}
                        />
                        <DOCXExporter
                          resumeData={resumeData}
                          template={selectedTemplate}
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
                <DragDropSections
                  sections={selectedTemplate?.layout.sections || []}
                  onSectionsChange={sections => {
                    if (selectedTemplate) {
                      setSelectedTemplate({
                        ...selectedTemplate,
                        layout: {
                          ...selectedTemplate.layout,
                          sections,
                        },
                      });
                    }
                  }}
                  onAddSection={() => {}}
                  onRemoveSection={sectionId => {
                    if (selectedTemplate) {
                      const updatedSections =
                        selectedTemplate.layout.sections.filter(
                          s => s.type !== sectionId
                        );
                      setSelectedTemplate({
                        ...selectedTemplate,
                        layout: {
                          ...selectedTemplate.layout,
                          sections: updatedSections,
                        },
                      });
                    }
                  }}
                />
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
                    template={selectedTemplate}
                    onExport={() => {
                      /* PDF exported */
                    }}
                  />
                  <DOCXExporter
                    resumeData={resumeData}
                    template={selectedTemplate}
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
        <div className='max-w-7xl mx-auto px-6 py-4'>
          <div className='flex items-center justify-center space-x-8'>
            <div
              className={`flex items-center space-x-2 ${currentStep === 'template' ? 'text-cyan-600' : currentStep === 'builder' || currentStep === 'preview' ? 'text-green-600' : 'text-gray-400'}`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep === 'template' ? 'bg-cyan-600 text-white' : currentStep === 'builder' || currentStep === 'preview' ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-500'}`}
              >
                1
              </div>
              <span className='font-medium'>Choose Template</span>
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

      {/* Data Selection Modal */}
      {pendingTemplate && (
        <DataSelectionModal
          isOpen={showDataSelectionModal}
          onClose={() => {
            setShowDataSelectionModal(false);
            setPendingTemplate(null);
          }}
          onSelectSampleData={() => applyTemplateData(pendingTemplate, false)}
          onSelectParsedData={() => applyTemplateData(pendingTemplate, true)}
          templateSampleData={pendingTemplate.sampleData}
          parsedData={initialData}
          templateName={pendingTemplate.name}
        />
      )}
    </div>
  );
};

export default ResumeBuilder;
