// Analytics types

export interface AnalyticsEventData {
  type?: string;
  category?: string;
  action?: string;
  label?: string;
  value?: number;
  properties?: Record<string, any>;
  event_name?: string;
  event_category?: string;
  event_label?: string;
  custom_parameters?: Record<string, any>;
  [key: string]: any;
}

export interface AnalyticsProvider {
  track(event: AnalyticsEventData): void;
  identify(userId: string, traits?: Record<string, any>): void;
  page(name: string, properties?: Record<string, any>): void;
  trackEvent(event: AnalyticsEventData): void;
  trackPageView(url: string, title: string): void;
  setUserProperties(properties: Record<string, any>): void;
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
  properties: Record<string, any>;
  timestamp: number;
  sessionId: string;
  userId?: string;
}

export interface ComponentInteraction {
  component: string;
  action: string;
  properties?: Record<string, any>;
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
