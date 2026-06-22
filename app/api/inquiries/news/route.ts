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
import { formatInquiryReferenceFromId } from "@/lib/inquiries";

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
    const phoneRaw  = safeTrim(form.get("phone"));
    const email     = safeTrim(form.get("email"));
    const city      = safeTrim(form.get("city"));
    const message   = safeTrim(form.get("message"));
    const newsTitle    = safeTrim(form.get("news_title"));
    const newsSlug     = safeTrim(form.get("news_slug"));
    const newsCategory = safeTrim(form.get("news_category"));
    const returnUrl    = safeTrim(form.get("return_url"));

    const safeReturnUrl = returnUrl.startsWith("/") ? returnUrl : "/news";
    const phone = normalizePhone(phoneRaw);

    // ── Validation ──────────────────────────────────────────────────────────
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
        newsTitle    ? `News: ${newsTitle}`       : "",
        newsSlug     ? `Slug: ${newsSlug}`         : "",
        newsCategory ? `Category: ${newsCategory}` : "",
        message,
    ]
        .filter(Boolean)
        .join("\n");

    try {
        // ── Use service-role key to bypass RLS (same as product inquiry route) ──
        const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
        const supabase = serviceRoleKey
            ? createServiceClient(
                process.env.NEXT_PUBLIC_SUPABASE_URL!,
                serviceRoleKey,
                { auth: { autoRefreshToken: false, persistSession: false } }
            )
            : await createClient();

        if (!serviceRoleKey) {
            console.warn("[news-inquiry] SUPABASE_SERVICE_ROLE_KEY missing – using anon client fallback");
        }

        const insertPayload = {
            full_name:    fullName,
            phone,
            email:        email || null,
            city,
            inquiry_type: "general" as const,
            message:      compiledMessage || null,
            source:       "web-form" as const,
        };

        let { data: inserted, error } = await supabase
            .from("inquiries")
            .insert(insertPayload)
            .select("id, status, public_ref")
            .single();

        // Fallback: retry with anon client if service-role insert somehow failed
        if (error && serviceRoleKey) {
            console.error("[news-inquiry] Service-role insert failed, retrying with anon client", {
                message: error.message,
                code:    error.code,
            });
            const anonClient  = await createClient();
            const anonInsert  = await anonClient
                .from("inquiries")
                .insert(insertPayload)
                .select("id, status, public_ref")
                .single();
            inserted = anonInsert.data;
            error    = anonInsert.error;
        }

        if (error) {
            console.error("[news-inquiry] Supabase insert error:", {
                message: error.message,
                details: error.details,
                hint:    error.hint,
                code:    error.code,
            });
            if (wantsJson) {
                return NextResponse.json(
                    { ok: false, error: "Could not submit inquiry. Please try again." },
                    { status: 500 }
                );
            }
            return NextResponse.redirect(new URL(`${safeReturnUrl}?error=1`, request.url), 303);
        }

        const inquiryReference =
            inserted?.public_ref ||
            (inserted?.id ? formatInquiryReferenceFromId(inserted.id) : undefined);

        // ── Notifications (fire-and-forget, don't block the response) ────────
        await sendInquiryNotification({
            source:          "news",
            inquiryType:     "general",
            fullName,
            phone,
            email:           email || null,
            city,
            message:         compiledMessage || null,
            inquiryId:       inserted?.id,
            inquiryReference,
            inquiryStatus:   inserted?.status,
            productName:     newsTitle || null,
            productSlug:     newsSlug  || null,
        });

        await sendCustomerConfirmation({
            customerName:  fullName,
            customerEmail: email,
            inquiryType:   "general",
            source:        "news",
            inquiryId:     inserted?.id,
            inquiryReference,
            inquiryStatus: inserted?.status,
        });

        // ── Success response ──────────────────────────────────────────────────
        if (wantsJson) {
            return NextResponse.json({
                ok:         true,
                inquiryId:  inserted?.id   || null,
                reference:  inquiryReference,
                status:     inserted?.status || null,
            });
        }

        return NextResponse.redirect(
            new URL(
                `/track-inquiry${inquiryReference ? `?ref=${encodeURIComponent(inquiryReference)}` : ""}`,
                request.url
            ),
            303
        );
    } catch (err) {
        console.error("[news-inquiry] Unexpected error:", err);
        if (wantsJson) {
            return NextResponse.json(
                { ok: false, error: "An unexpected error occurred. Please try again." },
                { status: 500 }
            );
        }
        return NextResponse.redirect(new URL(`${safeReturnUrl}?error=1`, request.url), 303);
    }
}
