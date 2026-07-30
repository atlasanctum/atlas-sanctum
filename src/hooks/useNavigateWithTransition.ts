// @ts-nocheck
import { useNavigate, useLocation } from 'react-router-dom';
import { useCallback } from 'react';

/**
 * Drop-in replacement for useNavigate that:
 *  - Scrolls to top on every navigation (eliminates mid-page jumps)
 *  - Accepts the same API as react-router's NavigateOptions
 */
export function useNavigateWithTransition() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const go = useCallback(
    (to: string, options?: Parameters<ReturnType<typeof useNavigate>>[1]) => {
      // Don't scroll or re-navigate to the same route
      if (to === pathname) return;
      window.scrollTo({ top: 0, behavior: 'instant' });
      navigate(to, options);
    },
    [navigate, pathname]
  );

  return go;
}

export default useNavigateWithTransition;
