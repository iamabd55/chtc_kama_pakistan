import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
    let supabaseResponse = NextResponse.next({ request });

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll();
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value }) =>
                        request.cookies.set(name, value)
                    );
                    supabaseResponse = NextResponse.next({ request });
                    cookiesToSet.forEach(({ name, value, options }) =>
                        supabaseResponse.cookies.set(name, value, options)
                    );
                },
            },
        }
    );

    // Refresh session — required so Server Components can read the session
    const {
        data: { user },
    } = await supabase.auth.getUser();

    const { pathname } = request.nextUrl;
    const isAdminRoute = pathname.startsWith("/admin");
    const isLoginPage = pathname === "/admin/login";

    // Protect admin routes: redirect to login if unauthenticated
    if (isAdminRoute && !isLoginPage && !user) {
        const loginUrl = new URL("/admin/login", request.url);
        return NextResponse.redirect(loginUrl);
    }

    if (isAdminRoute && !isLoginPage && user) {
        const { data: profile, error: profileError } = await supabase
            .from("admin_profiles")
            .select("role, is_active")
            .eq("user_id", user.id)
            .maybeSingle();

        // If RBAC table is not yet migrated, do not block access.
        const tableMissing = Boolean(profileError && /admin_profiles/i.test(profileError.message));

        if (!tableMissing) {
            if (!profile || profile.is_active !== true) {
                const loginUrl = new URL("/admin/login", request.url);
                loginUrl.searchParams.set("error", "unauthorized");
                return NextResponse.redirect(loginUrl);
            }

            if (pathname.startsWith("/admin/users") && profile.role !== "super_admin") {
                const dashboardUrl = new URL("/admin/dashboard", request.url);
                dashboardUrl.searchParams.set("error", "forbidden");
                return NextResponse.redirect(dashboardUrl);
            }
        }
    }

    // Redirect already-authenticated users away from the login page
    if (isLoginPage && user) {
        const dashboardUrl = new URL("/admin/dashboard", request.url);
        return NextResponse.redirect(dashboardUrl);
    }

    return supabaseResponse;
}

export const config = {
    matcher: [
        // Run middleware on all routes except static files and Next.js internals
        "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
    ],
};
