import {
  analyzeContrast,
  getContrastRatio,
  getContrastRatioString,
  getWCAGLevel,
  meetsContrastStandards,
  validateColorScheme,
} from '@/lib/utils/contrastUtils';
import { ColorScheme } from '@/types/resume';

// Mock the color-contrast-checker library
jest.mock('color-contrast-checker', () => {
  return {
    ContrastChecker: jest.fn().mockImplementation(() => ({
      getRatio: jest.fn((color1: string, color2: string) => {
        // Mock some known contrast ratios
        if (color1 === '#000000' && color2 === '#ffffff') return 21;
        if (color1 === '#ffffff' && color2 === '#000000') return 21;
        if (color1 === '#3b82f6' && color2 === '#ffffff') return 4.5;
        if (color1 === '#64748b' && color2 === '#ffffff') return 4.6;
        return 3.2; // Default mock ratio
      }),
      isLevelAA: jest.fn((color1: string, color2: string, fontSize: number) => {
        const ratio = color1 === '#000000' && color2 === '#ffffff' ? 21 : 3.2;
        return fontSize >= 18 ? ratio >= 3 : ratio >= 4.5;
      }),
      isLevelAAA: jest.fn(
        (color1: string, color2: string, fontSize: number) => {
          const ratio = color1 === '#000000' && color2 === '#ffffff' ? 21 : 3.2;
          return fontSize >= 18 ? ratio >= 4.5 : ratio >= 7;
        }
      ),
    })),
  };
});

