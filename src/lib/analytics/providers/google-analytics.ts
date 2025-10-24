/**
 * Google Analytics 4 Provider
 * Implementation of Google Analytics 4 tracking
 */

import { analyticsConfig } from '../config';
import type { AnalyticsEventData, AnalyticsProvider } from '../types';

declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: any[];
  }
}

export class GoogleAnalyticsProvider implements AnalyticsProvider {
  name = 'Google Analytics 4';
  enabled = false;

  constructor() {
    this.enabled = analyticsConfig.googleAnalytics.enabled;
    if (this.enabled) {
      this.initialize();
    }
  }

  private initialize(): void {
    if (typeof window === 'undefined') return;

    // Initialize dataLayer
    window.dataLayer = window.dataLayer || [];

    // Define gtag function
    window.gtag = function () {
      window.dataLayer.push(arguments);
    };

    // Configure GA4
    window.gtag('js', new Date());
    window.gtag('config', analyticsConfig.googleAnalytics.measurementId, {
      page_title: document.title,
      page_location: window.location.href,
    });

    // Load Google Analytics script
    this.loadScript();
  }

  private loadScript(): void {
    if (typeof window === 'undefined') return;

    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${analyticsConfig.googleAnalytics.measurementId}`;
    document.head.appendChild(script);
  }

  trackEvent(event: AnalyticsEventData): void {
    if (!this.enabled || typeof window === 'undefined') return;

    try {
      const eventData: Record<string, any> = {
        event_category: event.event_category || 'general',
        event_label: event.event_label,
        value: event.value,
        ...event.custom_parameters,
      };

      // Remove undefined values
      Object.keys(eventData).forEach(key => {
        if (eventData[key] === undefined) {
          delete eventData[key];
        }
      });

      window.gtag('event', event.event_name, eventData);

      if (analyticsConfig.customEvents.debug) {
        console.log('GA4 Event Tracked:', {
          event_name: event.event_name,
          event_data: eventData,
        });
      }
    } catch (error) {
      console.error('Google Analytics tracking error:', error);
    }
  }

  trackPageView(url: string, title: string): void {
    if (!this.enabled || typeof window === 'undefined') return;

    try {
      window.gtag('config', analyticsConfig.googleAnalytics.measurementId, {
        page_title: title,
        page_location: url,
      });

      if (analyticsConfig.customEvents.debug) {
        console.log('GA4 Page View Tracked:', { url, title });
      }
    } catch (error) {
      console.error('Google Analytics page view tracking error:', error);
    }
  }

  setUserProperties(properties: Record<string, any>): void {
    if (!this.enabled || typeof window === 'undefined') return;

    try {
      window.gtag('set', 'user_properties', properties);

      if (analyticsConfig.customEvents.debug) {
        console.log('GA4 User Properties Set:', properties);
      }
    } catch (error) {
      console.error('Google Analytics user properties error:', error);
    }
  }

  setUserId(userId: string): void {
    if (!this.enabled || typeof window === 'undefined') return;

    try {
      window.gtag('set', 'user_id', userId);

      if (analyticsConfig.customEvents.debug) {
        console.log('GA4 User ID Set:', userId);
      }
    } catch (error) {
      console.error('Google Analytics user ID error:', error);
    }
  }
}
