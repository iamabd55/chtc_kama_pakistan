/**
 * Optimization utilities for memoization and performance enhancement
 */

/**
 * Creates a memoized selector for expensive computations
 * Prevents unnecessary recalculations when dependencies don't change
 */
export function createMemoizedSelector<T, R>(
  selector: (data: T) => R,
  isEqual: (a: R, b: R) => boolean = (a, b) => a === b
) {
  let lastInput: T | undefined;
  let lastOutput: R | undefined;
  let hasOutput = false;

  return (input: T): R => {
    if (lastInput === undefined || lastInput !== input) {
      lastInput = input;
      const newOutput = selector(input);
      if (!hasOutput || !isEqual(newOutput, lastOutput as R)) {
        lastOutput = newOutput;
        hasOutput = true;
      }
    }
    return lastOutput as R;
  };
}

/**
 * Debounce function to limit function calls
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout | null = null;

  return (...args: Parameters<T>) => {
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
}

/**
 * Throttle function to limit frequency of function calls
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;

  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

/**
 * LRU Cache implementation for expensive computations
 */
export class LRUCache<K, V> {
  private cache: Map<K, V>;
  private maxSize: number;

  constructor(maxSize: number = 50) {
    this.cache = new Map();
    this.maxSize = maxSize;
  }

  get(key: K): V | undefined {
    if (!this.cache.has(key)) return undefined;
    // Move to end (most recently used)
    const value = this.cache.get(key)!;
    this.cache.delete(key);
    this.cache.set(key, value);
    return value;
  }

  set(key: K, value: V): void {
    if (this.cache.has(key)) {
      this.cache.delete(key);
    } else if (this.cache.size >= this.maxSize) {
      // Remove least recently used (first item)
      const firstEntry = this.cache.keys().next();
      if (!firstEntry.done) {
        this.cache.delete(firstEntry.value);
      }
    }
    this.cache.set(key, value);
  }

  clear(): void {
    this.cache.clear();
  }

  has(key: K): boolean {
    return this.cache.has(key);
  }
}

/**
 * Memoized async function with caching
 */
export function createAsyncMemoized<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  keyGenerator: (...args: Parameters<T>) => string,
  ttl: number = 5 * 60 * 1000 // 5 minutes default
) {
  const cache = new Map<
    string,
    { result: Awaited<ReturnType<T>>; timestamp: number }
  >();

  return async (...args: Parameters<T>): Promise<Awaited<ReturnType<T>>> => {
    const key = keyGenerator(...args);
    const cached = cache.get(key);

    if (cached && Date.now() - cached.timestamp < ttl) {
      return cached.result;
    }

    const result = await fn(...args);
    cache.set(key, { result, timestamp: Date.now() });
    return result;
  };
}

/**
 * Deep equality check for objects and arrays
 */
export function deepEqual(obj1: any, obj2: any): boolean {
  if (obj1 === obj2) return true;
  if (obj1 == null || obj2 == null) return false;
  if (typeof obj1 !== "object" || typeof obj2 !== "object") return false;

  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);

  if (keys1.length !== keys2.length) return false;

  for (const key of keys1) {
    if (!keys2.includes(key)) return false;
    if (!deepEqual(obj1[key], obj2[key])) return false;
  }

  return true;
}

/**
 * Shallow equality check for props
 */
export function shallowEqual(obj1: any, obj2: any): boolean {
  if (obj1 === obj2) return true;
  if (obj1 == null || obj2 == null) return false;
  if (typeof obj1 !== "object" || typeof obj2 !== "object") return false;

  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);

  if (keys1.length !== keys2.length) return false;

  for (const key of keys1) {
    if (obj1[key] !== obj2[key]) return false;
  }

  return true;
}
