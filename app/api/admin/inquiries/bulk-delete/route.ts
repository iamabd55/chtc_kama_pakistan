import { NextRequest, NextResponse } from "next/server";
import { getAuthorizedAdminClient } from "@/lib/supabase/adminAuthorizedClient";

/** Sentinel UUID — never used as a real PK; satisfies "DELETE requires a WHERE clause". */
const NIL_UUID = "00000000-0000-0000-0000-000000000000";

export async function POST(request: NextRequest) {
    const authorized = await getAuthorizedAdminClient();
    if ("error" in authorized) return authorized.error;

    const { adminClient } = authorized;

    const body = await request.json().catch(() => ({}));
    const scope = typeof body?.scope === "string" ? body.scope : "";
    const statusFilter =
        typeof body?.filterStatus === "string"
            ? body.filterStatus
            : typeof body?.status === "string"
                ? body.status
                : null;

    if (scope === "filtered") {
        if (!statusFilter) {
            return NextResponse.json({ error: "status is required for filtered delete" }, { status: 400 });
        }
        const { error, count } = await adminClient
            .from("inquiries")
            .delete({ count: "exact" })
            .eq("status", statusFilter);

        if (error) {
            console.error("bulk delete inquiries:", error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ ok: true, deletedCount: count ?? 0 });
    }

    if (scope === "all") {
        const { error, count } = await adminClient
            .from("inquiries")
            .delete({ count: "exact" })
            .neq("id", NIL_UUID);

        if (error) {
            console.error("bulk delete inquiries:", error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ ok: true, deletedCount: count ?? 0 });
    }

    return NextResponse.json({ error: "Invalid scope" }, { status: 400 });
}
