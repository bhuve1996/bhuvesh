/**
 * Navigation Design System
 * Consistent styling, spacing, and responsive behavior for navigation components
 */

// ============================================================================
// NAVIGATION SPACING SYSTEM
// ============================================================================

export const navigationSpacing = {
  // Container padding
  container: {
    mobile: 'px-4 py-3',
    tablet: 'px-6 py-4',
    desktop: 'px-8 py-4',
  },

  // Item spacing
  items: {
    mobile: 'space-x-2',
    tablet: 'space-x-3',
    desktop: 'space-x-4',
  },

  // Item padding
  itemPadding: {
    mobile: 'px-4 py-2 text-sm',
    tablet: 'px-5 py-2 text-sm',
    desktop: 'px-6 py-2 text-base',
  },

  // Dropdown spacing
  dropdown: {
    mobile: 'mt-2 p-2',
    tablet: 'mt-3 p-3',
    desktop: 'mt-4 p-4',
  },
} as const;

// ============================================================================
// NAVIGATION SIZING SYSTEM
// ============================================================================

export const navigationSizing = {
  // Logo sizes
  logo: {
    mobile: 'w-24 h-8',
    tablet: 'w-28 h-10',
    desktop: 'w-32 h-12',
  },

  // Button sizes
  button: {
    mobile: 'h-8 px-4 text-xs min-w-[2rem]',
    tablet: 'h-9 px-5 text-sm min-w-[2.25rem]',
    desktop: 'h-10 px-6 text-base min-w-[2.5rem]',
  },

  // Icon sizes
  icon: {
    mobile: 'w-4 h-4 flex-shrink-0',
    tablet: 'w-4 h-4 flex-shrink-0',
    desktop: 'w-5 h-5 flex-shrink-0',
  },

  // Mobile menu
  mobileMenu: {
    itemHeight: 'h-12',
    itemPadding: 'px-4 py-3',
  },
} as const;

// ============================================================================
// NAVIGATION THEME SYSTEM
// ============================================================================

export const navigationThemes = {
  light: {
    background: 'bg-white/95 backdrop-blur-md',
    border: 'border-gray-200',
    text: {
      primary: 'text-gray-900',
      secondary: 'text-gray-600',
      hover: 'text-blue-600',
      active: 'text-blue-700',
    },
    button: {
      primary: 'bg-blue-600 hover:bg-blue-700 text-white',
      secondary: 'bg-gray-100 hover:bg-gray-200 text-gray-700',
      ghost: 'text-gray-600 hover:text-blue-600 hover:bg-blue-50',
    },
    dropdown: {
      background: 'bg-white',
      border: 'border-gray-200',
      shadow: 'shadow-lg',
    },
  },
  dark: {
    background: 'bg-gray-900/95 backdrop-blur-md',
    border: 'border-gray-700',
    text: {
      primary: 'text-white',
      secondary: 'text-gray-300',
      hover: 'text-blue-400',
      active: 'text-blue-300',
    },
    button: {
      primary: 'bg-blue-600 hover:bg-blue-700 text-white',
      secondary: 'bg-gray-800 hover:bg-gray-700 text-gray-200',
      ghost: 'text-gray-300 hover:text-blue-400 hover:bg-blue-900/20',
    },
    dropdown: {
      background: 'bg-gray-800',
      border: 'border-gray-700',
      shadow: 'shadow-xl',
    },
  },
} as const;

// ============================================================================
// NAVIGATION RESPONSIVE BREAKPOINTS
// ============================================================================

export const navigationBreakpoints = {
  mobile: 'max-md',
  tablet: 'md:max-lg',
  desktop: 'lg:',
} as const;

// ============================================================================
// NAVIGATION COMPONENT CLASSES
// ============================================================================

