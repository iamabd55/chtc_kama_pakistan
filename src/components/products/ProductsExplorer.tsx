"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search, ChevronRight, ChevronDown, SlidersHorizontal, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { Category, Product } from "@/lib/supabase/types";
import { getStorageUrl } from "@/lib/supabase/storage";

const ITEMS_PER_PAGE = 9;
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

interface ProductsExplorerProps {
    categories: Category[];
    products: (Product & { category?: Category })[];
}

export default function ProductsExplorer({ categories, products }: ProductsExplorerProps) {
    const [activeCategory, setActiveCategory] = useState<string>("all");
    const [activeBrand, setActiveBrand] = useState<string>("all");
    const [search, setSearch] = useState("");
    const [sort, setSort] = useState<SortOption>("featured");
    const [page, setPage] = useState(1);
    const [showFilters, setShowFilters] = useState(false);
    const [compareIds, setCompareIds] = useState<string[]>([]);

    const toggleCompare = (id: string) => {
        setCompareIds((prev) => {
            if (prev.includes(id)) return prev.filter((item) => item !== id);
            if (prev.length >= 3) return prev;
            return [...prev, id];
        });
    };

    // Derive available brands from products
    const brands = useMemo(() => {
        const set = new Set(products.map((p) => p.brand));
        return Array.from(set).sort();
    }, [products]);

    // Filter + sort
    const filtered = useMemo(() => {
        let result = products;

        if (activeCategory !== "all") {
            result = result.filter((p) => p.category_id === activeCategory);
        }
        if (activeBrand !== "all") {
            result = result.filter((p) => p.brand === activeBrand);
        }
        if (search.trim()) {
            const q = search.toLowerCase();
            result = result.filter(
                (p) =>
                    p.name.toLowerCase().includes(q) ||
                    p.brand.toLowerCase().includes(q) ||
                    (p.short_description?.toLowerCase().includes(q) ?? false) ||
                    (p.category?.name.toLowerCase().includes(q) ?? false)
            );
        }

        // Sort
        result = [...result].sort((a, b) => {
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

        return result;
    }, [products, activeCategory, activeBrand, search, sort]);

    // Pagination
    const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
    const safeCurrentPage = Math.min(page, totalPages);
    const paginated = filtered.slice(
        (safeCurrentPage - 1) * ITEMS_PER_PAGE,
        safeCurrentPage * ITEMS_PER_PAGE
    );

    // Reset page when filters change
    const handleCategoryChange = (id: string) => {
        setActiveCategory(id);
        setPage(1);
    };
    const handleBrandChange = (brand: string) => {
        setActiveBrand(brand);
        setPage(1);
    };
    const handleSearchChange = (val: string) => {
        setSearch(val);
        setPage(1);
    };
    const handleSortChange = (val: SortOption) => {
        setSort(val);
        setPage(1);
    };

    const clearAllFilters = () => {
        setActiveCategory("all");
        setActiveBrand("all");
        setSearch("");
        setSort("featured");
        setPage(1);
    };

    const hasActiveFilters = activeCategory !== "all" || activeBrand !== "all" || search.trim() !== "";

    // Find category slug for product link
    const getCategorySlug = (product: Product & { category?: Category }) => {
        const cat = categories.find((c) => c.id === product.category_id);
        return cat?.slug ?? "";
    };

    return (
        <>
        <section className="py-12 md:py-20">
            <div className="container">
                {/* ── Toolbar ── */}
                <div className="flex flex-col gap-4 mb-10">
                    {/* Search + Sort row */}
                    <div className="flex flex-col sm:flex-row gap-3">
                        {/* Search */}
                        <div className="relative flex-1">
                            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-muted-foreground pointer-events-none" />
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => handleSearchChange(e.target.value)}
                                placeholder="Search vehicles..."
                                className="w-full pl-10 pr-4 py-2.5 border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all text-sm"
                            />
                            {search && (
                                <button onClick={() => handleSearchChange("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                                    <X className="w-4 h-4" />
                                </button>
                            )}
                        </div>

                        {/* Sort */}
                        <div className="relative">
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                            <select
                                value={sort}
                                onChange={(e) => handleSortChange(e.target.value as SortOption)}
                                className="appearance-none pl-4 pr-9 py-2.5 border rounded-lg bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all cursor-pointer min-w-[170px]"
                            >
                                {SORT_OPTIONS.map((opt) => (
                                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                                ))}
                            </select>
                        </div>

                        {/* Mobile filter toggle */}
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className="flex sm:hidden items-center justify-center gap-2 px-4 py-2.5 border rounded-lg text-sm font-medium text-foreground hover:bg-muted transition-colors"
                        >
                            <SlidersHorizontal className="w-4 h-4" />
                            Filters
                            {hasActiveFilters && (
                                <span className="w-2 h-2 rounded-full bg-primary" />
                            )}
                        </button>
                    </div>

                    {/* Filters: Category + Brand pills */}
                    <div className={`flex-col gap-4 ${showFilters ? "flex" : "hidden sm:flex"}`}>
                        {/* Category pills */}
                        <div className="flex flex-wrap gap-2">
                            <button
                                onClick={() => handleCategoryChange("all")}
                                className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-all duration-200 ${
                                    activeCategory === "all"
                                        ? "bg-primary text-primary-foreground border-primary shadow-sm"
                                        : "bg-background text-muted-foreground border-border hover:border-primary/40 hover:text-foreground"
                                }`}
                            >
                                All Categories
                            </button>
                            {categories.map((cat) => {
                                const count = products.filter((p) => p.category_id === cat.id).length;
                                return (
                                    <button
                                        key={cat.id}
                                        onClick={() => handleCategoryChange(cat.id)}
                                        className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-all duration-200 ${
                                            activeCategory === cat.id
                                                ? "bg-primary text-primary-foreground border-primary shadow-sm"
                                                : "bg-background text-muted-foreground border-border hover:border-primary/40 hover:text-foreground"
                                        }`}
                                    >
                                        {cat.name}
                                        <span className="ml-1.5 text-xs opacity-70">{count}</span>
                                    </button>
                                );
                            })}
                        </div>

                        {/* Brand pills */}
                        <div className="flex flex-wrap items-center gap-2">
                            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider mr-1">Brand:</span>
                            <button
                                onClick={() => handleBrandChange("all")}
                                className={`px-3.5 py-1 rounded-full text-xs font-semibold border transition-all duration-200 uppercase tracking-wide ${
                                    activeBrand === "all"
                                        ? "bg-accent text-accent-foreground border-accent shadow-sm"
                                        : "bg-background text-muted-foreground border-border hover:border-accent/40 hover:text-foreground"
                                }`}
                            >
                                All Brands
                            </button>
                            {brands.map((brand) => (
                                <button
                                    key={brand}
                                    onClick={() => handleBrandChange(brand)}
                                    className={`px-3.5 py-1 rounded-full text-xs font-semibold border transition-all duration-200 uppercase tracking-wide ${
                                        activeBrand === brand
                                            ? "bg-accent text-accent-foreground border-accent shadow-sm"
                                            : "bg-background text-muted-foreground border-border hover:border-accent/40 hover:text-foreground"
                                    }`}
                                >
                                    {BRAND_LABELS[brand] ?? brand}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Active filters summary + clear */}
                    {hasActiveFilters && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <span>{filtered.length} vehicle{filtered.length !== 1 ? "s" : ""} found</span>
                            <span className="text-border">|</span>
                            <button onClick={clearAllFilters} className="text-primary hover:text-kama-blue-dark font-medium transition-colors">
                                Clear all filters
                            </button>
                        </div>
                    )}
                </div>

                {/* ── Product Grid ── */}
                {paginated.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center py-24"
                    >
                        <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Search className="w-8 h-8 text-primary" />
                        </div>
                        <h2 className="text-2xl font-display font-bold text-foreground mb-3">No vehicles found</h2>
                        <p className="text-muted-foreground max-w-md mx-auto mb-6">
                            Try adjusting your search or filters to find what you&apos;re looking for.
                        </p>
                        <button
                            onClick={clearAllFilters}
                            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-display font-semibold text-sm uppercase tracking-wider rounded-sm hover:bg-kama-blue-dark transition-colors"
                        >
                            Reset Filters
                        </button>
                    </motion.div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
                            <AnimatePresence mode="popLayout">
                                {paginated.map((product, i) => {
                                    const catSlug = getCategorySlug(product);
                                    return (
                                        <motion.div
                                            key={product.id}
                                            layout
                                            initial={{ opacity: 0, y: 30 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, scale: 0.95 }}
                                            transition={{ duration: 0.35, delay: i * 0.05, ease }}
                                        >
                                            <Link
                                                href={`/products/${catSlug}/${product.slug}`}
                                                className="group bg-card rounded-xl border overflow-hidden hover:shadow-xl transition-all duration-300 block h-full"
                                            >
                                                {/* Image */}
                                                <div className="aspect-[4/3] overflow-hidden bg-muted relative">
                                                    <Image
                                                        src={getStorageUrl(product.thumbnail)}
                                                        alt={product.name}
                                                        fill
                                                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                                    />
                                                    {/* Featured badge */}
                                                    {product.is_featured && (
                                                        <span className="absolute top-3 left-3 bg-accent text-accent-foreground text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-sm">
                                                            Featured
                                                        </span>
                                                    )}
                                                    {/* Category tag overlay */}
                                                    <span className="absolute bottom-3 left-3 bg-background/90 backdrop-blur-sm text-foreground text-[10px] font-semibold px-2.5 py-1 rounded-full uppercase tracking-wider">
                                                        {product.category?.name ?? categories.find(c => c.id === product.category_id)?.name}
                                                    </span>

                                                    <button
                                                        type="button"
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            e.stopPropagation();
                                                            toggleCompare(product.id);
                                                        }}
                                                        className={`absolute top-3 right-3 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border backdrop-blur-sm transition-colors ${
                                                            compareIds.includes(product.id)
                                                                ? "bg-primary text-primary-foreground border-primary"
                                                                : "bg-background/85 text-foreground border-border hover:border-primary/40"
                                                        }`}
                                                    >
                                                        {compareIds.includes(product.id) ? "Selected" : "Compare"}
                                                    </button>
                                                </div>

                                                {/* Content */}
                                                <div className="p-5">
                                                    <div className="flex items-start justify-between gap-2 mb-2">
                                                        <h3 className="font-display font-bold text-lg text-foreground leading-tight">
                                                            {product.name}
                                                        </h3>
                                                        <ChevronRight className="w-5 h-5 text-primary opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all duration-300 shrink-0 mt-0.5" />
                                                    </div>
                                                    {product.short_description && (
                                                        <p className="text-muted-foreground text-sm line-clamp-2 mb-3 leading-relaxed">
                                                            {product.short_description}
                                                        </p>
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
                                    );
                                })}
                            </AnimatePresence>
                        </div>

                        {/* ── Pagination ── */}
                        {totalPages > 1 && (
                            <nav className="flex items-center justify-center gap-1.5 mt-14" role="navigation" aria-label="Pagination">
                                <button
                                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                                    disabled={safeCurrentPage <= 1}
                                    className="px-3.5 py-2 rounded-lg text-sm font-medium border transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:bg-muted"
                                    aria-label="Previous page"
                                >
                                    Previous
                                </button>
                                {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
                                    <button
                                        key={num}
                                        onClick={() => setPage(num)}
                                        className={`w-10 h-10 rounded-lg text-sm font-semibold transition-all duration-200 ${
                                            safeCurrentPage === num
                                                ? "bg-primary text-primary-foreground shadow-sm"
                                                : "hover:bg-muted text-muted-foreground"
                                        }`}
                                        aria-label={`Page ${num}`}
                                        aria-current={safeCurrentPage === num ? "page" : undefined}
                                    >
                                        {num}
                                    </button>
                                ))}
                                <button
                                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                                    disabled={safeCurrentPage >= totalPages}
                                    className="px-3.5 py-2 rounded-lg text-sm font-medium border transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:bg-muted"
                                    aria-label="Next page"
                                >
                                    Next
                                </button>
                            </nav>
                        )}

                        {/* Results summary */}
                        {!hasActiveFilters && (
                            <p className="text-center text-xs text-muted-foreground mt-4">
                                Showing {(safeCurrentPage - 1) * ITEMS_PER_PAGE + 1}–{Math.min(safeCurrentPage * ITEMS_PER_PAGE, filtered.length)} of {filtered.length} vehicles
                            </p>
                        )}
                    </>
                )}
            </div>
        </section>

        {compareIds.length > 0 && (
            <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 w-[min(94vw,780px)] rounded-2xl border border-slate-200 bg-white/95 backdrop-blur-xl shadow-[0_14px_40px_rgba(10,27,55,0.18)] px-4 py-3">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div>
                        <p className="text-sm font-semibold text-slate-900">
                            {compareIds.length} vehicle{compareIds.length > 1 ? "s" : ""} selected for comparison
                        </p>
                        <p className="text-xs text-slate-500">Select up to 3 vehicles from the catalog.</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={() => setCompareIds([])}
                            className="px-3 py-2 text-xs font-semibold rounded-lg border hover:bg-muted transition-colors"
                        >
                            Clear
                        </button>
                        <Link
                            href={`/products/compare?ids=${encodeURIComponent(compareIds.join(","))}`}
                            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors ${
                                compareIds.length >= 2
                                    ? "bg-primary text-primary-foreground hover:bg-kama-blue-dark"
                                    : "bg-slate-200 text-slate-500 pointer-events-none"
                            }`}
                        >
                            Compare Now
                        </Link>
                    </div>
                </div>
            </div>
        )}
        </>
    );
}
