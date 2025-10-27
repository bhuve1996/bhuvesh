'use client';

import React, { useEffect } from 'react';

import { useTour } from '@/contexts/TourContext';

import { Tour } from './Tour';

interface TourManagerProps {
  children: React.ReactNode;
}

export const TourManager: React.FC<TourManagerProps> = ({ children }) => {
  const { registerTour } = useTour();

  useEffect(() => {
    // Register the resume builder tour
    registerTour({
      id: 'resume-builder',
      name: 'Resume Builder',
      description: 'Learn how to use the resume builder tools',
      autoStart: false,
      showProgress: true,
      steps: [
        {
          id: 'welcome',
          target: '[data-tour="welcome"]',
          title: 'Welcome to Resume Builder!',
          content:
            'This tour will guide you through all the powerful tools available to build and customize your resume.',
          position: 'bottom',
          actionText: "Let's get started!",
        },
        {
          id: 'template-selection',
          target: '[data-tour="template-selection"]',
          title: 'Choose Your Template',
          content:
            'Browse through our collection of professional resume templates. Each template is optimized for ATS (Applicant Tracking Systems).',
          position: 'bottom',
          actionText: 'Click on any template to preview it.',
        },
        {
          id: 'floating-panel',
          target: '[data-testid="floating-action-button"]',
          title: 'Resume Builder Tools',
          content:
            'This floating panel contains all the tools you need: export options, template customization, ATS analysis, AI content improvements, and validation.',
          position: 'left',
          actionText: 'Click the button to open the tools panel.',
        },
        {
          id: 'export-tab',
          target: '[data-tour="export-tab"]',
          title: 'Export Your Resume',
          content:
            'Export your resume in multiple formats: PDF, Word document, or plain text. Perfect for different application requirements.',
          position: 'top',
          actionText: 'Choose your preferred format and download.',
        },
        {
          id: 'customize-tab',
          target: '[data-tour="customize-tab"]',
          title: 'Customize Template',
          content:
            'Personalize your template with custom colors, fonts, and layouts to match your personal brand.',
          position: 'top',
          actionText: 'Experiment with different styling options.',
        },
        {
          id: 'ats-tab',
          target: '[data-tour="ats-tab"]',
          title: 'ATS Analysis',
          content:
            'Get your resume analyzed for ATS compatibility. Our system checks for keywords, formatting, and structure to maximize your chances.',
          position: 'top',
          actionText: 'Run the analysis to see how your resume performs.',
        },
        {
          id: 'ai-tab',
          target: '[data-tour="ai-tab"]',
          title: 'AI Content Enhancement',
          content:
            'Use AI to improve your resume content. Get suggestions for better descriptions, keywords, and professional language.',
          position: 'top',
          actionText: 'Let AI help you write compelling content.',
        },
        {
          id: 'validation-tab',
          target: '[data-tour="validation-tab"]',
          title: 'Resume Validation',
          content:
            'Validate your resume for completeness and best practices. Ensure all sections are properly filled and formatted.',
          position: 'top',
          actionText: 'Check for any missing information or issues.',
        },
        {
          id: 'page-breaks-tab',
          target: '[data-tour="page-breaks-tab"]',
          title: 'Page Break Controls',
          content:
            'Visualize and control page breaks for optimal PDF layout. Toggle indicators on/off, navigate between pages, and adjust spacing to ensure your resume fits perfectly.',
          position: 'top',
          actionText:
            'Use the toggle button to show/hide page break indicators.',
        },
        {
          id: 'completion',
          target: '[data-tour="completion"]',
          title: "You're All Set!",
          content:
            'You now know how to use all the resume builder features. Create a professional resume that stands out to employers!',
          position: 'bottom',
          actionText: 'Start building your perfect resume!',
        },
      ],
    });

    // Register the homepage tour
    registerTour({
      id: 'homepage',
      name: 'Portfolio Tour',
      description: 'Explore the portfolio features',
      autoStart: false,
      showProgress: true,
      steps: [
        {
          id: 'homepage-welcome',
          target: '[data-tour="homepage-welcome"]',
          title: 'Welcome to My Portfolio!',
          content:
            'This is my personal portfolio showcasing my work, skills, and experience as a full-stack developer.',
          position: 'bottom',
          actionText: "Let's explore what I have to offer.",
        },
        {
          id: 'navigation',
          target: '[data-tour="navigation"]',
          title: 'Navigation Menu',
          content:
            'Use this navigation to explore different sections: About, Projects, Resume, Blog, and Contact.',
          position: 'bottom',
          actionText: 'Click on any section to learn more.',
        },
        {
          id: 'resume-card',
          target: '[data-tour="resume-card"]',
          title: 'Resume Builder',
          content:
            'Build and customize your professional resume with our AI-powered tools and ATS-optimized templates.',
          position: 'top',
          actionText: 'Try the resume builder to create your perfect resume.',
        },
        {
          id: 'projects-card',
          target: '[data-tour="projects-card"]',
          title: 'My Projects',
          content:
            "Explore my portfolio of web applications, mobile apps, and software solutions I've built.",
          position: 'top',
          actionText: 'Check out my latest work and case studies.',
        },
        {
          id: 'contact-card',
          target: '[data-tour="contact-card"]',
          title: 'Get In Touch',
          content:
            'Ready to work together? Contact me to discuss your project or just say hello!',
          position: 'top',
          actionText: "Let's start a conversation.",
        },
      ],
    });

    // Register the about page tour
    registerTour({
      id: 'about-page',
      name: 'About Page',
      description: 'Learn about Bhuvesh and his background',
      autoStart: false,
      showProgress: true,
      steps: [
        {
          id: 'about-welcome',
          target: '[data-tour="about-welcome"]',
          title: 'About Bhuvesh',
          content:
            'Learn about my journey, skills, and passion for creating amazing digital experiences.',
          position: 'bottom',
          actionText: 'Discover my story and expertise.',
        },
        {
          id: 'about-skills',
          target: '[data-tour="about-skills"]',
          title: 'Technical Skills',
          content:
            'Explore my technical expertise across frontend, backend, and full-stack development.',
          position: 'top',
          actionText: 'See what technologies I work with.',
        },
        {
          id: 'about-experience',
          target: '[data-tour="about-experience"]',
          title: 'Professional Experience',
          content:
            "Learn about my work history and the projects I've contributed to.",
          position: 'top',
          actionText: 'Understand my professional background.',
        },
      ],
    });

    // Register the projects page tour
    registerTour({
      id: 'projects-page',
      name: 'Projects Page',
      description: "Explore Bhuvesh's portfolio of work",
      autoStart: false,
      showProgress: true,
      steps: [
        {
          id: 'projects-welcome',
          target: '[data-tour="projects-welcome"]',
          title: 'My Projects',
          content:
            'Explore my portfolio of web applications, mobile apps, and creative solutions.',
          position: 'bottom',
          actionText: "See what I've built.",
        },
        {
          id: 'projects-filter',
          target: '[data-tour="projects-filter"]',
          title: 'Filter Projects',
          content:
            'Use the filter options to find projects by technology, type, or category.',
          position: 'bottom',
          actionText: 'Try filtering by your interests.',
        },
        {
          id: 'projects-gallery',
          target: '[data-tour="projects-gallery"]',
          title: 'Project Gallery',
          content:
            'Browse through detailed case studies of my work with live demos and source code.',
          position: 'top',
          actionText: 'Click on any project to learn more.',
        },
      ],
    });

    // Register the blog page tour
    registerTour({
      id: 'blog-page',
      name: 'Blog Page',
      description: "Read Bhuvesh's latest insights and tutorials",
      autoStart: false,
      showProgress: true,
      steps: [
        {
          id: 'blog-welcome',
          target: '[data-tour="blog-welcome"]',
          title: 'Blog & Insights',
          content:
            'Read my latest thoughts on web development, technology trends, and best practices.',
          position: 'bottom',
          actionText: 'Stay updated with tech insights.',
        },
        {
          id: 'blog-categories',
          target: '[data-tour="blog-categories"]',
          title: 'Blog Categories',
          content:
            'Filter articles by category: tutorials, industry insights, or personal experiences.',
          position: 'bottom',
          actionText: 'Find content that interests you.',
        },
        {
          id: 'blog-articles',
          target: '[data-tour="blog-articles"]',
          title: 'Latest Articles',
          content:
            'Browse through my latest articles and tutorials on web development.',
          position: 'top',
          actionText: 'Read the full articles for detailed insights.',
        },
      ],
    });

    // Register the contact page tour
    registerTour({
      id: 'contact-page',
      name: 'Contact Page',
      description: 'Get in touch with Bhuvesh',
      autoStart: false,
      showProgress: true,
      steps: [
        {
          id: 'contact-welcome',
          target: '[data-tour="contact-welcome"]',
          title: 'Get In Touch',
          content:
            "Ready to work together? Let's discuss your project and bring ideas to life.",
          position: 'bottom',
          actionText: 'Start a conversation.',
        },
        {
          id: 'contact-form',
          target: '[data-tour="contact-form"]',
          title: 'Contact Form',
          content:
            "Send me a message directly through this form. I'll get back to you within 24 hours.",
          position: 'top',
          actionText: 'Fill out the form to reach out.',
        },
        {
          id: 'contact-info',
          target: '[data-tour="contact-info"]',
          title: 'Contact Information',
          content:
            'Find my email, social media, and other ways to connect with me.',
          position: 'top',
          actionText: 'Choose your preferred contact method.',
        },
      ],
    });

    // Register the services page tour
    registerTour({
      id: 'services-page',
      name: 'Services Page',
      description: "Learn about Bhuvesh's development services",
      autoStart: false,
      showProgress: true,
      steps: [
        {
          id: 'services-welcome',
          target: '[data-tour="services-welcome"]',
          title: 'My Services',
          content:
            'Discover the range of development services I offer to help grow your business.',
          position: 'bottom',
          actionText: 'See how I can help you.',
        },
        {
          id: 'services-list',
          target: '[data-tour="services-list"]',
          title: 'Service Offerings',
          content:
            'Explore my comprehensive development services from web apps to mobile solutions.',
          position: 'top',
          actionText: 'Learn about each service in detail.',
        },
        {
          id: 'services-process',
          target: '[data-tour="services-process"]',
          title: 'My Process',
          content:
            'Understand how I work with clients from initial consultation to project delivery.',
          position: 'top',
          actionText: 'See my development workflow.',
        },
      ],
    });

    // Register the ATS checker page tour
    registerTour({
      id: 'ats-checker',
      name: 'ATS Checker',
      description: 'Learn how to use the ATS resume checker',
      autoStart: false,
      showProgress: true,
      steps: [
        {
          id: 'ats-welcome',
          target: '[data-tour="ats-welcome"]',
          title: 'ATS Resume Checker',
          content:
            'Get your resume analyzed for ATS compatibility across all job profiles. Receive detailed feedback and optimization suggestions.',
          position: 'bottom',
          actionText: "Let's check your resume!",
        },
        {
          id: 'ats-upload',
          target: '[data-tour="ats-upload"]',
          title: 'Upload Your Resume',
          content:
            'Upload your resume in PDF, DOCX, or TXT format to get started with the analysis.',
          position: 'top',
          actionText: 'Choose your resume file to upload.',
        },
        {
          id: 'ats-analysis',
          target: '[data-tour="ats-analysis"]',
          title: 'Analysis Results',
          content:
            'View detailed ATS compatibility scores, keyword analysis, and improvement suggestions.',
          position: 'top',
          actionText: "Review your resume's performance.",
        },
      ],
    });

    // Register the resume builder page tour
    registerTour({
      id: 'resume-builder-page',
      name: 'Resume Builder Page',
      description: 'Learn how to use the resume builder interface',
      autoStart: false,
      showProgress: true,
      steps: [
        {
          id: 'builder-welcome',
          target: '[data-tour="builder-welcome"]',
          title: 'Resume Builder',
          content:
            'Create professional resumes with our advanced builder tool and templates.',
          position: 'bottom',
          actionText: 'Start building your resume!',
        },
        {
          id: 'builder-sections',
          target: '[data-tour="builder-sections"]',
          title: 'Resume Sections',
          content:
            'Add and customize different sections of your resume: experience, education, skills, and more.',
          position: 'top',
          actionText: 'Fill out each section with your information.',
        },
        {
          id: 'builder-preview',
          target: '[data-tour="builder-preview"]',
          title: 'Live Preview',
          content: 'See your resume update in real-time as you make changes.',
          position: 'top',
          actionText: 'Watch your resume come to life.',
        },
      ],
    });
  }, [registerTour]);

  return (
    <>
      {children}
      <Tour />
    </>
  );
};

export default TourManager;
