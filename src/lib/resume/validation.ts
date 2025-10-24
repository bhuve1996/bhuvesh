import { ResumeData } from '@/types/resume';

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  missingRequired: string[];
  missingRecommended: string[];
  score: number;
  issues: string[];
  recommendations: string[];
}

export interface ValidationOptions {
  strictMode?: boolean; // If true, warnings become errors
  allowEmptyExperience?: boolean; // For students/entry-level
  allowEmptyEducation?: boolean; // For experienced professionals
}

/**
 * Validates resume data for completeness and quality
 */
export function validateResumeData(
  data: ResumeData,
  options: ValidationOptions = {}
): ValidationResult {
  const {
    strictMode = false,
    allowEmptyExperience = false,
    allowEmptyEducation = false,
  } = options;

  const errors: string[] = [];
  const warnings: string[] = [];
  const missingRequired: string[] = [];
  const missingRecommended: string[] = [];

  // Required fields validation
  if (!data.personal.fullName?.trim()) {
    errors.push('Full name is required');
    missingRequired.push('Full Name');
  }

  if (!data.personal.email?.trim()) {
    errors.push('Email address is required');
    missingRequired.push('Email');
  }

  if (!data.personal.phone?.trim()) {
    errors.push('Phone number is required');
    missingRequired.push('Phone');
  }

  if (!data.personal.location?.trim()) {
    errors.push('Location is required');
    missingRequired.push('Location');
  }

  // Experience validation
  if (!allowEmptyExperience) {
    if (!data.experience || data.experience.length === 0) {
      errors.push('At least one work experience is required');
      missingRequired.push('Work Experience');
    } else {
      // Validate each experience entry
      data.experience.forEach((exp, index) => {
        if (!exp.company?.trim()) {
          errors.push(`Company name is required for experience ${index + 1}`);
        }
        if (!exp.position?.trim()) {
          errors.push(`Job title is required for experience ${index + 1}`);
        }
        if (!exp.startDate?.trim()) {
          errors.push(`Start date is required for experience ${index + 1}`);
        }
        if (!exp.description?.trim()) {
          warnings.push(
            `Job description is recommended for experience ${index + 1}`
          );
          missingRecommended.push(`Experience ${index + 1} Description`);
        }
      });
    }
  }

  // Education validation
  if (!allowEmptyEducation) {
    if (!data.education || data.education.length === 0) {
      errors.push('At least one education entry is required');
      missingRequired.push('Education');
    } else {
      // Validate each education entry
      data.education.forEach((edu, index) => {
        if (!edu.institution?.trim()) {
          errors.push(
            `Institution name is required for education ${index + 1}`
          );
        }
        if (!edu.degree?.trim()) {
          errors.push(`Degree is required for education ${index + 1}`);
        }
        if (!edu.field?.trim()) {
          errors.push(`Field of study is required for education ${index + 1}`);
        }
      });
    }
  }

  // Skills validation
  const hasTechnicalSkills = data.skills?.technical?.length > 0;
  const hasAnySkills =
    hasTechnicalSkills ||
    data.skills?.business?.length > 0 ||
    data.skills?.soft?.length > 0 ||
    data.skills?.languages?.length > 0;

  if (!hasAnySkills) {
    errors.push('At least one skill category is required');
    missingRequired.push('Skills');
  } else if (!hasTechnicalSkills) {
    warnings.push('Technical skills are highly recommended');
    missingRecommended.push('Technical Skills');
  }

  // Recommended fields validation
  if (!data.summary?.trim()) {
    warnings.push('Professional summary is recommended');
    missingRecommended.push('Professional Summary');
  }

  if (!data.projects || data.projects.length === 0) {
    warnings.push('Projects section is recommended to showcase your work');
    missingRecommended.push('Projects');
  }

  // Convert warnings to errors in strict mode
  if (strictMode) {
    errors.push(...warnings);
    warnings.length = 0;
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    missingRequired,
    missingRecommended,
  };
}

/**
 * Get user-friendly validation messages
 */
export function getValidationMessages(result: ValidationResult): {
  canProceed: boolean;
  message: string;
  details: string[];
} {
  const { isValid, errors, warnings, missingRequired, missingRecommended } =
    result;

  if (isValid && warnings.length === 0) {
    return {
      canProceed: true,
      message: '✅ Resume is complete and ready to save/export!',
      details: [],
    };
  }

  if (isValid && warnings.length > 0) {
    return {
      canProceed: true,
      message: '⚠️ Resume is valid but could be improved',
      details: [
        'Missing recommended sections:',
        ...missingRecommended.map(item => `• ${item}`),
        '',
        'You can proceed, but consider adding these sections for a stronger resume.',
      ],
    };
  }

  // Has errors
  const canProceed = errors.length <= 2; // Allow proceeding with minor issues
  const message = canProceed
    ? '⚠️ Resume has some issues but you can still proceed'
    : '❌ Resume is missing critical information';

  const details = [
    'Missing required sections:',
    ...missingRequired.map(item => `• ${item}`),
  ];

  if (missingRecommended.length > 0) {
    details.push('', 'Missing recommended sections:');
    details.push(...missingRecommended.map(item => `• ${item}`));
  }

  if (canProceed) {
    details.push(
      '',
      'You can still save/export, but consider completing these sections.'
    );
  } else {
    details.push(
      '',
      'Please complete the required sections before saving/exporting.'
    );
  }

  return {
    canProceed,
    message,
    details,
  };
}

/**
 * Quick validation for specific sections
 */
export function validateSection(
  section: string,
  data: ResumeData
): {
  isValid: boolean;
  message: string;
} {
  switch (section) {
    case 'personal':
      if (!data.personal.fullName?.trim()) {
        return { isValid: false, message: 'Full name is required' };
      }
      if (!data.personal.email?.trim()) {
        return { isValid: false, message: 'Email is required' };
      }
      if (!data.personal.phone?.trim()) {
        return { isValid: false, message: 'Phone is required' };
      }
      if (!data.personal.location?.trim()) {
        return { isValid: false, message: 'Location is required' };
      }
      return { isValid: true, message: 'Personal information is complete' };

    case 'experience':
      if (!data.experience || data.experience.length === 0) {
        return {
          isValid: false,
          message: 'At least one work experience is required',
        };
      }
      return {
        isValid: true,
        message: `${data.experience.length} experience(s) added`,
      };

    case 'education':
      if (!data.education || data.education.length === 0) {
        return {
          isValid: false,
          message: 'At least one education entry is required',
        };
      }
      return {
        isValid: true,
        message: `${data.education.length} education(s) added`,
      };

    case 'skills':
      const hasSkills =
        data.skills?.technical?.length > 0 ||
        data.skills?.business?.length > 0 ||
        data.skills?.soft?.length > 0 ||
        data.skills?.languages?.length > 0;

      if (!hasSkills) {
        return { isValid: false, message: 'At least one skill is required' };
      }
      return { isValid: true, message: 'Skills section is complete' };

    default:
      return { isValid: true, message: 'Section is valid' };
  }
}
