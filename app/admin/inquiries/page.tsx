"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import AdminLayout from "@/components/admin/AdminLayout";
import DataTable from "@/components/admin/DataTable";
import StatusBadge from "@/components/admin/StatusBadge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { adminDb } from "@/lib/supabase/adminClient";
import { Search, Pencil, Trash2 } from "lucide-react";
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

type InquiryWithProduct = Inquiry & {
    product: {
        id: string;
        name: string;
        slug: string;
        brand: string;
    } | null;
};

type InquiryDraft = {
    status: Inquiry["status"];
    notes: string;
    assigned_to: string;
    follow_up_date: string;
};

const AdminInquiries = () => {
    const searchParams = useSearchParams();
    const inquiryIdFromUrl = searchParams.get("inquiryId");

    const [inquiries, setInquiries] = useState<InquiryWithProduct[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [filterStatus, setFilterStatus] = useState<string>("all");
    const [detailOpen, setDetailOpen] = useState(false);
    const [selected, setSelected] = useState<InquiryWithProduct | null>(null);
    const [handledDeepLinkId, setHandledDeepLinkId] = useState<string | null>(null);
    const [draft, setDraft] = useState<InquiryDraft>({
        status: "new",
        notes: "",
        assigned_to: "",
        follow_up_date: "",
    });
    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState(false);

    const fetchData = async () => {
        setLoading(true);
        let query = adminDb
            .from("inquiries")
            .select("*, product:products(id, name, slug, brand)")
            .order("created_at", { ascending: false });
        if (filterStatus !== "all") query = query.eq("status", filterStatus);
        const { data } = await query;
        setInquiries((data as InquiryWithProduct[]) || []);
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
            i.phone.includes(search) ||
            (i.product?.name || "").toLowerCase().includes(search.toLowerCase()) ||
            (i.product?.slug || "").toLowerCase().includes(search.toLowerCase())
    );

    useEffect(() => {
        if (!inquiryIdFromUrl || inquiryIdFromUrl === handledDeepLinkId || loading) {
            return;
        }

        const target = inquiries.find((inquiry) => inquiry.id === inquiryIdFromUrl);
        if (target) {
            setSelected(target);
            setDetailOpen(true);
            setHandledDeepLinkId(inquiryIdFromUrl);
        }
    }, [inquiries, inquiryIdFromUrl, handledDeepLinkId, loading]);

    useEffect(() => {
        if (!selected || !detailOpen) return;

        setDraft({
            status: selected.status,
            notes: selected.notes || "",
            assigned_to: selected.assigned_to || "",
            follow_up_date: selected.follow_up_date || "",
        });
    }, [selected, detailOpen]);

    const exportCsv = () => {
        const headers = [
            "full_name",
            "phone",
            "email",
            "city",
            "inquiry_type",
            "product_id",
            "product_name",
            "product_slug",
            "status",
            "assigned_to",
            "follow_up_date",
            "source",
            "created_at",
            "message",
        ];

        const escapeCell = (value: string | null | undefined) =>
            `"${(value ?? "").replace(/"/g, '""')}"`;

        const rows = filtered.map((item) => [
            item.full_name,
            item.phone,
            item.email,
            item.city,
            item.inquiry_type,
            item.product_id,
            item.product?.name || "",
            item.product?.slug || "",
            item.status,
            item.assigned_to,
            item.follow_up_date,
            item.source,
            item.created_at,
            item.message,
        ]);

        const csv = [
            headers.join(","),
            ...rows.map((row) => row.map((cell) => escapeCell(cell || "")).join(",")),
        ].join("\n");

        const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `inquiries-${new Date().toISOString().slice(0, 10)}.csv`;
        link.click();
        URL.revokeObjectURL(url);
    };

    const saveInquiryChanges = async () => {
        if (!selected) return;
        setSaving(true);

        const response = await fetch(`/api/admin/inquiries/${selected.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                status: draft.status,
                notes: draft.notes,
                assigned_to: draft.assigned_to,
                follow_up_date: draft.follow_up_date,
            }),
        });

        const payload = await response.json().catch(() => ({}));
        setSaving(false);

        if (!response.ok) {
            toast({
                title: "Error",
                description: payload?.error || "Could not save inquiry",
                variant: "destructive",
            });
            return;
        }

        const updated = payload?.inquiry as Inquiry | undefined;
        if (updated) {
            setSelected((prev) =>
                prev
                    ? {
                          ...prev,
                          ...updated,
                      }
                    : prev
            );
        }

        await fetchData();
        toast({ title: "Inquiry changes saved" });
    };

    const deleteInquiry = async (inquiry?: InquiryWithProduct) => {
        const target = inquiry ?? selected;
        if (!target) return;

        const confirmed = window.confirm(
            "Delete this inquiry permanently? This action cannot be undone."
        );
        if (!confirmed) return;

        setDeleting(true);
        const response = await fetch(`/api/admin/inquiries/${target.id}`, {
            method: "DELETE",
        });
        const payload = await response.json().catch(() => ({}));
        setDeleting(false);

        if (!response.ok) {
            toast({
                title: "Error",
                description: payload?.error || "Could not delete inquiry",
                variant: "destructive",
            });
            return;
        }

        toast({ title: "Inquiry deleted" });
        if (selected?.id === target.id) {
            setDetailOpen(false);
            setSelected(null);
        }
        await fetchData();
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
            accessor: (r: InquiryWithProduct) => (
                <span className="capitalize text-sm">{r.inquiry_type}</span>
            ),
        },
        {
            header: "Product",
            accessor: (r: InquiryWithProduct) => (
                <span className="text-sm text-muted-foreground">
                    {r.product?.name || "—"}
                </span>
            ),
        },
        {
            header: "Source",
            accessor: (r: InquiryWithProduct) => (
                <span className="capitalize text-xs">{r.source}</span>
            ),
        },
        {
            header: "Status",
            accessor: (r: InquiryWithProduct) => <StatusBadge status={r.status} />,
        },
        {
            header: "Date",
            accessor: (r: InquiryWithProduct) => (
                <span className="text-sm text-muted-foreground">
                    {new Date(r.created_at).toLocaleDateString()}
                </span>
            ),
        },
        {
            header: "",
            accessor: (r: InquiryWithProduct) => (
                <div className="flex items-center justify-end gap-1">
                    <Button
                        size="sm"
                        variant="ghost"
                        onClick={(e) => {
                            e.stopPropagation();
                            setSelected(r);
                            setDetailOpen(true);
                        }}
                        aria-label="Edit inquiry"
                        title="Edit"
                    >
                        <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                        size="sm"
                        variant="ghost"
                        onClick={(e) => {
                            e.stopPropagation();
                            deleteInquiry(r);
                        }}
                        aria-label="Delete inquiry"
                        title="Delete"
                        disabled={deleting}
                        className="text-red-600 hover:text-red-700"
                    >
                        <Trash2 className="w-4 h-4" />
                    </Button>
                </div>
            ),
            className: "w-[94px]",
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
                    <Button size="sm" variant="outline" onClick={exportCsv}>
                        Export CSV
                    </Button>
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
                                    <span className="text-muted-foreground">Product:</span>
                                    <p className="font-medium">{selected.product?.name || "—"}</p>
                                </div>
                                <div>
                                    <span className="text-muted-foreground">Product Slug:</span>
                                    <p className="font-medium">{selected.product?.slug || "—"}</p>
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
                                    value={draft.status}
                                    onChange={(e) =>
                                        setDraft((prev) => ({
                                            ...prev,
                                            status: e.target.value as Inquiry["status"],
                                        }))
                                    }
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
                                    value={draft.notes}
                                    onChange={(e) =>
                                        setDraft((prev) => ({
                                            ...prev,
                                            notes: e.target.value,
                                        }))
                                    }
                                    placeholder="Add internal notes..."
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium mb-1 block">Assigned To (User UUID)</label>
                                <Input
                                    value={draft.assigned_to}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        setDraft((prev) => ({ ...prev, assigned_to: value }));
                                    }}
                                    placeholder="Enter auth user UUID"
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium mb-1 block">Follow-up Date</label>
                                <Input
                                    type="date"
                                    value={draft.follow_up_date}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        setDraft((prev) => ({ ...prev, follow_up_date: value }));
                                    }}
                                />
                            </div>
                            <div className="flex items-center justify-between gap-3 pt-2">
                                <Button
                                    variant="destructive"
                                    onClick={() => {
                                        void deleteInquiry();
                                    }}
                                    disabled={saving || deleting}
                                >
                                    {deleting ? "Deleting..." : "Delete Inquiry"}
                                </Button>
                                <Button onClick={saveInquiryChanges} disabled={saving || deleting}>
                                    {saving ? "Saving..." : "Save Changes"}
                                </Button>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </AdminLayout>
    );
};

export default AdminInquiries;
