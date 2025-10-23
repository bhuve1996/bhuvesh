'use client';

import { usePathname } from 'next/navigation';

import { Footer, Navigation } from '@/components/layout';
import { Toast } from '@/components/ui';
import { ResumeNavigationProvider } from '@/contexts/ResumeNavigationContext';

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Home page has its own Navigation with scroll tracking
  // So we skip adding Navigation here for home page
  const isHomePage = pathname === '/';

  if (isHomePage) {
    return (
      <>
        {children}
        <Toast />
      </>
    );
  }

  return (
    <ResumeNavigationProvider>
      {/* Skip link for keyboard navigation */}
      <a href='#main-content' className='skip-link' tabIndex={1}>
        Skip to main content
      </a>
      <Navigation />
      <main id='main-content' className='min-h-screen' tabIndex={-1}>
        <div className='container mx-auto px-4 sm:px-6 lg:px-8'>{children}</div>
      </main>
      <Footer />
      <Toast />
    </ResumeNavigationProvider>
  );
}
