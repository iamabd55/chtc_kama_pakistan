import { NextResponse } from "next/server";
import { createClient as createServiceClient } from "@supabase/supabase-js";
import { sendInquiryNotification } from "@/lib/notifications/inquiryNotifications";
import { sendCustomerConfirmation } from "@/lib/notifications/customerConfirmation";
import {
    safeTrim,
    normalizePhone,
    isValidLocalPhone,
    isValidEmail,
} from "@/lib/validation/inquiry";
import { formatInquiryReferenceFromId } from "@/lib/inquiries";

export async function POST(request: Request) {
    const form = await request.formData();

    const fullName = safeTrim(form.get("full_name"));
    const phoneRaw = safeTrim(form.get("phone"));
    const email = safeTrim(form.get("email"));
    const city = safeTrim(form.get("city"));
    const requestType = safeTrim(form.get("request_type"));
    const product = safeTrim(form.get("product"));
    const message = safeTrim(form.get("message"));

    const phone = normalizePhone(phoneRaw);

    if (!fullName || !phone || !city || !requestType) {
        return NextResponse.redirect(new URL("/after-sales?error=1", request.url), 303);
    }

    if (!isValidLocalPhone(phone)) {
        return NextResponse.redirect(new URL("/after-sales?error=1", request.url), 303);
    }

    if (email && !isValidEmail(email)) {
        return NextResponse.redirect(new URL("/after-sales?error=1", request.url), 303);
    }

    const inquiryType = requestType === "parts" ? "parts" : "service";
    const compiledMessage = [
        product ? `Product: ${product}` : "",
        message,
    ]
        .filter(Boolean)
        .join("\n");

    const supabase = createServiceClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
    const { data: inserted, error } = await supabase.from("inquiries").insert({
        full_name: fullName,
        phone,
        email: email || null,
        city,
        inquiry_type: inquiryType,
        message: compiledMessage || null,
        source: "web-form",
    }).select("id, status, public_ref").single();

    if (error) {
        return NextResponse.redirect(new URL("/after-sales?error=1", request.url), 303);
    }

    const inquiryReference = inserted?.public_ref || (inserted?.id ? formatInquiryReferenceFromId(inserted.id) : undefined);

    await sendInquiryNotification({
        source: "after-sales",
        inquiryType,
        fullName,
        phone,
        email: email || null,
        city,
        message: compiledMessage || null,
        inquiryId: inserted?.id,
        inquiryReference,
        inquiryStatus: inserted?.status,
        productSlug: product || null,
    });

    await sendCustomerConfirmation({
        customerName: fullName,
        customerEmail: email,
        inquiryType,
        source: "after-sales",
        inquiryId: inserted?.id,
        inquiryReference,
        inquiryStatus: inserted?.status,
    });

        // Redirect to tracker page to show status
        return NextResponse.redirect(
            new URL(
                `/track-inquiry${inquiryReference ? `?ref=${encodeURIComponent(inquiryReference)}` : ""}`,
                request.url
            ),
            303
        );
}
