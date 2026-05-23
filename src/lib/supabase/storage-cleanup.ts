import type { SupabaseClient } from "@supabase/supabase-js";

const BUCKET = "images";
const REMOVE_BATCH = 100;

/** Strip bucket prefix and public URLs down to object path inside `images`. */
export function normalizeStoragePath(path: string | null | undefined): string | null {
    if (!path?.trim()) return null;

    let value = path.trim();

    if (value.startsWith("http://") || value.startsWith("https://")) {
        try {
            const url = new URL(value);
            const marker = `/storage/v1/object/public/${BUCKET}/`;
            const idx = url.pathname.indexOf(marker);
            if (idx !== -1) {
                value = decodeURIComponent(url.pathname.slice(idx + marker.length));
            }
        } catch {
            return null;
        }
    }

    value = value.replace(/^\/+/, "");
    if (value.startsWith(`${BUCKET}/`)) {
        value = value.slice(BUCKET.length + 1);
    }

    return value || null;
}

function folderPrefixForPath(path: string): string | null {
    const slash = path.lastIndexOf("/");
    return slash > 0 ? path.slice(0, slash) : null;
}

async function listFilesRecursive(
    storage: SupabaseClient["storage"],
    folder: string
): Promise<string[]> {
    const files: string[] = [];
    const { data, error } = await storage.from(BUCKET).list(folder, { limit: 1000 });

    if (error || !data?.length) return files;

    for (const item of data) {
        const fullPath = folder ? `${folder}/${item.name}` : item.name;
        if (item.id === null) {
            files.push(...(await listFilesRecursive(storage, fullPath)));
        } else {
            files.push(fullPath);
        }
    }

    return files;
}

async function removePaths(
    storage: SupabaseClient["storage"],
    paths: string[]
): Promise<string | null> {
    const unique = Array.from(new Set(paths.filter(Boolean)));
    if (unique.length === 0) return null;

    for (let i = 0; i < unique.length; i += REMOVE_BATCH) {
        const batch = unique.slice(i, i + REMOVE_BATCH);
        const { error } = await storage.from(BUCKET).remove(batch);
        if (error) return error.message;
    }

    return null;
}

function collectProductPrefixes(slug: string, thumbnail?: string | null, images?: string[] | null): string[] {
    const prefixes = new Set<string>([`products/${slug}`]);

    const paths = [normalizeStoragePath(thumbnail), ...(images ?? []).map(normalizeStoragePath)].filter(
        (p): p is string => !!p
    );

    for (const path of paths) {
        prefixes.add(path);
        const folder = folderPrefixForPath(path);
        if (folder?.startsWith("products/")) prefixes.add(folder);
    }

    return Array.from(prefixes);
}

function collectCategoryPaths(
    slug: string,
    image?: string | null,
    hoverImage?: string | null
): string[] {
    const paths = new Set<string>();

    for (const raw of [image, hoverImage]) {
        const normalized = normalizeStoragePath(raw);
        if (normalized) paths.add(normalized);
    }

    // Per-category folder (current) + legacy brand/flat layouts
    paths.add(`categories/${slug}`);
    paths.add(`categories/kama/${slug}`);
    paths.add(`categories/kinwin/${slug}`);
    paths.add(`categories/chtc/${slug}`);

    return Array.from(paths);
}

/** Delete all storage objects for a product (folder + DB-referenced paths). */
export async function deleteProductStorage(
    client: SupabaseClient,
    product: { slug: string; thumbnail?: string | null; images?: string[] | null }
): Promise<string | null> {
    const pathsToRemove = new Set<string>();

    for (const prefix of collectProductPrefixes(product.slug, product.thumbnail, product.images)) {
        if (prefix.includes(".")) {
            pathsToRemove.add(prefix);
            continue;
        }
        const listed = await listFilesRecursive(client.storage, prefix);
        listed.forEach((p) => pathsToRemove.add(p));
    }

    return removePaths(client.storage, Array.from(pathsToRemove));
}

/** Delete category images and any files under known category folder prefixes. */
export async function deleteCategoryStorage(
    client: SupabaseClient,
    category: { slug: string; image?: string | null; hover_image?: string | null }
): Promise<string | null> {
    const pathsToRemove = new Set<string>();

    for (const entry of collectCategoryPaths(category.slug, category.image, category.hover_image)) {
        if (entry.includes(".")) {
            pathsToRemove.add(entry);
            continue;
        }
        const listed = await listFilesRecursive(client.storage, entry);
        listed.forEach((p) => pathsToRemove.add(p));
    }

    return removePaths(client.storage, Array.from(pathsToRemove));
}
