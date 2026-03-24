import { sendViaResend } from "@/lib/notifications/resend";

type InquiryNotificationPayload = {
    source: "contact" | "quote" | "product" | "after-sales" | "news";
    inquiryType: string;
    fullName: string;
    phone: string;
    email: string | null;
    city: string;
    message: string | null;
    inquiryId?: string;
    inquiryStatus?: string;
    productName?: string | null;
    productSlug?: string | null;
};

const toHtml = (payload: InquiryNotificationPayload) => {
    const fields = [
        ["Inquiry ID", payload.inquiryId || "-"],
        ["Status", payload.inquiryStatus || "new"],
        ["Source", payload.source],
        ["Inquiry Type", payload.inquiryType],
        ["Product", payload.productName || "-"],
        ["Product Slug", payload.productSlug || "-"],
        ["Name", payload.fullName],
        ["Phone", payload.phone],
        ["Email", payload.email || "-"],
        ["City", payload.city],
        ["Message", payload.message || "-"],
    ];

    return `
      <div style="font-family:Arial,sans-serif;font-size:14px;line-height:1.5;color:#111">
        <h2 style="margin:0 0 12px">New Inquiry Received</h2>
        <table style="border-collapse:collapse;width:100%">
          ${fields
              .map(
                  ([label, value]) =>
                      `<tr><td style="padding:6px 8px;border:1px solid #e5e7eb;background:#f8fafc;font-weight:600;width:140px">${label}</td><td style="padding:6px 8px;border:1px solid #e5e7eb">${String(value)}</td></tr>`
              )
              .join("")}
        </table>
      </div>
    `;
};

export async function sendInquiryNotification(payload: InquiryNotificationPayload) {
    const webhook = process.env.INQUIRY_WEBHOOK_URL;
    if (webhook) {
        try {
            await fetch(webhook, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...payload, createdAt: new Date().toISOString() }),
            });
        } catch {
            // Notification should not break user submission.
        }
    }

    const notificationTo = process.env.SALES_NOTIFICATION_EMAIL;
    const notificationFrom = process.env.NOTIFICATION_FROM_EMAIL || "inquiries@notifications.local";

    if (!notificationTo) {
        console.warn("[mail] SALES_NOTIFICATION_EMAIL is missing. Admin inquiry email not sent.");
        return;
    }

    try {
        await sendViaResend({
            from: notificationFrom,
            to: notificationTo,
            subject: `New ${payload.inquiryType} inquiry${payload.productName ? ` for ${payload.productName}` : ""} from ${payload.fullName}`,
            html: toHtml(payload),
            text: `${payload.inquiryType} inquiry from ${payload.fullName} (${payload.phone}) - ${payload.city}${payload.inquiryId ? ` | ID: ${payload.inquiryId}` : ""}`,
        });
    } catch {
        // Notification should not break user submission.
    }
}
