import Link from "next/link";
import { Calendar, ArrowRight } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import type { NewsPost } from "@/lib/supabase/types";
import { getStorageUrl } from "@/lib/supabase/storage";

export const revalidate = 60;

const formatDate = (value: string | null) =>
    new Date(value ?? Date.now()).toLocaleDateString("en-PK", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });

const PAGE_SIZE = 6;
const NEWS_CATEGORIES = ["all", "news", "event", "product-launch", "press-release"] as const;

interface NewsPageProps {
    searchParams?: Promise<{
        category?: string;
        page?: string;
    }>;
}

export default async function NewsPage({ searchParams }: NewsPageProps) {
    const resolved = searchParams ? await searchParams : undefined;
    const selectedCategory =
        NEWS_CATEGORIES.includes((resolved?.category as (typeof NEWS_CATEGORIES)[number]) ?? "all")
            ? ((resolved?.category as (typeof NEWS_CATEGORIES)[number]) ?? "all")
            : "all";
    const currentPage = Math.max(1, Number.parseInt(resolved?.page || "1", 10) || 1);

    const supabase = await createClient();
    const { data } = await supabase
        .from("news_posts")
        .select("id, title, slug, excerpt, thumbnail, category, published_at, created_at")
        .eq("status", "published")
        .order("published_at", { ascending: false, nullsFirst: false })
        .order("created_at", { ascending: false });

    const newsItems = (data ?? []) as Pick<NewsPost, "id" | "title" | "slug" | "excerpt" | "thumbnail" | "category" | "published_at" | "created_at">[];
    const filtered =
        selectedCategory === "all"
            ? newsItems
            : newsItems.filter((item) => item.category === selectedCategory);

    const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
    const safePage = Math.min(currentPage, totalPages);
    const paginated = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

    const createPageHref = (page: number, category: string) => {
        const params = new URLSearchParams();
        if (category !== "all") params.set("category", category);
        if (page > 1) params.set("page", String(page));
        const query = params.toString();
        return query ? `/news?${query}` : "/news";
    };

    return (
        <>
            <section className="py-16 bg-kama-gradient">
                <div className="container text-center">
                    <h1 className="text-4xl md:text-5xl font-display font-bold text-primary-foreground mb-4">News & Events</h1>
                    <p className="text-primary-foreground/70 max-w-xl mx-auto">Latest company news, press releases, product launches, and event coverage.</p>
                </div>
            </section>
            <section className="py-20">
                <div className="container max-w-4xl space-y-6">
                    <div className="flex flex-wrap gap-2">
                        {NEWS_CATEGORIES.map((category) => {
                            const active = selectedCategory === category;
                            return (
                                <Link
                                    key={category}
                                    href={createPageHref(1, category)}
                                    className={`px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wide border transition-colors ${
                                        active
                                            ? "bg-primary text-primary-foreground border-primary"
                                            : "bg-background text-muted-foreground border-border hover:border-primary/35 hover:text-foreground"
                                    }`}
                                >
                                    {category.replace("-", " ")}
                                </Link>
                            );
                        })}
                    </div>

                    {paginated.length === 0 ? (
                        <div className="bg-card border rounded-lg p-8 text-center text-muted-foreground">
                            No published news yet.
                        </div>
                    ) : (
                        paginated.map((item) => (
                            <article key={item.id} className="bg-card border rounded-lg p-5 sm:p-8 hover:shadow-lg transition-shadow">
                                <div className="grid sm:grid-cols-[180px_1fr] gap-5 items-start">
                                    <div className="aspect-video overflow-hidden rounded-md bg-muted">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img
                                            src={getStorageUrl(item.thumbnail)}
                                            alt={item.title}
                                            className="w-full h-full object-cover"
                                            loading="lazy"
                                        />
                                    </div>

                                    <div>
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                                            <Calendar className="w-4 h-4" />
                                            {formatDate(item.published_at ?? item.created_at)}
                                            <span className="mx-1">•</span>
                                            <span className="capitalize">{item.category.replace("-", " ")}</span>
                                        </div>
                                        <h3 className="font-display font-bold text-xl text-foreground mb-2">{item.title}</h3>
                                        <p className="text-muted-foreground mb-4">{item.excerpt ?? "Read full details in this update."}</p>
                                        <Link
                                            href={`/news/${item.slug}`}
                                            className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:text-kama-blue-dark transition-colors"
                                        >
                                            Read More
                                            <ArrowRight className="w-4 h-4" />
                                        </Link>
                                    </div>
                                </div>
                            </article>
                        ))
                    )}

                    {totalPages > 1 && (
                        <nav className="flex items-center justify-center gap-2 pt-4" aria-label="News pagination">
                            <Link
                                href={createPageHref(Math.max(1, safePage - 1), selectedCategory)}
                                className={`px-3.5 py-2 rounded-lg border text-sm font-medium ${
                                    safePage === 1
                                        ? "pointer-events-none opacity-40"
                                        : "hover:bg-muted"
                                }`}
                            >
                                Previous
                            </Link>

                            {Array.from({ length: totalPages }, (_, idx) => idx + 1).map((page) => (
                                <Link
                                    key={page}
                                    href={createPageHref(page, selectedCategory)}
                                    className={`w-10 h-10 rounded-lg flex items-center justify-center text-sm font-semibold ${
                                        safePage === page
                                            ? "bg-primary text-primary-foreground"
                                            : "border hover:bg-muted"
                                    }`}
                                >
                                    {page}
                                </Link>
                            ))}

                            <Link
                                href={createPageHref(Math.min(totalPages, safePage + 1), selectedCategory)}
                                className={`px-3.5 py-2 rounded-lg border text-sm font-medium ${
                                    safePage === totalPages
                                        ? "pointer-events-none opacity-40"
                                        : "hover:bg-muted"
                                }`}
                            >
                                Next
                            </Link>
                        </nav>
                    )}
                </div>
            </section>
        </>
    );
}
