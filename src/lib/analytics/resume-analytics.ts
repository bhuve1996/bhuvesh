/**
 * Resume Builder Analytics
 * Specialized analytics functions for resume builder interactions
 */

import { analytics } from './analytics';
import { ANALYTICS_EVENTS, ANALYTICS_PARAMETERS } from './config';

export interface ResumeAnalyticsData {
  templateId?: string;
  templateName?: string;
  templateCategory?: string;
  sectionType?: string;
  sectionIndex?: number;
  contentLength?: number;
  aiProvider?: string;
  exportFormat?: string;
  exportSize?: number;
  additionalData?: Record<string, unknown>;
}

export class ResumeAnalytics {
  /**
   * Track template selection
   */
  static trackTemplateSelected(data: {
    templateId: string;
    templateName: string;
    templateCategory: string;
  }): void {
    analytics.trackEvent({
      event_name: ANALYTICS_EVENTS.RESUME_BUILDER.TEMPLATE_SELECTED,
      event_category: 'resume_builder',
      event_label: data.templateName,
      custom_parameters: {
        [ANALYTICS_PARAMETERS.TEMPLATE_ID]: data.templateId,
        [ANALYTICS_PARAMETERS.TEMPLATE_NAME]: data.templateName,
        [ANALYTICS_PARAMETERS.TEMPLATE_CATEGORY]: data.templateCategory,
      },
    });
  }

  /**
   * Track section addition
   */
  static trackSectionAdded(data: {
    sectionType: string;
    sectionIndex: number;
    templateId?: string;
  }): void {
    analytics.trackEvent({
      event_name: ANALYTICS_EVENTS.RESUME_BUILDER.SECTION_ADDED,
      event_category: 'resume_builder',
      event_label: data.sectionType,
      custom_parameters: {
        [ANALYTICS_PARAMETERS.SECTION_TYPE]: data.sectionType,
        [ANALYTICS_PARAMETERS.SECTION_INDEX]: data.sectionIndex,
        [ANALYTICS_PARAMETERS.TEMPLATE_ID]: data.templateId,
      },
    });
  }

  /**
   * Track section removal
   */
  static trackSectionRemoved(data: {
    sectionType: string;
    sectionIndex: number;
    templateId?: string;
  }): void {
    analytics.trackEvent({
      event_name: ANALYTICS_EVENTS.RESUME_BUILDER.SECTION_REMOVED,
      event_category: 'resume_builder',
      event_label: data.sectionType,
      custom_parameters: {
        [ANALYTICS_PARAMETERS.SECTION_TYPE]: data.sectionType,
        [ANALYTICS_PARAMETERS.SECTION_INDEX]: data.sectionIndex,
        [ANALYTICS_PARAMETERS.TEMPLATE_ID]: data.templateId,
      },
    });
  }

  /**
   * Track section reordering
   */
  static trackSectionReordered(data: {
    sectionType: string;
    fromIndex: number;
    toIndex: number;
    templateId?: string;
  }): void {
    analytics.trackEvent({
      event_name: ANALYTICS_EVENTS.RESUME_BUILDER.SECTION_REORDERED,
      event_category: 'resume_builder',
      event_label: data.sectionType,
      custom_parameters: {
        [ANALYTICS_PARAMETERS.SECTION_TYPE]: data.sectionType,
        from_index: data.fromIndex,
        to_index: data.toIndex,
        [ANALYTICS_PARAMETERS.TEMPLATE_ID]: data.templateId,
      },
    });
  }

  /**
   * Track content editing
   */
  static trackContentEdited(data: {
    sectionType: string;
    sectionIndex: number;
    contentLength: number;
    templateId?: string;
  }): void {
    analytics.trackEvent({
      event_name: ANALYTICS_EVENTS.RESUME_BUILDER.CONTENT_EDITED,
      event_category: 'resume_builder',
      event_label: data.sectionType,
      value: data.contentLength,
      custom_parameters: {
        [ANALYTICS_PARAMETERS.SECTION_TYPE]: data.sectionType,
        [ANALYTICS_PARAMETERS.SECTION_INDEX]: data.sectionIndex,
        [ANALYTICS_PARAMETERS.CONTENT_LENGTH]: data.contentLength,
        [ANALYTICS_PARAMETERS.TEMPLATE_ID]: data.templateId,
      },
    });
  }

  /**
   * Track AI improvement request
   */
  static trackAIImprovementRequested(data: {
    sectionType: string;
    sectionIndex: number;
    aiProvider: string;
    templateId?: string;
  }): void {
    analytics.trackEvent({
      event_name: ANALYTICS_EVENTS.RESUME_BUILDER.AI_IMPROVEMENT_REQUESTED,
      event_category: 'resume_builder',
      event_label: data.sectionType,
      custom_parameters: {
        [ANALYTICS_PARAMETERS.SECTION_TYPE]: data.sectionType,
        [ANALYTICS_PARAMETERS.SECTION_INDEX]: data.sectionIndex,
        [ANALYTICS_PARAMETERS.AI_PROVIDER]: data.aiProvider,
        [ANALYTICS_PARAMETERS.TEMPLATE_ID]: data.templateId,
      },
    });
  }

  /**
   * Track AI improvement application
   */
  static trackAIImprovementApplied(data: {
    sectionType: string;
    sectionIndex: number;
    aiProvider: string;
    improvementType: string;
    templateId?: string;
  }): void {
    analytics.trackEvent({
      event_name: ANALYTICS_EVENTS.RESUME_BUILDER.AI_IMPROVEMENT_APPLIED,
      event_category: 'resume_builder',
      event_label: data.sectionType,
      custom_parameters: {
        [ANALYTICS_PARAMETERS.SECTION_TYPE]: data.sectionType,
        [ANALYTICS_PARAMETERS.SECTION_INDEX]: data.sectionIndex,
        [ANALYTICS_PARAMETERS.AI_PROVIDER]: data.aiProvider,
        improvement_type: data.improvementType,
        [ANALYTICS_PARAMETERS.TEMPLATE_ID]: data.templateId,
      },
    });
  }

