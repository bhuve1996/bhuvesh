// ============================================================================
// ANALYTICS UTILITIES - Centralized analytics tracking and monitoring
// ============================================================================

// Analytics event types
export type AnalyticsEventType =
  | 'page_view'
  | 'component_interaction'
  | 'form_submission'
  | 'file_upload'
  | 'ats_analysis'
  | 'ai_improvement'
  | 'template_change'
  | 'export_action'
  | 'error_occurred'
  | 'performance_metric'
  | 'user_engagement'
  | 'feature_usage';

// Analytics event properties
export interface AnalyticsEvent {
  type: AnalyticsEventType;
  category: string;
  action: string;
  label?: string;
  value?: number;
  properties?: Record<string, any>;
  timestamp?: number;
  userId?: string;
  sessionId?: string;
}

// Component interaction tracking
export interface ComponentInteraction {
  componentName: string;
  componentType: 'atom' | 'molecule' | 'organism';
  interactionType: 'click' | 'hover' | 'focus' | 'blur' | 'change' | 'submit';
  elementId?: string;
  elementClass?: string;
  properties?: Record<string, any>;
}

// Performance metrics
export interface PerformanceMetric {
  metricName: string;
  value: number;
  unit: 'ms' | 'bytes' | 'count' | 'percentage';
  timestamp: number;
  properties?: Record<string, any>;
}

// User engagement tracking
export interface UserEngagement {
  engagementType:
    | 'scroll_depth'
    | 'time_on_page'
    | 'click_frequency'
    | 'session_duration';
  value: number;
  properties?: Record<string, any>;
}

// Analytics configuration
export interface AnalyticsConfig {
  enabled: boolean;
  debug: boolean;
  trackPageViews: boolean;
  trackComponentInteractions: boolean;
  trackPerformance: boolean;
  trackUserEngagement: boolean;
  sampleRate: number; // 0-1, percentage of events to track
  batchSize: number;
  flushInterval: number; // milliseconds
}

// Default configuration
const defaultConfig: AnalyticsConfig = {
  enabled: true,
  debug: process.env.NODE_ENV === 'development',
  trackPageViews: true,
  trackComponentInteractions: true,
  trackPerformance: true,
  trackUserEngagement: true,
  sampleRate: 1.0,
  batchSize: 10,
  flushInterval: 5000,
};

class AnalyticsManager {
  private config: AnalyticsConfig;
  private eventQueue: AnalyticsEvent[] = [];
  private flushTimer: NodeJS.Timeout | null = null;
  private sessionId: string;
  private userId: string | null = null;

