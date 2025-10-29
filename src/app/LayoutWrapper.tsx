'use client';

import { AnalyticsDebugger } from '@/components/analytics/AnalyticsDebugger';
import { Footer, Navigation } from '@/components/layout';
import { SessionProvider } from '@/components/providers/SessionProvider';
import { Toast, TourManager } from '@/components/ui';
import { AnalyticsProvider } from '@/contexts/AnalyticsContext';
import { ResumeNavigationProvider } from '@/contexts/ResumeNavigationContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { TourProvider } from '@/contexts/TourContext';

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
  // All pages use the same Navigation component
  // No special cases needed
  return (
    <ThemeProvider>
      <SessionProvider>
        <TourProvider>
          <AnalyticsProvider
            trackPageViews={true}
            trackScrollDepth={true}
            trackTimeOnPage={true}
          >
            <ResumeNavigationProvider>
              <TourManager>
                {/* Skip link for keyboard navigation */}
                <a href='#main-content' className='skip-link' tabIndex={1}>
                  Skip to main content
                </a>
                <Navigation />
                <main id='main-content' className='min-h-screen' tabIndex={-1}>
                  <div className='container mx-auto px-2 sm:px-3 lg:px-4'>
                    {children}
                  </div>
                </main>
                <Footer />
                <Toast />
                <AnalyticsDebugger
                  enabled={process.env.NODE_ENV === 'development'}
                  position='bottom-left'
                />
              </TourManager>
            </ResumeNavigationProvider>
          </AnalyticsProvider>
        </TourProvider>
      </SessionProvider>
    </ThemeProvider>
  );
}
