/**
 * Analytics Types
 * TypeScript definitions for analytics events and data structures
 * Consolidated from src/lib/analytics/types.ts
 */

export interface BaseAnalyticsEvent {
  event_name: string;
  event_category?: string;
  event_label?: string;
  value?: number;
  custom_parameters?: Record<string, unknown>;
}

export interface PageViewEvent extends BaseAnalyticsEvent {
  event_name: 'page_view';
  page_title: string;
  page_path: string;
  page_url: string;
}

export interface NavigationEvent extends BaseAnalyticsEvent {
  event_name: 'navigation';
  navigation_type: 'internal' | 'external';
  destination: string;
  source: string;
}

export interface ResumeBuilderEvent extends BaseAnalyticsEvent {
  event_name: string;
  template_id?: string;
  template_name?: string;
  template_category?: string;
  section_type?: string;
  section_index?: number;
  content_length?: number;
  ai_provider?: string;
  export_format?: string;
  export_size?: number;
}

export interface TemplateEvent extends BaseAnalyticsEvent {
  event_name: string;
  template_id: string;
  template_name: string;
  template_category: string;
  filter_applied?: string;
  search_query?: string;
}

export interface InteractionEvent extends BaseAnalyticsEvent {
  event_name: string;
  element_id?: string;
  element_text?: string;
  element_position?: string;
  click_coordinates?: { x: number; y: number };
  scroll_percentage?: number;
  time_spent?: number;
}

export interface ErrorEvent extends BaseAnalyticsEvent {
  event_name: string;
  error_message: string;
  error_type: string;
  error_stack?: string;
  api_endpoint?: string;
  http_status?: number;
}

export interface PerformanceEvent extends BaseAnalyticsEvent {
  event_name: string;
  load_time?: number;
  dom_content_loaded?: number;
  first_contentful_paint?: number;
  largest_contentful_paint?: number;
  cumulative_layout_shift?: number;
}

export type AnalyticsEventData =
  | PageViewEvent
  | NavigationEvent
  | ResumeBuilderEvent
  | TemplateEvent
  | InteractionEvent
  | ErrorEvent
  | PerformanceEvent;

export interface AnalyticsProvider {
  name: string;
  enabled: boolean;
  trackEvent: (event: AnalyticsEventData) => void;
  trackPageView: (url: string, title: string) => void;
  setUserProperties: (properties: Record<string, unknown>) => void;
  setUserId: (userId: string) => void;
}

export interface AnalyticsContextType {
  trackEvent: (event: AnalyticsEventData) => void;
  trackPageView: (url: string, title: string) => void;
  setUserProperties: (properties: Record<string, unknown>) => void;
  setUserId: (userId: string) => void;
  isEnabled: boolean;
}

export interface ScrollDepthEvent extends BaseAnalyticsEvent {
  event_name: 'scroll_depth';
  scroll_percentage: number;
  page_height: number;
  viewport_height: number;
}

export interface TimeOnPageEvent extends BaseAnalyticsEvent {
  event_name: 'time_on_page';
  time_spent: number;
  page_url: string;
  page_title: string;
}

export interface UserSession {
  session_id: string;
  user_id?: string;
  start_time: number;
  last_activity: number;
  page_views: number;
  events: number;
  referrer?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
}

export interface AnalyticsState {
  session: UserSession;
  isInitialized: boolean;
  providers: AnalyticsProvider[];
  debugMode: boolean;
}
