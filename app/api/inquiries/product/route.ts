import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createClient as createServiceClient } from "@supabase/supabase-js";
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

    try {
        const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
        const supabase = serviceRoleKey
            ? createServiceClient(
                process.env.NEXT_PUBLIC_SUPABASE_URL!,
                serviceRoleKey,
                { auth: { autoRefreshToken: false, persistSession: false } }
            )
            : await createClient();

        if (!serviceRoleKey) {
            console.warn("[inquiry] SUPABASE_SERVICE_ROLE_KEY is missing, using anon server client fallback");
        }

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

        const insertPayload = {
            full_name: fullName,
            phone,
            email: email || null,
            city,
            product_id: resolvedProductId,
            inquiry_type: "purchase",
            message: compiledMessage || null,
            source: "web-form",
        };

        let { error } = await supabase.from("inquiries").insert(insertPayload);

        if (error && serviceRoleKey) {
            console.error("[inquiry] Service-role insert failed, retrying with anon client", {
                message: error.message,
                code: error.code,
            });

            const anonClient = await createClient();
            const anonInsert = await anonClient.from("inquiries").insert(insertPayload);
            error = anonInsert.error;
        }

        if (error) {
            console.error("[inquiry] Supabase error:", {
                message: error.message,
                details: error.details,
                hint: error.hint,
                code: error.code,
            });
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
            inquiryId: undefined,
            inquiryStatus: undefined,
            productName: resolvedProductName,
            productSlug: resolvedProductSlug,
        });

        await sendCustomerConfirmation({
            customerName: fullName,
            customerEmail: email,
            inquiryType: "purchase",
            source: "product",
            inquiryId: undefined,
            inquiryStatus: undefined,
        });

        if (wantsJson) {
            return NextResponse.json({
                ok: true,
                inquiryId: null,
                status: null,
            });
        }

        return NextResponse.redirect(new URL(`${safeReturnUrl}?submitted=1`, request.url), 303);
    } catch (err) {
        console.error("[inquiry] Unexpected error:", err);
        if (wantsJson) {
            return NextResponse.json(
                { ok: false, error: "An unexpected error occurred. Please try again." },
                { status: 500 }
            );
        }
        return NextResponse.redirect(new URL(`${safeReturnUrl}?error=1`, request.url), 303);
    }
}
