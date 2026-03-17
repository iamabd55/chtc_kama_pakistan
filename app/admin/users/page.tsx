"use client";

import { useEffect, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import DataTable from "@/components/admin/DataTable";
import StatusBadge from "@/components/admin/StatusBadge";
import { adminDb } from "@/lib/supabase/adminClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Plus, Pencil } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import type { AdminProfile } from "@/lib/supabase/types";

const roles: AdminProfile["role"][] = ["super_admin", "editor", "sales", "hr"];

export default function AdminUsersPage() {
    const [items, setItems] = useState<AdminProfile[]>([]);
    const [loading, setLoading] = useState(true);
    const [open, setOpen] = useState(false);
    const [editing, setEditing] = useState<Partial<AdminProfile> | null>(null);
    const [createOpen, setCreateOpen] = useState(false);
    const [createForm, setCreateForm] = useState({ email: "", password: "", full_name: "", role: "editor" as AdminProfile["role"] });

    const fetchData = async () => {
        setLoading(true);
        const { data } = await adminDb.from("admin_profiles").select("*").order("created_at", { ascending: false });
        setItems((data as AdminProfile[]) || []);
        setLoading(false);
    };

    useEffect(() => {
        fetchData();
    }, []);

    const saveEdit = async () => {
        if (!editing?.id) return;

        const { error } = await adminDb
            .from("admin_profiles")
            .update({
                full_name: editing.full_name || null,
                role: editing.role || "editor",
                is_active: editing.is_active ?? true,
                updated_at: new Date().toISOString(),
            })
            .eq("id", editing.id);

        if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
        else {
            toast({ title: "Admin user updated" });
            setOpen(false);
            fetchData();
        }
    };

    const createUser = async () => {
        if (!createForm.email || !createForm.password) {
            toast({ title: "Email and password are required", variant: "destructive" });
            return;
        }

        const response = await fetch("/api/admin/users", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(createForm),
        });

        const data = await response.json();
        if (!response.ok) {
            toast({ title: "Error", description: data?.error || "Failed to create admin user", variant: "destructive" });
            return;
        }

        toast({ title: "Admin user created" });
        setCreateOpen(false);
        setCreateForm({ email: "", password: "", full_name: "", role: "editor" });
        fetchData();
    };

    const columns = [
        {
            header: "User",
            accessor: (row: AdminProfile) => (
                <div>
                    <p className="font-medium">{row.full_name || "—"}</p>
                    <p className="text-xs text-muted-foreground">{row.email}</p>
                </div>
            ),
        },
        { header: "Role", accessor: (row: AdminProfile) => <span className="uppercase text-xs font-semibold">{row.role}</span> },
        { header: "Status", accessor: (row: AdminProfile) => <StatusBadge status={row.is_active ? "active" : "inactive"} /> },
        {
            header: "Actions",
            accessor: (row: AdminProfile) => (
                <Button size="sm" variant="ghost" onClick={() => { setEditing(row); setOpen(true); }}>
                    <Pencil className="w-4 h-4" />
                </Button>
            ),
        },
    ];

    return (
        <AdminLayout
            title="Admin Users"
            subtitle={`${items.length} admin users`}
            actions={
                <Button onClick={() => setCreateOpen(true)}>
                    <Plus className="w-4 h-4 mr-2" /> Add Admin
                </Button>
            }
        >
            <DataTable columns={columns} data={items} loading={loading} />

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="max-w-lg">
                    <DialogHeader><DialogTitle>Edit Admin User</DialogTitle></DialogHeader>
                    {editing && (
                        <div className="space-y-3">
                            <Input value={editing.email || ""} disabled />
                            <Input placeholder="Full Name" value={editing.full_name || ""} onChange={(e) => setEditing({ ...editing, full_name: e.target.value })} />
                            <select className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm" value={editing.role || "editor"} onChange={(e) => setEditing({ ...editing, role: e.target.value as AdminProfile["role"] })}>
                                {roles.map((role) => <option key={role} value={role}>{role}</option>)}
                            </select>
                            <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={editing.is_active ?? true} onChange={(e) => setEditing({ ...editing, is_active: e.target.checked })} />Active</label>
                            <div className="flex justify-end"><Button onClick={saveEdit}>Save</Button></div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            <Dialog open={createOpen} onOpenChange={setCreateOpen}>
                <DialogContent className="max-w-lg">
                    <DialogHeader><DialogTitle>Create Admin User</DialogTitle></DialogHeader>
                    <div className="space-y-3">
                        <Input placeholder="Email" value={createForm.email} onChange={(e) => setCreateForm({ ...createForm, email: e.target.value })} />
                        <Input type="password" placeholder="Password" value={createForm.password} onChange={(e) => setCreateForm({ ...createForm, password: e.target.value })} />
                        <Input placeholder="Full Name" value={createForm.full_name} onChange={(e) => setCreateForm({ ...createForm, full_name: e.target.value })} />
                        <select className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm" value={createForm.role} onChange={(e) => setCreateForm({ ...createForm, role: e.target.value as AdminProfile["role"] })}>
                            {roles.map((role) => <option key={role} value={role}>{role}</option>)}
                        </select>
                        <div className="flex justify-end"><Button onClick={createUser}>Create</Button></div>
                    </div>
                </DialogContent>
            </Dialog>
        </AdminLayout>
    );
}
