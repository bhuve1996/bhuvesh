/**
 * Analytics Configuration
 * Centralized configuration for all analytics providers
 */

export interface AnalyticsConfig {
  googleAnalytics: {
    measurementId: string;
    enabled: boolean;
  };
  customEvents: {
    enabled: boolean;
    debug: boolean;
  };
}

export const analyticsConfig: AnalyticsConfig = {
  googleAnalytics: {
    measurementId: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || '',
    enabled:
      process.env.NODE_ENV === 'production' &&
      !!process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID,
  },
  customEvents: {
    enabled: true,
    debug: process.env.NODE_ENV === 'development',
  },
};

// Event categories for consistent tracking
export const ANALYTICS_EVENTS = {
  // Navigation events
  PAGE_VIEW: 'page_view',
  NAVIGATION: 'navigation',

  // Resume builder events
  RESUME_BUILDER: {
    TEMPLATE_SELECTED: 'resume_template_selected',
    SECTION_ADDED: 'resume_section_added',
    SECTION_REMOVED: 'resume_section_removed',
    SECTION_REORDERED: 'resume_section_reordered',
    CONTENT_EDITED: 'resume_content_edited',
    AI_IMPROVEMENT_REQUESTED: 'resume_ai_improvement_requested',
    AI_IMPROVEMENT_APPLIED: 'resume_ai_improvement_applied',
    EXPORT_STARTED: 'resume_export_started',
    EXPORT_COMPLETED: 'resume_export_completed',
    EXPORT_FAILED: 'resume_export_failed',
    DOWNLOAD_STARTED: 'resume_download_started',
    DOWNLOAD_COMPLETED: 'resume_download_completed',
    PREVIEW_OPENED: 'resume_preview_opened',
    PREVIEW_CLOSED: 'resume_preview_closed',
  },

  // Template events
  TEMPLATE: {
    PREVIEW_OPENED: 'template_preview_opened',
    PREVIEW_CLOSED: 'template_preview_closed',
    SELECTED: 'template_selected',
    FILTER_APPLIED: 'template_filter_applied',
    SEARCH_PERFORMED: 'template_search_performed',
  },

  // User interaction events
  INTERACTION: {
    BUTTON_CLICKED: 'button_clicked',
    LINK_CLICKED: 'link_clicked',
    FORM_SUBMITTED: 'form_submitted',
    MODAL_OPENED: 'modal_opened',
    MODAL_CLOSED: 'modal_closed',
    SCROLL_DEPTH: 'scroll_depth',
    TIME_ON_PAGE: 'time_on_page',
  },

  // Error events
  ERROR: {
    JAVASCRIPT_ERROR: 'javascript_error',
    API_ERROR: 'api_error',
    EXPORT_ERROR: 'export_error',
    UPLOAD_ERROR: 'upload_error',
  },

  // Performance events
  PERFORMANCE: {
    PAGE_LOAD_TIME: 'page_load_time',
    RESOURCE_LOAD_TIME: 'resource_load_time',
    INTERACTION_DELAY: 'interaction_delay',
  },
} as const;

// Event parameters for consistent data structure
export const ANALYTICS_PARAMETERS = {
  // Common parameters
  PAGE_TITLE: 'page_title',
  PAGE_PATH: 'page_path',
  PAGE_URL: 'page_url',
  USER_AGENT: 'user_agent',
  SCREEN_RESOLUTION: 'screen_resolution',
  VIEWPORT_SIZE: 'viewport_size',

  // Resume builder parameters
  TEMPLATE_ID: 'template_id',
  TEMPLATE_NAME: 'template_name',
  TEMPLATE_CATEGORY: 'template_category',
  SECTION_TYPE: 'section_type',
  SECTION_INDEX: 'section_index',
  CONTENT_LENGTH: 'content_length',
  AI_PROVIDER: 'ai_provider',
  EXPORT_FORMAT: 'export_format',
  EXPORT_SIZE: 'export_size',

  // User interaction parameters
  ELEMENT_ID: 'element_id',
  ELEMENT_TEXT: 'element_text',
  ELEMENT_POSITION: 'element_position',
  CLICK_COORDINATES: 'click_coordinates',
  SCROLL_PERCENTAGE: 'scroll_percentage',
  TIME_SPENT: 'time_spent',

  // Error parameters
  ERROR_MESSAGE: 'error_message',
  ERROR_STACK: 'error_stack',
  ERROR_TYPE: 'error_type',
  API_ENDPOINT: 'api_endpoint',
  HTTP_STATUS: 'http_status',

  // Performance parameters
  LOAD_TIME: 'load_time',
  DOM_CONTENT_LOADED: 'dom_content_loaded',
  FIRST_CONTENTFUL_PAINT: 'first_contentful_paint',
  LARGEST_CONTENTFUL_PAINT: 'largest_contentful_paint',
  CUMULATIVE_LAYOUT_SHIFT: 'cumulative_layout_shift',
} as const;

export type AnalyticsEvent =
  (typeof ANALYTICS_EVENTS)[keyof typeof ANALYTICS_EVENTS];
export type AnalyticsParameter =
  (typeof ANALYTICS_PARAMETERS)[keyof typeof ANALYTICS_PARAMETERS];
