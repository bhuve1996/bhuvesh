// ATS to Resume Builder Mapper
// This ensures we don't miss any data when converting from ATS extraction to Resume Builder format

import type {
  Certification,
  ContactInfo,
  Education,
  ExtractionDetails,
  Project,
  SkillsFound,
  StructuredEducation,
  StructuredExperience,
  StructuredWorkExperience,
  WorkExperience,
} from '@/types/ats';
import type {
  ResumeBuilderEducation,
  ResumeBuilderProject,
  ResumeBuilderWorkExperience,
  ResumeData,
} from '@/types/resume';

/**
 * Convert ATS ContactInfo to Resume Builder PersonalInfo
 */
export function mapContactInfo(atsContact: ContactInfo): {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  linkedin?: string;
  github?: string;
  portfolio?: string;
} {
  return {
    fullName: atsContact.full_name || '',
    email: atsContact.email || '',
    phone:
      typeof atsContact.phone === 'object'
        ? atsContact.phone?.raw || atsContact.phone?.number || ''
        : atsContact.phone || '',
    location:
      typeof atsContact.location === 'object'
        ? atsContact.location?.full ||
          `${atsContact.location?.city || ''}, ${atsContact.location?.state || ''}, ${atsContact.location?.country || ''}`
            .replace(/^,\s*|,\s*$/g, '')
            .replace(/,\s*,/g, ',')
        : atsContact.location || '',
    linkedin:
      typeof atsContact.linkedin === 'object'
        ? atsContact.linkedin?.url || ''
        : atsContact.linkedin || '',
    github:
      typeof atsContact.github === 'object'
        ? atsContact.github?.url || ''
        : atsContact.github || '',
    portfolio: atsContact.portfolio || '',
  };
}

/**
 * Convert ATS Education to Resume Builder Education
 */
export function mapEducation(
  atsEducation: Education,
  index: number
): ResumeBuilderEducation {
  // Extract field from degree
  const degree = atsEducation.degree_full || '';
  const field =
    atsEducation.major ||
    atsEducation.specialization ||
    (degree.includes('Computer Science')
      ? 'Computer Science'
      : degree.includes('Engineering')
        ? 'Engineering'
        : degree.includes('Science')
          ? 'Science'
          : '');

  // Estimate start date from graduation year (assuming 4-year degree)
  const endYear = atsEducation.duration?.end_year || '';
  const startYear = endYear ? (parseInt(endYear) - 4).toString() : '';

  return {
    id: `edu-${index}`,
    institution: atsEducation.institution?.name || '',
    degree,
    field,
    location: atsEducation.institution?.location || '',
    startDate: startYear,
    endDate: endYear,
    current: false,
    gpa: atsEducation.grade?.value || '',
    honors: [],
  };
}

/**
 * Convert Structured Education to Resume Builder Education
 */
export function mapStructuredEducation(
  structuredEdu: StructuredEducation,
  index: number
): ResumeBuilderEducation {
  // Extract field from degree
  const degree = structuredEdu.degree || '';
  const field = degree.includes('Computer Science')
    ? 'Computer Science'
    : degree.includes('Engineering')
      ? 'Engineering'
      : degree.includes('Science')
        ? 'Science'
        : '';

  // Estimate start date from graduation year (assuming 4-year degree)
  const endYear = structuredEdu.graduation_year || '';
  const startYear = endYear ? (parseInt(endYear) - 4).toString() : '';

  return {
    id: `edu-${index}`,
    institution: structuredEdu.institution || '',
    degree,
    field,
    location: structuredEdu.location || '',
    startDate: startYear,
    endDate: endYear,
    current: false,
    gpa: structuredEdu.gpa || '',
    honors: [],
  };
}

/**
 * Convert ATS WorkExperience to Resume Builder WorkExperience
 */
export function mapWorkExperience(
  atsWork: WorkExperience,
  index: number
): ResumeBuilderWorkExperience {
  return {
    id: `job-${index}`,
    company: atsWork.company || '',
    position: atsWork.role || '',
    location: atsWork.location || '',
    startDate: atsWork.start_date || '',
    endDate: atsWork.end_date || '',
    current: false,
    description: '',
    achievements: [],
  };
}

/**
 * Convert Structured WorkExperience to Resume Builder WorkExperience
 */
