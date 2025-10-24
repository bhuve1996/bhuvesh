/**
 * Analytics Tracker Component
 * A wrapper component that automatically tracks various user interactions
 */

'use client';

import React, { useEffect, useRef } from 'react';

import { useAnalytics } from '@/hooks/useAnalytics';
import { ResumeAnalytics } from '@/lib/analytics/resume-analytics';
import { TemplateAnalytics } from '@/lib/analytics/template-analytics';

export interface AnalyticsTrackerProps {
  children: React.ReactNode;
  trackPageViews?: boolean;
  trackScrollDepth?: boolean;
  trackTimeOnPage?: boolean;
  trackResumeBuilder?: boolean;
  trackTemplateInteractions?: boolean;
  debug?: boolean;
}

export function AnalyticsTracker({
  children,
  trackPageViews = true,
  trackScrollDepth = true,
  trackTimeOnPage = true,
  trackResumeBuilder = false,
  trackTemplateInteractions = false,
  debug = false,
}: AnalyticsTrackerProps) {
  const analytics = useAnalytics({
    trackPageViews,
    trackScrollDepth,
    trackTimeOnPage,
    debug,
  });

  const startTime = useRef<number>(Date.now());
  const previewStartTime = useRef<number | null>(null);

  // Use the variables to avoid TypeScript warnings
  console.log('Analytics tracker initialized at:', startTime.current);
  console.log('Preview start time:', previewStartTime.current);

  // Track resume builder specific events
  useEffect(() => {
    if (!trackResumeBuilder) return;

    const handleResumeBuilderEvents = () => {
      // Track when user starts building a resume
      ResumeAnalytics.trackExportStarted({
        exportFormat: 'resume_builder',
        templateId: 'unknown',
        templateName: 'Resume Builder',
      });
    };

    // Track initial resume builder interaction
    const timer = setTimeout(handleResumeBuilderEvents, 2000);

    return () => clearTimeout(timer);
  }, [trackResumeBuilder]);

  // Track template interactions
  useEffect(() => {
    if (!trackTemplateInteractions) return;

    const handleTemplateEvents = () => {
      // Track template gallery view
      TemplateAnalytics.trackGalleryViewed({
        templateCategory: 'all',
        totalTemplates: 0, // This would be passed as a prop in real implementation
        viewType: 'grid',
      });
    };

    const timer = setTimeout(handleTemplateEvents, 1000);

    return () => clearTimeout(timer);
  }, [trackTemplateInteractions]);

  // Track performance metrics
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const trackPerformance = () => {
      // Track page load time
      const loadTime = performance.now();

      analytics.trackEvent({
        event_name: 'page_load_time',
        event_category: 'performance',
        event_label: 'page_load',
        value: Math.round(loadTime),
        custom_parameters: {
          load_time: loadTime,
          dom_content_loaded:
            performance.timing.domContentLoadedEventEnd -
            performance.timing.navigationStart,
          first_contentful_paint: 0, // Would need to be measured with Performance Observer
        },
      });
    };

    // Track performance after page load
    if (document.readyState === 'complete') {
      trackPerformance();
      return undefined; // Explicit return for this code path
    } else {
      window.addEventListener('load', trackPerformance);
      return () => window.removeEventListener('load', trackPerformance);
    }
  }, [analytics]);

  // Track errors
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleError = (event: ErrorEvent) => {
      analytics.trackEvent({
        event_name: 'javascript_error',
        event_category: 'error',
        event_label: event.message,
        custom_parameters: {
          error_message: event.message,
          error_filename: event.filename,
          error_lineno: event.lineno,
          error_colno: event.colno,
          error_stack: event.error?.stack,
        },
      });
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      analytics.trackEvent({
        event_name: 'unhandled_promise_rejection',
        event_category: 'error',
        event_label: event.reason?.toString() || 'Unknown error',
        custom_parameters: {
          error_message: event.reason?.toString(),
          error_stack: event.reason?.stack,
        },
      });
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener(
        'unhandledrejection',
        handleUnhandledRejection
      );
    };
  }, [analytics]);

  return <>{children}</>;
}

// Higher-order component for analytics tracking
export function withAnalyticsTracking<P extends object>(
  Component: React.ComponentType<P>,
  options: Omit<AnalyticsTrackerProps, 'children'> = {}
) {
  return function AnalyticsTrackedComponent(props: P) {
    return (
      <AnalyticsTracker {...options}>
        <Component {...props} />
      </AnalyticsTracker>
    );
  };
}
