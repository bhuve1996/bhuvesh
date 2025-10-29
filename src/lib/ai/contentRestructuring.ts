/**
 * AI-powered content restructuring service
 * Automatically organizes and formats resume content for better presentation
 */

import { formatExperienceYears } from '@/lib/utils';
import { ResumeData } from '@/types/resume';

export interface RestructuredContent {
  experience: RestructuredExperience[];
  projects: RestructuredProject[];
  skills: RestructuredSkills;
  summary: string;
}

export interface RestructuredExperience {
  id: string;
  company: string;
  position: string;
  location: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  description: string;
  achievements: string[];
  title?: string;
  // AI-restructured content
  keyTechnologies?: string[];
  impactMetrics?: string[];
  responsibilities?: string[];
}

export interface RestructuredProject {
  id: string;
  name: string;
  description: string;
  technologies: string[];
  url?: string;
  github?: string;
  startDate: string;
  endDate?: string;
  // AI-restructured content
  keyFeatures?: string[];
  impact?: string[];
}

export interface RestructuredSkills {
  technical: SkillCategory[];
  business: SkillCategory[];
  tools: SkillCategory[];
  languages: SkillCategory[];
}

export interface SkillCategory {
  category: string;
  skills: string[];
  proficiency?: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
}

/**
 * AI-powered content restructuring service
 */
export class ContentRestructuringService {
  /**
   * Restructure experience descriptions into organized bullet points
   */
  static restructureExperienceDescription(description: string): {
    achievements: string[];
    responsibilities: string[];
    keyTechnologies: string[];
    impactMetrics: string[];
  } {
    // Split the description into sentences
    const sentences = description
      .split(/[.!?]+/)
      .map(s => s.trim())
      .filter(s => s.length > 0);

    const achievements: string[] = [];
    const responsibilities: string[] = [];
    const keyTechnologies: string[] = [];
    const impactMetrics: string[] = [];

    // Common technology patterns
    const techPatterns = [
      /\b(React|Next\.js|Vue\.js|Angular|TypeScript|JavaScript|Node\.js|GraphQL|REST|API|CMS|Storybook|Contentful|Sitecore|Mapbox|Vercel|SCSS|CSS|HTML)\b/gi,
      /\b(Agile|Scrum|DevOps|CI\/CD|Git|Docker|AWS|Azure|GCP)\b/gi,
      /\b(SEO|Performance|Optimization|Accessibility|Responsive|Mobile)\b/gi,
    ];

    // Common achievement indicators
    const achievementIndicators = [
      /engineered|developed|architected|built|created|implemented|optimized|improved|streamlined|enhanced|delivered|achieved|increased|reduced|boosted/gi,
    ];

    // Common metric patterns
    const metricPatterns = [
      /\d+%|\d+x|\d+\+|\d+\.\d+|\d+ms|\d+ms|\d+GB|\d+TB|\d+K|\d+M/gi,
      /performance|speed|efficiency|conversion|engagement|load time|response time/gi,
    ];

    sentences.forEach(sentence => {
      // Extract technologies
      techPatterns.forEach(pattern => {
        const matches = sentence.match(pattern);
        if (matches) {
          keyTechnologies.push(...matches.map(m => m.trim()));
        }
      });

      // Extract metrics
      metricPatterns.forEach(pattern => {
        if (pattern.test(sentence)) {
          impactMetrics.push(sentence.trim());
          return;
        }
      });

      // Categorize as achievement or responsibility
      const isAchievement = achievementIndicators.some(pattern =>
        pattern.test(sentence)
      );

      if (isAchievement) {
        achievements.push(this.formatAchievement(sentence));
      } else {
        responsibilities.push(this.formatResponsibility(sentence));
      }
    });

    // Remove duplicates and clean up
    return {
      achievements: [...new Set(achievements)].filter(a => a.length > 0),
      responsibilities: [...new Set(responsibilities)].filter(
        r => r.length > 0
      ),
      keyTechnologies: [...new Set(keyTechnologies)].filter(t => t.length > 0),
      impactMetrics: [...new Set(impactMetrics)].filter(m => m.length > 0),
    };
  }

