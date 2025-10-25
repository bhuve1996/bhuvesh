/**
 * Google AdSense Configuration
 * Configuration settings for AdSense integration
 */

export interface AdSenseConfig {
  publisherId: string;
  enabled: boolean;
  testMode: boolean;
  adSlots: {
    header: string;
    sidebar: string;
    inContent: string;
    footer: string;
    responsive: string;
    mobile: string;
  };
  adFormats: {
    header: 'horizontal' | 'auto';
    sidebar: 'vertical' | 'auto';
    inContent: 'rectangle' | 'auto';
    footer: 'horizontal' | 'auto';
    responsive: 'auto';
    mobile: 'rectangle' | 'auto';
  };
  adSizes: {
    header: { width: number; height: number };
    sidebar: { width: number; height: number };
    inContent: { width: number; height: number };
    footer: { width: number; height: number };
    mobile: { width: number; height: number };
  };
}

export const adsenseConfig: AdSenseConfig = {
  publisherId: process.env.NEXT_PUBLIC_ADSENSE_PUBLISHER_ID || '',
  enabled:
    process.env.NODE_ENV === 'production' &&
    !!process.env.NEXT_PUBLIC_ADSENSE_PUBLISHER_ID,
  testMode: process.env.NODE_ENV === 'development',
  adSlots: {
    header: process.env.NEXT_PUBLIC_ADSENSE_HEADER_SLOT || '1234567890',
    sidebar: process.env.NEXT_PUBLIC_ADSENSE_SIDEBAR_SLOT || '1234567891',
    inContent: process.env.NEXT_PUBLIC_ADSENSE_INCONTENT_SLOT || '1234567892',
    footer: process.env.NEXT_PUBLIC_ADSENSE_FOOTER_SLOT || '1234567893',
    responsive: process.env.NEXT_PUBLIC_ADSENSE_RESPONSIVE_SLOT || '1234567894',
    mobile: process.env.NEXT_PUBLIC_ADSENSE_MOBILE_SLOT || '1234567895',
  },
  adFormats: {
    header: 'horizontal',
    sidebar: 'vertical',
    inContent: 'rectangle',
    footer: 'horizontal',
    responsive: 'auto',
    mobile: 'rectangle',
  },
  adSizes: {
    header: { width: 728, height: 90 },
    sidebar: { width: 300, height: 250 },
    inContent: { width: 336, height: 280 },
    footer: { width: 728, height: 90 },
    mobile: { width: 320, height: 50 },
  },
};

// Ad placement rules
export const AD_PLACEMENT_RULES = {
  // Minimum content length before showing ads
  minContentLength: 300,

  // Maximum ads per page
  maxAdsPerPage: 3,

  // Ad spacing (in pixels)
  adSpacing: 24,

  // Pages where ads should be shown
  allowedPages: ['/', '/about', '/projects', '/blog', '/services', '/contact'],

  // Pages where ads should NOT be shown
  blockedPages: [
    '/resume/builder',
    '/resume/ats-checker',
    '/admin',
    '/dashboard',
  ],

  // User agents to block (bots, etc.)
  blockedUserAgents: ['bot', 'crawler', 'spider', 'scraper'],
};

// Ad performance tracking
export const AD_PERFORMANCE_CONFIG = {
  trackClicks: true,
  trackImpressions: true,
  trackRevenue: true,
  analyticsEnabled: true,
};
