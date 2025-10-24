import {
  BackgroundStyle,
  BorderStyle,
  ResumeStylingState,
  ShadowStyle,
  SpacingStyle,
  TypographyStyle,
} from '@/store/resumeStylingStore';

/**
 * Comprehensive styling utilities for resume templates
 * Converts centralized styling state to CSS properties
 */

/**
 * Convert typography style to CSS properties
 */
export const typographyToCSS = (
  typography: TypographyStyle
): Record<string, string> => {
  return {
    fontFamily: typography.fontFamily,
    fontSize: typography.fontSize,
    fontWeight: typography.fontWeight.toString(),
    lineHeight: typography.lineHeight.toString(),
    ...(typography.letterSpacing && {
      letterSpacing: typography.letterSpacing,
    }),
    ...(typography.textTransform && {
      textTransform: typography.textTransform,
    }),
    ...(typography.textDecoration && {
      textDecoration: typography.textDecoration,
    }),
  };
};

/**
 * Convert spacing style to CSS properties
 */
export const spacingToCSS = (spacing: SpacingStyle): Record<string, string> => {
  return {
    margin: spacing.margin,
    padding: spacing.padding,
    gap: spacing.gap,
  };
};

/**
 * Convert border style to CSS properties
 */
export const borderToCSS = (border: BorderStyle): Record<string, string> => {
  return {
    borderWidth: border.width,
    borderStyle: border.style,
    borderColor: border.color,
    borderRadius: border.radius,
  };
};

/**
 * Convert background style to CSS properties
 */
export const backgroundToCSS = (
  background: BackgroundStyle
): Record<string, string> => {
  const css: Record<string, string> = {
    backgroundColor: background.color,
  };

  if (background.image) {
    css.backgroundImage = `url(${background.image})`;
  }
  if (background.position) {
    css.backgroundPosition = background.position;
  }
  if (background.repeat) {
    css.backgroundRepeat = background.repeat;
  }
  if (background.size) {
    css.backgroundSize = background.size;
  }

  return css;
};

/**
 * Convert shadow style to CSS properties
 */
export const shadowToCSS = (shadow: ShadowStyle): Record<string, string> => {
  return {
    boxShadow: `${shadow.offsetX} ${shadow.offsetY} ${shadow.blur} ${shadow.spread} ${shadow.color}`,
  };
};

/**
 * Convert layout properties to CSS
 */
export const layoutToCSS = (layout: {
  display: string;
  flexDirection?: string;
  justifyContent?: string;
  alignItems?: string;
  gridTemplateColumns?: string;
  gridTemplateRows?: string;
  gridGap?: string;
}): Record<string, string> => {
  const css: Record<string, string> = {
    display: layout.display,
  };

  if (layout.flexDirection) {
    css.flexDirection = layout.flexDirection;
  }
  if (layout.justifyContent) {
    css.justifyContent = layout.justifyContent;
  }
  if (layout.alignItems) {
    css.alignItems = layout.alignItems;
  }
  if (layout.gridTemplateColumns) {
    css.gridTemplateColumns = layout.gridTemplateColumns;
  }
  if (layout.gridTemplateRows) {
    css.gridTemplateRows = layout.gridTemplateRows;
  }
  if (layout.gridGap) {
    css.gridGap = layout.gridGap;
  }

  return css;
};

/**
 * Convert positioning properties to CSS
 */
export const positioningToCSS = (positioning: {
  position: string;
  top?: string;
  right?: string;
  bottom?: string;
  left?: string;
  zIndex?: number;
}): Record<string, string> => {
  const css: Record<string, string> = {
    position: positioning.position,
  };

  if (positioning.top !== undefined) {
    css.top = positioning.top;
  }
  if (positioning.right !== undefined) {
    css.right = positioning.right;
  }
  if (positioning.bottom !== undefined) {
    css.bottom = positioning.bottom;
  }
  if (positioning.left !== undefined) {
    css.left = positioning.left;
  }
  if (positioning.zIndex !== undefined) {
    css.zIndex = positioning.zIndex.toString();
  }

  return css;
};

/**
 * Convert sizing properties to CSS
 */
