import { NextResponse } from "next/server";
import { createClient as createServerClient } from "@/lib/supabase/server";
import { createClient as createServiceClient } from "@supabase/supabase-js";

const requireTrimmed = (value: unknown) =>
    typeof value === "string" ? value.trim() : "";

type AdminRole = "super_admin" | "editor" | "sales" | "hr";

const validRoles: AdminRole[] = ["super_admin", "editor", "sales", "hr"];

type AdminAccess = {
    role: AdminRole;
    is_active: boolean;
} | null;

async function getAdminAccess() {
    const server = await createServerClient();
    const {
        data: { user },
    } = await server.auth.getUser();

    if (!user) {
        return { error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
    }

    const { data: profile, error: profileError } = await server
        .from("admin_profiles")
        .select("role, is_active")
        .eq("user_id", user.id)
        .maybeSingle();

    if (profileError) {
        return {
            user,
            profile: null as AdminAccess,
        };
    }

    return {
        user,
        profile: profile
            ? {
                  role: profile.role as AdminRole,
                  is_active: profile.is_active,
              }
            : (null as AdminAccess),
    };
}

async function getAuthorizedAdminClient(options?: { requireSuperAdmin?: boolean }) {
    const access = await getAdminAccess();
    if (access.error) return access;

    if (options?.requireSuperAdmin) {
        if (!access.profile || access.profile.is_active !== true || access.profile.role !== "super_admin") {
            return { error: NextResponse.json({ error: "Forbidden" }, { status: 403 }) };
        }
    }

    if (!options?.requireSuperAdmin && access.profile && access.profile.is_active !== true) {
        return { error: NextResponse.json({ error: "Forbidden" }, { status: 403 }) };
    }

    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!serviceRoleKey) {
        return {
            error: NextResponse.json({ error: "SUPABASE_SERVICE_ROLE_KEY is not configured" }, { status: 500 }),
        };
    }

    const adminClient = createServiceClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        serviceRoleKey,
        { auth: { autoRefreshToken: false, persistSession: false } }
    );

    return {
        adminClient,
        profile: access.profile,
    };
}

export async function GET() {
    const authorized = await getAuthorizedAdminClient();
    if (authorized.error) return authorized.error;

    const { adminClient } = authorized;

    const [{ data: authUsers, error: authError }, { data: profiles, error: profileError }] = await Promise.all([
        adminClient.auth.admin.listUsers({ page: 1, perPage: 200 }),
        adminClient
            .from("admin_profiles")
            .select("user_id, email, full_name, role, is_active, created_at, updated_at"),
    ]);

    if (authError) {
        return NextResponse.json({ error: authError.message }, { status: 400 });
    }

    if (profileError) {
        return NextResponse.json({ error: profileError.message }, { status: 400 });
    }

    const profileMap = new Map((profiles || []).map((p) => [p.user_id, p]));

    const users = (authUsers?.users || []).map((authUser) => {
        const profile = profileMap.get(authUser.id);
        const metadataName =
            typeof authUser.user_metadata?.full_name === "string"
                ? authUser.user_metadata.full_name
                : null;

        return {
            id: authUser.id,
            user_id: authUser.id,
            email: authUser.email || profile?.email || "",
            full_name: profile?.full_name || metadataName,
            role: (profile?.role || "editor") as AdminRole,
            is_active: profile?.is_active ?? true,
            created_at: authUser.created_at || profile?.created_at || new Date().toISOString(),
            updated_at: profile?.updated_at || authUser.updated_at || authUser.created_at || new Date().toISOString(),
            last_sign_in_at: authUser.last_sign_in_at || null,
        };
    });

    return NextResponse.json({
        users,
        permissions: {
            canManage: true,
        },
    });
}

