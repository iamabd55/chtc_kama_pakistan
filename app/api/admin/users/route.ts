import { NextResponse } from "next/server";
import { createClient as createServerClient } from "@/lib/supabase/server";
import { createClient as createServiceClient } from "@supabase/supabase-js";

const requireTrimmed = (value: unknown) =>
    typeof value === "string" ? value.trim() : "";

export async function POST(request: Request) {
    const server = await createServerClient();
    const {
        data: { user },
    } = await server.auth.getUser();

    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: profile } = await server
        .from("admin_profiles")
        .select("role, is_active")
        .eq("user_id", user.id)
        .maybeSingle();

    if (!profile || profile.is_active !== true || profile.role !== "super_admin") {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const email = requireTrimmed(body?.email);
    const password = requireTrimmed(body?.password);
    const fullName = requireTrimmed(body?.full_name);
    const role = requireTrimmed(body?.role) || "editor";

    if (!email || !password) {
        return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }

    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!serviceRoleKey) {
        return NextResponse.json({ error: "SUPABASE_SERVICE_ROLE_KEY is not configured" }, { status: 500 });
    }

    const adminClient = createServiceClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        serviceRoleKey,
        { auth: { autoRefreshToken: false, persistSession: false } }
    );

    const { data: created, error: createError } = await adminClient.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
    });

    if (createError || !created.user) {
        return NextResponse.json({ error: createError?.message || "Failed to create auth user" }, { status: 400 });
    }

    const { error: insertError } = await adminClient
        .from("admin_profiles")
        .insert({
            user_id: created.user.id,
            email,
            full_name: fullName || null,
            role,
            is_active: true,
        });

    if (insertError) {
        return NextResponse.json({ error: insertError.message }, { status: 400 });
    }

    return NextResponse.json({ ok: true, user_id: created.user.id });
}
