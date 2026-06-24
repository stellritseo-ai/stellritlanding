import nodemailer from "nodemailer";

export interface SendMailParams {
  to: string;
  subject: string;
  text: string;
  html?: string;
}

export async function sendEmail({ to, subject, text, html }: SendMailParams) {
  const host = process.env.EMAIL_HOST || "smtp.gmail.com";
  const port = Number(process.env.EMAIL_PORT) || 465;
  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASS;

  if (!user || !pass) {
    console.warn(
      `[Mail] Email not sent: EMAIL_USER and EMAIL_PASS are not configured in your .env file.\n` +
      `Subject: ${subject}\nTo: ${to}\nText: ${text}`
    );
    return { success: false, reason: "Credentials not configured" };
  }

  try {
    const isGmail = host.includes("gmail.com");
    
    // Gmail-specific shorthand or general SMTP
    const transporter = nodemailer.createTransport(
      isGmail
        ? {
            service: "gmail",
            auth: { user, pass },
          }
        : {
            host,
            port,
            secure: port === 465,
            auth: { user, pass },
          }
    );

    const info = await transporter.sendMail({
      from: `"StellR IT Live Chat" <${user}>`,
      to,
      subject,
      text,
      html: html || text.replace(/\n/g, "<br>"),
    });

    console.log(`[Mail] Notification email sent successfully. MessageId: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("[Mail] Failed to send email:", error);
    return { success: false, error };
  }
}

export function getChatNotificationHtml({
  visitorName,
  visitorContact,
  firstMessage,
  startedAt,
  adminUrl
}: {
  visitorName: string;
  visitorContact: string;
  firstMessage: string;
  startedAt: string;
  adminUrl: string;
}) {
  const contactLink = visitorContact.includes("@")
    ? `<a href="mailto:${visitorContact}" style="color: #6366f1; text-decoration: none; font-weight: 600;">${visitorContact}</a>`
    : `<span style="font-weight: 600; color: #1e293b;">${visitorContact}</span>`;

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Chat Lead</title>
</head>
<body style="font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f6f5fb; margin: 0; padding: 0; -webkit-font-smoothing: antialiased;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f6f5fb; padding: 40px 0; border-collapse: collapse; width: 100%;">
    <tr>
      <td align="center">
        <table class="container" width="100%" style="max-width: 580px; width: 100%; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(124, 58, 237, 0.08); border: 1px solid #e9e8f4; border-collapse: collapse;">
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #6366f1 0%, #a855f7 100%); padding: 32px 40px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 700; letter-spacing: -0.5px;">StellR IT</h1>
              <p style="color: rgba(255, 255, 255, 0.85); margin: 4px 0 0 0; font-size: 14px;">Inbound Live Chat Inquiry Notification</p>
            </td>
          </tr>
          <!-- Body Content -->
          <tr>
            <td style="padding: 40px;">
              <div style="font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: #94a3b8; margin-bottom: 16px;">Visitor Details</div>
              
              <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse: collapse; margin-bottom: 32px; width: 100%;">
                <tr>
                  <td style="padding: 12px 16px; background-color: #f8fafc; border-top-left-radius: 12px; font-size: 14px; color: #64748b; font-weight: 500; border-bottom: 1px solid #e2e8f0; width: 35%;">Name</td>
                  <td style="padding: 12px 16px; background-color: #f8fafc; border-top-right-radius: 12px; font-size: 14px; color: #1e293b; font-weight: 600; text-align: right; border-bottom: 1px solid #e2e8f0;">${visitorName}</td>
                </tr>
                <tr>
                  <td style="padding: 12px 16px; background-color: #f8fafc; font-size: 14px; color: #64748b; font-weight: 500; border-bottom: 1px solid #e2e8f0;">Contact Details</td>
                  <td style="padding: 12px 16px; background-color: #f8fafc; font-size: 14px; color: #1e293b; font-weight: 600; text-align: right; border-bottom: 1px solid #e2e8f0;">${contactLink}</td>
                </tr>
                <tr>
                  <td style="padding: 12px 16px; background-color: #f8fafc; border-bottom-left-radius: 12px; font-size: 14px; color: #64748b; font-weight: 500;">Started At</td>
                  <td style="padding: 12px 16px; background-color: #f8fafc; border-bottom-right-radius: 12px; font-size: 14px; color: #1e293b; font-weight: 600; text-align: right;">${startedAt}</td>
                </tr>
              </table>
              
              <div style="font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: #94a3b8; margin-bottom: 16px;">First Message</div>
              <div style="background-color: #faf5ff; border-left: 4px solid #a855f7; border-radius: 4px 12px 12px 12px; padding: 24px; margin-bottom: 36px;">
                <p style="color: #4a1d96; font-size: 15px; line-height: 1.6; font-style: italic; margin: 0;">“${firstMessage}”</p>
              </div>
              
              <div style="text-align: center; margin-bottom: 20px;">
                <a href="${adminUrl}" style="display: inline-block; background: linear-gradient(135deg, #a855f7 0%, #7c3aed 100%); color: #ffffff !important; text-decoration: none; padding: 14px 32px; border-radius: 9999px; font-size: 14px; font-weight: 600; box-shadow: 0 4px 14px rgba(124, 58, 237, 0.3);">Reply via Admin Dashboard</a>
              </div>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="text-align: center; padding: 0 40px 40px 40px;">
              <p style="color: #94a3b8; font-size: 12px; margin: 0;">© 2026 StellR IT LLC. All rights reserved.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}

export function getContactFormNotificationHtml({
  name,
  email,
  phone,
  company,
  service,
  budget,
  message,
  submittedAt,
  adminUrl
}: {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  service?: string;
  budget?: string;
  message?: string;
  submittedAt: string;
  adminUrl: string;
}) {
  const emailLink = `<a href="mailto:${email}" style="color: #6366f1; text-decoration: none; font-weight: 600;">${email}</a>`;
  
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Contact Inquiry</title>
</head>
<body style="font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f6f5fb; margin: 0; padding: 0; -webkit-font-smoothing: antialiased;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f6f5fb; padding: 40px 0; border-collapse: collapse; width: 100%;">
    <tr>
      <td align="center">
        <table class="container" width="100%" style="max-width: 580px; width: 100%; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(124, 58, 237, 0.08); border: 1px solid #e9e8f4; border-collapse: collapse;">
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #6366f1 0%, #a855f7 100%); padding: 32px 40px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 700; letter-spacing: -0.5px;">StellR IT</h1>
              <p style="color: rgba(255, 255, 255, 0.85); margin: 4px 0 0 0; font-size: 14px;">New Website Contact Form Submission</p>
            </td>
          </tr>
          <!-- Body Content -->
          <tr>
            <td style="padding: 40px;">
              <div style="font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: #94a3b8; margin-bottom: 16px;">Inquiry Details</div>
              
              <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse: collapse; margin-bottom: 32px; width: 100%;">
                <tr>
                  <td style="padding: 12px 16px; background-color: #f8fafc; border-top-left-radius: 12px; font-size: 14px; color: #64748b; font-weight: 500; border-bottom: 1px solid #e2e8f0; width: 35%;">Name</td>
                  <td style="padding: 12px 16px; background-color: #f8fafc; border-top-right-radius: 12px; font-size: 14px; color: #1e293b; font-weight: 600; text-align: right; border-bottom: 1px solid #e2e8f0;">${name || "N/A"}</td>
                </tr>
                <tr>
                  <td style="padding: 12px 16px; background-color: #f8fafc; font-size: 14px; color: #64748b; font-weight: 500; border-bottom: 1px solid #e2e8f0;">Email</td>
                  <td style="padding: 12px 16px; background-color: #f8fafc; font-size: 14px; color: #1e293b; font-weight: 600; text-align: right; border-bottom: 1px solid #e2e8f0;">${emailLink}</td>
                </tr>
                <tr>
                  <td style="padding: 12px 16px; background-color: #f8fafc; font-size: 14px; color: #64748b; font-weight: 500; border-bottom: 1px solid #e2e8f0;">Phone</td>
                  <td style="padding: 12px 16px; background-color: #f8fafc; font-size: 14px; color: #1e293b; font-weight: 600; text-align: right; border-bottom: 1px solid #e2e8f0;">${phone || "N/A"}</td>
                </tr>
                <tr>
                  <td style="padding: 12px 16px; background-color: #f8fafc; font-size: 14px; color: #64748b; font-weight: 500; border-bottom: 1px solid #e2e8f0;">Company</td>
                  <td style="padding: 12px 16px; background-color: #f8fafc; font-size: 14px; color: #1e293b; font-weight: 600; text-align: right; border-bottom: 1px solid #e2e8f0;">${company || "N/A"}</td>
                </tr>
                <tr>
                  <td style="padding: 12px 16px; background-color: #f8fafc; font-size: 14px; color: #64748b; font-weight: 500; border-bottom: 1px solid #e2e8f0;">Service</td>
                  <td style="padding: 12px 16px; background-color: #f8fafc; font-size: 14px; color: #1e293b; font-weight: 600; text-align: right; border-bottom: 1px solid #e2e8f0;">${service || "N/A"}</td>
                </tr>
                <tr>
                  <td style="padding: 12px 16px; background-color: #f8fafc; font-size: 14px; color: #64748b; font-weight: 500; border-bottom: 1px solid #e2e8f0;">Budget</td>
                  <td style="padding: 12px 16px; background-color: #f8fafc; font-size: 14px; color: #1e293b; font-weight: 600; text-align: right; border-bottom: 1px solid #e2e8f0;">${budget || "N/A"}</td>
                </tr>
                <tr>
                  <td style="padding: 12px 16px; background-color: #f8fafc; border-bottom-left-radius: 12px; font-size: 14px; color: #64748b; font-weight: 500;">Submitted At</td>
                  <td style="padding: 12px 16px; background-color: #f8fafc; border-bottom-right-radius: 12px; font-size: 14px; color: #1e293b; font-weight: 600; text-align: right;">${submittedAt}</td>
                </tr>
              </table>
              
              <div style="font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: #94a3b8; margin-bottom: 16px;">Message</div>
              <div style="background-color: #faf5ff; border-left: 4px solid #a855f7; border-radius: 4px 12px 12px 12px; padding: 24px; margin-bottom: 36px;">
                <p style="color: #4a1d96; font-size: 15px; line-height: 1.6; font-style: italic; margin: 0;">“${message || "No message provided."}”</p>
              </div>
              
              <div style="text-align: center; margin-bottom: 20px;">
                <a href="${adminUrl}" style="display: inline-block; background: linear-gradient(135deg, #a855f7 0%, #7c3aed 100%); color: #ffffff !important; text-decoration: none; padding: 14px 32px; border-radius: 9999px; font-size: 14px; font-weight: 600; box-shadow: 0 4px 14px rgba(124, 58, 237, 0.3);">View Inquiries Dashboard</a>
              </div>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="text-align: center; padding: 0 40px 40px 40px;">
              <p style="color: #94a3b8; font-size: 12px; margin: 0;">© 2026 StellR IT LLC. All rights reserved.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}
