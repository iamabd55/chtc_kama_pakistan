import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { getAuthorizedAdminClient } from "@/lib/supabase/adminAuthorizedClient";

/** Purge cached find-dealer pages after admin CRUD. */
export async function POST() {
    const authorized = await getAuthorizedAdminClient();
    if ("error" in authorized) return authorized.error;

    revalidatePath("/find-dealer", "layout");

    return NextResponse.json({ revalidated: true, at: new Date().toISOString() });
}
