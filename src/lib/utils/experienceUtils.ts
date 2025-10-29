/**
 * Utility functions for formatting work experience
 */

import { removeDuplicateContent } from './dataCleaningUtils';

/**
 * Formats experience years to show months for values less than 1 year
 * @param years - The experience in years (can be decimal)
 * @returns Formatted string (e.g., "0.8 years" → "10 months", "2.5 years" → "2.5 years")
 */
export function formatExperienceYears(years: number): string {
  if (years < 1) {
    const months = Math.round(years * 12);
    return months === 1 ? '1 month' : `${months} months`;
  }

  // For 1+ years, show with 1 decimal place if it's not a whole number
  if (years % 1 === 0) {
    return `${Math.floor(years)} year${Math.floor(years) === 1 ? '' : 's'}`;
  }

  return `${years.toFixed(1)} years`;
}

/**
 * Formats experience for display in UI components
 * @param years - The experience in years (can be decimal)
 * @returns Formatted string optimized for UI display
 */
export function formatExperienceForDisplay(years: number): string {
  if (years < 1) {
    const months = Math.round(years * 12);
    return `${months}m`;
  }

  if (years % 1 === 0) {
    return `${Math.floor(years)}y`;
  }

  return `${years.toFixed(1)}y`;
}

/**
 * Calculates total experience from work experience entries
 * @param experiences - Array of work experience entries
 * @returns Total experience in years (decimal)
 */
export function calculateTotalExperience(
  experiences: Array<{
    startDate: string;
    endDate?: string;
    current?: boolean;
  }>
): number {
  if (experiences.length === 0) return 0;

  try {
    // Sort experiences by start date (oldest first)
    const sortedExperiences = [...experiences].sort(
      (a, b) =>
        new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
    );

    const startDate = new Date(sortedExperiences[0]?.startDate || '');
    const endDate = sortedExperiences[sortedExperiences.length - 1]?.current
      ? new Date()
      : new Date(
          sortedExperiences[sortedExperiences.length - 1]?.endDate || ''
        );

    // Check if dates are valid
    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      return 0;
    }

    const years =
      (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24 * 365);
    return Math.max(0, years); // Return 0 instead of negative values
  } catch (_error) {
    return 0; // Return 0 on error instead of fallback
  }
}

/**
 * Standardize experience content for consistent display across components
 */
export function standardizeExperienceContent(experience: {
  description?: string;
  achievements?: string[];
  responsibilities?: string[];
  keyTechnologies?: string[];
}): {
  description: string;
  achievements: string[];
  responsibilities: string[];
  keyTechnologies: string[];
} {
  // Clean and deduplicate content
  const cleanedAchievements = removeDuplicateContent(
    experience.achievements || []
  );
  const cleanedResponsibilities = removeDuplicateContent(
    experience.responsibilities || []
  );
  const cleanedTechnologies = removeDuplicateContent(
    experience.keyTechnologies || []
  );

  // Remove duplicates between achievements and responsibilities
  const allContent = [...cleanedAchievements, ...cleanedResponsibilities];
  const uniqueContent = removeDuplicateContent(allContent);

  // Split back into achievements and responsibilities based on content type
  const finalAchievements = uniqueContent.filter(item =>
    isAchievementContent(item)
  );
  const finalResponsibilities = uniqueContent.filter(
    item => !isAchievementContent(item)
  );

  // Clean description
  const cleanedDescription = (experience.description || '').trim();

  return {
    description: cleanedDescription,
    achievements: finalAchievements,
    responsibilities: finalResponsibilities,
    keyTechnologies: cleanedTechnologies,
  };
}

/**
 * Determine if content is an achievement vs responsibility
 */
function isAchievementContent(content: string): boolean {
  const achievementKeywords = [
    'achieved',
    'improved',
    'increased',
    'decreased',
    'reduced',
    'enhanced',
    'optimized',
    'streamlined',
    'delivered',
    'completed',
    'successfully',
    'awarded',
    'recognized',
    'exceeded',
    'surpassed',
    'led to',
    'resulted in',
    'contributed to',
    'enabled',
    'facilitated',
    'drove',
    'generated',
    'saved',
    'earned',
    'won',
    'ranked',
    'scored',
    'measured',
    'metric',
    '200+',
    '100+',
    '60%',
    '40%',
    '25%',
    '30%', // Quantifiable results
  ];

  const normalizedContent = content.toLowerCase();
  return achievementKeywords.some(keyword =>
    normalizedContent.includes(keyword)
  );
}
