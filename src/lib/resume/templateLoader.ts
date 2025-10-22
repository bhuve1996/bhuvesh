import { ResumeTemplate } from '@/types/resume';

// Template metadata for loading
const TEMPLATE_PATHS = [
  'tech/software-engineer-ats.json',
  'tech/software-engineer-modern.json',
  'business/executive-classic.json',
  'creative/designer-portfolio.json',
];

/**
 * Load a single template by ID
 */
export async function loadTemplate(
  templateId: string
): Promise<ResumeTemplate | null> {
  try {
    // Find the template path by matching the template ID
    const templatePath = TEMPLATE_PATHS.find(path => {
      // Convert path to template ID format for comparison
      const pathId = path.replace('.json', '').replace('/', '-');
      return pathId === templateId;
    });

    if (!templatePath) {
      // Template not found
      return null;
    }

    const response = await fetch(`/resume-templates/${templatePath}`);
    if (!response.ok) {
      throw new Error(`Failed to load template: ${response.statusText}`);
    }

    const template: ResumeTemplate = await response.json();
    return template;
  } catch {
    // Error loading template
    return null;
  }
}

/**
 * Load all available templates
 */
export async function loadAllTemplates(): Promise<ResumeTemplate[]> {
  const templates: ResumeTemplate[] = [];

  for (const templatePath of TEMPLATE_PATHS) {
    try {
      const response = await fetch(`/resume-templates/${templatePath}`);
      if (response.ok) {
        const template: ResumeTemplate = await response.json();
        // Ensure the template ID matches the path format
        const templateId = templatePath.replace('.json', '').replace('/', '-');
        templates.push({
          ...template,
          id: templateId,
        });
      }
    } catch {
      // Error loading template
    }
  }

  return templates;
}

/**
 * Get templates by category
 */
export async function getTemplatesByCategory(
  category: string
): Promise<ResumeTemplate[]> {
  const allTemplates = await loadAllTemplates();
  return allTemplates.filter(template => template.category === category);
}

/**
 * Get templates by experience level
 */
export async function getTemplatesByExperienceLevel(
  level: string
): Promise<ResumeTemplate[]> {
  const allTemplates = await loadAllTemplates();
  return allTemplates.filter(template => template.experienceLevel === level);
}

/**
 * Get templates by style
 */
export async function getTemplatesByStyle(
  style: string
): Promise<ResumeTemplate[]> {
  const allTemplates = await loadAllTemplates();
  return allTemplates.filter(template => template.style === style);
}

/**
 * Search templates by name or description
 */
export async function searchTemplates(
  query: string
): Promise<ResumeTemplate[]> {
  const allTemplates = await loadAllTemplates();
  const lowercaseQuery = query.toLowerCase();

  return allTemplates.filter(
    template =>
      template.name.toLowerCase().includes(lowercaseQuery) ||
      template.description.toLowerCase().includes(lowercaseQuery)
  );
}

/**
 * Get template categories
 */
export function getTemplateCategories(): string[] {
  return ['tech', 'business', 'creative', 'healthcare', 'education', 'general'];
}

/**
 * Get experience levels
 */
export function getExperienceLevels(): string[] {
  return ['entry', 'mid', 'senior', 'executive'];
}

/**
 * Get template styles
 */
export function getTemplateStyles(): string[] {
  return ['modern', 'classic', 'creative', 'ats-optimized'];
}
