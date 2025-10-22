'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';

import { ResumeTemplateRenderer } from '@/components/resume/templates/ResumeTemplateRenderer';
import { TemplateCustomizer } from '@/components/resume/templates/TemplateCustomizer';
import { TemplatePreview } from '@/components/resume/templates/TemplatePreview';
import { ValidationModal } from '@/components/resume/ValidationModal';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { useResumeNavigation } from '@/contexts/ResumeNavigationContext';
import { cloudStorage } from '@/lib/resume/cloudStorage';
import { exportResume } from '@/lib/resume/exportUtils';
import { validateResumeData, ValidationResult } from '@/lib/resume/validation';
import { useResumeActions, useResumeStore } from '@/store/resumeStore';
import { ResumeData, ResumeTemplate } from '@/types/resume';

// Modern template data with beautiful designs
const modernTemplates: ResumeTemplate[] = [
  {
    id: 'executive-minimal',
    name: 'Executive Minimal',
    description:
      'Clean, sophisticated design perfect for executive roles. Emphasizes clarity and professionalism.',
    category: 'business',
    experienceLevel: 'executive',
    style: 'modern',
    atsScore: 95,
    preview: '/resume-templates/previews/executive-minimal.png',
    layout: {
      sections: [
        {
          type: 'header',
          order: 1,
          optional: false,
          title: 'Contact Information',
        },
        {
          type: 'summary',
          order: 2,
          optional: true,
          title: 'Executive Summary',
        },
        {
          type: 'experience',
          order: 3,
          optional: false,
          title: 'Professional Experience',
        },
        { type: 'education', order: 4, optional: false, title: 'Education' },
        {
          type: 'skills',
          order: 5,
          optional: false,
          title: 'Core Competencies',
        },
        {
          type: 'achievements',
          order: 6,
          optional: true,
          title: 'Key Achievements',
        },
      ],
      colors: {
        primary: '#1e293b',
        secondary: '#64748b',
        accent: '#0ea5e9',
        text: '#0f172a',
        background: '#ffffff',
      },
      fonts: {
        heading: 'Inter, sans-serif',
        body: 'Inter, sans-serif',
        size: {
          heading: '24px',
          subheading: '18px',
          body: '14px',
          small: '12px',
        },
      },
      spacing: {
        lineHeight: 1.6,
        sectionGap: '24px',
        margins: '1in',
        padding: '16px',
      },
      columns: 1,
      sidebar: false,
    },
  },
  {
    id: 'tech-modern-gradient',
    name: 'Tech Modern Gradient',
    description:
      'Bold gradient design with modern typography. Perfect for software engineers and tech professionals.',
    category: 'tech',
    experienceLevel: 'senior',
    style: 'modern',
    atsScore: 92,
    preview: '/resume-templates/previews/tech-modern-gradient.png',
    layout: {
      sections: [
        {
          type: 'header',
          order: 1,
          optional: false,
          title: 'Contact Information',
        },
        {
          type: 'summary',
          order: 2,
          optional: true,
          title: 'Professional Summary',
        },
        {
          type: 'experience',
          order: 3,
          optional: false,
          title: 'Work Experience',
        },
        {
          type: 'projects',
          order: 4,
          optional: true,
          title: 'Notable Projects',
        },
        {
          type: 'skills',
          order: 5,
          optional: false,
          title: 'Technical Skills',
        },
        { type: 'education', order: 6, optional: false, title: 'Education' },
      ],
      colors: {
        primary: '#6366f1',
        secondary: '#8b5cf6',
        accent: '#06b6d4',
        text: '#1f2937',
        background: '#ffffff',
      },
      fonts: {
        heading: 'Poppins, sans-serif',
        body: 'Inter, sans-serif',
        size: {
          heading: '22px',
          subheading: '16px',
          body: '14px',
          small: '12px',
        },
      },
      spacing: {
        lineHeight: 1.5,
        sectionGap: '20px',
        margins: '0.75in',
        padding: '12px',
      },
      columns: 1,
      sidebar: false,
    },
  },
  {
    id: 'creative-portfolio',
    name: 'Creative Portfolio',
    description:
      'Artistic design with bold colors and creative layout. Ideal for designers, artists, and creative professionals.',
    category: 'creative',
    experienceLevel: 'mid',
    style: 'creative',
    atsScore: 78,
    preview: '/resume-templates/previews/creative-portfolio.png',
    layout: {
      sections: [
        {
          type: 'header',
          order: 1,
          optional: false,
          title: 'Contact Information',
        },
        { type: 'summary', order: 2, optional: true, title: 'About Me' },
        { type: 'experience', order: 3, optional: false, title: 'Experience' },
        { type: 'projects', order: 4, optional: true, title: 'Featured Work' },
        { type: 'skills', order: 5, optional: false, title: 'Skills & Tools' },
        { type: 'education', order: 6, optional: false, title: 'Education' },
      ],
      colors: {
        primary: '#ec4899',
        secondary: '#8b5cf6',
        accent: '#f59e0b',
        text: '#1f2937',
        background: '#ffffff',
      },
      fonts: {
        heading: 'Poppins, sans-serif',
        body: 'Inter, sans-serif',
        size: {
          heading: '24px',
          subheading: '18px',
          body: '14px',
          small: '12px',
        },
      },
      spacing: {
        lineHeight: 1.6,
        sectionGap: '24px',
        margins: '0.5in',
        padding: '16px',
      },
      columns: 2,
      sidebar: true,
    },
  },
  {
    id: 'healthcare-professional',
    name: 'Healthcare Professional',
    description:
      'Clean, trustworthy design perfect for healthcare professionals. Emphasizes reliability and expertise.',
    category: 'healthcare',
    experienceLevel: 'senior',
    style: 'classic',
    atsScore: 90,
    preview: '/resume-templates/previews/healthcare-professional.png',
    layout: {
      sections: [
        {
          type: 'header',
          order: 1,
          optional: false,
          title: 'Contact Information',
        },
        {
          type: 'summary',
          order: 2,
          optional: true,
          title: 'Professional Summary',
        },
        {
          type: 'experience',
          order: 3,
          optional: false,
          title: 'Clinical Experience',
        },
        {
          type: 'education',
          order: 4,
          optional: false,
          title: 'Education & Training',
        },
        { type: 'skills', order: 5, optional: false, title: 'Clinical Skills' },
        {
          type: 'achievements',
          order: 6,
          optional: true,
          title: 'Certifications',
        },
      ],
      colors: {
        primary: '#059669',
        secondary: '#6b7280',
        accent: '#0ea5e9',
        text: '#111827',
        background: '#ffffff',
      },
      fonts: {
        heading: 'Inter, sans-serif',
        body: 'Inter, sans-serif',
        size: {
          heading: '20px',
          subheading: '16px',
          body: '14px',
          small: '12px',
        },
      },
      spacing: {
        lineHeight: 1.5,
        sectionGap: '20px',
        margins: '0.75in',
        padding: '12px',
      },
      columns: 1,
      sidebar: false,
    },
  },
  {
    id: 'startup-founder',
    name: 'Startup Founder',
    description:
      'Dynamic, energetic design perfect for entrepreneurs and startup founders. Shows innovation and leadership.',
    category: 'business',
    experienceLevel: 'executive',
    style: 'modern',
    atsScore: 85,
    preview: '/resume-templates/previews/startup-founder.png',
    layout: {
      sections: [
        {
          type: 'header',
          order: 1,
          optional: false,
          title: 'Contact Information',
        },
        { type: 'summary', order: 2, optional: true, title: 'Founder Profile' },
        {
          type: 'experience',
          order: 3,
          optional: false,
          title: 'Entrepreneurial Experience',
        },
        {
          type: 'projects',
          order: 4,
          optional: true,
          title: 'Ventures & Projects',
        },
        {
          type: 'skills',
          order: 5,
          optional: false,
          title: 'Core Competencies',
        },
        { type: 'education', order: 6, optional: false, title: 'Education' },
      ],
      colors: {
        primary: '#dc2626',
        secondary: '#f59e0b',
        accent: '#10b981',
        text: '#1f2937',
        background: '#ffffff',
      },
      fonts: {
        heading: 'Inter, sans-serif',
        body: 'Inter, sans-serif',
        size: {
          heading: '22px',
          subheading: '16px',
          body: '14px',
          small: '12px',
        },
      },
      spacing: {
        lineHeight: 1.5,
        sectionGap: '20px',
        margins: '0.75in',
        padding: '12px',
      },
      columns: 1,
      sidebar: false,
    },
  },
  {
    id: 'data-scientist',
    name: 'Data Scientist',
    description:
      'Modern, analytical design perfect for data scientists and analysts. Clean layout with emphasis on technical skills.',
    category: 'tech',
    experienceLevel: 'senior',
    style: 'ats-optimized',
    atsScore: 96,
    preview: '/resume-templates/previews/data-scientist.png',
    layout: {
      sections: [
        {
          type: 'header',
          order: 1,
          optional: false,
          title: 'Contact Information',
        },
        {
          type: 'summary',
          order: 2,
          optional: true,
          title: 'Professional Summary',
        },
        {
          type: 'experience',
          order: 3,
          optional: false,
          title: 'Professional Experience',
        },
        { type: 'projects', order: 4, optional: true, title: 'Key Projects' },
        {
          type: 'skills',
          order: 5,
          optional: false,
          title: 'Technical Skills',
        },
        { type: 'education', order: 6, optional: false, title: 'Education' },
      ],
      colors: {
        primary: '#1e40af',
        secondary: '#64748b',
        accent: '#06b6d4',
        text: '#111827',
        background: '#ffffff',
      },
      fonts: {
        heading: 'Inter, sans-serif',
        body: 'Inter, sans-serif',
        size: {
          heading: '20px',
          subheading: '16px',
          body: '14px',
          small: '12px',
        },
      },
      spacing: {
        lineHeight: 1.5,
        sectionGap: '20px',
        margins: '0.75in',
        padding: '12px',
      },
      columns: 1,
      sidebar: false,
    },
  },
];

