import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";
import type { CarbonProject, Transaction } from "@/types/marketplace";

export const useIsAdmin = () => {
  const { user } = useSupabaseAuth();
  
  return useQuery({
    queryKey: ['isAdmin', user?.id],
    queryFn: async () => {
      if (!user) return false;
      
      const { data, error } = await supabase
        .rpc('has_role', { _user_id: user.id, _role: 'admin' });
      
      if (error) {
        console.error('Error checking admin status:', error);
        return false;
      }
      
      return data;
    },
    enabled: !!user,
  });
};

export const useAllProjects = () => {
  return useQuery({
    queryKey: ['adminProjects'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('carbon_projects')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as CarbonProject[];
    },
  });
};

export const useAllTransactions = () => {
  return useQuery({
    queryKey: ['adminTransactions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('transactions')
        .select(`
          *,
          carbon_projects (title, project_type)
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as (Transaction & { carbon_projects: { title: string; project_type: string } })[];
    },
  });
};

export const useSalesStats = () => {
  return useQuery({
    queryKey: ['adminSalesStats'],
    queryFn: async () => {
      const { data: transactions, error } = await supabase
        .from('transactions')
        .select('total_amount, quantity, status, created_at')
        .eq('status', 'completed');
      
      if (error) throw error;
      
      const totalRevenue = transactions?.reduce((sum, t) => sum + Number(t.total_amount), 0) || 0;
      const totalCredits = transactions?.reduce((sum, t) => sum + t.quantity, 0) || 0;
      const completedTransactions = transactions?.length || 0;
      
      // Calculate monthly revenue
      const now = new Date();
      const thisMonth = transactions?.filter(t => {
        const date = new Date(t.created_at);
        return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
      }) || [];
      const monthlyRevenue = thisMonth.reduce((sum, t) => sum + Number(t.total_amount), 0);
      
      return {
        totalRevenue,
        totalCredits,
        completedTransactions,
        monthlyRevenue,
      };
    },
  });
};
