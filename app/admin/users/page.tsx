"use client";

import { useEffect, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import DataTable from "@/components/admin/DataTable";
import StatusBadge from "@/components/admin/StatusBadge";
import AvatarLabel from "@/components/admin/AvatarLabel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import type { AdminProfile } from "@/lib/supabase/types";

const roles: AdminProfile["role"][] = ["super_admin", "editor", "sales", "hr"];

type AdminAuthUser = {
    id: string;
    user_id: string;
    email: string;
    full_name: string | null;
    role: AdminProfile["role"];
    is_active: boolean;
    created_at: string;
    updated_at: string;
    last_sign_in_at: string | null;
};

type UsersApiResponse = {
    users?: AdminAuthUser[];
    permissions?: {
        canManage?: boolean;
    };
    error?: string;
};

export default function AdminUsersPage() {
    const [items, setItems] = useState<AdminAuthUser[]>([]);
    const [canManage, setCanManage] = useState(false);
    const [loading, setLoading] = useState(true);
    const [open, setOpen] = useState(false);
    const [editing, setEditing] = useState<Partial<AdminAuthUser> | null>(null);
    const [createOpen, setCreateOpen] = useState(false);
    const [createForm, setCreateForm] = useState({ email: "", password: "", full_name: "", role: "editor" as AdminProfile["role"] });

    const fetchData = async () => {
        setLoading(true);
        const response = await fetch("/api/admin/users");
        const payload = (await response.json().catch(() => ({}))) as UsersApiResponse;

        if (!response.ok) {
            toast({ title: "Error", description: payload?.error || "Failed to load users", variant: "destructive" });
            setItems([]);
            setLoading(false);
            return;
        }

        const users = payload?.users || [];
        users.sort((a, b) => (a.created_at < b.created_at ? 1 : -1));
        setItems(users);
        setCanManage(Boolean(payload?.permissions?.canManage));
        setLoading(false);
    };

    useEffect(() => {
        fetchData();
    }, []);

    const saveEdit = async () => {
        if (!editing?.id) return;

        const response = await fetch("/api/admin/users", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                id: editing.id,
                full_name: editing.full_name || null,
                role: editing.role || "editor",
                is_active: editing.is_active ?? true,
            }),
        });

        const payload = await response.json().catch(() => ({}));

        if (!response.ok) toast({ title: "Error", description: payload?.error || "Failed to update user", variant: "destructive" });
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

    const inviteUser = async () => {
        if (!createForm.email) {
            toast({ title: "Email is required", variant: "destructive" });
            return;
        }

        const response = await fetch("/api/admin/users", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                mode: "invite",
                email: createForm.email,
                full_name: createForm.full_name,
                role: createForm.role,
                redirect_to: `${window.location.origin}/admin/login`,
            }),
        });

        const data = await response.json().catch(() => ({}));
        if (!response.ok) {
            toast({ title: "Error", description: data?.error || "Failed to invite user", variant: "destructive" });
            return;
        }

        toast({ title: "Invitation sent" });
        setCreateOpen(false);
        setCreateForm({ email: "", password: "", full_name: "", role: "editor" });
        fetchData();
    };

    const deleteUser = async (id: string) => {
        if (!confirm("Delete this admin user?")) return;

        const response = await fetch(`/api/admin/users?id=${encodeURIComponent(id)}`, {
            method: "DELETE",
        });

        const payload = await response.json().catch(() => ({}));

        if (!response.ok) {
            toast({ title: "Error", description: payload?.error || "Failed to delete admin user", variant: "destructive" });
            return;
        }

        toast({ title: "Admin user deleted" });
        fetchData();
    };

    const columns = [
        {
            header: "User",
            accessor: (row: AdminAuthUser) => (
                <AvatarLabel name={row.full_name || row.email} subtitle={row.email} />
            ),
        },
        { header: "Role", accessor: (row: AdminAuthUser) => <span className="uppercase text-xs font-semibold">{row.role}</span> },
        { header: "Status", accessor: (row: AdminAuthUser) => <StatusBadge status={row.is_active ? "active" : "inactive"} /> },
        {
            header: "Actions",
            accessor: (row: AdminAuthUser) => (
                <div className="flex items-center gap-1">
                    <Button size="sm" variant="ghost" onClick={() => { setEditing(row); setOpen(true); }}>
                        <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                        size="sm"
                        variant="ghost"
                        className="text-destructive"
                        onClick={() => deleteUser(row.id)}
                    >
                        <Trash2 className="w-4 h-4" />
                    </Button>
                </div>
            ),
        },
    ];

    return (
        <AdminLayout
            title="Admin Users"
            subtitle={`${items.length} admin users`}
            actions={
                canManage ? (
                <Button onClick={() => setCreateOpen(true)}>
                    <Plus className="w-4 h-4 mr-2" /> Add Admin
                </Button>
                ) : null
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
                        <Input type="password" placeholder="Password (required only for Create Now)" value={createForm.password} onChange={(e) => setCreateForm({ ...createForm, password: e.target.value })} />
                        <Input placeholder="Full Name" value={createForm.full_name} onChange={(e) => setCreateForm({ ...createForm, full_name: e.target.value })} />
                        <select className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm" value={createForm.role} onChange={(e) => setCreateForm({ ...createForm, role: e.target.value as AdminProfile["role"] })}>
                            {roles.map((role) => <option key={role} value={role}>{role}</option>)}
                        </select>
                        <div className="flex justify-end gap-2">
                            <Button variant="outline" onClick={inviteUser}>Invite by Email</Button>
                            <Button onClick={createUser}>Create Now</Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </AdminLayout>
    );
}
