/**
 * Supabase Storage helpers
 *
 * All public images live in the "images" bucket.
 * The `image` column in DB tables stores the path inside the bucket,
 * e.g. "categories/mini-truck.jpg".
 *
 * This helper builds the full public URL at runtime.
 */

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const DEFAULT_BUCKET = "images";

/**
 * Build a Supabase Storage public URL.
 *
 * @param path  - Path within the bucket, e.g. "categories/mini-truck.jpg"
 * @param bucket - Storage bucket name (default: "images")
 * @returns Full public URL like
 *   https://<project>.supabase.co/storage/v1/object/public/images/categories/mini-truck.jpg
 */
export function getStorageUrl(
    path: string,
    bucket: string = DEFAULT_BUCKET
): string {
    if (!path) return "";

    // If already a full URL, return as-is (except duplicate bucket paths).
    if (path.startsWith("http://") || path.startsWith("https://")) {
        try {
            const url = new URL(path);
            const marker = `/storage/v1/object/public/${bucket}/`;
            const markerIndex = url.pathname.indexOf(marker);

            if (markerIndex !== -1) {
                const objectPath = decodeURIComponent(
                    url.pathname.slice(markerIndex + marker.length)
                );

                // Protect against legacy values like "images/products/x.png"
                const normalized = objectPath.startsWith(`${bucket}/`)
                    ? objectPath.slice(bucket.length + 1)
                    : objectPath;

                return `${SUPABASE_URL}/storage/v1/object/public/${bucket}/${normalized}`;
            }
        } catch {
            // Fall through and return input when URL parsing fails.
        }

        return path;
    }

    const trimmed = path.replace(/^\/+/, "");

    // Accept both "products/x.png" and legacy "images/products/x.png".
    const normalized = trimmed.startsWith(`${bucket}/`)
        ? trimmed.slice(bucket.length + 1)
        : trimmed;

    return `${SUPABASE_URL}/storage/v1/object/public/${bucket}/${normalized}`;
}
