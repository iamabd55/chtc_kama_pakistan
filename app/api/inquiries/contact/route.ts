import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { sendInquiryNotification } from "@/lib/notifications/inquiryNotifications";
import { sendCustomerConfirmation } from "@/lib/notifications/customerConfirmation";
import {
    safeTrim,
    normalizePhone,
    isValidLocalPhone,
    isValidEmail,
} from "@/lib/validation/inquiry";

const SUBJECT_TO_TYPE: Record<string, "purchase" | "service" | "brochure" | "general"> = {
    product: "purchase",
    brochure: "brochure",
    service: "service",
    dealer: "general",
    career: "general",
    other: "general",
};

export async function POST(request: Request) {
    const form = await request.formData();

    const fullName = safeTrim(form.get("full_name"));
    const phoneRaw = safeTrim(form.get("phone"));
    const email = safeTrim(form.get("email"));
    const city = safeTrim(form.get("city"));
    const subject = safeTrim(form.get("subject"));
    const message = safeTrim(form.get("message"));

    const phone = normalizePhone(phoneRaw);

    if (!fullName || !phone || !city) {
        return NextResponse.redirect(new URL("/contact?error=1", request.url), 303);
    }

    if (!isValidLocalPhone(phone)) {
        return NextResponse.redirect(new URL("/contact?error=1", request.url), 303);
    }

    if (email && !isValidEmail(email)) {
        return NextResponse.redirect(new URL("/contact?error=1", request.url), 303);
    }

    const inquiryType = SUBJECT_TO_TYPE[subject] ?? "general";
    const prefixedMessage = subject
        ? `[${subject.replace(/-/g, " ")}] ${message}`.trim()
        : message;

    const supabase = await createClient();
    const { data: inserted, error } = await supabase.from("inquiries").insert({
        full_name: fullName,
        phone,
        email: email || null,
        city,
        inquiry_type: inquiryType,
        message: prefixedMessage || null,
        source: "web-form",
    }).select("id, status").single();

    if (error) {
        return NextResponse.redirect(new URL("/contact?error=1", request.url), 303);
    }

    await sendInquiryNotification({
        source: "contact",
        inquiryType,
        fullName,
        phone,
        email: email || null,
        city,
        message: prefixedMessage || null,
        inquiryId: inserted?.id,
        inquiryStatus: inserted?.status,
    });

    await sendCustomerConfirmation({
        customerName: fullName,
        customerEmail: email,
        inquiryType,
        source: "contact",
        inquiryId: inserted?.id,
        inquiryStatus: inserted?.status,
    });

    return NextResponse.redirect(new URL("/contact?submitted=1", request.url), 303);
}
