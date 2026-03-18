import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { sendInquiryNotification } from "@/lib/notifications/inquiryNotifications";

const safeTrim = (value: FormDataEntryValue | null) =>
    typeof value === "string" ? value.trim() : "";

export async function POST(request: Request) {
    const form = await request.formData();

    const fullName = safeTrim(form.get("full_name"));
    const phone = safeTrim(form.get("phone"));
    const email = safeTrim(form.get("email"));
    const city = safeTrim(form.get("city"));
    const requestType = safeTrim(form.get("request_type"));
    const product = safeTrim(form.get("product"));
    const message = safeTrim(form.get("message"));

    if (!fullName || !phone || !city || !requestType) {
        return NextResponse.redirect(new URL("/after-sales?error=1", request.url), 303);
    }

    const inquiryType = requestType === "parts" ? "parts" : "service";
    const compiledMessage = [
        product ? `Product: ${product}` : "",
        message,
    ]
        .filter(Boolean)
        .join("\n");

    const supabase = await createClient();
    const { error } = await supabase.from("inquiries").insert({
        full_name: fullName,
        phone,
        email: email || null,
        city,
        inquiry_type: inquiryType,
        message: compiledMessage || null,
        source: "web-form",
    });

    if (error) {
        return NextResponse.redirect(new URL("/after-sales?error=1", request.url), 303);
    }

    await sendInquiryNotification({
        source: "after-sales",
        inquiryType,
        fullName,
        phone,
        email: email || null,
        city,
        message: compiledMessage || null,
    });

    return NextResponse.redirect(new URL("/after-sales?submitted=1", request.url), 303);
}
