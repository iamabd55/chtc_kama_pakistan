import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const safeTrim = (value: FormDataEntryValue | null) =>
    typeof value === "string" ? value.trim() : "";

export async function POST(request: Request) {
    const form = await request.formData();

    const fullName = safeTrim(form.get("full_name"));
    const companyName = safeTrim(form.get("company_name"));
    const email = safeTrim(form.get("email"));
    const phone = safeTrim(form.get("phone"));
    const city = safeTrim(form.get("city"));
    const vehicleCategory = safeTrim(form.get("vehicle_category"));
    const requirements = safeTrim(form.get("requirements"));
    const requestedProduct = safeTrim(form.get("requested_product"));

    if (!fullName || !phone || !city || !vehicleCategory) {
        return NextResponse.redirect(new URL("/get-quote?error=1", request.url), 303);
    }

    const messageParts = [
        companyName ? `Company: ${companyName}` : "",
        vehicleCategory ? `Vehicle Category: ${vehicleCategory}` : "",
        requestedProduct ? `Requested Product Slug: ${requestedProduct}` : "",
        requirements,
    ].filter(Boolean);

    const supabase = await createClient();
    const { error } = await supabase.from("inquiries").insert({
        full_name: fullName,
        phone,
        email: email || null,
        city,
        inquiry_type: "quote",
        message: messageParts.join("\n") || null,
        source: "web-form",
    });

    if (error) {
        return NextResponse.redirect(new URL("/get-quote?error=1", request.url), 303);
    }

    const webhook = process.env.INQUIRY_WEBHOOK_URL;
    if (webhook) {
        try {
            await fetch(webhook, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    source: "quote",
                    fullName,
                    phone,
                    email: email || null,
                    city,
                    vehicleCategory,
                    requestedProduct: requestedProduct || null,
                    requirements: requirements || null,
                    createdAt: new Date().toISOString(),
                }),
            });
        } catch {
            // Notification failure should not break quote submission.
        }
    }

    return NextResponse.redirect(new URL("/get-quote?submitted=1", request.url), 303);
}
