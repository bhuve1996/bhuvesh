/**
 * Google AdSense Component
 * Displays Google AdSense ads for website monetization
 */

import Script from 'next/script';
import { useEffect, useState } from 'react';

interface AdSenseProps {
  adSlot: string;
  adFormat?: 'auto' | 'rectangle' | 'vertical' | 'horizontal';
  adStyle?: React.CSSProperties;
  className?: string;
  responsive?: boolean;
  testMode?: boolean;
}

export function AdSense({
  adSlot,
  adFormat = 'auto',
  adStyle = { display: 'block' },
  className = '',
  responsive = true,
  testMode = false,
}: AdSenseProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Don't render in development or if AdSense is disabled
  if (!isClient || process.env.NODE_ENV === 'development') {
    return (
      <div className={`adsense-placeholder ${className}`}>
        <div className='bg-gray-200 dark:bg-gray-700 rounded-lg p-8 text-center text-gray-500 dark:text-gray-400'>
          <p>AdSense Ad Placeholder</p>
          <p className='text-sm'>Slot: {adSlot}</p>
        </div>
      </div>
    );
  }

  // Don't render if no AdSense publisher ID is configured
  if (!process.env.NEXT_PUBLIC_ADSENSE_PUBLISHER_ID) {
    return null;
  }

  const handleAdLoad = () => {
    // Ad loaded successfully
  };

  return (
    <div className={`adsense-container ${className}`}>
      <Script
        async
        src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_ADSENSE_PUBLISHER_ID}`}
        crossOrigin='anonymous'
        onLoad={handleAdLoad}
      />

      <ins
        className='adsbygoogle'
        style={adStyle}
        data-ad-client={process.env.NEXT_PUBLIC_ADSENSE_PUBLISHER_ID}
        data-ad-slot={adSlot}
        data-ad-format={adFormat}
        data-full-width-responsive={responsive ? 'true' : 'false'}
        data-test-mode={testMode ? 'true' : 'false'}
      />

      <Script id={`adsense-${adSlot}`}>
        {`
          try {
            (adsbygoogle = window.adsbygoogle || []).push({});
          } catch (e) {
            console.error('AdSense error:', e);
          }
        `}
      </Script>
    </div>
  );
}

// Predefined ad components for common placements
export function HeaderAd({ className = '' }: { className?: string }) {
  return (
    <AdSense
      adSlot='1234567890' // Replace with your actual ad slot
      adFormat='horizontal'
      className={`header-ad ${className}`}
      adStyle={{ display: 'block', width: '728px', height: '90px' }}
    />
  );
}

export function SidebarAd({ className = '' }: { className?: string }) {
  return (
    <AdSense
      adSlot='1234567891' // Replace with your actual ad slot
      adFormat='vertical'
      className={`sidebar-ad ${className}`}
      adStyle={{ display: 'block', width: '300px', height: '250px' }}
    />
  );
}

export function InContentAd({ className = '' }: { className?: string }) {
  return (
    <AdSense
      adSlot='1234567892' // Replace with your actual ad slot
      adFormat='rectangle'
      className={`in-content-ad ${className}`}
      adStyle={{ display: 'block', width: '336px', height: '280px' }}
    />
  );
}

export function FooterAd({ className = '' }: { className?: string }) {
  return (
    <AdSense
      adSlot='1234567893' // Replace with your actual ad slot
      adFormat='horizontal'
      className={`footer-ad ${className}`}
      adStyle={{ display: 'block', width: '728px', height: '90px' }}
    />
  );
}

export function ResponsiveAd({ className = '' }: { className?: string }) {
  return (
    <AdSense
      adSlot='1234567894' // Replace with your actual ad slot
      adFormat='auto'
      responsive={true}
      className={`responsive-ad ${className}`}
    />
  );
}

// Mobile-specific ad component
export function MobileAd({ className = '' }: { className?: string }) {
  return (
    <div className={`mobile-ad-container ${className}`}>
      <AdSense
        adSlot='1234567895' // Replace with your actual ad slot
        adFormat='rectangle'
        className='mobile-ad'
        adStyle={{ display: 'block', width: '320px', height: '50px' }}
      />
    </div>
  );
}
