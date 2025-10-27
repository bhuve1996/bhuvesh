'use client';

import React, { useState } from 'react';

import { Button } from '@/components/atoms/Button/Button';
import { FileUpload } from '@/components/molecules/FileUpload/FileUpload';
import { FormField } from '@/components/molecules/FormField/FormField';
import { StatusBadge } from '@/components/molecules/StatusBadge/StatusBadge';
import { FloatingPanel } from '@/components/organisms/FloatingPanel/FloatingPanel';
import { ResumeData, ResumeTemplate } from '@/types/resume';

export default function TestComponentsPage() {
  const [clickCount, setClickCount] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    'idle' | 'success' | 'error'
  >('idle');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
  });

  const mockResumeData: ResumeData = {
    personal: {
      fullName: 'John Doe',
      email: 'john@example.com',
      phone: '123-456-7890',
      location: 'New York, NY',
    },
    summary: 'Experienced software developer',
    experience: [],
    skills: {
      technical: ['JavaScript', 'React'],
      business: ['Project Management'],
      soft: ['Communication'],
      languages: ['English', 'Spanish'],
      certifications: ['AWS Certified', 'React Developer'],
    },
    education: [
      {
        id: 'edu-1',
        degree: 'Bachelor of Science',
        field: 'Computer Science',
        institution: 'University of Technology',
        location: 'New York, NY',
        startDate: '2018',
        endDate: '2022',
        current: false,
      },
    ],
    projects: [
      {
        id: 'proj-1',
        name: 'Portfolio Website',
        description:
          'Built a responsive portfolio website using React and Next.js',
        technologies: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS'],
        startDate: '2023',
        endDate: '2023',
      },
    ],
  };

  const mockTemplate: ResumeTemplate = {
    id: 'template-1',
    name: 'Professional Template',
    description: 'A professional resume template',
    category: 'business',
    experienceLevel: 'mid',
    style: 'modern',
    atsScore: 85,
    preview: '/preview.jpg',
    layout: {
      sections: [],
      colors: {
        primary: '#10b981',
        secondary: '#059669',
        accent: '#34d399',
        text: '#1f2937',
        background: '#ffffff',
      },
      fonts: {
        heading: 'Inter',
        body: 'Inter',
        size: {
          heading: '2rem',
          subheading: '1.5rem',
          body: '1rem',
          small: '0.875rem',
        },
      },
      spacing: {
        lineHeight: 1.5,
        sectionGap: '2rem',
        margins: '1rem',
        padding: '1rem',
      },
      columns: 1,
      sidebar: false,
    },
    // config: {},
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check for required fields
    if (!formData.name || !formData.email) {
      setSubmitStatus('error');
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSubmitStatus('success');
    } catch {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileUpload = (_files: File[]) => {
    // Files uploaded: _files
  };

  const handleTemplateChange = (_template: ResumeTemplate) => {
    // Template changed: _template
  };

  return (
    <div className='min-h-screen bg-neutral-50 dark:bg-neutral-900 p-8'>
      <div className='max-w-4xl mx-auto space-y-8'>
        <div className='text-center'>
          <h1 className='text-3xl font-bold text-neutral-900 dark:text-neutral-100 mb-4'>
            Component System Test Page
          </h1>
          <p className='text-neutral-600 dark:text-neutral-400'>
            Test all components and their interactions
          </p>
        </div>

        {/* Button Tests */}
        <section className='bg-white dark:bg-neutral-800 rounded-lg p-6 shadow-sm'>
          <h2 className='text-xl font-semibold text-neutral-900 dark:text-neutral-100 mb-4'>
            Button Component Tests
          </h2>
          <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
            <Button
              data-testid='test-button'
              onClick={() => setClickCount(prev => prev + 1)}
            >
              Click Me
            </Button>
            <Button data-testid='primary-button' variant='primary'>
              Primary
            </Button>
            <Button data-testid='secondary-button' variant='secondary'>
              Secondary
            </Button>
            <Button data-testid='outline-button' variant='outline'>
              Outline
            </Button>
            <Button data-testid='loading-button' loading>
              Loading
            </Button>
            <Button data-testid='disabled-button' disabled>
              Disabled
            </Button>
            <Button data-testid='success-button' variant='success'>
              Success
            </Button>
            <Button data-testid='error-button' variant='destructive'>
              Error
            </Button>
          </div>
          <div className='mt-4'>
            <p data-testid='click-count'>Click count: {clickCount}</p>
          </div>
        </section>

        {/* FormField Tests */}
        <section className='bg-white dark:bg-neutral-800 rounded-lg p-6 shadow-sm'>
          <h2 className='text-xl font-semibold text-neutral-900 dark:text-neutral-100 mb-4'>
            FormField Component Tests
          </h2>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            <FormField data-testid='form-field' label='Test Field'>
              <input type='text' placeholder='Enter text' />
            </FormField>

            <FormField
              data-testid='required-field'
              label='Required Field'
              required
            >
              <input type='text' placeholder='Required field' />
            </FormField>

            <FormField
              data-testid='help-field'
              label='Field with Help'
              helpText='This is help text'
            >
              <input type='text' placeholder='With help text' />
            </FormField>

            <FormField
              data-testid='error-field'
              label='Field with Error'
              error='This is an error'
            >
              <input type='text' placeholder='With error' />
            </FormField>
          </div>
        </section>

        {/* StatusBadge Tests */}
        <section className='bg-white dark:bg-neutral-800 rounded-lg p-6 shadow-sm'>
          <h2 className='text-xl font-semibold text-neutral-900 dark:text-neutral-100 mb-4'>
            StatusBadge Component Tests
          </h2>
          <div className='flex flex-wrap gap-4'>
            <StatusBadge data-testid='success-badge' status='success' icon='✅'>
              Success
            </StatusBadge>
            <StatusBadge data-testid='error-badge' status='error' icon='❌'>
              Error
            </StatusBadge>
            <StatusBadge data-testid='warning-badge' status='warning' icon='⚠️'>
              Warning
            </StatusBadge>
            <StatusBadge data-testid='info-badge' status='info' icon='ℹ️'>
              Info
            </StatusBadge>
            <StatusBadge
              data-testid='solid-badge'
              status='success'
              variant='solid'
            >
              Solid
            </StatusBadge>
            <StatusBadge
              data-testid='outline-badge'
              status='success'
              variant='outline'
            >
              Outline
            </StatusBadge>
            <StatusBadge
              data-testid='soft-badge'
              status='success'
              variant='soft'
            >
              Soft
            </StatusBadge>
            <StatusBadge data-testid='icon-badge' status='success' icon='✅'>
              With Icon
            </StatusBadge>
          </div>
        </section>

        {/* FileUpload Tests */}
        <section className='bg-white dark:bg-neutral-800 rounded-lg p-6 shadow-sm'>
          <h2 className='text-xl font-semibold text-neutral-900 dark:text-neutral-100 mb-4'>
            FileUpload Component Tests
          </h2>
          <FileUpload
            data-testid='file-upload'
            onUpload={handleFileUpload}
            maxSize={10 * 1024 * 1024}
            maxFiles={3}
            multiple
            validation={{
              allowedTypes: ['pdf', 'docx', 'doc'],
            }}
          />
        </section>

        {/* Form Integration Test */}
        <section className='bg-white dark:bg-neutral-800 rounded-lg p-6 shadow-sm'>
          <h2 className='text-xl font-semibold text-neutral-900 dark:text-neutral-100 mb-4'>
            Form Integration Test
          </h2>
          <form onSubmit={handleSubmit} className='space-y-4'>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <FormField
                data-testid='name-field'
                label='Name'
                required
                {...(!formData.name &&
                  submitStatus === 'error' && {
                    error: 'This field is required',
                  })}
              >
                <input
                  data-testid='name-input'
                  type='text'
                  value={formData.name}
                  onChange={e =>
                    setFormData(prev => ({ ...prev, name: e.target.value }))
                  }
                  placeholder='Enter your name'
                />
              </FormField>

              <FormField
                data-testid='email-field'
                label='Email'
                required
                {...(!formData.email &&
                  submitStatus === 'error' && {
                    error: 'This field is required',
                  })}
              >
                <input
                  data-testid='email-input'
                  type='email'
                  value={formData.email}
                  onChange={e =>
                    setFormData(prev => ({ ...prev, email: e.target.value }))
                  }
                  placeholder='Enter your email'
                />
              </FormField>
            </div>

            <Button
              data-testid='submit-button'
              type='submit'
              loading={isSubmitting}
              fullWidth
            >
              {isSubmitting ? 'Submitting...' : 'Submit Form'}
            </Button>

            {submitStatus === 'success' && (
              <StatusBadge
                data-testid='success-badge'
                status='success'
                icon='✅'
              >
                Form submitted successfully
              </StatusBadge>
            )}

            {submitStatus === 'error' && (
              <StatusBadge data-testid='error-badge' status='error' icon='❌'>
                Submission failed
              </StatusBadge>
            )}
          </form>
        </section>

        {/* FloatingPanel Test */}
        <section className='bg-white dark:bg-neutral-800 rounded-lg p-6 shadow-sm'>
          <h2 className='text-xl font-semibold text-neutral-900 dark:text-neutral-100 mb-4'>
            FloatingPanel Component Test
          </h2>
          <p className='text-neutral-600 dark:text-neutral-400 mb-4'>
            Look for the floating panel in the bottom right corner
          </p>
          <FloatingPanel
            data-testid='floating-panel'
            resumeData={mockResumeData}
            template={mockTemplate}
            onTemplateChange={handleTemplateChange}
          />
        </section>
      </div>
    </div>
  );
}