describe('ContrastUtils', () => {
  describe('getContrastRatio', () => {
    it('should calculate contrast ratio using the library', () => {
      const ratio = getContrastRatio('#000000', '#ffffff');
      expect(ratio).toBe(21);
    });

    it('should handle invalid colors gracefully', () => {
      const ratio = getContrastRatio('invalid', '#ffffff');
      expect(ratio).toBe(0);
    });

    it('should fallback to manual calculation when library fails', () => {
      // Mock library to throw error
      const { ContrastChecker } = require('color-contrast-checker');
      const mockInstance = new ContrastChecker();
      mockInstance.getRatio.mockImplementation(() => {
        throw new Error('Library error');
      });

      const ratio = getContrastRatio('#000000', '#ffffff');
      expect(ratio).toBeGreaterThan(0);
    });
  });

  describe('meetsContrastStandards', () => {
    it('should check AA compliance for normal text', () => {
      const isCompliant = meetsContrastStandards(
        '#000000',
        '#ffffff',
        'AA',
        'normal'
      );
      expect(isCompliant).toBe(true);
    });

    it('should check AAA compliance for normal text', () => {
      const isCompliant = meetsContrastStandards(
        '#000000',
        '#ffffff',
        'AAA',
        'normal'
      );
      expect(isCompliant).toBe(true);
    });

    it('should check AA compliance for large text', () => {
      const isCompliant = meetsContrastStandards(
        '#3b82f6',
        '#ffffff',
        'AA',
        'large'
      );
      expect(isCompliant).toBe(true);
    });

    it('should return false for insufficient contrast', () => {
      const isCompliant = meetsContrastStandards(
        '#cccccc',
        '#ffffff',
        'AA',
        'normal'
      );
      expect(isCompliant).toBe(false);
    });
  });

  describe('validateColorScheme', () => {
    const validColorScheme: ColorScheme = {
      primary: '#1e40af',
      secondary: '#475569',
      accent: '#3b82f6',
      text: '#0f172a',
      background: '#ffffff',
      sidebar: '#1e40af',
      sidebarText: '#ffffff',
    };

    const invalidColorScheme: ColorScheme = {
      primary: '#cccccc',
      secondary: '#dddddd',
      accent: '#eeeeee',
      text: '#f0f0f0',
      background: '#ffffff',
    };

    it('should validate a compliant color scheme', () => {
      const result = validateColorScheme(validColorScheme);
      expect(result.isValid).toBe(true);
      expect(result.issues).toHaveLength(0);
    });

    it('should identify contrast issues in invalid color scheme', () => {
      const result = validateColorScheme(invalidColorScheme);
      expect(result.isValid).toBe(false);
      expect(result.issues.length).toBeGreaterThan(0);
    });

    it('should provide suggestions for fixing contrast issues', () => {
      const result = validateColorScheme(invalidColorScheme);
      expect(result.suggestions).toHaveProperty('text');
      expect(result.suggestions).toHaveProperty('primary');
      expect(result.suggestions).toHaveProperty('accent');
    });

    it('should validate sidebar colors when present', () => {
      const result = validateColorScheme(validColorScheme);
      expect(result.issues).not.toContain(
        'Sidebar text does not meet contrast requirements on sidebar background'
      );
    });
  });

  describe('getContrastRatioString', () => {
    it('should format contrast ratio as readable string', () => {
      const ratioString = getContrastRatioString('#000000', '#ffffff');
      expect(ratioString).toBe('21.00:1');
    });

    it('should handle decimal ratios correctly', () => {
      const ratioString = getContrastRatioString('#3b82f6', '#ffffff');
      expect(ratioString).toBe('4.50:1');
    });
  });

  describe('getWCAGLevel', () => {
    it('should return AAA for excellent contrast', () => {
      const level = getWCAGLevel('#000000', '#ffffff', 'normal');
      expect(level).toBe('AAA');
    });

    it('should return AA for good contrast', () => {
      const level = getWCAGLevel('#3b82f6', '#ffffff', 'normal');
      expect(level).toBe('AA');
    });

    it('should return Fail for poor contrast', () => {
      const level = getWCAGLevel('#cccccc', '#ffffff', 'normal');
      expect(level).toBe('Fail');
    });

    it('should handle large text differently', () => {
      const level = getWCAGLevel('#3b82f6', '#ffffff', 'large');
      expect(level).toBe('AA');
    });
  });

  describe('analyzeContrast', () => {
    it('should provide comprehensive contrast analysis', () => {
      const analysis = analyzeContrast('#000000', '#ffffff');

      expect(analysis).toHaveProperty('ratio');
      expect(analysis).toHaveProperty('normalText');
      expect(analysis).toHaveProperty('largeText');

      expect(analysis.normalText).toHaveProperty('AA');
      expect(analysis.normalText).toHaveProperty('AAA');
      expect(analysis.normalText).toHaveProperty('level');

      expect(analysis.largeText).toHaveProperty('AA');
      expect(analysis.largeText).toHaveProperty('AAA');
      expect(analysis.largeText).toHaveProperty('level');
    });

    it('should return correct analysis for high contrast colors', () => {
      const analysis = analyzeContrast('#000000', '#ffffff');

      expect(analysis.ratio).toBe(21);
      expect(analysis.normalText.AA).toBe(true);
      expect(analysis.normalText.AAA).toBe(true);
      expect(analysis.normalText.level).toBe('AAA');
      expect(analysis.largeText.AA).toBe(true);
      expect(analysis.largeText.AAA).toBe(true);
      expect(analysis.largeText.level).toBe('AAA');
    });

    it('should return correct analysis for medium contrast colors', () => {
      const analysis = analyzeContrast('#3b82f6', '#ffffff');

      expect(analysis.ratio).toBe(4.5);
      expect(analysis.normalText.AA).toBe(true);
      expect(analysis.normalText.AAA).toBe(false);
      expect(analysis.normalText.level).toBe('AA');
      expect(analysis.largeText.AA).toBe(true);
      expect(analysis.largeText.AAA).toBe(true);
      expect(analysis.largeText.level).toBe('AAA');
    });

    it('should handle library errors gracefully', () => {
      // Mock library to throw error
      const { ContrastChecker } = require('color-contrast-checker');
      const mockInstance = new ContrastChecker();
      mockInstance.getRatio.mockImplementation(() => {
        throw new Error('Library error');
      });

      const analysis = analyzeContrast('#000000', '#ffffff');

      expect(analysis).toHaveProperty('ratio');
      expect(analysis).toHaveProperty('normalText');
      expect(analysis).toHaveProperty('largeText');
      expect(typeof analysis.ratio).toBe('number');
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty color strings', () => {
      const ratio = getContrastRatio('', '#ffffff');
      expect(ratio).toBe(0);
    });

    it('should handle malformed hex colors', () => {
      const ratio = getContrastRatio('#gggggg', '#ffffff');
      expect(ratio).toBe(0);
    });

    it('should handle colors without hash prefix', () => {
      const ratio = getContrastRatio('000000', 'ffffff');
      expect(ratio).toBe(21);
    });

    it('should handle three-character hex colors', () => {
      const ratio = getContrastRatio('#000', '#fff');
      expect(ratio).toBe(21);
    });
  });

  describe('Real-world Color Combinations', () => {
    const testCases = [
      {
        name: 'Black on White',
        foreground: '#000000',
        background: '#ffffff',
        expectedLevel: 'AAA',
      },
      {
        name: 'White on Black',
        foreground: '#ffffff',
        background: '#000000',
        expectedLevel: 'AAA',
      },
      {
        name: 'Blue on White',
        foreground: '#3b82f6',
        background: '#ffffff',
        expectedLevel: 'AA',
      },
      {
        name: 'Gray on White',
        foreground: '#64748b',
        background: '#ffffff',
        expectedLevel: 'AA',
      },
    ];

    testCases.forEach(({ name, foreground, background, expectedLevel }) => {
      it(`should correctly analyze ${name}`, () => {
        const analysis = analyzeContrast(foreground, background);
        expect(analysis.normalText.level).toBe(expectedLevel);
      });
    });
  });
});
