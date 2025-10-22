'use client';

import { usePathname } from 'next/navigation';

import { Footer, Navigation } from '@/components/layout';
import { Toast } from '@/components/ui';

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
    <>
      {/* Skip link for keyboard navigation */}
      <a href='#main-content' className='skip-link' tabIndex={1}>
        Skip to main content
      </a>
      <Navigation />
      <main id='main-content' className='min-h-screen pt-24' tabIndex={-1}>
        {children}
      </main>
      <Footer />
      <Toast />
    </>
  );
}
