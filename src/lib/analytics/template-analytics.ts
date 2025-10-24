/**
 * Template Analytics
 * Specialized analytics functions for template interactions
 */

import { analytics } from './analytics';
import { ANALYTICS_EVENTS, ANALYTICS_PARAMETERS } from './config';

export interface TemplateAnalyticsData {
  templateId: string;
  templateName: string;
  templateCategory: string;
  filterApplied?: string;
  searchQuery?: string;
  additionalData?: Record<string, unknown>;
}

export class TemplateAnalytics {
  /**
   * Track template preview opening
   */
  static trackPreviewOpened(data: TemplateAnalyticsData): void {
    analytics.trackEvent({
      event_name: ANALYTICS_EVENTS.TEMPLATE.PREVIEW_OPENED,
      event_category: 'template',
      event_label: data.templateName,
      custom_parameters: {
        [ANALYTICS_PARAMETERS.TEMPLATE_ID]: data.templateId,
        [ANALYTICS_PARAMETERS.TEMPLATE_NAME]: data.templateName,
        [ANALYTICS_PARAMETERS.TEMPLATE_CATEGORY]: data.templateCategory,
        ...data.additionalData,
      },
    });
  }

  /**
   * Track template preview closing
   */
  static trackPreviewClosed(
    data: TemplateAnalyticsData & { timeSpent?: number }
  ): void {
    analytics.trackEvent({
      event_name: ANALYTICS_EVENTS.TEMPLATE.PREVIEW_CLOSED,
      event_category: 'template',
      event_label: data.templateName,
      value: data.timeSpent || 0,
      custom_parameters: {
        [ANALYTICS_PARAMETERS.TEMPLATE_ID]: data.templateId,
        [ANALYTICS_PARAMETERS.TEMPLATE_NAME]: data.templateName,
        [ANALYTICS_PARAMETERS.TEMPLATE_CATEGORY]: data.templateCategory,
        [ANALYTICS_PARAMETERS.TIME_SPENT]: data.timeSpent || 0,
        ...data.additionalData,
      },
    });
  }

  /**
   * Track template selection
   */
  static trackSelected(data: TemplateAnalyticsData): void {
    analytics.trackEvent({
      event_name: ANALYTICS_EVENTS.TEMPLATE.SELECTED,
      event_category: 'template',
      event_label: data.templateName,
      custom_parameters: {
        [ANALYTICS_PARAMETERS.TEMPLATE_ID]: data.templateId,
        [ANALYTICS_PARAMETERS.TEMPLATE_NAME]: data.templateName,
        [ANALYTICS_PARAMETERS.TEMPLATE_CATEGORY]: data.templateCategory,
        ...data.additionalData,
      },
    });
  }

  /**
   * Track filter application
   */
  static trackFilterApplied(data: {
    filterType: string;
    filterValue: string;
    resultsCount: number;
    templateCategory?: string;
  }): void {
    analytics.trackEvent({
      event_name: ANALYTICS_EVENTS.TEMPLATE.FILTER_APPLIED,
      event_category: 'template',
      event_label: `${data.filterType}: ${data.filterValue}`,
      value: data.resultsCount,
      custom_parameters: {
        filter_type: data.filterType,
        filter_value: data.filterValue,
        results_count: data.resultsCount,
        [ANALYTICS_PARAMETERS.TEMPLATE_CATEGORY]: data.templateCategory,
      },
    });
  }

  /**
   * Track search performed
   */
  static trackSearchPerformed(data: {
    searchQuery: string;
    resultsCount: number;
    templateCategory?: string;
  }): void {
    analytics.trackEvent({
      event_name: ANALYTICS_EVENTS.TEMPLATE.SEARCH_PERFORMED,
      event_category: 'template',
      event_label: data.searchQuery,
      value: data.resultsCount,
      custom_parameters: {
        [ANALYTICS_PARAMETERS.TEMPLATE_CATEGORY]: data.templateCategory,
        search_query: data.searchQuery,
        results_count: data.resultsCount,
      },
    });
  }

  /**
   * Track template gallery view
   */
  static trackGalleryViewed(data: {
    templateCategory?: string;
    totalTemplates: number;
    viewType: 'grid' | 'list';
  }): void {
    analytics.trackEvent({
      event_name: 'template_gallery_viewed',
      event_category: 'template',
      event_label: data.templateCategory || 'all',
      value: data.totalTemplates,
      custom_parameters: {
        [ANALYTICS_PARAMETERS.TEMPLATE_CATEGORY]: data.templateCategory,
        total_templates: data.totalTemplates,
        view_type: data.viewType,
      },
    });
  }

  /**
   * Track template comparison
   */
  static trackComparisonStarted(data: {
    templateIds: string[];
    templateNames: string[];
    templateCategories: string[];
  }): void {
    analytics.trackEvent({
      event_name: 'template_comparison_started',
      event_category: 'template',
      event_label: `${data.templateNames.length} templates`,
      value: data.templateIds.length,
      custom_parameters: {
        template_ids: data.templateIds,
        template_names: data.templateNames,
        template_categories: data.templateCategories,
        comparison_count: data.templateIds.length,
      },
    });
  }

  /**
   * Track template favorite toggle
   */
  static trackFavoriteToggled(data: {
    templateId: string;
    templateName: string;
    isFavorited: boolean;
  }): void {
    analytics.trackEvent({
      event_name: 'template_favorite_toggled',
      event_category: 'template',
      event_label: data.templateName,
      value: data.isFavorited ? 1 : 0,
      custom_parameters: {
        [ANALYTICS_PARAMETERS.TEMPLATE_ID]: data.templateId,
        [ANALYTICS_PARAMETERS.TEMPLATE_NAME]: data.templateName,
        is_favorited: data.isFavorited,
      },
    });
  }

  /**
   * Track template sharing
   */
  static trackShared(data: {
    templateId: string;
    templateName: string;
    shareMethod: 'link' | 'social' | 'email';
    platform?: string;
  }): void {
    analytics.trackEvent({
      event_name: 'template_shared',
      event_category: 'template',
      event_label: data.templateName,
      custom_parameters: {
        [ANALYTICS_PARAMETERS.TEMPLATE_ID]: data.templateId,
        [ANALYTICS_PARAMETERS.TEMPLATE_NAME]: data.templateName,
        share_method: data.shareMethod,
        platform: data.platform,
      },
    });
  }

  /**
   * Track template rating
   */
  static trackRated(data: {
    templateId: string;
    templateName: string;
    rating: number;
    feedback?: string;
  }): void {
    analytics.trackEvent({
      event_name: 'template_rated',
      event_category: 'template',
      event_label: data.templateName,
      value: data.rating,
      custom_parameters: {
        [ANALYTICS_PARAMETERS.TEMPLATE_ID]: data.templateId,
        [ANALYTICS_PARAMETERS.TEMPLATE_NAME]: data.templateName,
        rating: data.rating,
        feedback: data.feedback,
      },
    });
  }
}
