/**
 * Analytics Module Exports
 * Central export file for all analytics functionality
 */

// Core analytics
export { analytics } from './analytics';
export {
  ANALYTICS_EVENTS,
  ANALYTICS_PARAMETERS,
  analyticsConfig,
} from './config';

// Types
export type {
  AnalyticsContextType,
  AnalyticsEventData,
  AnalyticsState,
  ErrorEvent,
  InteractionEvent,
  NavigationEvent,
  PageViewEvent,
  PerformanceEvent,
  ResumeBuilderEvent,
  TemplateEvent,
  UserSession,
} from './types';

// Providers
export { ConsoleAnalyticsProvider } from './providers/console-analytics';
export { GoogleAnalyticsProvider } from './providers/google-analytics';

// Specialized analytics
export { ResumeAnalytics } from './resume-analytics';
export { TemplateAnalytics } from './template-analytics';

// React hooks and context
export {
  AnalyticsProvider,
  useAnalyticsContext,
  withAnalytics,
} from '../../contexts/AnalyticsContext';
export { useAnalytics } from '../../hooks/useAnalytics';
