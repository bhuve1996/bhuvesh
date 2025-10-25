/**
 * AdSense Hook
 * React hook for managing AdSense ads and performance
 */

import { useCallback, useEffect, useState } from 'react';

import { AD_PLACEMENT_RULES, adsenseConfig } from '@/lib/adsense/config';

export interface UseAdSenseReturn {
  isEnabled: boolean;
  isTestMode: boolean;
  publisherId: string;
  canShowAd: (pagePath: string) => boolean;
  getAdSlot: (adType: keyof typeof adsenseConfig.adSlots) => string;
  trackAdClick: (adSlot: string, adType: string) => void;
  trackAdImpression: (adSlot: string, adType: string) => void;
  isAdBlocked: boolean;
}

export function useAdSense(): UseAdSenseReturn {
  const [isAdBlocked, setIsAdBlocked] = useState(false);

  useEffect(() => {
    // Check for ad blockers
    const checkAdBlocker = () => {
      const testAd = document.createElement('div');
      testAd.innerHTML = '&nbsp;';
      testAd.className = 'adsbox';
      testAd.style.cssText = 'position:absolute;left:-10000px;';
      document.body.appendChild(testAd);

      setTimeout(() => {
        if (testAd.offsetHeight === 0) {
          setIsAdBlocked(true);
        }
        document.body.removeChild(testAd);
      }, 100);
    };

    if (typeof window !== 'undefined') {
      checkAdBlocker();
    }
  }, []);

  const canShowAd = useCallback(
    (pagePath: string) => {
      if (!adsenseConfig.enabled || isAdBlocked) {
        return false;
      }

      // Check if page is in blocked pages
      if (
        AD_PLACEMENT_RULES.blockedPages.some(blockedPage =>
          pagePath.startsWith(blockedPage)
        )
      ) {
        return false;
      }

      // Check if page is in allowed pages
      return AD_PLACEMENT_RULES.allowedPages.some(allowedPage =>
        pagePath.startsWith(allowedPage)
      );
    },
    [isAdBlocked]
  );

  const getAdSlot = useCallback(
    (adType: keyof typeof adsenseConfig.adSlots) => {
      return adsenseConfig.adSlots[adType];
    },
    []
  );

  const trackAdClick = useCallback((adSlot: string, adType: string) => {
    if (adsenseConfig.enabled && typeof window !== 'undefined') {
      // Track ad click in analytics
      if (window.gtag) {
        window.gtag('event', 'ad_click', {
          ad_slot: adSlot,
          ad_type: adType,
          page_path: window.location.pathname,
        });
      }

      // eslint-disable-next-line no-console
      console.log('Ad clicked:', { adSlot, adType });
    }
  }, []);

  const trackAdImpression = useCallback((adSlot: string, adType: string) => {
    if (adsenseConfig.enabled && typeof window !== 'undefined') {
      // Track ad impression in analytics
      if (window.gtag) {
        window.gtag('event', 'ad_impression', {
          ad_slot: adSlot,
          ad_type: adType,
          page_path: window.location.pathname,
        });
      }

      // eslint-disable-next-line no-console
      console.log('Ad impression:', { adSlot, adType });
    }
  }, []);

  return {
    isEnabled: adsenseConfig.enabled,
    isTestMode: adsenseConfig.testMode,
    publisherId: adsenseConfig.publisherId,
    canShowAd,
    getAdSlot,
    trackAdClick,
    trackAdImpression,
    isAdBlocked,
  };
}
