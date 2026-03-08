import { createBrowserClient } from "@supabase/ssr";

// Browser-side Supabase client used exclusively for admin CRUD operations.
// Auth sessions are stored in cookies via @supabase/ssr, so this client
// is compatible with the middleware session check.
export const adminDb = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
