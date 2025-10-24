'use client';

import { usePathname } from 'next/navigation';

import { AnalyticsDebugger } from '@/components/analytics/AnalyticsDebugger';
import { Footer, Navigation } from '@/components/layout';
import { SessionProvider } from '@/components/providers/SessionProvider';
import { Toast } from '@/components/ui';
import { AnalyticsProvider } from '@/contexts/AnalyticsContext';
import { ResumeNavigationProvider } from '@/contexts/ResumeNavigationContext';
import { ThemeProvider } from '@/contexts/ThemeContext';

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Home page has its own Navigation with scroll tracking
  // So we skip adding Navigation here for home page
  const isHomePage = pathname === '/';

  if (isHomePage) {
    return (
      <ThemeProvider>
        <SessionProvider>
          <AnalyticsProvider
            trackPageViews={true}
            trackScrollDepth={true}
            trackTimeOnPage={true}
          >
            {children}
            <Toast />
            <AnalyticsDebugger
              enabled={process.env.NODE_ENV === 'development'}
            />
          </AnalyticsProvider>
        </SessionProvider>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider>
      <SessionProvider>
        <AnalyticsProvider
          trackPageViews={true}
          trackScrollDepth={true}
          trackTimeOnPage={true}
        >
          <ResumeNavigationProvider>
            {/* Skip link for keyboard navigation */}
            <a href='#main-content' className='skip-link' tabIndex={1}>
              Skip to main content
            </a>
            <Navigation />
            <main id='main-content' className='min-h-screen' tabIndex={-1}>
              <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
                {children}
              </div>
            </main>
            <Footer />
            <Toast />
            <AnalyticsDebugger
              enabled={process.env.NODE_ENV === 'development'}
            />
          </ResumeNavigationProvider>
        </AnalyticsProvider>
      </SessionProvider>
    </ThemeProvider>
  );
}
