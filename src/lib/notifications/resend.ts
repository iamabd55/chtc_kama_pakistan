type SendResendEmailInput = {
    from: string;
    to: string | string[];
    subject: string;
    html: string;
    text?: string;
};

export async function sendViaResend(input: SendResendEmailInput) {
    const resendApiKey = process.env.RESEND_API_KEY;

    if (!resendApiKey) {
        console.warn("[mail] RESEND_API_KEY is missing. Email not sent.");
        return { ok: false, reason: "missing_api_key" as const };
    }

    const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
            Authorization: `Bearer ${resendApiKey}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify(input),
    });

    const payload = await response.json().catch(() => null);

    if (!response.ok) {
        console.error("[mail] Resend request failed", {
            status: response.status,
            statusText: response.statusText,
            payload,
            subject: input.subject,
        });
        return { ok: false, reason: "resend_error" as const, payload };
    }

    return { ok: true, payload };
}
