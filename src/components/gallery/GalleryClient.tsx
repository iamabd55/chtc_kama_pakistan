"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { X } from "lucide-react";
import { getStorageUrl } from "@/lib/supabase/storage";
import type { GalleryItem } from "@/lib/supabase/types";

type GalleryCategory = GalleryItem["category"];

const categories: Array<"all" | GalleryCategory> = ["all", "product", "event", "facility", "delivery"];

interface GalleryClientProps {
    items: GalleryItem[];
}

export default function GalleryClient({ items }: GalleryClientProps) {
    const [activeCategory, setActiveCategory] = useState<(typeof categories)[number]>("all");
    const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

    const resolveImageUrl = (imageUrl: string) => (imageUrl.startsWith("/") ? imageUrl : getStorageUrl(imageUrl));

    const filtered = useMemo(
        () => (activeCategory === "all" ? items : items.filter((img) => img.category === activeCategory)),
        [activeCategory, items]
    );

    return (
        <>
            <div className="flex flex-wrap gap-2 mb-6">
                {categories.map((category) => (
                    <button
                        key={category}
                        onClick={() => setActiveCategory(category)}
                        className={`px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wide border transition-colors ${
                            activeCategory === category
                                ? "bg-primary text-primary-foreground border-primary"
                                : "bg-background text-muted-foreground border-border hover:border-primary/35 hover:text-foreground"
                        }`}
                    >
                        {category}
                    </button>
                ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filtered.map((img, idx) => (
                    <button
                        key={`${img.id}-${idx}`}
                        type="button"
                        onClick={() => setLightboxIndex(idx)}
                        className="rounded-lg overflow-hidden border bg-card group cursor-pointer text-left"
                    >
                        <div className="aspect-video overflow-hidden relative">
                            <Image src={resolveImageUrl(img.image_url)} alt={img.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" />
                        </div>
                        <div className="p-4">
                            <p className="font-display font-semibold text-foreground text-sm">{img.title}</p>
                            <p className="text-[11px] text-muted-foreground uppercase tracking-wide mt-1">{img.category}</p>
                        </div>
                    </button>
                ))}
            </div>

            {filtered.length === 0 && (
                <div className="mt-6 rounded-lg border bg-card p-8 text-center text-muted-foreground">
                    No images found in this category.
                </div>
            )}

            {lightboxIndex !== null && filtered[lightboxIndex] && (
                <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center px-4" onClick={() => setLightboxIndex(null)}>
                    <button
                        type="button"
                        aria-label="Close preview"
                        onClick={() => setLightboxIndex(null)}
                        className="absolute top-4 right-4 text-white/80 hover:text-white"
                    >
                        <X className="w-6 h-6" />
                    </button>
                    <div className="relative w-full max-w-5xl aspect-[16/9]" onClick={(e) => e.stopPropagation()}>
                        <Image
                            src={resolveImageUrl(filtered[lightboxIndex].image_url)}
                            alt={filtered[lightboxIndex].title}
                            fill
                            className="object-contain"
                            sizes="100vw"
                        />
                    </div>
                </div>
            )}
        </>
    );
}
