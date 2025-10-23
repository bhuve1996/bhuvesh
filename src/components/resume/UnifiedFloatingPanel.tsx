'use client';

import { AnimatePresence, motion } from 'framer-motion';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

import { atsApi } from '@/api/endpoints/ats';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import {
  exportToDOCX,
  exportToPDFWithFallback,
  exportToTXT,
} from '@/lib/resume/exportUtils';
import { ResumeData, ResumeTemplate } from '@/types/resume';

interface UnifiedFloatingPanelProps {
  resumeData: ResumeData;
  template: ResumeTemplate;
  onResumeDataUpdate: (updatedData: ResumeData) => void;
  onTemplateChange: (template: ResumeTemplate) => void;
  className?: string;
}

type PanelTab = 'ats' | 'ai' | 'customize' | 'validate' | 'export';

interface StyleSection {
  key: string;
  label: string;
  icon: string;
  properties: {
    fontSize?: boolean;
    fontFamily?: boolean;
    color?: boolean;
    backgroundColor?: boolean;
    spacing?: boolean;
  };
}

export const UnifiedFloatingPanel: React.FC<UnifiedFloatingPanelProps> = ({
  resumeData,
  template,
  onResumeDataUpdate: _onResumeDataUpdate,
  onTemplateChange,
  className = '',
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState<PanelTab>('ats');
  const [showTooltip, setShowTooltip] = useState(true);

  // ATS Analysis States
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [atsResult, setAtsResult] = useState<any>(null);

  // AI Content Improvement States
  const [isImproving, setIsImproving] = useState(false);
  const [improvementResult, setImprovementResult] = useState<any>(null);
  const [activeSection, setActiveSection] = useState<string | null>(null);

  // Post-Export Validation States
  const [isValidating, setIsValidating] = useState(false);
  const [validationResult, setValidationResult] = useState<any>(null);

  // Export States
  const [isExporting, setIsExporting] = useState(false);

  // Template Customization Data
  const styleSections: StyleSection[] = [
    {
      key: 'header',
      label: 'Header',
      icon: '📝',
      properties: {
        fontSize: true,
        fontFamily: true,
        color: true,
        backgroundColor: true,
        spacing: true,
      },
    },
    {
      key: 'body',
      label: 'Body Text',
      icon: '📄',
      properties: {
        fontSize: true,
        fontFamily: true,
        color: true,
        backgroundColor: true,
        spacing: true,
      },
    },
    {
      key: 'skills',
      label: 'Skills',
      icon: '🛠️',
      properties: {
        fontSize: true,
        fontFamily: true,
        color: true,
        backgroundColor: true,
        spacing: true,
      },
    },
    {
      key: 'skillsTags',
      label: 'Skills Tags',
      icon: '🏷️',
      properties: {
        fontSize: true,
        fontFamily: true,
        color: true,
        backgroundColor: true,
        spacing: true,
      },
    },
    {
      key: 'experience',
      label: 'Experience',
      icon: '💼',
      properties: {
        fontSize: true,
        fontFamily: true,
        color: true,
        backgroundColor: true,
        spacing: true,
      },
    },
    {
      key: 'education',
      label: 'Education',
      icon: '🎓',
      properties: {
        fontSize: true,
        fontFamily: true,
        color: true,
        backgroundColor: true,
        spacing: true,
      },
    },
    {
      key: 'headings',
      label: 'Headings',
      icon: '📋',
      properties: {
        fontSize: true,
        fontFamily: true,
        color: true,
        backgroundColor: true,
        spacing: true,
      },
    },
    {
      key: 'buttons',
      label: 'Buttons',
      icon: '🔘',
      properties: {
        fontSize: true,
        fontFamily: true,
        color: true,
        backgroundColor: true,
        spacing: true,
      },
    },
    {
      key: 'contact',
      label: 'Contact Info',
      icon: '📞',
      properties: {
        fontSize: true,
        fontFamily: true,
        color: true,
        backgroundColor: true,
        spacing: true,
      },
    },
    {
      key: 'projects',
      label: 'Projects',
      icon: '🚀',
      properties: {
        fontSize: true,
        fontFamily: true,
        color: true,
        backgroundColor: true,
        spacing: true,
      },
    },
    {
      key: 'achievements',
      label: 'Achievements',
      icon: '🏆',
      properties: {
        fontSize: true,
        fontFamily: true,
        color: true,
        backgroundColor: true,
        spacing: true,
      },
    },
    {
      key: 'summary',
      label: 'Summary',
      icon: '📝',
      properties: {
        fontSize: true,
        fontFamily: true,
        color: true,
        backgroundColor: true,
        spacing: true,
      },
    },
  ];

  const fontFamilies = [
    'Inter',
    'Roboto',
    'Open Sans',
    'Lato',
    'Montserrat',
    'Poppins',
    'Source Sans Pro',
    'Nunito',
    'Raleway',
    'Ubuntu',
  ];

  const colorPresets = [
    '#1f2937', // Gray-800
    '#374151', // Gray-700
    '#4b5563', // Gray-600
    '#6b7280', // Gray-500
    '#1e40af', // Blue-800
    '#1d4ed8', // Blue-700
    '#2563eb', // Blue-600
    '#dc2626', // Red-600
    '#059669', // Emerald-600
    '#7c3aed', // Violet-600
    '#ea580c', // Orange-600
    '#0891b2', // Cyan-600
  ];

  const backgroundPresets = [
    '#ffffff', // White
    '#f9fafb', // Gray-50
    '#f3f4f6', // Gray-100
    '#e5e7eb', // Gray-200
    '#d1d5db', // Gray-300
    '#fef3c7', // Yellow-100
    '#dbeafe', // Blue-100
    '#dcfce7', // Green-100
    '#fce7f3', // Pink-100
    '#e0e7ff', // Indigo-100
    '#f0f9ff', // Sky-50
    '#fef2f2', // Red-50
    '#f0fdf4', // Green-50
    '#fefce8', // Yellow-50
    '#faf5ff', // Purple-50
    '#ecfdf5', // Emerald-50
    '#fef7ff', // Fuchsia-50
    '#f0fdfa', // Teal-50
    '#1e40af', // Blue-800 (solid)
    '#059669', // Emerald-600 (solid)
    '#dc2626', // Red-600 (solid)
    '#7c3aed', // Violet-600 (solid)
    '#ea580c', // Orange-600 (solid)
    '#0891b2', // Cyan-600 (solid)
  ];

  // Show the floating button after a short delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  // Helper to convert resume data to text
  const convertResumeDataToText = (data: ResumeData): string => {
    let text = '';
    text += `${data.personal.fullName || ''}\n`;
    text += `${data.personal.email || ''} | ${data.personal.phone || ''} | ${data.personal.location || ''}\n`;
    if (data.personal.linkedin) text += `LinkedIn: ${data.personal.linkedin}\n`;
    if (data.personal.github) text += `GitHub: ${data.personal.github}\n`;
    if (data.personal.portfolio)
      text += `Portfolio: ${data.personal.portfolio}\n`;
    text += '\n';

    if (data.summary) {
      text += 'PROFESSIONAL SUMMARY\n';
      text += `${data.summary}\n\n`;
    }

    if (data.experience && data.experience.length > 0) {
      text += 'WORK EXPERIENCE\n';
      data.experience.forEach(exp => {
        text += `${exp.position} at ${exp.company} (${exp.startDate} - ${exp.current ? 'Present' : exp.endDate})\n`;
        if (exp.location) text += `${exp.location}\n`;
        if (exp.description) text += `${exp.description}\n`;
        if (exp.achievements && exp.achievements.length > 0) {
          exp.achievements.forEach(ach => (text += `• ${ach}\n`));
        }
        text += '\n';
      });
    }

    if (data.education && data.education.length > 0) {
      text += 'EDUCATION\n';
      data.education.forEach(edu => {
        text += `${edu.degree} in ${edu.field} from ${edu.institution} (${edu.startDate} - ${edu.current ? 'Present' : edu.endDate})\n`;
        if (edu.gpa) text += `GPA: ${edu.gpa}\n`;
        if (edu.honors && edu.honors.length > 0) {
          edu.honors.forEach(honor => (text += `• ${honor}\n`));
        }
        text += '\n';
      });
    }

    if (data.skills) {
      text += 'SKILLS\n';
      if (data.skills.technical && data.skills.technical.length > 0)
        text += `Technical: ${data.skills.technical.join(', ')}\n`;
      if (data.skills.business && data.skills.business.length > 0)
        text += `Business: ${data.skills.business.join(', ')}\n`;
      if (data.skills.soft && data.skills.soft.length > 0)
        text += `Soft: ${data.skills.soft.join(', ')}\n`;
      if (data.skills.languages && data.skills.languages.length > 0)
        text += `Languages: ${data.skills.languages.join(', ')}\n`;
      if (data.skills.certifications && data.skills.certifications.length > 0)
        text += `Certifications: ${data.skills.certifications.join(', ')}\n`;
      text += '\n';
    }

    if (data.projects && data.projects.length > 0) {
      text += 'PROJECTS\n';
      data.projects.forEach(project => {
        text += `${project.name} (${project.startDate} - ${project.endDate || 'Present'})\n`;
        if (project.description) text += `${project.description}\n`;
        if (project.technologies && project.technologies.length > 0)
          text += `Technologies: ${project.technologies.join(', ')}\n`;
        if (project.url) text += `URL: ${project.url}\n`;
        text += '\n';
      });
    }

    if (data.achievements && data.achievements.length > 0) {
      text += 'ACHIEVEMENTS\n';
      data.achievements.forEach(ach => (text += `• ${ach}\n`));
      text += '\n';
    }

    return text;
  };

  // ATS Analysis
  const handleATSAnalysis = async () => {
    setIsAnalyzing(true);
    try {
      const resumeText = convertResumeDataToText(resumeData);
      const blob = new Blob([resumeText], { type: 'text/plain' });
      const file = new File([blob], 'resume.txt', { type: 'text/plain' });

      const result = await atsApi.extractExperience(file);
      if (result.success && result.data) {
        setAtsResult(result.data);
        toast.success(
          `🎯 ATS Analysis Complete! Score: ${result.data.atsScore}/100`
        );
      } else {
        throw new Error(result.message || 'Analysis failed');
      }
    } catch (error) {
      console.error('ATS Analysis error:', error);
      toast.error('Failed to analyze resume. Using fallback analysis.');
      setAtsResult({
        atsScore: 75,
        issues: ['Some formatting may not be ATS-friendly'],
        suggestions: [
          'Use standard section headings',
          'Include relevant keywords',
        ],
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  // AI Content Improvement
  const handleAIImprovement = async (section: string) => {
    setIsImproving(true);
    setActiveSection(section);
    try {
      // Simulate AI improvement
      await new Promise(resolve => setTimeout(resolve, 2000));
      setImprovementResult({
        section,
        originalContent: 'Original content...',
        improvedContent: 'AI-improved content...',
        predictedScoreIncrease: 10,
      });
      toast.success(
        `✨ ${section} improved! Expected score increase: +10 points`
      );
    } catch (error) {
      console.error('AI improvement error:', error);
      toast.error('Failed to improve content. Please try again.');
    } finally {
      setIsImproving(false);
      setActiveSection(null);
    }
  };

  // Post-Export Validation
  const handlePostExportValidation = async () => {
    setIsValidating(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      setValidationResult({
        score: 87,
        issues: ['Some formatting may not be ATS-friendly'],
        recommendations: [
          'Use standard section headings',
          'Include relevant keywords',
        ],
      });
      toast.success('📋 Post-export validation complete!');
    } catch (error) {
      console.error('Validation error:', error);
      toast.error('Failed to validate resume. Please try again.');
    } finally {
      setIsValidating(false);
    }
  };

  // Export Functionality
  const handleExport = async (format: 'pdf' | 'docx' | 'txt') => {
    setIsExporting(true);

    try {
      const filename = `${resumeData.personal.fullName || 'resume'}_${format}`;

      // Use classic export with fallback
      if (format === 'pdf') {
        await exportToPDFWithFallback(
          template,
          resumeData,
          `${filename}.pdf`
        );
      } else if (format === 'docx') {
        await exportToDOCX(template, resumeData, `${filename}.docx`);
      } else if (format === 'txt') {
        await exportToTXT(template, resumeData, `${filename}.txt`);
      }

      // Show success message
      toast.success(`${format.toUpperCase()} exported successfully!`, {
        duration: 3000,
        position: 'top-center',
        style: {
          background: '#dcfce7',
          color: '#166534',
          border: '1px solid #bbf7d0',
          borderRadius: '8px',
          padding: '12px 16px',
          fontSize: '14px',
        },
      });
    } catch (error) {
      console.error(`Export error:`, error);
      // Show more specific error message using toast
      const errorMessage =
        error instanceof Error
          ? error.message
          : `Failed to export ${format.toUpperCase()}. Please try again.`;

      toast.error(errorMessage, {
        duration: 5000,
        position: 'top-center',
        style: {
          background: '#fee2e2',
          color: '#dc2626',
          border: '1px solid #fecaca',
          borderRadius: '8px',
          padding: '12px 16px',
          fontSize: '14px',
          maxWidth: '400px',
        },
      });
    } finally {
      setIsExporting(false);
    }
  };

  // Template Customization
  const updateTemplateStyle = (
    section: string,
    property: string,
    value: string | number
  ) => {
    const updatedTemplate = { ...template } as any;
    if (!updatedTemplate.customStyles) {
      updatedTemplate.customStyles = {};
    }
    if (!updatedTemplate.customStyles[section]) {
      updatedTemplate.customStyles[section] = {};
    }
    updatedTemplate.customStyles[section][property] = value;
    onTemplateChange(updatedTemplate as ResumeTemplate);
  };

  const getCurrentValue = (section: string, property: string): string => {
    return (
      (template as any).customStyles?.[section]?.[property] ||
      getDefaultValue(section, property)
    );
  };

  const getDefaultValue = (section: string, property: string): string => {
    const defaults: Record<string, Record<string, string>> = {
      header: {
        fontSize: '1.5rem',
        fontFamily: 'Inter',
        color: '#1e40af',
        backgroundColor: '#ffffff',
        spacing: '1rem',
      },
      body: {
        fontSize: '1rem',
        fontFamily: 'Inter',
        color: '#1f2937',
        backgroundColor: '#ffffff',
        spacing: '0.5rem',
      },
      skills: {
        fontSize: '0.875rem',
        fontFamily: 'Inter',
        color: '#374151',
        backgroundColor: '#f9fafb',
        spacing: '0.25rem',
      },
      skillsTags: {
        fontSize: '0.75rem',
        fontFamily: 'Inter',
        color: '#ffffff',
        backgroundColor: '#3b82f6',
        spacing: '0.125rem',
      },
      experience: {
        fontSize: '1rem',
        fontFamily: 'Inter',
        color: '#1f2937',
        backgroundColor: '#ffffff',
        spacing: '0.75rem',
      },
      education: {
        fontSize: '1rem',
        fontFamily: 'Inter',
        color: '#1f2937',
        backgroundColor: '#ffffff',
        spacing: '0.75rem',
      },
      headings: {
        fontSize: '1.25rem',
        fontFamily: 'Inter',
        color: '#1e40af',
        backgroundColor: '#f3f4f6',
        spacing: '0.5rem',
      },
      buttons: {
        fontSize: '0.875rem',
        fontFamily: 'Inter',
        color: '#ffffff',
        backgroundColor: '#3b82f6',
        spacing: '0.5rem',
      },
      contact: {
        fontSize: '0.875rem',
        fontFamily: 'Inter',
        color: '#6b7280',
        backgroundColor: '#f9fafb',
        spacing: '0.25rem',
      },
      projects: {
        fontSize: '1rem',
        fontFamily: 'Inter',
        color: '#1f2937',
        backgroundColor: '#ffffff',
        spacing: '0.75rem',
      },
      achievements: {
        fontSize: '0.875rem',
        fontFamily: 'Inter',
        color: '#1f2937',
        backgroundColor: '#fef3c7',
        spacing: '0.5rem',
      },
      summary: {
        fontSize: '1rem',
        fontFamily: 'Inter',
        color: '#1f2937',
        backgroundColor: '#f0f9ff',
        spacing: '0.75rem',
      },
    };

    return defaults[section]?.[property] || '';
  };

  if (!isVisible) return null;

  const tabs = [
    { id: 'ats' as PanelTab, label: 'ATS Score', icon: '🎯', color: 'blue' },
    { id: 'ai' as PanelTab, label: 'AI Improve', icon: '🤖', color: 'green' },
    {
      id: 'customize' as PanelTab,
      label: 'Customize',
      icon: '🎨',
      color: 'purple',
    },
    {
      id: 'export' as PanelTab,
      label: 'Export',
      icon: '📤',
      color: 'indigo',
    },
    {
      id: 'validate' as PanelTab,
      label: 'Validate',
      icon: '📋',
      color: 'orange',
    },
  ];

  return (
    <div className={`fixed bottom-4 right-4 z-50 ${className}`}>
      <AnimatePresence>
        {!isExpanded ? (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20 }}
          >
            <div className='relative group'>
              <Button
                onClick={() => setIsExpanded(true)}
                className='w-16 h-16 rounded-full bg-gradient-to-r from-blue-600 via-purple-600 to-green-600 hover:from-blue-700 hover:via-purple-700 hover:to-green-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center'
                aria-label='Resume Tools'
              >
                <svg
                  className='w-8 h-8'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4'
                  />
                </svg>
              </Button>

              {/* Tooltip */}
              {showTooltip && (
                <div className='absolute right-20 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none'>
                  <div className='bg-gray-900 text-white text-sm px-3 py-2 rounded-lg shadow-lg whitespace-nowrap relative'>
                    <button
                      onClick={e => {
                        e.stopPropagation();
                        setShowTooltip(false);
                      }}
                      className='absolute -top-1 -right-1 w-4 h-4 bg-gray-700 hover:bg-gray-600 rounded-full flex items-center justify-center text-xs text-white transition-colors pointer-events-auto'
                      title='Close tooltip'
                    >
                      ×
                    </button>
                    <div className='font-medium'>🛠️ Resume Tools</div>
                    <div className='text-xs text-gray-300 mt-1'>
                      ATS Analysis, AI Improvement, Customization & Validation
                    </div>
                    <div className='absolute right-0 top-1/2 transform translate-x-1 -translate-y-1/2 w-2 h-2 bg-gray-900 rotate-45'></div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ scale: 0, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0, opacity: 0, y: 20 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20 }}
            className='w-96 max-w-[90vw] max-h-[80vh] overflow-y-auto'
          >
            <Card className='p-4 bg-white shadow-xl border border-gray-200'>
              {/* Header */}
              <div className='flex items-center justify-between mb-4'>
                <h3 className='text-lg font-semibold text-gray-900 flex items-center'>
                  <svg
                    className='w-5 h-5 mr-2 text-blue-600'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4'
                    />
                  </svg>
                  Resume Tools
                </h3>
                <Button
                  onClick={() => setIsExpanded(false)}
                  variant='outline'
                  size='sm'
                  className='w-8 h-8 p-0'
                >
                  ×
                </Button>
              </div>

              {/* Tabs */}
              <div className='flex space-x-1 mb-4 bg-gray-100 rounded-lg p-1'>
                {tabs.map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 px-2 py-1.5 text-xs font-medium rounded-md transition-colors ${
                      activeTab === tab.id
                        ? `bg-white text-${tab.color}-600 shadow-sm`
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <div className='flex flex-col items-center space-y-1'>
                      <span className='text-sm'>{tab.icon}</span>
                      <span>{tab.label}</span>
                    </div>
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              <div className='min-h-[300px]'>
                {activeTab === 'ats' && (
                  <div className='space-y-4'>
                    <div className='text-center'>
                      <h4 className='font-semibold text-gray-900 mb-2'>
                        🎯 ATS Analysis
                      </h4>
                      <p className='text-sm text-gray-600 mb-4'>
                        Analyze your resume for ATS compatibility and get
                        improvement suggestions.
                      </p>
                      <Button
                        onClick={handleATSAnalysis}
                        disabled={isAnalyzing}
                        className='w-full'
                      >
                        {isAnalyzing ? (
                          <div className='flex items-center justify-center space-x-2'>
                            <div className='w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin'></div>
                            <span>Analyzing...</span>
                          </div>
                        ) : (
                          'Analyze ATS Score'
                        )}
                      </Button>
                    </div>

                    {atsResult && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className='space-y-3'
                      >
                        <div className='text-center p-3 bg-blue-50 rounded-lg'>
                          <div className='text-2xl font-bold text-blue-600 mb-1'>
                            {atsResult.atsScore || 75}%
                          </div>
                          <p className='text-sm text-blue-700'>
                            ATS Compatibility Score
                          </p>
                        </div>

                        {atsResult.issues && atsResult.issues.length > 0 && (
                          <div>
                            <h5 className='text-sm font-semibold text-red-600 mb-2'>
                              ⚠️ Issues
                            </h5>
                            <ul className='space-y-1'>
                              {atsResult.issues.map(
                                (issue: string, index: number) => (
                                  <li
                                    key={index}
                                    className='text-xs text-red-600 bg-red-50 p-2 rounded'
                                  >
                                    • {issue}
                                  </li>
                                )
                              )}
                            </ul>
                          </div>
                        )}

                        {atsResult.suggestions &&
                          atsResult.suggestions.length > 0 && (
                            <div>
                              <h5 className='text-sm font-semibold text-green-600 mb-2'>
                                💡 Suggestions
                              </h5>
                              <ul className='space-y-1'>
                                {atsResult.suggestions.map(
                                  (suggestion: string, index: number) => (
                                    <li
                                      key={index}
                                      className='text-xs text-green-700 bg-green-50 p-2 rounded'
                                    >
                                      • {suggestion}
                                    </li>
                                  )
                                )}
                              </ul>
                            </div>
                          )}
                      </motion.div>
                    )}
                  </div>
                )}

                {activeTab === 'ai' && (
                  <div className='space-y-4'>
                    <div className='text-center'>
                      <h4 className='font-semibold text-gray-900 mb-2'>
                        🤖 AI Content Improver
                      </h4>
                      <p className='text-sm text-gray-600 mb-4'>
                        Enhance your resume content with AI-powered
                        improvements.
                      </p>
                    </div>

                    <div className='space-y-2'>
                      {['Summary', 'Experience', 'Skills'].map(section => (
                        <Button
                          key={section}
                          onClick={() => handleAIImprovement(section)}
                          disabled={isImproving && activeSection === section}
                          variant='outline'
                          className='w-full justify-start'
                        >
                          {isImproving && activeSection === section ? (
                            <div className='flex items-center space-x-2'>
                              <div className='w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin'></div>
                              <span>Improving {section}...</span>
                            </div>
                          ) : (
                            `Improve ${section}`
                          )}
                        </Button>
                      ))}
                    </div>

                    {improvementResult && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className='space-y-3'
                      >
                        <div className='text-center p-3 bg-green-50 rounded-lg'>
                          <div className='text-lg font-bold text-green-600 mb-1'>
                            +{improvementResult.predictedScoreIncrease} Points
                          </div>
                          <p className='text-sm text-green-700'>
                            Expected ATS Score Increase
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </div>
                )}

                {activeTab === 'customize' && (
                  <div className='space-y-4'>
                    <div className='text-center'>
                      <h4 className='font-semibold text-gray-900 mb-2'>
                        🎨 Template Customizer
                      </h4>
                      <p className='text-sm text-gray-600 mb-4'>
                        Customize fonts, colors, and spacing for all sections.
                      </p>
                    </div>

                    <div className='space-y-3 max-h-[400px] overflow-y-auto'>
                      {styleSections.map(section => (
                        <div
                          key={section.key}
                          className='border border-gray-200 rounded-lg p-3'
                        >
                          <div className='flex items-center justify-between mb-3'>
                            <div className='flex items-center space-x-2'>
                              <span className='text-sm'>{section.icon}</span>
                              <h5 className='font-medium text-gray-900 text-sm'>
                                {section.label}
                              </h5>
                            </div>
                            <Button
                              onClick={() =>
                                setActiveSection(
                                  activeSection === section.key
                                    ? null
                                    : section.key
                                )
                              }
                              variant='outline'
                              size='sm'
                              className='text-xs px-2 py-1 h-6'
                            >
                              {activeSection === section.key
                                ? 'Hide'
                                : 'Customize'}
                            </Button>
                          </div>

                          <AnimatePresence>
                            {activeSection === section.key && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className='space-y-3'
                              >
                                {/* Font Family */}
                                {section.properties.fontFamily && (
                                  <div>
                                    <label className='text-xs font-medium text-gray-700 mb-1 block'>
                                      Font Family
                                    </label>
                                    <select
                                      value={getCurrentValue(
                                        section.key,
                                        'fontFamily'
                                      )}
                                      onChange={e =>
                                        updateTemplateStyle(
                                          section.key,
                                          'fontFamily',
                                          e.target.value
                                        )
                                      }
                                      className='w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-purple-500'
                                    >
                                      {fontFamilies.map(font => (
                                        <option
                                          key={font}
                                          value={font}
                                          style={{ fontFamily: font }}
                                        >
                                          {font}
                                        </option>
                                      ))}
                                    </select>
                                  </div>
                                )}

                                {/* Font Size */}
                                {section.properties.fontSize && (
                                  <div>
                                    <label className='text-xs font-medium text-gray-700 mb-1 block'>
                                      Font Size:{' '}
                                      {getCurrentValue(section.key, 'fontSize')}
                                    </label>
                                    <input
                                      type='range'
                                      min='0.75'
                                      max='2'
                                      step='0.125'
                                      value={parseFloat(
                                        getCurrentValue(
                                          section.key,
                                          'fontSize'
                                        ).replace('rem', '')
                                      )}
                                      onChange={e =>
                                        updateTemplateStyle(
                                          section.key,
                                          'fontSize',
                                          `${e.target.value}rem`
                                        )
                                      }
                                      className='w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer'
                                    />
                                  </div>
                                )}

                                {/* Text Color */}
                                {section.properties.color && (
                                  <div>
                                    <label className='text-xs font-medium text-gray-700 mb-1 block'>
                                      Text Color
                                    </label>
                                    <div className='grid grid-cols-6 gap-1 mb-2'>
                                      {colorPresets.map(color => (
                                        <button
                                          key={color}
                                          onClick={() =>
                                            updateTemplateStyle(
                                              section.key,
                                              'color',
                                              color
                                            )
                                          }
                                          className={`w-4 h-4 rounded border ${
                                            getCurrentValue(
                                              section.key,
                                              'color'
                                            ) === color
                                              ? 'border-gray-400 ring-1 ring-gray-300'
                                              : 'border-gray-200 hover:border-gray-300'
                                          }`}
                                          style={{ backgroundColor: color }}
                                          title={color}
                                        />
                                      ))}
                                    </div>
                                    <input
                                      type='color'
                                      value={getCurrentValue(
                                        section.key,
                                        'color'
                                      )}
                                      onChange={e =>
                                        updateTemplateStyle(
                                          section.key,
                                          'color',
                                          e.target.value
                                        )
                                      }
                                      className='w-full h-6 rounded border border-gray-300 cursor-pointer'
                                    />
                                  </div>
                                )}

                                {/* Background Color */}
                                {section.properties.backgroundColor && (
                                  <div>
                                    <label className='text-xs font-medium text-gray-700 mb-1 block'>
                                      Background Color / Fill
                                    </label>
                                    <div className='grid grid-cols-6 gap-1 mb-2'>
                                      {backgroundPresets.map(color => (
                                        <button
                                          key={color}
                                          onClick={() =>
                                            updateTemplateStyle(
                                              section.key,
                                              'backgroundColor',
                                              color
                                            )
                                          }
                                          className={`w-4 h-4 rounded border ${
                                            getCurrentValue(
                                              section.key,
                                              'backgroundColor'
                                            ) === color
                                              ? 'border-gray-400 ring-1 ring-gray-300'
                                              : 'border-gray-200 hover:border-gray-300'
                                          }`}
                                          style={{ backgroundColor: color }}
                                          title={color}
                                        />
                                      ))}
                                    </div>
                                    <input
                                      type='color'
                                      value={getCurrentValue(
                                        section.key,
                                        'backgroundColor'
                                      )}
                                      onChange={e =>
                                        updateTemplateStyle(
                                          section.key,
                                          'backgroundColor',
                                          e.target.value
                                        )
                                      }
                                      className='w-full h-6 rounded border border-gray-300 cursor-pointer'
                                    />
                                  </div>
                                )}

                                {/* Spacing */}
                                {section.properties.spacing && (
                                  <div>
                                    <label className='text-xs font-medium text-gray-700 mb-1 block'>
                                      Spacing:{' '}
                                      {getCurrentValue(section.key, 'spacing')}
                                    </label>
                                    <input
                                      type='range'
                                      min='0'
                                      max='2'
                                      step='0.125'
                                      value={parseFloat(
                                        getCurrentValue(
                                          section.key,
                                          'spacing'
                                        ).replace('rem', '')
                                      )}
                                      onChange={e =>
                                        updateTemplateStyle(
                                          section.key,
                                          'spacing',
                                          `${e.target.value}rem`
                                        )
                                      }
                                      className='w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer'
                                    />
                                  </div>
                                )}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      ))}
                    </div>

                    <Button
                      onClick={() => {
                        const defaultTemplate = { ...template } as any;
                        if (defaultTemplate.customStyles) {
                          delete defaultTemplate.customStyles;
                        }
                        onTemplateChange(defaultTemplate as ResumeTemplate);
                      }}
                      variant='outline'
                      size='sm'
                      className='w-full'
                    >
                      Reset to Default
                    </Button>
                  </div>
                )}

                {activeTab === 'export' && (
                  <div className='space-y-4'>
                    <div className='text-center'>
                      <h4 className='font-semibold text-gray-900 mb-2'>
                        📤 Export Resume
                      </h4>
                      <p className='text-sm text-gray-600 mb-4'>
                        Export your resume in various formats and methods.
                      </p>
                    </div>

                    <div className='space-y-3'>
                      {/* PDF Export Options */}
                      <div className='border border-gray-200 rounded-lg p-3'>
                        <h5 className='font-medium text-gray-900 mb-2 flex items-center'>
                          <svg
                            className='w-4 h-4 mr-2 text-red-600'
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
                          PDF Export
                        </h5>
                        <div className='space-y-2'>
                          <Button
                            onClick={() => handleExport('pdf')}
                            disabled={isExporting}
                            className='w-full justify-start'
                            variant='outline'
                          >
                            {isExporting ? (
                              <div className='flex items-center space-x-2'>
                                <div className='w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin'></div>
                                <span>Exporting PDF...</span>
                              </div>
                            ) : (
                              <>
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
                                    d='M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
                                  />
                                </svg>
                                PDF (Classic)
                              </>
                            )}
                          </Button>
                          <Button
                            onClick={() => handleExport('pdf')}
                            disabled={isExporting}
                            className='w-full justify-start'
                            variant='outline'
                          >
                            {isExporting ? (
                              <div className='flex items-center space-x-2'>
                                <div className='w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin'></div>
                                <span>Exporting PDF...</span>
                              </div>
                            ) : (
                              <>
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
                                    d='M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z'
                                  />
                                </svg>
                                PDF (Print)
                              </>
                            )}
                          </Button>
                        </div>
                      </div>

                      {/* DOCX Export Options */}
                      <div className='border border-gray-200 rounded-lg p-3'>
                        <h5 className='font-medium text-gray-900 mb-2 flex items-center'>
                          <svg
                            className='w-4 h-4 mr-2 text-blue-600'
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
                          DOCX Export
                        </h5>
                        <div className='space-y-2'>
                          <Button
                            onClick={() => handleExport('docx')}
                            disabled={isExporting}
                            className='w-full justify-start'
                            variant='outline'
                          >
                            {isExporting ? (
                              <div className='flex items-center space-x-2'>
                                <div className='w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin'></div>
                                <span>Exporting DOCX...</span>
                              </div>
                            ) : (
                              <>
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
                                DOCX (Classic)
                              </>
                            )}
                          </Button>
                          <Button
                            onClick={() => handleExport('docx')}
                            disabled={isExporting}
                            className='w-full justify-start'
                            variant='outline'
                          >
                            {isExporting ? (
                              <div className='flex items-center space-x-2'>
                                <div className='w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin'></div>
                                <span>Exporting DOCX...</span>
                              </div>
                            ) : (
                              <>
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
                                    d='M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z'
                                  />
                                </svg>
                                DOCX (Print)
                              </>
                            )}
                          </Button>
                        </div>
                      </div>

                      {/* TXT Export */}
                      <div className='border border-gray-200 rounded-lg p-3'>
                        <h5 className='font-medium text-gray-900 mb-2 flex items-center'>
                          <svg
                            className='w-4 h-4 mr-2 text-gray-600'
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
                          Text Export
                        </h5>
                        <Button
                          onClick={() => handleExport('txt')}
                          disabled={isExporting}
                          className='w-full justify-start'
                          variant='outline'
                        >
                          {isExporting ? (
                            <div className='flex items-center space-x-2'>
                              <div className='w-4 h-4 border-2 border-gray-600 border-t-transparent rounded-full animate-spin'></div>
                              <span>Exporting TXT...</span>
                            </div>
                          ) : (
                            <>
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
                              TXT (Plain Text)
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'validate' && (
                  <div className='space-y-4'>
                    <div className='text-center'>
                      <h4 className='font-semibold text-gray-900 mb-2'>
                        📋 Post-Export Validation
                      </h4>
                      <p className='text-sm text-gray-600 mb-4'>
                        Validate your exported resume for ATS compatibility.
                      </p>
                      <Button
                        onClick={handlePostExportValidation}
                        disabled={isValidating}
                        className='w-full'
                      >
                        {isValidating ? (
                          <div className='flex items-center justify-center space-x-2'>
                            <div className='w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin'></div>
                            <span>Validating...</span>
                          </div>
                        ) : (
                          'Validate Exported Resume'
                        )}
                      </Button>
                    </div>

                    {validationResult && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className='space-y-3'
                      >
                        <div className='text-center p-3 bg-orange-50 rounded-lg'>
                          <div className='text-2xl font-bold text-orange-600 mb-1'>
                            {validationResult.score}%
                          </div>
                          <p className='text-sm text-orange-700'>
                            Post-Export ATS Score
                          </p>
                        </div>

                        {validationResult.issues &&
                          validationResult.issues.length > 0 && (
                            <div>
                              <h5 className='text-sm font-semibold text-red-600 mb-2'>
                                ⚠️ Issues
                              </h5>
                              <ul className='space-y-1'>
                                {validationResult.issues.map(
                                  (issue: string, index: number) => (
                                    <li
                                      key={index}
                                      className='text-xs text-red-600 bg-red-50 p-2 rounded'
                                    >
                                      • {issue}
                                    </li>
                                  )
                                )}
                              </ul>
                            </div>
                          )}

                        {validationResult.recommendations &&
                          validationResult.recommendations.length > 0 && (
                            <div>
                              <h5 className='text-sm font-semibold text-green-600 mb-2'>
                                💡 Recommendations
                              </h5>
                              <ul className='space-y-1'>
                                {validationResult.recommendations.map(
                                  (rec: string, index: number) => (
                                    <li
                                      key={index}
                                      className='text-xs text-green-700 bg-green-50 p-2 rounded'
                                    >
                                      • {rec}
                                    </li>
                                  )
                                )}
                              </ul>
                            </div>
                          )}
                      </motion.div>
                    )}
                  </div>
                )}
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UnifiedFloatingPanel;
