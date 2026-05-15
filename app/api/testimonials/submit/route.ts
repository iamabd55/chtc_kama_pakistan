import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createClient as createServiceClient } from "@supabase/supabase-js";
import { validateTestimonialPayload } from "@/lib/validation/testimonial";
import { sendTestimonialNotification } from "@/lib/notifications/testimonialNotifications";

export async function POST(request: Request) {
    const contentType = request.headers.get("content-type") || "";
    let body: Record<string, unknown>;

    if (contentType.includes("application/json")) {
        body = await request.json().catch(() => ({}));
    } else {
        const form = await request.formData();
        body = {
            customer_name: form.get("customer_name"),
            customer_title: form.get("customer_title"),
            company: form.get("company"),
            content: form.get("content"),
            rating: form.get("rating"),
        };
    }

    const validated = validateTestimonialPayload(body);
    if (!validated.ok) {
        if (contentType.includes("application/json")) {
            return NextResponse.json({ ok: false, error: validated.error }, { status: 400 });
        }
        return NextResponse.redirect(
            new URL(`/testimonials?error=${encodeURIComponent(validated.error)}`, request.url),
            303
        );
    }

    try {
        const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
        const supabase = serviceRoleKey
            ? createServiceClient(
                  process.env.NEXT_PUBLIC_SUPABASE_URL!,
                  serviceRoleKey,
                  { auth: { autoRefreshToken: false, persistSession: false } }
              )
            : await createClient();

        const { data: inserted, error } = await supabase
            .from("testimonials")
            .insert({
                ...validated.data,
                status: "pending",
                is_active: true,
            })
            .select("id")
            .maybeSingle();

        if (error) {
            console.error("[testimonial] Supabase error:", error);
            if (contentType.includes("application/json")) {
                return NextResponse.json({ ok: false, error: "Unable to submit review." }, { status: 500 });
            }
            return NextResponse.redirect(new URL("/testimonials?error=submit", request.url), 303);
        }

        if (inserted?.id) {
            await sendTestimonialNotification({
                testimonialId: inserted.id,
                customerName: validated.data.customer_name,
                company: validated.data.company,
                rating: validated.data.rating,
                content: validated.data.content,
            });
        }

        if (contentType.includes("application/json")) {
            return NextResponse.json({
                ok: true,
                message: "Thank you! Your review has been submitted and will appear after approval.",
            });
        }

        return NextResponse.redirect(new URL("/testimonials?success=1", request.url), 303);
    } catch (err) {
        console.error("[testimonial] Server error:", err);
        if (contentType.includes("application/json")) {
            return NextResponse.json({ ok: false, error: "Server error." }, { status: 500 });
        }
        return NextResponse.redirect(new URL("/testimonials?error=server", request.url), 303);
    }
}
