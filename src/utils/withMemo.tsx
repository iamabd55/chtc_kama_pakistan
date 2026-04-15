/**
 * Higher-Order Component (HOC) for memoizing components with custom comparison
 * Provides better control over re-render optimization
 */

import { memo, lazy, Suspense, type ComponentType } from "react";
import { shallowEqual } from "@/utils/optimization";

/**
 * Memoize component with shallow equality check on props
 */
export const withMemo = <P extends object>(
  Component: ComponentType<P>,
  displayName?: string
): ComponentType<P> => {
  const MemoizedComponent = memo(Component, (prevProps, nextProps) => {
    return shallowEqual(prevProps, nextProps);
  });

  if (displayName) {
    MemoizedComponent.displayName = displayName;
  }

  return MemoizedComponent as any;
};

/**
 * Memoize component with deep equality check (use sparingly)
 */
export const withDeepMemo = <P extends object>(
  Component: ComponentType<P>,
  displayName?: string
): ComponentType<P> => {
  const MemoizedComponent = memo(Component, (prevProps, nextProps) => {
    // Return true if props are equal (meaning don't re-render)
    // Return false if props are different (meaning re-render)
    const keys = Object.keys(prevProps);
    if (keys.length !== Object.keys(nextProps).length) {
      return false;
    }

    for (const key of keys) {
      if (
        JSON.stringify((prevProps as any)[key]) !==
        JSON.stringify((nextProps as any)[key])
      ) {
        return false;
      }
    }

    return true;
  });

  if (displayName) {
    MemoizedComponent.displayName = displayName;
  }

  return MemoizedComponent as any;
};

/**
 * Lazy load component with loading fallback
 * Use for route-based components and heavy sections
 */
export const withLazyLoad = <P extends object>(
  Component: ComponentType<P>,
  LoadingFallback?: ComponentType
) : ComponentType<P> => {
  const LazyComponent = lazy(() =>
    Promise.resolve().then(() => ({ default: Component }))
  );

  return ((props: P) => (
    <Suspense fallback={LoadingFallback ? <LoadingFallback /> : null}>
      <LazyComponent {...(props as any)} />
    </Suspense>
  )) as any;
};

export default "Import patterns from this file and apply to your components";
