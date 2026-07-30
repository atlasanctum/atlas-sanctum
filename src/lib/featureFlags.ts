import { useEffect, useState } from 'react';

export type Flags = Record<string, boolean>;

declare global {
  interface Window { __FEATURE_FLAGS__?: Flags }
}

let flags: Flags = (typeof window !== 'undefined' && window.__FEATURE_FLAGS__) || {};

export function initFeatureFlags(initial: Flags) {
  flags = { ...initial };
  if (typeof window !== 'undefined') {
    window.__FEATURE_FLAGS__ = flags;
    window.dispatchEvent(new CustomEvent('featureFlagsUpdated'));
  }
}

export function getFeatureFlags(): Flags {
  return { ...flags };
}

export function isFeatureEnabled(key: string): boolean {
  return !!flags[key];
}

export function useFeatureFlag(key: string): boolean {
  const [value, setValue] = useState<boolean>(isFeatureEnabled(key));

  useEffect(() => {
    const handler = () => setValue(isFeatureEnabled(key));
    window.addEventListener('featureFlagsUpdated', handler);
    return () => window.removeEventListener('featureFlagsUpdated', handler);
  }, [key]);

  return value;
}

export default { initFeatureFlags, getFeatureFlags, isFeatureEnabled, useFeatureFlag };
