/**
 * Ad Placement Component
 * Strategic ad placement wrapper with responsive design
 */

import { ReactNode } from 'react';

import { AdSense, InContentAd, ResponsiveAd, SidebarAd } from './AdSense';

interface AdPlacementProps {
  children: ReactNode;
  adType?: 'sidebar' | 'in-content' | 'responsive' | 'custom';
  adSlot?: string;
  className?: string;
  showAd?: boolean;
}

export function AdPlacement({
  children,
  adType = 'responsive',
  adSlot,
  className = '',
  showAd = true,
}: AdPlacementProps) {
  if (!showAd) {
    return <>{children}</>;
  }

  const renderAd = () => {
    switch (adType) {
      case 'sidebar':
        return <SidebarAd className='mb-6' />;
      case 'in-content':
        return <InContentAd className='my-8' />;
      case 'responsive':
        return <ResponsiveAd className='my-6' />;
      case 'custom':
        return adSlot ? (
          <AdSense
            adSlot={adSlot}
            className='my-6'
            adFormat='auto'
            responsive={true}
          />
        ) : null;
      default:
        return <ResponsiveAd className='my-6' />;
    }
  };

  return (
    <div className={`ad-placement ${className}`}>
      {children}
      {renderAd()}
    </div>
  );
}

// Specific placement components for different page sections
export function BlogAdPlacement({ children }: { children: ReactNode }) {
  return (
    <AdPlacement adType='in-content' className='blog-content'>
      {children}
    </AdPlacement>
  );
}

export function ProjectAdPlacement({ children }: { children: ReactNode }) {
  return (
    <AdPlacement adType='responsive' className='project-content'>
      {children}
    </AdPlacement>
  );
}

export function ResumeAdPlacement({ children }: { children: ReactNode }) {
  return (
    <AdPlacement adType='responsive' className='resume-content'>
      {children}
    </AdPlacement>
  );
}

// Ad wrapper for sidebar content
export function SidebarWithAd({ children }: { children: ReactNode }) {
  return (
    <div className='sidebar-with-ad'>
      <div className='sidebar-content'>{children}</div>
      <div className='sidebar-ad-container'>
        <SidebarAd />
      </div>
    </div>
  );
}

// Ad wrapper for content sections
export function ContentWithAds({ children }: { children: ReactNode }) {
  return (
    <div className='content-with-ads'>
      <div className='content-section'>
        <ResponsiveAd className='mb-6' />
        {children}
        <ResponsiveAd className='mt-6' />
      </div>
    </div>
  );
}
