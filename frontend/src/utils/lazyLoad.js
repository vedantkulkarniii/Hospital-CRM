import { lazy, Suspense } from 'react';
import { Loader2 } from 'lucide-react';

/**
 * Generic lazy loading wrapper with loading fallback
 * Automatically handles code splitting and loading states
 * 
 * Usage:
 * const LazyComponent = lazyLoad(() => import('./Component.jsx'));
 */
export const lazyLoad = (importFn) => {
  const Component = lazy(importFn);
  
  return (props) => (
    <Suspense fallback={<LazyComponentLoader />}>
      <Component {...props} />
    </Suspense>
  );
};

/**
 * Fallback loader component for lazy-loaded components
 */
export function LazyComponentLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="flex flex-col items-center gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-primary-600" aria-label="Loading" />
        <p className="text-sm text-gray-500">Loading page...</p>
      </div>
    </div>
  );
}

/**
 * Lazy load page with route loading states
 * Useful for route-level code splitting
 */
export const lazyLoadPage = (importFn) => {
  return lazy(importFn);
};
