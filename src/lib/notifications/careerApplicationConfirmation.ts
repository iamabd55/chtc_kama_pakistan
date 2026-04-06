import { sendViaResend } from "@/lib/notifications/resend";

type CareerApplicationConfirmationPayload = {
    applicantName: string;
    applicantEmail: string;
    jobTitle: string;
    jobLocation: string;
    applicationId?: string;
};

const careerApplicationConfirmationHtml = (payload: CareerApplicationConfirmationPayload) => `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#f8fafc;font-family:Arial,sans-serif">
  <div style="max-width:560px;margin:24px auto;background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #e2e8f0">
    <div style="background:linear-gradient(135deg,#0f172a 0%,#1e3a5f 100%);padding:28px 24px;text-align:center">
      <h1 style="margin:0;color:#ffffff;font-size:20px;font-weight:700">Al Nasir Motors Pakistan</h1>
      <p style="margin:6px 0 0;color:rgba(255,255,255,0.6);font-size:12px;letter-spacing:0.05em;text-transform:uppercase">Career Application Received</p>
    </div>
    <div style="padding:28px 24px">
      <p style="margin:0 0 16px;color:#334155;font-size:15px;line-height:1.6">
        Dear <strong>${payload.applicantName}</strong>,
      </p>
      <p style="margin:0 0 16px;color:#334155;font-size:15px;line-height:1.6">
        Thank you for applying for the <strong>${payload.jobTitle}</strong> position at <strong>Al Nasir Motors Pakistan</strong>.
        We have received your application and our HR team will review it shortly.
      </p>
      <div style="background:#f1f5f9;border-radius:8px;padding:16px;margin:0 0 20px">
        <p style="margin:0;color:#64748b;font-size:13px"><strong>Position:</strong> ${payload.jobTitle}</p>
        <p style="margin:4px 0 0;color:#64748b;font-size:13px"><strong>Location:</strong> ${payload.jobLocation}</p>
        <p style="margin:4px 0 0;color:#64748b;font-size:13px"><strong>Application ID:</strong> ${payload.applicationId || "Pending"}</p>
        <p style="margin:4px 0 0;color:#64748b;font-size:13px"><strong>Received:</strong> ${new Date().toLocaleDateString("en-PK", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}</p>
      </div>
      <p style="margin:0 0 8px;color:#334155;font-size:15px;line-height:1.6">
        If your profile matches the role, our team will contact you using the email or phone number you provided.
      </p>
      <p style="margin:0;color:#334155;font-size:15px;line-height:1.6">
        Best regards,<br>
        <strong>HR Team, Al Nasir Motors Pakistan</strong>
      </p>
    </div>
    <div style="background:#f8fafc;border-top:1px solid #e2e8f0;padding:16px 24px;text-align:center">
      <p style="margin:0;color:#94a3b8;font-size:11px">
        © ${new Date().getFullYear()} Al Nasir Motors Pakistan. All rights reserved.
      </p>
    </div>
  </div>
</body>
</html>
`;

export async function sendCareerApplicationConfirmation(payload: CareerApplicationConfirmationPayload) {
    const fromEmail = process.env.NOTIFICATION_FROM_EMAIL || "noreply@notifications.local";

    if (!payload.applicantEmail) return;

    try {
        await sendViaResend({
            from: fromEmail,
            to: payload.applicantEmail,
            subject: `Application received for ${payload.jobTitle} — Al Nasir Motors Pakistan`,
            html: careerApplicationConfirmationHtml(payload),
            text: `Dear ${payload.applicantName}, thank you for applying for ${payload.jobTitle} at Al Nasir Motors Pakistan. We have received your application and will review it shortly. Application ID: ${payload.applicationId || "pending"}.`,
        });
    } catch {
        // Confirmation email should never break the application flow.
    }
}