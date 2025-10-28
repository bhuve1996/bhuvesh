/**
 * Centralized data cleaning utilities
 * Shared between frontend and backend to ensure consistency
 * Eliminates DRY violations in data processing
 */

/**
 * Clean name extraction (remove prefixes like "Hi, Hello, I'm")
 */
export function cleanName(name: string): string {
  if (!name) return '';

  const cleaned = name
    .replace(/^(hi,?\s*|hello,?\s*|i'?m\s*|i am\s*)/i, '') // Remove prefixes
    .replace(/[.!?]+$/, '') // Remove trailing punctuation
    .trim();

  return cleaned || name; // Fallback to original if cleaning results in empty string
}

/**
 * Clean portfolio URL (filter out invalid URLs like "gmail.com")
 */
export function cleanPortfolio(portfolio: string): string {
  if (!portfolio) return '';

  const invalidPatterns = [
    /^gmail\.com$/i,
    /^@/i, // Email addresses starting with @
    /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/i, // Email addresses
    /^www\.$/i,
    /^http:\/\/$/i,
    /^https:\/\/$/i,
  ];

  if (invalidPatterns.some(pattern => pattern.test(portfolio))) {
    return '';
  }

  return portfolio;
}

/**
 * Capitalize first letter of skills
 */
export function capitalizeSkills(skills: string[]): string[] {
  return skills.map(skill => {
    if (!skill) return '';
    return skill.charAt(0).toUpperCase() + skill.slice(1).toLowerCase();
  });
}

/**
 * Capitalize first letter of a single skill
 */
export function capitalizeSkill(skill: string): string {
  if (!skill) return '';
  return skill.charAt(0).toUpperCase() + skill.slice(1).toLowerCase();
}

/**
 * Clean and capitalize all skills in a skills object
 */
export function cleanSkills(skills: {
  technical: string[];
  business: string[];
  soft: string[];
  languages: string[];
  certifications: string[];
}): {
  technical: string[];
  business: string[];
  soft: string[];
  languages: string[];
  certifications: string[];
} {
  return {
    technical: capitalizeSkills(skills.technical || []),
    business: capitalizeSkills(skills.business || []),
    soft: capitalizeSkills(skills.soft || []),
    languages: capitalizeSkills(skills.languages || []),
    certifications: capitalizeSkills(skills.certifications || []),
  };
}

/**
 * Clean phone number
 */
export function cleanPhone(phone: string): string {
  if (!phone) return '';
  // Remove all non-digit characters except + at the beginning
  return phone.replace(/[^\d+]/g, '').trim();
}

/**
 * Clean email
 */
export function cleanEmail(email: string): string {
  if (!email) return '';
  return email.toLowerCase().trim();
}

/**
 * Clean location
 */
export function cleanLocation(location: string): string {
  if (!location) return '';
  return location.trim();
}

/**
 * Clean LinkedIn URL
 */
export function cleanLinkedIn(linkedin: string): string {
  if (!linkedin) return '';
  // Ensure it's a proper LinkedIn URL
  if (
    linkedin.startsWith('linkedin.com') ||
    linkedin.startsWith('www.linkedin.com')
  ) {
    return `https://${linkedin}`;
  }
  return linkedin;
}

/**
 * Clean GitHub URL
 */
export function cleanGitHub(github: string): string {
  if (!github) return '';
  // Ensure it's a proper GitHub URL
  if (github.startsWith('github.com') || github.startsWith('www.github.com')) {
    return `https://${github}`;
  }
  return github;
}

/**
 * Clean project URL
 */
export function cleanProjectUrl(url: string): string {
  if (!url) return '';
  // Ensure it has a protocol
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    return `https://${url}`;
  }
  return url;
}

/**
 * Generate unique ID
 */
export function generateId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Extract current job title from work experience
 */
export function getCurrentJobTitle(
  experience: Array<{ current?: boolean; position?: string }>
): string {
  if (!experience || experience.length === 0) return '';

  // Find current job first
  const currentJob = experience.find(exp => exp.current === true);
  if (currentJob) {
    return currentJob.position || '';
  }

  // Fallback to most recent job
  const mostRecentJob = experience[0];
  return mostRecentJob?.position || '';
}

/**
 * Clean and validate entire personal info object
 */
export function cleanPersonalInfo(personal: {
  fullName?: string;
  email?: string;
  phone?: string;
  location?: string;
  linkedin?: string;
  github?: string;
  portfolio?: string;
  jobTitle?: string;
}): {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  github: string;
  portfolio: string;
  jobTitle: string;
} {
  return {
    fullName: cleanName(personal.fullName || ''),
    email: cleanEmail(personal.email || ''),
    phone: cleanPhone(personal.phone || ''),
    location: cleanLocation(personal.location || ''),
    linkedin: cleanLinkedIn(personal.linkedin || ''),
    github: cleanGitHub(personal.github || ''),
    portfolio: cleanPortfolio(personal.portfolio || ''),
    jobTitle: personal.jobTitle || '',
  };
}

/**
 * Clean work experience entry
 */
export function cleanWorkExperience(experience: {
  id?: string;
  company?: string;
  position?: string;
  location?: string;
  startDate?: string;
  endDate?: string;
  current?: boolean;
  description?: string;
  achievements?: string[];
  keyTechnologies?: string[];
  title?: string;
  impactMetrics?: string[];
  responsibilities?: string[];
}): {
  id: string;
  company: string;
  position: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
  achievements: string[];
  keyTechnologies: string[];
  title: string;
  impactMetrics: string[];
  responsibilities: string[];
} {
  return {
    id: experience.id || generateId('exp'),
    company: experience.company || '',
    position: experience.position || '',
    location: cleanLocation(experience.location || ''),
    startDate: experience.startDate || '',
    endDate: experience.endDate || '',
    current: experience.current || false,
    description: experience.description || '',
    achievements: experience.achievements || [],
    keyTechnologies: experience.keyTechnologies || [],
    title: experience.title || '',
    impactMetrics: experience.impactMetrics || [],
    responsibilities: experience.responsibilities || [],
  };
}

/**
 * Clean education entry
 */
export function cleanEducation(education: {
  id?: string;
  institution?: string;
  degree?: string;
  field?: string;
  location?: string;
  startDate?: string;
  endDate?: string;
  current?: boolean;
  gpa?: string;
  honors?: string[];
}): {
  id: string;
  institution: string;
  degree: string;
  field: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  gpa: string;
  honors: string[];
} {
  return {
    id: education.id || generateId('edu'),
    institution: education.institution || '',
    degree: education.degree || '',
    field: education.field || '',
    location: cleanLocation(education.location || ''),
    startDate: education.startDate || '',
    endDate: education.endDate || '',
    current: education.current || false,
    gpa: education.gpa || '',
    honors: education.honors || [],
  };
}

/**
 * Clean project entry
 */
export function cleanProject(project: {
  id?: string;
  name?: string;
  description?: string;
  technologies?: string[];
  url?: string;
  github?: string;
  startDate?: string;
  endDate?: string;
  keyFeatures?: string[];
  impact?: string[];
}): {
  id: string;
  name: string;
  description: string;
  technologies: string[];
  url: string;
  github: string;
  startDate: string;
  endDate: string;
  keyFeatures: string[];
  impact: string[];
} {
  return {
    id: project.id || generateId('proj'),
    name: project.name || '',
    description: project.description || '',
    technologies: project.technologies || [],
    url: cleanProjectUrl(project.url || ''),
    github: cleanGitHub(project.github || ''),
    startDate: project.startDate || '',
    endDate: project.endDate || '',
    keyFeatures: project.keyFeatures || [],
    impact: project.impact || [],
  };
}

/**
 * Validate resume data
 */
export function validateResumeData(data: {
  personal?: { fullName?: string; email?: string };
}): boolean {
  if (!data.personal?.fullName) return false;
  if (!data.personal?.email) return false;
  return true;
}

/**
 * Get resume statistics
 */
export function getResumeStats(data: {
  summary?: string;
  experience: Array<{ description: string }>;
  projects: Array<{ description: string }>;
  skills: Record<string, string[]>;
}): {
  wordCount: number;
  experienceCount: number;
  educationCount: number;
  projectCount: number;
  skillCount: number;
} {
  const wordCount =
    (data.summary || '').split(' ').length +
    data.experience.reduce(
      (acc, exp) => acc + exp.description.split(' ').length,
      0
    ) +
    data.projects.reduce(
      (acc, proj) => acc + proj.description.split(' ').length,
      0
    );

  return {
    wordCount,
    experienceCount: data.experience.length,
    educationCount: 0, // Will be updated when education is added
    projectCount: data.projects.length,
    skillCount: Object.values(data.skills).flat().length,
  };
}
