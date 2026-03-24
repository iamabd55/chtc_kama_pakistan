import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import type { NewsPost } from "@/lib/supabase/types";
import NewsListingClient from "@/components/news/NewsListingClient";

export const metadata: Metadata = {
    title: "News & Events",
    description:
        "Latest company news, press releases, product launches, and event coverage from Al Nasir Motors Pakistan.",
    openGraph: {
        title: "News & Events — Al Nasir Motors Pakistan",
        description:
            "Stay updated with the latest news, events, and product launches from Al Nasir Motors Pakistan.",
    },
};

export default async function NewsPage() {

    const supabase = await createClient();
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
    return (
        <>
            <section className="py-16 bg-kama-gradient">
                <div className="container text-center">
                    <h1 className="text-4xl md:text-5xl font-display font-bold text-primary-foreground mb-4">News & Events</h1>
                    <p className="text-primary-foreground/70 max-w-xl mx-auto">Latest company news, press releases, product launches, and event coverage.</p>
                </div>
            </section>
            <section className="py-20">
                <NewsListingClient items={newsItems} />
            </section>
        </>
    );
}