export const sizingToCSS = (sizing: {
  width: string;
  height: string;
  minWidth?: string;
  minHeight?: string;
  maxWidth?: string;
  maxHeight?: string;
}): Record<string, string> => {
  const css: Record<string, string> = {
    width: sizing.width,
    height: sizing.height,
  };

  if (sizing.minWidth) {
    css.minWidth = sizing.minWidth;
  }
  if (sizing.minHeight) {
    css.minHeight = sizing.minHeight;
  }
  if (sizing.maxWidth) {
    css.maxWidth = sizing.maxWidth;
  }
  if (sizing.maxHeight) {
    css.maxHeight = sizing.maxHeight;
  }

  return css;
};

/**
 * Generate CSS custom properties for a section
 */
export const generateSectionCSSVariables = (
  sectionId: string,
  styling: ResumeStylingState['sections'][keyof ResumeStylingState['sections']]
): Record<string, string> => {
  const variables: Record<string, string> = {};

  // Color variables
  if ('colors' in styling) {
    const colors = styling.colors as any;
    variables[`--${sectionId}-primary-color`] = colors.primary || '#000000';
    variables[`--${sectionId}-secondary-color`] = colors.secondary || '#666666';
    variables[`--${sectionId}-accent-color`] = colors.accent || '#007bff';
    variables[`--${sectionId}-text-color`] = colors.text || '#000000';
    variables[`--${sectionId}-background-color`] = colors.background || '#ffffff';
    variables[`--${sectionId}-border-color`] = colors.border || '#cccccc';
    if (colors.hover) {
      variables[`--${sectionId}-hover-color`] = colors.hover;
    }
    if (colors.active) {
      variables[`--${sectionId}-active-color`] = colors.active;
    }
  }

  // Typography variables
  if ('typography' in styling) {
    const typography = styling.typography as any;
    Object.entries(typography).forEach(([key, typo]: [string, any]) => {
      variables[`--${sectionId}-${key}-font-family`] = typo.fontFamily || 'Arial';
      variables[`--${sectionId}-${key}-font-size`] = typo.fontSize || '14px';
      if (typo.fontWeight) {
        variables[`--${sectionId}-${key}-font-weight`] = typo.fontWeight.toString();
      }
      if (typo.lineHeight) {
        variables[`--${sectionId}-${key}-line-height`] = typo.lineHeight.toString();
      }
      if (typo.letterSpacing) {
        variables[`--${sectionId}-${key}-letter-spacing`] = typo.letterSpacing;
      }
      if (typo.textTransform) {
        variables[`--${sectionId}-${key}-text-transform`] = typo.textTransform;
      }
      if (typo.textDecoration) {
        variables[`--${sectionId}-${key}-text-decoration`] = typo.textDecoration;
      }
    });
  }

  // Spacing variables
  if ('spacing' in styling) {
    const spacing = styling.spacing as any;
    variables[`--${sectionId}-margin`] = spacing.margin || '0';
    variables[`--${sectionId}-padding`] = spacing.padding || '0';
    variables[`--${sectionId}-gap`] = spacing.gap || '0';
  }

  // Border variables
  if ('border' in styling) {
    const border = styling.border as any;
    variables[`--${sectionId}-border-width`] = border.width || '1px';
    variables[`--${sectionId}-border-style`] = border.style || 'solid';
    variables[`--${sectionId}-border-color`] = border.color || '#cccccc';
    variables[`--${sectionId}-border-radius`] = border.radius || '0';
  }

  // Background variables
  if ('background' in styling) {
    const background = styling.background as any;
    variables[`--${sectionId}-background-color`] = background.color || '#ffffff';
    if (background.image) {
      variables[`--${sectionId}-background-image`] = `url(${background.image})`;
    }
    if (background.position) {
      variables[`--${sectionId}-background-position`] = background.position;
    }
    if (background.repeat) {
      variables[`--${sectionId}-background-repeat`] = background.repeat;
    }
    if (background.size) {
      variables[`--${sectionId}-background-size`] = background.size;
    }
  }

  // Shadow variables
  if ('shadow' in styling) {
    const shadow = styling.shadow as any;
    variables[`--${sectionId}-shadow`] =
      `${shadow.offsetX || 0} ${shadow.offsetY || 0} ${shadow.blur || 0} ${shadow.spread || 0} ${shadow.color || '#000000'}`;
  }

  return variables;
};

