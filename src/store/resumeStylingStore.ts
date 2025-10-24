import { useMemo } from 'react';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

/**
 * Comprehensive styling system for resume templates
 * Centralizes ALL styling details for consistent preview/export
 */

export interface TypographyStyle {
  fontFamily: string;
  fontSize: string;
  fontWeight: string | number;
  lineHeight: string | number;
  letterSpacing?: string;
  textTransform?: 'none' | 'uppercase' | 'lowercase' | 'capitalize';
  textDecoration?: 'none' | 'underline' | 'line-through';
}

export interface SpacingStyle {
  margin: string;
  padding: string;
  gap: string;
}

export interface BorderStyle {
  width: string;
  style: 'none' | 'solid' | 'dashed' | 'dotted' | 'double';
  color: string;
  radius: string;
}

export interface BackgroundStyle {
  color: string;
  image?: string;
  position?: string;
  repeat?: string;
  size?: string;
}

export interface ShadowStyle {
  color: string;
  offsetX: string;
  offsetY: string;
  blur: string;
  spread: string;
}

export interface SectionStyling {
  // Layout
  display: 'block' | 'flex' | 'grid' | 'inline-block';
  flexDirection?: 'row' | 'column' | 'row-reverse' | 'column-reverse';
  justifyContent?:
    | 'flex-start'
    | 'flex-end'
    | 'center'
    | 'space-between'
    | 'space-around'
    | 'space-evenly';
  alignItems?: 'flex-start' | 'flex-end' | 'center' | 'baseline' | 'stretch';
  gridTemplateColumns?: string;
  gridTemplateRows?: string;
  gridGap?: string;

  // Positioning
  position: 'static' | 'relative' | 'absolute' | 'fixed' | 'sticky';
  top?: string;
  right?: string;
  bottom?: string;
  left?: string;
  zIndex?: number;

  // Sizing
  width: string;
  height: string;
  minWidth?: string;
  minHeight?: string;
  maxWidth?: string;
  maxHeight?: string;

  // Spacing
  spacing: SpacingStyle;

  // Colors
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    text: string;
    background: string;
    border: string;
    hover?: string;
    active?: string;
  };

  // Typography
  typography: {
    heading: TypographyStyle;
    subheading: TypographyStyle;
    body: TypographyStyle;
    small: TypographyStyle;
    caption: TypographyStyle;
  };

  // Borders
  border: BorderStyle;

  // Background
  background: BackgroundStyle;

  // Shadow
  shadow: ShadowStyle;

  // Animation
  transition?: string;
  transform?: string;

  // Print-specific
  printStyles?: {
    pageBreak?: 'auto' | 'avoid' | 'always' | 'left' | 'right';
    orphans?: number;
    widows?: number;
    colorAdjust?: 'economy' | 'exact';
  };
}

export interface SkillStyling {
  // Individual skill styling
  container: {
    display: 'inline-block' | 'block' | 'flex';
    spacing: SpacingStyle;
    border: BorderStyle;
    background: BackgroundStyle;
    shadow: ShadowStyle;
  };

  // Skill text styling
  text: TypographyStyle;

  // Skill badge/chip styling
  badge: {
    display: 'inline-block' | 'block';
    spacing: SpacingStyle;
    border: BorderStyle;
    background: BackgroundStyle;
    shadow: ShadowStyle;
    typography: TypographyStyle;
  };

  // Skill category styling
  category: {
    spacing: SpacingStyle;
    typography: TypographyStyle;
    border: BorderStyle;
    background: BackgroundStyle;
  };
}

export interface HeaderStyling {
  // Header container
  container: {
    display: 'flex' | 'block' | 'grid';
    flexDirection?: 'row' | 'column';
    justifyContent?: string;
    alignItems?: string;
    spacing: SpacingStyle;
    border: BorderStyle;
    background: BackgroundStyle;
    shadow: ShadowStyle;
  };

  // Name styling
  name: TypographyStyle;

  // Contact info styling
  contact: {
    container: {
      display: 'flex' | 'block' | 'grid';
      flexDirection?: 'row' | 'column';
      justifyContent?: string;
      alignItems?: string;
      spacing: SpacingStyle;
    };
    item: TypographyStyle;
    icon?: {
      size: string;
      color: string;
      spacing: SpacingStyle;
    };
  };

