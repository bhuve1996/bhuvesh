// Analytics types

export interface AnalyticsEventData {
  type?: string;
  category?: string;
  action?: string;
  label?: string;
  value?: number;
  properties?: Record<string, unknown>;
  event_name?: string;
  event_category?: string;
  event_label?: string;
  custom_parameters?: Record<string, unknown>;
  [key: string]: unknown;
}

export interface AnalyticsProvider {
  track(event: AnalyticsEventData): void;
  identify(userId: string, traits?: Record<string, unknown>): void;
  page(name: string, properties?: Record<string, unknown>): void;
  trackEvent(event: AnalyticsEventData): void;
  trackPageView(url: string, title: string): void;
  setUserProperties(properties: Record<string, unknown>): void;
  setUserId(userId: string): void;
  name: string;
}

export interface AnalyticsConfig {
  enabled: boolean;
  debug: boolean;
  trackPageViews: boolean;
  trackUserInteractions: boolean;
  trackPerformance: boolean;
  trackErrors: boolean;
}

export interface AnalyticsEvent {
  type: string;
  category: string;
  action: string;
  label?: string;
  value?: number;
  properties: Record<string, string | number | boolean | null>;
  timestamp: number;
  sessionId: string;
  userId?: string;
}

export interface ComponentInteraction {
  component: string;
  action: string;
  properties?: Record<string, unknown>;
}

export interface PerformanceMetric {
  name: string;
  value: number;
  unit: string;
  timestamp: number;
}

export interface UserEngagement {
  sessionId: string;
  userId?: string;
  startTime: number;
  endTime?: number;
  pageViews: number;
  interactions: number;
  events: AnalyticsEvent[];
}

export interface UserSession {
  id: string;
  startTime: number;
  endTime?: number;
  pageViews: number;
  events: number;
}
