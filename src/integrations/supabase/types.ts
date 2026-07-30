export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      bioregional_zones: {
        Row: {
          active_projects: number | null
          biodiversity_index: number | null
          carbon_sequestration_rate: number | null
          climate_type: string | null
          code: string
          coordinates: Json | null
          country: string
          created_at: string
          description: string | null
          id: string
          name: string
          region: string
          risk_level: string | null
          total_area_hectares: number | null
          updated_at: string
        }
        Insert: {
          active_projects?: number | null
          biodiversity_index?: number | null
          carbon_sequestration_rate?: number | null
          climate_type?: string | null
          code: string
          coordinates?: Json | null
          country: string
          created_at?: string
          description?: string | null
          id?: string
          name: string
          region: string
          risk_level?: string | null
          total_area_hectares?: number | null
          updated_at?: string
        }
        Update: {
          active_projects?: number | null
          biodiversity_index?: number | null
          carbon_sequestration_rate?: number | null
          climate_type?: string | null
          code?: string
          coordinates?: Json | null
          country?: string
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          region?: string
          risk_level?: string | null
          total_area_hectares?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      carbon_projects: {
        Row: {
          available_credits: number
          certification: string
          co2_offset_per_credit: number
          country: string
          created_at: string
          description: string
          developer_name: string
          end_date: string | null
          id: string
          image_url: string | null
          location: string
          methodology: string | null
          price_per_credit: number
          project_type: Database["public"]["Enums"]["project_type"]
          start_date: string | null
          status: Database["public"]["Enums"]["project_status"]
          title: string
          total_credits: number
          updated_at: string
          vintage_year: number
        }
        Insert: {
          available_credits: number
          certification: string
          co2_offset_per_credit?: number
          country: string
          created_at?: string
          description: string
          developer_name: string
          end_date?: string | null
          id?: string
          image_url?: string | null
          location: string
          methodology?: string | null
          price_per_credit: number
          project_type: Database["public"]["Enums"]["project_type"]
          start_date?: string | null
          status?: Database["public"]["Enums"]["project_status"]
          title: string
          total_credits: number
          updated_at?: string
          vintage_year: number
        }
        Update: {
          available_credits?: number
          certification?: string
          co2_offset_per_credit?: number
          country?: string
          created_at?: string
          description?: string
          developer_name?: string
          end_date?: string | null
          id?: string
          image_url?: string | null
          location?: string
          methodology?: string | null
          price_per_credit?: number
          project_type?: Database["public"]["Enums"]["project_type"]
          start_date?: string | null
          status?: Database["public"]["Enums"]["project_status"]
          title?: string
          total_credits?: number
          updated_at?: string
          vintage_year?: number
        }
        Relationships: []
      }
      credit_holdings: {
        Row: {
          certificate_id: string | null
          id: string
          project_id: string
          purchase_price: number
          purchased_at: string
          quantity: number
          retired: boolean
          retired_at: string | null
          user_id: string
        }
        Insert: {
          certificate_id?: string | null
          id?: string
          project_id: string
          purchase_price: number
          purchased_at?: string
          quantity: number
          retired?: boolean
          retired_at?: string | null
          user_id: string
        }
        Update: {
          certificate_id?: string | null
          id?: string
          project_id?: string
          purchase_price?: number
          purchased_at?: string
          quantity?: number
          retired?: boolean
          retired_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "credit_holdings_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "carbon_projects"
            referencedColumns: ["id"]
          },
        ]
      }
      invoices: {
        Row: {
          amount: number
          billing_address: string | null
          billing_email: string | null
          billing_name: string | null
          created_at: string
          currency: string
          id: string
          invoice_number: string
          issued_at: string
          items: Json
          paid_at: string | null
          payment_method: string | null
          payment_reference: string | null
          pdf_url: string | null
          status: string
          subscription_id: string | null
          transaction_id: string | null
          user_id: string
        }
        Insert: {
          amount: number
          billing_address?: string | null
          billing_email?: string | null
          billing_name?: string | null
          created_at?: string
          currency?: string
          id?: string
          invoice_number: string
          issued_at?: string
          items?: Json
          paid_at?: string | null
          payment_method?: string | null
          payment_reference?: string | null
          pdf_url?: string | null
          status?: string
          subscription_id?: string | null
          transaction_id?: string | null
          user_id: string
        }
        Update: {
          amount?: number
          billing_address?: string | null
          billing_email?: string | null
          billing_name?: string | null
          created_at?: string
          currency?: string
          id?: string
          invoice_number?: string
          issued_at?: string
          items?: Json
          paid_at?: string | null
          payment_method?: string | null
          payment_reference?: string | null
          pdf_url?: string | null
          status?: string
          subscription_id?: string | null
          transaction_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "invoices_subscription_id_fkey"
            columns: ["subscription_id"]
            isOneToOne: false
            referencedRelation: "subscriptions"
            referencedColumns: ["id"]
          },
        ]
      }
      measurement_data: {
        Row: {
          confidence_level: number | null
          created_at: string
          id: string
          measured_at: string
          measurement_type: string
          metadata: Json | null
          project_id: string | null
          source: string | null
          unit: string
          value: number
          verified: boolean | null
          verified_at: string | null
          verified_by: string | null
          zone_id: string | null
        }
        Insert: {
          confidence_level?: number | null
          created_at?: string
          id?: string
          measured_at?: string
          measurement_type: string
          metadata?: Json | null
          project_id?: string | null
          source?: string | null
          unit: string
          value: number
          verified?: boolean | null
          verified_at?: string | null
          verified_by?: string | null
          zone_id?: string | null
        }
        Update: {
          confidence_level?: number | null
          created_at?: string
          id?: string
          measured_at?: string
          measurement_type?: string
          metadata?: Json | null
          project_id?: string | null
          source?: string | null
          unit?: string
          value?: number
          verified?: boolean | null
          verified_at?: string | null
          verified_by?: string | null
          zone_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "measurement_data_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "carbon_projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "measurement_data_zone_id_fkey"
            columns: ["zone_id"]
            isOneToOne: false
            referencedRelation: "bioregional_zones"
            referencedColumns: ["id"]
          },
        ]
      }
      newsletter_subscription_attempts: {
        Row: {
          created_at: string
          email: string | null
          id: string
          ip_address: string | null
          reason: string | null
          succeeded: boolean | null
        }
        Insert: {
          created_at?: string
          email?: string | null
          id?: string
          ip_address?: string | null
          reason?: string | null
          succeeded?: boolean | null
        }
        Update: {
          created_at?: string
          email?: string | null
          id?: string
          ip_address?: string | null
          reason?: string | null
          succeeded?: boolean | null
        }
        Relationships: []
      }
      newsletter_subscriptions: {
        Row: {
          email: string
          id: string
          subscribed: boolean | null
          subscribed_at: string
          subscription_type: string | null
          unsubscribed_at: string | null
          user_id: string | null
        }
        Insert: {
          email: string
          id?: string
          subscribed?: boolean | null
          subscribed_at?: string
          subscription_type?: string | null
          unsubscribed_at?: string | null
          user_id?: string | null
        }
        Update: {
          email?: string
          id?: string
          subscribed?: boolean | null
          subscribed_at?: string
          subscription_type?: string | null
          unsubscribed_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      price_alerts: {
        Row: {
          active: boolean | null
          created_at: string
          direction: string
          id: string
          project_id: string
          target_price: number
          triggered: boolean | null
          triggered_at: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          active?: boolean | null
          created_at?: string
          direction: string
          id?: string
          project_id: string
          target_price: number
          triggered?: boolean | null
          triggered_at?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          active?: boolean | null
          created_at?: string
          direction?: string
          id?: string
          project_id?: string
          target_price?: number
          triggered?: boolean | null
          triggered_at?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "price_alerts_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "carbon_projects"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          full_name: string | null
          id: string
          organization: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          organization?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          organization?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      regenerative_metrics: {
        Row: {
          baseline_value: number | null
          created_at: string
          current_value: number
          id: string
          improvement_percentage: number | null
          last_measured_at: string | null
          metric_category: string
          metric_name: string
          project_id: string | null
          target_value: number | null
          trend: string | null
          unit: string
          updated_at: string
          zone_id: string | null
        }
        Insert: {
          baseline_value?: number | null
          created_at?: string
          current_value: number
          id?: string
          improvement_percentage?: number | null
          last_measured_at?: string | null
          metric_category: string
          metric_name: string
          project_id?: string | null
          target_value?: number | null
          trend?: string | null
          unit: string
          updated_at?: string
          zone_id?: string | null
        }
        Update: {
          baseline_value?: number | null
          created_at?: string
          current_value?: number
          id?: string
          improvement_percentage?: number | null
          last_measured_at?: string | null
          metric_category?: string
          metric_name?: string
          project_id?: string | null
          target_value?: number | null
          trend?: string | null
          unit?: string
          updated_at?: string
          zone_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "regenerative_metrics_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "carbon_projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "regenerative_metrics_zone_id_fkey"
            columns: ["zone_id"]
            isOneToOne: false
            referencedRelation: "bioregional_zones"
            referencedColumns: ["id"]
          },
        ]
      }
      subscriptions: {
        Row: {
          amount: number
          billing_period: string
          canceled_at: string | null
          created_at: string
          currency: string
          current_period_end: string
          current_period_start: string
          id: string
          metadata: Json | null
          payment_method: string | null
          payment_reference: string | null
          plan_id: string
          plan_name: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          amount: number
          billing_period?: string
          canceled_at?: string | null
          created_at?: string
          currency?: string
          current_period_end: string
          current_period_start?: string
          id?: string
          metadata?: Json | null
          payment_method?: string | null
          payment_reference?: string | null
          plan_id: string
          plan_name: string
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          amount?: number
          billing_period?: string
          canceled_at?: string | null
          created_at?: string
          currency?: string
          current_period_end?: string
          current_period_start?: string
          id?: string
          metadata?: Json | null
          payment_method?: string | null
          payment_reference?: string | null
          plan_id?: string
          plan_name?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      transactions: {
        Row: {
          completed_at: string | null
          created_at: string
          id: string
          payment_method: string | null
          price_per_credit: number
          project_id: string
          quantity: number
          status: Database["public"]["Enums"]["transaction_status"]
          total_amount: number
          transaction_type: string
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          id?: string
          payment_method?: string | null
          price_per_credit: number
          project_id: string
          quantity: number
          status?: Database["public"]["Enums"]["transaction_status"]
          total_amount: number
          transaction_type?: string
          user_id: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          id?: string
          payment_method?: string | null
          price_per_credit?: number
          project_id?: string
          quantity?: number
          status?: Database["public"]["Enums"]["transaction_status"]
          total_amount?: number
          transaction_type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "transactions_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "carbon_projects"
            referencedColumns: ["id"]
          },
        ]
      }
      user_preferences: {
        Row: {
          created_at: string
          email_notifications: boolean | null
          id: string
          impact_updates: boolean | null
          investment_goals: string[] | null
          marketing_emails: boolean | null
          monthly_budget: string | null
          newsletter_subscribed: boolean | null
          organization_type: string | null
          project_interests: string[] | null
          transaction_alerts: boolean | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          email_notifications?: boolean | null
          id?: string
          impact_updates?: boolean | null
          investment_goals?: string[] | null
          marketing_emails?: boolean | null
          monthly_budget?: string | null
          newsletter_subscribed?: boolean | null
          organization_type?: string | null
          project_interests?: string[] | null
          transaction_alerts?: boolean | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          email_notifications?: boolean | null
          id?: string
          impact_updates?: boolean | null
          investment_goals?: string[] | null
          marketing_emails?: boolean | null
          monthly_budget?: string | null
          newsletter_subscribed?: boolean | null
          organization_type?: string | null
          project_interests?: string[] | null
          transaction_alerts?: boolean | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      user_tour_progress: {
        Row: {
          completed_at: string | null
          completed_steps: string[] | null
          id: string
          started_at: string
          tour_completed: boolean | null
          tour_skipped: boolean | null
          updated_at: string
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          completed_steps?: string[] | null
          id?: string
          started_at?: string
          tour_completed?: boolean | null
          tour_skipped?: boolean | null
          updated_at?: string
          user_id: string
        }
        Update: {
          completed_at?: string | null
          completed_steps?: string[] | null
          id?: string
          started_at?: string
          tour_completed?: boolean | null
          tour_skipped?: boolean | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      check_newsletter_rate_limit: {
        Args: { _email: string; _ip: string; _window_seconds?: number }
        Returns: boolean
      }
      claim_newsletter_slot: {
        Args: { _email: string; _ip: string; _window_seconds?: number }
        Returns: boolean
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "investor" | "partner" | "admin"
      project_status: "active" | "pending" | "completed" | "suspended"
      project_type:
        | "reforestation"
        | "renewable_energy"
        | "methane_capture"
        | "ocean_restoration"
        | "soil_carbon"
        | "direct_air_capture"
      transaction_status: "pending" | "completed" | "failed" | "refunded"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["investor", "partner", "admin"],
      project_status: ["active", "pending", "completed", "suspended"],
      project_type: [
        "reforestation",
        "renewable_energy",
        "methane_capture",
        "ocean_restoration",
        "soil_carbon",
        "direct_air_capture",
      ],
      transaction_status: ["pending", "completed", "failed", "refunded"],
    },
  },
} as const