export default function TemplateGalleryPage() {
  const [selectedTemplate] =
    useState<ResumeTemplate | null>(null);
  const [customizedTemplate, setCustomizedTemplate] =
    useState<ResumeTemplate | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStyle, setSelectedStyle] = useState<string>('all');
  const [isExporting, setIsExporting] = useState(false);
  const [showFloatingMenu, setShowFloatingMenu] = useState(false);
  const [showValidationModal, setShowValidationModal] = useState(false);
  const [validationResult, setValidationResult] =
    useState<ValidationResult | null>(null);
  const [pendingExportFormat, setPendingExportFormat] = useState<
    'pdf' | 'docx' | 'txt' | null
  >(null);

  // Use global state
  const userResumeData = useResumeStore(state => state.resumeData);
  const { setUseUserData, setShowDataChoice, setSelectedTemplate, setResumeData } =
    useResumeActions();
  const { navigateToResumeBuilder, navigateToAtsChecker } =
    useResumeNavigation();

  const useUserData = useResumeStore(state => state.useUserData);
  const showDataChoice = useResumeStore(state => state.showDataChoice);
  const hasResumeBuilderData = !!userResumeData;

  // Close floating menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('.floating-menu-container')) {
        setShowFloatingMenu(false);
      }
    };

    if (showFloatingMenu) {
      document.addEventListener('mousedown', handleClickOutside);
      return () =>
        document.removeEventListener('mousedown', handleClickOutside);
    }
    return undefined;
  }, [showFloatingMenu]);

  // Data is now managed by global state

  // Fetch user's existing resume data
  useEffect(() => {
    const fetchUserData = () => {
      try {
        // Check localStorage for ATS checker data
        const savedData = localStorage.getItem('resume-builder-data');
        const sourceData = localStorage.getItem('resume-builder-source');

        if (savedData && sourceData) {
          const resumeData = JSON.parse(savedData);
          const source = JSON.parse(sourceData);

          if (
            source.source === 'ats-checker' ||
            source.source === 'resume-builder'
          ) {
            setResumeData(resumeData);
          }
        }

        // Check cloud storage for saved resumes
        const savedResumes = cloudStorage.getResumes();
        if (savedResumes.length > 0) {
          const latestResume = savedResumes[0]; // Get most recent
          if (latestResume) {
            const resumeData = cloudStorage.getLatestResumeData(
              latestResume.id
            );
            if (resumeData) {
              setResumeData(resumeData);
            }
          }
        }
      } catch {
        // Error fetching user data
      }
    };

    fetchUserData();
  }, []);

  // Sample resume data for preview
  const sampleResumeData: ResumeData = {
    personal: {
      fullName: 'John Smith',
      email: 'john.smith@email.com',
      phone: '(555) 123-4567',
      location: 'San Francisco, CA',
      linkedin: 'linkedin.com/in/johnsmith',
      github: 'github.com/johnsmith',
      portfolio: 'johnsmith.dev',
    },
    summary:
      'Experienced software engineer with 5+ years of expertise in full-stack development, cloud architecture, and team leadership. Passionate about building scalable solutions and mentoring junior developers.',
    experience: [
      {
        id: '1',
        company: 'TechCorp Inc.',
        position: 'Senior Software Engineer',
        location: 'San Francisco, CA',
        startDate: '2022',
        endDate: 'Present',
        current: true,
        description:
          'Lead development of microservices architecture serving 1M+ users. Collaborate with cross-functional teams to deliver high-quality software solutions.',
        achievements: [
          'Improved system performance by 40% through optimization',
          'Mentored 5 junior developers and conducted code reviews',
          'Led migration to cloud infrastructure, reducing costs by 30%',
          'Implemented CI/CD pipelines reducing deployment time by 60%',
        ],
      },
      {
        id: '2',
        company: 'StartupXYZ',
        position: 'Full Stack Developer',
        location: 'San Francisco, CA',
        startDate: '2020',
        endDate: '2022',
        current: false,
        description:
          'Developed and maintained web applications using React, Node.js, and PostgreSQL. Worked closely with product team to implement new features.',
        achievements: [
          'Built responsive web application with 50K+ active users',
          'Redesigned user interface improving user engagement by 25%',
          'Implemented automated testing increasing code coverage to 90%',
        ],
      },
    ],
    education: [
      {
        id: '1',
        institution: 'University of California, Berkeley',
        degree: 'Bachelor of Science',
        field: 'Computer Science',
        location: 'Berkeley, CA',
        startDate: '2016',
        endDate: '2020',
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
        'PostgreSQL',
        'MongoDB',
        'AWS',
        'Docker',
        'Kubernetes',
      ],
      business: [
        'Project Management',
        'Team Leadership',
        'Agile Development',
        'Technical Writing',
      ],
      soft: ['Communication', 'Problem Solving', 'Mentoring', 'Collaboration'],
      languages: ['English (Native)', 'Spanish (Conversational)'],
      certifications: [
        'AWS Certified Solutions Architect',
        'Google Cloud Professional Developer',
      ],
    },
    projects: [
      {
        id: '1',
        name: 'E-commerce Platform',
        description:
          'Built a full-stack e-commerce solution with React frontend, Node.js backend, and PostgreSQL database. Implemented payment processing, inventory management, and admin dashboard.',
        technologies: [
          'React',
          'Node.js',
          'PostgreSQL',
          'Stripe API',
          'Docker',
        ],
        startDate: '2023',
        endDate: '2023',
        url: 'https://github.com/johnsmith/ecommerce-platform',
      },
      {
        id: '2',
        name: 'Task Management App',
        description:
          'Developed a collaborative task management application with real-time updates, drag-and-drop functionality, and team collaboration features.',
        technologies: ['React', 'Socket.io', 'MongoDB', 'Express.js'],
        startDate: '2022',
        endDate: '2022',
        url: 'https://github.com/johnsmith/task-manager',
      },
    ],
    achievements: [
      'Led team of 8 developers in successful product launch',
      'Published 3 technical articles on software architecture',
      'Speaker at 2023 Tech Conference on microservices best practices',
      'Open source contributor with 500+ GitHub stars across projects',
    ],
  };

  const categories = [
    'all',
    'tech',
    'business',
    'creative',
    'healthcare',
    'education',
  ];
  const styles = ['all', 'modern', 'classic', 'creative', 'ats-optimized'];

  const filteredTemplates = modernTemplates.filter(template => {
    const matchesSearch =
      template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === 'all' || template.category === selectedCategory;
    const matchesStyle =
      selectedStyle === 'all' || template.style === selectedStyle;

    return matchesSearch && matchesCategory && matchesStyle;
  });

  const handleTemplateSelect = (template: ResumeTemplate) => {
    setSelectedTemplate(template);
    setCustomizedTemplate(template); // Initialize customized template

    // If user has existing data, show choice dialog
    if (userResumeData) {
      setShowDataChoice(true);
    } else {
      setUseUserData(false);
    }
  };

  const handleTemplateCustomize = (template: ResumeTemplate) => {
    setCustomizedTemplate(template);
  };

  const handleUseTemplate = () => {
    if (selectedTemplate) {
      // Store selected template in global state and navigate to resume builder
      setSelectedTemplate(selectedTemplate);
      navigateToResumeBuilder();
    }
  };

  const handleExport = async (format: 'pdf' | 'docx' | 'txt') => {
    if (!selectedTemplate) return;

    const dataToUse =
      useUserData && userResumeData ? userResumeData : sampleResumeData;

    // Validate resume data before exporting
    const validation = validateResumeData(dataToUse);
    setValidationResult(validation);
    setPendingExportFormat(format);
    setShowValidationModal(true);
  };

  const handleValidationProceed = async () => {
    if (!selectedTemplate || !pendingExportFormat) return;

    try {
      setIsExporting(true);
      const dataToUse =
        useUserData && userResumeData ? userResumeData : sampleResumeData;
      // Use customized template if available, otherwise use selected template
      const templateToUse = customizedTemplate || selectedTemplate;
      await exportResume(pendingExportFormat, templateToUse, dataToUse);
    } catch {
      alert('Export failed. Please try again.');
    } finally {
      setIsExporting(false);
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

  const handleDataChoice = (useUserDataChoice: boolean) => {
    setUseUserData(useUserDataChoice);
    setShowDataChoice(false);
  };

  // Get the data to use for preview
  const getPreviewData = (): ResumeData => {
    return useUserData && userResumeData ? userResumeData : sampleResumeData;
  };

  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      all: 'All Categories',
      tech: 'Technology',
      business: 'Business',
      creative: 'Creative',
      healthcare: 'Healthcare',
      education: 'Education',
    };
    return labels[category] || category;
  };

  const getStyleLabel = (style: string) => {
    const labels: Record<string, string> = {
      all: 'All Styles',
      modern: 'Modern',
      classic: 'Classic',
      creative: 'Creative',
      'ats-optimized': 'ATS Optimized',
    };
    return labels[style] || style;
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
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className='bg-white rounded-xl shadow-2xl p-6 max-w-md w-full'
            >
              <h3 className='text-xl font-bold text-slate-900 mb-4'>
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

              <div className='mt-4 text-sm text-slate-500'>
                <p>
                  💡 You can always edit the data later in the resume builder
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className='bg-white/80 backdrop-blur-sm border-b border-slate-200 sticky top-24 z-10'>
        <div className='max-w-7xl mx-auto px-6 py-6'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center space-x-4'>
              {hasResumeBuilderData && (
                <Button
                  variant='outline'
                  onClick={() => {
                    // Save current data back to localStorage and go back to builder
                    if (userResumeData) {
                      localStorage.setItem(
                        'resumeBuilderData',
                        JSON.stringify(userResumeData)
                      );
                    }
                    window.location.href = '/resume/builder';
                  }}
                  className='flex items-center space-x-2'
                >
                  <span>←</span>
                  <span>Back to Builder</span>
                </Button>
              )}
              <div>
                <h1 className='text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-transparent'>
                  Resume Templates
                </h1>
                <p className='text-slate-600 mt-1'>
                  Choose from our collection of modern, professional resume
                  templates
                </p>
              </div>
            </div>
            <Button
              onClick={() => window.history.back()}
              variant='outline'
              className='flex items-center gap-2'
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
                  d='M15 19l-7-7 7-7'
                />
              </svg>
              Back
            </Button>
          </div>
        </div>
      </div>

      <div className='max-w-7xl mx-auto px-6 py-8'>
        {/* Navigation Bar */}
        <div className='mb-8'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-4'>
              <button
                onClick={() => navigateToAtsChecker()}
                className='flex items-center gap-2 px-4 py-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors'
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
                    d='M15 19l-7-7 7-7'
                  />
                </svg>
                ATS Checker
              </button>
              <button
                onClick={() => navigateToResumeBuilder()}
                className='flex items-center gap-2 px-4 py-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors'
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
                Resume Builder
              </button>
            </div>
            <div className='text-sm text-slate-500'>
              {hasResumeBuilderData ? 'Your data loaded' : 'Using sample data'}
            </div>
          </div>
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-4 gap-8'>
          {/* Left Sidebar - Template Gallery */}
          <div className='lg:col-span-1'>
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

                {/* Category Filter */}
                <div className='md:w-48'>
                  <select
                    value={selectedCategory}
                    onChange={e => setSelectedCategory(e.target.value)}
                    className='w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-slate-900'
                  >
                    {categories.map(category => (
                      <option key={category} value={category}>
                        {getCategoryLabel(category)}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Style Filter */}
                <div className='md:w-48'>
                  <select
                    value={selectedStyle}
                    onChange={e => setSelectedStyle(e.target.value)}
                    className='w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-slate-900'
                  >
                    {styles.map(style => (
                      <option key={style} value={style}>
                        {getStyleLabel(style)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Template Grid */}
            <div className='grid grid-cols-1 gap-4'>
              <AnimatePresence>
                {filteredTemplates.map((template, index) => (
                  <motion.div
                    key={template.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card
                      className={`cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-105 ${
                        selectedTemplate?.id === template.id
                          ? 'ring-2 ring-blue-500 shadow-xl scale-105'
                          : 'hover:shadow-lg'
                      }`}
                      onClick={() => handleTemplateSelect(template)}
                    >
                      <div className='p-4'>
                        {/* Template Preview */}
                        <div className='aspect-[4/3] bg-white rounded-lg mb-3 overflow-hidden shadow-sm border border-slate-200 relative'>
                          <TemplatePreview
                            template={template}
                            className='w-full h-full'
                          />
                        </div>

                        {/* Template Info */}
                        <div className='space-y-2'>
                          <h3 className='font-bold text-base text-slate-900'>
                            {template.name}
                          </h3>
                          <p className='text-xs text-slate-600 line-clamp-2'>
                            {template.description}
                          </p>

                          {/* Tags */}
                          <div className='flex flex-wrap gap-1'>
                            <span className='px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-medium rounded-full'>
                              {getCategoryLabel(template.category)}
                            </span>
                            <span className='px-2 py-0.5 bg-green-100 text-green-700 text-xs font-medium rounded-full'>
                              {template.experienceLevel}
                            </span>
                            <span className='px-2 py-0.5 bg-purple-100 text-purple-700 text-xs font-medium rounded-full'>
                              {getStyleLabel(template.style)}
                            </span>
                          </div>

                          {/* ATS Score */}
                          <div className='flex items-center justify-between'>
                            <span className='text-xs text-slate-600 font-medium'>
                              ATS Score
                            </span>
                            <div className='flex items-center space-x-1'>
                              <div className='w-16 h-1.5 bg-slate-200 rounded-full overflow-hidden'>
                                <div
                                  className='h-full bg-gradient-to-r from-red-400 via-yellow-400 to-green-400 transition-all duration-500'
                                  style={{ width: `${template.atsScore}%` }}
                                />
                              </div>
                              <span className='text-xs font-bold text-slate-900'>
                                {template.atsScore}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* No Results */}
            {filteredTemplates.length === 0 && (
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
                      d='M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29-1.009-5.824-2.709M15 6.291A7.962 7.962 0 0012 5c-2.34 0-4.29 1.009-5.824 2.709'
                    />
                  </svg>
                </div>
                <h3 className='text-lg font-semibold text-slate-900 mb-2'>
                  No templates found
                </h3>
                <p className='text-slate-600 mb-4'>
                  Try adjusting your search or filters to find more templates.
                </p>
                <Button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('all');
                    setSelectedStyle('all');
                  }}
                  variant='outline'
                >
                  Clear Filters
                </Button>
              </div>
            )}
          </div>

          {/* Main Content Area - Template Customizer + Preview */}
          <div className='lg:col-span-3'>
            {selectedTemplate ? (
              <div className='space-y-6'>
                {/* Template Customizer at Top */}
                <TemplateCustomizer
                  template={customizedTemplate || selectedTemplate}
                  onTemplateChange={handleTemplateCustomize}
                />

                {/* Live Preview */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className='bg-white rounded-xl shadow-lg border border-slate-200 p-6'
                >
                  <h4 className='font-semibold text-slate-900 mb-4'>
                    Live Preview
                  </h4>
                  <div className='border border-slate-200 rounded-lg overflow-hidden overflow-y-auto'>
                    <ResumeTemplateRenderer
                      template={customizedTemplate || selectedTemplate}
                      data={getPreviewData()}
                      className='scale-70 origin-top-left hover:scale-90 transition-transform duration-300'
                    />
                  </div>
                </motion.div>
              </div>
            ) : (
              <div className='bg-white rounded-xl shadow-lg border border-slate-200 p-6 text-center'>
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
                      d='M15 12a3 3 0 11-6 0 3 3 0 016 0z'
                    />
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z'
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
      </div>

      {/* Floating Action Button */}
      {selectedTemplate && (
        <div className='fixed bottom-6 right-6 z-50 floating-menu-container'>
          {/* Main FAB */}
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setShowFloatingMenu(!showFloatingMenu)}
            className='w-14 h-14 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center'
          >
            <svg
              className={`w-6 h-6 transition-transform duration-300 ${
                showFloatingMenu ? 'rotate-45' : ''
              }`}
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M12 6v6m0 0v6m0-6h6m-6 0H6'
              />
            </svg>
          </motion.button>

          {/* Floating Menu */}
          <AnimatePresence>
            {showFloatingMenu && (
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.8 }}
                transition={{ duration: 0.2 }}
                className='absolute bottom-16 right-0 bg-white rounded-xl shadow-2xl border border-slate-200 p-4 min-w-[200px]'
              >
                {/* Template Info */}
                <div className='mb-4 pb-4 border-b border-slate-200'>
                  <h3 className='font-bold text-slate-900 text-sm'>
                    {selectedTemplate.name}
                  </h3>
                  <div className='flex items-center gap-2 mt-1'>
                    <span className='text-xs text-slate-500'>ATS Score:</span>
                    <span className='text-xs font-bold text-green-600'>
                      {selectedTemplate.atsScore}/100
                    </span>
                  </div>
                  <div className='flex items-center gap-2 mt-1'>
                    <span className='text-xs text-slate-500'>Data:</span>
                    <span
                      className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                        useUserData && userResumeData
                          ? 'bg-purple-100 text-purple-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {useUserData && userResumeData
                        ? 'Your Data'
                        : 'Sample Data'}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className='space-y-2'>
                  {/* Use Template */}
                  <button
                    onClick={handleUseTemplate}
                    className='w-full text-left px-3 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors'
                  >
                    <div className='flex items-center gap-2'>
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
                          d='M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
                        />
                      </svg>
                      Use This Template
                    </div>
                  </button>

                  {/* Switch Data */}
                  {userResumeData && (
                    <button
                      onClick={() => setShowDataChoice(true)}
                      className='w-full text-left px-3 py-2 text-sm font-medium text-purple-600 hover:bg-purple-50 rounded-lg transition-colors'
                    >
                      <div className='flex items-center gap-2'>
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
                            d='M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4'
                          />
                        </svg>
                        {useUserData ? 'Switch to Sample' : 'Use My Data'}
                      </div>
                    </button>
                  )}

                  {/* Export Options */}
                  <div className='pt-2 border-t border-slate-200'>
                    <div className='text-xs font-medium text-slate-500 mb-2 px-3'>
                      Export as:
                    </div>
                    <button
                      onClick={() => handleExport('pdf')}
                      disabled={isExporting}
                      className='w-full text-left px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-lg transition-colors disabled:opacity-50'
                    >
                      <div className='flex items-center gap-2'>
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
                        PDF
                      </div>
                    </button>
                    <button
                      onClick={() => handleExport('docx')}
                      disabled={isExporting}
                      className='w-full text-left px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-lg transition-colors disabled:opacity-50'
                    >
                      <div className='flex items-center gap-2'>
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
                            d='M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
                          />
                        </svg>
                        DOCX
                      </div>
                    </button>
                    <button
                      onClick={() => handleExport('txt')}
                      disabled={isExporting}
                      className='w-full text-left px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-lg transition-colors disabled:opacity-50'
                    >
                      <div className='flex items-center gap-2'>
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
                            d='M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
                          />
                        </svg>
                        TXT
                      </div>
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Validation Modal */}
      {validationResult && pendingExportFormat && (
        <ValidationModal
          isOpen={showValidationModal}
          onClose={handleValidationCancel}
          onProceed={handleValidationProceed}
          validationResult={validationResult}
          actionType='export'
        />
      )}
    </div>
  );
}
