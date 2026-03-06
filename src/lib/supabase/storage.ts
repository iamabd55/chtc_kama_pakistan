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
    // If already a full URL, return as-is
    if (path.startsWith("http://") || path.startsWith("https://")) return path;
    return `${SUPABASE_URL}/storage/v1/object/public/${bucket}/${path}`;
}