  // Title/position styling
  title: TypographyStyle;

  // Summary styling
  summary: TypographyStyle;
}

export interface ExperienceStyling {
  // Experience container
  container: {
    display: 'block' | 'flex' | 'grid';
    spacing: SpacingStyle;
  };

  // Individual experience item
  item: {
    display: 'block' | 'flex' | 'grid';
    spacing: SpacingStyle;
    border: BorderStyle;
    background: BackgroundStyle;
    shadow: ShadowStyle;
  };

  // Company name
  company: TypographyStyle;

  // Position title
  position: TypographyStyle;

  // Date range
  date: TypographyStyle;

  // Location
  location: TypographyStyle;

  // Description
  description: TypographyStyle;

  // Achievements list
  achievements: {
    container: {
      spacing: SpacingStyle;
    };
    item: TypographyStyle;
    bullet: {
      style: 'disc' | 'circle' | 'square' | 'none';
      color: string;
      size: string;
    };
  };
}

export interface EducationStyling {
  // Education container
  container: {
    display: 'block' | 'flex' | 'grid';
    spacing: SpacingStyle;
  };

  // Individual education item
  item: {
    display: 'block' | 'flex' | 'grid';
    spacing: SpacingStyle;
    border: BorderStyle;
    background: BackgroundStyle;
    shadow: ShadowStyle;
  };

  // Degree
  degree: TypographyStyle;

  // Institution
  institution: TypographyStyle;

  // Date range
  date: TypographyStyle;

  // GPA
  gpa: TypographyStyle;

  // Achievements
  achievements: {
    container: {
      spacing: SpacingStyle;
    };
    item: TypographyStyle;
  };
}

export interface ProjectStyling {
  // Project container
  container: {
    display: 'block' | 'flex' | 'grid';
    spacing: SpacingStyle;
  };

  // Individual project item
  item: {
    display: 'block' | 'flex' | 'grid';
    spacing: SpacingStyle;
    border: BorderStyle;
    background: BackgroundStyle;
    shadow: ShadowStyle;
  };

  // Project name
  name: TypographyStyle;

  // Project description
  description: TypographyStyle;

  // Technologies
  technologies: {
    container: {
      display: 'flex' | 'block' | 'grid';
      flexWrap?: 'wrap' | 'nowrap';
      spacing: SpacingStyle;
    };
    item: {
      display: 'inline-block' | 'block';
      spacing: SpacingStyle;
      border: BorderStyle;
      background: BackgroundStyle;
      shadow: ShadowStyle;
      typography: TypographyStyle;
    };
  };

  // Project URL
  url: TypographyStyle;

  // Date range
  date: TypographyStyle;
}

export interface ResumeStylingState {
  // Global styling
  global: {
    // Page settings
    page: {
      width: string;
      height: string;
      margin: string;
      padding: string;
      background: BackgroundStyle;
    };

    // Typography scale
    typography: {
      scale: {
        xs: string;
        sm: string;
        base: string;
        lg: string;
        xl: string;
        '2xl': string;
        '3xl': string;
        '4xl': string;
      };
      fontFamily: {
        heading: string;
        body: string;
        mono: string;
      };
      fontWeight: {
        light: number;
        normal: number;
        medium: number;
        semibold: number;
        bold: number;
        extrabold: number;
      };
    };

    // Color palette
    colors: {
      primary: {
        50: string;
        100: string;
        200: string;
        300: string;
        400: string;
        500: string;
        600: string;
        700: string;
        800: string;
        900: string;
      };
      secondary: {
        50: string;
        100: string;
        200: string;
        300: string;
        400: string;
        500: string;
        600: string;
        700: string;
        800: string;
        900: string;
      };
      neutral: {
        50: string;
        100: string;
        200: string;
        300: string;
        400: string;
        500: string;
        600: string;
        700: string;
        800: string;
        900: string;
      };
    };

    // Spacing scale
    spacing: {
      0: string;
      1: string;
      2: string;
      3: string;
      4: string;
      5: string;
      6: string;
      8: string;
      10: string;
      12: string;
      16: string;
      20: string;
      24: string;
      32: string;
      40: string;
      48: string;
      56: string;
      64: string;
    };
  };

