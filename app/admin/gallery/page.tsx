"use client";
import Image from 'next/image';
import { useEffect, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import DataTable from "@/components/admin/DataTable";
import StatusBadge from "@/components/admin/StatusBadge";
import { adminDb } from "@/lib/supabase/adminClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Plus, Pencil, Trash2, UploadCloud } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import type { GalleryItem } from "@/lib/supabase/types";
import { getStorageUrl } from "@/lib/supabase/storage";

const categories: GalleryItem["category"][] = ["product", "event", "facility", "delivery"];

export default function AdminGalleryPage() {
    const [items, setItems] = useState<GalleryItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [open, setOpen] = useState(false);
    const [editing, setEditing] = useState<Partial<GalleryItem> | null>(null);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [saving, setSaving] = useState(false);
    const [isDragActive, setIsDragActive] = useState(false);

    const resolveImageUrl = (imageUrl: string) => (imageUrl.startsWith("/") ? imageUrl : getStorageUrl(imageUrl));

    const uploadImage = async (file: File) => {
        const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
        const uploadPath = `gallery/${Date.now()}-${safeName}`;

        const { error } = await adminDb.storage
            .from("images")
            .upload(uploadPath, file, {
                contentType: file.type || "application/octet-stream",
                upsert: false,
            });

        if (error) throw new Error(error.message);
        return uploadPath;
    };

    const fetchData = async () => {
        setLoading(true);
        const { data } = await adminDb.from("gallery_items").select("*").order("display_order");
        setItems((data as GalleryItem[]) || []);
        setLoading(false);
    };

    useEffect(() => { fetchData(); }, []);

    const save = async () => {
        if (!editing?.title || !editing?.category || (!editing?.image_url && !imageFile)) {
            toast({ title: "Title, image and category are required", variant: "destructive" });
            return;
        }

        setSaving(true);

        let imagePath = editing.image_url || "";

        try {
            if (imageFile) {
                imagePath = await uploadImage(imageFile);
            }
        } catch (error) {
            setSaving(false);
            toast({
                title: "Image upload failed",
                description: error instanceof Error ? error.message : "Could not upload image",
                variant: "destructive",
            });
            return;
        }

        const payload = {
            title: editing.title,
            image_url: imagePath,
            category: editing.category,
            display_order: editing.display_order || 0,
            is_active: editing.is_active ?? true,
            updated_at: new Date().toISOString(),
        };
        const { error } = editing.id
            ? await adminDb.from("gallery_items").update(payload).eq("id", editing.id)
            : await adminDb.from("gallery_items").insert(payload);

        if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
        else {
            toast({ title: editing.id ? "Image updated" : "Image added" });
            setOpen(false);
            setImageFile(null);
            fetchData();
        }

        setSaving(false);
    };

    const remove = async (id: string) => {
        if (!confirm("Delete this gallery item?")) return;
        const { error } = await adminDb.from("gallery_items").delete().eq("id", id);
        if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
        else { toast({ title: "Item deleted" }); fetchData(); }
    };

    const columns = [
        {
            header: "Image",
            accessor: (row: GalleryItem) => (
                <div className="flex items-center gap-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <Image src={resolveImageUrl(row.image_url)} alt={row.title} className="w-12 h-12 rounded-md object-cover bg-muted"  width={800} height={600}  loading="lazy" />
                    <div>
                        <p className="font-medium">{row.title}</p>
                        <p className="text-xs text-muted-foreground uppercase">{row.category}</p>
                    </div>
                </div>
            ),
        },
        { header: "Order", accessor: "display_order" as keyof GalleryItem },
        { header: "Status", accessor: (row: GalleryItem) => <StatusBadge status={row.is_active ? "active" : "inactive"} /> },
        {
            header: "Actions",
            accessor: (row: GalleryItem) => (
                <div className="flex gap-2">
                    <Button size="sm" variant="ghost" onClick={() => { setEditing(row); setImageFile(null); setOpen(true); }}><Pencil className="w-4 h-4" /></Button>
                    <Button size="sm" variant="ghost" className="text-destructive" onClick={() => remove(row.id)}><Trash2 className="w-4 h-4" /></Button>
                </div>
            ),
        },
    ];

    return (
        <AdminLayout title="Gallery Management" subtitle={`${items.length} items`} actions={<Button onClick={() => { setEditing({ is_active: true, display_order: 0, category: "product" }); setImageFile(null); setOpen(true); }}><Plus className="w-4 h-4 mr-2" />Add Image</Button>}>
            <DataTable columns={columns} data={items} loading={loading} />
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="w-[calc(100vw-1.5rem)] max-w-lg max-h-[88vh] p-4 sm:p-6 overflow-hidden">
                    <DialogHeader><DialogTitle>{editing?.id ? "Edit" : "Add"} Gallery Item</DialogTitle></DialogHeader>
                    {editing && (
                        <div className="space-y-4 overflow-y-auto pr-1 pb-1 max-h-[calc(88vh-4.5rem)]">
                            <div className="space-y-2">
                                <label htmlFor="gallery_title" className="text-sm font-medium">Title</label>
                                <Input id="gallery_title" placeholder="e.g. Delivery Ceremony" value={editing.title || ""} onChange={(e) => setEditing({ ...editing, title: e.target.value })} />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Image Upload</label>
                                <label
                                    htmlFor="gallery_upload"
                                    onDragOver={(e) => {
                                        e.preventDefault();
                                        setIsDragActive(true);
                                    }}
                                    onDragLeave={() => setIsDragActive(false)}
                                    onDrop={(e) => {
                                        e.preventDefault();
                                        setIsDragActive(false);
                                        const droppedFile = e.dataTransfer.files?.[0];
                                        if (droppedFile) setImageFile(droppedFile);
                                    }}
                                    className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border border-dashed p-5 text-center transition-colors ${
                                        isDragActive ? "border-primary bg-primary/5" : "border-input hover:border-primary/40"
                                    }`}
                                >
                                    <UploadCloud className="h-5 w-5 text-muted-foreground" />
                                    <p className="text-sm font-medium text-foreground">Drop image here or click to upload</p>
                                    <p className="text-xs text-muted-foreground">PNG, JPG, WEBP supported</p>
                                </label>
                                <Input
                                    id="gallery_upload"
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
                                />
                                {(imageFile || editing.image_url) && (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <Image
                                        src={imageFile ? URL.createObjectURL(imageFile) : resolveImageUrl(editing.image_url || "")}
                                        alt="Gallery preview"
                                        className="h-20 w-32 rounded-md border object-cover bg-muted"
                                     width={800} height={600}  loading="lazy" />
                                )}
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="gallery_category" className="text-sm font-medium">Category</label>
                                <select id="gallery_category" className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm" value={editing.category || "product"} onChange={(e) => setEditing({ ...editing, category: e.target.value as GalleryItem["category"] })}>
                                    {categories.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="gallery_order" className="text-sm font-medium">Display Order</label>
                                <Input id="gallery_order" type="number" value={editing.display_order || 0} onChange={(e) => setEditing({ ...editing, display_order: Number.parseInt(e.target.value || "0", 10) })} />
                            </div>

                            <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={editing.is_active ?? true} onChange={(e) => setEditing({ ...editing, is_active: e.target.checked })} />Active</label>
                            <div className="flex justify-end"><Button className="w-full sm:w-auto" onClick={save} disabled={saving}>{saving ? "Saving..." : "Save"}</Button></div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </AdminLayout>
    );
}
