"use client";

import { useEffect, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import DataTable from "@/components/admin/DataTable";
import StatusBadge from "@/components/admin/StatusBadge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { adminDb } from "@/lib/supabase/adminClient";
import { Search, Eye } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import type { Inquiry } from "@/lib/supabase/types";

const statuses = [
    "new",
    "contacted",
    "in-progress",
    "converted",
    "closed",
] as const;

const AdminInquiries = () => {
    const [inquiries, setInquiries] = useState<Inquiry[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [filterStatus, setFilterStatus] = useState<string>("all");
    const [detailOpen, setDetailOpen] = useState(false);
    const [selected, setSelected] = useState<Inquiry | null>(null);

    const fetchData = async () => {
        setLoading(true);
        let query = adminDb
            .from("inquiries")
            .select("*")
            .order("created_at", { ascending: false });
        if (filterStatus !== "all") query = query.eq("status", filterStatus);
        const { data } = await query;
        setInquiries((data as Inquiry[]) || []);
        setLoading(false);
    };

    useEffect(() => {
        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filterStatus]);

    const filtered = inquiries.filter(
        (i) =>
            i.full_name.toLowerCase().includes(search.toLowerCase()) ||
            i.city.toLowerCase().includes(search.toLowerCase()) ||
            i.phone.includes(search)
    );

    const updateStatus = async (id: string, status: string) => {
        const { error } = await adminDb
            .from("inquiries")
            .update({ status, updated_at: new Date().toISOString() })
            .eq("id", id);
        if (error)
            toast({ title: "Error", description: error.message, variant: "destructive" });
        else {
            toast({ title: "Status updated" });
            fetchData();
            if (selected?.id === id)
                setSelected({ ...selected!, status: status as Inquiry["status"] });
        }
    };

    const updateNotes = async (id: string, notes: string) => {
        await adminDb
            .from("inquiries")
            .update({ notes, updated_at: new Date().toISOString() })
            .eq("id", id);
    };

    const columns = [
        {
            header: "Name",
            accessor: (r: Inquiry) => (
                <div>
                    <p className="font-medium">{r.full_name}</p>
                    <p className="text-xs text-muted-foreground">{r.email || "—"}</p>
                </div>
            ),
        },
        { header: "Phone", accessor: "phone" as keyof Inquiry },
        { header: "City", accessor: "city" as keyof Inquiry },
        {
            header: "Type",
            accessor: (r: Inquiry) => (
                <span className="capitalize text-sm">{r.inquiry_type}</span>
            ),
        },
        {
            header: "Source",
            accessor: (r: Inquiry) => (
                <span className="capitalize text-xs">{r.source}</span>
            ),
        },
        {
            header: "Status",
            accessor: (r: Inquiry) => <StatusBadge status={r.status} />,
        },
        {
            header: "Date",
            accessor: (r: Inquiry) => (
                <span className="text-sm text-muted-foreground">
                    {new Date(r.created_at).toLocaleDateString()}
                </span>
            ),
        },
        {
            header: "",
            accessor: (r: Inquiry) => (
                <Button
                    size="sm"
                    variant="ghost"
                    onClick={(e) => {
                        e.stopPropagation();
                        setSelected(r);
                        setDetailOpen(true);
                    }}
                >
                    <Eye className="w-4 h-4" />
                </Button>
            ),
            className: "w-[50px]",
        },
    ];

    return (
        <AdminLayout
            title="Inquiries"
            subtitle={`${inquiries.length} total inquiries`}
        >
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                        placeholder="Search by name, city, phone..."
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
                    {statuses.map((s) => (
                        <Button
                            key={s}
                            size="sm"
                            variant={filterStatus === s ? "default" : "outline"}
                            onClick={() => setFilterStatus(s)}
                            className="capitalize"
                        >
                            {s.replace("-", " ")}
                        </Button>
                    ))}
                </div>
            </div>

            <DataTable
                columns={columns}
                data={filtered}
                loading={loading}
                emptyMessage="No inquiries found"
            />

            <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
                <DialogContent className="max-w-lg">
                    <DialogHeader>
                        <DialogTitle className="font-display">Inquiry Details</DialogTitle>
                    </DialogHeader>
                    {selected && (
                        <div className="space-y-4 mt-4">
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <span className="text-muted-foreground">Name:</span>
                                    <p className="font-medium">{selected.full_name}</p>
                                </div>
                                <div>
                                    <span className="text-muted-foreground">Phone:</span>
                                    <p className="font-medium">{selected.phone}</p>
                                </div>
                                <div>
                                    <span className="text-muted-foreground">Email:</span>
                                    <p className="font-medium">{selected.email || "—"}</p>
                                </div>
                                <div>
                                    <span className="text-muted-foreground">City:</span>
                                    <p className="font-medium">{selected.city}</p>
                                </div>
                                <div>
                                    <span className="text-muted-foreground">Type:</span>
                                    <p className="font-medium capitalize">
                                        {selected.inquiry_type}
                                    </p>
                                </div>
                                <div>
                                    <span className="text-muted-foreground">Source:</span>
                                    <p className="font-medium capitalize">{selected.source}</p>
                                </div>
                            </div>
                            {selected.message && (
                                <div>
                                    <span className="text-sm text-muted-foreground">
                                        Message:
                                    </span>
                                    <p className="text-sm bg-muted p-3 rounded-lg mt-1">
                                        {selected.message}
                                    </p>
                                </div>
                            )}
                            <div>
                                <label className="text-sm font-medium mb-1 block">Status</label>
                                <select
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                    value={selected.status}
                                    onChange={(e) => updateStatus(selected.id, e.target.value)}
                                >
                                    {statuses.map((s) => (
                                        <option key={s} value={s} className="capitalize">
                                            {s.replace("-", " ")}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="text-sm font-medium mb-1 block">Notes</label>
                                <textarea
                                    className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm min-h-[80px]"
                                    defaultValue={selected.notes || ""}
                                    onBlur={(e) => updateNotes(selected.id, e.target.value)}
                                    placeholder="Add internal notes..."
                                />
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </AdminLayout>
    );
};

export default AdminInquiries;