  /**
   * Format achievement sentences for better presentation
   */
  private static formatAchievement(sentence: string): string {
    // Remove common prefixes and make it more action-oriented
    let formatted = sentence
      .replace(
        /^(engineered|developed|architected|built|created|implemented|optimized|improved|streamlined|enhanced|delivered|achieved|increased|reduced|boosted)\s*/gi,
        ''
      )
      .trim();

    // Ensure it starts with a capital letter
    formatted = formatted.charAt(0).toUpperCase() + formatted.slice(1);

    // Add action verb if missing
    if (
      !/^(developed|built|created|implemented|optimized|improved|streamlined|enhanced|delivered|achieved|increased|reduced|boosted)/gi.test(
        formatted
      )
    ) {
      formatted = `Developed ${formatted.toLowerCase()}`;
    }

    return formatted;
  }

  /**
   * Format responsibility sentences
   */
  private static formatResponsibility(sentence: string): string {
    let formatted = sentence.trim();

    // Ensure it starts with a capital letter
    formatted = formatted.charAt(0).toUpperCase() + formatted.slice(1);

    // Add action verb if missing
    if (
      !/^(managed|led|coordinated|collaborated|worked|assisted|supported|maintained|ensured|facilitated)/gi.test(
        formatted
      )
    ) {
      formatted = `Managed ${formatted.toLowerCase()}`;
    }

    return formatted;
  }

  /**
   * Restructure project descriptions
   */
  static restructureProjectDescription(description: string): {
    keyFeatures: string[];
    technologies: string[];
    impact: string[];
  } {
    const sentences = description
      .split(/[.!?]+/)
      .map(s => s.trim())
      .filter(s => s.length > 0);

    const keyFeatures: string[] = [];
    const technologies: string[] = [];
    const impact: string[] = [];

    // Technology extraction patterns
    const techPatterns = [
      /\b(React|Next\.js|Vue\.js|Angular|TypeScript|JavaScript|Node\.js|GraphQL|REST|API|MongoDB|PostgreSQL|MySQL|Redis|Docker|AWS|Vercel|Netlify|Firebase|Supabase)\b/gi,
      /\b(HTML|CSS|SCSS|Tailwind|Bootstrap|Material-UI|Ant Design|Chakra UI)\b/gi,
      /\b(Git|GitHub|GitLab|Bitbucket|Jira|Confluence|Slack|Figma|Adobe|Photoshop|Illustrator)\b/gi,
    ];

    // Impact indicators
    const impactIndicators = [
      /improved|increased|reduced|boosted|enhanced|optimized|streamlined|accelerated|scaled|delivered/gi,
    ];

    sentences.forEach(sentence => {
      // Extract technologies
      techPatterns.forEach(pattern => {
        const matches = sentence.match(pattern);
        if (matches) {
          technologies.push(...matches.map(m => m.trim()));
        }
      });

      // Check for impact
      if (impactIndicators.some(pattern => pattern.test(sentence))) {
        impact.push(sentence.trim());
      } else {
        keyFeatures.push(sentence.trim());
      }
    });

    return {
      keyFeatures: [...new Set(keyFeatures)].filter(f => f.length > 0),
      technologies: [...new Set(technologies)].filter(t => t.length > 0),
      impact: [...new Set(impact)].filter(i => i.length > 0),
    };
  }

