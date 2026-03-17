import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const SUBJECT_TO_TYPE: Record<string, "purchase" | "service" | "general"> = {
    product: "purchase",
    service: "service",
    dealer: "general",
    career: "general",
    other: "general",
};

const safeTrim = (value: FormDataEntryValue | null) =>
    typeof value === "string" ? value.trim() : "";

export async function POST(request: Request) {
    const form = await request.formData();

    const fullName = safeTrim(form.get("full_name"));
    const phone = safeTrim(form.get("phone"));
    const email = safeTrim(form.get("email"));
    const city = safeTrim(form.get("city"));
    const subject = safeTrim(form.get("subject"));
    const message = safeTrim(form.get("message"));

    if (!fullName || !phone || !city) {
        return NextResponse.redirect(new URL("/contact?error=1", request.url), 303);
    }

    const inquiryType = SUBJECT_TO_TYPE[subject] ?? "general";
    const prefixedMessage = subject
        ? `[${subject.replace(/-/g, " ")}] ${message}`.trim()
        : message;

    const supabase = await createClient();
    const { error } = await supabase.from("inquiries").insert({
        full_name: fullName,
        phone,
        email: email || null,
        city,
        inquiry_type: inquiryType,
        message: prefixedMessage || null,
        source: "web-form",
    });

    if (error) {
        return NextResponse.redirect(new URL("/contact?error=1", request.url), 303);
    }

    const webhook = process.env.INQUIRY_WEBHOOK_URL;
    if (webhook) {
        try {
            await fetch(webhook, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    source: "contact",
                    fullName,
                    phone,
                    email: email || null,
                    city,
                    inquiryType,
                    message: prefixedMessage || null,
                    createdAt: new Date().toISOString(),
                }),
            });
        } catch {
            // Notifications should not block the user-facing form flow.
        }
    }

    return NextResponse.redirect(new URL("/contact?submitted=1", request.url), 303);
}
