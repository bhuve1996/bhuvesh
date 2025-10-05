'use client';

import { usePathname } from 'next/navigation';

import { Navigation } from '@/components/layout';

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Home page has its own Navigation with scroll tracking
  // So we skip adding Navigation here for home page
  const isHomePage = pathname === '/';

  if (isHomePage) {
    return <>{children}</>;
  }

  return (
    <>
      <Navigation />
      {children}
    </>
  );
}
