/**
 * Analytics Hook
 * React hook for tracking analytics events
 */

import { usePathname } from 'next/navigation';
import { useCallback, useEffect, useRef } from 'react';

import { analytics } from '@/lib/analytics/analytics';
import { ANALYTICS_EVENTS, ANALYTICS_PARAMETERS } from '@/lib/analytics/config';
import type { AnalyticsEventData } from '@/lib/analytics/types';

export interface UseAnalyticsOptions {
  trackPageViews?: boolean;
  trackScrollDepth?: boolean;
  trackTimeOnPage?: boolean;
  debug?: boolean;
}

export function useAnalytics(options: UseAnalyticsOptions = {}) {
  const {
    trackPageViews = true,
    trackScrollDepth = true,
    trackTimeOnPage = true,
    debug = false,
  } = options;

  const pathname = usePathname();
  const pageStartTime = useRef<number>(Date.now());
  const scrollDepthRef = useRef<Set<number>>(new Set());
  const timeOnPageInterval = useRef<NodeJS.Timeout | null>(null);

  // Track page views
  useEffect(() => {
    if (!trackPageViews) return;

    const url = window.location.href;
    const title = document.title;

    analytics.trackPageView(url, title);

    // Reset page tracking variables
    pageStartTime.current = Date.now();
    scrollDepthRef.current.clear();

    if (debug) {
      console.log('Analytics: Page view tracked', { url, title });
    }
  }, [pathname, trackPageViews, debug]);

  // Track scroll depth
  useEffect(() => {
    if (!trackScrollDepth) return;

    const handleScroll = () => {
      const scrollTop =
        window.pageYOffset || document.documentElement.scrollTop;
      const documentHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercentage = Math.round((scrollTop / documentHeight) * 100);

      // Track milestone scroll depths (25%, 50%, 75%, 100%)
      const milestones = [25, 50, 75, 100];
      const milestone = milestones.find(
        m => scrollPercentage >= m && !scrollDepthRef.current.has(m)
      );

      if (milestone) {
        scrollDepthRef.current.add(milestone);

        analytics.trackEvent({
          event_name: ANALYTICS_EVENTS.INTERACTION.SCROLL_DEPTH,
          event_category: 'engagement',
          event_label: `${milestone}%`,
          custom_parameters: {
            [ANALYTICS_PARAMETERS.SCROLL_PERCENTAGE]: milestone,
            [ANALYTICS_PARAMETERS.PAGE_URL]: window.location.href,
            [ANALYTICS_PARAMETERS.PAGE_TITLE]: document.title,
          },
        });

        if (debug) {
          console.log('Analytics: Scroll depth tracked', {
            milestone,
            scrollPercentage,
          });
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [trackScrollDepth, debug]);

  // Track time on page
  useEffect(() => {
    if (!trackTimeOnPage) return;

    const startTime = Date.now();

    // Track time on page every 30 seconds
    timeOnPageInterval.current = setInterval(() => {
      const timeSpent = Math.round((Date.now() - startTime) / 1000);

      analytics.trackEvent({
        event_name: ANALYTICS_EVENTS.INTERACTION.TIME_ON_PAGE,
        event_category: 'engagement',
        event_label: `${timeSpent}s`,
        value: timeSpent,
        custom_parameters: {
          [ANALYTICS_PARAMETERS.TIME_SPENT]: timeSpent,
          [ANALYTICS_PARAMETERS.PAGE_URL]: window.location.href,
          [ANALYTICS_PARAMETERS.PAGE_TITLE]: document.title,
        },
      });

      if (debug) {
        console.log('Analytics: Time on page tracked', { timeSpent });
      }
    }, 30000);

    return () => {
      if (timeOnPageInterval.current) {
        clearInterval(timeOnPageInterval.current);
      }
    };
  }, [trackTimeOnPage, debug]);

  // Track event function
  const trackEvent = useCallback(
    (event: AnalyticsEventData) => {
      analytics.trackEvent(event);

      if (debug) {
        console.log('Analytics: Event tracked', event);
      }
    },
    [debug]
  );

  // Track page view function
  const trackPageView = useCallback(
    (url: string, title: string) => {
      analytics.trackPageView(url, title);

      if (debug) {
        console.log('Analytics: Page view tracked', { url, title });
      }
    },
    [debug]
  );

  // Set user properties function
  const setUserProperties = useCallback(
    (properties: Record<string, any>) => {
      analytics.setUserProperties(properties);

      if (debug) {
        console.log('Analytics: User properties set', properties);
      }
    },
    [debug]
  );

  // Set user ID function
  const setUserId = useCallback(
    (userId: string) => {
      analytics.setUserId(userId);

      if (debug) {
        console.log('Analytics: User ID set', userId);
      }
    },
    [debug]
  );

  // Track button click
  const trackButtonClick = useCallback(
    (
      buttonId: string,
      buttonText?: string,
      additionalData?: Record<string, any>
    ) => {
      trackEvent({
        event_name: ANALYTICS_EVENTS.INTERACTION.BUTTON_CLICKED,
        event_category: 'interaction',
        event_label: buttonText || buttonId,
        custom_parameters: {
          [ANALYTICS_PARAMETERS.ELEMENT_ID]: buttonId,
          [ANALYTICS_PARAMETERS.ELEMENT_TEXT]: buttonText,
          ...additionalData,
        },
      });
    },
    [trackEvent]
  );

  // Track link click
  const trackLinkClick = useCallback(
    (
      linkUrl: string,
      linkText?: string,
      additionalData?: Record<string, any>
    ) => {
      trackEvent({
        event_name: ANALYTICS_EVENTS.INTERACTION.LINK_CLICKED,
        event_category: 'navigation',
        event_label: linkText || linkUrl,
        custom_parameters: {
          [ANALYTICS_PARAMETERS.ELEMENT_TEXT]: linkText,
          destination: linkUrl,
          ...additionalData,
        },
      });
    },
    [trackEvent]
  );

  // Track form submission
  const trackFormSubmission = useCallback(
    (formId: string, formData?: Record<string, any>) => {
      trackEvent({
        event_name: ANALYTICS_EVENTS.INTERACTION.FORM_SUBMITTED,
        event_category: 'interaction',
        event_label: formId,
        custom_parameters: {
          [ANALYTICS_PARAMETERS.ELEMENT_ID]: formId,
          form_data: formData,
        },
      });
    },
    [trackEvent]
  );

  // Track modal interaction
  const trackModalInteraction = useCallback(
    (action: 'opened' | 'closed', modalId: string, modalTitle?: string) => {
      const eventName =
        action === 'opened'
          ? ANALYTICS_EVENTS.INTERACTION.MODAL_OPENED
          : ANALYTICS_EVENTS.INTERACTION.MODAL_CLOSED;

      trackEvent({
        event_name: eventName,
        event_category: 'interaction',
        event_label: modalTitle || modalId,
        custom_parameters: {
          [ANALYTICS_PARAMETERS.ELEMENT_ID]: modalId,
          [ANALYTICS_PARAMETERS.ELEMENT_TEXT]: modalTitle,
          action,
        },
      });
    },
    [trackEvent]
  );

  return {
    trackEvent,
    trackPageView,
    setUserProperties,
    setUserId,
    trackButtonClick,
    trackLinkClick,
    trackFormSubmission,
    trackModalInteraction,
    isReady: analytics.isReady(),
    session: analytics.getSession(),
  };
}
