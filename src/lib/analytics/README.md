# Analytics System

A comprehensive analytics system for tracking user interactions, performance metrics, and business events across the portfolio website.

## Features

- **Google Analytics 4 Integration**: Full GA4 support with custom events
- **Console Analytics**: Development debugging with detailed logging
- **Event Tracking**: Comprehensive event tracking for all user interactions
- **Performance Monitoring**: Page load times, scroll depth, time on page
- **Error Tracking**: JavaScript errors and API failures
- **Resume Builder Analytics**: Specialized tracking for resume creation
- **Template Analytics**: Template selection and interaction tracking
- **Real-time Debugging**: Development tools for monitoring events

## Quick Start

### 1. Environment Setup

Create a `.env.local` file in your project root:

```bash
# Analytics Configuration
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX

# Site Configuration
NEXT_PUBLIC_SITE_URL=https://bhuvesh.com

# Development Configuration
NODE_ENV=development
```

### 2. Basic Usage

The analytics system is automatically initialized in the main layout. For custom tracking:

```tsx
import { useAnalytics } from '@/hooks/useAnalytics';
import { ResumeAnalytics } from '@/lib/analytics/resume-analytics';
import { TemplateAnalytics } from '@/lib/analytics/template-analytics';

function MyComponent() {
  const analytics = useAnalytics();

  const handleButtonClick = () => {
    analytics.trackButtonClick('my-button', 'Click Me');
  };

  const handleResumeExport = () => {
    ResumeAnalytics.trackExportStarted({
      exportFormat: 'pdf',
      templateId: 'template-1',
      templateName: 'Modern Resume',
    });
  };

  return <button onClick={handleButtonClick}>Track This Click</button>;
}
```

## Architecture

### Core Components

1. **Analytics Manager** (`analytics.ts`): Central coordinator for all analytics providers
2. **Providers**: Google Analytics, Console Analytics
3. **Hooks**: `useAnalytics` for React components
4. **Context**: `AnalyticsContext` for app-wide analytics
5. **Specialized Analytics**: Resume and Template specific tracking

### Event Categories

- **Navigation**: Page views, link clicks, internal navigation
- **Resume Builder**: Template selection, content editing, AI improvements, exports
- **Template Gallery**: Template previews, selections, filters, searches
- **User Interactions**: Button clicks, form submissions, modal interactions
- **Performance**: Page load times, scroll depth, time on page
- **Errors**: JavaScript errors, API failures, export errors

## API Reference

### Analytics Manager

```typescript
import { analytics } from '@/lib/analytics/analytics';

// Track custom event
analytics.trackEvent({
  event_name: 'custom_event',
  event_category: 'user_action',
  event_label: 'button_click',
  value: 1,
  custom_parameters: {
    button_id: 'submit-form',
    page_url: window.location.href,
  },
});

// Track page view
analytics.trackPageView('/resume/builder', 'Resume Builder');

// Set user properties
analytics.setUserProperties({
  user_type: 'premium',
  subscription_plan: 'pro',
});

// Set user ID
analytics.setUserId('user-123');
```

### Resume Analytics

```typescript
import { ResumeAnalytics } from '@/lib/analytics/resume-analytics';

// Track template selection
ResumeAnalytics.trackTemplateSelected({
  templateId: 'modern-template',
  templateName: 'Modern Resume',
  templateCategory: 'professional',
});

// Track content editing
ResumeAnalytics.trackContentEdited({
  sectionType: 'experience',
  sectionIndex: 0,
  contentLength: 150,
  templateId: 'modern-template',
});

// Track AI improvement
ResumeAnalytics.trackAIImprovementRequested({
  sectionType: 'summary',
  sectionIndex: 0,
  aiProvider: 'openai',
  templateId: 'modern-template',
});

// Track export
ResumeAnalytics.trackExportStarted({
  exportFormat: 'pdf',
  templateId: 'modern-template',
  templateName: 'Modern Resume',
});
```

