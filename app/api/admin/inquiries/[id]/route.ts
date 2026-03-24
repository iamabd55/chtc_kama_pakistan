import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { sendInquiryStatusUpdate } from "@/lib/notifications/customerConfirmation";

const ALLOWED_STATUSES = new Set([
    "new",
    "contacted",
    "in-progress",
    "converted",
    "closed",
]);

async function requireActiveAdmin() {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return { error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
    }

    const { data: profile, error: profileError } = await supabase
        .from("admin_profiles")
        .select("is_active")
        .eq("user_id", user.id)
        .maybeSingle();

    // Keep API auth behavior aligned with proxy.ts while RBAC table is unavailable.
    const tableMissing = Boolean(
        profileError && /admin_profiles/i.test(profileError.message)
    );

    if (profileError && !tableMissing) {
        return {
            error: NextResponse.json(
                { error: "Could not verify admin profile" },
                { status: 500 }
            ),
        };
    }

    if (tableMissing) {
        return { supabase };
    }

    if (!profile || profile.is_active !== true) {
        return { error: NextResponse.json({ error: "Forbidden" }, { status: 403 }) };
    }

    return { supabase };
}

export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const auth = await requireActiveAdmin();
    if (auth.error) return auth.error;

    const { id } = await params;
    const { supabase } = auth;

    const body = await request.json().catch(() => ({}));

    const status = typeof body?.status === "string" ? body.status.trim() : undefined;
    const notes = typeof body?.notes === "string" ? body.notes.trim() : undefined;
    const assignedTo = typeof body?.assigned_to === "string" ? body.assigned_to.trim() : undefined;
    const followUpDate = typeof body?.follow_up_date === "string" ? body.follow_up_date.trim() : undefined;

    if (status && !ALLOWED_STATUSES.has(status)) {
        return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    const { data: current } = await supabase
        .from("inquiries")
        .select("id, full_name, email, inquiry_type, status, notes, assigned_to, follow_up_date")
        .eq("id", id)
        .maybeSingle();

    if (!current) {
        return NextResponse.json({ error: "Inquiry not found" }, { status: 404 });
    }

    const updatePayload: Record<string, string | null> = {
        updated_at: new Date().toISOString(),
    };

    if (status !== undefined) updatePayload.status = status;
    if (notes !== undefined) updatePayload.notes = notes || null;
    if (assignedTo !== undefined) updatePayload.assigned_to = assignedTo || null;
    if (followUpDate !== undefined) {
        updatePayload.follow_up_date = /^\d{4}-\d{2}-\d{2}$/.test(followUpDate)
            ? followUpDate
            : null;
    }

    const { data: updated, error } = await supabase
        .from("inquiries")
        .update(updatePayload)
        .eq("id", id)
        .select("id, full_name, email, city, inquiry_type, status, notes, assigned_to, follow_up_date, source, created_at, updated_at, phone, product_id, message")
        .single();

    if (error || !updated) {
        return NextResponse.json({ error: error?.message || "Update failed" }, { status: 400 });
    }

    if (current.status !== updated.status && updated.email) {
        await sendInquiryStatusUpdate({
            customerName: updated.full_name,
            customerEmail: updated.email,
            inquiryId: updated.id,
            inquiryType: updated.inquiry_type,
            status: updated.status,
            notes: updated.notes,
        });
    }

    return NextResponse.json({ ok: true, inquiry: updated });
}

export async function DELETE(
    _request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const auth = await requireActiveAdmin();
    if (auth.error) return auth.error;

    const { id } = await params;
    const { supabase } = auth;

    const { error } = await supabase.from("inquiries").delete().eq("id", id);

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ ok: true });
}
