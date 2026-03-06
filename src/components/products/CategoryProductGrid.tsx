"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search, ChevronRight, ChevronDown, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { Product } from "@/lib/supabase/types";
import { getStorageUrl } from "@/lib/supabase/storage";

const ease = [0.25, 0.4, 0, 1] as const;

type SortOption = "featured" | "name-asc" | "name-desc" | "newest";

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
    { value: "featured", label: "Featured First" },
    { value: "name-asc", label: "Name A — Z" },
    { value: "name-desc", label: "Name Z — A" },
    { value: "newest", label: "Newest Added" },
];

const BRAND_LABELS: Record<string, string> = {
    kama: "Kama",
    kinwin: "Kinwin",
    chtc: "CHTC",
    joylong: "Joylong",
};

interface CategoryProductGridProps {
    products: Product[];
    categorySlug: string;
}

export default function CategoryProductGrid({ products, categorySlug }: CategoryProductGridProps) {
    const [search, setSearch] = useState("");
    const [sort, setSort] = useState<SortOption>("featured");

    const filtered = useMemo(() => {
        let result = products;

        if (search.trim()) {
            const q = search.toLowerCase();
            result = result.filter(
                (p) =>
                    p.name.toLowerCase().includes(q) ||
                    p.brand.toLowerCase().includes(q) ||
                    (p.short_description?.toLowerCase().includes(q) ?? false)
            );
        }

        return [...result].sort((a, b) => {
            switch (sort) {
                case "featured":
                    if (a.is_featured !== b.is_featured) return a.is_featured ? -1 : 1;
                    return a.name.localeCompare(b.name);
                case "name-asc":
                    return a.name.localeCompare(b.name);
                case "name-desc":
                    return b.name.localeCompare(a.name);
                case "newest":
                    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
                default:
                    return 0;
            }
        });
    }, [products, search, sort]);

    return (
        <>
            {/* Toolbar */}
            {products.length > 1 && (
                <div className="flex flex-col sm:flex-row gap-3 mb-8">
                    <div className="relative flex-1">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search in this category..."
                            className="w-full pl-10 pr-4 py-2.5 border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all text-sm"
                        />
                        {search && (
                            <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                                <X className="w-4 h-4" />
                            </button>
                        )}
                    </div>
                    <div className="relative">
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                        <select
                            value={sort}
                            onChange={(e) => setSort(e.target.value as SortOption)}
                            className="appearance-none pl-4 pr-9 py-2.5 border rounded-lg bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all cursor-pointer min-w-[170px]"
                        >
                            {SORT_OPTIONS.map((opt) => (
                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                        </select>
                    </div>
                </div>
            )}

            {/* Results */}
            {search && (
                <p className="text-sm text-muted-foreground mb-4">
                    {filtered.length} result{filtered.length !== 1 ? "s" : ""} found
                </p>
            )}

            {/* Grid */}
            {filtered.length === 0 ? (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Search className="w-7 h-7 text-primary" />
                    </div>
                    <h3 className="text-xl font-display font-bold text-foreground mb-2">No matches found</h3>
                    <p className="text-muted-foreground text-sm">Try a different search term.</p>
                </motion.div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
                    <AnimatePresence mode="popLayout">
                        {filtered.map((product, i) => (
                            <motion.div
                                key={product.id}
                                layout
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ duration: 0.35, delay: i * 0.05, ease }}
                            >
                                <Link
                                    href={`/products/${categorySlug}/${product.slug}`}
                                    className="group bg-card rounded-xl border overflow-hidden hover:shadow-xl transition-all duration-300 block h-full"
                                >
                                    <div className="aspect-[4/3] overflow-hidden bg-muted relative">
                                        <Image
                                            src={getStorageUrl(product.thumbnail)}
                                            alt={product.name}
                                            fill
                                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                        />
                                        {product.is_featured && (
                                            <span className="absolute top-3 left-3 bg-accent text-accent-foreground text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-sm">
                                                Featured
                                            </span>
                                        )}
                                    </div>
                                    <div className="p-5">
                                        <div className="flex items-start justify-between gap-2 mb-2">
                                            <h3 className="font-display font-bold text-lg text-foreground leading-tight">{product.name}</h3>
                                            <ChevronRight className="w-5 h-5 text-primary opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all duration-300 shrink-0 mt-0.5" />
                                        </div>
                                        {product.short_description && (
                                            <p className="text-muted-foreground text-sm line-clamp-2 mb-3 leading-relaxed">{product.short_description}</p>
                                        )}
                                        <div className="flex items-center gap-2.5">
                                            <span className="bg-primary/10 text-primary text-[11px] px-2.5 py-0.5 rounded-full font-semibold uppercase tracking-wide">
                                                {BRAND_LABELS[product.brand] ?? product.brand}
                                            </span>
                                            {product.model_year && (
                                                <span className="text-muted-foreground text-xs">{product.model_year}</span>
                                            )}
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            )}
        </>
    );
}
