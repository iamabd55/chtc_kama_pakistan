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
import type { ClientLogo } from "@/lib/supabase/types";
import { getStorageUrl } from "@/lib/supabase/storage";

export default function AdminClientsPage() {
    const [items, setItems] = useState<ClientLogo[]>([]);
    const [loading, setLoading] = useState(true);
    const [open, setOpen] = useState(false);
    const [editing, setEditing] = useState<Partial<ClientLogo> | null>(null);

    const fetchData = async () => {
        setLoading(true);
        const { data } = await adminDb.from("client_logos").select("*").order("display_order");
        setItems((data as ClientLogo[]) || []);
        setLoading(false);
    };

    useEffect(() => { fetchData(); }, []);

    const save = async () => {
        if (!editing?.name || !editing?.logo_url) {
            toast({ title: "Name and logo URL are required", variant: "destructive" });
            return;
        }
        const payload = {
            name: editing.name,
            logo_url: editing.logo_url,
            website_url: editing.website_url || null,
            display_order: editing.display_order || 0,
            is_active: editing.is_active ?? true,
            updated_at: new Date().toISOString(),
        };
        const { error } = editing.id
            ? await adminDb.from("client_logos").update(payload).eq("id", editing.id)
            : await adminDb.from("client_logos").insert(payload);

        if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
        else { toast({ title: editing.id ? "Client updated" : "Client added" }); setOpen(false); fetchData(); }
    };

    const remove = async (id: string) => {
        if (!confirm("Delete this logo?")) return;
        const { error } = await adminDb.from("client_logos").delete().eq("id", id);
        if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
        else { toast({ title: "Client deleted" }); fetchData(); }
    };

    const columns = [
        {
            header: "Client",
            accessor: (row: ClientLogo) => (
                <div className="flex items-center gap-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={getStorageUrl(row.logo_url)} alt={row.name} className="w-12 h-12 rounded-md object-cover bg-muted" />
                    <div>
                        <p className="font-medium">{row.name}</p>
                        <p className="text-xs text-muted-foreground">{row.website_url || "—"}</p>
                    </div>
                </div>
            ),
        },
        { header: "Order", accessor: "display_order" as keyof ClientLogo },
        { header: "Status", accessor: (row: ClientLogo) => <StatusBadge status={row.is_active ? "active" : "inactive"} /> },
        {
            header: "Actions",
            accessor: (row: ClientLogo) => (
                <div className="flex gap-2">
                    <Button size="sm" variant="ghost" onClick={() => { setEditing(row); setOpen(true); }}><Pencil className="w-4 h-4" /></Button>
                    <Button size="sm" variant="ghost" className="text-destructive" onClick={() => remove(row.id)}><Trash2 className="w-4 h-4" /></Button>
                </div>
            ),
        },
    ];

    return (
        <AdminLayout title="Client Logos" subtitle={`${items.length} logos`} actions={<Button onClick={() => { setEditing({ is_active: true, display_order: 0 }); setOpen(true); }}><Plus className="w-4 h-4 mr-2" />Add Logo</Button>}>
            <DataTable columns={columns} data={items} loading={loading} />
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="max-w-lg">
                    <DialogHeader><DialogTitle>{editing?.id ? "Edit" : "Add"} Client</DialogTitle></DialogHeader>
                    {editing && (
                        <div className="space-y-3">
                            <Input placeholder="Client Name" value={editing.name || ""} onChange={(e) => setEditing({ ...editing, name: e.target.value })} />
                            <Input placeholder="Logo URL" value={editing.logo_url || ""} onChange={(e) => setEditing({ ...editing, logo_url: e.target.value })} />
                            <Input placeholder="Website URL" value={editing.website_url || ""} onChange={(e) => setEditing({ ...editing, website_url: e.target.value })} />
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
