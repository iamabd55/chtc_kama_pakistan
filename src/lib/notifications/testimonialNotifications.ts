import { sendViaResend } from "@/lib/notifications/resend";

type TestimonialNotificationPayload = {
    customerName: string;
    company: string | null;
    rating: number | null;
    content: string;
    testimonialId: string;
};

const toHtml = (payload: TestimonialNotificationPayload) => `
  <div style="font-family:Arial,sans-serif;font-size:14px;line-height:1.5;color:#111">
    <h2 style="margin:0 0 12px">New Customer Testimonial (Pending Review)</h2>
    <table style="border-collapse:collapse;width:100%">
      <tr><td style="padding:6px 8px;border:1px solid #e5e7eb;background:#f8fafc;font-weight:600;width:140px">ID</td><td style="padding:6px 8px;border:1px solid #e5e7eb">${payload.testimonialId}</td></tr>
      <tr><td style="padding:6px 8px;border:1px solid #e5e7eb;background:#f8fafc;font-weight:600">Name</td><td style="padding:6px 8px;border:1px solid #e5e7eb">${payload.customerName}</td></tr>
      <tr><td style="padding:6px 8px;border:1px solid #e5e7eb;background:#f8fafc;font-weight:600">Company</td><td style="padding:6px 8px;border:1px solid #e5e7eb">${payload.company || "—"}</td></tr>
      <tr><td style="padding:6px 8px;border:1px solid #e5e7eb;background:#f8fafc;font-weight:600">Rating</td><td style="padding:6px 8px;border:1px solid #e5e7eb">${payload.rating ? `${payload.rating}/5` : "—"}</td></tr>
      <tr><td style="padding:6px 8px;border:1px solid #e5e7eb;background:#f8fafc;font-weight:600">Review</td><td style="padding:6px 8px;border:1px solid #e5e7eb">${payload.content}</td></tr>
    </table>
    <p style="margin:16px 0 0;color:#64748b;font-size:13px">Approve or reject this testimonial in the admin panel.</p>
  </div>
`;

export async function sendTestimonialNotification(payload: TestimonialNotificationPayload) {
    const notificationTo = process.env.SALES_NOTIFICATION_EMAIL;
    const notificationFrom = process.env.NOTIFICATION_FROM_EMAIL || "inquiries@notifications.local";

    if (!notificationTo) return;

    try {
        await sendViaResend({
            from: notificationFrom,
            to: notificationTo,
            subject: `New testimonial pending review — ${payload.customerName}`,
            html: toHtml(payload),
            text: `New testimonial from ${payload.customerName}${payload.company ? ` (${payload.company})` : ""}. Review in admin.`,
        });
    } catch {
        // Notification should not break user submission.
    }
}
