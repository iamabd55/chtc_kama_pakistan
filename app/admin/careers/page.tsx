"use client";

import { useEffect, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import DataTable from "@/components/admin/DataTable";
import StatusBadge from "@/components/admin/StatusBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { adminDb } from "@/lib/supabase/adminClient";
import { Plus, Pencil, Trash2, Search, Briefcase, MapPin, Clock, Calendar, FileText, ListChecks, ClipboardList, DollarSign } from "lucide-react";
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

/* ─── small reusable field wrapper ─── */
function Field({
    label,
    required,
    icon: Icon,
    children,
    className = "",
}: {
    label: string;
    required?: boolean;
    icon?: React.ElementType;
    children: React.ReactNode;
    className?: string;
}) {
    return (
        <div className={`space-y-1.5 ${className}`}>
            <label className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-white/50">
                {Icon && <Icon className="w-3.5 h-3.5" />}
                {label}
                {required && <span className="text-[#e07a2f]">*</span>}
            </label>
            {children}
        </div>
    );
}

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
            is_active: true,  // always active — shown immediately on client side
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
            toast({ title: "Missing required fields", description: "Please fill in Title, Department, Description and Deadline.", variant: "destructive" });
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
            is_active: true, // always publish immediately
        };

        if (editing.id) {
            const { error } = await adminDb
                .from("career_posts")
                .update(payload)
                .eq("id", editing.id);
            if (error)
                toast({ title: "Error", description: error.message, variant: "destructive" });
            else toast({ title: "Career post updated ✓" });
        } else {
            const { error } = await adminDb.from("career_posts").insert(payload);
            if (error)
                toast({ title: "Error", description: error.message, variant: "destructive" });
            else toast({ title: "Career post created ✓" });
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
                    <p className="text-xs text-white/40">{r.department}</p>
                </div>
            ),
        },
        {
            header: "Type",
            accessor: (r: CareerPost) => (
                <span className="capitalize text-sm px-2 py-0.5 rounded-full bg-white/[0.06] text-white/70">{r.job_type}</span>
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
                <Button onClick={openNew} className="font-display font-semibold bg-[#e07a2f] hover:bg-[#c96a25]">
                    <Plus className="w-4 h-4 mr-2" /> Add Position
                </Button>
            }
        >
            <div className="mb-6 max-w-sm relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                <Input
                    placeholder="Search positions..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-10"
                />
            </div>

            <DataTable columns={columns} data={filteredPosts} loading={loading} />

            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent className="max-w-2xl max-h-[88vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="font-display flex items-center gap-2">
                            <Briefcase className="w-5 h-5 text-[#e07a2f]" />
                            {editing?.id ? "Edit Career Post" : "New Career Post"}
                        </DialogTitle>
                    </DialogHeader>

                    {editing && (
                        <div className="mt-4 space-y-6">
                            {/* ── Basic Info ── */}
                            <div>
                                <p className="text-[11px] font-bold uppercase tracking-widest text-white/30 mb-3">Basic Info</p>
                                <div className="grid grid-cols-1 gap-4">
                                    <Field label="Job Title" required icon={Briefcase}>
                                        <Input
                                            id="career-title"
                                            placeholder="e.g. Fleet Sales Executive"
                                            value={editing.title || ""}
                                            onChange={(e) =>
                                                setEditing({ ...editing, title: e.target.value })
                                            }
                                        />
                                    </Field>

                                    <div className="grid grid-cols-2 gap-4">
                                        <Field label="Department" required>
                                            <Input
                                                id="career-department"
                                                placeholder="e.g. After Sales"
                                                value={editing.department || ""}
                                                onChange={(e) =>
                                                    setEditing({ ...editing, department: e.target.value })
                                                }
                                            />
                                        </Field>
                                        <Field label="Job Type" icon={Clock}>
                                            <select
                                                id="career-job-type"
                                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
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
                                                        {t.charAt(0).toUpperCase() + t.slice(1)}
                                                    </option>
                                                ))}
                                            </select>
                                        </Field>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <Field label="Location" icon={MapPin}>
                                            <Input
                                                id="career-location"
                                                placeholder="e.g. Lahore, Pakistan"
                                                value={editing.location || ""}
                                                onChange={(e) =>
                                                    setEditing({ ...editing, location: e.target.value })
                                                }
                                            />
                                        </Field>
                                        <Field label="Application Deadline" required icon={Calendar}>
                                            <Input
                                                id="career-deadline"
                                                type="date"
                                                value={editing.deadline || ""}
                                                onChange={(e) =>
                                                    setEditing({ ...editing, deadline: e.target.value })
                                                }
                                            />
                                        </Field>
                                    </div>

                                    <Field label="Salary Range (optional)" icon={DollarSign}>
                                        <Input
                                            id="career-salary"
                                            placeholder="e.g. PKR 60,000 – 80,000 / month"
                                            value={editing.salary_range || ""}
                                            onChange={(e) =>
                                                setEditing({ ...editing, salary_range: e.target.value })
                                            }
                                        />
                                    </Field>
                                </div>
                            </div>

                            {/* ── Description ── */}
                            <div className="border-t border-white/[0.06] pt-5">
                                <p className="text-[11px] font-bold uppercase tracking-widest text-white/30 mb-3">Description</p>
                                <Field label="Role Description" required icon={FileText}>
                                    <textarea
                                        id="career-description"
                                        className="flex w-full rounded-md border border-input bg-background px-3 py-2.5 text-sm min-h-[110px] ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-y"
                                        placeholder="Describe the role, context, and team…"
                                        value={editing.description || ""}
                                        onChange={(e) =>
                                            setEditing({ ...editing, description: e.target.value })
                                        }
                                    />
                                </Field>
                            </div>

                            {/* ── Lists ── */}
                            <div className="border-t border-white/[0.06] pt-5">
                                <p className="text-[11px] font-bold uppercase tracking-widest text-white/30 mb-3">Lists <span className="normal-case font-normal text-white/25">(one item per line)</span></p>
                                <div className="grid grid-cols-1 gap-4">
                                    <Field label="Requirements" icon={ListChecks}>
                                        <textarea
                                            id="career-requirements"
                                            className="flex w-full rounded-md border border-input bg-background px-3 py-2.5 text-sm min-h-[90px] ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-y"
                                            placeholder={"Bachelor's degree in relevant field\n2+ years experience\nValid driving license"}
                                            value={serializeList(editing.requirements)}
                                            onChange={(e) =>
                                                setEditing({
                                                    ...editing,
                                                    requirements: parseList(e.target.value),
                                                })
                                            }
                                        />
                                    </Field>
                                    <Field label="Responsibilities" icon={ClipboardList}>
                                        <textarea
                                            id="career-responsibilities"
                                            className="flex w-full rounded-md border border-input bg-background px-3 py-2.5 text-sm min-h-[90px] ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-y"
                                            placeholder={"Manage client relationships\nCoordinate with service team\nPrepare weekly reports"}
                                            value={serializeList(editing.responsibilities)}
                                            onChange={(e) =>
                                                setEditing({
                                                    ...editing,
                                                    responsibilities: parseList(e.target.value),
                                                })
                                            }
                                        />
                                    </Field>
                                </div>
                            </div>

                            {/* ── Actions ── */}
                            <div className="flex justify-end gap-3 pt-2 border-t border-white/[0.06]">
                                <Button
                                    variant="outline"
                                    onClick={() => setDialogOpen(false)}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    onClick={handleSave}
                                    disabled={saving}
                                    className="bg-[#e07a2f] hover:bg-[#c96a25] font-semibold min-w-[120px]"
                                >
                                    {saving ? "Saving…" : editing?.id ? "Update Post" : "Create Post"}
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
