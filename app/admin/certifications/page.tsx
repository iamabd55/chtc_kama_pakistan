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
import type { Certification } from "@/lib/supabase/types";

export default function AdminCertificationsPage() {
    const [items, setItems] = useState<Certification[]>([]);
    const [loading, setLoading] = useState(true);
    const [open, setOpen] = useState(false);
    const [editing, setEditing] = useState<Partial<Certification> | null>(null);

    const fetchData = async () => {
        setLoading(true);
        const { data } = await adminDb.from("certifications").select("*").order("display_order");
        setItems((data as Certification[]) || []);
        setLoading(false);
    };

    useEffect(() => { fetchData(); }, []);

    const save = async () => {
        if (!editing?.title) {
            toast({ title: "Title is required", variant: "destructive" });
            return;
        }
        const payload = {
            title: editing.title,
            thumbnail_url: editing.thumbnail_url || null,
            document_url: editing.document_url || null,
            description: editing.description || null,
            display_order: editing.display_order || 0,
            is_active: editing.is_active ?? true,
            updated_at: new Date().toISOString(),
        };

        const { error } = editing.id
            ? await adminDb.from("certifications").update(payload).eq("id", editing.id)
            : await adminDb.from("certifications").insert(payload);

        if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
        else { toast({ title: editing.id ? "Certification updated" : "Certification added" }); setOpen(false); fetchData(); }
    };

    const remove = async (id: string) => {
        if (!confirm("Delete this certification?")) return;
        const { error } = await adminDb.from("certifications").delete().eq("id", id);
        if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
        else { toast({ title: "Certification deleted" }); fetchData(); }
    };

    const columns = [
        { header: "Title", accessor: "title" as keyof Certification },
        {
            header: "Document",
            accessor: (row: Certification) => row.document_url ? <a href={row.document_url} target="_blank" rel="noreferrer" className="text-primary text-sm">Open</a> : <span className="text-muted-foreground text-sm">—</span>,
        },
        { header: "Status", accessor: (row: Certification) => <StatusBadge status={row.is_active ? "active" : "inactive"} /> },
        {
            header: "Actions",
            accessor: (row: Certification) => (
                <div className="flex gap-2">
                    <Button size="sm" variant="ghost" onClick={() => { setEditing(row); setOpen(true); }}><Pencil className="w-4 h-4" /></Button>
                    <Button size="sm" variant="ghost" className="text-destructive" onClick={() => remove(row.id)}><Trash2 className="w-4 h-4" /></Button>
                </div>
            ),
        },
    ];

    return (
        <AdminLayout title="Certifications" subtitle={`${items.length} records`} actions={<Button onClick={() => { setEditing({ is_active: true, display_order: 0 }); setOpen(true); }}><Plus className="w-4 h-4 mr-2" />Add Certification</Button>}>
            <DataTable columns={columns} data={items} loading={loading} />
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="max-w-lg">
                    <DialogHeader><DialogTitle>{editing?.id ? "Edit" : "Add"} Certification</DialogTitle></DialogHeader>
                    {editing && (
                        <div className="space-y-3">
                            <Input placeholder="Title" value={editing.title || ""} onChange={(e) => setEditing({ ...editing, title: e.target.value })} />
                            <Input placeholder="Thumbnail URL" value={editing.thumbnail_url || ""} onChange={(e) => setEditing({ ...editing, thumbnail_url: e.target.value })} />
                            <Input placeholder="Document URL" value={editing.document_url || ""} onChange={(e) => setEditing({ ...editing, document_url: e.target.value })} />
                            <textarea className="w-full border rounded-md px-3 py-2 text-sm" rows={3} placeholder="Description" value={editing.description || ""} onChange={(e) => setEditing({ ...editing, description: e.target.value })} />
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
