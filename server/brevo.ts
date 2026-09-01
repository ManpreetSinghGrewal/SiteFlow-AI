interface SendEmailOptions {
  to: { email: string; name?: string }[];
  subject: string;
  htmlContent: string;
  textContent?: string;
}

export interface BrevoResult {
  success: boolean;
  error?: string;
}

export async function sendBrevoEmail(options: SendEmailOptions): Promise<BrevoResult> {
  const apiKey = process.env.BREVO_API_KEY;
  const resendApiKey = process.env.RESEND_API_KEY;
  const targetEmail = options.to[0]?.email || "";

  console.log(`[SITEFLOW OTP EMAIL DISPATCH] Target: ${targetEmail} | Subject: "${options.subject}"`);

  // 1. Try Brevo HTTPS REST API
  if (apiKey) {
    const senderEmail = process.env.BREVO_SENDER_EMAIL || "noreply@siteflowai.com";
    const senderName = process.env.BREVO_SENDER_NAME || "SiteFlow AI";

    try {
      const res = await fetch("https://api.brevo.com/v3/smtp/email", {
        method: "POST",
        headers: {
          "accept": "application/json",
          "api-key": apiKey,
          "content-type": "application/json",
        },
        body: JSON.stringify({
          sender: { name: senderName, email: senderEmail },
          to: options.to,
          subject: options.subject,
          htmlContent: options.htmlContent,
          textContent: options.textContent,
        }),
      });

      if (res.ok) {
        console.log(`[BREVO SUCCESS] Email successfully delivered to ${targetEmail}`);
        return { success: true };
      }

      const errorText = await res.text();
      let detail = `Brevo API error (${res.status})`;
      try {
        const parsed = JSON.parse(errorText);
        if (parsed.message) detail = `Brevo error: ${parsed.message}`;
      } catch {
        detail = `Brevo error: ${errorText}`;
      }
      console.warn(`[BREVO FAIL] ${detail}`);
    } catch (err) {
      console.error("[BREVO EXCEPTION]", err);
    }
  }

  // 2. Try Resend HTTPS REST API Fallback if configured
  if (resendApiKey) {
    try {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${resendApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: process.env.RESEND_SENDER_EMAIL || "SiteFlow AI <onboarding@resend.dev>",
          to: [targetEmail],
          subject: options.subject,
          html: options.htmlContent,
        }),
      });

      if (res.ok) {
        console.log(`[RESEND SUCCESS] Email successfully delivered to ${targetEmail}`);
        return { success: true };
      }
    } catch (err) {
      console.error("[RESEND EXCEPTION]", err);
    }
  }

  if (!apiKey && !resendApiKey) {
    const errorMsg = "Neither BREVO_API_KEY nor RESEND_API_KEY is configured in Vercel Environment Variables.";
    console.warn(errorMsg);
    return { success: false, error: errorMsg };
  }

  return {
    success: false,
    error: "Email delivery failed via Brevo/Resend. Please check BREVO_SENDER_EMAIL in Vercel environment settings or verify your Brevo sender email.",
  };
}

