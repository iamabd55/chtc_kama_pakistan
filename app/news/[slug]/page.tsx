import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Calendar } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import type { NewsPost } from "@/lib/supabase/types";
import { getStorageUrl } from "@/lib/supabase/storage";

export const revalidate = 60;

interface PageProps {
    params: Promise<{ slug: string }>;
}

const formatDate = (value: string | null) =>
    new Date(value ?? Date.now()).toLocaleDateString("en-PK", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });

export async function generateMetadata({ params }: PageProps) {
    const { slug } = await params;
    const supabase = await createClient();

    const { data } = await supabase
        .from("news_posts")
        .select("title, excerpt, meta_title, meta_desc")
        .eq("slug", slug)
        .eq("status", "published")
        .single();

    if (!data) return { title: "News Not Found" };

    return {
        title: data.meta_title ?? `${data.title} — News`,
        description: data.meta_desc ?? data.excerpt ?? "Latest update from Al Nasir Motors Pakistan.",
    };
}

export default async function NewsDetailPage({ params }: PageProps) {
    const { slug } = await params;
    const supabase = await createClient();

    const { data } = await supabase
        .from("news_posts")
        .select("*")
        .eq("slug", slug)
        .eq("status", "published")
        .single();

    if (!data) notFound();

    const post = data as NewsPost;

    const { data: relatedData } = await supabase
        .from("news_posts")
        .select("id, title, slug, published_at, created_at")
        .eq("status", "published")
        .eq("category", post.category)
        .neq("id", post.id)
        .order("published_at", { ascending: false, nullsFirst: false })
        .order("created_at", { ascending: false })
        .limit(3);

    const related = (relatedData ?? []) as Pick<NewsPost, "id" | "title" | "slug" | "published_at" | "created_at">[];

    return (
        <>
            <section className="py-16 bg-kama-gradient">
                <div className="container max-w-4xl">
                    <Link href="/news" className="inline-flex items-center gap-2 text-primary-foreground/80 hover:text-primary-foreground mb-5 transition-colors">
                        <ArrowLeft className="w-4 h-4" />
                        Back to News
                    </Link>

                    <div className="flex items-center gap-2 text-sm text-primary-foreground/70 mb-3">
                        <Calendar className="w-4 h-4" />
                        {formatDate(post.published_at ?? post.created_at)}
                        <span className="mx-1">•</span>
                        <span className="capitalize">{post.category.replace("-", " ")}</span>
                    </div>

                    <h1 className="text-3xl md:text-5xl font-display font-bold text-primary-foreground mb-3">
                        {post.title}
                    </h1>
                    {post.excerpt && (
                        <p className="text-primary-foreground/75 max-w-3xl text-base md:text-lg">
                            {post.excerpt}
                        </p>
                    )}
                </div>
            </section>

            <section className="py-12 md:py-16">
                <div className="container max-w-4xl">
                    <div className="aspect-[16/8] rounded-xl overflow-hidden border bg-muted mb-8">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src={getStorageUrl(post.thumbnail)}
                            alt={post.title}
                            className="w-full h-full object-cover"
                        />
                    </div>

                    <article className="bg-card border rounded-xl p-6 md:p-8 whitespace-pre-wrap leading-relaxed text-foreground">
                        {post.content}
                    </article>

                    {related.length > 0 && (
                        <div className="mt-10 rounded-xl border bg-card p-6 md:p-8">
                            <h2 className="font-display font-bold text-xl text-foreground mb-5">Related Articles</h2>
                            <div className="space-y-3">
                                {related.map((item) => (
                                    <Link
                                        key={item.id}
                                        href={`/news/${item.slug}`}
                                        className="block rounded-lg border px-4 py-3 hover:bg-muted/50 transition-colors"
                                    >
                                        <p className="font-semibold text-foreground">{item.title}</p>
                                        <p className="text-xs text-muted-foreground mt-1">
                                            {formatDate(item.published_at ?? item.created_at)}
                                        </p>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </section>
        </>
    );
}
