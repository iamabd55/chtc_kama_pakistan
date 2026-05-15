import { NextResponse } from "next/server";
import { getAuthorizedAdminClient } from "@/lib/supabase/adminAuthorizedClient";

export async function GET(request: Request) {
    const authorized = await getAuthorizedAdminClient();
    if ("error" in authorized) return authorized.error;

    const { adminClient } = authorized;
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");

    let query = adminClient
        .from("inquiries")
        .select("*, product:products(id, name, slug, brand)")
        .order("created_at", { ascending: false });

    if (status && status !== "all") {
        query = query.eq("status", status);
    }

    const { data, error } = await query;

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ inquiries: data ?? [] });
}
