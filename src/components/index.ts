// ============================================================================
// COMPONENTS - Main export file for all components
// ============================================================================

// Export all atoms
export * from './atoms';

// Export all molecules
export * from './molecules';

// Export all organisms
export * from './organisms';

// Export auth components
export * from './auth';

// Export legacy components (for backward compatibility)
export * from './layout';
export * from './resume';
export * from './sections';

// Export UI components with explicit names to avoid conflicts
export {
  AnimatedProgress,
  AnimatedScore,
  Card,
  DataVisualization,
  Icons,
  Loading,
  ProgressSteps,
  SVG,
  Section,
  Tabs,
  Toast,
} from './ui';

// Export new molecules
export { ActionButton, FormField, StatusBadge } from './molecules';

// Types are available from @/types directly
