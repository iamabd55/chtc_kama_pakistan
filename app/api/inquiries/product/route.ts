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
    const message = safeTrim(form.get("message"));
    const productId = safeTrim(form.get("product_id"));
    const productSlug = safeTrim(form.get("product_slug"));
    const returnUrl = safeTrim(form.get("return_url"));

    const safeReturnUrl = returnUrl.startsWith("/") ? returnUrl : "/products";

    if (!fullName || !phone || !city) {
        return NextResponse.redirect(new URL(`${safeReturnUrl}?error=1`, request.url), 303);
    }

    const compiledMessage = [
        productSlug ? `Product: ${productSlug}` : "",
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
        product_id: productId || null,
        inquiry_type: "purchase",
        message: compiledMessage || null,
        source: "web-form",
    });

    if (error) {
        return NextResponse.redirect(new URL(`${safeReturnUrl}?error=1`, request.url), 303);
    }

    await sendInquiryNotification({
        source: "product",
        inquiryType: "purchase",
        fullName,
        phone,
        email: email || null,
        city,
        message: compiledMessage || null,
    });

    return NextResponse.redirect(new URL(`${safeReturnUrl}?submitted=1`, request.url), 303);
}
