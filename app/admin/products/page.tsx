"use client";

import { useEffect, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import DataTable from "@/components/admin/DataTable";
import StatusBadge from "@/components/admin/StatusBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { adminDb } from "@/lib/supabase/adminClient";
import { Plus, Search, Pencil, Trash2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import type { Product, Category } from "@/lib/supabase/types";

const brands = ["kama", "kinwin", "joylong", "chtc"] as const;

const serializeImages = (images?: string[]) => (images ?? []).join("\n");

const parseImages = (value: string): string[] =>
    value
        .split(/\r?\n|,/)
        .map((s) => s.trim())
        .filter(Boolean);

const AdminProducts = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editingProduct, setEditingProduct] =
        useState<Partial<Product> | null>(null);
    const [saving, setSaving] = useState(false);

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

    const filtered = products.filter(
        (p) =>
            p.name.toLowerCase().includes(search.toLowerCase()) ||
            p.brand.toLowerCase().includes(search.toLowerCase())
    );

    const getCategoryName = (id: string) =>
        categories.find((c) => c.id === id)?.name || "—";

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

    const columns = [
        {
            header: "Product",
            accessor: (row: Product) => (
                <div className="flex items-center gap-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src={row.thumbnail}
                        alt={row.name}
                        className="w-12 h-12 rounded-lg object-cover bg-muted"
                    />
                    <div>
                        <p className="font-medium text-foreground">{row.name}</p>
                        <p className="text-xs text-muted-foreground">{row.slug}</p>
                    </div>
                </div>
            ),
        },
        {
            header: "Brand",
            accessor: (row: Product) => (
                <span className="uppercase text-xs font-bold tracking-wider">
                    {row.brand}
                </span>
            ),
        },
        {
            header: "Category",
            accessor: (row: Product) => getCategoryName(row.category_id),
        },
        {
            header: "Status",
            accessor: (row: Product) => (
                <StatusBadge status={row.is_active ? "active" : "inactive"} />
            ),
        },
        {
            header: "Actions",
            accessor: (row: Product) => (
                <div className="flex items-center gap-2">
                    <Button
                        size="sm"
                        variant="ghost"
                        onClick={(e) => {
                            e.stopPropagation();
                            openEdit(row);
                        }}
                    >
                        <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                        size="sm"
                        variant="ghost"
                        className="text-destructive"
                        onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(row.id);
                        }}
                    >
                        <Trash2 className="w-4 h-4" />
                    </Button>
                </div>
            ),
            className: "w-[100px]",
        },
    ];

    return (
        <AdminLayout
            title="Products"
            subtitle={`${products.length} products`}
            actions={
                <Button
                    onClick={openNew}
                    className="font-display font-semibold"
                >
                    <Plus className="w-4 h-4 mr-2" /> Add Product
                </Button>
            }
        >
            <div className="mb-6">
                <div className="relative max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                        placeholder="Search products..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-10"
                    />
                </div>
            </div>

            <DataTable
                columns={columns}
                data={filtered}
                loading={loading}
                emptyMessage="No products found"
            />

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
                                    onChange={(e) =>
                                        setEditingProduct({ ...editingProduct, name: e.target.value })
                                    }
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
