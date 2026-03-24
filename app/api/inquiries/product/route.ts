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
    const productId = safeTrim(form.get("product_id"));
    const productSlug = safeTrim(form.get("product_slug"));
    const returnUrl = safeTrim(form.get("return_url"));

    const safeReturnUrl = returnUrl.startsWith("/") ? returnUrl : "/products";

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
        productSlug ? `Product: ${productSlug}` : "",
        message,
    ]
        .filter(Boolean)
        .join("\n");

    const supabase = await createClient();
    let resolvedProductId: string | null = productId || null;
    let resolvedProductName: string | null = null;
    let resolvedProductSlug: string | null = productSlug || null;

    if (productId || productSlug) {
        const productLookup = productId
            ? await supabase
                .from("products")
                .select("id, name, slug")
                .eq("id", productId)
                .maybeSingle()
            : await supabase
                .from("products")
                .select("id, name, slug")
                .eq("slug", productSlug)
                .maybeSingle();

        if (productLookup.data) {
            resolvedProductId = productLookup.data.id;
            resolvedProductName = productLookup.data.name;
            resolvedProductSlug = productLookup.data.slug;
        }
    }

    const { data: inserted, error } = await supabase.from("inquiries").insert({
        full_name: fullName,
        phone,
        email: email || null,
        city,
        product_id: resolvedProductId,
        inquiry_type: "purchase",
        message: compiledMessage || null,
        source: "web-form",
    }).select("id, status").single();

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
        source: "product",
        inquiryType: "purchase",
        fullName,
        phone,
        email: email || null,
        city,
        message: compiledMessage || null,
        inquiryId: inserted?.id,
        inquiryStatus: inserted?.status,
        productName: resolvedProductName,
        productSlug: resolvedProductSlug,
    });

    await sendCustomerConfirmation({
        customerName: fullName,
        customerEmail: email,
        inquiryType: "purchase",
        source: "product",
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
