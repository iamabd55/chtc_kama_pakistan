"use client";

import { useEffect, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import DataTable from "@/components/admin/DataTable";
import StatusBadge from "@/components/admin/StatusBadge";
import AvatarLabel from "@/components/admin/AvatarLabel";
import { Button } from "@/components/ui/button";
import { adminDb } from "@/lib/supabase/adminClient";
import { ExternalLink, Search, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import type { JobApplication } from "@/lib/supabase/types";

const appStatuses = [
    "received",
    "reviewed",
    "shortlisted",
    "rejected",
    "hired",
] as const;

type ApplicationWithTitle = JobApplication & { career_title?: string };

const AdminApplications = () => {
    const [apps, setApps] = useState<ApplicationWithTitle[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [filterStatus, setFilterStatus] = useState<string>("all");
    const [detailOpen, setDetailOpen] = useState(false);
    const [selected, setSelected] = useState<ApplicationWithTitle | null>(null);

    const fetchData = async () => {
        setLoading(true);
        const { data } = await adminDb
            .from("job_applications")
            .select("*, career_posts(title)")
            .order("applied_at", { ascending: false });

        const mapped = ((data || []) as (JobApplication & { career_posts: { title: string } | null })[]).map((d) => ({
            ...d,
            career_title: d.career_posts?.title || "—",
        }));
        setApps(mapped);
        setLoading(false);
    };

    useEffect(() => {
        fetchData();
    }, []);

    const filtered = apps.filter(
        (a) => {
            if (filterStatus !== "all" && a.status !== filterStatus) return false;
            const query = search.toLowerCase();
            return (
                a.applicant_name.toLowerCase().includes(query) ||
                a.email.toLowerCase().includes(query) ||
                a.phone.toLowerCase().includes(query) ||
                (a.career_title || "").toLowerCase().includes(query)
            );
        }
    );

    const updateStatus = async (id: string, status: string) => {
        const { error } = await adminDb
            .from("job_applications")
            .update({ status, updated_at: new Date().toISOString() })
            .eq("id", id);
        if (error)
            toast({ title: "Error", description: error.message, variant: "destructive" });
        else {
            toast({ title: "Status updated" });
            fetchData();
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Delete this job application?")) return;

        const { error } = await adminDb
            .from("job_applications")
            .delete()
            .eq("id", id);

        if (error) {
            toast({ title: "Error", description: error.message, variant: "destructive" });
            return;
        }

        toast({ title: "Deleted" });
        setSelected((current) => (current?.id === id ? null : current));
        setDetailOpen((current) => (selected?.id === id ? false : current));
        fetchData();
    };

    const columns = [
        {
            header: "Applicant",
            accessor: (r: ApplicationWithTitle) => (
                <AvatarLabel name={r.applicant_name} subtitle={r.email} />
            ),
        },
        {
            header: "Position",
            accessor: (r: ApplicationWithTitle) => (
                <span className="text-sm">{r.career_title}</span>
            ),
        },
        { header: "Phone", accessor: "phone" as keyof ApplicationWithTitle },
        {
            header: "Status",
            accessor: (r: ApplicationWithTitle) => <StatusBadge status={r.status} />,
        },
        {
            header: "Applied",
            accessor: (r: ApplicationWithTitle) => (
                <span className="text-sm text-muted-foreground">
                    {new Date(r.applied_at).toLocaleDateString()}
                </span>
            ),
        },
        {
            header: "",
            accessor: (r: ApplicationWithTitle) => (
                <div className="flex gap-2">
                    <Button
                        size="sm"
                        variant="ghost"
                        onClick={(e) => {
                            e.stopPropagation();
                            setSelected(r);
                            setDetailOpen(true);
                        }}
                    >
                        View
                    </Button>
                    {r.cv_url && (
                        <a
                            href={r.cv_url}
                            target="_blank"
                            rel="noreferrer"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <Button size="sm" variant="ghost">
                                <ExternalLink className="w-4 h-4" />
                            </Button>
                        </a>
                    )}
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
            className: "w-[160px]",
        },
    ];

    return (
        <AdminLayout
            title="Job Applications"
            subtitle={`${apps.length} applications`}
        >
            <div className="mb-6 flex flex-col sm:flex-row gap-4">
                <div className="relative max-w-sm w-full">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                        placeholder="Search applicants..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-10"
                    />
                </div>
                <div className="flex gap-2 flex-wrap">
                    <Button
                        size="sm"
                        variant={filterStatus === "all" ? "default" : "outline"}
                        onClick={() => setFilterStatus("all")}
                    >
                        All
                    </Button>
                    {appStatuses.map((status) => (
                        <Button
                            key={status}
                            size="sm"
                            variant={filterStatus === status ? "default" : "outline"}
                            onClick={() => setFilterStatus(status)}
                            className="capitalize"
                        >
                            {status}
                        </Button>
                    ))}
                </div>
            </div>

            <DataTable columns={columns} data={filtered} loading={loading} />

            <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
                <DialogContent className="max-w-lg">
                    <DialogHeader>
                        <DialogTitle className="font-display">
                            Application Details
                        </DialogTitle>
                    </DialogHeader>
                    {selected && (
                        <div className="space-y-4 mt-4">
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <span className="text-muted-foreground">Name:</span>
                                    <p className="font-medium">{selected.applicant_name}</p>
                                </div>
                                <div>
                                    <span className="text-muted-foreground">Email:</span>
                                    <p className="font-medium">{selected.email}</p>
                                </div>
                                <div>
                                    <span className="text-muted-foreground">Phone:</span>
                                    <p className="font-medium">{selected.phone}</p>
                                </div>
                                <div>
                                    <span className="text-muted-foreground">Applied:</span>
                                    <p className="font-medium">
                                        {new Date(selected.applied_at).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>
                            {selected.cover_letter && (
                                <div>
                                    <span className="text-sm text-muted-foreground">
                                        Cover Letter:
                                    </span>
                                    <p className="text-sm bg-muted p-3 rounded-lg mt-1">
                                        {selected.cover_letter}
                                    </p>
                                </div>
                            )}
                            {selected.cv_url && (
                                <a
                                    href={selected.cv_url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline-flex items-center gap-2 text-sm text-primary hover:underline"
                                >
                                    <ExternalLink className="w-4 h-4" /> View CV
                                </a>
                            )}
                            <div className="pt-2 border-t">
                                <Button
                                    variant="destructive"
                                    onClick={() => handleDelete(selected.id)}
                                >
                                    <Trash2 className="w-4 h-4 mr-2" /> Delete Application
                                </Button>
                            </div>
                            <div>
                                <label className="text-sm font-medium mb-1 block">Status</label>
                                <select
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                    value={selected.status}
                                    onChange={(e) => {
                                        updateStatus(selected.id, e.target.value);
                                        setSelected({
                                            ...selected,
                                            status: e.target.value as JobApplication["status"],
                                        });
                                    }}
                                >
                                    {appStatuses.map((s) => (
                                        <option key={s} value={s} className="capitalize">
                                            {s}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </AdminLayout>
    );
};

export default AdminApplications;
