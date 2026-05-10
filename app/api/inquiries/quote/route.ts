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
    const form = await request.formData();

    const fullName = safeTrim(form.get("full_name"));
    const companyName = safeTrim(form.get("company_name"));
    const email = safeTrim(form.get("email"));
    const phoneRaw = safeTrim(form.get("phone"));
    const city = safeTrim(form.get("city"));
    const requestTypeRaw = safeTrim(form.get("request_type"));
    const vehicleCategory = safeTrim(form.get("vehicle_category"));
    const requirements = safeTrim(form.get("requirements"));
    const selectedProductId = safeTrim(form.get("selected_product_id"));
    const requestedProductSlug = safeTrim(form.get("requested_product_slug"));

    const inquiryType = requestTypeRaw === "brochure" ? "brochure" : "quote";

    const phone = normalizePhone(phoneRaw);

    if (!fullName || !phone || !city || !vehicleCategory) {
        console.warn('[inquiry] Validation failed - missing required fields', { fullName: Boolean(fullName), phone: Boolean(phone), city: Boolean(city), vehicleCategory: Boolean(vehicleCategory) });
        return NextResponse.redirect(new URL("/get-quote?error=missing_fields", request.url), 303);
    }

    if (!isValidLocalPhone(phone)) {
        console.warn('[inquiry] Validation failed - invalid phone', { phone });
        return NextResponse.redirect(new URL("/get-quote?error=invalid_phone", request.url), 303);
    }

    if (email && !isValidEmail(email)) {
        console.warn('[inquiry] Validation failed - invalid email', { email });
        return NextResponse.redirect(new URL("/get-quote?error=invalid_email", request.url), 303);
    }

    const messageParts = [
        companyName ? `Company: ${companyName}` : "",
        `Request Type: ${inquiryType === "brochure" ? "Brochure" : "Quote"}`,
        vehicleCategory ? `Vehicle Category: ${vehicleCategory}` : "",
        selectedProductId ? `Selected Product ID: ${selectedProductId}` : "",
        requestedProductSlug ? `Requested Product Slug: ${requestedProductSlug}` : "",
        requirements,
    ].filter(Boolean);

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

        let resolvedProductId: string | null = selectedProductId || null;
        let resolvedProductName: string | null = null;
        let resolvedProductSlug: string | null = requestedProductSlug || null;

        if (selectedProductId || requestedProductSlug) {
            const productLookup = selectedProductId
                ? await supabase
                    .from("products")
                    .select("id, name, slug")
                    .eq("id", selectedProductId)
                    .maybeSingle()
                : await supabase
                    .from("products")
                    .select("id, name, slug")
                    .eq("slug", requestedProductSlug)
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
            inquiry_type: inquiryType,
            message: messageParts.join("\n") || null,
            source: "web-form",
        };

        let { data: inserted, error } = await supabase
            .from("inquiries")
            .insert(insertPayload)
            .select("id, status")
            .maybeSingle();

        if (error && serviceRoleKey) {
            console.error("[inquiry] Service-role insert failed, retrying with anon client", {
                message: error.message,
                code: error.code,
            });

            const anonClient = await createClient();
            const anonInsert = await anonClient
                .from("inquiries")
                .insert(insertPayload)
                .select("id, status")
                .maybeSingle();

            inserted = anonInsert.data;
            error = anonInsert.error;
        }

        if (error) {
            console.error("[inquiry] Supabase error:", {
                message: error.message,
                details: error.details,
                hint: error.hint,
                code: error.code,
            });
            return NextResponse.redirect(new URL("/get-quote?error=supabase", request.url), 303);
        }

        await sendInquiryNotification({
            source: "quote",
            inquiryType,
            fullName,
            phone,
            email: email || null,
            city,
            message: messageParts.join("\n") || null,
            inquiryId: inserted?.id,
            inquiryStatus: inserted?.status,
            productName: resolvedProductName,
            productSlug: resolvedProductSlug,
        });

        await sendCustomerConfirmation({
            customerName: fullName,
            customerEmail: email,
            inquiryType,
            source: "quote",
            inquiryId: inserted?.id,
            inquiryStatus: inserted?.status,
        });

        return NextResponse.redirect(new URL("/get-quote?submitted=1", request.url), 303);
    } catch (err) {
        console.error("[inquiry] Unexpected error:", err);
        return NextResponse.redirect(new URL("/get-quote?error=server", request.url), 303);
    }
}
