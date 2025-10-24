/**
 * Analytics Context
 * React context for analytics functionality
 */

'use client';

import { usePathname } from 'next/navigation';
import React, { createContext, useContext, useEffect, useState } from 'react';

import { useAnalytics } from '@/hooks/useAnalytics';
import { analytics } from '@/lib/analytics/analytics';
import type { AnalyticsContextType } from '@/types';

const AnalyticsContext = createContext<AnalyticsContextType | null>(null);

export interface AnalyticsProviderProps {
  children: React.ReactNode;
  trackPageViews?: boolean;
  trackScrollDepth?: boolean;
  trackTimeOnPage?: boolean;
  debug?: boolean;
}

export function AnalyticsProvider({
  children,
  trackPageViews = true,
  trackScrollDepth: _trackScrollDepth = true,
  trackTimeOnPage: _trackTimeOnPage = true,
  debug: _debug = false,
}: AnalyticsProviderProps) {
  const [isInitialized, setIsInitialized] = useState(false);
  const pathname = usePathname();

  // Initialize analytics
  useEffect(() => {
    setIsInitialized(analytics.isReady());
  }, []);

  // Track page views on route changes
  useEffect(() => {
    if (isInitialized && trackPageViews) {
      const url = window.location.href;
      const title = document.title;
      analytics.trackPageView(url, title);
    }
  }, [pathname, isInitialized, trackPageViews]);

  const contextValue: AnalyticsContextType = {
    trackEvent: analytics.trackEvent.bind(analytics),
    trackPageView: analytics.trackPageView.bind(analytics),
    setUserProperties: analytics.setUserProperties.bind(analytics),
    setUserId: analytics.setUserId.bind(analytics),
    isEnabled: isInitialized,
  };

  return (
    <AnalyticsContext.Provider value={contextValue}>
      {children}
    </AnalyticsContext.Provider>
  );
}

export function useAnalyticsContext(): AnalyticsContextType {
  const context = useContext(AnalyticsContext);

  if (!context) {
    throw new Error(
      'useAnalyticsContext must be used within an AnalyticsProvider'
    );
  }

  return context;
}

// Higher-order component for analytics tracking
export function withAnalytics<P extends object>(
  Component: React.ComponentType<P>,
  options?: {
    trackPageViews?: boolean;
    trackScrollDepth?: boolean;
    trackTimeOnPage?: boolean;
    debug?: boolean;
  }
) {
  return function AnalyticsWrappedComponent(props: P) {
    const analyticsHook = useAnalytics(options);

    return <Component {...props} analytics={analyticsHook} />;
  };
}
