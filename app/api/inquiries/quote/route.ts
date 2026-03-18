import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { sendInquiryNotification } from "@/lib/notifications/inquiryNotifications";

const safeTrim = (value: FormDataEntryValue | null) =>
    typeof value === "string" ? value.trim() : "";

export async function POST(request: Request) {
    const form = await request.formData();

    const fullName = safeTrim(form.get("full_name"));
    const companyName = safeTrim(form.get("company_name"));
    const email = safeTrim(form.get("email"));
    const phone = safeTrim(form.get("phone"));
    const city = safeTrim(form.get("city"));
    const requestTypeRaw = safeTrim(form.get("request_type"));
    const vehicleCategory = safeTrim(form.get("vehicle_category"));
    const requirements = safeTrim(form.get("requirements"));
    const selectedProductId = safeTrim(form.get("selected_product_id"));
    const requestedProductSlug = safeTrim(form.get("requested_product_slug"));

    const inquiryType = requestTypeRaw === "brochure" ? "brochure" : "quote";

    if (!fullName || !phone || !city || !vehicleCategory) {
        return NextResponse.redirect(new URL("/get-quote?error=1", request.url), 303);
    }

    const messageParts = [
        companyName ? `Company: ${companyName}` : "",
        `Request Type: ${inquiryType === "brochure" ? "Brochure" : "Quote"}`,
        vehicleCategory ? `Vehicle Category: ${vehicleCategory}` : "",
        selectedProductId ? `Selected Product ID: ${selectedProductId}` : "",
        requestedProductSlug ? `Requested Product Slug: ${requestedProductSlug}` : "",
        requirements,
    ].filter(Boolean);

    const supabase = await createClient();
    const { error } = await supabase.from("inquiries").insert({
        full_name: fullName,
        phone,
        email: email || null,
        city,
        product_id: selectedProductId || null,
        inquiry_type: inquiryType,
        message: messageParts.join("\n") || null,
        source: "web-form",
    });

    if (error) {
        return NextResponse.redirect(new URL("/get-quote?error=1", request.url), 303);
    }

    await sendInquiryNotification({
        source: "quote",
        inquiryType,
        fullName,
        phone,
        email: email || null,
        city,
        message: messageParts.join("\n") || null,
    });

    return NextResponse.redirect(new URL("/get-quote?submitted=1", request.url), 303);
}
