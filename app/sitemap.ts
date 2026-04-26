import type { MetadataRoute } from "next";
import { createPublicServerClient } from "@/lib/supabase/publicServer";
import { absoluteUrl } from "@/lib/seo";

export const revalidate = 3600;

const STATIC_ROUTES = [
    "/",
    "/about",
    "/about/leadership",
    "/about/quality",
    "/about/clients",
    "/products",
    "/brands",
    "/brands/kama",
    "/brands/kinwin",
    "/find-dealer",
    "/after-sales",
    "/fabrication",
    "/gallery",
    "/news",
    "/contact",
    "/careers",
    "/get-quote",
    "/privacy",
    "/terms",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const now = new Date();

    const baseEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map((route) => ({
        url: absoluteUrl(route),
        lastModified: now,
        changeFrequency: route === "/" ? "daily" : "weekly",
        priority: route === "/" ? 1 : 0.7,
    }));

    try {
        const supabase = createPublicServerClient();

        const [{ data: categories }, { data: products }, { data: dealers }] = await Promise.all([
            supabase.from("categories").select("slug, is_active").eq("is_active", true),
            supabase
                .from("products")
                .select("slug, updated_at, is_active, brand, category:categories(slug)")
                .eq("is_active", true)
                .neq("brand", "joylong"),
            supabase.from("dealers").select("id, is_active, created_at").eq("is_active", true),
        ]);

        const categoryEntries: MetadataRoute.Sitemap = (categories ?? []).map((category) => ({
            url: absoluteUrl(`/products/${category.slug}`),
            lastModified: now,
            changeFrequency: "weekly",
            priority: 0.8,
        }));

        const productEntries: MetadataRoute.Sitemap = (products ?? []).flatMap((product) => {
            const category = Array.isArray(product.category) ? product.category[0] : product.category;
            if (!category?.slug || !product.slug) return [];

            return [
                {
                    url: absoluteUrl(`/products/${category.slug}/${product.slug}`),
                    lastModified: product.updated_at ? new Date(product.updated_at) : now,
                    changeFrequency: "weekly" as const,
                    priority: 0.7,
                },
            ];
        });

        const dealerEntries: MetadataRoute.Sitemap = (dealers ?? []).map((dealer) => ({
            url: absoluteUrl(`/find-dealer/${dealer.id}`),
            lastModified: dealer.created_at ? new Date(dealer.created_at) : now,
            changeFrequency: "monthly",
            priority: 0.6,
        }));

        return [...baseEntries, ...categoryEntries, ...productEntries, ...dealerEntries];
    } catch {
        // Keep sitemap available even if DB is temporarily unavailable.
        return baseEntries;
    }
}
