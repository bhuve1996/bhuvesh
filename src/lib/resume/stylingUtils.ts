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
    const colors = styling.colors as Record<string, string>;
    variables[`--${sectionId}-primary-color`] = colors.primary || '#000000';
    variables[`--${sectionId}-secondary-color`] = colors.secondary || '#666666';
    variables[`--${sectionId}-accent-color`] = colors.accent || '#007bff';
    variables[`--${sectionId}-text-color`] = colors.text || '#000000';
    variables[`--${sectionId}-background-color`] =
      colors.background || '#ffffff';
    variables[`--${sectionId}-border-color`] = colors.border || '#cccccc';
    if (colors.hover) {
      variables[`--${sectionId}-hover-color`] = colors.hover;
    }
    if (colors.active) {
      variables[`--${sectionId}-active-color`] = colors.active;
    }
  }

  // Typography variables - handle nested structure recursively
  const processTypographyObject = (
    obj: Record<string, unknown>,
    prefix: string = ''
  ) => {
    Object.entries(obj).forEach(([key, value]) => {
      if (typeof value === 'object' && value !== null) {
        // Check if this is a typography object (has fontFamily, fontSize, etc.)
        if (
          'fontFamily' in value ||
          'fontSize' in value ||
          'fontWeight' in value
        ) {
          const varPrefix = prefix ? `${prefix}-${key}` : key;
          const typoValue = value as Record<string, unknown>;
          variables[`--${sectionId}-${varPrefix}-font-family`] =
            (typoValue.fontFamily as string) || 'Arial';
          variables[`--${sectionId}-${varPrefix}-font-size`] =
            (typoValue.fontSize as string) || '14px';
          if (typoValue.fontWeight) {
            variables[`--${sectionId}-${varPrefix}-font-weight`] =
              typoValue.fontWeight.toString();
          }
          if (typoValue.lineHeight) {
            variables[`--${sectionId}-${varPrefix}-line-height`] =
              typoValue.lineHeight.toString();
          }
          if (typoValue.letterSpacing) {
            variables[`--${sectionId}-${varPrefix}-letter-spacing`] =
              typoValue.letterSpacing as string;
          }
          if (typoValue.textTransform) {
            variables[`--${sectionId}-${varPrefix}-text-transform`] =
              typoValue.textTransform as string;
          }
          if (typoValue.textDecoration) {
            variables[`--${sectionId}-${varPrefix}-text-decoration`] =
              typoValue.textDecoration as string;
          }
        } else {
          // Recursively process nested objects
          const newPrefix = prefix ? `${prefix}-${key}` : key;
          processTypographyObject(value as Record<string, unknown>, newPrefix);
        }
      }
    });
  };

  // Process the styling object for typography
  processTypographyObject(styling as Record<string, unknown>);

  // Border and background variables - handle nested structure
  const processBorderBackgroundObject = (
    obj: Record<string, unknown>,
    prefix: string = ''
  ) => {
    Object.entries(obj).forEach(([key, value]) => {
      if (typeof value === 'object' && value !== null) {
        // Check if this is a border object
        if ('width' in value && 'style' in value && 'color' in value) {
          // Special case: if this is container.border, generate top-level variables
          if (prefix === 'container' && key === 'border') {
            const borderValue = value as Record<string, unknown>;
            variables[`--${sectionId}-border-width`] =
              (borderValue.width as string) || '0';
            variables[`--${sectionId}-border-style`] =
              (borderValue.style as string) || 'none';
            variables[`--${sectionId}-border-color`] =
              (borderValue.color as string) || 'transparent';
            if (borderValue.radius) {
              variables[`--${sectionId}-border-radius`] =
                borderValue.radius as string;
            }
          } else {
            const varPrefix = prefix ? `${prefix}-${key}` : key;
            const borderValue = value as Record<string, unknown>;
            variables[`--${sectionId}-${varPrefix}-border-width`] =
              (borderValue.width as string) || '0';
            variables[`--${sectionId}-${varPrefix}-border-style`] =
              (borderValue.style as string) || 'none';
            variables[`--${sectionId}-${varPrefix}-border-color`] =
              (borderValue.color as string) || 'transparent';
            if (borderValue.radius) {
              variables[`--${sectionId}-${varPrefix}-border-radius`] =
                borderValue.radius as string;
            }
          }
        }
        // Check if this is a background object
        else if ('color' in value && !('width' in value)) {
          // Special case: if this is container.background, generate top-level variables
          if (prefix === 'container' && key === 'background') {
            const bgValue = value as Record<string, unknown>;
            variables[`--${sectionId}-background-color`] =
              (bgValue.color as string) || 'transparent';
          } else {
            const varPrefix = prefix ? `${prefix}-${key}` : key;
            const bgValue = value as Record<string, unknown>;
            variables[`--${sectionId}-${varPrefix}-background-color`] =
              (bgValue.color as string) || 'transparent';
          }
        }
        // Recursively process nested objects
        else {
          const newPrefix = prefix ? `${prefix}-${key}` : key;
          processBorderBackgroundObject(
            value as Record<string, unknown>,
            newPrefix
          );
        }
      }
    });
  };

  // Process the styling object for border and background
  processBorderBackgroundObject(styling as Record<string, unknown>);

  // Spacing variables - handle both direct spacing and nested container.spacing
  let spacingData: Record<string, string> | null = null;

  if ('spacing' in styling) {
    spacingData = styling.spacing as Record<string, string>;
  } else if (
    'container' in styling &&
    typeof styling.container === 'object' &&
    styling.container !== null &&
    'spacing' in styling.container
  ) {
    spacingData = (
      styling.container as unknown as { spacing: Record<string, string> }
    ).spacing;
  }

  if (spacingData) {
    variables[`--${sectionId}-margin`] = spacingData.margin || '0';
    variables[`--${sectionId}-padding`] = spacingData.padding || '0';
    variables[`--${sectionId}-gap`] = spacingData.gap || '0';
  }

  // Border variables
  if ('border' in styling) {
    const border = styling.border as Record<string, string>;
    variables[`--${sectionId}-border-width`] = border.width || '1px';
    variables[`--${sectionId}-border-style`] = border.style || 'solid';
    variables[`--${sectionId}-border-color`] = border.color || '#cccccc';
    variables[`--${sectionId}-border-radius`] = border.radius || '0';
  }

  // Background variables
  if ('background' in styling) {
    const background = styling.background as Record<string, string>;
    variables[`--${sectionId}-background-color`] =
      background.color || '#ffffff';
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
    const shadow = styling.shadow as Record<string, string>;
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
    const container = styling.container as {
      display: string;
      flexDirection?: string;
      justifyContent?: string;
      alignItems?: string;
      spacing: SpacingStyle;
      border?: BorderStyle;
      background?: BackgroundStyle;
      shadow?: ShadowStyle;
    };
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

  // Generate typography styles - handle nested structure recursively
  const processTypographyCSS = (
    obj: Record<string, unknown>,
    prefix: string = ''
  ) => {
    Object.entries(obj).forEach(([key, value]) => {
      if (typeof value === 'object' && value !== null) {
        // Check if this is a typography object (has fontFamily, fontSize, etc.)
        if (
          'fontFamily' in value ||
          'fontSize' in value ||
          'fontWeight' in value
        ) {
          const typographyCSS = typographyToCSS(
            value as unknown as TypographyStyle
          );
          const typographyDeclarations = Object.entries(typographyCSS)
            .map(([cssKey, cssValue]) => `  ${cssKey}: ${cssValue};`)
            .join('\n');

          const className = prefix ? `${prefix}-${key}` : key;
          css.push(
            `.${sectionId}__${className} {\n${typographyDeclarations}\n}`
          );
        } else {
          // Recursively process nested objects
          const newPrefix = prefix ? `${prefix}-${key}` : key;
          processTypographyCSS(value as Record<string, unknown>, newPrefix);
        }
      }
    });
  };

  // Process the styling object for typography CSS
  processTypographyCSS(styling as Record<string, unknown>);

  // Generate specific element styles for complex sections
  if (sectionId === 'skills' && 'container' in styling) {
    const container = styling.container as {
      display: string;
      flexDirection?: string;
      justifyContent?: string;
      alignItems?: string;
      spacing: SpacingStyle;
      border?: BorderStyle;
      background?: BackgroundStyle;
      shadow?: ShadowStyle;
    };
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
    const container = styling.container as {
      display: string;
      flexDirection?: string;
      justifyContent?: string;
      alignItems?: string;
      spacing: SpacingStyle;
      border?: BorderStyle;
      background?: BackgroundStyle;
      shadow?: ShadowStyle;
    };
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
    const positioningCSS = positioningToCSS(
      styling as unknown as {
        position: string;
        top?: string;
        right?: string;
        bottom?: string;
        left?: string;
        zIndex?: number;
      }
    );
    Object.entries(positioningCSS).forEach(([key, value]) => {
      element.style.setProperty(key, value);
    });
  }

  // Apply sizing if available
  if ('width' in styling && 'height' in styling) {
    const sizingCSS = sizingToCSS(
      styling as unknown as {
        width: string;
        height: string;
        minWidth?: string;
        maxWidth?: string;
        minHeight?: string;
        maxHeight?: string;
      }
    );
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
