import { NextResponse } from "next/server";
import { createClient as createServiceClient } from "@supabase/supabase-js";
import { writeFile, mkdir, readFile } from "fs/promises";
import { join } from "path";
import { sendInquiryNotification } from "@/lib/notifications/inquiryNotifications";
import { sendCustomerConfirmation } from "@/lib/notifications/customerConfirmation";
import {
    safeTrim,
    normalizePhone,
    isValidLocalPhone,
    isValidEmail,
} from "@/lib/validation/inquiry";
import { formatInquiryReferenceFromId } from "@/lib/inquiries";

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

    try {
        let inquiryReference: string | undefined;
        let inserted: { id?: string | null; status?: string | null; public_ref?: string | null } | null = null;

        try {
            const supabase = createServiceClient(
                process.env.NEXT_PUBLIC_SUPABASE_URL!,
                process.env.SUPABASE_SERVICE_ROLE_KEY!
            );
            const res = await supabase.from("inquiries").insert({
                full_name: fullName,
                phone,
                email: email || null,
                city,
                inquiry_type: inquiryType,
                message: prefixedMessage || null,
                source: "web-form",
            }).select("id, status, public_ref").maybeSingle();

            if (res.error) {
                console.error("[inquiry] Supabase error:", res.error);
                throw res.error;
            }

            inserted = res.data || null;
            inquiryReference = inserted?.public_ref || (inserted?.id ? formatInquiryReferenceFromId(inserted.id) : undefined);
        } catch (supabaseErr) {
            // Fallback: persist to a local file so submissions are not lost during dev/misconfiguration
            try {
                const dataDir = join(process.cwd(), ".data");
                await mkdir(dataDir, { recursive: true });
                const fallbackPath = join(dataDir, "inquiries.json");
                const fallbackId = crypto?.randomUUID ? crypto.randomUUID() : String(Date.now());
                const fallbackRef = formatInquiryReferenceFromId(fallbackId);
                const record = {
                    id: fallbackId,
                    reference: fallbackRef,
                    full_name: fullName,
                    phone,
                    email: email || null,
                    city,
                    inquiry_type: inquiryType,
                    message: prefixedMessage || null,
                    source: "web-form",
                    created_at: new Date().toISOString(),
                };

                // Append to file (overwrite with array if not exists)
                let existing = [] as any[];
                try {
                    const raw = await readFile(fallbackPath, "utf8");
                    existing = JSON.parse(raw || "[]");
                } catch {
                    existing = [];
                }
                existing.push(record);
                await writeFile(fallbackPath, JSON.stringify(existing, null, 2), "utf8");

                inquiryReference = fallbackRef;
                inserted = { id: fallbackId, status: "new", public_ref: fallbackRef };
                console.warn("[inquiry] Supabase unavailable — saved inquiry to .data/inquiries.json");
            } catch (fallbackErr) {
                console.error("[inquiry] Supabase and fallback storage failed:", supabaseErr, fallbackErr);
                return NextResponse.redirect(new URL("/contact?error=1", request.url), 303);
            }
        }

        await sendInquiryNotification({
            source: "contact",
            inquiryType,
            fullName,
            phone,
            email: email || null,
            city,
            message: prefixedMessage || null,
            inquiryId: inserted?.id ?? undefined,
            inquiryReference: inquiryReference ?? undefined,
            inquiryStatus: inserted?.status ?? undefined,
        });

        await sendCustomerConfirmation({
            customerName: fullName,
            customerEmail: email,
            inquiryType,
            source: "contact",
            inquiryId: inserted?.id ?? undefined,
            inquiryReference: inquiryReference ?? undefined,
            inquiryStatus: inserted?.status ?? undefined,
        });

        // Redirect to tracker page to show status
        return NextResponse.redirect(
            new URL(
                `/track-inquiry${inquiryReference ? `?ref=${encodeURIComponent(inquiryReference)}` : ""}`,
                request.url
            ),
            303
        );
    } catch (err) {
        console.error("[inquiry] Unexpected error:", err);
        return NextResponse.redirect(new URL("/contact?error=1", request.url), 303);
    }
}
