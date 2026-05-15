import { NextResponse } from "next/server";
import { createClient as createServerClient } from "@/lib/supabase/server";
import { createClient as createServiceClient, type SupabaseClient } from "@supabase/supabase-js";

export type AdminRole = "super_admin" | "editor" | "sales" | "hr";

export type AdminAccess = {
    role: AdminRole;
    is_active: boolean;
} | null;

type ServerClient = Awaited<ReturnType<typeof createServerClient>>;
type ServerUser = NonNullable<
    Awaited<ReturnType<ServerClient["auth"]["getUser"]>>["data"]["user"]
>;

type AdminAccessResult =
    | { error: NextResponse }
    | {
          user: ServerUser;
          profile: AdminAccess;
      };

export type AuthorizedAdminClient =
    | { error: NextResponse }
    | {
          adminClient: SupabaseClient;
          profile: AdminAccess;
          user: ServerUser;
      };

async function getAdminAccess(): Promise<AdminAccessResult> {
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

/** Session user + service-role Supabase client after admin checks (aligned with /api/admin/users). */
export async function getAuthorizedAdminClient(options?: {
    requireSuperAdmin?: boolean;
}): Promise<AuthorizedAdminClient> {
    const access = await getAdminAccess();
    if ("error" in access) return access;

    if (options?.requireSuperAdmin) {
        if (
            !access.profile ||
            access.profile.is_active !== true ||
            access.profile.role !== "super_admin"
        ) {
            return { error: NextResponse.json({ error: "Forbidden" }, { status: 403 }) };
        }
    }

    if (!options?.requireSuperAdmin && access.profile && access.profile.is_active !== true) {
        return { error: NextResponse.json({ error: "Forbidden" }, { status: 403 }) };
    }

    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!serviceRoleKey) {
        return {
            error: NextResponse.json(
                { error: "SUPABASE_SERVICE_ROLE_KEY is not configured" },
                { status: 500 }
            ),
        };
    }

    const adminClient = createServiceClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, serviceRoleKey, {
        auth: { autoRefreshToken: false, persistSession: false },
    });

    return {
        adminClient,
        profile: access.profile,
        user: access.user,
    };
}
