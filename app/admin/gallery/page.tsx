"use client";

import { useEffect, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import DataTable from "@/components/admin/DataTable";
import StatusBadge from "@/components/admin/StatusBadge";
import { adminDb } from "@/lib/supabase/adminClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import type { GalleryItem } from "@/lib/supabase/types";
import { getStorageUrl } from "@/lib/supabase/storage";

const categories: GalleryItem["category"][] = ["product", "event", "facility", "delivery"];

export default function AdminGalleryPage() {
    const [items, setItems] = useState<GalleryItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [open, setOpen] = useState(false);
    const [editing, setEditing] = useState<Partial<GalleryItem> | null>(null);

    const fetchData = async () => {
        setLoading(true);
        const { data } = await adminDb.from("gallery_items").select("*").order("display_order");
        setItems((data as GalleryItem[]) || []);
        setLoading(false);
    };

    useEffect(() => { fetchData(); }, []);

    const save = async () => {
        if (!editing?.title || !editing?.image_url || !editing?.category) {
            toast({ title: "Title, image and category are required", variant: "destructive" });
            return;
        }
        const payload = {
            title: editing.title,
            image_url: editing.image_url,
            category: editing.category,
            display_order: editing.display_order || 0,
            is_active: editing.is_active ?? true,
            updated_at: new Date().toISOString(),
        };
        const { error } = editing.id
            ? await adminDb.from("gallery_items").update(payload).eq("id", editing.id)
            : await adminDb.from("gallery_items").insert(payload);

        if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
        else { toast({ title: editing.id ? "Image updated" : "Image added" }); setOpen(false); fetchData(); }
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
                    <img src={getStorageUrl(row.image_url)} alt={row.title} className="w-12 h-12 rounded-md object-cover bg-muted" />
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
                    <Button size="sm" variant="ghost" onClick={() => { setEditing(row); setOpen(true); }}><Pencil className="w-4 h-4" /></Button>
                    <Button size="sm" variant="ghost" className="text-destructive" onClick={() => remove(row.id)}><Trash2 className="w-4 h-4" /></Button>
                </div>
            ),
        },
    ];

    return (
        <AdminLayout title="Gallery Management" subtitle={`${items.length} items`} actions={<Button onClick={() => { setEditing({ is_active: true, display_order: 0, category: "product" }); setOpen(true); }}><Plus className="w-4 h-4 mr-2" />Add Image</Button>}>
            <DataTable columns={columns} data={items} loading={loading} />
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="max-w-lg">
                    <DialogHeader><DialogTitle>{editing?.id ? "Edit" : "Add"} Gallery Item</DialogTitle></DialogHeader>
                    {editing && (
                        <div className="space-y-3">
                            <Input placeholder="Title" value={editing.title || ""} onChange={(e) => setEditing({ ...editing, title: e.target.value })} />
                            <Input placeholder="Image URL" value={editing.image_url || ""} onChange={(e) => setEditing({ ...editing, image_url: e.target.value })} />
                            <select className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm" value={editing.category || "product"} onChange={(e) => setEditing({ ...editing, category: e.target.value as GalleryItem["category"] })}>
                                {categories.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
                            </select>
                            <Input type="number" placeholder="Display Order" value={editing.display_order || 0} onChange={(e) => setEditing({ ...editing, display_order: Number.parseInt(e.target.value || "0", 10) })} />
                            <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={editing.is_active ?? true} onChange={(e) => setEditing({ ...editing, is_active: e.target.checked })} />Active</label>
                            <div className="flex justify-end"><Button onClick={save}>Save</Button></div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </AdminLayout>
    );
}
