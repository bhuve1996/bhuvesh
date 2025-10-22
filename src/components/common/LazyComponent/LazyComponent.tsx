'use client';

import dynamic from 'next/dynamic';
import React, { ComponentType, Suspense } from 'react';

import { Loading } from '@/components/ui/Loading';

interface LazyComponentProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  delay?: number;
}

// Default loading component
const DefaultFallback = () => (
  <div className='flex items-center justify-center p-8'>
    <Loading size='md' />
  </div>
);

// Higher-order component for lazy loading
export function withLazyLoading<P extends object>(
  Component: ComponentType<P>,
  fallback?: React.ReactNode
) {
  return dynamic(() => Promise.resolve(Component), {
    loading: () => fallback || <DefaultFallback />,
    ssr: false,
  });
}

// Lazy component wrapper
export const LazyComponent: React.FC<LazyComponentProps> = ({
  children,
  fallback = <DefaultFallback />,
  delay = 0,
}) => {
  return (
    <Suspense fallback={fallback}>
      <div style={{ animationDelay: `${delay}ms` }}>{children}</div>
    </Suspense>
  );
};

// Preload function for critical components
export function preloadComponent(
  importFn: () => Promise<{ default: React.ComponentType<unknown> }>
) {
  if (typeof window !== 'undefined') {
    importFn();
  }
}

export default LazyComponent;
