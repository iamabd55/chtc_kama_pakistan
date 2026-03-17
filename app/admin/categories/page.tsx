"use client";

import { useEffect, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import DataTable from "@/components/admin/DataTable";
import StatusBadge from "@/components/admin/StatusBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { adminDb } from "@/lib/supabase/adminClient";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import type { Category } from "@/lib/supabase/types";
import { getStorageUrl } from "@/lib/supabase/storage";

const toSlug = (value: string): string =>
    value
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-");

const AdminCategories = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editing, setEditing] = useState<Partial<Category> | null>(null);
    const [saving, setSaving] = useState(false);

    const fetchData = async () => {
        setLoading(true);
        const { data } = await adminDb
            .from("categories")
            .select("*")
            .order("display_order");
        setCategories((data as Category[]) || []);
        setLoading(false);
    };

    useEffect(() => {
        fetchData();
    }, []);

    const openNew = () => {
        setEditing({ is_active: true, display_order: 0 });
        setDialogOpen(true);
    };
    const openEdit = (c: Category) => {
        setEditing({ ...c });
        setDialogOpen(true);
    };

    const handleSave = async () => {
        if (!editing?.name || !editing?.slug) {
            toast({ title: "Name and slug are required", variant: "destructive" });
            return;
        }
        setSaving(true);
        const payload = {
            name: editing.name,
            slug: editing.slug,
            description: editing.description || null,
            image: editing.image || null,
            hover_image: editing.hover_image || null,
            display_order: editing.display_order || 0,
            is_active: editing.is_active ?? true,
        };

        if (editing.id) {
            const { error } = await adminDb
                .from("categories")
                .update(payload)
                .eq("id", editing.id);
            if (error)
                toast({ title: "Error", description: error.message, variant: "destructive" });
            else toast({ title: "Category updated" });
        } else {
            const { error } = await adminDb.from("categories").insert(payload);
            if (error)
                toast({ title: "Error", description: error.message, variant: "destructive" });
            else toast({ title: "Category created" });
        }
        setSaving(false);
        setDialogOpen(false);
        fetchData();
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Delete this category?")) return;
        const { error } = await adminDb
            .from("categories")
            .delete()
            .eq("id", id);
        if (error)
            toast({ title: "Error", description: error.message, variant: "destructive" });
        else {
            toast({ title: "Category deleted" });
            fetchData();
        }
    };

    const columns = [
        {
            header: "Order",
            accessor: (r: Category) => (
                <span className="font-mono text-sm">{r.display_order}</span>
            ),
            className: "w-[60px]",
        },
        {
            header: "Category",
            accessor: (r: Category) => (
                <div className="flex items-center gap-3">
                    {r.image && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                            src={getStorageUrl(r.image)}
                            alt={r.name}
                            className="w-10 h-10 rounded-lg object-cover bg-muted"
                        />
                    )}
                    <div>
                        <p className="font-medium">{r.name}</p>
                        <p className="text-xs text-muted-foreground">{r.slug}</p>
                    </div>
                </div>
            ),
        },
        {
            header: "Status",
            accessor: (r: Category) => (
                <StatusBadge status={r.is_active ? "active" : "inactive"} />
            ),
        },
        {
            header: "Actions",
            accessor: (r: Category) => (
                <div className="flex gap-2">
                    <Button
                        size="sm"
                        variant="ghost"
                        onClick={(e) => {
                            e.stopPropagation();
                            openEdit(r);
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
                            handleDelete(r.id);
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
            title="Categories"
            subtitle={`${categories.length} categories`}
            actions={
                <Button onClick={openNew} className="font-display font-semibold">
                    <Plus className="w-4 h-4 mr-2" /> Add Category
                </Button>
            }
        >
            <DataTable columns={columns} data={categories} loading={loading} />

            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent className="max-w-lg">
                    <DialogHeader>
                        <DialogTitle className="font-display">
                            {editing?.id ? "Edit" : "Add"} Category
                        </DialogTitle>
                    </DialogHeader>
                    {editing && (
                        <div className="space-y-4 mt-4">
                            <div>
                                <label className="text-sm font-medium mb-1 block">Name *</label>
                                <Input
                                    value={editing.name || ""}
                                    onChange={(e) => {
                                        const name = e.target.value;
                                        const previousAutoSlug = toSlug(editing.name || "");
                                        const shouldAutoSlug =
                                            !editing.id &&
                                            (!editing.slug || editing.slug === previousAutoSlug);
                                        setEditing({
                                            ...editing,
                                            name,
                                            slug: shouldAutoSlug ? toSlug(name) : editing.slug,
                                        });
                                    }}
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium mb-1 block">Slug *</label>
                                <Input
                                    value={editing.slug || ""}
                                    onChange={(e) =>
                                        setEditing({ ...editing, slug: e.target.value })
                                    }
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium mb-1 block">
                                    Description
                                </label>
                                <textarea
                                    className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm min-h-[60px]"
                                    value={editing.description || ""}
                                    onChange={(e) =>
                                        setEditing({ ...editing, description: e.target.value })
                                    }
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium mb-1 block">
                                    Image URL
                                </label>
                                <Input
                                    value={editing.image || ""}
                                    onChange={(e) =>
                                        setEditing({ ...editing, image: e.target.value })
                                    }
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium mb-1 block">
                                    Hover Image URL
                                </label>
                                <Input
                                    value={editing.hover_image || ""}
                                    onChange={(e) =>
                                        setEditing({ ...editing, hover_image: e.target.value })
                                    }
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium mb-1 block">
                                    Display Order
                                </label>
                                <Input
                                    type="number"
                                    value={editing.display_order || 0}
                                    onChange={(e) =>
                                        setEditing({
                                            ...editing,
                                            display_order: parseInt(e.target.value),
                                        })
                                    }
                                />
                            </div>
                            <label className="flex items-center gap-2 text-sm">
                                <input
                                    type="checkbox"
                                    checked={editing.is_active ?? true}
                                    onChange={(e) =>
                                        setEditing({ ...editing, is_active: e.target.checked })
                                    }
                                />
                                Active
                            </label>
                            <div className="flex justify-end gap-3 pt-4 border-t">
                                <Button
                                    variant="outline"
                                    onClick={() => setDialogOpen(false)}
                                >
                                    Cancel
                                </Button>
                                <Button onClick={handleSave} disabled={saving}>
                                    {saving ? "Saving..." : "Save"}
                                </Button>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </AdminLayout>
    );
};

export default AdminCategories;