  // Section-specific styling
  sections: {
    header: HeaderStyling;
    experience: ExperienceStyling;
    education: EducationStyling;
    skills: SkillStyling;
    projects: ProjectStyling;
    achievements: {
      container: {
        display: 'block' | 'flex' | 'grid';
        spacing: SpacingStyle;
      };
      item: TypographyStyle;
      bullet: {
        style: 'disc' | 'circle' | 'square' | 'none';
        color: string;
        size: string;
      };
    };
  };

  // Template-specific overrides
  templateOverrides: {
    [templateId: string]: Partial<ResumeStylingState>;
  };

  // Actions
  setGlobalStyling: (styling: Partial<ResumeStylingState['global']>) => void;
  setSectionStyling: (
    sectionId: keyof ResumeStylingState['sections'],
    styling: Partial<
      ResumeStylingState['sections'][keyof ResumeStylingState['sections']]
    >
  ) => void;
  setTemplateOverride: (
    templateId: string,
    override: Partial<ResumeStylingState>
  ) => void;
  resetStyling: () => void;
  resetSectionStyling: (
    sectionId: keyof ResumeStylingState['sections']
  ) => void;
  resetTemplateOverride: (templateId: string) => void;

  // Getters
  getSectionStyling: (
    sectionId: keyof ResumeStylingState['sections']
  ) => ResumeStylingState['sections'][keyof ResumeStylingState['sections']];
  getTemplateStyling: (templateId: string) => ResumeStylingState;
  getEffectiveStyling: (
    templateId: string,
    sectionId?: keyof ResumeStylingState['sections']
  ) =>
    | ResumeStylingState
    | ResumeStylingState['sections'][keyof ResumeStylingState['sections']];
}

