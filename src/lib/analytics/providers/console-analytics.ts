/* eslint-disable no-console */
/**
 * Console Analytics Provider
 * Development and debugging analytics provider that logs to console
 */

import { analyticsConfig } from '../config';
import type { AnalyticsEventData, AnalyticsProvider } from '../types';

export class ConsoleAnalyticsProvider implements AnalyticsProvider {
  name = 'Console Analytics';
  enabled = true;

  trackEvent(event: AnalyticsEventData): void {
    if (!this.enabled) return;

    const timestamp = new Date().toISOString();
    const logData = {
      timestamp,
      provider: this.name,
      event: {
        name: event.event_name,
        category: event.event_category,
        label: event.event_label,
        value: event.value,
        custom_parameters: event.custom_parameters,
      },
    };

    if (analyticsConfig.customEvents.debug) {
      console.group(`🔍 Analytics Event: ${event.event_name}`);
      console.log('Event Data:', logData);
      console.log('Full Event Object:', event);
      console.groupEnd();
    } else {
      console.log(`[Analytics] ${event.event_name}`, event);
    }
  }

  trackPageView(url: string, title: string): void {
    if (!this.enabled) return;

    const timestamp = new Date().toISOString();
    const logData = {
      timestamp,
      provider: this.name,
      type: 'page_view',
      url,
      title,
    };

    if (analyticsConfig.customEvents.debug) {
      console.group('📄 Page View');
      console.log('Page View Data:', logData);
      console.groupEnd();
    } else {
      console.log(`[Analytics] Page View: ${title} - ${url}`);
    }
  }

  setUserProperties(properties: Record<string, unknown>): void {
    if (!this.enabled) return;

    const timestamp = new Date().toISOString();
    const logData = {
      timestamp,
      provider: this.name,
      type: 'user_properties',
      properties,
    };

    if (analyticsConfig.customEvents.debug) {
      console.group('👤 User Properties');
      console.log('User Properties Data:', logData);
      console.groupEnd();
    } else {
      console.log(`[Analytics] User Properties:`, properties);
    }
  }

  setUserId(userId: string): void {
    if (!this.enabled) return;

    const timestamp = new Date().toISOString();
    const logData = {
      timestamp,
      provider: this.name,
      type: 'user_id',
      user_id: userId,
    };

    if (analyticsConfig.customEvents.debug) {
      console.group('🆔 User ID');
      console.log('User ID Data:', logData);
      console.groupEnd();
    } else {
      console.log(`[Analytics] User ID: ${userId}`);
    }
  }
}
