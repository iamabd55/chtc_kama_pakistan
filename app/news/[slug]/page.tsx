import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft, Calendar, Clock3, Share2, User } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import type { NewsPost } from "@/lib/supabase/types";
import { getStorageUrl } from "@/lib/supabase/storage";
import NewsInquiryForm from "@/components/news/NewsInquiryForm";
import { absoluteUrl } from "@/lib/seo";

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

const getReadTimeMinutes = (content: string) => {
    const words = content.trim().split(/\s+/).filter(Boolean).length;
    return Math.max(1, Math.ceil(words / 180));
};

const PROMO_TAGS = new Set(["promotion", "promotions", "promo", "offer", "campaign", "discount", "launch"]);

const isInquiryEligiblePost = (post: NewsPost) => {
    if (post.category === "product-launch") return true;
    const tags = (post.tags || []).map((tag) => tag.toLowerCase().trim());
    return tags.some((tag) => PROMO_TAGS.has(tag));
};

export async function generateMetadata({ params }: PageProps) {
    const { slug } = await params;
    const supabase = await createClient();

    const { data } = await supabase
        .from("news_posts")
        .select("title, content")
        .eq("slug", slug)
        .eq("status", "published")
        .single();

    if (!data) return { title: "News Not Found" };

    const summary = (data.content || "")
        .replace(/\s+/g, " ")
        .trim()
        .slice(0, 160);

    return {
        title: `${data.title} — News`,
        description: summary || "Latest update from Al Nasir Motors Pakistan.",
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
    const showInquiry = isInquiryEligiblePost(post);
    const readTimeMinutes = getReadTimeMinutes(post.content || "");
    const articleUrl = absoluteUrl(`/news/${post.slug}`);
    const whatsappShareLink = `https://wa.me/?text=${encodeURIComponent(`${post.title} ${articleUrl}`)}`;
    const linkedInShareLink = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(articleUrl)}`;

    const relatedProductData = post.related_product_id
        ? await supabase
            .from("products")
            .select("id, name, slug, is_active, category:categories(slug)")
            .eq("id", post.related_product_id)
            .eq("is_active", true)
            .maybeSingle()
        : { data: null as null };

    const relatedProduct = relatedProductData.data as
        | {
            id: string;
            name: string;
            slug: string;
            category: { slug: string } | Array<{ slug: string }> | null;
        }
        | null;

    const relatedCategorySlug = Array.isArray(relatedProduct?.category)
        ? relatedProduct?.category[0]?.slug
        : relatedProduct?.category?.slug;

    const relatedProductHref =
        relatedCategorySlug && relatedProduct?.slug
            ? `/products/${relatedCategorySlug}/${relatedProduct.slug}`
            : null;

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

                    <div className="flex flex-wrap items-center gap-3 text-xs text-primary-foreground/80 mb-4">
                        <span className="inline-flex items-center gap-1.5">
                            <User className="w-3.5 h-3.5" />
                            {post.author || "Al Nasir Motors Pakistan"}
                        </span>
                        <span className="inline-flex items-center gap-1.5">
                            <Clock3 className="w-3.5 h-3.5" />
                            {readTimeMinutes} min read
                        </span>
                    </div>

                    <h1 className="text-3xl md:text-5xl font-display font-bold text-primary-foreground mb-3">
                        {post.title}
                    </h1>
                    <p className="text-primary-foreground/75 max-w-3xl text-base md:text-lg">
                        Latest update from Al Nasir Motors Pakistan.
                    </p>
                </div>
            </section>

            <section className="py-12 md:py-16">
                <div className="container max-w-4xl">
                    <div className="h-[260px] sm:h-[360px] md:h-[520px] rounded-xl overflow-hidden border bg-muted mb-8 relative">
                        <Image
                            src={getStorageUrl(post.thumbnail)}
                            alt={post.title}
                            fill
                            sizes="(max-width: 1024px) 100vw, 896px"
                            className="object-contain"
                            priority
                        />
                    </div>

                    <article className="bg-card border rounded-xl p-6 md:p-8 whitespace-pre-wrap leading-relaxed text-foreground">
                        {post.content}
                    </article>

                    {relatedProductHref ? (
                        <div className="mt-6 rounded-xl border bg-card p-4 md:p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                            <p className="text-sm text-muted-foreground">
                                Looking for exact product specs and variants?
                            </p>
                            <Link
                                href={relatedProductHref}
                                className="inline-flex items-center justify-center px-5 py-2.5 rounded-md bg-primary text-primary-foreground text-sm font-semibold hover:bg-kama-blue-dark transition-colors"
                            >
                                View Product Details
                            </Link>
                        </div>
                    ) : null}

                    {(post.tags || []).length > 0 ? (
                        <div className="mt-6 flex flex-wrap gap-2">
                            {(post.tags || []).map((tag) => (
                                <span
                                    key={tag}
                                    className="px-3 py-1 rounded-full border bg-muted/50 text-xs font-medium text-muted-foreground"
                                >
                                    #{tag}
                                </span>
                            ))}
                        </div>
                    ) : null}

                    <div className="mt-6 rounded-xl border bg-card p-4 md:p-5">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                            <p className="text-sm text-muted-foreground inline-flex items-center gap-2">
                                <Share2 className="w-4 h-4" />
                                Share this update with your team
                            </p>
                            <div className="flex flex-wrap gap-2">
                                <a
                                    href={whatsappShareLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center justify-center px-4 py-2 rounded-md border text-sm font-medium hover:bg-muted transition-colors"
                                >
                                    Share on WhatsApp
                                </a>
                                <a
                                    href={linkedInShareLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center justify-center px-4 py-2 rounded-md border text-sm font-medium hover:bg-muted transition-colors"
                                >
                                    Share on LinkedIn
                                </a>
                            </div>
                        </div>
                    </div>

                    {showInquiry && (
                        <div className="mt-10 rounded-xl border bg-card p-6 md:p-8">
                            <div className="mb-5">
                                <h2 className="font-display font-bold text-2xl text-foreground mb-2">
                                    Need More Information?
                                </h2>
                                <p className="text-muted-foreground text-sm md:text-base">
                                    This post is related to a launch or promotion. Submit an inquiry and our team will share complete details, availability, and pricing guidance.
                                </p>
                            </div>

                            <div className="mb-6 flex flex-col sm:flex-row gap-3">
                                <Link
                                    href="/find-dealer"
                                    className="inline-flex items-center justify-center px-6 py-3 rounded-md border border-primary text-primary font-semibold text-sm hover:bg-primary hover:text-primary-foreground transition-colors"
                                >
                                    Find Dealers Near You
                                </Link>
                            </div>

                            <NewsInquiryForm
                                newsTitle={post.title}
                                newsSlug={post.slug}
                                newsCategory={post.category}
                                returnUrl={`/news/${post.slug}`}
                            />
                        </div>
                    )}

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
