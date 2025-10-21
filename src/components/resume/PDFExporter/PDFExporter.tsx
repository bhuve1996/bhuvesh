'use client';

import { Button } from '@/components/ui/Button';
import { ResumeData, ResumeTemplate } from '@/types/resume';
import {
  Document,
  Page,
  StyleSheet,
  Text,
  View,
  pdf,
} from '@react-pdf/renderer';
import React, { useState } from 'react';

interface PDFExporterProps {
  resumeData: ResumeData;
  template: ResumeTemplate | null;
  onExport?: () => void;
}

// PDF Styles
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    padding: 30,
    fontSize: 12,
    lineHeight: 1.4,
  },
  header: {
    marginBottom: 20,
    textAlign: 'center',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#1f2937',
  },
  contactInfo: {
    fontSize: 10,
    color: '#6b7280',
    marginBottom: 4,
  },
  section: {
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#1f2937',
    borderBottom: '1pt solid #e5e7eb',
    paddingBottom: 4,
  },
  summary: {
    fontSize: 11,
    lineHeight: 1.5,
    color: '#374151',
    marginBottom: 8,
  },
  experienceItem: {
    marginBottom: 12,
  },
  jobTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  company: {
    fontSize: 11,
    color: '#2563eb',
    marginBottom: 2,
  },
  jobDetails: {
    fontSize: 10,
    color: '#6b7280',
    marginBottom: 4,
  },
  jobDescription: {
    fontSize: 10,
    color: '#374151',
    lineHeight: 1.4,
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  skillTag: {
    backgroundColor: '#f3f4f6',
    padding: '2 6',
    margin: '1 4 1 0',
    borderRadius: 3,
    fontSize: 9,
    color: '#374151',
  },
  educationItem: {
    marginBottom: 8,
  },
  degree: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  school: {
    fontSize: 10,
    color: '#2563eb',
  },
  educationDetails: {
    fontSize: 9,
    color: '#6b7280',
  },
});

const PDFDocument: React.FC<{
  resumeData: ResumeData;
  template: ResumeTemplate | null;
}> = ({ resumeData, template }) => {
  const templateStyles = template?.layout || {};

  return (
    <Document>
      <Page size='A4' style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.name}>
            {resumeData.personal.fullName || 'Your Name'}
          </Text>
          <Text style={styles.contactInfo}>
            {resumeData.personal.email || 'your.email@example.com'}
          </Text>
          <Text style={styles.contactInfo}>
            {resumeData.personal.phone || '(555) 123-4567'}
          </Text>
          <Text style={styles.contactInfo}>
            {resumeData.personal.location || 'Your Location'}
          </Text>
          {resumeData.personal.linkedin && (
            <Text style={styles.contactInfo}>
              LinkedIn: {resumeData.personal.linkedin}
            </Text>
          )}
          {resumeData.personal.github && (
            <Text style={styles.contactInfo}>
              GitHub: {resumeData.personal.github}
            </Text>
          )}
        </View>

        {/* Professional Summary */}
        {resumeData.summary && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Professional Summary</Text>
            <Text style={styles.summary}>{resumeData.summary}</Text>
          </View>
        )}

        {/* Experience */}
        {resumeData.experience && resumeData.experience.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Professional Experience</Text>
            {resumeData.experience.map((job, index) => (
              <View key={index} style={styles.experienceItem}>
                <Text style={styles.jobTitle}>{job.position}</Text>
                <Text style={styles.company}>{job.company}</Text>
                <Text style={styles.jobDetails}>
                  {job.location} • {job.startDate} - {job.endDate || 'Present'}
                </Text>
                <Text style={styles.jobDescription}>{job.description}</Text>
                {job.achievements && job.achievements.length > 0 && (
                  <View style={{ marginTop: 4 }}>
                    {job.achievements.map((achievement, idx) => (
                      <Text
                        key={idx}
                        style={[styles.jobDescription, { marginLeft: 8 }]}
                      >
                        • {achievement}
                      </Text>
                    ))}
                  </View>
                )}
              </View>
            ))}
          </View>
        )}

        {/* Skills */}
        {(resumeData.skills.technical.length > 0 ||
          resumeData.skills.soft.length > 0) && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Skills</Text>
            <View style={styles.skillsContainer}>
              {resumeData.skills.technical.map((skill, index) => (
                <Text key={index} style={styles.skillTag}>
                  {skill}
                </Text>
              ))}
              {resumeData.skills.soft.map((skill, index) => (
                <Text key={index} style={styles.skillTag}>
                  {skill}
                </Text>
              ))}
            </View>
          </View>
        )}

        {/* Education */}
        {resumeData.education && resumeData.education.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Education</Text>
            {resumeData.education.map((edu, index) => (
              <View key={index} style={styles.educationItem}>
                <Text style={styles.degree}>{edu.degree}</Text>
                <Text style={styles.school}>{edu.institution}</Text>
                <Text style={styles.educationDetails}>
                  {edu.location} • {edu.startDate} - {edu.endDate || 'Present'}
                  {edu.gpa && ` • GPA: ${edu.gpa}`}
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* Projects */}
        {resumeData.projects && resumeData.projects.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Projects</Text>
            {resumeData.projects.map((project, index) => (
              <View key={index} style={styles.experienceItem}>
                <Text style={styles.jobTitle}>{project.name}</Text>
                <Text style={styles.jobDescription}>{project.description}</Text>
                {project.technologies && project.technologies.length > 0 && (
                  <View style={[styles.skillsContainer, { marginTop: 4 }]}>
                    {project.technologies.map((tech, idx) => (
                      <Text key={idx} style={styles.skillTag}>
                        {tech}
                      </Text>
                    ))}
                  </View>
                )}
              </View>
            ))}
          </View>
        )}
      </Page>
    </Document>
  );
};

export const PDFExporter: React.FC<PDFExporterProps> = ({
  resumeData,
  template,
  onExport,
}) => {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    try {
      setIsExporting(true);

      // Generate PDF
      const blob = await pdf(
        <PDFDocument resumeData={resumeData} template={template} />
      ).toBlob();

      // Create download link
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${resumeData.personal.fullName || 'resume'}-resume.pdf`;

      // Trigger download
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Clean up
      URL.revokeObjectURL(url);

      if (onExport) {
        onExport();
      }
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Button
      onClick={handleExport}
      disabled={isExporting}
      variant='outline'
      size='sm'
      className='flex items-center gap-2'
    >
      {isExporting ? (
        <>
          <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600'></div>
          Generating...
        </>
      ) : (
        <>
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
        </>
      )}
    </Button>
  );
};

export default PDFExporter;