  constructor(config: Partial<AnalyticsConfig> = {}) {
    this.config = { ...defaultConfig, ...config };
    this.sessionId = this.generateSessionId();
    this.initializeFlushTimer();
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private initializeFlushTimer(): void {
    if (this.config.enabled && this.config.flushInterval > 0) {
      this.flushTimer = setInterval(() => {
        this.flush();
      }, this.config.flushInterval);
    }
  }

  private shouldTrack(): boolean {
    if (!this.config.enabled) return false;
    return Math.random() < this.config.sampleRate;
  }

  private createEvent(
    type: AnalyticsEventType,
    category: string,
    action: string,
    properties?: Record<string, any>
  ): AnalyticsEvent {
    return {
      type,
      category,
      action,
      timestamp: Date.now(),
      sessionId: this.sessionId,
      userId: this.userId || undefined,
      properties,
    };
  }

  // Public methods
  public setUserId(userId: string): void {
    this.userId = userId;
  }

  public trackPageView(page: string, properties?: Record<string, any>): void {
    if (!this.shouldTrack() || !this.config.trackPageViews) return;

    const event = this.createEvent('page_view', 'navigation', 'page_view', {
      page,
      ...properties,
    });

    this.queueEvent(event);
  }

  public trackComponentInteraction(interaction: ComponentInteraction): void {
    if (!this.shouldTrack() || !this.config.trackComponentInteractions) return;

    const event = this.createEvent(
      'component_interaction',
      'component',
      interaction.interactionType,
      {
        componentName: interaction.componentName,
        componentType: interaction.componentType,
        elementId: interaction.elementId,
        elementClass: interaction.elementClass,
        ...interaction.properties,
      }
    );

    this.queueEvent(event);
  }

  public trackFormSubmission(
    formName: string,
    success: boolean,
    properties?: Record<string, any>
  ): void {
    if (!this.shouldTrack()) return;

    const event = this.createEvent(
      'form_submission',
      'form',
      success ? 'submit_success' : 'submit_error',
      {
        formName,
        success,
        ...properties,
      }
    );

    this.queueEvent(event);
  }

  public trackFileUpload(
    fileName: string,
    fileSize: number,
    fileType: string,
    success: boolean,
    properties?: Record<string, any>
  ): void {
    if (!this.shouldTrack()) return;

    const event = this.createEvent(
      'file_upload',
      'file',
      success ? 'upload_success' : 'upload_error',
      {
        fileName,
        fileSize,
        fileType,
        success,
        ...properties,
      }
    );

    this.queueEvent(event);
  }

  public trackATSAnalysis(
    analysisType: 'quick' | 'full',
    score: number,
    properties?: Record<string, any>
  ): void {
    if (!this.shouldTrack()) return;

    const event = this.createEvent(
      'ats_analysis',
      'analysis',
      'ats_analysis_complete',
      {
        analysisType,
        score,
        ...properties,
      }
    );

    this.queueEvent(event);
  }

  public trackAIImprovement(
    improvementType: string,
    success: boolean,
    properties?: Record<string, any>
  ): void {
    if (!this.shouldTrack()) return;

    const event = this.createEvent(
      'ai_improvement',
      'ai',
      success ? 'improvement_success' : 'improvement_error',
      {
        improvementType,
        success,
        ...properties,
      }
    );

    this.queueEvent(event);
  }

  public trackTemplateChange(
    templateId: string,
    templateName: string,
    properties?: Record<string, any>
  ): void {
    if (!this.shouldTrack()) return;

    const event = this.createEvent(
      'template_change',
      'template',
      'template_selected',
      {
        templateId,
        templateName,
        ...properties,
      }
    );

    this.queueEvent(event);
  }

  public trackExportAction(
    exportFormat: 'pdf' | 'docx' | 'txt',
    success: boolean,
    properties?: Record<string, any>
  ): void {
    if (!this.shouldTrack()) return;

    const event = this.createEvent(
      'export_action',
      'export',
      success ? 'export_success' : 'export_error',
      {
        exportFormat,
        success,
        ...properties,
      }
    );

    this.queueEvent(event);
  }

  public trackError(
    errorType: string,
    errorMessage: string,
    componentName?: string,
    properties?: Record<string, any>
  ): void {
    if (!this.shouldTrack()) return;

    const event = this.createEvent(
      'error_occurred',
      'error',
      'error_occurred',
      {
        errorType,
        errorMessage,
        componentName,
        ...properties,
      }
    );

    this.queueEvent(event);
  }

  public trackPerformance(metric: PerformanceMetric): void {
    if (!this.shouldTrack() || !this.config.trackPerformance) return;

    const event = this.createEvent(
      'performance_metric',
      'performance',
      'metric_recorded',
      {
        metricName: metric.metricName,
        value: metric.value,
        unit: metric.unit,
        ...metric.properties,
      }
    );

    this.queueEvent(event);
  }

  public trackUserEngagement(engagement: UserEngagement): void {
    if (!this.shouldTrack() || !this.config.trackUserEngagement) return;

    const event = this.createEvent(
      'user_engagement',
      'engagement',
      engagement.engagementType,
      {
        value: engagement.value,
        ...engagement.properties,
      }
    );

    this.queueEvent(event);
  }

  public trackFeatureUsage(
    featureName: string,
    usageType: 'start' | 'complete' | 'abandon',
    properties?: Record<string, any>
  ): void {
    if (!this.shouldTrack()) return;

    const event = this.createEvent('feature_usage', 'feature', usageType, {
      featureName,
      ...properties,
    });

    this.queueEvent(event);
  }

  private queueEvent(event: AnalyticsEvent): void {
    this.eventQueue.push(event);

    if (this.config.debug) {
      console.log('Analytics Event:', event);
    }

    if (this.eventQueue.length >= this.config.batchSize) {
      this.flush();
    }
  }

  public flush(): void {
    if (this.eventQueue.length === 0) return;

    const events = [...this.eventQueue];
    this.eventQueue = [];

    // Send events to analytics service
    this.sendEvents(events);
  }

  private async sendEvents(events: AnalyticsEvent[]): Promise<void> {
    try {
      // Send to Google Analytics 4
      if (typeof window !== 'undefined' && window.gtag) {
        events.forEach(event => {
          window.gtag('event', event.action, {
            event_category: event.category,
            event_label: event.label,
            value: event.value,
            custom_map: event.properties,
          });
        });
      }

      // Send to custom analytics endpoint
      if (process.env.NEXT_PUBLIC_ANALYTICS_ENDPOINT) {
        await fetch(process.env.NEXT_PUBLIC_ANALYTICS_ENDPOINT, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            events,
            sessionId: this.sessionId,
            userId: this.userId,
            timestamp: Date.now(),
          }),
        });
      }
    } catch (error) {
      if (this.config.debug) {
        console.error('Analytics send error:', error);
      }
    }
  }

  public destroy(): void {
    if (this.flushTimer) {
      clearInterval(this.flushTimer);
      this.flushTimer = null;
    }
    this.flush();
  }
}