/**
 * Generate complete CSS for a section
 */
export const generateSectionCSS = (
  sectionId: string,
  styling: ResumeStylingState['sections'][keyof ResumeStylingState['sections']]
): string => {
  const css: string[] = [];

  // Generate CSS variables
  const variables = generateSectionCSSVariables(sectionId, styling);
  const variableDeclarations = Object.entries(variables)
    .map(([key, value]) => `  ${key}: ${value};`)
    .join('\n');

  css.push(`.${sectionId} {\n${variableDeclarations}\n}`);

  // Generate specific element styles
  if ('container' in styling) {
    const container = styling.container as any;
    const containerCSS = {
      ...layoutToCSS(container),
      ...spacingToCSS(container.spacing),
      ...(container.border ? borderToCSS(container.border) : {}),
      ...(container.background ? backgroundToCSS(container.background) : {}),
      ...(container.shadow ? shadowToCSS(container.shadow) : {}),
    };

    const containerDeclarations = Object.entries(containerCSS)
      .map(([key, value]) => `  ${key}: ${value};`)
      .join('\n');

    css.push(`.${sectionId}__container {\n${containerDeclarations}\n}`);
  }

  // Generate typography styles
  if ('typography' in styling) {
    const typography = styling.typography as any;
    Object.entries(typography).forEach(([key, typo]: [string, any]) => {
      const typographyCSS = typographyToCSS(typo);
      const typographyDeclarations = Object.entries(typographyCSS)
        .map(([key, value]) => `  ${key}: ${value};`)
        .join('\n');

      css.push(`.${sectionId}__${key} {\n${typographyDeclarations}\n}`);
    });
  }

  // Generate specific element styles for complex sections
  if (sectionId === 'skills' && 'container' in styling) {
    const container = styling.container as any;
    const skillContainerCSS = {
      ...layoutToCSS(container),
      ...spacingToCSS(container.spacing),
      ...(container.border ? borderToCSS(container.border) : {}),
      ...(container.background ? backgroundToCSS(container.background) : {}),
      ...(container.shadow ? shadowToCSS(container.shadow) : {}),
    };

    const skillContainerDeclarations = Object.entries(skillContainerCSS)
      .map(([key, value]) => `  ${key}: ${value};`)
      .join('\n');

    css.push(`.${sectionId}__skill {\n${skillContainerDeclarations}\n}`);

    if ('text' in styling) {
      const textCSS = typographyToCSS(styling.text);
      const textDeclarations = Object.entries(textCSS)
        .map(([key, value]) => `  ${key}: ${value};`)
        .join('\n');

      css.push(`.${sectionId}__skill-text {\n${textDeclarations}\n}`);
    }

    if ('badge' in styling) {
      const badgeCSS = {
        ...layoutToCSS(styling.badge),
        ...spacingToCSS(styling.badge.spacing),
        ...borderToCSS(styling.badge.border),
        ...backgroundToCSS(styling.badge.background),
        ...shadowToCSS(styling.badge.shadow),
        ...typographyToCSS(styling.badge.typography),
      };

      const badgeDeclarations = Object.entries(badgeCSS)
        .map(([key, value]) => `  ${key}: ${value};`)
        .join('\n');

      css.push(`.${sectionId}__badge {\n${badgeDeclarations}\n}`);
    }
  }

  return css.join('\n\n');
};

/**
 * Generate print-specific CSS
 */
