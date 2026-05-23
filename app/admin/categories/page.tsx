"use client";
import Image from "next/image";
import { useEffect, useState, useRef } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import DataTable from "@/components/admin/DataTable";
import StatusBadge from "@/components/admin/StatusBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { adminDb } from "@/lib/supabase/adminClient";
import { Plus, Pencil, Trash2, Upload, X } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import type { Category } from "@/lib/supabase/types";
import { getStorageUrl } from "@/lib/supabase/storage";
import { deleteCategoryStorage } from "@/lib/supabase/storage-cleanup";

const toSlug = (value: string): string =>
    value.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-");

const AdminCategories = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editing, setEditing] = useState<Partial<Category> | null>(null);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);

    // Image upload state
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string>("");
    const [hoverFile, setHoverFile] = useState<File | null>(null);
    const [hoverPreview, setHoverPreview] = useState<string>("");
    const imageInputRef = useRef<HTMLInputElement>(null);
    const hoverInputRef = useRef<HTMLInputElement>(null);

    const fetchData = async () => {
        setLoading(true);
        const { data } = await adminDb.from("categories").select("*").order("display_order");
        setCategories((data as Category[]) || []);
        setLoading(false);
    };

    useEffect(() => { fetchData(); }, []);

    const warnSize = (file: File) => {
        if (file.size > 400 * 1024)
            toast({ title: "Large file", description: `${file.name}: ${(file.size / 1024).toFixed(0)} KB — aim for under 300 KB.`, variant: "destructive" });
    };

    const uploadFile = async (file: File, slug: string, suffix: string): Promise<string> => {
        const ext = file.name.split(".").pop() ?? "jpg";
        const path = `categories/${slug}/${suffix}-${Date.now()}.${ext}`;
        const { error } = await adminDb.storage.from("images").upload(path, file, { upsert: true, contentType: file.type });
        if (error) throw new Error(error.message);
        return path;
    };

    const resetUpload = () => {
        setImageFile(null); setImagePreview("");
        setHoverFile(null); setHoverPreview("");
    };

    const openNew = () => {
        setEditing({ is_active: true, display_order: categories.length });
        resetUpload();
        setDialogOpen(true);
    };

    const openEdit = (c: Category) => {
        setEditing({ ...c });
        resetUpload();
        setDialogOpen(true);
    };

    const handleSave = async () => {
        if (!editing?.name) {
            toast({ title: "Name is required", variant: "destructive" });
            return;
        }
        setSaving(true);
        setUploading(true);

        const slug = editing.id ? (editing.slug || toSlug(editing.name)) : toSlug(editing.name);
        let imagePath = editing.image || "";
        let hoverPath = editing.hover_image || "";

        try {
            if (imageFile) imagePath = await uploadFile(imageFile, slug, "main");
            if (hoverFile) hoverPath = await uploadFile(hoverFile, slug, "hover");
        } catch (err: unknown) {
            toast({ title: "Upload failed", description: String(err), variant: "destructive" });
            setSaving(false); setUploading(false); return;
        }
        setUploading(false);

        const payload = {
            name: editing.name,
            slug,
            description: editing.description || null,
            image: imagePath || null,
            hover_image: hoverPath || null,
            display_order: editing.display_order ?? 0,
            is_active: editing.is_active ?? true,
        };

        const previousSlug = editing.id
            ? categories.find((c) => c.id === editing.id)?.slug
            : undefined;

        if (editing.id) {
            const { error } = await adminDb.from("categories").update(payload).eq("id", editing.id);
            if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
            else {
                if (previousSlug && previousSlug !== slug) {
                    const storageError = await deleteCategoryStorage(adminDb, { slug: previousSlug });
                    if (storageError) {
                        toast({
                            title: "Category updated",
                            description: `Slug changed, but old storage folder may remain: ${storageError}`,
                            variant: "destructive",
                        });
                    } else {
                        toast({ title: "Category updated" });
                    }
                } else {
                    toast({ title: "Category updated" });
                }
                resetUpload();
            }
        } else {
            const { error } = await adminDb.from("categories").insert(payload);
            if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
            else { toast({ title: "Category created" }); resetUpload(); }
        }
        setSaving(false);
        setDialogOpen(false);
        fetchData();
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Delete this category?")) return;

        const category = categories.find((c) => c.id === id);
        if (!category) return;

        const storageError = await deleteCategoryStorage(adminDb, {
            slug: category.slug,
            image: category.image,
            hover_image: category.hover_image,
        });
        if (storageError) {
            toast({
                title: "Storage cleanup failed",
                description: storageError,
                variant: "destructive",
            });
            return;
        }

        const { error } = await adminDb.from("categories").delete().eq("id", id);
        if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
        else { toast({ title: "Category deleted" }); fetchData(); }
    };

    const columns = [
        {
            header: "Order",
            accessor: (r: Category) => <span className="font-mono text-sm">{r.display_order}</span>,
            className: "w-[60px]",
        },
        {
            header: "Category",
            accessor: (r: Category) => (
                <div className="flex items-center gap-3">
                    {r.image && (
                        <Image src={getStorageUrl(r.image)} alt={r.name} className="w-10 h-10 rounded-lg object-cover bg-muted" width={80} height={80} loading="lazy" />
                    )}
                    <div>
                        <p className="font-medium">{r.name}</p>
                        <p className="text-xs text-white/40">{r.slug}</p>
                    </div>
                </div>
            ),
        },
        {
            header: "Status",
            accessor: (r: Category) => <StatusBadge status={r.is_active ? "active" : "inactive"} />,
        },
        {
            header: "Actions",
            accessor: (r: Category) => (
                <div className="flex gap-2">
                    <Button size="sm" variant="ghost" onClick={(e) => { e.stopPropagation(); openEdit(r); }}>
                        <Pencil className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="ghost" className="text-destructive" onClick={(e) => { e.stopPropagation(); handleDelete(r.id); }}>
                        <Trash2 className="w-4 h-4" />
                    </Button>
                </div>
            ),
            className: "w-[100px]",
        },
    ];

    // Reusable upload zone
    const UploadZone = ({
        label, hint, preview, existingPath, inputRef, onFile, onClear,
    }: {
        label: string; hint?: string; preview: string; existingPath: string;
        inputRef: React.RefObject<HTMLInputElement | null>;
        onFile: (f: File) => void; onClear: () => void;
    }) => (
        <div>
            <label className="text-sm font-medium mb-1 block text-white/70">{label}</label>
            {hint && <p className="text-xs text-white/40 mb-2">{hint}</p>}
            <div
                className={`border-2 border-dashed rounded-xl p-3 text-center cursor-pointer transition-colors ${preview || existingPath ? "border-[#e07a2f]/40 bg-[#e07a2f]/5" : "border-white/[0.06] hover:border-[#e07a2f]/50 hover:bg-white/[0.02]"}`}
                onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
                onDrop={(e) => {
                    e.preventDefault();
                    const file = e.dataTransfer.files[0];
                    if (!file || !file.type.startsWith("image/")) return;
                    warnSize(file); onFile(file);
                }}
                onClick={() => inputRef.current?.click()}
            >
                {preview ? (
                    <img src={preview} alt="preview" className="mx-auto max-h-36 rounded-lg object-contain" />
                ) : existingPath ? (
                    <img src={getStorageUrl(existingPath)} alt="current" className="mx-auto max-h-36 rounded-lg object-contain" />
                ) : (
                    <div className="py-6 flex flex-col items-center gap-2 text-white/30">
                        <Upload className="w-8 h-8" />
                        <p className="text-sm font-medium text-white/50">Drag & drop or click to browse</p>
                        <p className="text-xs text-white/30">JPG, PNG, WebP · Aim for under 300 KB</p>
                    </div>
                )}
                <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    warnSize(file); onFile(file);
                }} />
            </div>
            {(preview || existingPath) && (
                <button type="button" className="mt-1 text-xs text-rose-500 hover:underline" onClick={onClear}>
                    Remove image
                </button>
            )}
        </div>
    );

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
                <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="font-display">
                            {editing?.id ? "Edit" : "Add"} Category
                        </DialogTitle>
                    </DialogHeader>
                    {editing && (
                        <div className="space-y-4 mt-4">

                            {/* Name */}
                            <div>
                                <label className="text-sm font-medium mb-1 block text-white/70">Category Name *</label>
                                <Input
                                    placeholder="e.g. Mini Truck"
                                    value={editing.name || ""}
                                    onChange={(e) => setEditing({ ...editing, name: e.target.value })}
                                />
                            </div>

                            {/* Description */}
                            <div>
                                <label className="text-sm font-medium mb-1 block text-white/70">Description</label>
                                <textarea
                                    className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm min-h-[60px]"
                                    placeholder="Brief description of this category..."
                                    value={editing.description || ""}
                                    onChange={(e) => setEditing({ ...editing, description: e.target.value })}
                                />
                            </div>

                            {/* Category image */}
                            <UploadZone
                                label="Category Image"
                                hint="Shown in the category listing. Keep under 300 KB."
                                preview={imagePreview}
                                existingPath={editing.image || ""}
                                inputRef={imageInputRef}
                                onFile={(f) => { setImageFile(f); setImagePreview(URL.createObjectURL(f)); }}
                                onClear={() => { setImageFile(null); setImagePreview(""); setEditing({ ...editing, image: "" }); }}
                            />

                            {/* Hover image */}
                            <UploadZone
                                label="Hover Image (optional)"
                                hint="Alternate image shown on hover interaction."
                                preview={hoverPreview}
                                existingPath={editing.hover_image || ""}
                                inputRef={hoverInputRef}
                                onFile={(f) => { setHoverFile(f); setHoverPreview(URL.createObjectURL(f)); }}
                                onClear={() => { setHoverFile(null); setHoverPreview(""); setEditing({ ...editing, hover_image: "" }); }}
                            />

                            {/* Display order + Active */}
                            <div className="flex items-center gap-6">
                                <div className="flex-1">
                                    <label className="text-sm font-medium mb-1 block text-white/70">Display Order</label>
                                    <Input
                                        type="number"
                                        value={editing.display_order ?? 0}
                                        onChange={(e) => setEditing({ ...editing, display_order: parseInt(e.target.value) })}
                                    />
                                </div>
                                <label className="flex items-center gap-2 text-sm cursor-pointer pt-6">
                                    <input
                                        type="checkbox"
                                        checked={editing.is_active ?? true}
                                        onChange={(e) => setEditing({ ...editing, is_active: e.target.checked })}
                                    />
                                    Active
                                </label>
                            </div>

                            {/* Actions */}
                            <div className="flex justify-end gap-3 pt-4 border-t border-white/[0.06]">
                                <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
                                <Button onClick={handleSave} disabled={saving || uploading} className="font-display font-semibold bg-[#e07a2f] hover:bg-[#c96a25]">
                                    {uploading ? "Uploading..." : saving ? "Saving..." : editing.id ? "Update Category" : "Create Category"}
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
