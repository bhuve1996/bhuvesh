/**
 * Analytics Tracker Component
 * A wrapper component that automatically tracks various user interactions
 */

'use client';

import React, { useEffect, useRef } from 'react';

import {
  performanceMonitor,
  useAnalytics,
  webVitalsMonitor,
} from '@/lib/analytics';

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
  trackResumeBuilder: _trackResumeBuilder = false,
  trackTemplateInteractions: _trackTemplateInteractions = false,
  debug: _debug = false,
}: AnalyticsTrackerProps) {
  const analytics = useAnalytics();
  const startTime = useRef<number>(Date.now());
  const scrollDepth = useRef<number>(0);
  const maxScrollDepth = useRef<number>(0);
  const interactionCount = useRef<number>(0);

  // Track page views
  useEffect(() => {
    if (!trackPageViews) return;

    analytics.trackPageView(window.location.pathname, {
      referrer: document.referrer,
      userAgent: navigator.userAgent,
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight,
      },
    });
  }, [trackPageViews, analytics]);

  // Track scroll depth
  useEffect(() => {
    if (!trackScrollDepth) return;

    const handleScroll = () => {
      const scrollTop =
        window.pageYOffset || document.documentElement.scrollTop;
      const documentHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const currentScrollDepth = Math.round((scrollTop / documentHeight) * 100);

      if (currentScrollDepth > maxScrollDepth.current) {
        maxScrollDepth.current = currentScrollDepth;

        // Track milestone scroll depths
        if (currentScrollDepth >= 25 && scrollDepth.current < 25) {
          analytics.trackUserEngagement({
            engagementType: 'scroll_depth',
            value: 25,
            properties: { page: window.location.pathname },
          });
        } else if (currentScrollDepth >= 50 && scrollDepth.current < 50) {
          analytics.trackUserEngagement({
            engagementType: 'scroll_depth',
            value: 50,
            properties: { page: window.location.pathname },
          });
        } else if (currentScrollDepth >= 75 && scrollDepth.current < 75) {
          analytics.trackUserEngagement({
            engagementType: 'scroll_depth',
            value: 75,
            properties: { page: window.location.pathname },
          });
        } else if (currentScrollDepth >= 90 && scrollDepth.current < 90) {
          analytics.trackUserEngagement({
            engagementType: 'scroll_depth',
            value: 90,
            properties: { page: window.location.pathname },
          });
        }
      }

      scrollDepth.current = currentScrollDepth;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [trackScrollDepth, analytics]);

  // Track time on page
  useEffect(() => {
    if (!trackTimeOnPage) return;

    const handleBeforeUnload = () => {
      const timeOnPage = Date.now() - startTime.current;
      analytics.trackUserEngagement({
        engagementType: 'time_on_page',
        value: timeOnPage,
        properties: {
          page: window.location.pathname,
          scrollDepth: maxScrollDepth.current,
          interactions: interactionCount.current,
        },
      });
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        const timeOnPage = Date.now() - startTime.current;
        analytics.trackUserEngagement({
          engagementType: 'time_on_page',
          value: timeOnPage,
          properties: {
            page: window.location.pathname,
            scrollDepth: maxScrollDepth.current,
            interactions: interactionCount.current,
            visibilityChange: true,
          },
        });
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [trackTimeOnPage, analytics]);

  // Track performance metrics
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const trackPerformance = () => {
      if (window.performance) {
        const navigation = window.performance.getEntriesByType(
          'navigation'
        )[0] as PerformanceNavigationTiming;
        if (navigation) {
          performanceMonitor.measureBundleSize();

          analytics.trackUserEngagement({
            engagementType: 'session_duration',
            value: navigation.loadEventEnd - navigation.fetchStart,
            properties: {
              page: window.location.pathname,
              domContentLoaded:
                navigation.domContentLoadedEventEnd - navigation.fetchStart,
              loadComplete: navigation.loadEventEnd - navigation.fetchStart,
            },
          });
        }
      }
    };

    // Track Web Vitals
    const trackWebVitals = () => {
      if ('PerformanceObserver' in window) {
        // LCP (Largest Contentful Paint)
        const lcpObserver = new PerformanceObserver(list => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1];
          webVitalsMonitor.trackLCP(lastEntry.startTime);
        });
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

        // FID (First Input Delay)
        const fidObserver = new PerformanceObserver(list => {
          const entries = list.getEntries();
          entries.forEach(entry => {
            webVitalsMonitor.trackFID(entry.processingStart - entry.startTime);
          });
        });
        fidObserver.observe({ entryTypes: ['first-input'] });

        // CLS (Cumulative Layout Shift)
        let clsValue = 0;
        const clsObserver = new PerformanceObserver(list => {
          const entries = list.getEntries();
          entries.forEach(entry => {
            if (!entry.hadRecentInput) {
              clsValue += entry.value;
            }
          });
          webVitalsMonitor.trackCLS(clsValue);
        });
        clsObserver.observe({ entryTypes: ['layout-shift'] });

        return () => {
          lcpObserver.disconnect();
          fidObserver.disconnect();
          clsObserver.disconnect();
        };
      }
    };

    // Track performance after page load
    if (document.readyState === 'complete') {
      trackPerformance();
      const cleanup = trackWebVitals();
      return cleanup;
    } else {
      window.addEventListener('load', () => {
        trackPerformance();
        trackWebVitals();
      });
    }
  }, [analytics]);

  // Track errors
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleError = (event: ErrorEvent) => {
      analytics.trackError(
        'javascript_error',
        event.message,
        'AnalyticsTracker',
        {
          error_message: event.message,
          error_filename: event.filename,
          error_lineno: event.lineno,
          error_colno: event.colno,
          error_stack: event.error?.stack,
        }
      );
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      analytics.trackError(
        'unhandled_promise_rejection',
        event.reason?.toString() || 'Unknown error',
        'AnalyticsTracker',
        {
          error_message: event.reason?.toString(),
          error_stack: event.reason?.stack,
        }
      );
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
