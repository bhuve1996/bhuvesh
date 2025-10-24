/**
 * Analytics Manager
 * Central analytics manager that coordinates all analytics providers
 */

import { analyticsConfig } from './config';
import { ConsoleAnalyticsProvider } from './providers/console-analytics';
import { GoogleAnalyticsProvider } from './providers/google-analytics';
import type {
  AnalyticsEventData,
  AnalyticsProvider,
  UserSession,
} from './types';

class AnalyticsManager {
  private providers: AnalyticsProvider[] = [];
  private session: UserSession;
  private isInitialized = false;

  constructor() {
    this.session = this.createSession();
    this.initializeProviders();
  }

  private createSession(): UserSession {
    return {
      session_id: this.generateSessionId(),
      start_time: Date.now(),
      last_activity: Date.now(),
      page_views: 0,
      events: 0,
      referrer: typeof window !== 'undefined' ? document.referrer : '',
      utm_source: this.getUrlParameter('utm_source') || '',
      utm_medium: this.getUrlParameter('utm_medium') || '',
      utm_campaign: this.getUrlParameter('utm_campaign') || '',
    };
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private getUrlParameter(name: string): string | undefined {
    if (typeof window === 'undefined') return undefined;

    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name) || undefined;
  }

  private initializeProviders(): void {
    // Always add console provider for development
    this.providers.push(new ConsoleAnalyticsProvider());

    // Add Google Analytics provider if enabled
    if (analyticsConfig.googleAnalytics.enabled) {
      this.providers.push(new GoogleAnalyticsProvider());
    }

    this.isInitialized = true;

    if (analyticsConfig.customEvents.debug) {
      console.log('Analytics Manager Initialized:', {
        providers: this.providers.map(p => p.name),
        session_id: this.session.session_id,
        config: analyticsConfig,
      });
    }
  }

  trackEvent(event: AnalyticsEventData): void {
    if (!this.isInitialized) return;

    this.session.events++;
    this.session.last_activity = Date.now();

    // Add session data to event
    const enrichedEvent = {
      ...event,
      custom_parameters: {
        ...event.custom_parameters,
        session_id: this.session.session_id,
        session_events: this.session.events,
        timestamp: Date.now(),
      },
    };

    // Track with all providers
    this.providers.forEach(provider => {
      try {
        provider.trackEvent(enrichedEvent);
      } catch (error) {
        console.error(`Analytics provider ${provider.name} error:`, error);
      }
    });

    if (analyticsConfig.customEvents.debug) {
      console.log('Analytics Event Tracked:', {
        event: enrichedEvent,
        session: this.session,
        providers: this.providers.length,
      });
    }
  }

  trackPageView(url: string, title: string): void {
    if (!this.isInitialized) return;

    this.session.page_views++;
    this.session.last_activity = Date.now();

    // Track with all providers
    this.providers.forEach(provider => {
      try {
        provider.trackPageView(url, title);
      } catch (error) {
        console.error(`Analytics provider ${provider.name} error:`, error);
      }
    });

    // Track page view as an event
    this.trackEvent({
      event_name: 'page_view',
      event_category: 'navigation',
      event_label: title,
      custom_parameters: {
        page_url: url,
        page_title: title,
        page_views: this.session.page_views,
      },
    });

    if (analyticsConfig.customEvents.debug) {
      console.log('Analytics Page View Tracked:', {
        url,
        title,
        session: this.session,
        providers: this.providers.length,
      });
    }
  }

  setUserProperties(properties: Record<string, any>): void {
    if (!this.isInitialized) return;

    this.providers.forEach(provider => {
      try {
        provider.setUserProperties(properties);
      } catch (error) {
        console.error(`Analytics provider ${provider.name} error:`, error);
      }
    });

    if (analyticsConfig.customEvents.debug) {
      console.log('Analytics User Properties Set:', {
        properties,
        providers: this.providers.length,
      });
    }
  }

  setUserId(userId: string): void {
    if (!this.isInitialized) return;

    this.session.user_id = userId;

    this.providers.forEach(provider => {
      try {
        provider.setUserId(userId);
      } catch (error) {
        console.error(`Analytics provider ${provider.name} error:`, error);
      }
    });

    if (analyticsConfig.customEvents.debug) {
      console.log('Analytics User ID Set:', {
        user_id: userId,
        session: this.session,
        providers: this.providers.length,
      });
    }
  }

  getSession(): UserSession {
    return { ...this.session };
  }

  getProviders(): AnalyticsProvider[] {
    return [...this.providers];
  }

  isReady(): boolean {
    return this.isInitialized;
  }
}

// Create singleton instance
export const analytics = new AnalyticsManager();

// Export for use in components
export default analytics;
