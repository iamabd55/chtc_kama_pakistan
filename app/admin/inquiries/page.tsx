"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import AdminLayout from "@/components/admin/AdminLayout";
import DataTable from "@/components/admin/DataTable";
import StatusBadge from "@/components/admin/StatusBadge";
import AvatarLabel from "@/components/admin/AvatarLabel";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Pencil, Trash2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import type { Inquiry } from "@/lib/supabase/types";

const statusOptions = [
    { value: "new", label: "Received" },
    { value: "in-progress", label: "In Review" },
    { value: "converted", label: "Responded" },
] as const;

const statusLabels: Record<Inquiry["status"], string> = {
    new: "Received",
    contacted: "In Review",
    "in-progress": "In Review",
    converted: "Responded",
    closed: "Responded",
};

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

function getInquiryNote(message: string | null | undefined) {
    if (!message) return null;

    const lines = message
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter(Boolean);

    if (lines.length === 0) return null;

    const metadataPrefixes = ["Company:", "Request Type:", "Vehicle Category:", "Selected Product ID:", "Requested Product Slug:"];
    const noteLines = lines.filter((line) => !metadataPrefixes.some((prefix) => line.startsWith(prefix)));

    return (noteLines.length > 0 ? noteLines : lines).join(" ");
}

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
    const [bulkDeleting, setBulkDeleting] = useState(false);
    const [fetchError, setFetchError] = useState<string | null>(null);

    const fetchData = async () => {
        setLoading(true);
        setFetchError(null);
        const params = new URLSearchParams();
        if (filterStatus !== "all") params.set("status", filterStatus);
        const qs = params.toString();
        const res = await fetch(`/api/admin/inquiries${qs ? `?${qs}` : ""}`, {
            credentials: "same-origin",
        });
        const payload = await res.json().catch(() => ({}));
        if (!res.ok) {
            console.error("inquiries fetch failed", payload);
            setFetchError(
                typeof payload?.error === "string"
                    ? payload.error
                    : "Could not load inquiries"
            );
            setInquiries([]);
        } else {
            setInquiries((payload.inquiries as InquiryWithProduct[]) || []);
        }
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
            status: selected.status === "contacted" ? "in-progress" : selected.status,
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

    const bulkDeleteInquiries = async () => {
        const confirmMsg =
            filterStatus === "all"
                ? `Delete ALL ${inquiries.length} inquiries permanently? This action cannot be undone.`
                : `Delete all ${inquiries.filter((i) => i.status === filterStatus).length} inquiries with status "${statusLabels[filterStatus as keyof typeof statusLabels]}"? This action cannot be undone.`;

        const confirmed = window.confirm(confirmMsg);
        if (!confirmed) return;

        setBulkDeleting(true);
        const response = await fetch("/api/admin/inquiries/bulk-delete", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                scope: filterStatus === "all" ? "all" : "filtered",
                filterStatus: filterStatus === "all" ? null : filterStatus,
            }),
        });
        const payload = await response.json().catch(() => ({}));
        setBulkDeleting(false);

        if (!response.ok) {
            toast({
                title: "Error",
                description: payload?.error || "Could not delete inquiries",
                variant: "destructive",
            });
            return;
        }

        toast({
            title: "Success",
            description: `Deleted ${payload.deletedCount} inquiry/inquiries`,
        });
        if (detailOpen && selected) {
            setDetailOpen(false);
            setSelected(null);
        }
        await fetchData();
    };

    const columns = [
        {
            header: "Name",
            accessor: (r: Inquiry) => (
                <AvatarLabel name={r.full_name} subtitle={r.email || "—"} />
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
            {fetchError && (
                <div
                    className="mb-4 rounded-lg border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive"
                    role="alert"
                >
                    {fetchError}
                </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 mb-4">
                <div className="relative flex-1 max-w-full sm:max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                        placeholder="Search by name, city, phone..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-10 w-full"
                    />
                </div>
                <div className="grid grid-cols-2 gap-2 sm:flex sm:gap-2">
                    <Button size="sm" variant="outline" onClick={exportCsv}>
                        Export CSV
                    </Button>
                    <Button
                        size="sm"
                        variant="destructive"
                        onClick={bulkDeleteInquiries}
                        disabled={bulkDeleting || inquiries.length === 0}
                    >
                        {bulkDeleting ? "Deleting..." : "Delete All"}
                    </Button>
                    <Button
                        size="sm"
                        variant={filterStatus === "all" ? "default" : "outline"}
                        onClick={() => setFilterStatus("all")}
                    >
                        All
                    </Button>
                    {statusOptions.map((status) => (
                        <Button
                            key={status.value}
                            size="sm"
                            variant={filterStatus === status.value ? "default" : "outline"}
                            onClick={() => setFilterStatus(status.value)}
                        >
                            {status.label}
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
    <DialogContent className="w-full sm:w-[95vw] max-w-[850px] p-0 gap-0 overflow-hidden max-h-[90vh] flex flex-col">
        <DialogTitle className="sr-only">Inquiry Details</DialogTitle>

        {/* Header */}
       {/* Header — remove the custom X button entirely */}
<header className="border-b px-4 sm:px-6 py-3 sm:py-4 flex-shrink-0">
    <div>
        <h3 className="font-display text-lg sm:text-xl font-semibold">Inquiry Details</h3>
        <p className="mt-0.5 text-sm text-muted-foreground">
            Review the public reference, status, and internal notes.
        </p>
    </div>
</header>

        {/* Scrollable body */}
        {selected && (
            <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 sm:py-5 min-h-0">
                {/* Reference */}
                <div className="mb-4">
                    <div className="inline-flex items-center gap-3 rounded-lg border bg-muted/30 px-3 py-2">
                        <span className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                            Reference
                        </span>
                        <span className="font-mono text-sm font-semibold text-foreground">
                            {selected.public_ref || selected.id}
                        </span>
                        <span className="text-xs text-muted-foreground">Public tracking ID</span>
                    </div>
                </div>

                {/* Customer + Inquiry Info — always 2-col with compact spacing */}
                <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                    {/* Customer Information */}
                    <div className="col-span-2">
                        <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Customer Information</h4>
                    </div>
                    <div>
                        <div className="text-xs text-muted-foreground">Name</div>
                        <div className="font-medium text-sm">{selected.full_name}</div>
                    </div>
                    <div>
                        <div className="text-xs text-muted-foreground">Phone</div>
                        <div className="font-medium text-sm">{selected.phone}</div>
                    </div>
                    <div>
                        <div className="text-xs text-muted-foreground">Email</div>
                        <div className="font-medium text-sm break-all">{selected.email || "—"}</div>
                    </div>
                    <div>
                        <div className="text-xs text-muted-foreground">City</div>
                        <div className="font-medium text-sm">{selected.city}</div>
                    </div>

                    {/* Divider */}
                    <div className="col-span-2 border-t mt-1 pt-3">
                        <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Inquiry Information</h4>
                    </div>
                    <div>
                        <div className="text-xs text-muted-foreground">Type</div>
                        <div className="font-medium text-sm capitalize">{selected.inquiry_type}</div>
                    </div>
                    <div>
                        <div className="text-xs text-muted-foreground">Product</div>
                        <div className="font-medium text-sm">{selected.product?.name || "—"}</div>
                    </div>
                    <div>
                        <div className="text-xs text-muted-foreground">Source</div>
                        <div className="font-medium text-sm capitalize">{selected.source}</div>
                    </div>
                    <div>
                        <div className="text-xs text-muted-foreground">Date</div>
                        <div className="font-medium text-sm">{new Date(selected.created_at).toLocaleString()}</div>
                    </div>
                </div>

                {/* Message / Note */}
                {getInquiryNote(selected.message) && (
                    <div className="mt-4">
                        <h4 className="text-sm font-medium text-muted-foreground mb-2">Message / Note</h4>
                        <div className="rounded-lg bg-muted p-3 text-sm leading-6">
                            {getInquiryNote(selected.message)}
                        </div>
                    </div>
                )}

                {/* Status & Notes — responsive with compact spacing */}
                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                        <label className="mb-1.5 block text-sm font-medium">Status</label>
                        <select
                            className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                            value={draft.status}
                            onChange={(e) => setDraft((prev) => ({ ...prev, status: e.target.value as Inquiry["status"] }))}
                        >
                            {statusOptions.map((s) => (
                                <option key={s.value} value={s.value}>{s.label}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="mb-1.5 block text-sm font-medium">Notes</label>
                        <textarea
                            className="h-[72px] w-full rounded-lg border border-input bg-background px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring"
                            value={draft.notes}
                            onChange={(e) => setDraft((prev) => ({ ...prev, notes: e.target.value }))}
                            placeholder="Add internal notes..."
                        />
                    </div>
                </div>

                {/* Internal handling */}
                <details className="mt-4 rounded-lg border bg-muted/30 px-3 py-2">
                    <summary className="cursor-pointer text-sm font-medium text-foreground select-none">
                        Internal handling
                    </summary>
                    <div className="mt-3 space-y-3">
                        <div>
                            <label className="mb-1 block text-sm font-medium">Assigned To</label>
                            <Input
                                value={draft.assigned_to}
                                onChange={(e) =>
                                    setDraft((prev) => ({ ...prev, assigned_to: e.target.value }))
                                }
                                placeholder="Enter auth user UUID"
                            />
                        </div>
                        <div>
                            <label className="mb-1 block text-sm font-medium">Follow-up Date</label>
                            <Input
                                type="date"
                                value={draft.follow_up_date}
                                onChange={(e) =>
                                    setDraft((prev) => ({ ...prev, follow_up_date: e.target.value }))
                                }
                            />
                        </div>
                    </div>
                </details>
            </div>
        )}

        {/* Footer — always visible, compact and responsive */}
        <footer className="flex-shrink-0 border-t px-4 sm:px-6 py-3 bg-background">
            <div className="flex items-center justify-between gap-2">
                <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => void deleteInquiry()}
                    disabled={saving || deleting}
                >
                    {deleting ? "Deleting..." : "Delete"}
                </Button>
                <div className="flex gap-2">
                    <DialogClose asChild>
                        <Button variant="outline" size="sm" disabled={saving || deleting}>
                            Close
                        </Button>
                    </DialogClose>
                    <Button size="sm" onClick={saveInquiryChanges} disabled={saving || deleting}>
                        {saving ? "Saving..." : "Save Changes"}
                    </Button>
                </div>
            </div>
        </footer>
    </DialogContent>
</Dialog>
        </AdminLayout>
    );
};

export default AdminInquiries;
