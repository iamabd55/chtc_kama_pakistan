/**
 * POST /api/admin/cloudinary-delete
 *
 * Deletes a Cloudinary asset by public_id using server-side credentials.
 * Called when a news post with a video/cloudinary-hosted image is deleted.
 *
 * Body: { public_id: string, resource_type?: "image" | "video" }
 * Response: { result: "ok" } or { error: string }
 */

import { NextRequest, NextResponse } from "next/server";
import { deleteCloudinaryAsset, type CloudinaryResourceType } from "@/lib/cloudinary";
import { getAuthorizedAdminClient } from "@/lib/supabase/adminAuthorizedClient";

export async function POST(req: NextRequest) {
    // Verify admin session
    const access = await getAuthorizedAdminClient();
    if ("error" in access) return access.error;

    const body = await req.json().catch(() => ({}));
    const publicId: string | undefined = body.public_id;
    const resourceType: CloudinaryResourceType = body.resource_type || "video";

    if (!publicId) {
        return NextResponse.json({ error: "public_id is required" }, { status: 400 });
    }

    const result = await deleteCloudinaryAsset(publicId, resourceType);

    if (result.error) {
        return NextResponse.json({ error: result.error }, { status: 500 });
    }

    return NextResponse.json({ result: result.result || "ok" });
}
