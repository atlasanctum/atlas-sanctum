import { render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';
import { beforeAll, describe, expect, it, vi } from 'vitest';
import IntelligenceArchitecture from '../IntelligenceArchitecture';
import { EnhancedAuthProvider } from '@/contexts/EnhancedAuthContext';
import { AuthProvider } from '@/hooks/useAuth';
import { SupabaseAuthProvider } from '@/hooks/useSupabaseAuth';

beforeAll(() => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
});

describe('IntelligenceArchitecture', () => {
  it('renders the five engine models and shared architecture overview', () => {
    const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });

    render(
      <MemoryRouter>
        <QueryClientProvider client={queryClient}>
          <EnhancedAuthProvider>
            <AuthProvider>
              <SupabaseAuthProvider>
                <IntelligenceArchitecture />
              </SupabaseAuthProvider>
            </AuthProvider>
          </EnhancedAuthProvider>
        </QueryClientProvider>
      </MemoryRouter>
    );

    expect(screen.getByText('Atlas Sanctum Intelligence Architecture')).toBeInTheDocument();
    expect(screen.getByText('Human Flourishing Engine')).toBeInTheDocument();
    expect(screen.getByText('Regenerative Economy Engine')).toBeInTheDocument();
    expect(screen.getByText('Innovation Genesis Engine')).toBeInTheDocument();
    expect(screen.getByText('Ethical Decision Engine')).toBeInTheDocument();
    expect(screen.getByText('Ecosystem Intelligence Engine')).toBeInTheDocument();
    expect(screen.getByText('Shared Architecture')).toBeInTheDocument();
  });
});
