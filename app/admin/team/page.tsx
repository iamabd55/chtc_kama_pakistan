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
import type { TeamMember } from "@/lib/supabase/types";

export default function AdminTeamPage() {
    const [items, setItems] = useState<TeamMember[]>([]);
    const [loading, setLoading] = useState(true);
    const [open, setOpen] = useState(false);
    const [editing, setEditing] = useState<Partial<TeamMember> | null>(null);

    const fetchData = async () => {
        setLoading(true);
        const { data } = await adminDb.from("team_members").select("*").order("display_order");
        setItems((data as TeamMember[]) || []);
        setLoading(false);
    };

    useEffect(() => {
        fetchData();
    }, []);

    const save = async () => {
        if (!editing?.name || !editing?.role) {
            toast({ title: "Name and role are required", variant: "destructive" });
            return;
        }
        const payload = {
            name: editing.name,
            role: editing.role,
            photo_url: editing.photo_url || null,
            bio: editing.bio || null,
            display_order: editing.display_order || 0,
            is_active: editing.is_active ?? true,
            updated_at: new Date().toISOString(),
        };
        const { error } = editing.id
            ? await adminDb.from("team_members").update(payload).eq("id", editing.id)
            : await adminDb.from("team_members").insert(payload);

        if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
        else {
            toast({ title: editing.id ? "Member updated" : "Member added" });
            setOpen(false);
            fetchData();
        }
    };

    const remove = async (id: string) => {
        if (!confirm("Delete this member?")) return;
        const { error } = await adminDb.from("team_members").delete().eq("id", id);
        if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
        else {
            toast({ title: "Member deleted" });
            fetchData();
        }
    };

    const columns = [
        { header: "Name", accessor: "name" as keyof TeamMember },
        { header: "Role", accessor: "role" as keyof TeamMember },
        {
            header: "Status",
            accessor: (row: TeamMember) => <StatusBadge status={row.is_active ? "active" : "inactive"} />,
        },
        {
            header: "Actions",
            accessor: (row: TeamMember) => (
                <div className="flex gap-2">
                    <Button size="sm" variant="ghost" onClick={() => { setEditing(row); setOpen(true); }}><Pencil className="w-4 h-4" /></Button>
                    <Button size="sm" variant="ghost" className="text-destructive" onClick={() => remove(row.id)}><Trash2 className="w-4 h-4" /></Button>
                </div>
            ),
        },
    ];

    return (
        <AdminLayout
            title="Team Management"
            subtitle={`${items.length} team members`}
            actions={<Button onClick={() => { setEditing({ is_active: true, display_order: 0 }); setOpen(true); }}><Plus className="w-4 h-4 mr-2" />Add Member</Button>}
        >
            <DataTable columns={columns} data={items} loading={loading} />

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="max-w-lg">
                    <DialogHeader><DialogTitle>{editing?.id ? "Edit" : "Add"} Team Member</DialogTitle></DialogHeader>
                    {editing && (
                        <div className="space-y-3">
                            <Input placeholder="Name" value={editing.name || ""} onChange={(e) => setEditing({ ...editing, name: e.target.value })} />
                            <Input placeholder="Role" value={editing.role || ""} onChange={(e) => setEditing({ ...editing, role: e.target.value })} />
                            <Input placeholder="Photo URL" value={editing.photo_url || ""} onChange={(e) => setEditing({ ...editing, photo_url: e.target.value })} />
                            <textarea className="w-full border rounded-md px-3 py-2 text-sm" rows={4} placeholder="Bio" value={editing.bio || ""} onChange={(e) => setEditing({ ...editing, bio: e.target.value })} />
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
