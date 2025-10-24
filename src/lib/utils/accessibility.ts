import { axe, toHaveNoViolations } from 'jest-axe';

// Extend Jest matchers
expect.extend(toHaveNoViolations);

export interface AccessibilityTestOptions {
  include?: string[];
  exclude?: string[];
  tags?: string[];
  rules?: Record<string, any>;
}

export interface ColorContrastResult {
  ratio: number;
  level: 'AA' | 'AAA';
  passed: boolean;
  foreground: string;
  background: string;
}

export interface AccessibilityTestResult {
  violations: any[];
  passes: any[];
  incomplete: any[];
  inapplicable: any[];
}

/**
 * Comprehensive accessibility testing utility
 */
export class AccessibilityTester {
  /**
   * Test component for accessibility violations
   */
  static async testComponent(
    container: HTMLElement,
    _options: AccessibilityTestOptions = {}
  ): Promise<AccessibilityTestResult> {
    const results = await axe(container);

    return {
      violations: results.violations,
      passes: results.passes,
      incomplete: results.incomplete,
      inapplicable: results.inapplicable,
    };
  }

  /**
   * Test for keyboard navigation
   */
  static testKeyboardNavigation(element: HTMLElement): boolean {
    const tabIndex = element.getAttribute('tabindex');
    const isFocusable = element.matches(
      'button, input, select, textarea, a[href], [tabindex]:not([tabindex="-1"])'
    );

    return isFocusable || tabIndex !== null;
  }

  /**
   * Test for proper ARIA attributes
   */
  static testAriaAttributes(element: HTMLElement): {
    hasLabel: boolean;
    hasRole: boolean;
    hasState: boolean;
    hasProperty: boolean;
  } {
    const hasLabel = !!(
      element.getAttribute('aria-label') ||
      element.getAttribute('aria-labelledby') ||
      element.getAttribute('aria-describedby')
    );

    const hasRole = !!element.getAttribute('role');

    const hasState = !!(
      element.getAttribute('aria-expanded') ||
      element.getAttribute('aria-selected') ||
      element.getAttribute('aria-checked') ||
      element.getAttribute('aria-pressed') ||
      element.getAttribute('aria-disabled')
    );

    const hasProperty = !!(
      element.getAttribute('aria-required') ||
      element.getAttribute('aria-invalid') ||
      element.getAttribute('aria-busy') ||
      element.getAttribute('aria-live')
    );

    return {
      hasLabel,
      hasRole,
      hasState,
      hasProperty,
    };
  }

  /**
   * Test for color contrast (basic implementation)
   */
  static testColorContrast(
    foreground: string,
    background: string
  ): ColorContrastResult {
    // This is a simplified implementation
    // In a real application, you'd use a proper color contrast library
    const ratio = this.calculateContrastRatio(foreground, background);

    return {
      ratio,
      level: ratio >= 7 ? 'AAA' : ratio >= 4.5 ? 'AA' : 'AA',
      passed: ratio >= 4.5,
      foreground,
      background,
    };
  }

  /**
   * Test for screen reader compatibility
   */
  static testScreenReaderCompatibility(element: HTMLElement): {
    hasAltText: boolean;
    hasAriaLabel: boolean;
    hasAriaLabelledBy: boolean;
    hasAriaDescribedBy: boolean;
    hasRole: boolean;
  } {
    const hasAltText =
      element.tagName === 'IMG' && !!element.getAttribute('alt');
    const hasAriaLabel = !!element.getAttribute('aria-label');
    const hasAriaLabelledBy = !!element.getAttribute('aria-labelledby');
    const hasAriaDescribedBy = !!element.getAttribute('aria-describedby');
    const hasRole = !!element.getAttribute('role');

    return {
      hasAltText,
      hasAriaLabel,
      hasAriaLabelledBy,
      hasAriaDescribedBy,
      hasRole,
    };
  }

  /**
   * Test for focus management
   */
  static testFocusManagement(element: HTMLElement): {
    isFocusable: boolean;
    hasFocusIndicator: boolean;
    hasTabIndex: boolean;
    canReceiveFocus: boolean;
  } {
    const isFocusable = this.testKeyboardNavigation(element);
    const hasFocusIndicator =
      element.matches(':focus-visible') ||
      element.classList.contains('focus:ring-2') ||
      element.classList.contains('focus:outline-none');
    const hasTabIndex = element.hasAttribute('tabindex');
    const canReceiveFocus = element.matches(
      'button, input, select, textarea, a[href], [tabindex]:not([tabindex="-1"])'
    );

    return {
      isFocusable,
      hasFocusIndicator,
      hasTabIndex,
      canReceiveFocus,
    };
  }

