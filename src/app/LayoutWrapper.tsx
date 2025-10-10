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
      <Navigation />
      <main className='min-h-screen'>{children}</main>
      <Footer />
      <Toast />
    </>
  );
}
