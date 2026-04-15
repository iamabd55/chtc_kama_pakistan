"use client";
import Image from 'next/image';
import { useEffect, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { adminDb } from "@/lib/supabase/adminClient";
import { Plus, Search, Pencil, Trash2, Eye, ArrowUpDown } from "lucide-react";
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
    "ev truck": "bg-blue-50 text-blue-700 border-blue-200",
    bus: "bg-green-50 text-green-700 border-green-200",
    truck: "bg-amber-50 text-amber-700 border-amber-200",
};

const brandBadgeStyles: Record<string, string> = {
    kama: "bg-blue-50 text-blue-700 border-blue-200",
    kinwin: "bg-teal-50 text-teal-700 border-teal-200",
    joylong: "bg-purple-50 text-purple-700 border-purple-200",
    chtc: "bg-slate-100 text-slate-700 border-slate-200",
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

    const openNew = () => {
        setEditingProduct({
            brand: "kama",
            is_active: true,
            is_featured: false,
            images: [],
            features: [],
            specs: {},
        });
        setDialogOpen(true);
    };

    const openEdit = (p: Product) => {
        setEditingProduct({ ...p });
        setDialogOpen(true);
    };

    const handleSave = async () => {
        if (
            !editingProduct?.name ||
            !editingProduct?.slug ||
            !editingProduct?.category_id ||
            !editingProduct?.thumbnail
        ) {
            toast({
                title: "Missing fields",
                description: "Name, slug, category, and thumbnail are required.",
                variant: "destructive",
            });
            return;
        }
        setSaving(true);

        const payload = {
            name: editingProduct.name,
            slug: editingProduct.slug,
            brand: editingProduct.brand || "kama",
            category_id: editingProduct.category_id,
            short_description: editingProduct.short_description || null,
            model_year: editingProduct.model_year || null,
            thumbnail: editingProduct.thumbnail,
            images: editingProduct.images || [],
            specs: editingProduct.specs || {},
            features: editingProduct.features || [],
            brochure_url: editingProduct.brochure_url || null,
            price_range: editingProduct.price_range || null,
            is_featured: editingProduct.is_featured ?? false,
            is_active: editingProduct.is_active ?? true,
            meta_title: editingProduct.meta_title || null,
            meta_desc: editingProduct.meta_desc || null,
        };

        if (editingProduct.id) {
            const { error } = await adminDb
                .from("products")
                .update(payload)
                .eq("id", editingProduct.id);
            if (error)
                toast({ title: "Error", description: error.message, variant: "destructive" });
            else toast({ title: "Product updated" });
        } else {
            const { error } = await adminDb.from("products").insert(payload);
            if (error)
                toast({ title: "Error", description: error.message, variant: "destructive" });
            else toast({ title: "Product created" });
        }

        setSaving(false);
        setDialogOpen(false);
        fetchData();
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
                    <span className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-2.5 py-0.5 text-sm font-medium text-slate-600">
                        {products.length}
                    </span>
                </div>
            }
            actions={
                <div className="flex items-center gap-3 w-full md:w-auto">
                    <div className="relative w-full md:w-[340px]">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                            placeholder="Search products by name..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                    <Button onClick={openNew} className="font-semibold bg-[#1E3A8A] hover:bg-[#1b347c]">
                        <Plus className="w-4 h-4 mr-2" /> Add Product
                    </Button>
                </div>
            }
            hideHeaderMeta
            minimalChrome
            useContentCard={false}
        >
            <div className="space-y-4">
                <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
                        <div className="text-sm text-slate-600">
                            Showing {totalItems === 0 ? 0 : startIndex + 1}
                            –{Math.min(startIndex + PAGE_SIZE, totalItems)} of {totalItems} products
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                            <select
                                className="h-9 rounded-md border border-slate-300 bg-white px-3 text-sm"
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
                                className="h-9 rounded-md border border-slate-300 bg-white px-3 text-sm"
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
                                className="h-9 rounded-md border border-slate-300 bg-white px-3 text-sm"
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
                    <div className="rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 flex flex-wrap items-center justify-between gap-3">
                        <p className="text-sm font-medium text-blue-800">
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

                <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[980px]">
                            <thead className="bg-[#F8F9FA] border-b border-slate-200">
                                <tr>
                                    <th className="px-4 py-3 text-left">
                                        <Checkbox
                                            checked={allVisibleSelected}
                                            onCheckedChange={(checked) =>
                                                toggleSelectAllVisible(Boolean(checked))
                                            }
                                        />
                                    </th>
                                    <th className="px-4 py-3 text-left text-sm font-medium text-slate-600">Image</th>
                                    <th className="px-4 py-3 text-left text-sm font-medium text-slate-600">
                                        <button
                                            className="inline-flex items-center gap-1"
                                            onClick={() => handleSort("name")}
                                        >
                                            Product Name
                                            <ArrowUpDown className="w-4 h-4" />
                                        </button>
                                    </th>
                                    <th className="px-4 py-3 text-left text-sm font-medium text-slate-600">
                                        <button
                                            className="inline-flex items-center gap-1"
                                            onClick={() => handleSort("slug")}
                                        >
                                            Slug
                                            <ArrowUpDown className="w-4 h-4" />
                                        </button>
                                    </th>
                                    <th className="px-4 py-3 text-left text-sm font-medium text-slate-600">
                                        <button
                                            className="inline-flex items-center gap-1"
                                            onClick={() => handleSort("brand")}
                                        >
                                            Brand
                                            <ArrowUpDown className="w-4 h-4" />
                                        </button>
                                    </th>
                                    <th className="px-4 py-3 text-left text-sm font-medium text-slate-600">
                                        <button
                                            className="inline-flex items-center gap-1"
                                            onClick={() => handleSort("category")}
                                        >
                                            Category
                                            <ArrowUpDown className="w-4 h-4" />
                                        </button>
                                    </th>
                                    <th className="px-4 py-3 text-left text-sm font-medium text-slate-600">
                                        <button
                                            className="inline-flex items-center gap-1"
                                            onClick={() => handleSort("status")}
                                        >
                                            Status
                                            <ArrowUpDown className="w-4 h-4" />
                                        </button>
                                    </th>
                                    <th className="px-4 py-3 text-left text-sm font-medium text-slate-600">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr>
                                        <td colSpan={8} className="px-4 py-12 text-center text-slate-500">
                                            Loading products...
                                        </td>
                                    </tr>
                                ) : paginated.length === 0 ? (
                                    <tr>
                                        <td colSpan={8} className="px-4 py-12 text-center text-slate-500">
                                            No products found
                                        </td>
                                    </tr>
                                ) : (
                                    paginated.map((row, index) => {
                                        const categoryName = getCategoryName(row.category_id);
                                        const categoryKey = categoryName.toLowerCase();
                                        const categoryClass =
                                            categoryBadgeStyles[categoryKey] ||
                                            "bg-slate-100 text-slate-700 border-slate-200";
                                        const brandClass =
                                            brandBadgeStyles[row.brand] ||
                                            "bg-slate-100 text-slate-700 border-slate-200";
                                        const categorySlug = getCategorySlug(row.category_id);
                                        const viewHref = categorySlug
                                            ? `/products/${categorySlug}/${row.slug}`
                                            : null;

                                        return (
                                            <tr
                                                key={row.id}
                                                className={`border-b border-slate-100 hover:bg-slate-50 transition-colors ${
                                                    index % 2 === 0 ? "bg-white" : "bg-slate-50/40"
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
                                                        className="w-12 h-12 rounded-md object-cover bg-slate-100 border"
                                                     width={800} height={600}  loading="lazy" />
                                                </td>
                                                <td className="px-4 py-3 text-sm font-semibold text-slate-900">{row.name}</td>
                                                <td className="px-4 py-3 text-sm text-slate-600">{row.slug}</td>
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
                                                        <span className="text-xs font-medium text-slate-600">
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

                    <div className="flex items-center justify-between px-4 py-3 border-t border-slate-200 bg-white">
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
                                    className={safePage === page ? "bg-[#1E3A8A] hover:bg-[#1b347c]" : ""}
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
                            <div className="col-span-2">
                                <label className="text-sm font-medium mb-1 block">Name *</label>
                                <Input
                                    value={editingProduct.name || ""}
                                    onChange={(e) => {
                                        const name = e.target.value;
                                        const previousAutoSlug = toSlug(editingProduct.name || "");
                                        const shouldAutoSlug =
                                            !editingProduct.id &&
                                            (!editingProduct.slug || editingProduct.slug === previousAutoSlug);
                                        setEditingProduct({
                                            ...editingProduct,
                                            name,
                                            slug: shouldAutoSlug ? toSlug(name) : editingProduct.slug,
                                        });
                                    }}
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium mb-1 block">Slug *</label>
                                <Input
                                    value={editingProduct.slug || ""}
                                    onChange={(e) =>
                                        setEditingProduct({ ...editingProduct, slug: e.target.value })
                                    }
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium mb-1 block">Brand *</label>
                                <select
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                    value={editingProduct.brand || "kama"}
                                    onChange={(e) =>
                                        setEditingProduct({
                                            ...editingProduct,
                                            brand: e.target.value as Product["brand"],
                                        })
                                    }
                                >
                                    {brands.map((b) => (
                                        <option key={b} value={b}>
                                            {b.toUpperCase()}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="text-sm font-medium mb-1 block">
                                    Category *
                                </label>
                                <select
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                    value={editingProduct.category_id || ""}
                                    onChange={(e) =>
                                        setEditingProduct({
                                            ...editingProduct,
                                            category_id: e.target.value,
                                        })
                                    }
                                >
                                    <option value="">Select category</option>
                                    {categories.map((c) => (
                                        <option key={c.id} value={c.id}>
                                            {c.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="text-sm font-medium mb-1 block">
                                    Model Year
                                </label>
                                <Input
                                    type="number"
                                    value={editingProduct.model_year || ""}
                                    onChange={(e) =>
                                        setEditingProduct({
                                            ...editingProduct,
                                            model_year: parseInt(e.target.value) || null,
                                        })
                                    }
                                />
                            </div>
                            <div className="col-span-2">
                                <label className="text-sm font-medium mb-1 block">
                                    Thumbnail URL *
                                </label>
                                <Input
                                    value={editingProduct.thumbnail || ""}
                                    onChange={(e) =>
                                        setEditingProduct({
                                            ...editingProduct,
                                            thumbnail: e.target.value,
                                        })
                                    }
                                />
                            </div>
                            <div className="col-span-2">
                                <label className="text-sm font-medium mb-1 block">
                                    Extra Images (one path per line)
                                </label>
                                <textarea
                                    className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm min-h-[100px]"
                                    value={serializeImages(editingProduct.images)}
                                    onChange={(e) =>
                                        setEditingProduct({
                                            ...editingProduct,
                                            images: parseImages(e.target.value),
                                        })
                                    }
                                    placeholder={"products/kinwin/labor-bus-9m/interior.png\nproducts/kinwin/labor-bus-9m/exterior-front.png"}
                                />
                            </div>
                            <div className="col-span-2">
                                <label className="text-sm font-medium mb-1 block">
                                    Short Description
                                </label>
                                <textarea
                                    className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm min-h-[80px]"
                                    value={editingProduct.short_description || ""}
                                    onChange={(e) =>
                                        setEditingProduct({
                                            ...editingProduct,
                                            short_description: e.target.value,
                                        })
                                    }
                                />
                            </div>
                            <div className="col-span-2">
                                <label className="text-sm font-medium mb-1 block">
                                    Features (one per line)
                                </label>
                                <textarea
                                    className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm min-h-[110px]"
                                    value={serializeList(editingProduct.features)}
                                    onChange={(e) =>
                                        setEditingProduct({
                                            ...editingProduct,
                                            features: parseList(e.target.value),
                                        })
                                    }
                                    placeholder={"High torque engine\nLow maintenance cost\nComfortable cabin"}
                                />
                            </div>
                            <div className="col-span-2">
                                <label className="text-sm font-medium mb-1 block">
                                    Specifications (format: key: value)
                                </label>
                                <textarea
                                    className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm min-h-[130px] font-mono"
                                    value={serializeSpecs(editingProduct.specs as Record<string, string | number>)}
                                    onChange={(e) =>
                                        setEditingProduct({
                                            ...editingProduct,
                                            specs: parseSpecs(e.target.value),
                                        })
                                    }
                                    placeholder={"engine_power: 120 HP\npayload: 5 Ton\ntransmission: Manual"}
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium mb-1 block">
                                    Price Range
                                </label>
                                <Input
                                    value={editingProduct.price_range || ""}
                                    onChange={(e) =>
                                        setEditingProduct({
                                            ...editingProduct,
                                            price_range: e.target.value,
                                        })
                                    }
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium mb-1 block">
                                    Brochure URL
                                </label>
                                <Input
                                    value={editingProduct.brochure_url || ""}
                                    onChange={(e) =>
                                        setEditingProduct({
                                            ...editingProduct,
                                            brochure_url: e.target.value,
                                        })
                                    }
                                />
                            </div>
                            <div className="col-span-2">
                                <label className="text-sm font-medium mb-1 block">
                                    Meta Title
                                </label>
                                <Input
                                    value={editingProduct.meta_title || ""}
                                    onChange={(e) =>
                                        setEditingProduct({
                                            ...editingProduct,
                                            meta_title: e.target.value,
                                        })
                                    }
                                />
                            </div>
                            <div className="col-span-2">
                                <label className="text-sm font-medium mb-1 block">
                                    Meta Description
                                </label>
                                <textarea
                                    className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm min-h-[80px]"
                                    value={editingProduct.meta_desc || ""}
                                    onChange={(e) =>
                                        setEditingProduct({
                                            ...editingProduct,
                                            meta_desc: e.target.value,
                                        })
                                    }
                                />
                            </div>
                            <div className="col-span-2 flex items-center gap-6">
                                <label className="flex items-center gap-2 text-sm">
                                    <input
                                        type="checkbox"
                                        checked={editingProduct.is_active ?? true}
                                        onChange={(e) =>
                                            setEditingProduct({
                                                ...editingProduct,
                                                is_active: e.target.checked,
                                            })
                                        }
                                    />
                                    Active
                                </label>
                                <label className="flex items-center gap-2 text-sm">
                                    <input
                                        type="checkbox"
                                        checked={editingProduct.is_featured ?? false}
                                        onChange={(e) =>
                                            setEditingProduct({
                                                ...editingProduct,
                                                is_featured: e.target.checked,
                                            })
                                        }
                                    />
                                    Featured
                                </label>
                            </div>
                            <div className="col-span-2 flex justify-end gap-3 pt-4 border-t">
                                <Button
                                    variant="outline"
                                    onClick={() => setDialogOpen(false)}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    onClick={handleSave}
                                    disabled={saving}
                                    className="font-display font-semibold"
                                >
                                    {saving
                                        ? "Saving..."
                                        : editingProduct.id
                                            ? "Update"
                                            : "Create"}
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
