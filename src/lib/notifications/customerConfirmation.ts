import { sendViaResend } from "@/lib/notifications/resend";

type ConfirmationPayload = {
    customerName: string;
    customerEmail: string;
    inquiryType: string;
    source: "contact" | "quote" | "product" | "after-sales" | "news";
  inquiryId?: string;
  inquiryStatus?: string;
};

const confirmationHtml = (payload: ConfirmationPayload) => `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#f8fafc;font-family:Arial,sans-serif">
  <div style="max-width:560px;margin:24px auto;background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #e2e8f0">
    <!-- Header -->
    <div style="background:linear-gradient(135deg,#0f172a 0%,#1e3a5f 100%);padding:28px 24px;text-align:center">
      <h1 style="margin:0;color:#ffffff;font-size:20px;font-weight:700">Al Nasir Motors Pakistan</h1>
      <p style="margin:6px 0 0;color:rgba(255,255,255,0.6);font-size:12px;letter-spacing:0.05em;text-transform:uppercase">Inquiry Confirmation</p>
    </div>
    <!-- Body -->
    <div style="padding:28px 24px">
      <p style="margin:0 0 16px;color:#334155;font-size:15px;line-height:1.6">
        Dear <strong>${payload.customerName}</strong>,
      </p>
      <p style="margin:0 0 16px;color:#334155;font-size:15px;line-height:1.6">
        Thank you for reaching out to us. We have received your <strong>${payload.inquiryType}</strong> inquiry
        and our team will get back to you within <strong>24 business hours</strong>.
      </p>
      <div style="background:#f1f5f9;border-radius:8px;padding:16px;margin:0 0 20px">
        <p style="margin:0;color:#64748b;font-size:13px"><strong>Inquiry ID:</strong> ${payload.inquiryId || "Pending"}</p>
        <p style="margin:0;color:#64748b;font-size:13px"><strong>Reference:</strong> ${payload.source.toUpperCase()} inquiry</p>
        <p style="margin:4px 0 0;color:#64748b;font-size:13px"><strong>Status:</strong> ${payload.inquiryStatus || "new"}</p>
        <p style="margin:4px 0 0;color:#64748b;font-size:13px"><strong>Submitted:</strong> ${new Date().toLocaleDateString("en-PK", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}</p>
      </div>
      <p style="margin:0 0 8px;color:#334155;font-size:15px;line-height:1.6">
        If you need immediate assistance, you can reach us via:
      </p>
      <ul style="margin:0 0 20px;padding:0 0 0 20px;color:#334155;font-size:14px;line-height:1.8">
        <li>WhatsApp: <a href="https://wa.me/923008665060" style="color:#2563eb">+92 300 8665 060</a></li>
        <li>Email: <a href="mailto:info@alnasirmotors.com.pk" style="color:#2563eb">info@alnasirmotors.com.pk</a></li>
      </ul>
      <p style="margin:0;color:#334155;font-size:15px;line-height:1.6">
        Best regards,<br>
        <strong>Al Nasir Motors Pakistan Team</strong>
      </p>
    </div>
    <!-- Footer -->
    <div style="background:#f8fafc;border-top:1px solid #e2e8f0;padding:16px 24px;text-align:center">
      <p style="margin:0;color:#94a3b8;font-size:11px">
        © ${new Date().getFullYear()} Al Nasir Motors Pakistan. All rights reserved.
      </p>
    </div>
  </div>
</body>
</html>
`;

/**
 * Sends a branded confirmation email to the customer via Resend.
 * Silently skips if RESEND_API_KEY is not configured or customer has no email.
 */
export async function sendCustomerConfirmation(payload: ConfirmationPayload) {
    const fromEmail =
        process.env.NOTIFICATION_FROM_EMAIL || "noreply@notifications.local";

  if (!payload.customerEmail) return;

    try {
    await sendViaResend({
      from: fromEmail,
      to: payload.customerEmail,
      subject: `Your inquiry has been received${payload.inquiryId ? ` (#${payload.inquiryId.slice(0, 8)})` : ""} — Al Nasir Motors Pakistan`,
      html: confirmationHtml(payload),
      text: `Dear ${payload.customerName}, thank you for your ${payload.inquiryType} inquiry. Inquiry ID: ${payload.inquiryId || "pending"}. Current status: ${payload.inquiryStatus || "new"}. Our team will get back to you within 24 business hours. For immediate assistance, WhatsApp: +92 300 8665 060`,
        });
    } catch {
        // Customer confirmation should never break the submission flow.
    }
}

type StatusUpdatePayload = {
    customerName: string;
    customerEmail: string;
    inquiryId: string;
    inquiryType: string;
    status: "new" | "contacted" | "in-progress" | "converted" | "closed";
    notes?: string | null;
};

const statusUpdateHtml = (payload: StatusUpdatePayload) => `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#f8fafc;font-family:Arial,sans-serif">
  <div style="max-width:560px;margin:24px auto;background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #e2e8f0">
    <div style="background:linear-gradient(135deg,#0f172a 0%,#1e3a5f 100%);padding:28px 24px;text-align:center">
      <h1 style="margin:0;color:#ffffff;font-size:20px;font-weight:700">Al Nasir Motors Pakistan</h1>
      <p style="margin:6px 0 0;color:rgba(255,255,255,0.6);font-size:12px;letter-spacing:0.05em;text-transform:uppercase">Inquiry Status Update</p>
    </div>
    <div style="padding:28px 24px">
      <p style="margin:0 0 16px;color:#334155;font-size:15px;line-height:1.6">Dear <strong>${payload.customerName}</strong>,</p>
      <p style="margin:0 0 16px;color:#334155;font-size:15px;line-height:1.6">
        Your <strong>${payload.inquiryType}</strong> inquiry status has been updated to <strong>${payload.status}</strong>.
      </p>
      <div style="background:#f1f5f9;border-radius:8px;padding:16px;margin:0 0 20px">
        <p style="margin:0;color:#64748b;font-size:13px"><strong>Inquiry ID:</strong> ${payload.inquiryId}</p>
        <p style="margin:4px 0 0;color:#64748b;font-size:13px"><strong>Status:</strong> ${payload.status}</p>
        <p style="margin:4px 0 0;color:#64748b;font-size:13px"><strong>Updated:</strong> ${new Date().toLocaleDateString("en-PK", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}</p>
      </div>
      ${payload.notes ? `<p style="margin:0;color:#334155;font-size:14px;line-height:1.6"><strong>Note:</strong> ${payload.notes}</p>` : ""}
    </div>
  </div>
</body>
</html>
`;

export async function sendInquiryStatusUpdate(payload: StatusUpdatePayload) {
    const fromEmail = process.env.NOTIFICATION_FROM_EMAIL || "noreply@notifications.local";

  if (!payload.customerEmail) return;

    try {
    await sendViaResend({
      from: fromEmail,
      to: payload.customerEmail,
      subject: `Inquiry Update (#${payload.inquiryId.slice(0, 8)}) — ${payload.status}`,
      html: statusUpdateHtml(payload),
      text: `Dear ${payload.customerName}, your ${payload.inquiryType} inquiry (${payload.inquiryId}) status is now ${payload.status}.${payload.notes ? ` Note: ${payload.notes}` : ""}`,
        });
    } catch {
        // Status emails should not break admin actions.
    }
}
