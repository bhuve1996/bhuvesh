import { modernTemplates } from '@/lib/resume/templates';

import {
  getContrastRatioString,
  getWCAGLevel,
  validateColorScheme,
} from './contrastUtils';

// Validate all templates and provide recommendations
export function validateAllTemplates() {
  const results = modernTemplates.map(template => {
    const validation = validateColorScheme(template.layout.colors);

    // Get specific contrast ratios
    const textOnBackground = getContrastRatioString(
      template.layout.colors.text,
      template.layout.colors.background
    );

    const primaryOnBackground = getContrastRatioString(
      template.layout.colors.primary,
      template.layout.colors.background
    );

    const sidebarTextOnSidebar =
      template.layout.colors.sidebar && template.layout.colors.sidebarText
        ? getContrastRatioString(
            template.layout.colors.sidebarText,
            template.layout.colors.sidebar
          )
        : 'N/A';

    return {
      template: template.name,
      id: template.id,
      isValid: validation.isValid,
      issues: validation.issues,
      suggestions: validation.suggestions,
      contrastRatios: {
        textOnBackground,
        primaryOnBackground,
        sidebarTextOnSidebar,
      },
      wcagLevels: {
        textOnBackground: getWCAGLevel(
          template.layout.colors.text,
          template.layout.colors.background
        ),
        primaryOnBackground: getWCAGLevel(
          template.layout.colors.primary,
          template.layout.colors.background
        ),
        sidebarTextOnSidebar:
          template.layout.colors.sidebar && template.layout.colors.sidebarText
            ? getWCAGLevel(
                template.layout.colors.sidebarText,
                template.layout.colors.sidebar
              )
            : 'N/A',
      },
    };
  });

  return results;
}

// Get improved color schemes for templates with poor contrast
export function getImprovedColorSchemes() {
  const validatedTemplates = validateAllTemplates();

  return validatedTemplates.map(result => {
    if (result.isValid) {
      return { template: result.template, needsImprovement: false };
    }

    // Generate improved color scheme
    const improvedColors = {
      // Ensure high contrast text
      text:
        result.wcagLevels.textOnBackground === 'Fail' ? '#1a1a1a' : undefined,

      // Ensure high contrast primary color
      primary:
        result.wcagLevels.primaryOnBackground === 'Fail'
          ? '#1e40af'
          : undefined,

      // Ensure high contrast accent color
      accent: '#3b82f6', // Good contrast blue

      // Keep background white for best contrast
      background: '#ffffff',

      // Ensure sidebar has good contrast
      sidebar:
        result.wcagLevels.sidebarTextOnSidebar === 'Fail'
          ? '#1e40af'
          : undefined,
      sidebarText: '#ffffff',

      // Neutral colors
      secondary: '#64748b',
      card: '#ffffff',
      border: '#e2e8f0',
    };

    return {
      template: result.template,
      id: result.id,
      needsImprovement: true,
      originalIssues: result.issues,
      improvedColors: Object.fromEntries(
        Object.entries(improvedColors).filter(
          ([_, value]) => value !== undefined
        )
      ),
    };
  });
}

// Print validation results (for debugging)
export function printValidationResults() {
  const results = validateAllTemplates();

  // console.log('\n=== TEMPLATE CONTRAST VALIDATION RESULTS ===\n');

  results.forEach(result => {
    // console.log(`📄 ${result.template}`);
    // console.log(`   Valid: ${result.isValid ? '✅' : '❌'}`);
    // console.log(
    //   `   Text on Background: ${result.contrastRatios.textOnBackground} (${result.wcagLevels.textOnBackground})`
    // );
    // console.log(
    //   `   Primary on Background: ${result.contrastRatios.primaryOnBackground} (${result.wcagLevels.primaryOnBackground})`
    // );
    // console.log(
    //   `   Sidebar Text on Sidebar: ${result.contrastRatios.sidebarTextOnSidebar} (${result.wcagLevels.sidebarTextOnSidebar})`
    // );

    if (!result.isValid) {
      // console.log(`   Issues:`);
      result.issues.forEach(_issue => {
        // console.log(`     - ${issue}`);
      });
    }
    // console.log('');
  });
}