export const navigationClasses = {
  // Main container
  container: 'w-full sticky top-0 z-50 transition-all duration-300',

  // Navigation bar
  nav: 'flex items-center justify-between min-h-[3.5rem] md:min-h-[4rem] lg:min-h-[4.5rem] px-4 md:px-6 lg:px-8',

  // Logo container
  logo: 'flex-shrink-0 transition-transform duration-300 hover:scale-105',

  // Desktop navigation
  desktopNav: 'hidden lg:flex items-center space-x-4 flex-1 justify-center',

  // Tablet navigation
  tabletNav:
    'hidden md:flex lg:hidden items-center space-x-3 flex-1 justify-center',

  // Mobile controls
  mobileControls: 'md:hidden flex items-center space-x-3 flex-shrink-0',

  // Mobile menu
  mobileMenu: 'lg:hidden overflow-hidden transition-all duration-300',

  // User controls alignment
  userControls: 'flex items-center gap-3 h-full flex-shrink-0',
  userControlsDesktop:
    'flex items-center gap-4 h-full min-h-[2.5rem] flex-shrink-0',
  userControlsTablet:
    'flex items-center gap-2 h-full min-h-[2.25rem] flex-shrink-0',
  userControlsMobile: 'flex items-center gap-3 min-h-[2rem] flex-shrink-0',

  // Navigation items
  navItem:
    'relative group transition-all duration-300 flex items-center justify-center',

  // Active state
  active: 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20',

  // Hover state
  hover:
    'hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-800/50',

  // Focus state
  focus:
    'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900',

  // Dropdown
  dropdown: 'absolute right-0 mt-2 w-48 rounded-lg border shadow-lg z-50',

  // Mobile menu items
  mobileItem: 'block w-full text-left transition-colors duration-200',
} as const;

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

export const getNavigationClasses = (
  theme: 'light' | 'dark',
  screenSize: 'mobile' | 'tablet' | 'desktop'
) => {
  const themeConfig = navigationThemes[theme];
  const spacing = navigationSpacing.container[screenSize];

  return {
    container: `${navigationClasses.container} ${themeConfig.background} ${themeConfig.border} border-b`,
    nav: `${navigationClasses.nav} ${spacing}`,
    logo: navigationClasses.logo,
    desktopNav: navigationClasses.desktopNav,
    tabletNav: navigationClasses.tabletNav,
    mobileControls: navigationClasses.mobileControls,
    mobileMenu: navigationClasses.mobileMenu,
    navItem: `${navigationClasses.navItem} ${navigationSpacing.itemPadding[screenSize]} ${themeConfig.text.primary} ${navigationClasses.hover} ${navigationClasses.focus}`,
    active: `${navigationClasses.active} ${themeConfig.text.active}`,
    dropdown: `${navigationClasses.dropdown} ${themeConfig.dropdown.background} ${themeConfig.dropdown.border} ${themeConfig.dropdown.shadow}`,
    mobileItem: `${navigationClasses.mobileItem} ${navigationSizing.mobileMenu.itemPadding} ${themeConfig.text.primary} ${navigationClasses.hover}`,
    userControls:
      screenSize === 'desktop'
        ? navigationClasses.userControlsDesktop
        : screenSize === 'tablet'
          ? navigationClasses.userControlsTablet
          : navigationClasses.userControlsMobile,
  };
};

export const getButtonClasses = (
  variant: 'primary' | 'secondary' | 'ghost',
  theme: 'light' | 'dark',
  screenSize: 'mobile' | 'tablet' | 'desktop'
) => {
  const themeConfig = navigationThemes[theme];
  const buttonSize = navigationSizing.button[screenSize];

  return `${buttonSize} rounded-lg font-medium transition-all duration-200 ${navigationClasses.focus} ${themeConfig.button[variant]}`;
};

export const getLogoClasses = (screenSize: 'mobile' | 'tablet' | 'desktop') => {
  return `${navigationSizing.logo[screenSize]} object-contain transition-transform duration-300 hover:scale-105`;
};