export const generatePrintCSS = (styling: ResumeStylingState): string => {
  const css: string[] = [];

  css.push('@media print {');
  css.push('  * {');
  css.push('    color-adjust: exact !important;');
  css.push('    -webkit-print-color-adjust: exact !important;');
  css.push('    print-color-adjust: exact !important;');
  css.push('  }');

  css.push('  body {');
  css.push(`    width: ${styling.global.page.width} !important;`);
  css.push(`    height: ${styling.global.page.height} !important;`);
  css.push(`    margin: ${styling.global.page.margin} !important;`);
  css.push(`    padding: ${styling.global.page.padding} !important;`);
  css.push(
    `    background: ${styling.global.page.background.color} !important;`
  );
  css.push('    font-family: Arial, sans-serif !important;');
  css.push('    font-size: 12pt !important;');
  css.push('    line-height: 1.4 !important;');
  css.push('    color: black !important;');
  css.push('  }');

  css.push('  .resume-template,');
  css.push('  .template-preview,');
  css.push('  .template-preview-container {');
  css.push('    width: 100% !important;');
  css.push('    max-width: none !important;');
  css.push('    margin: 0 !important;');
  css.push('    padding: 0.5in !important;');
  css.push('    box-shadow: none !important;');
  css.push('    border: none !important;');
  css.push('    background: white !important;');
  css.push('    color: black !important;');
  css.push('    transform: none !important;');
  css.push('    scale: none !important;');
  css.push('  }');

  css.push('  button, input, select, textarea {');
  css.push('    display: none !important;');
  css.push('  }');

  css.push('  .page-break {');
  css.push('    page-break-before: always;');
  css.push('  }');

  css.push('  @page {');
  css.push('    size: A4;');
  css.push('    margin: 0.5in;');
  css.push('  }');

  css.push('}');

  return css.join('\n');
};

/**
 * Apply styling to a DOM element
 */
export const applyStylingToElement = (
  element: HTMLElement,
  sectionId: string,
  styling: ResumeStylingState['sections'][keyof ResumeStylingState['sections']]
): void => {
  // Apply CSS variables
  const variables = generateSectionCSSVariables(sectionId, styling);
  Object.entries(variables).forEach(([key, value]) => {
    element.style.setProperty(key, value);
  });

  // Apply container styles if available
  if ('container' in styling) {
    const container = styling.container as any;
    const containerCSS = {
      ...layoutToCSS(container),
      ...spacingToCSS(container.spacing),
      ...(container.border ? borderToCSS(container.border) : {}),
      ...(container.background ? backgroundToCSS(container.background) : {}),
      ...(container.shadow ? shadowToCSS(container.shadow) : {}),
    };

    Object.entries(containerCSS).forEach(([key, value]) => {
      element.style.setProperty(key, value);
    });
  }

  // Apply positioning if available
  if ('position' in styling) {
    const positioningCSS = positioningToCSS(styling as any);
    Object.entries(positioningCSS).forEach(([key, value]) => {
      element.style.setProperty(key, value);
    });
  }

  // Apply sizing if available
  if ('width' in styling && 'height' in styling) {
    const sizingCSS = sizingToCSS(styling as any);
    Object.entries(sizingCSS).forEach(([key, value]) => {
      element.style.setProperty(key, value);
    });
  }
};

/**
 * Generate complete CSS for all sections
 */
export const generateCompleteCSS = (styling: ResumeStylingState): string => {
  const css: string[] = [];

  // Add global styles
  css.push('/* Global Styles */');
  css.push(`:root {`);
  Object.entries(styling.global.colors.primary).forEach(([key, value]) => {
    css.push(`  --primary-${key}: ${value};`);
  });
  Object.entries(styling.global.colors.secondary).forEach(([key, value]) => {
    css.push(`  --secondary-${key}: ${value};`);
  });
  Object.entries(styling.global.colors.neutral).forEach(([key, value]) => {
    css.push(`  --neutral-${key}: ${value};`);
  });
  Object.entries(styling.global.typography.scale).forEach(([key, value]) => {
    css.push(`  --text-${key}: ${value};`);
  });
  Object.entries(styling.global.spacing).forEach(([key, value]) => {
    css.push(`  --spacing-${key}: ${value};`);
  });
  css.push('}');

  // Add section styles
  Object.entries(styling.sections).forEach(([sectionId, sectionStyling]) => {
    css.push(`\n/* ${sectionId} Section */`);
    css.push(generateSectionCSS(sectionId, sectionStyling));
  });

  // Add print styles
  css.push('\n/* Print Styles */');
  css.push(generatePrintCSS(styling));

  return css.join('\n');
};
