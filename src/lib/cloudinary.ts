/**
 * Cloudinary server-side helpers for Al Nasir Motors Pakistan
 *
 * Videos are uploaded directly from the browser to Cloudinary using
 * a server-generated signed upload signature (API secret stays server-only).
 * The resulting secure_url is stored in news_posts.video_url in Supabase.
 */

import crypto from "crypto";

const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!;
const API_KEY = process.env.CLOUDINARY_API_KEY!;
const API_SECRET = process.env.CLOUDINARY_API_SECRET!;

export type CloudinaryResourceType = "image" | "video" | "raw";

/**
 * Generate a signed upload payload so the browser can POST directly to
 * Cloudinary without exposing the API secret.
 */
export function generateUploadSignature(
    folder: string,
    resourceType: CloudinaryResourceType = "video"
): {
    signature: string;
    timestamp: number;
    api_key: string;
    cloud_name: string;
    folder: string;
    resource_type: CloudinaryResourceType;
} {
    const timestamp = Math.round(Date.now() / 1000);

    // Params that MUST be included in the signature string
    const paramsToSign: Record<string, string | number> = {
        folder,
        timestamp,
    };

    // Cloudinary expects params sorted alphabetically, joined with &, then secret appended
    const stringToSign =
        Object.keys(paramsToSign)
            .sort()
            .map((k) => `${k}=${paramsToSign[k]}`)
            .join("&") + API_SECRET;

    const signature = crypto
        .createHash("sha256")
        .update(stringToSign)
        .digest("hex");

    return { signature, timestamp, api_key: API_KEY, cloud_name: CLOUD_NAME, folder, resource_type: resourceType };
}

/**
 * Extract the Cloudinary public_id from a secure_url.
 * e.g. "https://res.cloudinary.com/cloud/video/upload/v123/news-videos/abc.mp4"
 *   → "news-videos/abc"
 */
export function extractCloudinaryPublicId(secureUrl: string): string | null {
    try {
        const url = new URL(secureUrl);
        // pathname like: /cloud_name/video/upload/v1234567890/folder/filename.ext
        const match = url.pathname.match(/\/upload\/(?:v\d+\/)?(.+?)(?:\.[^./]+)?$/);
        return match ? match[1] : null;
    } catch {
        return null;
    }
}

/**
 * Delete a Cloudinary asset by public_id via the server-side destroy API.
 * Returns the Cloudinary destroy response JSON.
 */
export async function deleteCloudinaryAsset(
    publicId: string,
    resourceType: CloudinaryResourceType = "video"
): Promise<{ result?: string; error?: string }> {
    const timestamp = Math.round(Date.now() / 1000);

    const stringToSign = `public_id=${publicId}&timestamp=${timestamp}` + API_SECRET;
    const signature = crypto.createHash("sha256").update(stringToSign).digest("hex");

    const form = new FormData();
    form.append("public_id", publicId);
    form.append("timestamp", String(timestamp));
    form.append("api_key", API_KEY);
    form.append("signature", signature);

    const res = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/${resourceType}/destroy`,
        { method: "POST", body: form }
    );

    if (!res.ok) {
        return { error: `Cloudinary destroy failed: ${res.status}` };
    }

    return res.json();
}
