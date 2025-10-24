import { PAGE_SEO_CONFIG, SEO_CONFIG } from './constants';

export interface SEOData {
  title: string;
  description: string;
  keywords: string[];
  canonicalUrl?: string;
  ogImage?: string;
  ogType?: string;
  noindex?: boolean;
  nofollow?: boolean;
}

export const generatePageSEO = (
  page: keyof typeof PAGE_SEO_CONFIG,
  customData?: Partial<SEOData>
): SEOData => {
  const baseConfig = PAGE_SEO_CONFIG[page];

  return {
    title: customData?.title || baseConfig.title,
    description: customData?.description || baseConfig.description,
    keywords: customData?.keywords || [...baseConfig.keywords],
    canonicalUrl:
      customData?.canonicalUrl ||
      `${SEO_CONFIG.SITE_URL}/${page.toLowerCase()}`,
    ogImage:
      customData?.ogImage ||
      `${SEO_CONFIG.SITE_URL}/og-${page.toLowerCase()}.png`,
    ogType: customData?.ogType || 'website',
    noindex: customData?.noindex || false,
    nofollow: customData?.nofollow || false,
  };
};

export const generateTitle = (
  pageTitle: string,
  includeSiteName = true
): string => {
  if (includeSiteName) {
    return `${pageTitle} | ${SEO_CONFIG.SITE_NAME}`;
  }
  return pageTitle;
};

export const generateDescription = (
  content: string,
  maxLength = 160
): string => {
  if (content.length <= maxLength) {
    return content;
  }

  // Find the last complete sentence within the limit
  const truncated = content.substring(0, maxLength);
  const lastPeriod = truncated.lastIndexOf('.');
  const lastExclamation = truncated.lastIndexOf('!');
  const lastQuestion = truncated.lastIndexOf('?');

  const lastSentenceEnd = Math.max(lastPeriod, lastExclamation, lastQuestion);

  if (lastSentenceEnd > maxLength * 0.7) {
    return truncated.substring(0, lastSentenceEnd + 1);
  }

  return truncated.substring(0, truncated.lastIndexOf(' ')) + '...';
};

export const generateKeywords = (
  baseKeywords: string[],
  additionalKeywords: string[] = []
): string[] => {
  const allKeywords = [...baseKeywords, ...additionalKeywords];
  const uniqueKeywords = Array.from(new Set(allKeywords));

  // Limit to 20 keywords for optimal SEO
  return uniqueKeywords.slice(0, 20);
};

export const generateCanonicalUrl = (path: string): string => {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${SEO_CONFIG.SITE_URL}${cleanPath}`;
};

export const generateOGImageUrl = (
  page: string,
  customImage?: string
): string => {
  if (customImage) {
    return customImage.startsWith('http')
      ? customImage
      : `${SEO_CONFIG.SITE_URL}${customImage}`;
  }
  return `${SEO_CONFIG.SITE_URL}/og-${page.toLowerCase()}.png`;
};

export const validateSEOData = (
  data: SEOData
): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (!data.title || data.title.length < 30) {
    errors.push('Title should be at least 30 characters long');
  }

  if (data.title && data.title.length > 60) {
    errors.push('Title should be less than 60 characters for optimal display');
  }

  if (!data.description || data.description.length < 120) {
    errors.push('Description should be at least 120 characters long');
  }

  if (data.description && data.description.length > 160) {
    errors.push(
      'Description should be less than 160 characters for optimal display'
    );
  }

  if (!data.keywords || data.keywords.length === 0) {
    errors.push('Keywords should not be empty');
  }

  if (data.keywords && data.keywords.length > 20) {
    errors.push('Keywords should not exceed 20 items');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

export const generateBreadcrumbStructuredData = (
  breadcrumbs: Array<{ name: string; url: string }>
) => {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.name,
      item: crumb.url,
    })),
  };
};

export const generateFAQStructuredData = (
  faqs: Array<{ question: string; answer: string }>
) => {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
};
