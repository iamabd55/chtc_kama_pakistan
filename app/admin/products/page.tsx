"use client";
import Image from 'next/image';
import { useEffect, useState, useRef } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { adminDb } from "@/lib/supabase/adminClient";
import { Plus, Search, Pencil, Trash2, Eye, ArrowUpDown, Upload, ImagePlus, X } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import type { Product, Category } from "@/lib/supabase/types";
import { getStorageUrl } from "@/lib/supabase/storage";
import Link from "next/link";

const brands = ["kama", "kinwin", "joylong", "chtc"] as const;

const PAGE_SIZE = 10;

const categoryBadgeStyles: Record<string, string> = {
    "ev truck": "bg-blue-500/15 text-blue-400/80 border-blue-400/20",
    bus: "bg-green-500/15 text-green-400/80 border-green-400/20",
    truck: "bg-amber-500/15 text-amber-400/80 border-amber-400/20",
};

const brandBadgeStyles: Record<string, string> = {
    kama: "bg-blue-500/15 text-blue-400/80 border-blue-400/20",
    kinwin: "bg-teal-500/15 text-teal-400/80 border-teal-400/20",
    joylong: "bg-purple-500/15 text-purple-400/80 border-purple-400/20",
    chtc: "bg-white/[0.06] text-white/60 border-white/[0.08]",
};

type SortKey = "name" | "slug" | "brand" | "category" | "status";

const serializeImages = (images?: string[]) => (images ?? []).join("\n");

const parseImages = (value: string): string[] =>
    value
        .split(/\r?\n|,/)
        .map((s) => s.trim())
        .filter(Boolean);

const serializeList = (items?: string[]) => (items ?? []).join("\n");

const parseList = (value: string): string[] =>
    value
        .split(/\r?\n/)
        .map((s) => s.trim())
        .filter(Boolean);

const serializeSpecs = (specs?: Record<string, string | number>) =>
    Object.entries(specs ?? {})
        .map(([key, val]) => `${key}: ${val}`)
        .join("\n");

const parseSpecs = (value: string): Record<string, string> => {
    const pairs = value
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter(Boolean)
        .map((line) => {
            const idx = line.indexOf(":");
            if (idx === -1) return null;
            const key = line.slice(0, idx).trim().replace(/\s+/g, "_").toLowerCase();
            const val = line.slice(idx + 1).trim();
            if (!key || !val) return null;
            return [key, val] as const;
        })
        .filter((entry): entry is readonly [string, string] => entry !== null);

    return Object.fromEntries(pairs);
};

const toSlug = (value: string): string =>
    value
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-");