  /**
   * Categorize and enhance skills
   */
  static categorizeSkills(skills: {
    technical: string[];
    business: string[];
  }): RestructuredSkills {
    const technicalCategories: SkillCategory[] = [
      {
        category: 'Frontend Development',
        skills: [],
        proficiency: 'Advanced',
      },
      {
        category: 'Backend Development',
        skills: [],
        proficiency: 'Intermediate',
      },
      {
        category: 'Database & Storage',
        skills: [],
        proficiency: 'Intermediate',
      },
      {
        category: 'DevOps & Cloud',
        skills: [],
        proficiency: 'Intermediate',
      },
      {
        category: 'Testing & Quality',
        skills: [],
        proficiency: 'Intermediate',
      },
    ];

    const businessCategories: SkillCategory[] = [
      {
        category: 'Project Management',
        skills: [],
        proficiency: 'Advanced',
      },
      {
        category: 'Communication',
        skills: [],
        proficiency: 'Advanced',
      },
      {
        category: 'Leadership',
        skills: [],
        proficiency: 'Intermediate',
      },
    ];

    const toolsCategories: SkillCategory[] = [
      {
        category: 'Development Tools',
        skills: [],
        proficiency: 'Advanced',
      },
      {
        category: 'Design Tools',
        skills: [],
        proficiency: 'Intermediate',
      },
      {
        category: 'Collaboration Tools',
        skills: [],
        proficiency: 'Advanced',
      },
    ];

    const languagesCategories: SkillCategory[] = [
      {
        category: 'Programming Languages',
        skills: [],
        proficiency: 'Advanced',
      },
      {
        category: 'Markup & Styling',
        skills: [],
        proficiency: 'Expert',
      },
    ];

    // Categorize technical skills
    skills.technical.forEach(skill => {
      const lowerSkill = skill.toLowerCase();

      if (
        [
          'react',
          'vue',
          'angular',
          'next.js',
          'typescript',
          'javascript',
          'html',
          'css',
          'scss',
          'tailwind',
        ].some(tech => lowerSkill.includes(tech))
      ) {
        technicalCategories[0]?.skills.push(skill);
      } else if (
        ['node.js', 'python', 'java', 'c#', 'php', 'ruby', 'go', 'rust'].some(
          tech => lowerSkill.includes(tech)
        )
      ) {
        technicalCategories[1]?.skills.push(skill);
      } else if (
        [
          'mysql',
          'postgresql',
          'mongodb',
          'redis',
          'sqlite',
          'firebase',
          'supabase',
        ].some(tech => lowerSkill.includes(tech))
      ) {
        technicalCategories[2]?.skills.push(skill);
      } else if (
        [
          'aws',
          'azure',
          'gcp',
          'docker',
          'kubernetes',
          'vercel',
          'netlify',
          'heroku',
        ].some(tech => lowerSkill.includes(tech))
      ) {
        technicalCategories[3]?.skills.push(skill);
      } else if (
        ['jest', 'cypress', 'testing', 'qa', 'quality', 'tdd', 'bdd'].some(
          tech => lowerSkill.includes(tech)
        )
      ) {
        technicalCategories[4]?.skills.push(skill);
      } else {
        technicalCategories[0]?.skills.push(skill); // Default to frontend
      }
    });

    // Categorize business skills
    skills.business.forEach(skill => {
      const lowerSkill = skill.toLowerCase();

      if (
        [
          'agile',
          'scrum',
          'kanban',
          'project management',
          'planning',
          'coordination',
        ].some(biz => lowerSkill.includes(biz))
      ) {
        businessCategories[0]?.skills.push(skill);
      } else if (
        [
          'communication',
          'presentation',
          'writing',
          'documentation',
          'training',
        ].some(biz => lowerSkill.includes(biz))
      ) {
        businessCategories[1]?.skills.push(skill);
      } else if (
        ['leadership', 'mentoring', 'team', 'management', 'supervision'].some(
          biz => lowerSkill.includes(biz)
        )
      ) {
        businessCategories[2]?.skills.push(skill);
      } else {
        businessCategories[0]?.skills.push(skill); // Default to project management
      }
    });

    // Filter out empty categories
    const filterEmptyCategories = (categories: SkillCategory[]) =>
      categories.filter(cat => cat.skills.length > 0);

    return {
      technical: filterEmptyCategories(technicalCategories),
      business: filterEmptyCategories(businessCategories),
      tools: filterEmptyCategories(toolsCategories),
      languages: filterEmptyCategories(languagesCategories),
    };
  }

