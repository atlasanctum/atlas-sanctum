import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export interface Subscription {
  id: string;
  user_id: string;
  plan_id: string;
  plan_name: string;
  status: string;
  billing_period: string;
  amount: number;
  currency: string;
  current_period_start: string;
  current_period_end: string;
  canceled_at: string | null;
  payment_method: string | null;
  payment_reference: string | null;
  metadata: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
}

export interface Invoice {
  id: string;
  user_id: string;
  subscription_id: string | null;
  transaction_id: string | null;
  invoice_number: string;
  amount: number;
  currency: string;
  status: string;
  billing_name: string | null;
  billing_email: string | null;
  billing_address: string | null;
  items: unknown[];
  payment_method: string | null;
  payment_reference: string | null;
  issued_at: string;
  paid_at: string | null;
  pdf_url: string | null;
  created_at: string;
}

export function useSubscription() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: activeSubscription, isLoading: isLoadingSubscription } = useQuery({
    queryKey: ['subscription', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      const { data, error } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'active')
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();
      if (error) throw error;
      return data as Subscription | null;
    },
    enabled: !!user?.id,
  });

  const { data: invoices, isLoading: isLoadingInvoices } = useQuery({
    queryKey: ['invoices', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      const { data, error } = await supabase
        .from('invoices')
        .select('*')
        .eq('user_id', user.id)
        .order('issued_at', { ascending: false });
      if (error) throw error;
      return (data || []) as Invoice[];
    },
    enabled: !!user?.id,
  });

  const createSubscription = useMutation({
    mutationFn: async (params: {
      planId: string;
      planName: string;
      billingPeriod: 'monthly' | 'yearly';
      amount: number;
      paymentMethod: string;
      paymentReference: string;
    }) => {
      if (!user?.id) throw new Error('Not authenticated');

      const periodEnd = new Date();
      if (params.billingPeriod === 'monthly') {
        periodEnd.setMonth(periodEnd.getMonth() + 1);
      } else {
        periodEnd.setFullYear(periodEnd.getFullYear() + 1);
      }

      const { data, error } = await supabase
        .from('subscriptions')
        .insert({
          user_id: user.id,
          plan_id: params.planId,
          plan_name: params.planName,
          status: 'active',
          billing_period: params.billingPeriod,
          amount: params.amount,
          currency: 'USD',
          current_period_start: new Date().toISOString(),
          current_period_end: periodEnd.toISOString(),
          payment_method: params.paymentMethod,
          payment_reference: params.paymentReference,
        })
        .select()
        .single();

      if (error) throw error;
      return data as Subscription;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscription'] });
    },
  });

  const createInvoice = useMutation({
    mutationFn: async (params: {
      subscriptionId?: string;
      transactionId?: string;
      amount: number;
      billingName: string;
      billingEmail: string;
      billingAddress: string;
      items: { description: string; quantity: number; unitPrice: number; total: number }[];
      paymentMethod: string;
      paymentReference: string;
    }) => {
      if (!user?.id) throw new Error('Not authenticated');

      const invoiceNumber = `INV-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;

      const { data, error } = await supabase
        .from('invoices')
        .insert([{
          user_id: user.id,
          subscription_id: params.subscriptionId || null,
          transaction_id: params.transactionId || null,
          invoice_number: invoiceNumber,
          amount: params.amount,
          currency: 'USD',
          status: 'paid',
          billing_name: params.billingName,
          billing_email: params.billingEmail,
          billing_address: params.billingAddress,
          items: params.items as any,
          payment_method: params.paymentMethod,
          payment_reference: params.paymentReference,
          paid_at: new Date().toISOString(),
        }])
        .select()
        .single();

      if (error) throw error;
      return data as Invoice;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
    },
  });

  const cancelSubscription = useMutation({
    mutationFn: async (subscriptionId: string) => {
      const { error } = await supabase
        .from('subscriptions')
        .update({
          status: 'canceled',
          canceled_at: new Date().toISOString(),
        })
        .eq('id', subscriptionId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscription'] });
    },
  });

  return {
    activeSubscription,
    invoices,
    isLoadingSubscription,
    isLoadingInvoices,
    createSubscription,
    createInvoice,
    cancelSubscription,
  };
}