const AdminProducts = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editingProduct, setEditingProduct] =
        useState<Partial<Product> | null>(null);
    const [saving, setSaving] = useState(false);
    const [filterBrand, setFilterBrand] = useState<string>("all");
    const [filterCategory, setFilterCategory] = useState<string>("all");
    const [filterStatus, setFilterStatus] = useState<string>("all");
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [sortBy, setSortBy] = useState<SortKey>("name");
    const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
    const [currentPage, setCurrentPage] = useState(1);

    // ── Upload state ──
    const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
    const [thumbnailPreview, setThumbnailPreview] = useState<string>("");
    const [extraFiles, setExtraFiles] = useState<File[]>([]);
    const [extraPreviews, setExtraPreviews] = useState<string[]>([]);
    const [uploading, setUploading] = useState(false);
    const thumbnailInputRef = useRef<HTMLInputElement>(null);
    const extraInputRef = useRef<HTMLInputElement>(null);

    const uploadFile = async (file: File, slug: string): Promise<string> => {
        const ext = file.name.split(".").pop() ?? "jpg";
        const path = `products/${slug}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
        const { error } = await adminDb.storage.from("images").upload(path, file, { upsert: true, contentType: file.type });
        if (error) throw new Error(error.message);
        return path;
    };

    const warnSize = (file: File) => {
        if (file.size > 400 * 1024)
            toast({ title: "Large file", description: `${file.name}: ${(file.size / 1024).toFixed(0)} KB — aim for under 300 KB for best performance.`, variant: "destructive" });
    };

    const fetchData = async () => {
        setLoading(true);
        const [p, c] = await Promise.all([
            adminDb
                .from("products")
                .select("*")
                .order("created_at", { ascending: false }),
            adminDb.from("categories").select("*").order("display_order"),
        ]);
        setProducts((p.data as Product[]) || []);
        setCategories((c.data as Category[]) || []);
        setLoading(false);
    };

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        setCurrentPage(1);
    }, [search, filterBrand, filterCategory, filterStatus]);

    const getCategoryName = (id: string) =>
        categories.find((c) => c.id === id)?.name || "—";

    const getCategorySlug = (id: string) =>
        categories.find((c) => c.id === id)?.slug || "";

    const availableCategoryNames = Array.from(
        new Set(categories.map((c) => c.name).filter(Boolean))
    );

    const filtered = products
        .filter((p) => {
            const normalizedSearch = search.trim().toLowerCase();
            const matchesSearch =
                !normalizedSearch ||
                p.name.toLowerCase().includes(normalizedSearch) ||
                p.slug.toLowerCase().includes(normalizedSearch);

            const matchesBrand = filterBrand === "all" || p.brand === filterBrand;
            const categoryName = getCategoryName(p.category_id);
            const matchesCategory =
                filterCategory === "all" || categoryName === filterCategory;
            const matchesStatus =
                filterStatus === "all" ||
                (filterStatus === "active" ? p.is_active : !p.is_active);

            return matchesSearch && matchesBrand && matchesCategory && matchesStatus;
        })
        .sort((a, b) => {
            const direction = sortDirection === "asc" ? 1 : -1;

            const statusA = a.is_active ? "active" : "inactive";
            const statusB = b.is_active ? "active" : "inactive";
            const categoryA = getCategoryName(a.category_id).toLowerCase();
            const categoryB = getCategoryName(b.category_id).toLowerCase();

            const valueA =
                sortBy === "name"
                    ? a.name.toLowerCase()
                    : sortBy === "slug"
                      ? a.slug.toLowerCase()
                      : sortBy === "brand"
                        ? a.brand.toLowerCase()
                        : sortBy === "category"
                          ? categoryA
                          : statusA;

            const valueB =
                sortBy === "name"
                    ? b.name.toLowerCase()
                    : sortBy === "slug"
                      ? b.slug.toLowerCase()
                      : sortBy === "brand"
                        ? b.brand.toLowerCase()
                        : sortBy === "category"
                          ? categoryB
                          : statusB;

            if (valueA < valueB) return -1 * direction;
            if (valueA > valueB) return 1 * direction;
            return 0;
        });

    const totalItems = filtered.length;
    const totalPages = Math.max(1, Math.ceil(totalItems / PAGE_SIZE));
    const safePage = Math.min(currentPage, totalPages);
    const startIndex = (safePage - 1) * PAGE_SIZE;
    const paginated = filtered.slice(startIndex, startIndex + PAGE_SIZE);

    const resetUpload = () => { setThumbnailFile(null); setThumbnailPreview(""); setExtraFiles([]); setExtraPreviews([]); };

    const openNew = () => {
        setEditingProduct({ brand: "kama", is_active: true, is_featured: false, images: [], features: [], specs: {} });
        resetUpload();
        setDialogOpen(true);
    };

    const openEdit = (p: Product) => {
        setEditingProduct({ ...p });
        resetUpload();
        setDialogOpen(true);
    };

    const handleSave = async () => {
        const hasThumb = !!editingProduct?.thumbnail || !!thumbnailFile;
        if (!editingProduct?.name || !editingProduct?.category_id || !hasThumb) {
            toast({ title: "Missing fields", description: "Name, category, and thumbnail are required.", variant: "destructive" });
            return;
        }
        setSaving(true); setUploading(true);
        const slug = toSlug(editingProduct.name);
        let thumbnailPath = editingProduct.thumbnail || "";
        let imagePaths = [...(editingProduct.images || [])];
        try {
            if (thumbnailFile) thumbnailPath = await uploadFile(thumbnailFile, slug);
            if (extraFiles.length > 0) {
                const up = await Promise.all(extraFiles.map((f) => uploadFile(f, slug)));
                imagePaths = [...imagePaths, ...up];
            }
        } catch (err) {
            toast({ title: "Upload failed", description: String(err), variant: "destructive" });
            setSaving(false); setUploading(false); return;
        }
        setUploading(false);
        const catName = categories.find((c) => c.id === editingProduct.category_id)?.name ?? "";
        const autoMeta = `${editingProduct.name} - ${catName} | Al Nasir Motors Pakistan`;
        const payload = {
            name: editingProduct.name,
            slug: editingProduct.id ? (editingProduct.slug || slug) : slug,
            brand: editingProduct.brand || "kama",
            category_id: editingProduct.category_id,
            short_description: editingProduct.short_description || null,
            model_year: editingProduct.model_year || null,
            thumbnail: thumbnailPath,
            images: imagePaths,
            specs: editingProduct.specs || {},
            features: editingProduct.features || [],
            brochure_url: editingProduct.brochure_url || null,
            price_range: null,
            is_featured: editingProduct.is_featured ?? false,
            is_active: editingProduct.is_active ?? true,
            meta_title: autoMeta,
            meta_desc: editingProduct.short_description || autoMeta,
        };
        if (editingProduct.id) {
            const { error } = await adminDb.from("products").update(payload).eq("id", editingProduct.id);
            if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
            else { toast({ title: "Product updated" }); resetUpload(); }
        } else {
            const { error } = await adminDb.from("products").insert(payload);
            if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
            else { toast({ title: "Product created" }); resetUpload(); }
        }
        setSaving(false); setDialogOpen(false); fetchData();
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this product?")) return;
        const { error } = await adminDb.from("products").delete().eq("id", id);
        if (error)
            toast({ title: "Error", description: error.message, variant: "destructive" });
        else {
            toast({ title: "Product deleted" });
            fetchData();
        }
    };

    const handleSort = (key: SortKey) => {
        if (sortBy === key) {
            setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
            return;
        }
        setSortBy(key);
        setSortDirection("asc");
    };

    const selectedInPage = paginated
        .map((product) => product.id)
        .filter((id) => selectedIds.includes(id));

    const allVisibleSelected =
        paginated.length > 0 && selectedInPage.length === paginated.length;

    const toggleSelectAllVisible = (checked: boolean) => {
        if (checked) {
            const merged = Array.from(new Set([...selectedIds, ...paginated.map((p) => p.id)]));
            setSelectedIds(merged);
            return;
        }
        setSelectedIds((prev) => prev.filter((id) => !paginated.some((p) => p.id === id)));
    };

    const toggleSelectOne = (id: string, checked: boolean) => {
        if (checked) {
            setSelectedIds((prev) => Array.from(new Set([...prev, id])));
            return;
        }
        setSelectedIds((prev) => prev.filter((value) => value !== id));
    };

    const toggleStatus = async (product: Product, checked: boolean) => {
        const { error } = await adminDb
            .from("products")
            .update({ is_active: checked, updated_at: new Date().toISOString() })
            .eq("id", product.id);

        if (error) {
            toast({ title: "Error", description: error.message, variant: "destructive" });
            return;
        }

        setProducts((prev) =>
            prev.map((item) =>
                item.id === product.id ? { ...item, is_active: checked } : item
            )
        );
    };

    const bulkDelete = async () => {
        if (selectedIds.length === 0) return;
        if (!confirm(`Delete ${selectedIds.length} selected product(s)?`)) return;

        const { error } = await adminDb.from("products").delete().in("id", selectedIds);
        if (error) {
            toast({ title: "Error", description: error.message, variant: "destructive" });
            return;
        }

        toast({ title: "Selected products deleted" });
        setSelectedIds([]);
        fetchData();
    };

    const bulkStatusUpdate = async (nextStatus: boolean) => {
        if (selectedIds.length === 0) return;

        const { error } = await adminDb
            .from("products")
            .update({ is_active: nextStatus, updated_at: new Date().toISOString() })
            .in("id", selectedIds);

        if (error) {
            toast({ title: "Error", description: error.message, variant: "destructive" });
            return;
        }

        toast({ title: `Selected products marked as ${nextStatus ? "active" : "inactive"}` });
        setSelectedIds([]);
        fetchData();
    };

    return (
        <AdminLayout
            title={
                <div className="flex items-center gap-3">
                    <span>Products</span>
                    <span className="inline-flex items-center rounded-full border border-white/[0.06] bg-white/[0.04] px-2.5 py-0.5 text-sm font-medium text-white/50">
                        {products.length}
                    </span>
                </div>
            }
            actions={
                <div className="flex items-center gap-3 w-full md:w-auto">
                    <div className="relative w-full md:w-[340px]">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                        <Input
                            placeholder="Search products by name..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                    <Button onClick={openNew} className="font-semibold bg-[#e07a2f] hover:bg-[#c96a25]">
                        <Plus className="w-4 h-4 mr-2" /> Add Product
                    </Button>
                </div>
            }
            hideHeaderMeta
            minimalChrome
            useContentCard={false}
        >
            <div className="space-y-4">
                <div className="rounded-xl border border-white/[0.06] bg-[#1e2230] px-4 py-3">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
                        <div className="text-sm text-white/40">
                            Showing {totalItems === 0 ? 0 : startIndex + 1}
                            –{Math.min(startIndex + PAGE_SIZE, totalItems)} of {totalItems} products
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                            <select
                                className="h-9 rounded-md border border-white/[0.06] bg-[#171b26] px-3 text-sm text-white/85"
                                value={filterBrand}
                                onChange={(e) => setFilterBrand(e.target.value)}
                            >
                                <option value="all">All Brands</option>
                                {brands.map((brand) => (
                                    <option key={brand} value={brand}>
                                        {brand.toUpperCase()}
                                    </option>
                                ))}
                            </select>
                            <select
                                className="h-9 rounded-md border border-white/[0.06] bg-[#171b26] px-3 text-sm text-white/85"
                                value={filterCategory}
                                onChange={(e) => setFilterCategory(e.target.value)}
                            >
                                <option value="all">All Categories</option>
                                {availableCategoryNames.map((name) => (
                                    <option key={name} value={name}>
                                        {name}
                                    </option>
                                ))}
                            </select>
                            <select
                                className="h-9 rounded-md border border-white/[0.06] bg-[#171b26] px-3 text-sm text-white/85"
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                            >
                                <option value="all">All Status</option>
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                            </select>
                        </div>
                    </div>
                </div>

                {selectedIds.length > 0 && (
                    <div className="rounded-xl border border-[#e07a2f]/20 bg-[#e07a2f]/10 px-4 py-3 flex flex-wrap items-center justify-between gap-3">
                        <p className="text-sm font-medium text-[#e07a2f]">
                            {selectedIds.length} product(s) selected
                        </p>
                        <div className="flex items-center gap-2">
                            <Button size="sm" variant="outline" onClick={() => bulkStatusUpdate(true)}>
                                Change status: Active
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => bulkStatusUpdate(false)}>
                                Change status: Inactive
                            </Button>
                            <Button size="sm" variant="destructive" onClick={bulkDelete}>
                                Delete selected
                            </Button>
                        </div>
                    </div>
                )}

                <div className="rounded-xl border border-white/[0.06] bg-[#1e2230] overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[980px]">
                            <thead className="bg-[#171b26] border-b border-white/[0.06]">
                                <tr>
                                    <th className="px-4 py-3 text-left">
                                        <Checkbox
                                            checked={allVisibleSelected}
                                            onCheckedChange={(checked) =>
                                                toggleSelectAllVisible(Boolean(checked))
                                            }
                                        />
                                    </th>
                                    <th className="px-4 py-3 text-left text-sm font-medium text-white/40">Image</th>
                                    <th className="px-4 py-3 text-left text-sm font-medium text-white/40">
                                        <button
                                            className="inline-flex items-center gap-1"
                                            onClick={() => handleSort("name")}
                                        >
                                            Product Name
                                            <ArrowUpDown className="w-4 h-4" />
                                        </button>
                                    </th>
                                    <th className="px-4 py-3 text-left text-sm font-medium text-white/40">
                                        <button
                                            className="inline-flex items-center gap-1"
                                            onClick={() => handleSort("slug")}
                                        >
                                            Slug
                                            <ArrowUpDown className="w-4 h-4" />
                                        </button>
                                    </th>
                                    <th className="px-4 py-3 text-left text-sm font-medium text-white/40">
                                        <button
                                            className="inline-flex items-center gap-1"
                                            onClick={() => handleSort("brand")}
                                        >
                                            Brand
                                            <ArrowUpDown className="w-4 h-4" />
                                        </button>
                                    </th>
                                    <th className="px-4 py-3 text-left text-sm font-medium text-white/40">
                                        <button
                                            className="inline-flex items-center gap-1"
                                            onClick={() => handleSort("category")}
                                        >
                                            Category
                                            <ArrowUpDown className="w-4 h-4" />
                                        </button>
                                    </th>
                                    <th className="px-4 py-3 text-left text-sm font-medium text-white/40">
                                        <button
                                            className="inline-flex items-center gap-1"
                                            onClick={() => handleSort("status")}
                                        >
                                            Status
                                            <ArrowUpDown className="w-4 h-4" />
                                        </button>
                                    </th>
                                    <th className="px-4 py-3 text-left text-sm font-medium text-white/40">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr>
                                        <td colSpan={8} className="px-4 py-12 text-center text-white/40">
                                            Loading products...
                                        </td>
                                    </tr>
                                ) : paginated.length === 0 ? (
                                    <tr>
                                        <td colSpan={8} className="px-4 py-12 text-center text-white/40">
                                            No products found
                                        </td>
                                    </tr>
                                ) : (
                                    paginated.map((row, index) => {
                                        const categoryName = getCategoryName(row.category_id);
                                        const categoryKey = categoryName.toLowerCase();
                                        const categoryClass =
                                            categoryBadgeStyles[categoryKey] ||
                                            "bg-white/[0.06] text-white/60 border-white/[0.08]";
                                        const brandClass =
                                            brandBadgeStyles[row.brand] ||
                                            "bg-white/[0.06] text-white/60 border-white/[0.08]";
                                        const categorySlug = getCategorySlug(row.category_id);
                                        const viewHref = categorySlug
                                            ? `/products/${categorySlug}/${row.slug}`
                                            : null;

                                        return (
                                            <tr
                                                key={row.id}
                                                className={`border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors ${
                                                    index % 2 === 0 ? "bg-transparent" : "bg-white/[0.01]"
                                                }`}
                                            >
                                                <td className="px-4 py-3">
                                                    <Checkbox
                                                        checked={selectedIds.includes(row.id)}
                                                        onCheckedChange={(checked) =>
                                                            toggleSelectOne(row.id, Boolean(checked))
                                                        }
                                                    />
                                                </td>
                                                <td className="px-4 py-3">
                                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                                    <Image
                                                        src={getStorageUrl(row.thumbnail)}
                                                        alt={row.name}
                                                        className="w-12 h-12 rounded-md object-cover bg-white/[0.04] border border-white/[0.06]"
                                                     width={800} height={600}  loading="lazy" />
                                                </td>
                                                <td className="px-4 py-3 text-sm font-semibold text-white/85">{row.name}</td>
                                                <td className="px-4 py-3 text-sm text-white/40">{row.slug}</td>
                                                <td className="px-4 py-3">
                                                    <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold uppercase tracking-wide ${brandClass}`}>
                                                        {row.brand}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${categoryClass}`}>
                                                        {categoryName}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <div className="flex items-center gap-2">
                                                        <Switch
                                                            checked={row.is_active}
                                                            onCheckedChange={(checked) =>
                                                                void toggleStatus(row, checked)
                                                            }
                                                        />
                                                        <span className="text-xs font-medium text-white/40">
                                                            {row.is_active ? "Active" : "Inactive"}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <div className="flex items-center gap-1">
                                                        <Button
                                                            size="icon"
                                                            variant="ghost"
                                                            onClick={() => openEdit(row)}
                                                        >
                                                            <Pencil className="w-4 h-4" />
                                                        </Button>
                                                        {viewHref ? (
                                                            <Button size="icon" variant="ghost" asChild>
                                                                <Link href={viewHref} target="_blank" prefetch={false}>
                                                                    <Eye className="w-4 h-4" />
                                                                </Link>
                                                            </Button>
                                                        ) : (
                                                            <Button size="icon" variant="ghost" disabled>
                                                                <Eye className="w-4 h-4" />
                                                            </Button>
                                                        )}
                                                        <Button
                                                            size="icon"
                                                            variant="ghost"
                                                            className="text-rose-600 hover:text-rose-700"
                                                            onClick={() => handleDelete(row.id)}
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div className="flex items-center justify-between px-4 py-3 border-t border-white/[0.06] bg-[#1e2230]">
                        <Button
                            size="sm"
                            variant="outline"
                            disabled={safePage <= 1}
                            onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                        >
                            Previous
                        </Button>
                        <div className="flex items-center gap-1">
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                <Button
                                    key={page}
                                    size="sm"
                                    variant={safePage === page ? "default" : "outline"}
                                    className={safePage === page ? "bg-[#e07a2f] hover:bg-[#c96a25]" : ""}
                                    onClick={() => setCurrentPage(page)}
                                >
                                    {page}
                                </Button>
                            ))}
                        </div>
                        <Button
                            size="sm"
                            variant="outline"
                            disabled={safePage >= totalPages}
                            onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                        >
                            Next
                        </Button>
                    </div>
                </div>
            </div>

            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="font-display text-xl">
                            {editingProduct?.id ? "Edit Product" : "Add Product"}
                        </DialogTitle>
                    </DialogHeader>
                    {editingProduct && (
                        <div className="grid grid-cols-2 gap-4 mt-4">

                            {/* Name */}
                            <div className="col-span-2">
                                <label className="text-sm font-medium mb-1 block">Product Name *</label>
                                <Input placeholder="e.g. GM3 Series" value={editingProduct.name || ""} onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })} />
                            </div>

                            {/* Brand */}
                            <div>
                                <label className="text-sm font-medium mb-1 block">Brand *</label>
                                <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={editingProduct.brand || "kama"} onChange={(e) => setEditingProduct({ ...editingProduct, brand: e.target.value as Product["brand"] })}>
                                    {brands.map((b) => <option key={b} value={b}>{b.toUpperCase()}</option>)}
                                </select>
                            </div>

                            {/* Category */}
                            <div>
                                <label className="text-sm font-medium mb-1 block">Category *</label>
                                <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={editingProduct.category_id || ""} onChange={(e) => setEditingProduct({ ...editingProduct, category_id: e.target.value })}>
                                    <option value="">Select category</option>
                                    {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                                </select>
                            </div>

                            {/* Model Year + Flags */}
                            <div>
                                <label className="text-sm font-medium mb-1 block">Model Year</label>
                                <Input type="number" placeholder={String(new Date().getFullYear())} value={editingProduct.model_year || ""} onChange={(e) => setEditingProduct({ ...editingProduct, model_year: parseInt(e.target.value) || null })} />
                            </div>
                            <div className="flex items-end gap-6 pb-1">
                                <label className="flex items-center gap-2 text-sm cursor-pointer">
                                    <input type="checkbox" checked={editingProduct.is_active ?? true} onChange={(e) => setEditingProduct({ ...editingProduct, is_active: e.target.checked })} />
                                    Active
                                </label>
                                <label className="flex items-center gap-2 text-sm cursor-pointer">
                                    <input type="checkbox" checked={editingProduct.is_featured ?? false} onChange={(e) => setEditingProduct({ ...editingProduct, is_featured: e.target.checked })} />
                                    Featured
                                </label>
                            </div>

                            {/* Thumbnail upload */}
                            <div className="col-span-2">
                                <label className="text-sm font-medium mb-1 block">Thumbnail Image *</label>
                                <p className="text-xs text-white/40 mb-2">Main product image displayed in listings. Keep under 300 KB for best performance.</p>
                                <div
                                    className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-colors ${thumbnailPreview || editingProduct.thumbnail ? "border-[#e07a2f]/40 bg-[#e07a2f]/5" : "border-white/[0.1] hover:border-[#e07a2f]/50 bg-[#171b26]"}`}
                                    onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
                                    onDrop={(e) => {
                                        e.preventDefault();
                                        const file = e.dataTransfer.files[0];
                                        if (!file || !file.type.startsWith("image/")) return;
                                        warnSize(file);
                                        setThumbnailFile(file);
                                        setThumbnailPreview(URL.createObjectURL(file));
                                    }}
                                    onClick={() => thumbnailInputRef.current?.click()}
                                >
                                    {thumbnailPreview ? (
                                        <img src={thumbnailPreview} alt="preview" className="mx-auto max-h-44 rounded-lg object-contain" />
                                    ) : editingProduct.thumbnail ? (
                                        <img src={getStorageUrl(editingProduct.thumbnail)} alt="current" className="mx-auto max-h-44 rounded-lg object-contain" />
                                    ) : (
                                        <div className="py-8 flex flex-col items-center gap-2 text-white/30">
                                            <Upload className="w-9 h-9" />
                                            <p className="text-sm font-medium text-white/40">Drag & drop or click to browse</p>
                                            <p className="text-xs">JPG, PNG, WebP · Aim for under 300 KB</p>
                                        </div>
                                    )}
                                    <input ref={thumbnailInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (!file) return;
                                        warnSize(file);
                                        setThumbnailFile(file);
                                        setThumbnailPreview(URL.createObjectURL(file));
                                    }} />
                                </div>
                                {(thumbnailPreview || editingProduct.thumbnail) && (
                                    <button className="mt-1 text-xs text-rose-500 hover:underline" type="button" onClick={() => { setThumbnailFile(null); setThumbnailPreview(""); setEditingProduct({ ...editingProduct, thumbnail: "" }); }}>
                                        Remove thumbnail
                                    </button>
                                )}
                            </div>

                            {/* Gallery images upload */}
                            <div className="col-span-2">
                                <label className="text-sm font-medium mb-1 block">Gallery Images <span className="font-normal text-white/40">(optional)</span></label>
                                <p className="text-xs text-white/40 mb-2">Additional photos. Keep each under 300 KB.</p>
                                <div
                                    className="border-2 border-dashed border-white/[0.1] hover:border-[#e07a2f]/50 rounded-xl p-4 text-center cursor-pointer transition-colors bg-[#171b26]"
                                    onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
                                    onDrop={(e) => {
                                        e.preventDefault();
                                        const files = Array.from(e.dataTransfer.files).filter((f) => f.type.startsWith("image/"));
                                        files.forEach(warnSize);
                                        setExtraFiles((prev) => [...prev, ...files]);
                                        setExtraPreviews((prev) => [...prev, ...files.map((f) => URL.createObjectURL(f))]);
                                    }}
                                    onClick={() => extraInputRef.current?.click()}
                                >
                                    <div className="py-4 flex flex-col items-center gap-1 text-white/30">
                                        <ImagePlus className="w-7 h-7" />
                                        <p className="text-sm font-medium text-white/40">Drag & drop or click to add images</p>
                                    </div>
                                    <input ref={extraInputRef} type="file" accept="image/*" multiple className="hidden" onChange={(e) => {
                                        const files = Array.from(e.target.files ?? []);
                                        files.forEach(warnSize);
                                        setExtraFiles((prev) => [...prev, ...files]);
                                        setExtraPreviews((prev) => [...prev, ...files.map((f) => URL.createObjectURL(f))]);
                                    }} />
                                </div>
                                {extraPreviews.length > 0 && (
                                    <div className="mt-2 grid grid-cols-4 gap-2">
                                        {extraPreviews.map((src, i) => (
                                            <div key={i} className="relative group">
                                                <img src={src} alt="" className="w-full h-20 object-cover rounded-md border" />
                                                <button type="button" className="absolute top-1 right-1 bg-black/70 rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity" onClick={(e) => { e.stopPropagation(); setExtraFiles((p) => p.filter((_, fi) => fi !== i)); setExtraPreviews((p) => p.filter((_, pi) => pi !== i)); }}>
                                                    <X className="w-3 h-3 text-rose-600" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                                {(editingProduct.images ?? []).length > 0 && (
                                    <div className="mt-3">
                                        <p className="text-xs text-white/40 mb-1">Saved images:</p>
                                        <div className="grid grid-cols-4 gap-2">
                                            {editingProduct.images!.map((src, i) => (
                                                <div key={i} className="relative group">
                                                    <img src={getStorageUrl(src)} alt="" className="w-full h-20 object-cover rounded-md border" />
                                                    <button type="button" className="absolute top-1 right-1 bg-black/70 rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity" onClick={(e) => { e.stopPropagation(); setEditingProduct({ ...editingProduct, images: editingProduct.images!.filter((_, ii) => ii !== i) }); }}>
                                                        <X className="w-3 h-3 text-rose-600" />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Short Description */}
                            <div className="col-span-2">
                                <label className="text-sm font-medium mb-1 block">Short Description</label>
                                <textarea className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm min-h-[80px]" placeholder="Brief overview shown on the product listing page..." value={editingProduct.short_description || ""} onChange={(e) => setEditingProduct({ ...editingProduct, short_description: e.target.value })} />
                            </div>

                            {/* Features */}
                            <div className="col-span-2">
                                <label className="text-sm font-medium mb-1 block">Key Features</label>
                                <p className="text-xs text-white/40 mb-1">One feature per line — each becomes a bullet point on the product page.</p>
                                <textarea className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm min-h-[110px]" value={serializeList(editingProduct.features)} onChange={(e) => setEditingProduct({ ...editingProduct, features: parseList(e.target.value) })} placeholder={"High torque Euro III engine\n49 passenger seats with reclining\nWABCO ABS+ASR brake system"} />
                            </div>

                            {/* Specs */}
                            <div className="col-span-2">
                                <label className="text-sm font-medium mb-1 block">Specifications</label>
                                <p className="text-xs text-white/30 mb-1">Format: <code className="bg-white/[0.06] px-1 rounded text-[11px]">Label: Value</code> — one per line. Displayed in the specifications table.</p>
                                <textarea className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm min-h-[130px] font-mono text-xs" value={serializeSpecs(editingProduct.specs as Record<string, string | number>)} onChange={(e) => setEditingProduct({ ...editingProduct, specs: parseSpecs(e.target.value) })} placeholder={"Engine: 375 HP YUCHAI Euro III\nSeating Capacity: 49\nFuel Tank: 600 L\nTransmission: 6-speed manual"} />
                            </div>

                            {/* Brochure */}
                            <div className="col-span-2">
                                <label className="text-sm font-medium mb-1 block">Brochure URL <span className="font-normal text-white/40">(optional)</span></label>
                                <Input value={editingProduct.brochure_url || ""} placeholder="https://..." onChange={(e) => setEditingProduct({ ...editingProduct, brochure_url: e.target.value })} />
                            </div>

                            {/* Actions */}
                            <div className="col-span-2 flex justify-end gap-3 pt-4 border-t border-white/[0.06]">
                                <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
                                <Button onClick={handleSave} disabled={saving || uploading} className="font-display font-semibold bg-[#e07a2f] hover:bg-[#c96a25]">
                                    {uploading ? "Uploading..." : saving ? "Saving..." : editingProduct.id ? "Update Product" : "Create Product"}
                                </Button>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </AdminLayout>
    );
};

export default AdminProducts;