### Template Analytics

```typescript
import { TemplateAnalytics } from '@/lib/analytics/template-analytics';

// Track template selection
TemplateAnalytics.trackSelected({
  templateId: 'modern-template',
  templateName: 'Modern Resume',
  templateCategory: 'professional',
});

// Track template preview
TemplateAnalytics.trackPreviewOpened({
  templateId: 'modern-template',
  templateName: 'Modern Resume',
  templateCategory: 'professional',
});

// Track search
TemplateAnalytics.trackSearchPerformed({
  searchQuery: 'modern resume',
  resultsCount: 5,
  templateCategory: 'professional',
});

// Track filter application
TemplateAnalytics.trackFilterApplied({
  filterType: 'category',
  filterValue: 'professional',
  resultsCount: 10,
  templateCategory: 'professional',
});
```

### React Hooks

```typescript
import { useAnalytics } from '@/hooks/useAnalytics';

function MyComponent() {
  const {
    trackEvent,
    trackPageView,
    setUserProperties,
    setUserId,
    trackButtonClick,
    trackLinkClick,
    trackFormSubmission,
    trackModalInteraction,
    isReady,
    session,
  } = useAnalytics({
    trackPageViews: true,
    trackScrollDepth: true,
    trackTimeOnPage: true,
    debug: process.env.NODE_ENV === 'development',
  });

  return (
    <div>
      <button onClick={() => trackButtonClick('my-button', 'Click Me')}>
        Track Click
      </button>
      <p>Session ID: {session.session_id}</p>
      <p>Events: {session.events}</p>
    </div>
  );
}
```

## Event Types

### Standard Events

```typescript
// Page view
{
  event_name: 'page_view',
  event_category: 'navigation',
  page_title: 'Resume Builder',
  page_url: '/resume/builder',
}

// Button click
{
  event_name: 'button_clicked',
  event_category: 'interaction',
  event_label: 'Submit Form',
  element_id: 'submit-button',
  element_text: 'Submit',
}

// Form submission
{
  event_name: 'form_submitted',
  event_category: 'interaction',
  event_label: 'Contact Form',
  form_id: 'contact-form',
  form_data: { name: 'John', email: 'john@example.com' },
}

// Scroll depth
{
  event_name: 'scroll_depth',
  event_category: 'engagement',
  event_label: '75%',
  scroll_percentage: 75,
  page_url: '/resume/builder',
}
```

### Resume Builder Events

```typescript
// Template selection
{
  event_name: 'resume_template_selected',
  event_category: 'resume_builder',
  event_label: 'Modern Resume',
  template_id: 'modern-template',
  template_name: 'Modern Resume',
  template_category: 'professional',
}

// Content editing
{
  event_name: 'resume_content_edited',
  event_category: 'resume_builder',
  event_label: 'experience',
  section_type: 'experience',
  section_index: 0,
  content_length: 150,
  template_id: 'modern-template',
}

// AI improvement
{
  event_name: 'resume_ai_improvement_requested',
  event_category: 'resume_builder',
  event_label: 'summary',
  section_type: 'summary',
  section_index: 0,
  ai_provider: 'openai',
  template_id: 'modern-template',
}

// Export
{
  event_name: 'resume_export_started',
  event_category: 'resume_builder',
  event_label: 'pdf',
  export_format: 'pdf',
  template_id: 'modern-template',
  template_name: 'Modern Resume',
}
```

## Development Tools

### Analytics Debugger

The analytics debugger provides real-time monitoring of analytics events during development:

```tsx
import { AnalyticsDebugger } from '@/components/analytics/AnalyticsDebugger';

function App() {
  return (
    <div>
      {/* Your app content */}
      <AnalyticsDebugger
        enabled={process.env.NODE_ENV === 'development'}
        position='bottom-right'
        maxEvents={50}
      />
    </div>
  );
}
```

### Debug Mode

Enable debug mode to see detailed analytics logging:

