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
      id: this.generateSessionId(),
      startTime: Date.now(),
      pageViews: 0,
      events: 0,
    };
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
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
      // eslint-disable-next-line no-console
      console.log('Analytics Manager Initialized:', {
        providers: this.providers.map(p => p.name),
        session_id: this.session.id,
        config: analyticsConfig,
      });
    }
  }

  trackEvent(event: AnalyticsEventData): void {
    if (!this.isInitialized) return;

    this.session.events++;
    // Update last activity (not in UserSession interface)

    // Add session data to event
    const enrichedEvent = {
      ...event,
      custom_parameters: {
        ...event.custom_parameters,
        session_id: this.session.id,
        session_events: this.session.events,
        timestamp: Date.now(),
      },
    };

    // Track with all providers
    this.providers.forEach(provider => {
      try {
        provider.trackEvent(enrichedEvent);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error(`Analytics provider ${provider.name} error:`, error);
      }
    });

    if (analyticsConfig.customEvents.debug) {
      // eslint-disable-next-line no-console
      console.log('Analytics Event Tracked:', {
        event: enrichedEvent,
        session: this.session,
        providers: this.providers.length,
      });
    }
  }

  trackPageView(url: string, title: string): void {
    if (!this.isInitialized) return;

    this.session.pageViews++;
    // Update last activity (not in UserSession interface)

    // Track with all providers
    this.providers.forEach(provider => {
      try {
        provider.trackPageView(url, title);
      } catch (error) {
        // eslint-disable-next-line no-console
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
        page_views: this.session.pageViews,
      },
    });

    if (analyticsConfig.customEvents.debug) {
      // eslint-disable-next-line no-console
      console.log('Analytics Page View Tracked:', {
        url,
        title,
        session: this.session,
        providers: this.providers.length,
      });
    }
  }

  setUserProperties(properties: Record<string, unknown>): void {
    if (!this.isInitialized) return;

    this.providers.forEach(provider => {
      try {
        provider.setUserProperties(properties);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error(`Analytics provider ${provider.name} error:`, error);
      }
    });

    if (analyticsConfig.customEvents.debug) {
      // eslint-disable-next-line no-console
      console.log('Analytics User Properties Set:', {
        properties,
        providers: this.providers.length,
      });
    }
  }

  setUserId(userId: string): void {
    if (!this.isInitialized) return;

    // Set user ID (not in UserSession interface)

    this.providers.forEach(provider => {
      try {
        provider.setUserId(userId);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error(`Analytics provider ${provider.name} error:`, error);
      }
    });

    if (analyticsConfig.customEvents.debug) {
      // eslint-disable-next-line no-console
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