  /**
   * Track export start
   */
  static trackExportStarted(data: {
    exportFormat: string;
    templateId?: string;
    templateName?: string;
  }): void {
    analytics.trackEvent({
      event_name: ANALYTICS_EVENTS.RESUME_BUILDER.EXPORT_STARTED,
      event_category: 'resume_builder',
      event_label: data.exportFormat,
      custom_parameters: {
        [ANALYTICS_PARAMETERS.EXPORT_FORMAT]: data.exportFormat,
        [ANALYTICS_PARAMETERS.TEMPLATE_ID]: data.templateId,
        [ANALYTICS_PARAMETERS.TEMPLATE_NAME]: data.templateName,
      },
    });
  }

  /**
   * Track export completion
   */
  static trackExportCompleted(data: {
    exportFormat: string;
    exportSize: number;
    templateId?: string;
    templateName?: string;
  }): void {
    analytics.trackEvent({
      event_name: ANALYTICS_EVENTS.RESUME_BUILDER.EXPORT_COMPLETED,
      event_category: 'resume_builder',
      event_label: data.exportFormat,
      value: data.exportSize,
      custom_parameters: {
        [ANALYTICS_PARAMETERS.EXPORT_FORMAT]: data.exportFormat,
        [ANALYTICS_PARAMETERS.EXPORT_SIZE]: data.exportSize,
        [ANALYTICS_PARAMETERS.TEMPLATE_ID]: data.templateId,
        [ANALYTICS_PARAMETERS.TEMPLATE_NAME]: data.templateName,
      },
    });
  }

  /**
   * Track export failure
   */
  static trackExportFailed(data: {
    exportFormat: string;
    errorMessage: string;
    templateId?: string;
    templateName?: string;
  }): void {
    analytics.trackEvent({
      event_name: ANALYTICS_EVENTS.RESUME_BUILDER.EXPORT_FAILED,
      event_category: 'resume_builder',
      event_label: data.exportFormat,
      custom_parameters: {
        [ANALYTICS_PARAMETERS.EXPORT_FORMAT]: data.exportFormat,
        [ANALYTICS_PARAMETERS.ERROR_MESSAGE]: data.errorMessage,
        [ANALYTICS_PARAMETERS.TEMPLATE_ID]: data.templateId,
        [ANALYTICS_PARAMETERS.TEMPLATE_NAME]: data.templateName,
      },
    });
  }

  /**
   * Track download start
   */
  static trackDownloadStarted(data: {
    exportFormat: string;
    templateId?: string;
    templateName?: string;
  }): void {
    analytics.trackEvent({
      event_name: ANALYTICS_EVENTS.RESUME_BUILDER.DOWNLOAD_STARTED,
      event_category: 'resume_builder',
      event_label: data.exportFormat,
      custom_parameters: {
        [ANALYTICS_PARAMETERS.EXPORT_FORMAT]: data.exportFormat,
        [ANALYTICS_PARAMETERS.TEMPLATE_ID]: data.templateId,
        [ANALYTICS_PARAMETERS.TEMPLATE_NAME]: data.templateName,
      },
    });
  }

  /**
   * Track download completion
   */
  static trackDownloadCompleted(data: {
    exportFormat: string;
    exportSize: number;
    templateId?: string;
    templateName?: string;
  }): void {
    analytics.trackEvent({
      event_name: ANALYTICS_EVENTS.RESUME_BUILDER.DOWNLOAD_COMPLETED,
      event_category: 'resume_builder',
      event_label: data.exportFormat,
      value: data.exportSize,
      custom_parameters: {
        [ANALYTICS_PARAMETERS.EXPORT_FORMAT]: data.exportFormat,
        [ANALYTICS_PARAMETERS.EXPORT_SIZE]: data.exportSize,
        [ANALYTICS_PARAMETERS.TEMPLATE_ID]: data.templateId,
        [ANALYTICS_PARAMETERS.TEMPLATE_NAME]: data.templateName,
      },
    });
  }

  /**
   * Track preview opening
   */
  static trackPreviewOpened(data: {
    templateId?: string;
    templateName?: string;
  }): void {
    analytics.trackEvent({
      event_name: ANALYTICS_EVENTS.RESUME_BUILDER.PREVIEW_OPENED,
      event_category: 'resume_builder',
      event_label: data.templateName || 'resume_preview',
      custom_parameters: {
        [ANALYTICS_PARAMETERS.TEMPLATE_ID]: data.templateId,
        [ANALYTICS_PARAMETERS.TEMPLATE_NAME]: data.templateName,
      },
    });
  }

  /**
   * Track preview closing
   */
  static trackPreviewClosed(data: {
    templateId?: string;
    templateName?: string;
    timeSpent?: number;
  }): void {
    analytics.trackEvent({
      event_name: ANALYTICS_EVENTS.RESUME_BUILDER.PREVIEW_CLOSED,
      event_category: 'resume_builder',
      event_label: data.templateName || 'resume_preview',
      value: data.timeSpent || 0,
      custom_parameters: {
        [ANALYTICS_PARAMETERS.TEMPLATE_ID]: data.templateId || '',
        [ANALYTICS_PARAMETERS.TEMPLATE_NAME]: data.templateName || '',
        [ANALYTICS_PARAMETERS.TIME_SPENT]: data.timeSpent || 0,
      },
    });
  }
}
