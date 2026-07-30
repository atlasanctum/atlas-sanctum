import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

export interface UserTransaction {
  id: string;
  quantity: number;
  price_per_credit: number;
  total_amount: number;
  status: "pending" | "completed" | "failed" | "refunded";
  payment_method: string | null;
  transaction_type: string;
  created_at: string;
  completed_at: string | null;
  project: {
    id: string;
    title: string;
    project_type: string;
    location: string;
    country: string;
  };
}

export interface CreditHolding {
  id: string;
  quantity: number;
  purchase_price: number;
  purchased_at: string;
  retired: boolean;
  retired_at: string | null;
  certificate_id: string | null;
  project: {
    id: string;
    title: string;
    project_type: string;
    location: string;
    country: string;
    co2_offset_per_credit: number;
  };
}

export const useUserTransactions = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["user-transactions", user?.id],
    queryFn: async (): Promise<UserTransaction[]> => {
      if (!user) return [];

      const { data, error } = await supabase
        .from("transactions")
        .select(`
          id,
          quantity,
          price_per_credit,
          total_amount,
          status,
          payment_method,
          transaction_type,
          created_at,
          completed_at,
          carbon_projects (
            id,
            title,
            project_type,
            location,
            country
          )
        `)
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;

      return (data || []).map((t: any) => ({
        ...t,
        project: t.carbon_projects,
      }));
    },
    enabled: !!user,
  });
};

export const useUserHoldings = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["user-holdings", user?.id],
    queryFn: async (): Promise<CreditHolding[]> => {
      if (!user) return [];

      const { data, error } = await supabase
        .from("credit_holdings")
        .select(`
          id,
          quantity,
          purchase_price,
          purchased_at,
          retired,
          retired_at,
          certificate_id,
          carbon_projects (
            id,
            title,
            project_type,
            location,
            country,
            co2_offset_per_credit
          )
        `)
        .eq("user_id", user.id)
        .order("purchased_at", { ascending: false });

      if (error) throw error;

      return (data || []).map((h: any) => ({
        ...h,
        project: h.carbon_projects,
      }));
    },
    enabled: !!user,
  });
};

export const usePortfolioStats = () => {
  const { data: holdings } = useUserHoldings();

  const totalCredits = holdings?.reduce((sum, h) => sum + h.quantity, 0) || 0;
  const totalValue = holdings?.reduce((sum, h) => sum + h.quantity * h.purchase_price, 0) || 0;
  const totalCO2 = holdings?.reduce((sum, h) => sum + h.quantity * (h.project?.co2_offset_per_credit || 1), 0) || 0;
  const activeHoldings = holdings?.filter((h) => !h.retired).length || 0;

  return {
    totalCredits,
    totalValue,
    totalCO2,
    activeHoldings,
  };
};
