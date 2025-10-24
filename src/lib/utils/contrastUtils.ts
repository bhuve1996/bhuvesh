import { ContrastChecker } from 'color-contrast-checker';

import { ColorScheme } from '@/types/resume';

// Convert hex color to RGB
function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  // Handle empty or invalid input
  if (!hex || typeof hex !== 'string') return null;

  // Remove hash if present
  hex = hex.replace('#', '');

  // Handle 3-character hex (e.g., #000 -> #000000)
  if (hex.length === 3) {
    hex = hex
      .split('')
      .map(char => char + char)
      .join('');
  }

  // Validate hex format (6 characters, valid hex digits)
  if (!/^[a-f\d]{6}$/i.test(hex)) return null;

  return {
    r: parseInt(hex.substring(0, 2), 16),
    g: parseInt(hex.substring(2, 4), 16),
    b: parseInt(hex.substring(4, 6), 16),
  };
}

// Calculate relative luminance
function getLuminance(r: number, g: number, b: number): number {
  const [rs, gs, bs] = [r, g, b].map(c => {
    c = c / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * (rs ?? 0) + 0.7152 * (gs ?? 0) + 0.0722 * (bs ?? 0);
}

// Initialize contrast checker
const contrastChecker = new ContrastChecker();

// Calculate contrast ratio between two colors using the library
export function getContrastRatio(color1: string, color2: string): number {
  // Validate colors first
  const rgb1 = hexToRgb(color1);
  const rgb2 = hexToRgb(color2);

  if (!rgb1 || !rgb2) return 0;

  try {
    return contrastChecker.getRatio(color1, color2);
  } catch {
    // Fallback to manual calculation if library fails
    const lum1 = getLuminance(rgb1.r, rgb1.g, rgb1.b);
    const lum2 = getLuminance(rgb2.r, rgb2.g, rgb2.b);

    const brightest = Math.max(lum1, lum2);
    const darkest = Math.min(lum1, lum2);

    return (brightest + 0.05) / (darkest + 0.05);
  }
}

// Check if contrast ratio meets WCAG standards using the library
export function meetsContrastStandards(
  foreground: string,
  background: string,
  level: 'AA' | 'AAA' = 'AA',
  size: 'normal' | 'large' = 'normal'
): boolean {
  try {
    if (level === 'AAA') {
      return size === 'large'
        ? contrastChecker.isLevelAAA(foreground, background, 18) // Large text
        : contrastChecker.isLevelAAA(foreground, background, 14); // Normal text
    } else {
      return size === 'large'
        ? contrastChecker.isLevelAA(foreground, background, 18) // Large text
        : contrastChecker.isLevelAA(foreground, background, 14); // Normal text
    }
  } catch {
    // Fallback to manual calculation
    const ratio = getContrastRatio(foreground, background);

    if (level === 'AAA') {
      return size === 'large' ? ratio >= 4.5 : ratio >= 7;
    } else {
      return size === 'large' ? ratio >= 3 : ratio >= 4.5;
    }
  }
}

// Validate color scheme for accessibility
export function validateColorScheme(colors: ColorScheme): {
  isValid: boolean;
  issues: string[];
  suggestions: Record<string, string>;
} {
  const issues: string[] = [];
  const suggestions: Record<string, string> = {};

  // Check primary text on background
  if (!meetsContrastStandards(colors.text, colors.background)) {
    issues.push(
      'Primary text does not meet contrast requirements on background'
    );
    suggestions.text = colors.background === '#ffffff' ? '#1a1a1a' : '#ffffff';
  }

  // Check primary color on background
  if (!meetsContrastStandards(colors.primary, colors.background)) {
    issues.push(
      'Primary color does not meet contrast requirements on background'
    );
    suggestions.primary =
      colors.background === '#ffffff' ? '#1e40af' : '#60a5fa';
  }

  // Check accent color on background
  if (!meetsContrastStandards(colors.accent, colors.background)) {
    issues.push(
      'Accent color does not meet contrast requirements on background'
    );
    suggestions.accent =
      colors.background === '#ffffff' ? '#3b82f6' : '#93c5fd';
  }

  // Check sidebar text on sidebar background
  if (colors.sidebar && colors.sidebarText) {
    if (!meetsContrastStandards(colors.sidebarText, colors.sidebar)) {
      issues.push(
        'Sidebar text does not meet contrast requirements on sidebar background'
      );
      suggestions.sidebarText =
        colors.sidebar === '#ffffff' ? '#1a1a1a' : '#ffffff';
    }
  }

  return {
    isValid: issues.length === 0,
    issues,
    suggestions,
  };
}

// Get contrast ratio as a readable string
export function getContrastRatioString(color1: string, color2: string): string {
  const ratio = getContrastRatio(color1, color2);
  return `${ratio.toFixed(2)}:1`;
}

// Get WCAG compliance level using the library
export function getWCAGLevel(
  foreground: string,
  background: string,
  size: 'normal' | 'large' = 'normal'
): 'AAA' | 'AA' | 'Fail' {
  try {
    const fontSize = size === 'large' ? 18 : 14;

    if (contrastChecker.isLevelAAA(foreground, background, fontSize)) {
      return 'AAA';
    } else if (contrastChecker.isLevelAA(foreground, background, fontSize)) {
      return 'AA';
    } else {
      return 'Fail';
    }
  } catch {
    // Fallback to manual calculation
    const ratio = getContrastRatio(foreground, background);

    if (size === 'large') {
      return ratio >= 4.5 ? 'AAA' : ratio >= 3 ? 'AA' : 'Fail';
    } else {
      return ratio >= 7 ? 'AAA' : ratio >= 4.5 ? 'AA' : 'Fail';
    }
  }
}

// Comprehensive contrast analysis using the library
export function analyzeContrast(foreground: string, background: string) {
  try {
    const ratio = contrastChecker.getRatio(foreground, background);
    const isAA = contrastChecker.isLevelAA(foreground, background, 14);
    const isAAA = contrastChecker.isLevelAAA(foreground, background, 14);
    const isAALarge = contrastChecker.isLevelAA(foreground, background, 18);
    const isAAALarge = contrastChecker.isLevelAAA(foreground, background, 18);

    return {
      ratio: parseFloat(ratio.toFixed(2)),
      normalText: {
        AA: isAA,
        AAA: isAAA,
        level: isAAA ? 'AAA' : isAA ? 'AA' : 'Fail',
      },
      largeText: {
        AA: isAALarge,
        AAA: isAAALarge,
        level: isAAALarge ? 'AAA' : isAALarge ? 'AA' : 'Fail',
      },
    };
  } catch {
    // Fallback to manual calculation
    const ratio = getContrastRatio(foreground, background);
    const normalAA = ratio >= 4.5;
    const normalAAA = ratio >= 7;
    const largeAA = ratio >= 3;
    const largeAAA = ratio >= 4.5;

    return {
      ratio: parseFloat(ratio.toFixed(2)),
      normalText: {
        AA: normalAA,
        AAA: normalAAA,
        level: normalAAA ? 'AAA' : normalAA ? 'AA' : 'Fail',
      },
      largeText: {
        AA: largeAA,
        AAA: largeAAA,
        level: largeAAA ? 'AAA' : largeAA ? 'AA' : 'Fail',
      },
    };
  }
}
