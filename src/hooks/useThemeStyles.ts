/**
 * Theme Hook
 * Custom hook for theme-aware styling and utilities
 */

import { useTheme } from '@/contexts/ThemeContext';
import {
  getConditionalThemeClasses,
  getErrorClasses,
  getGradientBackground,
  getSuccessClasses,
  getTabButtonClasses,
  getThemeClasses,
} from '@/lib/utils/themeUtils';

export const useThemeStyles = () => {
  const { theme, toggleTheme, setTheme } = useTheme();

  return {
    theme,
    toggleTheme,
    setTheme,

    // Theme-aware class utilities
    getThemeClass: (lightClass: string, darkClass: string) =>
      getConditionalThemeClasses(theme, lightClass, darkClass),

    // Get theme classes
    getThemeClasses: () => getThemeClasses(theme),

    // Get gradient background
    getGradientBackground: () => getGradientBackground(theme),

    // Get tab button classes
    getTabButtonClasses: (isActive: boolean, isDisabled?: boolean) =>
      getTabButtonClasses(theme, isActive, isDisabled),

    // Get error classes
    getErrorClasses: () => getErrorClasses(theme),

    // Get success classes
    getSuccessClasses: () => getSuccessClasses(theme),
  };
};

export default useThemeStyles;
