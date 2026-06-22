"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Calendar, MessageCircle, Play } from "lucide-react";
import { getStorageUrl } from "@/lib/supabase/storage";

type NewsCategory = "news" | "event" | "product-launch" | "press-release";

type NewsItem = {
    id: string;
    title: string;
    slug: string;
    content: string;
    thumbnail: string;
    video_url?: string | null;
    category: NewsCategory;
    author: string;
    published_at: string | null;
    created_at: string;
};

type NewsListingClientProps = {
    items: NewsItem[];
};

const NEWS_CATEGORIES = ["all", "news", "event", "product-launch", "press-release"] as const;
const LOAD_BATCH_SIZE = 6;

const SITE_BASE = (() => {
    const envBase = process.env.NEXT_PUBLIC_SITE_URL?.trim();
    const raw = envBase
        ? (/^https?:\/\//i.test(envBase) ? envBase : `https://${envBase}`)
        : "https://www.alnasirmotors.com.pk";
    return raw.replace(/\/$/, "");
})();

const formatDate = (value: string | null) =>
    new Date(value ?? Date.now()).toLocaleDateString("en-PK", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });

const categoryStyles: Record<NewsCategory, { border: string; badge: string }> = {
    "product-launch": {
        border: "border-l-blue-600",
        badge: "bg-blue-100 text-blue-700 border-blue-200",
    },
    news: {
        border: "border-l-teal-600",
        badge: "bg-teal-100 text-teal-700 border-teal-200",
    },
    event: {
        border: "border-l-amber-500",
        badge: "bg-amber-100 text-amber-700 border-amber-200",
    },
    "press-release": {
        border: "border-l-purple-600",
        badge: "bg-purple-100 text-purple-700 border-purple-200",
    },
};

const excerpt = (content: string, max = 170) => {
    const compact = (content || "").replace(/\s+/g, " ").trim();
    if (!compact) return "Read full details in this update.";
    return compact.length > max ? `${compact.slice(0, max)}...` : compact;
};

const getShareUrl = (slug: string) => `${SITE_BASE}/news/${slug}`;

// ─── Thumbnail helpers ────────────────────────────────────────────────────────
/** Returns a Cloudinary URL for the video's first frame at given dimensions */
function cloudinaryVideoThumbnail(videoUrl: string, width = 800, height = 450): string {
    try {
        // e.g. https://res.cloudinary.com/cloud/video/upload/v123/folder/file.mp4
        // → https://res.cloudinary.com/cloud/video/upload/c_fill,w_800,h_450,so_0/v123/folder/file.jpg
        return videoUrl
            .replace("/video/upload/", `/video/upload/c_fill,w_${width},h_${height},so_0/`)
            .replace(/\.(mp4|mov|webm|avi)$/i, ".jpg");
    } catch {
        return videoUrl;
    }
}

/** VideoOverlay — play button icon shown over video-post thumbnails */
function VideoPlayBadge() {
    return (
        <div className="absolute inset-0 flex items-center justify-center bg-black/30 transition-all group-hover:bg-black/50">
            <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center transition-transform group-hover:scale-110">
                <Play className="w-4 h-4 text-white fill-white ml-0.5" />
            </div>
        </div>
    );
}

