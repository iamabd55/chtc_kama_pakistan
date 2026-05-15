import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createClient as createServiceClient } from "@supabase/supabase-js";
import {
    formatInquiryReferenceFromId,
    getInquiryTrackerState,
    normalizeInquiryReference,
} from "@/lib/inquiries";

export async function GET(request: Request) {
    const searchParams = new URL(request.url).searchParams;
    const ref = normalizeInquiryReference(searchParams.get("ref") || "");

    if (!ref) {
        return NextResponse.json(
            { ok: false, error: "Please provide a valid inquiry reference." },
            { status: 400 }
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

        const { data, error } = await supabase
            .from("inquiries")
            .select("id, public_ref, status, created_at, updated_at")
            .eq("public_ref", ref)
            .maybeSingle();

        if (error) {
            console.error("[inquiry-track] Supabase error:", error);
            return NextResponse.json(
                { ok: false, error: "Could not look up this inquiry right now." },
                { status: 500 }
            );
        }

        if (!data) {
            return NextResponse.json(
                { ok: false, error: "No inquiry found for that reference number." },
                { status: 404 }
            );
        }

        const reference = data.public_ref || formatInquiryReferenceFromId(data.id);
        const trackerState = getInquiryTrackerState(data.status as any);

        return NextResponse.json({
            ok: true,
            inquiry: {
                reference,
                status: trackerState.title,
                statusKey: trackerState.stage,
                statusDescription: trackerState.description,
                stepIndex: trackerState.stepIndex,
                submittedAt: data.created_at,
                updatedAt: data.updated_at,
            },
        });
    } catch (error) {
        console.error("[inquiry-track] Unexpected error:", error);
        return NextResponse.json(
            { ok: false, error: "An unexpected error occurred. Please try again." },
            { status: 500 }
        );
    }
}