export function getWelcomeEmailHtml(displayName: string): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: 'Segoe UI', Arial, sans-serif; background-color: #0f172a; color: #f8fafc; margin: 0; padding: 40px 20px; }
        .container { max-width: 560px; margin: 0 auto; background: #1e293b; border-radius: 16px; border: 1px solid #334155; padding: 40px; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5); }
        .logo { font-size: 24px; font-weight: bold; color: #38bdf8; text-decoration: none; display: inline-block; margin-bottom: 24px; }
        h1 { font-size: 22px; color: #ffffff; margin-top: 0; }
        p { color: #94a3b8; font-size: 15px; line-height: 1.6; }
        .btn { display: inline-block; background: linear-gradient(135deg, #0284c7 0%, #2563eb 100%); color: #ffffff; text-decoration: none; padding: 12px 28px; border-radius: 9999px; font-weight: 600; margin-top: 20px; box-shadow: 0 4px 14px rgba(37, 99, 235, 0.4); }
        .footer { margin-top: 36px; padding-top: 20px; border-top: 1px solid #334155; font-size: 12px; color: #64748b; text-align: center; }
      </style>
    </head>
    <body>
      <div class="container">
        <a href="https://site-flow-ai-eight.vercel.app/" class="logo">✨ SiteFlow AI</a>
        <h1>Welcome to SiteFlow AI, ${displayName}! 🚀</h1>
        <p>We are thrilled to have you onboard. With SiteFlow AI, you can generate production-ready, beautifully designed single-page websites in under 30 seconds using artificial intelligence.</p>
        <p>Ready to build your first website?</p>
        <a href="https://site-flow-ai-eight.vercel.app/builder" class="btn">Launch AI Builder →</a>
        <div class="footer">
          &copy; ${new Date().getFullYear()} SiteFlow AI. All rights reserved.
        </div>
      </div>
    </body>
    </html>
  `;
}

export function getResetPasswordEmailHtml(resetUrl: string): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: 'Segoe UI', Arial, sans-serif; background-color: #0f172a; color: #f8fafc; margin: 0; padding: 40px 20px; }
        .container { max-width: 560px; margin: 0 auto; background: #1e293b; border-radius: 16px; border: 1px solid #334155; padding: 40px; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5); }
        .logo { font-size: 24px; font-weight: bold; color: #38bdf8; text-decoration: none; display: inline-block; margin-bottom: 24px; }
        h1 { font-size: 22px; color: #ffffff; margin-top: 0; }
        p { color: #94a3b8; font-size: 15px; line-height: 1.6; }
        .btn { display: inline-block; background: linear-gradient(135deg, #0284c7 0%, #2563eb 100%); color: #ffffff; text-decoration: none; padding: 12px 28px; border-radius: 9999px; font-weight: 600; margin-top: 20px; box-shadow: 0 4px 14px rgba(37, 99, 235, 0.4); }
        .note { font-size: 13px; color: #64748b; margin-top: 16px; }
        .footer { margin-top: 36px; padding-top: 20px; border-top: 1px solid #334155; font-size: 12px; color: #64748b; text-align: center; }
      </style>
    </head>
    <body>
      <div class="container">
        <a href="https://site-flow-ai-eight.vercel.app/" class="logo">✨ SiteFlow AI</a>
        <h1>Reset Your Password 🔑</h1>
        <p>We received a request to reset the password for your SiteFlow AI account. Click the button below to choose a new password:</p>
        <a href="${resetUrl}" class="btn">Reset Password →</a>
        <p class="note">This link is valid for 1 hour. If you did not request a password reset, you can safely ignore this email.</p>
        <div class="footer">
          &copy; ${new Date().getFullYear()} SiteFlow AI. All rights reserved.
        </div>
      </div>
    </body>
    </html>
  `;
}

export function getOtpEmailHtml(otpCode: string): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: 'Segoe UI', Arial, sans-serif; background-color: #0f172a; color: #f8fafc; margin: 0; padding: 40px 20px; }
        .container { max-width: 560px; margin: 0 auto; background: #1e293b; border-radius: 16px; border: 1px solid #334155; padding: 40px; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5); text-align: center; }
        .logo { font-size: 24px; font-weight: bold; color: #38bdf8; text-decoration: none; display: inline-block; margin-bottom: 24px; }
        h1 { font-size: 22px; color: #ffffff; margin-top: 0; }
        p { color: #94a3b8; font-size: 15px; line-height: 1.6; }
        .otp-box { display: inline-block; background: #0f172a; border: 2px solid #0284c7; border-radius: 12px; font-size: 32px; font-weight: 800; letter-spacing: 8px; color: #38bdf8; padding: 16px 32px; margin: 24px 0; box-shadow: 0 0 20px rgba(56, 189, 248, 0.2); }
        .note { font-size: 13px; color: #64748b; margin-top: 16px; }
        .footer { margin-top: 36px; padding-top: 20px; border-top: 1px solid #334155; font-size: 12px; color: #64748b; text-align: center; }
      </style>
    </head>
    <body>
      <div class="container">
        <a href="https://site-flow-ai-eight.vercel.app/" class="logo">✨ SiteFlow AI</a>
        <h1>Verify Your Email Address 🔐</h1>
        <p>Use the 6-digit verification code below to complete your SiteFlow AI registration:</p>
        <div class="otp-box">${otpCode}</div>
        <p class="note">This OTP code is valid for 10 minutes. Do not share this code with anyone.</p>
        <div class="footer">
          &copy; ${new Date().getFullYear()} SiteFlow AI. All rights reserved.
        </div>
      </div>
    </body>
    </html>
  `;
}
