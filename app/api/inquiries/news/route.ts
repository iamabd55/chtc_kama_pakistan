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

export async function POST(request: Request) {
    const wantsJson =
        request.headers.get("x-requested-with") === "fetch" ||
        request.headers.get("accept")?.includes("application/json");

    const fail = (error: string, field?: string) => {
        if (wantsJson) {
            return NextResponse.json({ ok: false, error, field }, { status: 400 });
        }
        return null;
    };

    const form = await request.formData();

    const fullName = safeTrim(form.get("full_name"));
    const phoneRaw = safeTrim(form.get("phone"));
    const email = safeTrim(form.get("email"));
    const city = safeTrim(form.get("city"));
    const message = safeTrim(form.get("message"));
    const newsTitle = safeTrim(form.get("news_title"));
    const newsSlug = safeTrim(form.get("news_slug"));
    const newsCategory = safeTrim(form.get("news_category"));
    const returnUrl = safeTrim(form.get("return_url"));

    const safeReturnUrl = returnUrl.startsWith("/") ? returnUrl : "/news";
    const phone = normalizePhone(phoneRaw);

    if (!fullName || !phone || !city) {
        const jsonResponse = fail("Please fill all required fields.");
        if (jsonResponse) return jsonResponse;
        return NextResponse.redirect(new URL(`${safeReturnUrl}?error=1`, request.url), 303);
    }

    if (!isValidLocalPhone(phone)) {
        const jsonResponse = fail("Phone must be exactly 11 digits without country code.", "phone");
        if (jsonResponse) return jsonResponse;
        return NextResponse.redirect(new URL(`${safeReturnUrl}?error=1`, request.url), 303);
    }

    if (email && !isValidEmail(email)) {
        const jsonResponse = fail("Please enter a valid email address.", "email");
        if (jsonResponse) return jsonResponse;
        return NextResponse.redirect(new URL(`${safeReturnUrl}?error=1`, request.url), 303);
    }

    const compiledMessage = [
        newsTitle ? `News: ${newsTitle}` : "",
        newsSlug ? `Slug: ${newsSlug}` : "",
        newsCategory ? `Category: ${newsCategory}` : "",
        message,
    ]
        .filter(Boolean)
        .join("\n");

    const supabase = await createClient();
    const { data: inserted, error } = await supabase
        .from("inquiries")
        .insert({
            full_name: fullName,
            phone,
            email: email || null,
            city,
            inquiry_type: "general",
            message: compiledMessage || null,
            source: "web-form",
        })
        .select("id, status")
        .single();

    if (error) {
        if (wantsJson) {
            return NextResponse.json(
                { ok: false, error: "Could not submit inquiry. Please try again." },
                { status: 500 }
            );
        }
        return NextResponse.redirect(new URL(`${safeReturnUrl}?error=1`, request.url), 303);
    }

    await sendInquiryNotification({
        source: "news",
        inquiryType: "general",
        fullName,
        phone,
        email: email || null,
        city,
        message: compiledMessage || null,
        inquiryId: inserted?.id,
        inquiryStatus: inserted?.status,
        productName: newsTitle || null,
        productSlug: newsSlug || null,
    });

    await sendCustomerConfirmation({
        customerName: fullName,
        customerEmail: email,
        inquiryType: "general",
        source: "news",
        inquiryId: inserted?.id,
        inquiryStatus: inserted?.status,
    });

    if (wantsJson) {
        return NextResponse.json({
            ok: true,
            inquiryId: inserted?.id,
            status: inserted?.status,
        });
    }

    return NextResponse.redirect(new URL(`${safeReturnUrl}?submitted=1`, request.url), 303);
}
