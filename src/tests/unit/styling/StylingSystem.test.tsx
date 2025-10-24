import {
  applyStylingToElement,
  backgroundToCSS,
  borderToCSS,
  generateCompleteCSS,
  generateSectionCSS,
  generateSectionCSSVariables,
  shadowToCSS,
  spacingToCSS,
  typographyToCSS,
} from '@/lib/resume/stylingUtils';
import { useResumeStylingStore } from '@/store/resumeStylingStore';

// Mock DOM methods
const mockElement = {
  style: {
    setProperty: jest.fn(),
  },
  querySelector: jest.fn(),
  querySelectorAll: jest.fn(),
};

Object.defineProperty(document, 'createElement', {
  value: jest.fn(() => mockElement),
  writable: true,
});

describe('Styling System', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('CSS Conversion Utilities', () => {
    it('should convert typography style to CSS properties', () => {
      const typography = {
        fontFamily: 'Inter, sans-serif',
        fontSize: '1.5rem',
        fontWeight: 600,
        lineHeight: 1.4,
        letterSpacing: '0.025em',
        textTransform: 'uppercase' as const,
        textDecoration: 'underline' as const,
      };

      const css = typographyToCSS(typography);

      expect(css).toEqual({
        fontFamily: 'Inter, sans-serif',
        fontSize: '1.5rem',
        fontWeight: '600',
        lineHeight: '1.4',
        letterSpacing: '0.025em',
        textTransform: 'uppercase',
        textDecoration: 'underline',
      });
    });

    it('should convert spacing style to CSS properties', () => {
      const spacing = {
        margin: '1rem 2rem',
        padding: '0.5rem 1rem',
        gap: '1rem',
      };

      const css = spacingToCSS(spacing);

      expect(css).toEqual({
        margin: '1rem 2rem',
        padding: '0.5rem 1rem',
        gap: '1rem',
      });
    });

    it('should convert border style to CSS properties', () => {
      const border = {
        width: '2px',
        style: 'solid' as const,
        color: '#3b82f6',
        radius: '0.5rem',
      };

      const css = borderToCSS(border);

      expect(css).toEqual({
        borderWidth: '2px',
        borderStyle: 'solid',
        borderColor: '#3b82f6',
        borderRadius: '0.5rem',
      });
    });

    it('should convert background style to CSS properties', () => {
      const background = {
        color: '#ffffff',
        image: 'url(/pattern.png)',
        position: 'center',
        repeat: 'no-repeat',
        size: 'cover',
      };

      const css = backgroundToCSS(background);

      expect(css).toEqual({
        backgroundColor: '#ffffff',
        backgroundImage: 'url(url(/pattern.png))',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
      });
    });

    it('should convert shadow style to CSS properties', () => {
      const shadow = {
        color: 'rgba(0, 0, 0, 0.1)',
        offsetX: '0',
        offsetY: '4px',
        blur: '8px',
        spread: '0',
      };

      const css = shadowToCSS(shadow);

      expect(css).toEqual({
        boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.1)',
      });
    });
  });

  describe('CSS Variables Generation', () => {
    it('should generate CSS variables for header section', () => {
      const headerStyling = {
        container: {
          display: 'flex' as const,
          flexDirection: 'column' as const,
          justifyContent: 'center',
          alignItems: 'center',
          spacing: { margin: '0 0 2rem 0', padding: '0', gap: '1rem' },
          border: {
            width: '0',
            style: 'none' as const,
            color: 'transparent',
            radius: '0',
          },
          background: { color: 'transparent' },
          shadow: {
            color: 'transparent',
            offsetX: '0',
            offsetY: '0',
            blur: '0',
            spread: '0',
          },
        },
        name: {
          fontFamily: 'Inter, sans-serif',
          fontSize: '2rem',
          fontWeight: 700,
          lineHeight: 1.2,
          textTransform: 'none' as const,
          textDecoration: 'none' as const,
        },
        contact: {
          container: {
            display: 'flex' as const,
            flexDirection: 'row' as const,
            justifyContent: 'center',
            alignItems: 'center',
            spacing: { margin: '0', padding: '0', gap: '1rem' },
          },
          item: {
            fontFamily: 'Inter, sans-serif',
            fontSize: '0.875rem',
            fontWeight: 400,
            lineHeight: 1.4,
            textTransform: 'none' as const,
            textDecoration: 'none' as const,
          },
        },
        title: {
          fontFamily: 'Inter, sans-serif',
          fontSize: '1.125rem',
          fontWeight: 500,
          lineHeight: 1.4,
          textTransform: 'none' as const,
          textDecoration: 'none' as const,
        },
        summary: {
          fontFamily: 'Inter, sans-serif',
          fontSize: '1rem',
          fontWeight: 400,
          lineHeight: 1.6,
          textTransform: 'none' as const,
          textDecoration: 'none' as const,
        },
      };

      const variables = generateSectionCSSVariables('header', headerStyling);

      expect(variables).toHaveProperty('--header-name-font-family');
      expect(variables).toHaveProperty('--header-name-font-size');
      expect(variables).toHaveProperty('--header-name-font-weight');
      expect(variables).toHaveProperty('--header-contact-item-font-family');
      expect(variables).toHaveProperty('--header-margin');
      expect(variables).toHaveProperty('--header-padding');
    });

    it('should generate CSS variables for skills section', () => {
      const skillsStyling = {
        container: {
          display: 'inline-block' as const,
          spacing: {
            margin: '0.25rem 0.5rem 0.25rem 0',
            padding: '0.5rem 1rem',
            gap: '0',
          },
          border: {
            width: '1px',
            style: 'solid' as const,
            color: '#e2e8f0',
            radius: '0.375rem',
          },
          background: { color: '#f8fafc' },
          shadow: {
            color: 'rgba(0, 0, 0, 0.05)',
            offsetX: '0',
            offsetY: '1px',
            blur: '2px',
            spread: '0',
          },
        },
        text: {
          fontFamily: 'Inter, sans-serif',
          fontSize: '0.875rem',
          fontWeight: 500,
          lineHeight: 1.4,
          textTransform: 'none' as const,
          textDecoration: 'none' as const,
        },
        badge: {
          display: 'inline-block' as const,
          spacing: {
            margin: '0.25rem 0.5rem 0.25rem 0',
            padding: '0.5rem 1rem',
            gap: '0',
          },
          border: {
            width: '1px',
            style: 'solid' as const,
            color: '#3b82f6',
            radius: '0.375rem',
          },
          background: { color: '#eff6ff' },
          shadow: {
            color: 'rgba(59, 130, 246, 0.1)',
            offsetX: '0',
            offsetY: '1px',
            blur: '2px',
            spread: '0',
          },
          typography: {
            fontFamily: 'Inter, sans-serif',
            fontSize: '0.875rem',
            fontWeight: 500,
            lineHeight: 1.4,
            textTransform: 'none' as const,
            textDecoration: 'none' as const,
          },
        },
        category: {
          spacing: { margin: '0 0 1rem 0', padding: '0', gap: '0' },
          typography: {
            fontFamily: 'Inter, sans-serif',
            fontSize: '1rem',
            fontWeight: 600,
            lineHeight: 1.4,
            textTransform: 'none' as const,
            textDecoration: 'none' as const,
          },
          border: {
            width: '0',
            style: 'none' as const,
            color: 'transparent',
            radius: '0',
          },
          background: { color: 'transparent' },
        },
      };

      const variables = generateSectionCSSVariables('skills', skillsStyling);

      expect(variables).toHaveProperty('--skills-text-font-family');
      expect(variables).toHaveProperty('--skills-badge-typography-font-family');
      expect(variables).toHaveProperty(
        '--skills-category-typography-font-family'
      );
      expect(variables).toHaveProperty('--skills-border-width');
      expect(variables).toHaveProperty('--skills-background-color');
    });
  });

  describe('CSS Generation', () => {
    it('should generate complete CSS for a section', () => {
      const headerStyling = {
        container: {
          display: 'flex' as const,
          flexDirection: 'column' as const,
          justifyContent: 'center',
          alignItems: 'center',
          spacing: { margin: '0 0 2rem 0', padding: '0', gap: '1rem' },
          border: {
            width: '0',
            style: 'none' as const,
            color: 'transparent',
            radius: '0',
          },
          background: { color: 'transparent' },
          shadow: {
            color: 'transparent',
            offsetX: '0',
            offsetY: '0',
            blur: '0',
            spread: '0',
          },
        },
        name: {
          fontFamily: 'Inter, sans-serif',
          fontSize: '2rem',
          fontWeight: 700,
          lineHeight: 1.2,
          textTransform: 'none' as const,
          textDecoration: 'none' as const,
        },
        contact: {
          container: {
            display: 'flex' as const,
            flexDirection: 'row' as const,
            justifyContent: 'center',
            alignItems: 'center',
            spacing: { margin: '0', padding: '0', gap: '1rem' },
          },
          item: {
            fontFamily: 'Inter, sans-serif',
            fontSize: '0.875rem',
            fontWeight: 400,
            lineHeight: 1.4,
            textTransform: 'none' as const,
            textDecoration: 'none' as const,
          },
        },
        title: {
          fontFamily: 'Inter, sans-serif',
          fontSize: '1.125rem',
          fontWeight: 500,
          lineHeight: 1.4,
          textTransform: 'none' as const,
          textDecoration: 'none' as const,
        },
        summary: {
          fontFamily: 'Inter, sans-serif',
          fontSize: '1rem',
          fontWeight: 400,
          lineHeight: 1.6,
          textTransform: 'none' as const,
          textDecoration: 'none' as const,
        },
      };

      const css = generateSectionCSS('header', headerStyling);

      expect(css).toContain('.header {');
      expect(css).toContain('--header-name-font-family: Inter, sans-serif;');
      expect(css).toContain('.header__container {');
      expect(css).toContain('display: flex;');
      expect(css).toContain('.header__name {');
      expect(css).toContain('font-size: 2rem;');
    });

    it('should generate complete CSS for all sections', () => {
      const stylingState = useResumeStylingStore.getState();
      const css = generateCompleteCSS(stylingState);

      expect(css).toContain(':root {');
      expect(css).toContain('--primary-500: #3b82f6;');
      expect(css).toContain('--secondary-500: #64748b;');
      expect(css).toContain('--text-base: 1rem;');
      expect(css).toContain('.header {');
      expect(css).toContain('.experience {');
      expect(css).toContain('.skills {');
      expect(css).toContain('@media print {');
      expect(css).toContain('color-adjust: exact !important;');
    });
  });

  describe('Element Styling Application', () => {
    it('should apply styling to a DOM element', () => {
      const headerStyling = {
        container: {
          display: 'flex' as const,
          flexDirection: 'column' as const,
          justifyContent: 'center',
          alignItems: 'center',
          spacing: { margin: '0 0 2rem 0', padding: '0', gap: '1rem' },
          border: {
            width: '0',
            style: 'none' as const,
            color: 'transparent',
            radius: '0',
          },
          background: { color: 'transparent' },
          shadow: {
            color: 'transparent',
            offsetX: '0',
            offsetY: '0',
            blur: '0',
            spread: '0',
          },
        },
        name: {
          fontFamily: 'Inter, sans-serif',
          fontSize: '2rem',
          fontWeight: 700,
          lineHeight: 1.2,
          textTransform: 'none' as const,
          textDecoration: 'none' as const,
        },
        contact: {
          container: {
            display: 'flex' as const,
            flexDirection: 'row' as const,
            justifyContent: 'center',
            alignItems: 'center',
            spacing: { margin: '0', padding: '0', gap: '1rem' },
          },
          item: {
            fontFamily: 'Inter, sans-serif',
            fontSize: '0.875rem',
            fontWeight: 400,
            lineHeight: 1.4,
            textTransform: 'none' as const,
            textDecoration: 'none' as const,
          },
        },
        title: {
          fontFamily: 'Inter, sans-serif',
          fontSize: '1.125rem',
          fontWeight: 500,
          lineHeight: 1.4,
          textTransform: 'none' as const,
          textDecoration: 'none' as const,
        },
        summary: {
          fontFamily: 'Inter, sans-serif',
          fontSize: '1rem',
          fontWeight: 400,
          lineHeight: 1.6,
          textTransform: 'none' as const,
          textDecoration: 'none' as const,
        },
      };

      applyStylingToElement(mockElement as any, 'header', headerStyling);

      expect(mockElement.style.setProperty).toHaveBeenCalledWith(
        '--header-name-font-family',
        'Inter, sans-serif'
      );
      expect(mockElement.style.setProperty).toHaveBeenCalledWith(
        '--header-name-font-size',
        '2rem'
      );
      expect(mockElement.style.setProperty).toHaveBeenCalledWith(
        'display',
        'flex'
      );
      expect(mockElement.style.setProperty).toHaveBeenCalledWith(
        'flexDirection',
        'column'
      );
      expect(mockElement.style.setProperty).toHaveBeenCalledWith(
        'margin',
        '0 0 2rem 0'
      );
    });
  });

  describe('Global Styling Store', () => {
    it('should set and get global styling', () => {
      const { setGlobalStyling, getSectionStyling } =
        useResumeStylingStore.getState();

      setGlobalStyling({
        page: {
          width: '9in',
          height: '12in',
          margin: '0.25in',
          padding: '0.25in',
          background: { color: '#f8fafc' },
        },
      });

      const styling = useResumeStylingStore.getState();
      expect(styling.global.page.width).toBe('9in');
      expect(styling.global.page.background.color).toBe('#f8fafc');
    });

    it('should set and get section styling', () => {
      const { setSectionStyling, getSectionStyling } =
        useResumeStylingStore.getState();

      setSectionStyling('header', {
        name: {
          fontFamily: 'Georgia, serif',
          fontSize: '2.5rem',
          fontWeight: 800,
          lineHeight: 1.1,
          textTransform: 'none' as const,
          textDecoration: 'none' as const,
        },
      });

      const headerStyling = getSectionStyling('header');
      expect(headerStyling.name.fontFamily).toBe('Georgia, serif');
      expect(headerStyling.name.fontSize).toBe('2.5rem');
    });

    it('should set and get template overrides', () => {
      const { setTemplateOverride, getTemplateStyling } =
        useResumeStylingStore.getState();

      setTemplateOverride('modern', {
        sections: {
          header: {
            name: {
              fontFamily: 'Helvetica, sans-serif',
              fontSize: '3rem',
              fontWeight: 900,
              lineHeight: 1,
              textTransform: 'none' as const,
              textDecoration: 'none' as const,
            },
          },
        },
      });

      const templateStyling = getTemplateStyling('modern');
      expect(templateStyling.sections.header.name.fontFamily).toBe(
        'Helvetica, sans-serif'
      );
      expect(templateStyling.sections.header.name.fontSize).toBe('3rem');
    });

    it('should get effective styling with template overrides', () => {
      const { setTemplateOverride, getEffectiveStyling } =
        useResumeStylingStore.getState();

      setTemplateOverride('classic', {
        sections: {
          skills: {
            container: {
              display: 'block' as const,
              flexDirection: 'column' as const,
              justifyContent: 'flex-start',
              alignItems: 'flex-start',
              spacing: { margin: '0 0 1rem 0', padding: '0', gap: '0.5rem' },
              border: {
                width: '2px',
                style: 'solid' as const,
                color: '#000000',
                radius: '0',
              },
              background: { color: '#ffffff' },
              shadow: {
                color: 'transparent',
                offsetX: '0',
                offsetY: '0',
                blur: '0',
                spread: '0',
              },
            },
          },
        },
      });

      const effectiveStyling = getEffectiveStyling('classic', 'skills');
      expect(effectiveStyling.container.display).toBe('block');
      expect(effectiveStyling.container.border.width).toBe('2px');
      expect(effectiveStyling.container.border.color).toBe('#000000');
    });

    it('should reset styling', () => {
      const { setGlobalStyling, resetStyling } =
        useResumeStylingStore.getState();

      // Modify styling
      setGlobalStyling({
        page: {
          width: '9in',
          height: '12in',
          margin: '0.25in',
          padding: '0.25in',
          background: { color: '#f8fafc' },
        },
      });

      // Reset styling
      resetStyling();

      const styling = useResumeStylingStore.getState();
      expect(styling.global.page.width).toBe('8.5in'); // Back to default
      expect(styling.global.page.background.color).toBe('#ffffff'); // Back to default
    });
  });

  describe('Performance', () => {
    it('should memoize CSS generation for performance', () => {
      const stylingState = useResumeStylingStore.getState();

      const startTime = performance.now();
      const css1 = generateCompleteCSS(stylingState);
      const midTime = performance.now();
      const css2 = generateCompleteCSS(stylingState);
      const endTime = performance.now();

      expect(css1).toBe(css2); // Should be identical
      expect(midTime - startTime).toBeLessThan(100); // Should be fast
      expect(endTime - midTime).toBeLessThan(50); // Should be even faster on second call
    });
  });
});
