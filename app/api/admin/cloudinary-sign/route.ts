/**
 * POST /api/admin/cloudinary-sign
 *
 * Returns a signed upload payload so the browser can upload videos (or images)
 * directly to Cloudinary without exposing the API secret.
 *
 * Body: { folder: string, resourceType?: "image" | "video" }
 * Response: { signature, timestamp, api_key, cloud_name, folder, resource_type }
 */

import { NextRequest, NextResponse } from "next/server";
import { generateUploadSignature, type CloudinaryResourceType } from "@/lib/cloudinary";
import { getAuthorizedAdminClient } from "@/lib/supabase/adminAuthorizedClient";

export async function POST(req: NextRequest) {
    // Verify admin session
    const access = await getAuthorizedAdminClient();
    if ("error" in access) return access.error;

    const body = await req.json().catch(() => ({}));
    const folder: string = body.folder || "news-videos";
    const resourceType: CloudinaryResourceType = body.resourceType || "video";

    const signaturePayload = generateUploadSignature(folder, resourceType);

    return NextResponse.json(signaturePayload);
}
