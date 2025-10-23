import { ColorScheme } from '@/types/resume';

// Convert hex color to RGB
function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

// Calculate relative luminance
function getLuminance(r: number, g: number, b: number): number {
  const [rs, gs, bs] = [r, g, b].map(c => {
    c = c / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

// Calculate contrast ratio between two colors
export function getContrastRatio(color1: string, color2: string): number {
  const rgb1 = hexToRgb(color1);
  const rgb2 = hexToRgb(color2);

  if (!rgb1 || !rgb2) return 0;

  const lum1 = getLuminance(rgb1.r, rgb1.g, rgb1.b);
  const lum2 = getLuminance(rgb2.r, rgb2.g, rgb2.b);

  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);

  return (brightest + 0.05) / (darkest + 0.05);
}

// Check if contrast ratio meets WCAG standards
export function meetsContrastStandards(
  foreground: string,
  background: string,
  level: 'AA' | 'AAA' = 'AA',
  size: 'normal' | 'large' = 'normal'
): boolean {
  const ratio = getContrastRatio(foreground, background);

  if (level === 'AAA') {
    return size === 'large' ? ratio >= 4.5 : ratio >= 7;
  } else {
    return size === 'large' ? ratio >= 3 : ratio >= 4.5;
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

// Get WCAG compliance level
export function getWCAGLevel(
  foreground: string,
  background: string,
  size: 'normal' | 'large' = 'normal'
): 'AAA' | 'AA' | 'Fail' {
  const ratio = getContrastRatio(foreground, background);

  if (size === 'large') {
    return ratio >= 4.5 ? 'AAA' : ratio >= 3 ? 'AA' : 'Fail';
  } else {
    return ratio >= 7 ? 'AAA' : ratio >= 4.5 ? 'AA' : 'Fail';
  }
}