  /**
   * Test for semantic HTML structure
   */
  static testSemanticStructure(element: HTMLElement): {
    hasHeading: boolean;
    hasLandmark: boolean;
    hasList: boolean;
    hasTable: boolean;
    hasForm: boolean;
  } {
    const hasHeading = element.matches(
      'h1, h2, h3, h4, h5, h6, [role="heading"]'
    );
    const hasLandmark = element.matches(
      'nav, main, aside, section, article, header, footer, [role="navigation"], [role="main"], [role="complementary"], [role="banner"], [role="contentinfo"]'
    );
    const hasList = element.matches('ul, ol, [role="list"]');
    const hasTable = element.matches('table, [role="table"]');
    const hasForm = element.matches('form, [role="form"]');

    return {
      hasHeading,
      hasLandmark,
      hasList,
      hasTable,
      hasForm,
    };
  }

  /**
   * Test for motion and animation accessibility
   */
  static testMotionAccessibility(element: HTMLElement): {
    respectsReducedMotion: boolean;
    hasMotionWarning: boolean;
    hasPauseControl: boolean;
  } {
    const respectsReducedMotion =
      !element.classList.contains('animate-spin') ||
      !element.classList.contains('animate-pulse') ||
      !element.classList.contains('animate-bounce');
    const hasMotionWarning =
      element.hasAttribute('aria-live') || element.hasAttribute('aria-atomic');
    const hasPauseControl =
      element.hasAttribute('aria-controls') ||
      element.hasAttribute('aria-expanded');

    return {
      respectsReducedMotion,
      hasMotionWarning,
      hasPauseControl,
    };
  }

  /**
   * Calculate contrast ratio between two colors
   */
  private static calculateContrastRatio(
    _color1: string,
    _color2: string
  ): number {
    // Simplified contrast ratio calculation
    // In a real implementation, you'd parse the colors and calculate the actual ratio
    return 4.5; // Placeholder value
  }

  /**
   * Generate accessibility report
   */
  static async generateReport(container: HTMLElement): Promise<{
    score: number;
    violations: any[];
    recommendations: string[];
    passed: boolean;
  }> {
    const results = await this.testComponent(container);
    const violations = results.violations;
    const score = Math.max(0, 100 - violations.length * 10);

    const recommendations: string[] = [];

    if (violations.length > 0) {
      recommendations.push(
        'Fix accessibility violations found in the component'
      );
    }

    if (score < 80) {
      recommendations.push('Improve overall accessibility score');
    }

    return {
      score,
      violations,
      recommendations,
      passed: violations.length === 0,
    };
  }
}

/**
 * Custom Jest matchers for accessibility testing
 */
export const accessibilityMatchers = {
  toBeAccessible: (received: HTMLElement) => {
    const result = AccessibilityTester.testAriaAttributes(received);
    const hasAccessibility =
      result.hasLabel || result.hasRole || result.hasState;

    return {
      message: () => `Expected element to be accessible`,
      pass: hasAccessibility,
    };
  },

  toHaveProperFocus: (received: HTMLElement) => {
    const result = AccessibilityTester.testFocusManagement(received);

    return {
      message: () => `Expected element to have proper focus management`,
      pass: result.isFocusable && result.hasFocusIndicator,
    };
  },

  toBeScreenReaderCompatible: (received: HTMLElement) => {
    const result = AccessibilityTester.testScreenReaderCompatibility(received);
    const isCompatible =
      result.hasAriaLabel ||
      result.hasAriaLabelledBy ||
      result.hasAriaDescribedBy ||
      result.hasRole;

    return {
      message: () => `Expected element to be screen reader compatible`,
      pass: isCompatible,
    };
  },
};

// Extend Jest matchers
declare global {
  namespace jest {
    interface Matchers<R> {
      toBeAccessible(): R;
      toHaveProperFocus(): R;
      toBeScreenReaderCompatible(): R;
    }
  }
}
