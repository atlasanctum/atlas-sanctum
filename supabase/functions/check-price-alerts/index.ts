import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

interface PriceAlert {
  id: string;
  user_id: string;
  project_id: string;
  target_price: number;
  direction: string;
  active: boolean;
  triggered: boolean;
}

interface CarbonProject {
  id: string;
  title: string;
  price_per_credit: number;
}

interface UserProfile {
  user_id: string;
  full_name: string | null;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    console.log("Checking price alerts...");

    // Get all active price alerts
    const { data: alerts, error: alertsError } = await supabase
      .from("price_alerts")
      .select("*")
      .eq("active", true)
      .eq("triggered", false);

    if (alertsError) {
      throw new Error(`Failed to fetch alerts: ${alertsError.message}`);
    }

    if (!alerts || alerts.length === 0) {
      console.log("No active alerts to check");
      return new Response(
        JSON.stringify({ message: "No active alerts", checked: 0, triggered: 0 }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`Found ${alerts.length} active alerts to check`);

    // Get unique project IDs
    const projectIds = [...new Set(alerts.map((a: PriceAlert) => a.project_id))];

    // Fetch current prices for all projects
    const { data: projects, error: projectsError } = await supabase
      .from("carbon_projects")
      .select("id, title, price_per_credit")
      .in("id", projectIds);

    if (projectsError) {
      throw new Error(`Failed to fetch projects: ${projectsError.message}`);
    }

    const projectMap = new Map(
      (projects as CarbonProject[]).map((p) => [p.id, p])
    );

    // Get unique user IDs for triggered alerts
    const triggeredAlerts: { alert: PriceAlert; project: CarbonProject }[] = [];

    for (const alert of alerts as PriceAlert[]) {
      const project = projectMap.get(alert.project_id);
      if (!project) continue;

      const currentPrice = project.price_per_credit;
      const targetPrice = alert.target_price;
      const direction = alert.direction;

      let isTriggered = false;

      if (direction === "above" && currentPrice >= targetPrice) {
        isTriggered = true;
      } else if (direction === "below" && currentPrice <= targetPrice) {
        isTriggered = true;
      }

      if (isTriggered) {
        triggeredAlerts.push({ alert, project });
      }
    }

    console.log(`${triggeredAlerts.length} alerts triggered`);

    // Process triggered alerts
    for (const { alert, project } of triggeredAlerts) {
      // Mark alert as triggered
      const { error: updateError } = await supabase
        .from("price_alerts")
        .update({
          triggered: true,
          triggered_at: new Date().toISOString(),
          active: false,
        })
        .eq("id", alert.id);

      if (updateError) {
        console.error(`Failed to update alert ${alert.id}:`, updateError);
        continue;
      }

      // Get user profile and email
      const { data: authUser, error: authError } = await supabase.auth.admin.getUserById(
        alert.user_id
      );

      if (authError || !authUser?.user?.email) {
        console.error(`Failed to get user email for ${alert.user_id}:`, authError);
        continue;
      }

      // Get user profile for name
      const { data: profile } = await supabase
        .from("profiles")
        .select("full_name")
        .eq("user_id", alert.user_id)
        .single();

      // Send email notification
      const emailPayload = {
        type: "price_alert",
        to: authUser.user.email,
        data: {
          userName: (profile as UserProfile | null)?.full_name || "Investor",
          projectTitle: project.title,
          currentPrice: project.price_per_credit,
          targetPrice: alert.target_price,
          alertDirection: alert.direction,
        },
      };

      // Call the send-email function
      const { error: emailError } = await supabase.functions.invoke("send-email", {
        body: emailPayload,
      });

      if (emailError) {
        console.error(`Failed to send email for alert ${alert.id}:`, emailError);
      } else {
        console.log(`Email sent for alert ${alert.id} to ${authUser.user.email}`);
      }
    }

    return new Response(
      JSON.stringify({
        message: "Price alerts checked",
        checked: alerts.length,
        triggered: triggeredAlerts.length,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error checking price alerts:", error);
    return new Response(
      JSON.stringify({ error: (error as Error).message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
};

serve(handler);
