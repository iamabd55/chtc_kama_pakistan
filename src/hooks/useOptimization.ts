/**
 * Custom hooks for optimized component rendering
 * Use these to memoize callbacks and values efficiently
 */

import React, { useCallback, useMemo, useRef, useEffect, useState, DependencyList } from "react";
import { shallowEqual, deepEqual } from "@/utils/optimization";

/**
 * useStableMemo - Ensures consistent object references when values are equal
 * Useful for passing objects as dependencies to other hooks
 */
export function useStableMemo<T>(
  factory: () => T,
  deps: DependencyList,
  compareFn: (a: T, b: T) => boolean = shallowEqual
): T {
  const ref = useRef<T>();
  const prevDepsRef = useRef<DependencyList>(deps);

  const memoized = useMemo(() => {
    const newValue = factory();

    if (ref.current === undefined || !depsChanged(prevDepsRef.current, deps)) {
      if (ref.current !== undefined && compareFn(newValue, ref.current)) {
        return ref.current;
      }
    }

    ref.current = newValue;
    prevDepsRef.current = deps;
    return newValue;
  }, deps);

  return memoized;
}

/**
 * useStableCallback - Memoized callback with stable reference
 * Only updates when dependencies change
 */
export function useStableCallback<T extends (...args: any[]) => any>(
  callback: T,
  deps: DependencyList
): T {
  return useCallback(callback, deps) as T;
}

/**
 * usePrevious - Get the previous value of a prop/state
 * Useful for detecting changes
 */
export function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T>();

  useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref.current;
}

/**
 * useThrottledValue - Throttle updates to a value
 * Useful for search inputs, resize handlers etc
 */
export function useThrottledValue<T>(value: T, delay: number = 500): T {
  const [throttledValue, setThrottledValue] = useState(value);
  const lastUpdateRef = useRef(Date.now());

  useEffect(() => {
    const now = Date.now();
    if (now - lastUpdateRef.current >= delay) {
      lastUpdateRef.current = now;
      setThrottledValue(value);
    } else {
      const timeout = setTimeout(() => {
        lastUpdateRef.current = Date.now();
        setThrottledValue(value);
      }, delay - (now - lastUpdateRef.current));

      return () => clearTimeout(timeout);
    }
  }, [value, delay]);

  return throttledValue;
}

/**
 * useDebouncedValue - Debounce value updates
 * Useful for API calls, filtration etc
 */
export function useDebouncedValue<T>(value: T, delay: number = 500): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(timeout);
  }, [value, delay]);

  return debouncedValue;
}

/**
 * useDebouncedCallback - Debounced callback function
 */
export function useDebouncedCallback<T extends (...args: any[]) => any>(
  callback: T,
  delay: number = 500
): T {
  const timeoutRef = useRef<NodeJS.Timeout>();

  const debouncedCallback = useCallback(
    (...args: Parameters<T>) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        callback(...args);
      }, delay);
    },
    [callback, delay]
  );

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return debouncedCallback as T;
}

/**
 * useAsync - Handle async operations with memoization
 */
export function useAsync<T, E = Error>(
  asyncFunction: () => Promise<T>,
  deps?: DependencyList
) {
  const [status, setStatus] = useState<
    "idle" | "pending" | "success" | "error"
  >("idle");
  const [value, setValue] = useState<T | null>(null);
  const [error, setError] = useState<E | null>(null);

  useEffect(() => {
    let mounted = true;
    const execute = async () => {
      setStatus("pending");
      setValue(null);
      setError(null);

      try {
        const response = await asyncFunction();
        if (mounted) {
          setValue(response);
          setStatus("success");
        }
      } catch (error) {
        if (mounted) {
          setError(error as E);
          setStatus("error");
        }
      }
    };

    execute();

    return () => {
      mounted = false;
    };
  }, deps);

  return { status, value, error };
}

// Helper to check if dependencies have changed
function depsChanged(prevDeps: DependencyList, nextDeps: DependencyList): boolean {
  if (prevDeps === nextDeps) return false;
  if (!prevDeps || !nextDeps) return true;
  if (prevDeps.length !== nextDeps.length) return true;

  for (let i = 0; i < prevDeps.length; i++) {
    if (!Object.is(prevDeps[i], nextDeps[i])) {
      return true;
    }
  }

  return false;
}
