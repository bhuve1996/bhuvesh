import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';

import { ResumeBuilder } from '@/components/resume/ResumeBuilder/ResumeBuilder';
import { validateResumeData } from '@/lib/resume/validation';

// Mock dependencies
jest.mock('@/lib/resume/validation');
jest.mock('react-hot-toast', () => ({
  error: jest.fn(),
  success: jest.fn(),
}));

const mockValidateResumeData = validateResumeData as jest.MockedFunction<typeof validateResumeData>;

describe('ResumeBuilder Component', () => {
  const defaultProps = {
    onSave: jest.fn(),
    onExport: jest.fn(),
  };

  const mockResumeData = {
    personal: {
      fullName: 'John Doe',
      email: 'john@example.com',
      phone: '+1-555-0123',
      location: 'San Francisco, CA',
      linkedin: 'linkedin.com/in/johndoe',
      github: 'github.com/johndoe',
      portfolio: 'johndoe.dev',
    },
    summary: 'Experienced software engineer with 5+ years of experience in full-stack development.',
    experience: [
      {
        id: '1',
        position: 'Senior Software Engineer',
        company: 'Tech Corp',
        location: 'San Francisco, CA',
        startDate: '2020-01',
        endDate: '2023-12',
        description: 'Led development of scalable web applications',
        achievements: [
          'Improved application performance by 40%',
          'Mentored 3 junior developers',
        ],
      },
    ],
    education: [
      {
        id: '1',
        degree: 'Bachelor of Science',
        field: 'Computer Science',
        institution: 'University of California',
        location: 'Berkeley, CA',
        startDate: '2016-09',
        endDate: '2020-05',
        gpa: '3.8',
        achievements: ['Magna Cum Laude', 'Dean\'s List'],
      },
    ],
    skills: {
      technical: ['JavaScript', 'TypeScript', 'React', 'Node.js'],
      business: ['Project Management', 'Agile', 'Scrum'],
      soft: ['Leadership', 'Communication', 'Problem Solving'],
      languages: ['English (Native)', 'Spanish (Conversational)'],
      certifications: ['AWS Certified Developer', 'Google Cloud Professional'],
    },
    projects: [
      {
        id: '1',
        name: 'E-commerce Platform',
        description: 'Built a full-stack e-commerce platform using React and Node.js',
        technologies: ['React', 'Node.js', 'MongoDB', 'Stripe'],
        startDate: '2022-01',
        endDate: '2022-06',
        url: 'https://ecommerce-demo.com',
        achievements: ['Handled 10,000+ daily users', '99.9% uptime'],
      },
    ],
    achievements: [
      'Published 5 technical articles',
      'Speaker at 3 tech conferences',
      'Open source contributor with 1000+ stars',
    ],
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockValidateResumeData.mockReturnValue({
      isValid: true,
      errors: [],
      warnings: [],
    });
  });

  describe('Form Rendering', () => {
    it('should render all resume sections', () => {
      render(<ResumeBuilder {...defaultProps} initialData={mockResumeData} />);
      
      expect(screen.getByText('Personal Information')).toBeInTheDocument();
      expect(screen.getByText('Professional Summary')).toBeInTheDocument();
      expect(screen.getByText('Work Experience')).toBeInTheDocument();
      expect(screen.getByText('Education')).toBeInTheDocument();
      expect(screen.getByText('Skills')).toBeInTheDocument();
      expect(screen.getByText('Projects')).toBeInTheDocument();
      expect(screen.getByText('Achievements')).toBeInTheDocument();
    });

    it('should populate form with initial data', () => {
      render(<ResumeBuilder {...defaultProps} initialData={mockResumeData} />);
      
      expect(screen.getByDisplayValue('John Doe')).toBeInTheDocument();
      expect(screen.getByDisplayValue('john@example.com')).toBeInTheDocument();
      expect(screen.getByDisplayValue('+1-555-0123')).toBeInTheDocument();
    });

    it('should show empty form when no initial data provided', () => {
      render(<ResumeBuilder {...defaultProps} />);
      
      const nameInput = screen.getByLabelText(/full name/i);
      const emailInput = screen.getByLabelText(/email/i);
      
      expect(nameInput).toHaveValue('');
      expect(emailInput).toHaveValue('');
    });
  });

  describe('Form Validation', () => {
    it('should validate required fields', async () => {
      const user = userEvent.setup();
      mockValidateResumeData.mockReturnValue({
        isValid: false,
        errors: [
          { field: 'personal.fullName', message: 'Full name is required' },
          { field: 'personal.email', message: 'Email is required' },
        ],
        warnings: [],
      });

      render(<ResumeBuilder {...defaultProps} />);
      
      const saveButton = screen.getByRole('button', { name: /save resume/i });
      await user.click(saveButton);

      await waitFor(() => {
        expect(screen.getByText('Full name is required')).toBeInTheDocument();
        expect(screen.getByText('Email is required')).toBeInTheDocument();
      });
    });

    it('should show validation warnings', async () => {
      const user = userEvent.setup();
      mockValidateResumeData.mockReturnValue({
        isValid: true,
        errors: [],
        warnings: [
          { field: 'summary', message: 'Summary could be more detailed' },
        ],
      });

      render(<ResumeBuilder {...defaultProps} initialData={mockResumeData} />);
      
      const saveButton = screen.getByRole('button', { name: /save resume/i });
      await user.click(saveButton);

      await waitFor(() => {
        expect(screen.getByText('Summary could be more detailed')).toBeInTheDocument();
      });
    });

    it('should validate email format', async () => {
      const user = userEvent.setup();
      render(<ResumeBuilder {...defaultProps} />);
      
      const emailInput = screen.getByLabelText(/email/i);
      await user.type(emailInput, 'invalid-email');

      const saveButton = screen.getByRole('button', { name: /save resume/i });
      await user.click(saveButton);

      await waitFor(() => {
        expect(screen.getByText(/invalid email format/i)).toBeInTheDocument();
      });
    });
  });

  describe('Data Management', () => {
    it('should add new experience entry', async () => {
      const user = userEvent.setup();
      render(<ResumeBuilder {...defaultProps} initialData={mockResumeData} />);
      
      const addExperienceButton = screen.getByRole('button', { name: /add experience/i });
      await user.click(addExperienceButton);

      expect(screen.getByText('Position')).toBeInTheDocument();
      expect(screen.getByText('Company')).toBeInTheDocument();
    });

    it('should remove experience entry', async () => {
      const user = userEvent.setup();
      render(<ResumeBuilder {...defaultProps} initialData={mockResumeData} />);
      
      const removeButton = screen.getByRole('button', { name: /remove experience/i });
      await user.click(removeButton);

      // Confirm removal
      const confirmButton = screen.getByRole('button', { name: /confirm/i });
      await user.click(confirmButton);

      await waitFor(() => {
        expect(screen.queryByText('Senior Software Engineer')).not.toBeInTheDocument();
      });
    });

    it('should add new skill', async () => {
      const user = userEvent.setup();
      render(<ResumeBuilder {...defaultProps} initialData={mockResumeData} />);
      
      const addSkillButton = screen.getByRole('button', { name: /add technical skill/i });
      await user.click(addSkillButton);

      const skillInput = screen.getByPlaceholderText(/enter skill/i);
      await user.type(skillInput, 'Python');
      await user.keyboard('{Enter}');

      expect(screen.getByText('Python')).toBeInTheDocument();
    });

    it('should remove skill', async () => {
      const user = userEvent.setup();
      render(<ResumeBuilder {...defaultProps} initialData={mockResumeData} />);
      
      const removeSkillButton = screen.getByRole('button', { name: /remove javascript/i });
      await user.click(removeSkillButton);

      await waitFor(() => {
        expect(screen.queryByText('JavaScript')).not.toBeInTheDocument();
      });
    });
  });

  describe('Save Functionality', () => {
    it('should save resume data when valid', async () => {
      const user = userEvent.setup();
      render(<ResumeBuilder {...defaultProps} initialData={mockResumeData} />);
      
      const saveButton = screen.getByRole('button', { name: /save resume/i });
      await user.click(saveButton);

      await waitFor(() => {
        expect(defaultProps.onSave).toHaveBeenCalledWith(mockResumeData);
      });
    });

    it('should not save when validation fails', async () => {
      const user = userEvent.setup();
      mockValidateResumeData.mockReturnValue({
        isValid: false,
        errors: [{ field: 'personal.fullName', message: 'Full name is required' }],
        warnings: [],
      });

      render(<ResumeBuilder {...defaultProps} />);
      
      const saveButton = screen.getByRole('button', { name: /save resume/i });
      await user.click(saveButton);

      await waitFor(() => {
        expect(defaultProps.onSave).not.toHaveBeenCalled();
      });
    });

    it('should show save success message', async () => {
      const user = userEvent.setup();
      render(<ResumeBuilder {...defaultProps} initialData={mockResumeData} />);
      
      const saveButton = screen.getByRole('button', { name: /save resume/i });
      await user.click(saveButton);

      await waitFor(() => {
        expect(screen.getByText(/resume saved successfully/i)).toBeInTheDocument();
      });
    });
  });

  describe('Export Functionality', () => {
    it('should export to PDF', async () => {
      const user = userEvent.setup();
      render(<ResumeBuilder {...defaultProps} initialData={mockResumeData} />);
      
      const exportButton = screen.getByRole('button', { name: /export/i });
      await user.click(exportButton);

      const pdfOption = screen.getByRole('button', { name: /export as pdf/i });
      await user.click(pdfOption);

      await waitFor(() => {
        expect(defaultProps.onExport).toHaveBeenCalledWith(mockResumeData, 'pdf');
      });
    });

    it('should export to DOCX', async () => {
      const user = userEvent.setup();
      render(<ResumeBuilder {...defaultProps} initialData={mockResumeData} />);
      
      const exportButton = screen.getByRole('button', { name: /export/i });
      await user.click(exportButton);

      const docxOption = screen.getByRole('button', { name: /export as docx/i });
      await user.click(docxOption);

      await waitFor(() => {
        expect(defaultProps.onExport).toHaveBeenCalledWith(mockResumeData, 'docx');
      });
    });

    it('should export to TXT', async () => {
      const user = userEvent.setup();
      render(<ResumeBuilder {...defaultProps} initialData={mockResumeData} />);
      
      const exportButton = screen.getByRole('button', { name: /export/i });
      await user.click(exportButton);

      const txtOption = screen.getByRole('button', { name: /export as txt/i });
      await user.click(txtOption);

      await waitFor(() => {
        expect(defaultProps.onExport).toHaveBeenCalledWith(mockResumeData, 'txt');
      });
    });
  });

  describe('Navigation', () => {
    it('should switch between builder and preview modes', async () => {
      const user = userEvent.setup();
      render(<ResumeBuilder {...defaultProps} initialData={mockResumeData} />);
      
      const previewButton = screen.getByRole('button', { name: /preview/i });
      await user.click(previewButton);

      expect(screen.getByText(/resume preview/i)).toBeInTheDocument();
      
      const editButton = screen.getByRole('button', { name: /edit/i });
      await user.click(editButton);

      expect(screen.getByText('Personal Information')).toBeInTheDocument();
    });

    it('should expand and collapse sections', async () => {
      const user = userEvent.setup();
      render(<ResumeBuilder {...defaultProps} initialData={mockResumeData} />);
      
      const experienceSection = screen.getByText('Work Experience').closest('div');
      const toggleButton = experienceSection?.querySelector('button');
      
      if (toggleButton) {
        await user.click(toggleButton);
        expect(experienceSection).toHaveClass('collapsed');
        
        await user.click(toggleButton);
        expect(experienceSection).not.toHaveClass('collapsed');
      }
    });
  });

  describe('Rich Text Editing', () => {
    it('should handle rich text input for summary', async () => {
      const user = userEvent.setup();
      render(<ResumeBuilder {...defaultProps} initialData={mockResumeData} />);
      
      const summaryEditor = screen.getByRole('textbox', { name: /professional summary/i });
      await user.clear(summaryEditor);
      await user.type(summaryEditor, 'New summary with **bold** text');

      expect(summaryEditor).toHaveValue('New summary with **bold** text');
    });

    it('should format text with toolbar buttons', async () => {
      const user = userEvent.setup();
      render(<ResumeBuilder {...defaultProps} initialData={mockResumeData} />);
      
      const summaryEditor = screen.getByRole('textbox', { name: /professional summary/i });
      await user.clear(summaryEditor);
      await user.type(summaryEditor, 'Selected text');

      // Select text
      await user.selectText(summaryEditor);
      
      const boldButton = screen.getByRole('button', { name: /bold/i });
      await user.click(boldButton);

      expect(summaryEditor).toHaveValue('**Selected text**');
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA labels for all form fields', () => {
      render(<ResumeBuilder {...defaultProps} initialData={mockResumeData} />);
      
      expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/phone/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/location/i)).toBeInTheDocument();
    });

    it('should support keyboard navigation', async () => {
      const user = userEvent.setup();
      render(<ResumeBuilder {...defaultProps} initialData={mockResumeData} />);
      
      await user.tab();
      expect(screen.getByLabelText(/full name/i)).toHaveFocus();
      
      await user.tab();
      expect(screen.getByLabelText(/email/i)).toHaveFocus();
    });

    it('should announce validation errors to screen readers', async () => {
      const user = userEvent.setup();
      mockValidateResumeData.mockReturnValue({
        isValid: false,
        errors: [{ field: 'personal.fullName', message: 'Full name is required' }],
        warnings: [],
      });

      render(<ResumeBuilder {...defaultProps} />);
      
      const saveButton = screen.getByRole('button', { name: /save resume/i });
      await user.click(saveButton);

      await waitFor(() => {
        const errorMessage = screen.getByRole('alert');
        expect(errorMessage).toBeInTheDocument();
      });
    });
  });

  describe('Auto-save', () => {
    it('should auto-save changes after delay', async () => {
      const user = userEvent.setup();
      render(<ResumeBuilder {...defaultProps} initialData={mockResumeData} />);
      
      const nameInput = screen.getByLabelText(/full name/i);
      await user.clear(nameInput);
      await user.type(nameInput, 'Jane Doe');

      // Wait for auto-save delay
      await waitFor(() => {
        expect(defaultProps.onSave).toHaveBeenCalled();
      }, { timeout: 2000 });
    });

    it('should not auto-save invalid data', async () => {
      const user = userEvent.setup();
      mockValidateResumeData.mockReturnValue({
        isValid: false,
        errors: [{ field: 'personal.email', message: 'Invalid email' }],
        warnings: [],
      });

      render(<ResumeBuilder {...defaultProps} initialData={mockResumeData} />);
      
      const emailInput = screen.getByLabelText(/email/i);
      await user.clear(emailInput);
      await user.type(emailInput, 'invalid-email');

      // Wait for auto-save delay
      await waitFor(() => {
        expect(defaultProps.onSave).not.toHaveBeenCalled();
      }, { timeout: 2000 });
    });
  });
});