// Create singleton instance
export const analytics = new AnalyticsManager();

// React hook for analytics
export const useAnalytics = () => {
  return {
    trackPageView: analytics.trackPageView.bind(analytics),
    trackComponentInteraction:
      analytics.trackComponentInteraction.bind(analytics),
    trackFormSubmission: analytics.trackFormSubmission.bind(analytics),
    trackFileUpload: analytics.trackFileUpload.bind(analytics),
    trackATSAnalysis: analytics.trackATSAnalysis.bind(analytics),
    trackAIImprovement: analytics.trackAIImprovement.bind(analytics),
    trackTemplateChange: analytics.trackTemplateChange.bind(analytics),
    trackExportAction: analytics.trackExportAction.bind(analytics),
    trackError: analytics.trackError.bind(analytics),
    trackPerformance: analytics.trackPerformance.bind(analytics),
    trackUserEngagement: analytics.trackUserEngagement.bind(analytics),
    trackFeatureUsage: analytics.trackFeatureUsage.bind(analytics),
  };
};

// Performance monitoring utilities
export const performanceMonitor = {
  measureComponentRender: (componentName: string) => {
    const startTime = performance.now();
    return () => {
      const endTime = performance.now();
      const renderTime = endTime - startTime;

      analytics.trackPerformance({
        metricName: 'component_render_time',
        value: renderTime,
        unit: 'ms',
        timestamp: Date.now(),
        properties: {
          componentName,
        },
      });
    };
  },

  measureAsyncOperation: async <T>(
    operationName: string,
    operation: () => Promise<T>
  ): Promise<T> => {
    const startTime = performance.now();
    try {
      const result = await operation();
      const endTime = performance.now();
      const duration = endTime - startTime;

      analytics.trackPerformance({
        metricName: 'async_operation_duration',
        value: duration,
        unit: 'ms',
        timestamp: Date.now(),
        properties: {
          operationName,
          success: true,
        },
      });

      return result;
    } catch (error) {
      const endTime = performance.now();
      const duration = endTime - startTime;

      analytics.trackPerformance({
        metricName: 'async_operation_duration',
        value: duration,
        unit: 'ms',
        timestamp: Date.now(),
        properties: {
          operationName,
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error',
        },
      });

      throw error;
    }
  },

  measureBundleSize: () => {
    if (typeof window !== 'undefined' && window.performance) {
      const navigation = window.performance.getEntriesByType(
        'navigation'
      )[0] as PerformanceNavigationTiming;
      if (navigation) {
        analytics.trackPerformance({
          metricName: 'bundle_size',
          value: navigation.transferSize,
          unit: 'bytes',
          timestamp: Date.now(),
        });
      }
    }
  },
};

// Web Vitals monitoring
export const webVitalsMonitor = {
  trackLCP: (value: number) => {
    analytics.trackPerformance({
      metricName: 'largest_contentful_paint',
      value,
      unit: 'ms',
      timestamp: Date.now(),
    });
  },

  trackFID: (value: number) => {
    analytics.trackPerformance({
      metricName: 'first_input_delay',
      value,
      unit: 'ms',
      timestamp: Date.now(),
    });
  },

  trackCLS: (value: number) => {
    analytics.trackPerformance({
      metricName: 'cumulative_layout_shift',
      value,
      unit: 'count',
      timestamp: Date.now(),
    });
  },

  trackFCP: (value: number) => {
    analytics.trackPerformance({
      metricName: 'first_contentful_paint',
      value,
      unit: 'ms',
      timestamp: Date.now(),
    });
  },

  trackTTFB: (value: number) => {
    analytics.trackPerformance({
      metricName: 'time_to_first_byte',
      value,
      unit: 'ms',
      timestamp: Date.now(),
    });
  },
};

// Export types and utilities
export type {
  AnalyticsConfig,
  AnalyticsEvent,
  ComponentInteraction,
  PerformanceMetric,
  UserEngagement,
};

export { AnalyticsManager };
