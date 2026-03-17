"use client";

import { useEffect, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import DataTable from "@/components/admin/DataTable";
import StatusBadge from "@/components/admin/StatusBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { adminDb } from "@/lib/supabase/adminClient";
import { Plus, Pencil, Trash2, Search } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import type { CareerPost } from "@/lib/supabase/types";

const jobTypes = [
    "full-time",
    "part-time",
    "contract",
    "internship",
] as const;

const serializeList = (items?: string[]) => (items ?? []).join("\n");

const parseList = (value: string): string[] =>
    value
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter(Boolean);

const AdminCareers = () => {
    const [posts, setPosts] = useState<CareerPost[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editing, setEditing] = useState<Partial<CareerPost> | null>(null);
    const [saving, setSaving] = useState(false);

    const fetchData = async () => {
        setLoading(true);
        const { data } = await adminDb
            .from("career_posts")
            .select("*")
            .order("created_at", { ascending: false });
        setPosts((data as CareerPost[]) || []);
        setLoading(false);
    };

    useEffect(() => {
        fetchData();
    }, []);

    const filteredPosts = posts.filter(
        (p) =>
            p.title.toLowerCase().includes(search.toLowerCase()) ||
            p.department.toLowerCase().includes(search.toLowerCase()) ||
            p.location.toLowerCase().includes(search.toLowerCase())
    );

    const openNew = () => {
        setEditing({
            job_type: "full-time",
            is_active: true,
            location: "Lahore, Pakistan",
            requirements: [],
            responsibilities: [],
        });
        setDialogOpen(true);
    };
    const openEdit = (p: CareerPost) => {
        setEditing({ ...p });
        setDialogOpen(true);
    };

    const handleSave = async () => {
        if (
            !editing?.title ||
            !editing?.department ||
            !editing?.description ||
            !editing?.deadline
        ) {
            toast({ title: "Missing required fields", variant: "destructive" });
            return;
        }
        setSaving(true);
        const payload = {
            title: editing.title,
            department: editing.department,
            location: editing.location || "Lahore, Pakistan",
            job_type: editing.job_type || "full-time",
            description: editing.description,
            requirements: editing.requirements || [],
            responsibilities: editing.responsibilities || [],
            salary_range: editing.salary_range || null,
            deadline: editing.deadline,
            is_active: editing.is_active ?? true,
        };

        if (editing.id) {
            const { error } = await adminDb
                .from("career_posts")
                .update(payload)
                .eq("id", editing.id);
            if (error)
                toast({ title: "Error", description: error.message, variant: "destructive" });
            else toast({ title: "Career post updated" });
        } else {
            const { error } = await adminDb.from("career_posts").insert(payload);
            if (error)
                toast({ title: "Error", description: error.message, variant: "destructive" });
            else toast({ title: "Career post created" });
        }
        setSaving(false);
        setDialogOpen(false);
        fetchData();
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Delete this career post?")) return;
        const { error } = await adminDb
            .from("career_posts")
            .delete()
            .eq("id", id);
        if (error)
            toast({ title: "Error", description: error.message, variant: "destructive" });
        else {
            toast({ title: "Deleted" });
            fetchData();
        }
    };

    const columns = [
        {
            header: "Title",
            accessor: (r: CareerPost) => (
                <div>
                    <p className="font-medium">{r.title}</p>
                    <p className="text-xs text-muted-foreground">{r.department}</p>
                </div>
            ),
        },
        {
            header: "Type",
            accessor: (r: CareerPost) => (
                <span className="capitalize text-sm">{r.job_type}</span>
            ),
        },
        { header: "Location", accessor: "location" as keyof CareerPost },
        {
            header: "Deadline",
            accessor: (r: CareerPost) => (
                <span className="text-sm">
                    {new Date(r.deadline).toLocaleDateString()}
                </span>
            ),
        },
        {
            header: "Status",
            accessor: (r: CareerPost) => (
                <StatusBadge status={r.is_active ? "active" : "inactive"} />
            ),
        },
        {
            header: "Actions",
            accessor: (r: CareerPost) => (
                <div className="flex gap-2">
                    <Button
                        size="sm"
                        variant="ghost"
                        onClick={(e) => {
                            e.stopPropagation();
                            openEdit(r);
                        }}
                    >
                        <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                        size="sm"
                        variant="ghost"
                        className="text-destructive"
                        onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(r.id);
                        }}
                    >
                        <Trash2 className="w-4 h-4" />
                    </Button>
                </div>
            ),
            className: "w-[100px]",
        },
    ];

    return (
        <AdminLayout
            title="Career Posts"
            subtitle={`${posts.length} positions`}
            actions={
                <Button onClick={openNew} className="font-display font-semibold">
                    <Plus className="w-4 h-4 mr-2" /> Add Position
                </Button>
            }
        >
            <div className="mb-6 max-w-sm relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                    placeholder="Search positions..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-10"
                />
            </div>

            <DataTable columns={columns} data={filteredPosts} loading={loading} />

            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="font-display">
                            {editing?.id ? "Edit" : "Add"} Career Post
                        </DialogTitle>
                    </DialogHeader>
                    {editing && (
                        <div className="grid grid-cols-2 gap-4 mt-4">
                            <div className="col-span-2">
                                <label className="text-sm font-medium mb-1 block">Title *</label>
                                <Input
                                    value={editing.title || ""}
                                    onChange={(e) =>
                                        setEditing({ ...editing, title: e.target.value })
                                    }
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium mb-1 block">
                                    Department *
                                </label>
                                <Input
                                    value={editing.department || ""}
                                    onChange={(e) =>
                                        setEditing({ ...editing, department: e.target.value })
                                    }
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium mb-1 block">Job Type</label>
                                <select
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                    value={editing.job_type || "full-time"}
                                    onChange={(e) =>
                                        setEditing({
                                            ...editing,
                                            job_type: e.target.value as CareerPost["job_type"],
                                        })
                                    }
                                >
                                    {jobTypes.map((t) => (
                                        <option key={t} value={t} className="capitalize">
                                            {t}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="text-sm font-medium mb-1 block">Location</label>
                                <Input
                                    value={editing.location || ""}
                                    onChange={(e) =>
                                        setEditing({ ...editing, location: e.target.value })
                                    }
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium mb-1 block">
                                    Deadline *
                                </label>
                                <Input
                                    type="date"
                                    value={editing.deadline || ""}
                                    onChange={(e) =>
                                        setEditing({ ...editing, deadline: e.target.value })
                                    }
                                />
                            </div>
                            <div className="col-span-2">
                                <label className="text-sm font-medium mb-1 block">
                                    Description *
                                </label>
                                <textarea
                                    className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm min-h-[100px]"
                                    value={editing.description || ""}
                                    onChange={(e) =>
                                        setEditing({ ...editing, description: e.target.value })
                                    }
                                />
                            </div>
                            <div className="col-span-2">
                                <label className="text-sm font-medium mb-1 block">
                                    Requirements (one per line)
                                </label>
                                <textarea
                                    className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm min-h-[90px]"
                                    value={serializeList(editing.requirements)}
                                    onChange={(e) =>
                                        setEditing({
                                            ...editing,
                                            requirements: parseList(e.target.value),
                                        })
                                    }
                                />
                            </div>
                            <div className="col-span-2">
                                <label className="text-sm font-medium mb-1 block">
                                    Responsibilities (one per line)
                                </label>
                                <textarea
                                    className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm min-h-[90px]"
                                    value={serializeList(editing.responsibilities)}
                                    onChange={(e) =>
                                        setEditing({
                                            ...editing,
                                            responsibilities: parseList(e.target.value),
                                        })
                                    }
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium mb-1 block">
                                    Salary Range
                                </label>
                                <Input
                                    value={editing.salary_range || ""}
                                    onChange={(e) =>
                                        setEditing({ ...editing, salary_range: e.target.value })
                                    }
                                />
                            </div>
                            <div className="flex items-end">
                                <label className="flex items-center gap-2 text-sm">
                                    <input
                                        type="checkbox"
                                        checked={editing.is_active ?? true}
                                        onChange={(e) =>
                                            setEditing({ ...editing, is_active: e.target.checked })
                                        }
                                    />
                                    Active
                                </label>
                            </div>
                            <div className="col-span-2 flex justify-end gap-3 pt-4 border-t">
                                <Button
                                    variant="outline"
                                    onClick={() => setDialogOpen(false)}
                                >
                                    Cancel
                                </Button>
                                <Button onClick={handleSave} disabled={saving}>
                                    {saving ? "Saving..." : "Save"}
                                </Button>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </AdminLayout>
    );
};

export default AdminCareers;