  /**
   * Restructure entire resume data
   */
  static restructureResumeData(data: ResumeData): ResumeData {
    const restructuredData = { ...data };

    // Extract and set job title from first experience if not already set
    if (!restructuredData.personal.jobTitle && data.experience.length > 0) {
      restructuredData.personal.jobTitle = data.experience[0]?.position || '';
    }

    // Restructure experience
    restructuredData.experience = data.experience.map(exp => {
      const restructured = this.restructureExperienceDescription(
        exp.description
      );

      return {
        ...exp,
        achievements: restructured.achievements,
        keyTechnologies: restructured.keyTechnologies,
        impactMetrics: restructured.impactMetrics,
        responsibilities: restructured.responsibilities,
      };
    });

    // Restructure projects
    restructuredData.projects = data.projects.map(project => {
      const restructured = this.restructureProjectDescription(
        project.description
      );

      return {
        ...project,
        keyFeatures: restructured.keyFeatures,
        technologies: restructured.technologies,
        impact: restructured.impact,
      };
    });

    // Restructure skills
    const restructuredSkills = this.categorizeSkills({
      technical: data.skills.technical,
      business: data.skills.business,
    });
    restructuredData.skills = {
      ...data.skills,
      technical: restructuredSkills.technical.flatMap(cat => cat.skills),
      business: restructuredSkills.business.flatMap(cat => cat.skills),
    };

    return restructuredData;
  }

  /**
   * Generate improved summary based on experience and skills
   */
  static generateImprovedSummary(data: ResumeData): string {
    const experience = data.experience;
    const skills = data.skills;

    if (experience.length === 0) {
      return data.summary || '';
    }

    const latestExp = experience[0];
    const yearsOfExperience = this.calculateYearsOfExperience(experience);
    const topSkills = skills.technical.slice(0, 5);
    const primaryRole = latestExp?.position || 'Software Developer';

    return `${primaryRole} with ${formatExperienceYears(yearsOfExperience)} of experience building scalable applications, specializing in ${topSkills.join(', ')}. Proven expertise in ${this.extractKeyAreas(experience).join(', ')} and cross-platform development.`;
  }

  private static calculateYearsOfExperience(
    experience: Array<{
      startDate: string;
      endDate?: string;
      current?: boolean;
    }>
  ): number {
    if (experience.length === 0) return 0;

    try {
      const startDate = new Date(
        experience[experience.length - 1]?.startDate || ''
      );
      const endDate = experience[0]?.current
        ? new Date()
        : new Date(experience[0]?.endDate || '');

      const years = Math.floor(
        (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24 * 365)
      );
      return Math.max(1, years); // Ensure at least 1 year
    } catch (_error) {
      // Error calculating years of experience
      return 3; // Default fallback
    }
  }

  private static extractKeyAreas(
    experience: Array<{ description: string }>
  ): string[] {
    const areas = new Set<string>();

    experience.forEach(exp => {
      const description = exp.description.toLowerCase();

      if (
        description.includes('e-commerce') ||
        description.includes('ecommerce')
      )
        areas.add('e-commerce platforms');
      if (description.includes('api') || description.includes('integration'))
        areas.add('API integrations');
      if (
        description.includes('performance') ||
        description.includes('optimization')
      )
        areas.add('performance optimization');
      if (description.includes('mobile') || description.includes('responsive'))
        areas.add('mobile development');
      if (description.includes('cms') || description.includes('content'))
        areas.add('content management');
      if (description.includes('ui') || description.includes('ux'))
        areas.add('UI/UX development');
    });

    return Array.from(areas).slice(0, 3);
  }
}