```typescript
// In your component
const analytics = useAnalytics({ debug: true });

// Or globally in analytics config
export const analyticsConfig = {
  customEvents: {
    enabled: true,
    debug: process.env.NODE_ENV === 'development',
  },
};
```

## Configuration

### Analytics Config

```typescript
// src/lib/analytics/config.ts
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
```

### Event Constants

```typescript
// Predefined event names and parameters
import { ANALYTICS_EVENTS, ANALYTICS_PARAMETERS } from '@/lib/analytics/config';

// Use predefined events
analytics.trackEvent({
  event_name: ANALYTICS_EVENTS.RESUME_BUILDER.TEMPLATE_SELECTED,
  event_category: 'resume_builder',
  event_label: 'Modern Resume',
  custom_parameters: {
    [ANALYTICS_PARAMETERS.TEMPLATE_ID]: 'modern-template',
    [ANALYTICS_PARAMETERS.TEMPLATE_NAME]: 'Modern Resume',
  },
});
```

## Best Practices

### 1. Event Naming

- Use consistent naming conventions
- Use predefined event constants
- Include descriptive labels and categories

### 2. Data Structure

- Always include relevant context
- Use custom_parameters for additional data
- Avoid sending sensitive information

### 3. Performance

- Analytics calls are non-blocking
- Events are batched when possible
- Debug mode only runs in development

### 4. Privacy

- Respect user privacy preferences
- Don't track personal information
- Follow GDPR/CCPA guidelines

## Troubleshooting

### Common Issues

1. **Events not appearing in GA4**
   - Check measurement ID is correct
   - Verify events are being sent
   - Check GA4 real-time reports

2. **Debug mode not working**
   - Ensure NODE_ENV is 'development'
   - Check analytics config debug setting
   - Verify console is not filtered

3. **Performance issues**
   - Analytics calls are async and non-blocking
   - Check for infinite loops in event handlers
   - Monitor console for errors

### Debug Commands

```typescript
// Check if analytics is ready
console.log('Analytics ready:', analytics.isReady());

// Get current session
console.log('Session:', analytics.getSession());

// Get active providers
console.log('Providers:', analytics.getProviders());
```

## Integration Examples

### Resume Builder Integration

```tsx
import { ResumeAnalytics } from '@/lib/analytics/resume-analytics';

function ResumeBuilder() {
  const handleTemplateSelect = template => {
    ResumeAnalytics.trackTemplateSelected({
      templateId: template.id,
      templateName: template.name,
      templateCategory: template.category,
    });
  };

  const handleContentEdit = (section, content) => {
    ResumeAnalytics.trackContentEdited({
      sectionType: section.type,
      sectionIndex: section.index,
      contentLength: content.length,
      templateId: template.id,
    });
  };

  const handleExport = format => {
    ResumeAnalytics.trackExportStarted({
      exportFormat: format,
      templateId: template.id,
      templateName: template.name,
    });
  };

  return <div>{/* Resume builder UI */}</div>;
}
```

### Template Gallery Integration

```tsx
import { TemplateAnalytics } from '@/lib/analytics/template-analytics';

function TemplateGallery() {
  const handleTemplatePreview = template => {
    TemplateAnalytics.trackPreviewOpened({
      templateId: template.id,
      templateName: template.name,
      templateCategory: template.category,
    });
  };

  const handleTemplateSelect = template => {
    TemplateAnalytics.trackSelected({
      templateId: template.id,
      templateName: template.name,
      templateCategory: template.category,
    });
  };

  const handleSearch = (query, results) => {
    TemplateAnalytics.trackSearchPerformed({
      searchQuery: query,
      resultsCount: results.length,
      templateCategory: 'all',
    });
  };

  return <div>{/* Template gallery UI */}</div>;
}
```

This analytics system provides comprehensive tracking capabilities while maintaining performance and privacy standards. Use it to gain insights into user behavior and optimize your portfolio website experience.
