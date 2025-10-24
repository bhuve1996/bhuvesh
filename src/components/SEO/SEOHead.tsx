import React from 'react';

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string[];
  canonicalUrl?: string;
  ogImage?: string;
  ogType?: string;
  twitterCard?: string;
  noindex?: boolean;
  nofollow?: boolean;
}

export const SEOHead: React.FC<SEOHeadProps> = ({
  title,
  description,
  keywords = [],
  canonicalUrl,
  ogImage = '/og-image.png',
  ogType = 'website',
  twitterCard = 'summary_large_image',
  noindex = false,
  nofollow = false,
}) => {
  const robotsContent = [
    noindex ? 'noindex' : 'index',
    nofollow ? 'nofollow' : 'follow',
    'max-image-preview:large',
    'max-snippet:-1',
    'max-video-preview:-1',
  ].join(', ');

  return (
    <>
      {/* Basic Meta Tags */}
      {title && <title>{title}</title>}
      {description && <meta name='description' content={description} />}
      {keywords.length > 0 && (
        <meta name='keywords' content={keywords.join(', ')} />
      )}

      {/* Canonical URL */}
      {canonicalUrl && <link rel='canonical' href={canonicalUrl} />}

      {/* Robots */}
      <meta name='robots' content={robotsContent} />
      <meta name='googlebot' content={robotsContent} />
      <meta name='bingbot' content={robotsContent} />

      {/* Open Graph */}
      {title && <meta property='og:title' content={title} />}
      {description && <meta property='og:description' content={description} />}
      <meta property='og:type' content={ogType} />
      <meta property='og:url' content={canonicalUrl || 'https://bhuvesh.com'} />
      <meta property='og:image' content={ogImage} />
      <meta property='og:image:width' content='1200' />
      <meta property='og:image:height' content='630' />
      <meta property='og:image:type' content='image/png' />
      <meta
        property='og:site_name'
        content='Bhuvesh Singla - Full-Stack Developer'
      />
      <meta property='og:locale' content='en_US' />

      {/* Twitter Card */}
      <meta name='twitter:card' content={twitterCard} />
      <meta name='twitter:site' content='@bhuvesh_singla' />
      <meta name='twitter:creator' content='@bhuvesh_singla' />
      {title && <meta name='twitter:title' content={title} />}
      {description && <meta name='twitter:description' content={description} />}
      <meta name='twitter:image' content={ogImage} />

      {/* Additional SEO Meta Tags */}
      <meta name='author' content='Bhuvesh Singla' />
      <meta name='publisher' content='Bhuvesh Singla' />
      <meta
        name='copyright'
        content={`© ${new Date().getFullYear()} Bhuvesh Singla`}
      />
      <meta name='language' content='en-US' />
      <meta name='revisit-after' content='7 days' />
      <meta name='distribution' content='global' />
      <meta name='rating' content='general' />

      {/* Mobile Optimization */}
      <meta name='format-detection' content='telephone=no' />
      <meta name='format-detection' content='date=no' />
      <meta name='format-detection' content='address=no' />
      <meta name='format-detection' content='email=no' />

      {/* Performance Hints */}
      <link rel='dns-prefetch' href='//fonts.googleapis.com' />
      <link rel='dns-prefetch' href='//fonts.gstatic.com' />
      <link rel='preconnect' href='https://fonts.googleapis.com' />
      <link
        rel='preconnect'
        href='https://fonts.gstatic.com'
        crossOrigin='anonymous'
      />
    </>
  );
};

export default SEOHead;
