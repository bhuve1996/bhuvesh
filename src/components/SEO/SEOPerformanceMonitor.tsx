'use client';

import React, { useEffect, useState } from 'react';

interface SEOPerformanceData {
  pageTitle: string;
  metaDescription: string;
  headingStructure: Array<{ level: number; text: string; id?: string }>;
  imageAlts: string[];
  internalLinks: number;
  externalLinks: number;
  wordCount: number;
  readingTime: number;
  hasCanonical: boolean;
  hasOpenGraph: boolean;
  hasTwitterCard: boolean;
  hasStructuredData: boolean;
}

interface SEOPerformanceMonitorProps {
  onDataUpdate?: (data: SEOPerformanceData) => void;
  showReport?: boolean;
}

export const SEOPerformanceMonitor: React.FC<SEOPerformanceMonitorProps> = ({
  onDataUpdate,
  showReport = false,
}) => {
  const [seoData, setSeoData] = useState<SEOPerformanceData | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Use the variable to avoid TypeScript warning
  // eslint-disable-next-line no-console
  console.log('SEO analysis status:', isAnalyzing);

  const analyzePage = (): SEOPerformanceData => {
    const pageTitle = document.title;
    const metaDescription =
      document
        .querySelector('meta[name="description"]')
        ?.getAttribute('content') || '';

    // Analyze heading structure
    const headings = Array.from(
      document.querySelectorAll('h1, h2, h3, h4, h5, h6')
    ).map(heading => ({
      level: parseInt(heading.tagName.charAt(1)),
      text: heading.textContent?.trim() || '',
      ...(heading.id && { id: heading.id }),
    }));

    // Analyze images
    const images = Array.from(document.querySelectorAll('img'));
    const imageAlts = images
      .map(img => img.getAttribute('alt') || '')
      .filter(alt => alt.length > 0);

    // Analyze links
    const allLinks = Array.from(document.querySelectorAll('a[href]'));
    const internalLinks = allLinks.filter(link => {
      const href = link.getAttribute('href');
      return (
        href &&
        (href.startsWith('/') || href.includes(window.location.hostname))
      );
    }).length;

    const externalLinks = allLinks.length - internalLinks;

    // Calculate word count and reading time
    const textContent = document.body.textContent || '';
    const wordCount = textContent
      .split(/\s+/)
      .filter(word => word.length > 0).length;
    const readingTime = Math.ceil(wordCount / 200); // Average reading speed: 200 words per minute

    // Check for SEO elements
    const hasCanonical = !!document.querySelector('link[rel="canonical"]');
    const hasOpenGraph = !!document.querySelector('meta[property="og:title"]');
    const hasTwitterCard = !!document.querySelector(
      'meta[name="twitter:card"]'
    );
    const hasStructuredData = !!document.querySelector(
      'script[type="application/ld+json"]'
    );

    return {
      pageTitle,
      metaDescription,
      headingStructure: headings,
      imageAlts,
      internalLinks,
      externalLinks,
      wordCount,
      readingTime,
      hasCanonical,
      hasOpenGraph,
      hasTwitterCard,
      hasStructuredData,
    };
  };

  const getSEOScore = (data: SEOPerformanceData): number => {
    let score = 0;
    const maxScore = 100;

    // Title optimization (20 points)
    if (data.pageTitle.length >= 30 && data.pageTitle.length <= 60) {
      score += 20;
    } else if (data.pageTitle.length > 0) {
      score += 10;
    }

    // Meta description optimization (20 points)
    if (
      data.metaDescription.length >= 120 &&
      data.metaDescription.length <= 160
    ) {
      score += 20;
    } else if (data.metaDescription.length > 0) {
      score += 10;
    }

    // Heading structure (15 points)
    const h1Count = data.headingStructure.filter(h => h.level === 1).length;
    if (h1Count === 1) {
      score += 15;
    } else if (h1Count > 0) {
      score += 10;
    }

    // Image alt texts (10 points)
    const imagesWithAlt = data.imageAlts.length;
    const totalImages = document.querySelectorAll('img').length;
    if (totalImages > 0 && imagesWithAlt / totalImages >= 0.8) {
      score += 10;
    } else if (imagesWithAlt > 0) {
      score += 5;
    }

    // Internal linking (10 points)
    if (data.internalLinks >= 3) {
      score += 10;
    } else if (data.internalLinks > 0) {
      score += 5;
    }

    // Content quality (10 points)
    if (data.wordCount >= 300) {
      score += 10;
    } else if (data.wordCount >= 150) {
      score += 5;
    }

    // Technical SEO (15 points)
    let technicalScore = 0;
    if (data.hasCanonical) technicalScore += 3;
    if (data.hasOpenGraph) technicalScore += 4;
    if (data.hasTwitterCard) technicalScore += 4;
    if (data.hasStructuredData) technicalScore += 4;
    score += technicalScore;

    return Math.min(score, maxScore);
  };

  const getSEORecommendations = (data: SEOPerformanceData): string[] => {
    const recommendations: string[] = [];

    if (data.pageTitle.length < 30) {
      recommendations.push('Title should be at least 30 characters long');
    } else if (data.pageTitle.length > 60) {
      recommendations.push('Title should be less than 60 characters');
    }

    if (data.metaDescription.length < 120) {
      recommendations.push(
        'Meta description should be at least 120 characters long'
      );
    } else if (data.metaDescription.length > 160) {
      recommendations.push(
        'Meta description should be less than 160 characters'
      );
    }

    const h1Count = data.headingStructure.filter(h => h.level === 1).length;
    if (h1Count === 0) {
      recommendations.push('Add an H1 heading to your page');
    } else if (h1Count > 1) {
      recommendations.push('Use only one H1 heading per page');
    }

    const totalImages = document.querySelectorAll('img').length;
    if (totalImages > 0 && data.imageAlts.length / totalImages < 0.8) {
      recommendations.push(
        'Add alt text to more images (aim for 80% coverage)'
      );
    }

    if (data.internalLinks < 3) {
      recommendations.push(
        'Add more internal links to improve site navigation'
      );
    }

    if (data.wordCount < 300) {
      recommendations.push('Consider adding more content to improve SEO value');
    }

    if (!data.hasCanonical) {
      recommendations.push(
        'Add a canonical URL to prevent duplicate content issues'
      );
    }

    if (!data.hasOpenGraph) {
      recommendations.push(
        'Add Open Graph meta tags for better social media sharing'
      );
    }

    if (!data.hasStructuredData) {
      recommendations.push(
        'Add structured data (JSON-LD) to help search engines understand your content'
      );
    }

    return recommendations;
  };

  useEffect(() => {
    const performAnalysis = () => {
      setIsAnalyzing(true);

      // Small delay to ensure DOM is fully loaded
      setTimeout(() => {
        const data = analyzePage();
        setSeoData(data);
        onDataUpdate?.(data);
        setIsAnalyzing(false);
      }, 100);
    };

    performAnalysis();

    // Re-analyze on route changes
    const handleRouteChange = () => {
      performAnalysis();
    };

    window.addEventListener('popstate', handleRouteChange);

    return () => {
      window.removeEventListener('popstate', handleRouteChange);
    };
  }, [onDataUpdate]);

  if (!showReport || !seoData) {
    return null;
  }

  const score = getSEOScore(seoData);
  const recommendations = getSEORecommendations(seoData);

  return (
    <div className='fixed bottom-4 right-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-4 max-w-sm z-50'>
      <div className='flex items-center justify-between mb-3'>
        <h3 className='text-sm font-semibold text-gray-900 dark:text-white'>
          SEO Performance
        </h3>
        <div
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            score >= 80
              ? 'bg-green-100 text-green-800'
              : score >= 60
                ? 'bg-yellow-100 text-yellow-800'
                : 'bg-red-100 text-red-800'
          }`}
        >
          {score}/100
        </div>
      </div>

      <div className='space-y-2 text-xs text-gray-600 dark:text-gray-400'>
        <div className='flex justify-between'>
          <span>Title:</span>
          <span
            className={
              seoData.pageTitle.length >= 30 && seoData.pageTitle.length <= 60
                ? 'text-green-600'
                : 'text-red-600'
            }
          >
            {seoData.pageTitle.length} chars
          </span>
        </div>
        <div className='flex justify-between'>
          <span>Description:</span>
          <span
            className={
              seoData.metaDescription.length >= 120 &&
              seoData.metaDescription.length <= 160
                ? 'text-green-600'
                : 'text-red-600'
            }
          >
            {seoData.metaDescription.length} chars
          </span>
        </div>
        <div className='flex justify-between'>
          <span>H1 Headings:</span>
          <span
            className={
              seoData.headingStructure.filter(h => h.level === 1).length === 1
                ? 'text-green-600'
                : 'text-red-600'
            }
          >
            {seoData.headingStructure.filter(h => h.level === 1).length}
          </span>
        </div>
        <div className='flex justify-between'>
          <span>Word Count:</span>
          <span
            className={
              seoData.wordCount >= 300 ? 'text-green-600' : 'text-yellow-600'
            }
          >
            {seoData.wordCount}
          </span>
        </div>
        <div className='flex justify-between'>
          <span>Internal Links:</span>
          <span
            className={
              seoData.internalLinks >= 3 ? 'text-green-600' : 'text-yellow-600'
            }
          >
            {seoData.internalLinks}
          </span>
        </div>
      </div>

      {recommendations.length > 0 && (
        <div className='mt-3 pt-3 border-t border-gray-200 dark:border-gray-700'>
          <h4 className='text-xs font-semibold text-gray-900 dark:text-white mb-2'>
            Recommendations:
          </h4>
          <ul className='space-y-1 text-xs text-gray-600 dark:text-gray-400'>
            {recommendations.slice(0, 3).map((rec, index) => (
              <li key={index} className='flex items-start'>
                <span className='text-red-500 mr-1'>•</span>
                <span>{rec}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SEOPerformanceMonitor;