export async function PATCH(request: Request) {
    const authorized = await getAuthorizedAdminClient();
    if (authorized.error) return authorized.error;

    const { adminClient } = authorized;
    const body = await request.json();

    const userId = requireTrimmed(body?.id);
    const fullName = requireTrimmed(body?.full_name);
    const roleInput = requireTrimmed(body?.role) as AdminRole;
    const isActive = typeof body?.is_active === "boolean" ? body.is_active : true;

    if (!userId) {
        return NextResponse.json({ error: "User id is required" }, { status: 400 });
    }

    const role = validRoles.includes(roleInput) ? roleInput : "editor";

    const { data: authUserData, error: getUserError } = await adminClient.auth.admin.getUserById(userId);
    if (getUserError || !authUserData?.user) {
        return NextResponse.json({ error: getUserError?.message || "Auth user not found" }, { status: 404 });
    }

    const authUser = authUserData.user;

    const { error: updateAuthError } = await adminClient.auth.admin.updateUserById(userId, {
        user_metadata: {
            ...(authUser.user_metadata || {}),
            full_name: fullName || null,
        },
    });

    if (updateAuthError) {
        return NextResponse.json({ error: updateAuthError.message }, { status: 400 });
    }

    const { error: upsertError } = await adminClient
        .from("admin_profiles")
        .upsert(
            {
                user_id: userId,
                email: authUser.email || "",
                full_name: fullName || null,
                role,
                is_active: isActive,
                updated_at: new Date().toISOString(),
            },
            { onConflict: "user_id" }
        );

    if (upsertError) {
        return NextResponse.json({ error: upsertError.message }, { status: 400 });
    }

    return NextResponse.json({ ok: true });
}

export async function POST(request: Request) {
    const authorized = await getAuthorizedAdminClient();
    if (authorized.error) return authorized.error;

    const { adminClient } = authorized;

    const body = await request.json();
    const mode = requireTrimmed(body?.mode) || "create";
    const email = requireTrimmed(body?.email);
    const password = requireTrimmed(body?.password);
    const fullName = requireTrimmed(body?.full_name);
    const roleInput = requireTrimmed(body?.role) as AdminRole;
    const role = validRoles.includes(roleInput) ? roleInput : "editor";
    const redirectTo = requireTrimmed(body?.redirect_to) || undefined;

    if (!email) {
        return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    if (mode === "invite") {
        const { data: invited, error: inviteError } = await adminClient.auth.admin.inviteUserByEmail(email, {
            redirectTo,
            data: {
                full_name: fullName || null,
            },
        });

        if (inviteError) {
            return NextResponse.json({ error: inviteError.message || "Failed to invite auth user" }, { status: 400 });
        }

        if (invited?.user?.id) {
            const { error: upsertError } = await adminClient
                .from("admin_profiles")
                .upsert(
                    {
                        user_id: invited.user.id,
                        email,
                        full_name: fullName || null,
                        role,
                        is_active: true,
                        updated_at: new Date().toISOString(),
                    },
                    { onConflict: "user_id" }
                );

            if (upsertError) {
                return NextResponse.json({ error: upsertError.message }, { status: 400 });
            }
        }

        return NextResponse.json({ ok: true, invited: true, user_id: invited?.user?.id || null });
    }

    if (!password) {
        return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }

    const { data: created, error: createError } = await adminClient.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: {
            full_name: fullName || null,
        },
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

export async function DELETE(request: Request) {
    const authorized = await getAuthorizedAdminClient();
    if (authorized.error) return authorized.error;

    const { adminClient } = authorized;
    const url = new URL(request.url);
    const userId = requireTrimmed(url.searchParams.get("id"));

    if (!userId) {
        return NextResponse.json({ error: "User id is required" }, { status: 400 });
    }

    const { error: deleteAuthError } = await adminClient.auth.admin.deleteUser(userId);

    if (deleteAuthError) {
        return NextResponse.json({ error: deleteAuthError.message }, { status: 400 });
    }

    // Keep profile table consistent. Ignore missing profile rows.
    await adminClient.from("admin_profiles").delete().eq("user_id", userId);

    return NextResponse.json({ ok: true });
}
