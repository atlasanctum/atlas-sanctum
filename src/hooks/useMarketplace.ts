import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { CarbonProject, CreditHolding, Transaction, ProjectType } from '@/types/marketplace';
import { useSupabaseAuth } from './useSupabaseAuth';
import { toast } from 'sonner';

export function useProjects(filters?: { type?: ProjectType; search?: string }) {
  return useQuery({
    queryKey: ['carbon-projects', filters],
    queryFn: async () => {
      let query = supabase
        .from('carbon_projects')
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (filters?.type) {
        query = query.eq('project_type', filters.type);
      }

      if (filters?.search) {
        query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%,country.ilike.%${filters.search}%`);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as CarbonProject[];
    },
  });
}

export function useProject(projectId: string | undefined) {
  return useQuery({
    queryKey: ['carbon-project', projectId],
    queryFn: async () => {
      if (!projectId) return null;
      const { data, error } = await supabase
        .from('carbon_projects')
        .select('*')
        .eq('id', projectId)
        .maybeSingle();
      if (error) throw error;
      return data as CarbonProject | null;
    },
    enabled: !!projectId,
  });
}

export function useUserHoldings() {
  const { user } = useSupabaseAuth();
  
  return useQuery({
    queryKey: ['credit-holdings', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from('credit_holdings')
        .select('*, carbon_projects(*)')
        .eq('user_id', user.id)
        .order('purchased_at', { ascending: false });
      if (error) throw error;
      return data as CreditHolding[];
    },
    enabled: !!user,
  });
}

export function useUserTransactions() {
  const { user } = useSupabaseAuth();
  
  return useQuery({
    queryKey: ['transactions', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from('transactions')
        .select('*, carbon_projects(*)')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data as Transaction[];
    },
    enabled: !!user,
  });
}

export function usePurchaseCredits() {
  const { user } = useSupabaseAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ projectId, quantity, pricePerCredit }: { projectId: string; quantity: number; pricePerCredit: number }) => {
      if (!user) throw new Error('Must be logged in to purchase credits');

      // Payment must be verified server-side before credits are issued.
      // This mutation should only be called after a successful payment webhook
      // has been processed by the backend (Paystack/PayPal verify endpoint).
      // Direct Supabase inserts here are intentionally removed to prevent
      // free credit acquisition.
      throw new Error(
        'Direct purchase is not supported. Use the payment flow at /payment to purchase credits.'
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['carbon-projects'] });
      queryClient.invalidateQueries({ queryKey: ['credit-holdings'] });
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      toast.success('Purchase completed successfully!');
    },
    onError: (error) => {
      toast.error(`Purchase failed: ${error.message}`);
    },
  });
}

export function useRetireCredits() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (holdingId: string) => {
      const { error } = await supabase
        .from('credit_holdings')
        .update({
          retired: true,
          retired_at: new Date().toISOString(),
          certificate_id: `CERT-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
        })
        .eq('id', holdingId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['credit-holdings'] });
      toast.success('Credits retired successfully! Certificate generated.');
    },
    onError: (error) => {
      toast.error(`Failed to retire credits: ${error.message}`);
    },
  });
}
