import type { Metadata } from "next";
import { createPublicServerClient } from "@/lib/supabase/publicServer";
import type { NewsPost } from "@/lib/supabase/types";
import NewsListingClient from "@/components/news/NewsListingClient";
import { buildPageMetadata } from "@/lib/seo";

export const revalidate = 60;

export const metadata: Metadata = buildPageMetadata({
    title: "News & Events — Al Nasir Motors Pakistan",
    description: "Latest company news, press releases, product launches, and event coverage from Al Nasir Motors Pakistan.",
    path: "/news",
    type: "article",
    imageAlt: "Al Nasir Motors Pakistan news and events",
});

import { Suspense } from "react";

export default function NewsPage() {
    return (
        <>
            <section className="py-16 bg-kama-gradient">
                <div className="container text-center">
                    <h1 className="text-4xl md:text-5xl font-display font-bold text-primary-foreground mb-4">News & Events</h1>
                    <p className="text-primary-foreground/70 max-w-xl mx-auto">Latest company news, press releases, product launches, and event coverage.</p>
                </div>
            </section>
            <section className="py-20">
                <Suspense fallback={<NewsSkeleton />}>
                    <NewsLoader />
                </Suspense>
            </section>
        </>
    );
}

function NewsSkeleton() {
    return (
        <div className="container">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[...Array(6)].map((_, i) => (
                    <div key={i} className="animate-pulse bg-muted rounded-xl h-80" />
                ))}
            </div>
        </div>
    );
}

async function NewsLoader() {
    const supabase = createPublicServerClient();
    const { data } = await supabase
        .from("news_posts")
        .select("id, title, slug, content, thumbnail, category, author, published_at, created_at")
        .eq("status", "published")
        .order("published_at", { ascending: false, nullsFirst: false })
        .order("created_at", { ascending: false });

    const newsItems = (data ?? []) as Array<
        Pick<NewsPost, "id" | "title" | "slug" | "thumbnail" | "category" | "author" | "published_at" | "created_at"> & {
            content: string;
        }
    >;
    return <NewsListingClient items={newsItems} />;
}
