import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface EmailRequest {
  type: "purchase_confirmation" | "certificate" | "milestone" | "newsletter_welcome" | "price_alert";
  to: string;
  data: {
    userName?: string;
    projectTitle?: string;
    quantity?: number;
    totalAmount?: number;
    transactionId?: string;
    certificateUrl?: string;
    purchaseDate?: string;
    milestoneName?: string;
    milestoneDescription?: string;
    impactAchieved?: string;
    currentPrice?: number;
    targetPrice?: number;
    alertDirection?: string;
    priceChange?: string;
  };
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { type, to, data }: EmailRequest = await req.json();
    console.log(`Sending ${type} email to ${to}`);

    let subject = "";
    let html = "";

    if (type === "purchase_confirmation") {
      subject = `Purchase Confirmation - ${data.quantity} Carbon Credits`;
      html = `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f5f5f5; margin: 0; padding: 20px; }
            .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1); }
            .header { background: linear-gradient(135deg, #10b981, #059669); padding: 40px 30px; text-align: center; }
            .header h1 { color: #ffffff; margin: 0; font-size: 28px; }
            .header p { color: rgba(255,255,255,0.9); margin: 10px 0 0; }
            .content { padding: 40px 30px; }
            .success-icon { text-align: center; margin-bottom: 30px; }
            .success-icon span { display: inline-block; width: 80px; height: 80px; background: #10b981; border-radius: 50%; line-height: 80px; font-size: 40px; }
            .details { background: #f8fafc; border-radius: 12px; padding: 24px; margin: 24px 0; }
            .detail-row { display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid #e2e8f0; }
            .detail-row:last-child { border-bottom: none; }
            .detail-label { color: #64748b; }
            .detail-value { color: #1e293b; font-weight: 600; }
            .total { font-size: 24px; color: #10b981; }
            .footer { padding: 30px; background: #f8fafc; text-align: center; }
            .footer p { color: #64748b; margin: 0; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🌱 Atlas Sanctum</h1>
              <p>Carbon Credit Marketplace</p>
            </div>
            <div class="content">
              <div class="success-icon">
                <span>✓</span>
              </div>
              <h2 style="text-align: center; color: #1e293b;">Purchase Confirmed!</h2>
              <p style="text-align: center; color: #64748b;">Thank you for your contribution to a sustainable future, ${data.userName || 'Valued Investor'}!</p>
              
              <div class="details">
                <div class="detail-row">
                  <span class="detail-label">Project</span>
                  <span class="detail-value">${data.projectTitle}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Credits Purchased</span>
                  <span class="detail-value">${data.quantity} credits</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Transaction ID</span>
                  <span class="detail-value">${data.transactionId?.slice(0, 8)}...</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Date</span>
                  <span class="detail-value">${data.purchaseDate}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Total Amount</span>
                  <span class="detail-value total">$${data.totalAmount?.toFixed(2)}</span>
                </div>
              </div>

              <p style="text-align: center; color: #64748b;">
                Your carbon credits have been added to your portfolio. 
                You'll receive your certificate shortly.
              </p>
            </div>
            <div class="footer">
              <p>© ${new Date().getFullYear()} Atlas Sanctum. Making a difference together.</p>
            </div>
          </div>
        </body>
        </html>
      `;
    } else if (type === "certificate") {
      subject = `Your Carbon Credit Certificate - ${data.projectTitle}`;
      html = `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f5f5f5; margin: 0; padding: 20px; }
            .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; }
            .header { background: linear-gradient(135deg, #10b981, #059669); padding: 40px 30px; text-align: center; }
            .header h1 { color: #ffffff; margin: 0; }
            .content { padding: 40px 30px; text-align: center; }
            .btn { display: inline-block; background: #10b981; color: #ffffff; padding: 16px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🌱 Atlas Sanctum</h1>
            </div>
            <div class="content">
              <h2>Your Certificate is Ready!</h2>
              <p>Your carbon credit certificate for ${data.quantity} credits from ${data.projectTitle} is ready for download.</p>
              <p style="margin: 30px 0;">
                <a href="${data.certificateUrl}" class="btn">Download Certificate</a>
              </p>
            </div>
          </div>
        </body>
        </html>
      `;
    } else if (type === "milestone") {
      subject = `🎉 Project Milestone Achieved - ${data.projectTitle}`;
      html = `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f5f5f5; margin: 0; padding: 20px; }
            .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1); }
            .header { background: linear-gradient(135deg, #f59e0b, #d97706); padding: 40px 30px; text-align: center; }
            .header h1 { color: #ffffff; margin: 0; font-size: 28px; }
            .content { padding: 40px 30px; }
            .milestone-badge { text-align: center; margin-bottom: 30px; }
            .milestone-badge span { display: inline-block; width: 100px; height: 100px; background: linear-gradient(135deg, #f59e0b, #d97706); border-radius: 50%; line-height: 100px; font-size: 50px; }
            .impact-box { background: #f8fafc; border-radius: 12px; padding: 24px; margin: 24px 0; text-align: center; }
            .impact-value { font-size: 32px; font-weight: 700; color: #10b981; }
            .footer { padding: 30px; background: #f8fafc; text-align: center; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🏆 Milestone Achieved!</h1>
            </div>
            <div class="content">
              <div class="milestone-badge">
                <span>🎯</span>
              </div>
              <h2 style="text-align: center; color: #1e293b;">${data.milestoneName}</h2>
              <p style="text-align: center; color: #64748b;">Great news, ${data.userName || 'Valued Investor'}! A project you've invested in has reached a major milestone.</p>
              
              <div class="impact-box">
                <p style="color: #64748b; margin: 0 0 10px;">Your Impact Contribution</p>
                <div class="impact-value">${data.impactAchieved}</div>
              </div>

              <p style="text-align: center; color: #64748b;">
                <strong>Project:</strong> ${data.projectTitle}<br>
                <strong>Milestone:</strong> ${data.milestoneDescription}
              </p>
            </div>
            <div class="footer">
              <p style="color: #64748b; margin: 0;">Keep making a difference with Atlas Sanctum!</p>
            </div>
          </div>
        </body>
        </html>
      `;
    } else if (type === "price_alert") {
      const direction = data.alertDirection === 'above' ? 'risen above' : 'dropped below';
      const emoji = data.alertDirection === 'above' ? '📈' : '📉';
      subject = `${emoji} Price Alert: ${data.projectTitle} has ${direction} your target`;
      html = `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f5f5f5; margin: 0; padding: 20px; }
            .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1); }
            .header { background: linear-gradient(135deg, #8b5cf6, #6366f1); padding: 40px 30px; text-align: center; }
            .header h1 { color: #ffffff; margin: 0; font-size: 28px; }
            .content { padding: 40px 30px; }
            .alert-icon { text-align: center; margin-bottom: 30px; }
            .alert-icon span { display: inline-block; width: 80px; height: 80px; background: ${data.alertDirection === 'above' ? '#10b981' : '#ef4444'}; border-radius: 50%; line-height: 80px; font-size: 40px; }
            .price-box { background: #f8fafc; border-radius: 12px; padding: 24px; margin: 24px 0; text-align: center; }
            .price-label { color: #64748b; font-size: 14px; margin-bottom: 8px; }
            .current-price { font-size: 48px; font-weight: 700; color: ${data.alertDirection === 'above' ? '#10b981' : '#ef4444'}; }
            .target-price { font-size: 18px; color: #64748b; margin-top: 8px; }
            .btn { display: inline-block; background: #8b5cf6; color: #ffffff; padding: 16px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; margin-top: 20px; }
            .footer { padding: 30px; background: #f8fafc; text-align: center; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🔔 Price Alert Triggered!</h1>
            </div>
            <div class="content">
              <div class="alert-icon">
                <span>${emoji}</span>
              </div>
              <h2 style="text-align: center; color: #1e293b;">Your Price Target Was Hit!</h2>
              <p style="text-align: center; color: #64748b;">
                Good news, ${data.userName || 'Valued Investor'}! The price for <strong>${data.projectTitle}</strong> has ${direction} your target.
              </p>
              
              <div class="price-box">
                <div class="price-label">Current Price</div>
                <div class="current-price">$${data.currentPrice?.toFixed(2)}</div>
                <div class="target-price">Your target: $${data.targetPrice?.toFixed(2)}</div>
              </div>

              <p style="text-align: center; color: #64748b;">
                ${data.alertDirection === 'below' 
                  ? 'This might be a great opportunity to add more credits to your portfolio!' 
                  : 'Your investment is performing well! Consider your next move.'}
              </p>

              <p style="text-align: center;">
                <a href="#" class="btn">View Project</a>
              </p>
            </div>
            <div class="footer">
              <p style="color: #64748b; margin: 0;">Stay ahead of the market with Atlas Sanctum alerts.</p>
              <p style="color: #94a3b8; font-size: 12px; margin: 15px 0 0;">You can manage your price alerts in your account settings.</p>
            </div>
          </div>
        </body>
        </html>
      `;
    }

    const emailResponse = await resend.emails.send({
      from: "Atlas Sanctum <onboarding@resend.dev>",
      to: [to],
      subject,
      html,
    });

    console.log("Email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ success: true, data: emailResponse }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error sending email:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }
};

serve(handler);