// Default styling configuration
const defaultStyling: ResumeStylingState = {
  global: {
    page: {
      width: '8.5in',
      height: '11in',
      margin: '0.5in',
      padding: '0.5in',
      background: {
        color: '#ffffff',
      },
    },
    typography: {
      scale: {
        xs: '0.75rem',
        sm: '0.875rem',
        base: '1rem',
        lg: '1.125rem',
        xl: '1.25rem',
        '2xl': '1.5rem',
        '3xl': '1.875rem',
        '4xl': '2.25rem',
      },
      fontFamily: {
        heading: 'Inter, system-ui, sans-serif',
        body: 'Inter, system-ui, sans-serif',
        mono: 'JetBrains Mono, monospace',
      },
      fontWeight: {
        light: 300,
        normal: 400,
        medium: 500,
        semibold: 600,
        bold: 700,
        extrabold: 800,
      },
    },
    colors: {
      primary: {
        50: '#eff6ff',
        100: '#dbeafe',
        200: '#bfdbfe',
        300: '#93c5fd',
        400: '#60a5fa',
        500: '#3b82f6',
        600: '#2563eb',
        700: '#1d4ed8',
        800: '#1e40af',
        900: '#1e3a8a',
      },
      secondary: {
        50: '#f8fafc',
        100: '#f1f5f9',
        200: '#e2e8f0',
        300: '#cbd5e1',
        400: '#94a3b8',
        500: '#64748b',
        600: '#475569',
        700: '#334155',
        800: '#1e293b',
        900: '#0f172a',
      },
      neutral: {
        50: '#fafafa',
        100: '#f4f4f5',
        200: '#e4e4e7',
        300: '#d4d4d8',
        400: '#a1a1aa',
        500: '#71717a',
        600: '#52525b',
        700: '#3f3f46',
        800: '#27272a',
        900: '#18181b',
      },
    },
    spacing: {
      0: '0',
      1: '0.25rem',
      2: '0.5rem',
      3: '0.75rem',
      4: '1rem',
      5: '1.25rem',
      6: '1.5rem',
      8: '2rem',
      10: '2.5rem',
      12: '3rem',
      16: '4rem',
      20: '5rem',
      24: '6rem',
      32: '8rem',
      40: '10rem',
      48: '12rem',
      56: '14rem',
      64: '16rem',
    },
  },
  sections: {
    header: {
      container: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        spacing: { margin: '0 0 2rem 0', padding: '0', gap: '1rem' },
        border: {
          width: '0',
          style: 'none',
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
        fontFamily: 'Inter, system-ui, sans-serif',
        fontSize: '2rem',
        fontWeight: 700,
        lineHeight: 1.2,
        letterSpacing: '-0.025em',
        textTransform: 'none',
        textDecoration: 'none',
      },
      contact: {
        container: {
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          spacing: { margin: '0', padding: '0', gap: '1rem' },
        },
        item: {
          fontFamily: 'Inter, system-ui, sans-serif',
          fontSize: '0.875rem',
          fontWeight: 400,
          lineHeight: 1.4,
          textTransform: 'none',
          textDecoration: 'none',
        },
        icon: {
          size: '1rem',
          color: '#64748b',
          spacing: { margin: '0 0.25rem 0 0', padding: '0', gap: '0' },
        },
      },
      title: {
        fontFamily: 'Inter, system-ui, sans-serif',
        fontSize: '1.125rem',
        fontWeight: 500,
        lineHeight: 1.4,
        textTransform: 'none',
        textDecoration: 'none',
      },
      summary: {
        fontFamily: 'Inter, system-ui, sans-serif',
        fontSize: '1rem',
        fontWeight: 400,
        lineHeight: 1.6,
        textTransform: 'none',
        textDecoration: 'none',
      },
    },
    experience: {
      container: {
        display: 'block',
        spacing: { margin: '0 0 2rem 0', padding: '0', gap: '0' },
      },
      item: {
        display: 'block',
        spacing: { margin: '0 0 1.5rem 0', padding: '0', gap: '0' },
        border: {
          width: '0',
          style: 'none',
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
      company: {
        fontFamily: 'Inter, system-ui, sans-serif',
        fontSize: '1.125rem',
        fontWeight: 600,
        lineHeight: 1.4,
        textTransform: 'none',
        textDecoration: 'none',
      },
      position: {
        fontFamily: 'Inter, system-ui, sans-serif',
        fontSize: '1rem',
        fontWeight: 500,
        lineHeight: 1.4,
        textTransform: 'none',
        textDecoration: 'none',
      },
      date: {
        fontFamily: 'Inter, system-ui, sans-serif',
        fontSize: '0.875rem',
        fontWeight: 400,
        lineHeight: 1.4,
        textTransform: 'none',
        textDecoration: 'none',
      },
      location: {
        fontFamily: 'Inter, system-ui, sans-serif',
        fontSize: '0.875rem',
        fontWeight: 400,
        lineHeight: 1.4,
        textTransform: 'none',
        textDecoration: 'none',
      },
      description: {
        fontFamily: 'Inter, system-ui, sans-serif',
        fontSize: '0.875rem',
        fontWeight: 400,
        lineHeight: 1.6,
        textTransform: 'none',
        textDecoration: 'none',
      },
      achievements: {
        container: {
          spacing: { margin: '0.5rem 0 0 0', padding: '0', gap: '0' },
        },
        item: {
          fontFamily: 'Inter, system-ui, sans-serif',
          fontSize: '0.875rem',
          fontWeight: 400,
          lineHeight: 1.6,
          textTransform: 'none',
          textDecoration: 'none',
        },
        bullet: {
          style: 'disc',
          color: '#3b82f6',
          size: '0.5rem',
        },
      },
    },
    education: {
      container: {
        display: 'block',
        spacing: { margin: '0 0 2rem 0', padding: '0', gap: '0' },
      },
      item: {
        display: 'block',
        spacing: { margin: '0 0 1.5rem 0', padding: '0', gap: '0' },
        border: {
          width: '0',
          style: 'none',
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
      degree: {
        fontFamily: 'Inter, system-ui, sans-serif',
        fontSize: '1.125rem',
        fontWeight: 600,
        lineHeight: 1.4,
        textTransform: 'none',
        textDecoration: 'none',
      },
      institution: {
        fontFamily: 'Inter, system-ui, sans-serif',
        fontSize: '1rem',
        fontWeight: 500,
        lineHeight: 1.4,
        textTransform: 'none',
        textDecoration: 'none',
      },
      date: {
        fontFamily: 'Inter, system-ui, sans-serif',
        fontSize: '0.875rem',
        fontWeight: 400,
        lineHeight: 1.4,
        textTransform: 'none',
        textDecoration: 'none',
      },
      gpa: {
        fontFamily: 'Inter, system-ui, sans-serif',
        fontSize: '0.875rem',
        fontWeight: 400,
        lineHeight: 1.4,
        textTransform: 'none',
        textDecoration: 'none',
      },
      achievements: {
        container: {
          spacing: { margin: '0.5rem 0 0 0', padding: '0', gap: '0' },
        },
        item: {
          fontFamily: 'Inter, system-ui, sans-serif',
          fontSize: '0.875rem',
          fontWeight: 400,
          lineHeight: 1.6,
          textTransform: 'none',
          textDecoration: 'none',
        },
      },
    },
    skills: {
      container: {
        display: 'inline-block',
        spacing: {
          margin: '0.25rem 0.5rem 0.25rem 0',
          padding: '0.5rem 1rem',
          gap: '0',
        },
        border: {
          width: '1px',
          style: 'solid',
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
        fontFamily: 'Inter, system-ui, sans-serif',
        fontSize: '0.875rem',
        fontWeight: 500,
        lineHeight: 1.4,
        textTransform: 'none',
        textDecoration: 'none',
      },
      badge: {
        display: 'inline-block',
        spacing: {
          margin: '0.25rem 0.5rem 0.25rem 0',
          padding: '0.5rem 1rem',
          gap: '0',
        },
        border: {
          width: '1px',
          style: 'solid',
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
          fontFamily: 'Inter, system-ui, sans-serif',
          fontSize: '0.875rem',
          fontWeight: 500,
          lineHeight: 1.4,
          textTransform: 'none',
          textDecoration: 'none',
        },
      },
      category: {
        spacing: { margin: '0 0 1rem 0', padding: '0', gap: '0' },
        typography: {
          fontFamily: 'Inter, system-ui, sans-serif',
          fontSize: '1rem',
          fontWeight: 600,
          lineHeight: 1.4,
          textTransform: 'none',
          textDecoration: 'none',
        },
        border: {
          width: '0',
          style: 'none',
          color: 'transparent',
          radius: '0',
        },
        background: { color: 'transparent' },
      },
    },
    projects: {
      container: {
        display: 'block',
        spacing: { margin: '0 0 2rem 0', padding: '0', gap: '0' },
      },
      item: {
        display: 'block',
        spacing: { margin: '0 0 1.5rem 0', padding: '0', gap: '0' },
        border: {
          width: '0',
          style: 'none',
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
        fontFamily: 'Inter, system-ui, sans-serif',
        fontSize: '1.125rem',
        fontWeight: 600,
        lineHeight: 1.4,
        textTransform: 'none',
        textDecoration: 'none',
      },
      description: {
        fontFamily: 'Inter, system-ui, sans-serif',
        fontSize: '0.875rem',
        fontWeight: 400,
        lineHeight: 1.6,
        textTransform: 'none',
        textDecoration: 'none',
      },
      technologies: {
        container: {
          display: 'flex',
          flexWrap: 'wrap',
          spacing: { margin: '0.5rem 0 0 0', padding: '0', gap: '0.5rem' },
        },
        item: {
          display: 'inline-block',
          spacing: { margin: '0', padding: '0.25rem 0.5rem', gap: '0' },
          border: {
            width: '1px',
            style: 'solid',
            color: '#64748b',
            radius: '0.25rem',
          },
          background: { color: '#f1f5f9' },
          shadow: {
            color: 'transparent',
            offsetX: '0',
            offsetY: '0',
            blur: '0',
            spread: '0',
          },
          typography: {
            fontFamily: 'Inter, system-ui, sans-serif',
            fontSize: '0.75rem',
            fontWeight: 500,
            lineHeight: 1.4,
            textTransform: 'none',
            textDecoration: 'none',
          },
        },
      },
      url: {
        fontFamily: 'Inter, system-ui, sans-serif',
        fontSize: '0.875rem',
        fontWeight: 400,
        lineHeight: 1.4,
        textTransform: 'none',
        textDecoration: 'underline',
      },
      date: {
        fontFamily: 'Inter, system-ui, sans-serif',
        fontSize: '0.875rem',
        fontWeight: 400,
        lineHeight: 1.4,
        textTransform: 'none',
        textDecoration: 'none',
      },
    },
    achievements: {
      container: {
        display: 'block',
        spacing: { margin: '0 0 2rem 0', padding: '0', gap: '0' },
      },
      item: {
        fontFamily: 'Inter, system-ui, sans-serif',
        fontSize: '0.875rem',
        fontWeight: 400,
        lineHeight: 1.6,
        textTransform: 'none',
        textDecoration: 'none',
      },
      bullet: {
        style: 'disc',
        color: '#3b82f6',
        size: '0.5rem',
      },
    },
  },
  templateOverrides: {},

  // Actions
  setGlobalStyling: () => {},
  setSectionStyling: () => {},
  setTemplateOverride: () => {},
  resetStyling: () => {},
  resetSectionStyling: () => {},
  resetTemplateOverride: () => {},

  // Getters
  getSectionStyling: () => ({}) as Record<string, unknown>,
  getTemplateStyling: () => ({}) as Record<string, unknown>,
  getEffectiveStyling: () => ({}) as Record<string, unknown>,
};

export const useResumeStylingStore = create<ResumeStylingState>()(
  persist(
    (set, get) => ({
      ...defaultStyling,

      // Actions
      setGlobalStyling: styling =>
        set(state => ({
          global: { ...state.global, ...styling },
        })),

      setSectionStyling: (sectionId, styling) =>
        set(state => ({
          sections: {
            ...state.sections,
            [sectionId]: { ...state.sections[sectionId], ...styling },
          },
        })),

      setTemplateOverride: (templateId, override) =>
        set(state => ({
          templateOverrides: {
            ...state.templateOverrides,
            [templateId]: {
              ...state.templateOverrides[templateId],
              ...override,
            },
          },
        })),

      resetStyling: () => set(defaultStyling),

      resetSectionStyling: sectionId =>
        set(state => ({
          sections: {
            ...state.sections,
            [sectionId]: defaultStyling.sections[sectionId],
          },
        })),

      resetTemplateOverride: templateId =>
        set(state => {
          const { [templateId]: _, ...rest } = state.templateOverrides;
          void _; // Suppress unused variable warning
          return { templateOverrides: rest };
        }),

      // Getters
      getSectionStyling: sectionId => {
        const state = get();
        return state.sections[sectionId];
      },

      getTemplateStyling: templateId => {
        const state = get();
        const override = state.templateOverrides[templateId];
        if (!override) return state;

        return {
          ...state,
          ...override,
          sections: {
            ...state.sections,
            ...override.sections,
          },
        };
      },

      getEffectiveStyling: (templateId, sectionId) => {
        const state = get();
        const templateStyling = state.getTemplateStyling(templateId);

        if (sectionId) {
          return templateStyling.sections[sectionId];
        }

        return templateStyling;
      },
    }),
    {
      name: 'resume-styling-store',
      storage: createJSONStorage(() => localStorage),
      // Persist all styling data
      partialize: state => state,
    }
  )
);

// Selectors for better performance
export const useGlobalStyling = () =>
  useResumeStylingStore(state => state.global);
export const useSectionStyling = (
  sectionId: keyof ResumeStylingState['sections']
) => useResumeStylingStore(state => state.sections[sectionId]);
export const useTemplateStyling = (templateId: string) =>
  useResumeStylingStore(state => state.getTemplateStyling(templateId));
export const useEffectiveStyling = (
  templateId: string,
  sectionId?: keyof ResumeStylingState['sections']
) =>
  useResumeStylingStore(state =>
    state.getEffectiveStyling(templateId, sectionId)
  );

// Action selectors
export const useStylingActions = () => {
  const setGlobalStyling = useResumeStylingStore(
    state => state.setGlobalStyling
  );
  const setSectionStyling = useResumeStylingStore(
    state => state.setSectionStyling
  );
  const setTemplateOverride = useResumeStylingStore(
    state => state.setTemplateOverride
  );
  const resetStyling = useResumeStylingStore(state => state.resetStyling);
  const resetSectionStyling = useResumeStylingStore(
    state => state.resetSectionStyling
  );
  const resetTemplateOverride = useResumeStylingStore(
    state => state.resetTemplateOverride
  );

  return useMemo(
    () => ({
      setGlobalStyling,
      setSectionStyling,
      setTemplateOverride,
      resetStyling,
      resetSectionStyling,
      resetTemplateOverride,
    }),
    [
      setGlobalStyling,
      setSectionStyling,
      setTemplateOverride,
      resetStyling,
      resetSectionStyling,
      resetTemplateOverride,
    ]
  );
};
