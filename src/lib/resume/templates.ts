import { ResumeTemplate } from '@/types/resume';

import { sampleResumeData } from './sampleData';

// Modern template data with beautiful designs
export const modernTemplates: ResumeTemplate[] = [
  {
    id: 'tech-software-engineer-ats',
    name: 'Software Engineer (ATS)',
    description:
      'Clean, ATS-optimized template perfect for software engineers. Features a modern two-column layout with emphasis on technical skills and experience.',
    category: 'tech',
    experienceLevel: 'mid',
    style: 'modern',
    atsScore: 98,
    preview: '/resume-templates/previews/tech-ats-preview.png',
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
          optional: false,
          title: 'Professional Summary',
        },
        {
          type: 'experience',
          order: 3,
          optional: false,
          title: 'Work Experience',
        },
        {
          type: 'skills',
          order: 4,
          optional: false,
          title: 'Technical Skills',
        },
        { type: 'projects', order: 5, optional: true, title: 'Key Projects' },
        { type: 'education', order: 6, optional: false, title: 'Education' },
      ],
      colors: {
        primary: '#1e40af', // Blue-800 - Good contrast on white
        secondary: '#475569', // Slate-600 - Better contrast than #64748b
        accent: '#3b82f6', // Blue-500 - Good contrast on white
        text: '#0f172a', // Slate-900 - Excellent contrast on white
        background: '#ffffff',
        sidebar: '#1e40af', // Blue-800 - Good contrast
        sidebarText: '#ffffff', // White - Excellent contrast on blue
        card: '#ffffff',
        border: '#e2e8f0',
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
        lineHeight: 1.4,
        sectionGap: '20px',
        margins: '0.5in',
        padding: '16px',
      },
      columns: 2,
      sidebar: true,
    },
    sampleData: sampleResumeData,
  },
  {
    id: 'tech-developer-minimal',
    name: 'Developer (Minimal)',
    description:
      'Ultra-clean, minimal design perfect for developers who want to let their skills speak for themselves. Features a modern sidebar layout with accent colors.',
    category: 'tech',
    experienceLevel: 'mid',
    style: 'modern',
    atsScore: 95,
    preview: '/resume-templates/previews/tech-minimal-preview.png',
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
          optional: false,
          title: 'Professional Summary',
        },
        {
          type: 'experience',
          order: 3,
          optional: false,
          title: 'Work Experience',
        },
        {
          type: 'skills',
          order: 4,
          optional: false,
          title: 'Technical Skills',
        },
        { type: 'projects', order: 5, optional: true, title: 'Key Projects' },
        { type: 'education', order: 6, optional: false, title: 'Education' },
      ],
      colors: {
        primary: '#0f172a', // Slate-900 - Excellent contrast
        secondary: '#475569', // Slate-600 - Better contrast
        accent: '#0891b2', // Cyan-600 - Better contrast than #06b6d4
        text: '#0f172a', // Slate-900 - Excellent contrast on light background
        background: '#f8fafc', // Slate-50 - Light background
        sidebar: '#0f172a', // Slate-900 - Excellent contrast
        sidebarText: '#f8fafc', // Slate-50 - Good contrast on dark sidebar
        card: '#ffffff',
        border: '#e2e8f0',
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
        lineHeight: 1.4,
        sectionGap: '20px',
        margins: '0.1in',
        padding: '12px',
      },
      columns: 2,
      sidebar: true,
    },
    sampleData: sampleResumeData,
  },
  {
    id: 'tech-data-scientist',
    name: 'Data Scientist',
    description:
      'Clean, analytical template perfect for data scientists and analysts. Features structured layout with emphasis on technical skills and projects.',
    category: 'tech',
    experienceLevel: 'mid',
    style: 'modern',
    atsScore: 96,
    preview: '/resume-templates/previews/tech-data-scientist-preview.png',
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
          optional: false,
          title: 'Professional Summary',
        },
        {
          type: 'skills',
          order: 3,
          optional: false,
          title: 'Technical Skills',
        },
        { type: 'experience', order: 4, optional: false, title: 'Experience' },
        { type: 'projects', order: 5, optional: true, title: 'Key Projects' },
        { type: 'education', order: 6, optional: false, title: 'Education' },
      ],
      colors: {
        primary: '#1e40af', // Blue-800 - Good contrast
        secondary: '#475569', // Slate-600 - Better contrast
        accent: '#3b82f6', // Blue-500 - Good contrast
        text: '#0f172a', // Slate-900 - Excellent contrast
        background: '#f8fafc', // Slate-50 - Light background
        sidebar: '#1e40af', // Blue-800 - Good contrast
        sidebarText: '#ffffff', // White - Excellent contrast
        card: '#ffffff',
        border: '#e2e8f0',
      },
      fonts: {
        heading: 'Inter, sans-serif',
        body: 'Inter, sans-serif',
        size: {
          heading: '22px',
          subheading: '16px',
          body: '13px',
          small: '11px',
        },
      },
      spacing: {
        lineHeight: 1.3,
        sectionGap: '18px',
        margins: '0.1in',
        padding: '10px',
      },
      columns: 2,
      sidebar: true,
    },
    sampleData: sampleResumeData,
  },
  {
    id: 'tech-marketing-pro',
    name: 'Marketing Pro',
    description:
      'Dynamic, results-focused template for marketing professionals. Features bold colors and emphasis on achievements and metrics.',
    category: 'business',
    experienceLevel: 'mid',
    style: 'modern',
    atsScore: 94,
    preview: '/resume-templates/previews/marketing-pro-preview.png',
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
          optional: false,
          title: 'Professional Summary',
        },
        { type: 'experience', order: 3, optional: false, title: 'Experience' },
        { type: 'skills', order: 4, optional: false, title: 'Skills' },
        { type: 'projects', order: 5, optional: true, title: 'Key Campaigns' },
        { type: 'education', order: 6, optional: false, title: 'Education' },
      ],
      colors: {
        primary: '#dc2626', // Red-600 - Good contrast
        secondary: '#475569', // Slate-600 - Better contrast
        accent: '#ea580c', // Orange-600 - Better contrast than #f59e0b
        text: '#0f172a', // Slate-900 - Excellent contrast
        background: '#fef2f2', // Red-50 - Light background
        sidebar: '#dc2626', // Red-600 - Good contrast
        sidebarText: '#ffffff', // White - Excellent contrast
        card: '#ffffff',
        border: '#e2e8f0',
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
        lineHeight: 1.4,
        sectionGap: '20px',
        margins: '0.1in',
        padding: '12px',
      },
      columns: 2,
      sidebar: true,
    },
    sampleData: sampleResumeData,
  },
  {
    id: 'tech-finance-executive',
    name: 'Finance Executive',
    description:
      'Professional, conservative template perfect for finance executives. Features clean layout with emphasis on credentials and achievements.',
    category: 'business',
    experienceLevel: 'senior',
    style: 'classic',
    atsScore: 97,
    preview: '/resume-templates/previews/finance-executive-preview.png',
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
          optional: false,
          title: 'Executive Summary',
        },
        { type: 'experience', order: 3, optional: false, title: 'Experience' },
        {
          type: 'skills',
          order: 4,
          optional: false,
          title: 'Core Competencies',
        },
        { type: 'education', order: 5, optional: false, title: 'Education' },
        {
          type: 'projects',
          order: 6,
          optional: true,
          title: 'Key Achievements',
        },
      ],
      colors: {
        primary: '#1f2937', // Gray-800 - Good contrast
        secondary: '#475569', // Slate-600 - Better contrast than #6b7280
        accent: '#059669', // Emerald-600 - Good contrast
        text: '#0f172a', // Slate-900 - Better contrast than #1f2937
        background: '#ffffff',
        sidebar: '#1f2937', // Gray-800 - Good contrast
        sidebarText: '#ffffff', // White - Excellent contrast
        card: '#ffffff',
        border: '#e5e7eb',
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
        lineHeight: 1.4,
        sectionGap: '20px',
        margins: '0.1in',
        padding: '12px',
      },
      columns: 2,
      sidebar: true,
    },
    sampleData: sampleResumeData,
  },
  {
    id: 'tech-ux-designer',
    name: 'UX Designer',
    description:
      'Creative, user-focused template for UX designers. Features modern layout with emphasis on design thinking and user research.',
    category: 'creative',
    experienceLevel: 'mid',
    style: 'modern',
    atsScore: 93,
    preview: '/resume-templates/previews/ux-designer-preview.png',
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
          optional: false,
          title: 'Design Philosophy',
        },
        { type: 'experience', order: 3, optional: false, title: 'Experience' },
        { type: 'skills', order: 4, optional: false, title: 'Design Skills' },
        {
          type: 'projects',
          order: 5,
          optional: true,
          title: 'Portfolio Highlights',
        },
        { type: 'education', order: 6, optional: false, title: 'Education' },
      ],
      colors: {
        primary: '#7c3aed', // Violet-600 - Good contrast
        secondary: '#475569', // Slate-600 - Better contrast
        accent: '#c026d3', // Fuchsia-600 - Better contrast than #ec4899
        text: '#0f172a', // Slate-900 - Excellent contrast
        background: '#faf5ff', // Violet-50 - Light background
        sidebar: '#7c3aed', // Violet-600 - Good contrast
        sidebarText: '#ffffff', // White - Excellent contrast
        card: '#ffffff',
        border: '#e2e8f0',
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
        lineHeight: 1.4,
        sectionGap: '20px',
        margins: '0.1in',
        padding: '12px',
      },
      columns: 2,
      sidebar: true,
    },
    sampleData: sampleResumeData,
  },
  {
    id: 'tech-sales-manager',
    name: 'Sales Manager',
    description:
      'Results-driven template for sales professionals. Features bold design with emphasis on achievements and revenue metrics.',
    category: 'business',
    experienceLevel: 'mid',
    style: 'modern',
    atsScore: 95,
    preview: '/resume-templates/previews/sales-manager-preview.png',
    layout: {
      sections: [
        {
          type: 'header',
          order: 1,
          optional: false,
          title: 'Contact Information',
        },
        { type: 'summary', order: 2, optional: false, title: 'Sales Summary' },
        {
          type: 'experience',
          order: 3,
          optional: false,
          title: 'Sales Experience',
        },
        { type: 'skills', order: 4, optional: false, title: 'Sales Skills' },
        {
          type: 'projects',
          order: 5,
          optional: true,
          title: 'Key Achievements',
        },
        { type: 'education', order: 6, optional: false, title: 'Education' },
      ],
      colors: {
        primary: '#ea580c', // Orange-600 - Good contrast
        secondary: '#475569', // Slate-600 - Better contrast
        accent: '#dc2626', // Red-600 - Better contrast than #f59e0b
        text: '#0f172a', // Slate-900 - Excellent contrast
        background: '#fff7ed', // Orange-50 - Light background
        sidebar: '#ea580c', // Orange-600 - Good contrast
        sidebarText: '#ffffff', // White - Excellent contrast
        card: '#ffffff',
        border: '#e2e8f0',
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
        lineHeight: 1.4,
        sectionGap: '20px',
        margins: '0.1in',
        padding: '12px',
      },
      columns: 2,
      sidebar: true,
    },
    sampleData: sampleResumeData,
  },
  {
    id: 'tech-devops-engineer',
    name: 'DevOps Engineer',
    description:
      'Technical template for DevOps engineers. Features structured layout with emphasis on automation and infrastructure skills.',
    category: 'tech',
    experienceLevel: 'mid',
    style: 'modern',
    atsScore: 96,
    preview: '/resume-templates/previews/devops-engineer-preview.png',
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
          optional: false,
          title: 'Technical Summary',
        },
        {
          type: 'skills',
          order: 3,
          optional: false,
          title: 'Technical Skills',
        },
        { type: 'experience', order: 4, optional: false, title: 'Experience' },
        {
          type: 'projects',
          order: 5,
          optional: true,
          title: 'Infrastructure Projects',
        },
        { type: 'education', order: 6, optional: false, title: 'Education' },
      ],
      colors: {
        primary: '#059669', // Emerald-600 - Good contrast
        secondary: '#475569', // Slate-600 - Better contrast
        accent: '#16a34a', // Green-600 - Better contrast than #10b981
        text: '#0f172a', // Slate-900 - Excellent contrast
        background: '#f0fdf4', // Green-50 - Light background
        sidebar: '#059669', // Emerald-600 - Good contrast
        sidebarText: '#ffffff', // White - Excellent contrast
        card: '#ffffff',
        border: '#e2e8f0',
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
        lineHeight: 1.4,
        sectionGap: '20px',
        margins: '0.1in',
        padding: '12px',
      },
      columns: 2,
      sidebar: true,
    },
    sampleData: sampleResumeData,
  },
  {
    id: 'tech-designer-modern',
    name: 'Designer (Modern)',
    description:
      'Contemporary design template for creative professionals. Features bold typography and modern layout with emphasis on visual impact.',
    category: 'creative',
    experienceLevel: 'mid',
    style: 'modern',
    atsScore: 92,
    preview: '/resume-templates/previews/designer-modern-preview.png',
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
          optional: false,
          title: 'Creative Vision',
        },
        {
          type: 'experience',
          order: 3,
          optional: false,
          title: 'Design Experience',
        },
        { type: 'skills', order: 4, optional: false, title: 'Design Skills' },
        { type: 'projects', order: 5, optional: true, title: 'Featured Work' },
        { type: 'education', order: 6, optional: false, title: 'Education' },
      ],
      colors: {
        primary: '#8b5cf6', // Violet-500 - Good contrast
        secondary: '#475569', // Slate-600 - Better contrast
        accent: '#ea580c', // Orange-600 - Better contrast than #f59e0b
        text: '#0f172a', // Slate-900 - Excellent contrast
        background: '#faf5ff', // Violet-50 - Light background
        sidebar: '#8b5cf6', // Violet-500 - Good contrast
        sidebarText: '#ffffff', // White - Excellent contrast
        card: '#ffffff',
        border: '#e2e8f0',
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
        lineHeight: 1.4,
        sectionGap: '20px',
        margins: '0.1in',
        padding: '12px',
      },
      columns: 2,
      sidebar: true,
    },
    sampleData: sampleResumeData,
  },
  {
    id: 'tech-executive-modern',
    name: 'Executive (Modern)',
    description:
      'Sophisticated template for senior executives. Features elegant design with emphasis on leadership and strategic achievements.',
    category: 'business',
    experienceLevel: 'senior',
    style: 'modern',
    atsScore: 98,
    preview: '/resume-templates/previews/executive-modern-preview.png',
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
          optional: false,
          title: 'Executive Summary',
        },
        {
          type: 'experience',
          order: 3,
          optional: false,
          title: 'Leadership Experience',
        },
        {
          type: 'skills',
          order: 4,
          optional: false,
          title: 'Core Competencies',
        },
        { type: 'education', order: 5, optional: false, title: 'Education' },
        {
          type: 'projects',
          order: 6,
          optional: true,
          title: 'Key Achievements',
        },
      ],
      colors: {
        primary: '#1e40af',
        secondary: '#475569', // Slate-600 - Better contrast
        accent: '#3b82f6',
        text: '#0f172a', // Slate-900 - Excellent contrast
        background: '#f8fafc',
        sidebar: '#1e40af',
        sidebarText: '#ffffff',
        card: '#ffffff',
        border: '#e2e8f0',
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
        lineHeight: 1.4,
        sectionGap: '20px',
        margins: '0.1in',
        padding: '12px',
      },
      columns: 2,
      sidebar: true,
    },
    sampleData: sampleResumeData,
  },
  {
    id: 'tech-startup-bold',
    name: 'Startup (Bold)',
    description:
      'Dynamic, energetic template for startup professionals. Features bold colors and modern layout perfect for innovative companies.',
    category: 'tech',
    experienceLevel: 'mid',
    style: 'modern',
    atsScore: 94,
    preview: '/resume-templates/previews/startup-bold-preview.png',
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
          optional: false,
          title: 'Innovation Summary',
        },
        {
          type: 'experience',
          order: 3,
          optional: false,
          title: 'Startup Experience',
        },
        {
          type: 'skills',
          order: 4,
          optional: false,
          title: 'Technical Skills',
        },
        {
          type: 'projects',
          order: 5,
          optional: true,
          title: 'Innovation Projects',
        },
        { type: 'education', order: 6, optional: false, title: 'Education' },
      ],
      colors: {
        primary: '#dc2626', // Red-600 - Good contrast
        secondary: '#475569', // Slate-600 - Better contrast
        accent: '#ea580c', // Orange-600 - Better contrast than #f59e0b
        text: '#0f172a', // Slate-900 - Excellent contrast
        background: '#fef2f2', // Red-50 - Light background
        sidebar: '#dc2626', // Red-600 - Good contrast
        sidebarText: '#ffffff', // White - Excellent contrast
        card: '#ffffff',
        border: '#e2e8f0',
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
        lineHeight: 1.4,
        sectionGap: '20px',
        margins: '0.1in',
        padding: '12px',
      },
      columns: 2,
      sidebar: true,
    },
    sampleData: sampleResumeData,
  },
];

// Helper functions for filtering
export const getCategoryLabel = (category: string): string => {
  const labels: Record<string, string> = {
    tech: 'Technology',
    business: 'Business',
    creative: 'Creative',
    all: 'All Categories',
  };
  return labels[category] || category;
};

export const getStyleLabel = (style: string): string => {
  const labels: Record<string, string> = {
    modern: 'Modern',
    classic: 'Classic',
    creative: 'Creative',
    all: 'All Styles',
  };
  return labels[style] || style;
};

export const categories = ['all', 'tech', 'business', 'creative'];
export const styles = ['all', 'modern', 'classic', 'creative'];
