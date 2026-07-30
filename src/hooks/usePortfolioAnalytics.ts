import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useSupabaseAuth } from './useSupabaseAuth';
import { useMemo } from 'react';

export interface PortfolioDataPoint {
  date: string;
  value: number;
  credits: number;
  co2Offset: number;
}

export interface ProjectAllocation {
  name: string;
  type: string;
  value: number;
  percentage: number;
  credits: number;
}

export interface PerformanceMetrics {
  totalValue: number;
  totalCredits: number;
  totalCO2Offset: number;
  avgPricePerCredit: number;
  portfolioGrowth: number;
  monthlyGrowth: number;
  yearlyGrowth: number;
  projectCount: number;
}

export function usePortfolioAnalytics() {
  const { user } = useSupabaseAuth();

  const { data: holdings = [], isLoading: holdingsLoading } = useQuery({
    queryKey: ['portfolio-holdings', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from('credit_holdings')
        .select(`
          *,
          carbon_projects (
            id,
            title,
            project_type,
            price_per_credit,
            co2_offset_per_credit
          )
        `)
        .eq('user_id', user.id)
        .order('purchased_at', { ascending: true });
      
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const { data: transactions = [], isLoading: transactionsLoading } = useQuery({
    queryKey: ['portfolio-transactions', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from('transactions')
        .select(`
          *,
          carbon_projects (
            id,
            title,
            project_type,
            price_per_credit
          )
        `)
        .eq('user_id', user.id)
        .eq('status', 'completed')
        .order('created_at', { ascending: true });
      
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const performanceData = useMemo((): PortfolioDataPoint[] => {
    if (!transactions.length) return [];

    const dataMap = new Map<string, { value: number; credits: number; co2: number }>();
    let runningValue = 0;
    let runningCredits = 0;
    let runningCO2 = 0;

    transactions.forEach((tx: any) => {
      const date = new Date(tx.created_at).toISOString().split('T')[0];
      runningValue += tx.total_amount;
      runningCredits += tx.quantity;
      runningCO2 += tx.quantity * (tx.carbon_projects?.co2_offset_per_credit || 1);
      
      dataMap.set(date, {
        value: runningValue,
        credits: runningCredits,
        co2: runningCO2,
      });
    });

    return Array.from(dataMap.entries()).map(([date, data]) => ({
      date,
      value: data.value,
      credits: data.credits,
      co2Offset: data.co2,
    }));
  }, [transactions]);

  const projectAllocations = useMemo((): ProjectAllocation[] => {
    if (!holdings.length) return [];

    const allocMap = new Map<string, { name: string; type: string; value: number; credits: number }>();
    
    holdings.forEach((h: any) => {
      const projectId = h.carbon_projects?.id || 'unknown';
      const current = allocMap.get(projectId) || {
        name: h.carbon_projects?.title || 'Unknown',
        type: h.carbon_projects?.project_type || 'other',
        value: 0,
        credits: 0,
      };
      
      current.value += h.quantity * h.purchase_price;
      current.credits += h.quantity;
      allocMap.set(projectId, current);
    });

    const totalValue = Array.from(allocMap.values()).reduce((sum, p) => sum + p.value, 0);

    return Array.from(allocMap.values()).map((project) => ({
      ...project,
      percentage: totalValue > 0 ? (project.value / totalValue) * 100 : 0,
    }));
  }, [holdings]);

  const typeAllocations = useMemo(() => {
    if (!projectAllocations.length) return [];

    const typeMap = new Map<string, { value: number; credits: number }>();
    
    projectAllocations.forEach((p) => {
      const current = typeMap.get(p.type) || { value: 0, credits: 0 };
      current.value += p.value;
      current.credits += p.credits;
      typeMap.set(p.type, current);
    });

    const totalValue = Array.from(typeMap.values()).reduce((sum, t) => sum + t.value, 0);

    return Array.from(typeMap.entries()).map(([type, data]) => ({
      name: type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()),
      type,
      value: data.value,
      credits: data.credits,
      percentage: totalValue > 0 ? (data.value / totalValue) * 100 : 0,
    }));
  }, [projectAllocations]);

  const metrics = useMemo((): PerformanceMetrics => {
    const totalValue = holdings.reduce((sum: number, h: any) => 
      sum + h.quantity * h.purchase_price, 0);
    const totalCredits = holdings.reduce((sum: number, h: any) => 
      sum + h.quantity, 0);
    const totalCO2Offset = holdings.reduce((sum: number, h: any) => 
      sum + h.quantity * (h.carbon_projects?.co2_offset_per_credit || 1), 0);

    const avgPricePerCredit = totalCredits > 0 ? totalValue / totalCredits : 0;

    // Calculate growth (simplified - comparing to estimated market value)
    const currentMarketValue = holdings.reduce((sum: number, h: any) => 
      sum + h.quantity * (h.carbon_projects?.price_per_credit || h.purchase_price), 0);
    const portfolioGrowth = totalValue > 0 
      ? ((currentMarketValue - totalValue) / totalValue) * 100 
      : 0;

    // Calculate monthly and yearly growth from transactions
    const now = new Date();
    const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const oneYearAgo = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);

    const monthlyTransactions = transactions.filter((t: any) => 
      new Date(t.created_at) > oneMonthAgo);
    const yearlyTransactions = transactions.filter((t: any) => 
      new Date(t.created_at) > oneYearAgo);

    const monthlyValue = monthlyTransactions.reduce((sum: number, t: any) => 
      sum + t.total_amount, 0);
    const yearlyValue = yearlyTransactions.reduce((sum: number, t: any) => 
      sum + t.total_amount, 0);

    const projectIds = new Set(holdings.map((h: any) => h.carbon_projects?.id));

    return {
      totalValue,
      totalCredits,
      totalCO2Offset,
      avgPricePerCredit,
      portfolioGrowth,
      monthlyGrowth: monthlyValue,
      yearlyGrowth: yearlyValue,
      projectCount: projectIds.size,
    };
  }, [holdings, transactions]);

  return {
    performanceData,
    projectAllocations,
    typeAllocations,
    metrics,
    isLoading: holdingsLoading || transactionsLoading,
  };
}