export default function NewsListingClient({ items }: NewsListingClientProps) {
    const [selectedCategory, setSelectedCategory] = useState<(typeof NEWS_CATEGORIES)[number]>("all");
    const [search, setSearch] = useState("");
    const [visibleCount, setVisibleCount] = useState(LOAD_BATCH_SIZE);

    const filtered = useMemo(() => {
        const normalizedSearch = search.trim().toLowerCase();
        return items.filter((item) => {
            const categoryMatch = selectedCategory === "all" || item.category === selectedCategory;
            const titleMatch = !normalizedSearch || item.title.toLowerCase().includes(normalizedSearch);
            return categoryMatch && titleMatch;
        });
    }, [items, search, selectedCategory]);

    const featured = filtered[0] ?? null;
    const regular = filtered.slice(1);
    const visibleRegular = regular.slice(0, visibleCount);

    const handleCategoryChange = (category: (typeof NEWS_CATEGORIES)[number]) => {
        setSelectedCategory(category);
        setVisibleCount(LOAD_BATCH_SIZE);
    };

    const handleSearchChange = (value: string) => {
        setSearch(value);
        setVisibleCount(LOAD_BATCH_SIZE);
    };

    return (
        <div className="container max-w-4xl space-y-6">
            <div className="max-w-md">
                <input
                    type="text"
                    value={search}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    placeholder="Search by article title..."
                    className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm"
                />
            </div>

            <div className="flex flex-wrap gap-2">
                {NEWS_CATEGORIES.map((category) => {
                    const active = selectedCategory === category;
                    return (
                        <button
                            key={category}
                            onClick={() => handleCategoryChange(category)}
                            className={`px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wide border transition-colors ${
                                active
                                    ? "bg-primary text-primary-foreground border-primary"
                                    : "bg-background text-muted-foreground border-border hover:border-primary/35 hover:text-foreground"
                            }`}
                        >
                            {category.replace("-", " ")}
                        </button>
                    );
                })}
            </div>

            {!featured ? (
                <div className="bg-card border rounded-lg p-8 text-center text-muted-foreground">
                    No published news yet.
                </div>
            ) : (
                <>
                    {/* ── Featured post ── */}
                    <article className="bg-card border rounded-lg p-5 sm:p-8">
                        <div className="space-y-4">
                            <Link href={`/news/${featured.slug}`} prefetch={false} className="block group">
                                <div className="relative rounded-lg overflow-hidden bg-muted h-[220px] md:h-[320px]">
                                    {featured.video_url ? (
                                        <>
                                            <Image
                                                src={featured.thumbnail
                                                    ? getStorageUrl(featured.thumbnail)
                                                    : cloudinaryVideoThumbnail(featured.video_url, 896, 320)
                                                }
                                                alt={featured.title}
                                                fill
                                                sizes="(max-width: 1024px) 100vw, 896px"
                                                className="object-cover"
                                                priority
                                                unoptimized={!featured.thumbnail}
                                            />
                                            <VideoPlayBadge />
                                        </>
                                    ) : (
                                        <Image
                                            src={getStorageUrl(featured.thumbnail)}
                                            alt={featured.title}
                                            fill
                                            sizes="(max-width: 1024px) 100vw, 896px"
                                            className="object-cover"
                                            priority
                                        />
                                    )}
                                </div>
                            </Link>

                            <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                                <Calendar className="w-4 h-4" />
                                {formatDate(featured.published_at ?? featured.created_at)}
                                <span className="mx-1">•</span>
                                <span
                                    className={`capitalize inline-flex items-center px-2 py-0.5 rounded-full border text-xs font-medium ${categoryStyles[featured.category].badge}`}
                                >
                                    {featured.category.replace("-", " ")}
                                </span>
                                {featured.video_url && (
                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-xs font-medium bg-orange-100 text-orange-700 border-orange-200">
                                        <Play className="w-3 h-3 fill-orange-700" /> Video
                                    </span>
                                )}
                            </div>

                            <h2 className="font-display font-bold text-2xl md:text-3xl text-foreground">
                                {featured.title}
                            </h2>
                            <p className="text-muted-foreground leading-relaxed">{excerpt(featured.content, 240)}</p>

                            <div className="flex items-center gap-3">
                                <Link
                                    href={`/news/${featured.slug}`}
                                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md bg-primary text-primary-foreground text-sm font-semibold hover:bg-kama-blue-dark transition-colors"
                                    prefetch={false}
                                >
                                    {featured.video_url ? "Watch Video" : "Read More"}
                                    <ArrowRight className="w-4 h-4" />
                                </Link>
                                <a
                                    href={`https://wa.me/?text=${encodeURIComponent(`${featured.title} ${getShareUrl(featured.slug)}`)}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label="Share featured article on WhatsApp"
                                    title="Share on WhatsApp"
                                    className="inline-flex items-center justify-center w-10 h-10 rounded-md border hover:bg-muted transition-colors"
                                >
                                    <MessageCircle className="w-4 h-4 text-green-600" />
                                </a>
                            </div>
                        </div>
                    </article>

                    {/* ── Regular posts ── */}
                    {visibleRegular.map((item) => (
                        <article
                            key={item.id}
                            className={`bg-card border border-l-4 rounded-lg p-5 sm:p-8 hover:shadow-lg transition-shadow ${categoryStyles[item.category].border}`}
                        >
                            <div className="grid sm:grid-cols-[180px_1fr] gap-5 items-start">
                                <Link href={`/news/${item.slug}`} prefetch={false} className="block group">
                                    <div className="aspect-video overflow-hidden rounded-md bg-muted relative">
                                        {item.video_url ? (
                                            <>
                                                <Image
                                                    src={item.thumbnail
                                                        ? getStorageUrl(item.thumbnail)
                                                        : cloudinaryVideoThumbnail(item.video_url, 360, 202)
                                                    }
                                                    alt={item.title}
                                                    fill
                                                    sizes="(max-width: 640px) 100vw, 180px"
                                                    className="object-cover"
                                                    loading="lazy"
                                                    unoptimized={!item.thumbnail}
                                                />
                                                <VideoPlayBadge />
                                            </>
                                        ) : (
                                            <Image
                                                src={getStorageUrl(item.thumbnail)}
                                                alt={item.title}
                                                fill
                                                sizes="(max-width: 640px) 100vw, 180px"
                                                className="object-cover"
                                                loading="lazy"
                                            />
                                        )}
                                    </div>
                                </Link>

                                <div>
                                    <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground mb-3">
                                        <Calendar className="w-4 h-4" />
                                        {formatDate(item.published_at ?? item.created_at)}
                                        <span className="mx-1">•</span>
                                        <span
                                            className={`capitalize inline-flex items-center px-2 py-0.5 rounded-full border text-xs font-medium ${categoryStyles[item.category].badge}`}
                                        >
                                            {item.category.replace("-", " ")}
                                        </span>
                                        {item.video_url && (
                                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-xs font-medium bg-orange-100 text-orange-700 border-orange-200">
                                                <Play className="w-3 h-3 fill-orange-700" /> Video
                                            </span>
                                        )}
                                    </div>
                                    <h3 className="font-display font-bold text-xl text-foreground mb-2">{item.title}</h3>
                                    <p className="text-muted-foreground mb-4">{excerpt(item.content, 140)}</p>
                                    <div className="flex items-center gap-3">
                                        <Link
                                            href={`/news/${item.slug}`}
                                            className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:text-kama-blue-dark transition-colors"
                                            prefetch={false}
                                        >
                                            {item.video_url ? "Watch Video" : "Read More"}
                                            <ArrowRight className="w-4 h-4" />
                                        </Link>
                                        <a
                                            href={`https://wa.me/?text=${encodeURIComponent(`${item.title} ${getShareUrl(item.slug)}`)}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            aria-label="Share article on WhatsApp"
                                            title="Share on WhatsApp"
                                            className="inline-flex items-center justify-center w-8 h-8 rounded-md border hover:bg-muted transition-colors"
                                        >
                                            <MessageCircle className="w-4 h-4 text-green-600" />
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </article>
                    ))}

                    {regular.length > visibleCount && (
                        <div className="pt-2">
                            <button
                                onClick={() => setVisibleCount((prev) => prev + LOAD_BATCH_SIZE)}
                                className="px-5 py-2.5 rounded-md border text-sm font-semibold hover:bg-muted transition-colors"
                            >
                                Load More
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
