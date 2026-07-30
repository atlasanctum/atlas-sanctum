/**
 * Enhanced Authentication Hook
 * 
 * Convenience hook for accessing the enhanced authentication context
 */

import { useEnhancedAuth as useEnhancedAuthContext } from '@/contexts/EnhancedAuthContext';
import type { EnhancedAuthContextType } from '@/types/auth';

/**
 * Hook to access enhanced authentication functionality
 * 
 * @example
 * ```tsx
 * const { user, signIn, demoSignIn, isDemoMode } = useEnhancedAuth();
 * ```
 */
export const useEnhancedAuth = (): EnhancedAuthContextType => {
  return useEnhancedAuthContext();
};

export default useEnhancedAuth;
