"use client";

import { useEffect, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import DataTable from "@/components/admin/DataTable";
import StatusBadge from "@/components/admin/StatusBadge";
import { adminDb } from "@/lib/supabase/adminClient";
import { getStorageUrl } from "@/lib/supabase/storage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import type { Team, TeamMember } from "@/lib/supabase/types";

type TeamMemberWithTeam = TeamMember & {
    team: Pick<Team, "id" | "name" | "slug"> | null;
};

export default function AdminTeamPage() {
    const [items, setItems] = useState<TeamMemberWithTeam[]>([]);
    const [teams, setTeams] = useState<Team[]>([]);
    const [loading, setLoading] = useState(true);
    const [open, setOpen] = useState(false);
    const [editing, setEditing] = useState<Partial<TeamMember> | null>(null);
    const [photoFile, setPhotoFile] = useState<File | null>(null);
    const [saving, setSaving] = useState(false);

    const uploadPhoto = async (file: File) => {
        const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
        const uploadPath = `team/members/${Date.now()}-${safeName}`;

        const { error } = await adminDb.storage
            .from("images")
            .upload(uploadPath, file, {
                contentType: file.type || "application/octet-stream",
                upsert: false,
            });

        if (error) {
            throw new Error(error.message);
        }

        return uploadPath;
    };

    const fetchData = async () => {
        setLoading(true);
        const [{ data: members }, { data: teamRows }] = await Promise.all([
            adminDb.from("team_members").select("*, team:teams(id, name, slug)").order("display_order"),
            adminDb.from("teams").select("*").eq("is_active", true).order("display_order"),
        ]);

        setItems((members as TeamMemberWithTeam[]) || []);
        setTeams((teamRows as Team[]) || []);
        setLoading(false);
    };

    useEffect(() => {
        fetchData();
    }, []);

    const save = async () => {
        if (!editing?.name || !editing?.role || !editing?.team_id) {
            toast({ title: "Team, name and role are required", variant: "destructive" });
            return;
        }

        setSaving(true);

        let photoPath = editing.photo_url || null;

        try {
            if (photoFile) {
                photoPath = await uploadPhoto(photoFile);
            }
        } catch (error) {
            setSaving(false);
            toast({
                title: "Photo upload failed",
                description: error instanceof Error ? error.message : "Could not upload image",
                variant: "destructive",
            });
            return;
        }

        const payload = {
            team_id: editing.team_id,
            name: editing.name,
            role: editing.role,
            photo_url: photoPath,
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
            setEditing(null);
            setPhotoFile(null);
            fetchData();
        }

        setSaving(false);
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
        {
            header: "Name",
            accessor: (row: TeamMemberWithTeam) => (
                <div className="flex items-center gap-2.5">
                    {row.photo_url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                            src={row.photo_url.startsWith("/") ? row.photo_url : getStorageUrl(row.photo_url)}
                            alt={row.name}
                            className="h-8 w-8 rounded-full object-cover border border-slate-200"
                        />
                    ) : (
                        <div className="h-8 w-8 rounded-full border border-slate-200 bg-slate-100 text-slate-600 flex items-center justify-center text-xs font-semibold">
                            {row.name
                                .split(" ")
                                .map((part) => part.trim())
                                .filter(Boolean)
                                .slice(0, 2)
                                .map((part) => part[0]?.toUpperCase() || "")
                                .join("") || "U"}
                        </div>
                    )}
                    <span className="font-medium">{row.name}</span>
                </div>
            ),
        },
        {
            header: "Team",
            accessor: (row: TeamMemberWithTeam) => row.team?.name || "—",
        },
        { header: "Role", accessor: "role" as keyof TeamMember },
        {
            header: "Status",
            accessor: (row: TeamMember) => <StatusBadge status={row.is_active ? "active" : "inactive"} />,
        },
        {
            header: "Actions",
            accessor: (row: TeamMember) => (
                <div className="flex gap-2">
                    <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                            setEditing(row);
                            setPhotoFile(null);
                            setOpen(true);
                        }}
                    >
                        <Pencil className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="ghost" className="text-destructive" onClick={() => remove(row.id)}><Trash2 className="w-4 h-4" /></Button>
                </div>
            ),
        },
    ];

    return (
        <AdminLayout
            title="Team Management"
            subtitle={`${items.length} team members`}
            actions={
                <Button
                    onClick={() => {
                        setEditing({
                            team_id: teams[0]?.id || "",
                            is_active: true,
                            display_order: 0,
                        });
                        setPhotoFile(null);
                        setOpen(true);
                    }}
                >
                    <Plus className="w-4 h-4 mr-2" />Add Member
                </Button>
            }
        >
            <DataTable columns={columns} data={items} loading={loading} />

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="w-[calc(100vw-1.5rem)] max-w-lg max-h-[88vh] p-4 sm:p-6 overflow-hidden">
                    <DialogHeader><DialogTitle>{editing?.id ? "Edit" : "Add"} Team Member</DialogTitle></DialogHeader>
                    {editing && (
                        <div className="space-y-4 overflow-y-auto pr-1 pb-1 max-h-[calc(88vh-4.5rem)]">
                            <div className="space-y-2">
                                <label htmlFor="team_id" className="text-sm font-medium">Team</label>
                                <select
                                    id="team_id"
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                    value={editing.team_id || ""}
                                    onChange={(e) => setEditing({ ...editing, team_id: e.target.value })}
                                >
                                    <option value="">Select team</option>
                                    {teams.map((team) => (
                                        <option key={team.id} value={team.id}>
                                            {team.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label htmlFor="member_name" className="text-sm font-medium">Member Name</label>
                                <Input id="member_name" placeholder="e.g. Muneeb Ibrahim" value={editing.name || ""} onChange={(e) => setEditing({ ...editing, name: e.target.value })} />
                            </div>
                            <div className="space-y-2">
                                <label htmlFor="member_role" className="text-sm font-medium">Role / Title</label>
                                <Input id="member_role" placeholder="e.g. CEO" value={editing.role || ""} onChange={(e) => setEditing({ ...editing, role: e.target.value })} />
                            </div>
                            <div className="space-y-2">
                                <label htmlFor="profile_photo" className="text-sm font-medium">Profile Photo</label>
                                <Input
                                    id="profile_photo"
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => setPhotoFile(e.target.files?.[0] ?? null)}
                                />
                                <p className="text-xs text-muted-foreground">Image will be uploaded to Supabase Storage.</p>
                                {(photoFile || editing.photo_url) && (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img
                                        src={photoFile ? URL.createObjectURL(photoFile) : (editing.photo_url?.startsWith("/") ? editing.photo_url : getStorageUrl(editing.photo_url || ""))}
                                        alt="Member preview"
                                        className="h-24 w-24 rounded-md object-cover border"
                                    />
                                )}
                            </div>
                            <div className="space-y-2">
                                <label htmlFor="member_bio" className="text-sm font-medium">Bio</label>
                                <textarea id="member_bio" className="w-full border rounded-md px-3 py-2 text-sm" rows={4} placeholder="Short description about this member" value={editing.bio || ""} onChange={(e) => setEditing({ ...editing, bio: e.target.value })} />
                            </div>
                            <div className="space-y-2">
                                <label htmlFor="display_order" className="text-sm font-medium">Display Order</label>
                                <Input id="display_order" type="number" value={editing.display_order || 0} onChange={(e) => setEditing({ ...editing, display_order: Number.parseInt(e.target.value || "0", 10) })} />
                                <p className="text-xs text-muted-foreground">Lower number appears first (0 = top, 1 = second, 2 = third, 3 = fourth).</p>
                            </div>
                            <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={editing.is_active ?? true} onChange={(e) => setEditing({ ...editing, is_active: e.target.checked })} />Active</label>
                            <div className="flex justify-end pt-1"><Button className="w-full sm:w-auto" onClick={save} disabled={saving}>{saving ? "Saving..." : "Save"}</Button></div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </AdminLayout>
    );
}
