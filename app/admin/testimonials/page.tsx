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
import type { Testimonial } from "@/lib/supabase/types";

const statuses: Testimonial["status"][] = ["pending", "approved", "rejected"];

export default function AdminTestimonialsPage() {
    const [items, setItems] = useState<Testimonial[]>([]);
    const [loading, setLoading] = useState(true);
    const [open, setOpen] = useState(false);
    const [editing, setEditing] = useState<Partial<Testimonial> | null>(null);

    const fetchData = async () => {
        setLoading(true);
        const { data } = await adminDb.from("testimonials").select("*").order("created_at", { ascending: false });
        setItems((data as Testimonial[]) || []);
        setLoading(false);
    };

    useEffect(() => { fetchData(); }, []);

    const save = async () => {
        if (!editing?.customer_name || !editing?.content) {
            toast({ title: "Customer name and content are required", variant: "destructive" });
            return;
        }
        const payload = {
            customer_name: editing.customer_name,
            customer_title: editing.customer_title || null,
            company: editing.company || null,
            content: editing.content,
            rating: editing.rating || null,
            status: editing.status || "pending",
            is_active: editing.is_active ?? true,
            updated_at: new Date().toISOString(),
        };
        const { error } = editing.id
            ? await adminDb.from("testimonials").update(payload).eq("id", editing.id)
            : await adminDb.from("testimonials").insert(payload);

        if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
        else { toast({ title: editing.id ? "Testimonial updated" : "Testimonial added" }); setOpen(false); fetchData(); }
    };

    const remove = async (id: string) => {
        if (!confirm("Delete this testimonial?")) return;
        const { error } = await adminDb.from("testimonials").delete().eq("id", id);
        if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
        else { toast({ title: "Testimonial deleted" }); fetchData(); }
    };

    const columns = [
        {
            header: "Customer",
            accessor: (row: Testimonial) => (
                <div>
                    <p className="font-medium">{row.customer_name}</p>
                    <p className="text-xs text-muted-foreground">{row.company || "—"}</p>
                </div>
            ),
        },
        { header: "Rating", accessor: (row: Testimonial) => <span className="text-sm">{row.rating || "—"}</span> },
        { header: "Status", accessor: (row: Testimonial) => <StatusBadge status={row.status} /> },
        {
            header: "Actions",
            accessor: (row: Testimonial) => (
                <div className="flex gap-2">
                    <Button size="sm" variant="ghost" onClick={() => { setEditing(row); setOpen(true); }}><Pencil className="w-4 h-4" /></Button>
                    <Button size="sm" variant="ghost" className="text-destructive" onClick={() => remove(row.id)}><Trash2 className="w-4 h-4" /></Button>
                </div>
            ),
        },
    ];

    return (
        <AdminLayout title="Testimonials" subtitle={`${items.length} records`} actions={<Button onClick={() => { setEditing({ status: "pending", is_active: true }); setOpen(true); }}><Plus className="w-4 h-4 mr-2" />Add Testimonial</Button>}>
            <DataTable columns={columns} data={items} loading={loading} />
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="max-w-xl">
                    <DialogHeader><DialogTitle>{editing?.id ? "Edit" : "Add"} Testimonial</DialogTitle></DialogHeader>
                    {editing && (
                        <div className="space-y-3">
                            <Input placeholder="Customer Name" value={editing.customer_name || ""} onChange={(e) => setEditing({ ...editing, customer_name: e.target.value })} />
                            <Input placeholder="Customer Title" value={editing.customer_title || ""} onChange={(e) => setEditing({ ...editing, customer_title: e.target.value })} />
                            <Input placeholder="Company" value={editing.company || ""} onChange={(e) => setEditing({ ...editing, company: e.target.value })} />
                            <Input type="number" min={1} max={5} placeholder="Rating (1-5)" value={editing.rating || ""} onChange={(e) => setEditing({ ...editing, rating: Number.parseInt(e.target.value || "0", 10) || null })} />
                            <textarea className="w-full border rounded-md px-3 py-2 text-sm" rows={4} placeholder="Testimonial content" value={editing.content || ""} onChange={(e) => setEditing({ ...editing, content: e.target.value })} />
                            <select className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm" value={editing.status || "pending"} onChange={(e) => setEditing({ ...editing, status: e.target.value as Testimonial["status"] })}>
                                {statuses.map((status) => <option key={status} value={status}>{status}</option>)}
                            </select>
                            <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={editing.is_active ?? true} onChange={(e) => setEditing({ ...editing, is_active: e.target.checked })} />Active</label>
                            <div className="flex justify-end"><Button onClick={save}>Save</Button></div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </AdminLayout>
    );
}