export function mapStructuredWorkExperience(
  structuredWork: StructuredWorkExperience,
  index: number
): ResumeBuilderWorkExperience {
  const position = structuredWork.positions?.[0];

  return {
    id: `job-${index}`,
    company: structuredWork.company || '',
    position: position?.title || '',
    location: position?.location || '',
    startDate: position?.start_date || '',
    endDate: position?.end_date || '',
    current: structuredWork.current || false,
    description: structuredWork.responsibilities?.join('\n') || '',
    achievements: structuredWork.achievements || [],
  };
}

/**
 * Map skills from ATS extraction to Resume Builder format
 */
export function mapSkills(extractedSkills: SkillsFound): {
  technical: string[];
  business: string[];
  soft: string[];
  languages: string[];
  certifications: string[];
} {
  return {
    technical: [
      ...(extractedSkills?.technical_programming || []),
      ...(extractedSkills?.technical_tools || []),
      ...(extractedSkills?.tools_software || []),
    ],
    business: [
      ...(extractedSkills?.business_management || []),
      ...(extractedSkills?.financial_accounting || []),
      ...(extractedSkills?.sales_marketing || []),
      ...(extractedSkills?.customer_service || []),
    ],
    soft: [...(extractedSkills?.soft_skills || [])],
    languages: [...(extractedSkills?.languages_spoken || [])],
    certifications: [...(extractedSkills?.certifications || [])],
  };
}

/**
 * Complete ATS to Resume Builder mapper
 */
export function mapATSToResumeData(
  extractionDetails: ExtractionDetails,
  structuredExperience?: StructuredExperience
): ResumeData | null {
  if (!extractionDetails) return null;

  const extracted = extractionDetails;
  const structuredData = structuredExperience;
  const categorizedData = extracted.categorized_resume;

  // Map contact info
  const personal = structuredData?.contact_info
    ? {
        fullName: structuredData.contact_info.full_name || '',
        email: structuredData.contact_info.email || '',
        phone: structuredData.contact_info.phone || '',
        location: structuredData.contact_info.location || '',
        linkedin: structuredData.contact_info.linkedin || '',
        github: structuredData.contact_info.github || '',
        portfolio: '',
      }
    : categorizedData?.contact_info
      ? mapContactInfo(categorizedData.contact_info)
      : {
          fullName: '',
          email: '',
          phone: '',
          location: '',
        };

  // Map education - prefer structured data, fallback to categorized
  const education: ResumeBuilderEducation[] =
    structuredData?.education?.map(mapStructuredEducation) ||
    categorizedData?.education?.map(mapEducation) ||
    [];

  // Map work experience - prefer structured data, fallback to categorized
  const experience: ResumeBuilderWorkExperience[] =
    structuredData?.work_experience?.map(mapStructuredWorkExperience) ||
    categorizedData?.work_experience?.map(mapWorkExperience) ||
    [];

  // Map skills
  const skills = mapSkills(extracted.skills_found || {});

  // Add languages from separate extraction
  if (extracted.languages && extracted.languages.length > 0) {
    skills.languages.push(...extracted.languages);
  }

  // Add certifications from separate extraction
  if (extracted.certifications && extracted.certifications.length > 0) {
    skills.certifications.push(...extracted.certifications);
  }

  // Extract projects from work experience
  const projects: ResumeBuilderProject[] =
    structuredData?.work_experience?.flatMap(
      (exp: StructuredWorkExperience) =>
        exp.projects?.map((project: Project, index: number) => ({
          id: `project-${index}`,
          name: project.name || '',
          description: project.description || '',
          technologies: project.technologies || [],
          url: '',
          github: '',
          startDate: '',
          endDate: '',
        })) || []
    ) || [];

  // Map certifications properly
  const certifications =
    structuredData?.certifications?.map(
      (cert: Certification, index: number) => ({
        id: `cert-${index}`,
        name: cert.name || '',
        issuer: cert.issuer || '',
        date: cert.date || '',
        expiry: cert.expiry || '',
        credentialId: '',
        url: '',
      })
    ) || [];

  return {
    personal,
    summary: structuredData?.summary || categorizedData?.summary_profile || '',
    experience,
    education,
    skills,
    projects,
    achievements:
      structuredData?.work_experience?.flatMap(
        (exp: { achievements?: string[] }) => exp.achievements || []
      ) ||
      categorizedData?.achievements ||
      [],
    certifications,
    hobbies: extracted.hobbies_interests || [],
  };
}
