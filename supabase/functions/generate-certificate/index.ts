import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface CertificateRequest {
  holdingId: string;
}

const generateCertificateId = () => {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `AS-${timestamp}-${random}`;
};

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { holdingId }: CertificateRequest = await req.json();
    console.log("Generating certificate for holding:", holdingId);

    // Get holding details with project info
    const { data: holding, error: holdingError } = await supabase
      .from("credit_holdings")
      .select(`
        *,
        carbon_projects (
          title,
          project_type,
          location,
          country,
          certification,
          co2_offset_per_credit,
          vintage_year
        )
      `)
      .eq("id", holdingId)
      .single();

    if (holdingError || !holding) {
      throw new Error("Holding not found");
    }

    // Get user profile
    const { data: profile } = await supabase
      .from("profiles")
      .select("full_name, organization")
      .eq("user_id", holding.user_id)
      .maybeSingle();

    // Generate certificate ID if not exists
    let certificateId = holding.certificate_id;
    if (!certificateId) {
      certificateId = generateCertificateId();
      await supabase
        .from("credit_holdings")
        .update({ certificate_id: certificateId })
        .eq("id", holdingId);
    }

    const project = holding.carbon_projects;
    const totalCO2 = holding.quantity * (project.co2_offset_per_credit || 1);

    // Generate HTML certificate
    const certificateHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <style>
          @page { size: A4 landscape; margin: 0; }
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { 
            font-family: 'Georgia', serif; 
            background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
          }
          .certificate {
            width: 1000px;
            background: #ffffff;
            border: 3px solid #10b981;
            border-radius: 16px;
            padding: 50px;
            position: relative;
            box-shadow: 0 25px 50px -12px rgba(0,0,0,0.25);
          }
          .border-pattern {
            position: absolute;
            top: 15px;
            left: 15px;
            right: 15px;
            bottom: 15px;
            border: 2px solid #d1fae5;
            border-radius: 12px;
            pointer-events: none;
          }
          .header {
            text-align: center;
            margin-bottom: 40px;
          }
          .logo {
            font-size: 28px;
            color: #10b981;
            margin-bottom: 10px;
          }
          .title {
            font-size: 42px;
            color: #064e3b;
            letter-spacing: 4px;
            text-transform: uppercase;
            margin-bottom: 5px;
          }
          .subtitle {
            font-size: 18px;
            color: #6b7280;
            font-style: italic;
          }
          .content {
            text-align: center;
            margin: 40px 0;
          }
          .certify-text {
            font-size: 16px;
            color: #6b7280;
            margin-bottom: 20px;
          }
          .recipient {
            font-size: 36px;
            color: #1f2937;
            border-bottom: 2px solid #10b981;
            display: inline-block;
            padding: 10px 40px;
            margin-bottom: 30px;
          }
          .credits-box {
            background: linear-gradient(135deg, #10b981, #059669);
            color: white;
            padding: 30px 50px;
            border-radius: 12px;
            display: inline-block;
            margin: 20px 0;
          }
          .credits-number {
            font-size: 48px;
            font-weight: bold;
          }
          .credits-label {
            font-size: 14px;
            text-transform: uppercase;
            letter-spacing: 2px;
          }
          .impact {
            font-size: 20px;
            color: #059669;
            margin: 20px 0;
          }
          .details {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 20px;
            margin: 40px 0;
            padding: 30px;
            background: #f8fafc;
            border-radius: 12px;
          }
          .detail-item {
            text-align: center;
          }
          .detail-label {
            font-size: 12px;
            color: #6b7280;
            text-transform: uppercase;
            letter-spacing: 1px;
          }
          .detail-value {
            font-size: 16px;
            color: #1f2937;
            font-weight: 600;
            margin-top: 5px;
          }
          .footer {
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
            margin-top: 40px;
            padding-top: 30px;
            border-top: 1px solid #e5e7eb;
          }
          .cert-id {
            font-family: monospace;
            font-size: 12px;
            color: #9ca3af;
          }
          .signature {
            text-align: center;
          }
          .signature-line {
            width: 200px;
            border-top: 1px solid #1f2937;
            margin-bottom: 10px;
          }
          .signature-name {
            font-size: 14px;
            color: #1f2937;
          }
          .signature-title {
            font-size: 12px;
            color: #6b7280;
          }
          .verified-badge {
            display: flex;
            align-items: center;
            gap: 10px;
            background: #d1fae5;
            padding: 10px 20px;
            border-radius: 8px;
          }
          .verified-badge span {
            color: #059669;
            font-weight: 600;
          }
        </style>
      </head>
      <body>
        <div class="certificate">
          <div class="border-pattern"></div>
          
          <div class="header">
            <div class="logo">🌱 Atlas Sanctum</div>
            <h1 class="title">Certificate</h1>
            <p class="subtitle">of Carbon Credit Ownership</p>
          </div>
          
          <div class="content">
            <p class="certify-text">This is to certify that</p>
            <div class="recipient">${profile?.full_name || "Certificate Holder"}</div>
            
            <p class="certify-text">is the verified owner of</p>
            
            <div class="credits-box">
              <div class="credits-number">${holding.quantity}</div>
              <div class="credits-label">Carbon Credits</div>
            </div>
            
            <p class="impact">
              Equivalent to <strong>${totalCO2.toLocaleString()} tonnes</strong> of CO₂ offset
            </p>
          </div>
          
          <div class="details">
            <div class="detail-item">
              <div class="detail-label">Project</div>
              <div class="detail-value">${project.title}</div>
            </div>
            <div class="detail-item">
              <div class="detail-label">Location</div>
              <div class="detail-value">${project.location}, ${project.country}</div>
            </div>
            <div class="detail-item">
              <div class="detail-label">Vintage Year</div>
              <div class="detail-value">${project.vintage_year}</div>
            </div>
            <div class="detail-item">
              <div class="detail-label">Certification</div>
              <div class="detail-value">${project.certification}</div>
            </div>
            <div class="detail-item">
              <div class="detail-label">Purchase Date</div>
              <div class="detail-value">${new Date(holding.purchased_at).toLocaleDateString()}</div>
            </div>
            <div class="detail-item">
              <div class="detail-label">Status</div>
              <div class="detail-value">${holding.retired ? "Retired" : "Active"}</div>
            </div>
          </div>
          
          <div class="footer">
            <div class="cert-id">
              Certificate ID: ${certificateId}<br>
              Generated: ${new Date().toISOString()}
            </div>
            
            <div class="signature">
              <div class="signature-line"></div>
              <div class="signature-name">Atlas Sanctum</div>
              <div class="signature-title">Carbon Credit Registry</div>
            </div>
            
            <div class="verified-badge">
              <span>✓ Verified</span>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;

    return new Response(certificateHtml, {
      status: 200,
      headers: { 
        "Content-Type": "text/html",
        ...corsHeaders 
      },
    });
  } catch (error: any) {
    console.error("Error generating certificate:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }
};

serve(handler);
