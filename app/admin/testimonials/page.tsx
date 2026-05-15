"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import DataTable from "@/components/admin/DataTable";
import StatusBadge from "@/components/admin/StatusBadge";
import { adminDb } from "@/lib/supabase/adminClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Check, Pencil, Plus, Search, Trash2, X } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import type { Testimonial } from "@/lib/supabase/types";
import { getNextTestimonialDisplayOrder } from "@/lib/testimonials";

type StatusFilter = "all" | Testimonial["status"];

const statusFilters: { value: StatusFilter; label: string }[] = [
    { value: "all", label: "All" },
    { value: "pending", label: "Pending" },
    { value: "approved", label: "Approved" },
    { value: "rejected", label: "Rejected" },
];

export default function AdminTestimonialsPage() {
    const [items, setItems] = useState<Testimonial[]>([]);
    const [loading, setLoading] = useState(true);
    const [open, setOpen] = useState(false);
    const [editing, setEditing] = useState<Partial<Testimonial> | null>(null);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

    const fetchData = useCallback(async () => {
        setLoading(true);
        const { data, error } = await adminDb
            .from("testimonials")
            .select("*")
            .order("display_order", { ascending: true })
            .order("created_at", { ascending: false });

        if (error) {
            toast({ title: "Error loading testimonials", description: error.message, variant: "destructive" });
        }
        setItems((data as Testimonial[]) || []);
        setLoading(false);
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const pendingCount = useMemo(
        () => items.filter((item) => item.status === "pending").length,
        [items]
    );

    const filtered = useMemo(() => {
        const q = search.trim().toLowerCase();
        return items.filter((item) => {
            if (statusFilter !== "all" && item.status !== statusFilter) return false;
            if (!q) return true;
            return (
                item.customer_name.toLowerCase().includes(q) ||
                (item.company?.toLowerCase().includes(q) ?? false) ||
                item.content.toLowerCase().includes(q)
            );
        });
    }, [items, search, statusFilter]);

    const save = async () => {
        if (!editing?.customer_name?.trim() || !editing.content?.trim()) {
            toast({ title: "Name and review text are required", variant: "destructive" });
            return;
        }

        const isNew = !editing.id;
        let displayOrder = editing.display_order ?? 0;

        if (isNew) {
            const manualOrder =
                typeof editing.display_order === "number" && editing.display_order > 0
                    ? editing.display_order
                    : null;
            displayOrder =
                manualOrder ?? (await getNextTestimonialDisplayOrder(adminDb));
        }

        const payload = {
            customer_name: editing.customer_name.trim(),
            customer_title: editing.customer_title?.trim() || null,
            company: editing.company?.trim() || null,
            content: editing.content.trim(),
            rating: editing.rating ?? null,
            status: editing.status ?? "pending",
            is_active: editing.is_active ?? true,
            display_order: displayOrder,
            updated_at: new Date().toISOString(),
        };

        const { error } = isNew
            ? await adminDb.from("testimonials").insert(payload)
            : await adminDb.from("testimonials").update(payload).eq("id", editing.id);

        if (error) {
            toast({ title: "Error", description: error.message, variant: "destructive" });
            return;
        }

        toast({ title: editing.id ? "Testimonial updated" : "Testimonial added" });
        setOpen(false);
        fetchData();
    };

    const updateStatus = async (id: string, status: Testimonial["status"]) => {
        const { error } = await adminDb
            .from("testimonials")
            .update({ status, updated_at: new Date().toISOString() })
            .eq("id", id);

        if (error) {
            toast({ title: "Error", description: error.message, variant: "destructive" });
            return;
        }

        toast({ title: status === "approved" ? "Testimonial approved" : "Testimonial rejected" });
        fetchData();
    };

    const remove = async (id: string) => {
        if (!confirm("Delete this testimonial permanently?")) return;
        const { error } = await adminDb.from("testimonials").delete().eq("id", id);
        if (error) {
            toast({ title: "Error", description: error.message, variant: "destructive" });
            return;
        }
        toast({ title: "Testimonial deleted" });
        fetchData();
    };

    const columns = [
        {
            header: "Customer",
            accessor: (row: Testimonial) => (
                <div>
                    <p className="font-medium text-sm">{row.customer_name}</p>
                    {(row.customer_title || row.company) && (
                        <p className="text-xs text-muted-foreground">
                            {[row.customer_title, row.company].filter(Boolean).join(" · ")}
                        </p>
                    )}
                </div>
            ),
        },
        {
            header: "Review",
            accessor: (row: Testimonial) => (
                <p className="text-sm text-muted-foreground line-clamp-2 max-w-md">{row.content}</p>
            ),
        },
        {
            header: "Rating",
            accessor: (row: Testimonial) =>
                row.rating ? (
                    <span className="text-sm font-semibold text-amber-600">{row.rating}/5</span>
                ) : (
                    <span className="text-muted-foreground text-sm">—</span>
                ),
        },
        {
            header: "Status",
            accessor: (row: Testimonial) => <StatusBadge status={row.status} />,
        },
        {
            header: "Active",
            accessor: (row: Testimonial) => (
                <StatusBadge status={row.is_active ? "active" : "inactive"} />
            ),
        },
        {
            header: "Actions",
            accessor: (row: Testimonial) => (
                <div className="flex flex-wrap gap-1">
                    {row.status === "pending" && (
                        <>
                            <Button
                                size="sm"
                                variant="ghost"
                                className="text-emerald-600"
                                title="Approve"
                                onClick={() => updateStatus(row.id, "approved")}
                            >
                                <Check className="w-4 h-4" />
                            </Button>
                            <Button
                                size="sm"
                                variant="ghost"
                                className="text-rose-600"
                                title="Reject"
                                onClick={() => updateStatus(row.id, "rejected")}
                            >
                                <X className="w-4 h-4" />
                            </Button>
                        </>
                    )}
                    <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                            setEditing(row);
                            setOpen(true);
                        }}
                    >
                        <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                        size="sm"
                        variant="ghost"
                        className="text-destructive"
                        onClick={() => remove(row.id)}
                    >
                        <Trash2 className="w-4 h-4" />
                    </Button>
                </div>
            ),
        },
    ];

    return (
        <AdminLayout
            title="Testimonials"
            subtitle={`${items.length} total · ${pendingCount} pending review`}
            actions={
                <Button
                    onClick={() => {
                        setEditing({
                            status: "approved",
                            is_active: true,
                            rating: 5,
                        });
                        setOpen(true);
                    }}
                >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Testimonial
                </Button>
            }
        >
            <div className="flex flex-col sm:flex-row gap-3 mb-4">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                        placeholder="Search name, company, review…"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-9"
                    />
                </div>
                <div className="flex flex-wrap gap-2">
                    {statusFilters.map((filter) => (
                        <Button
                            key={filter.value}
                            size="sm"
                            variant={statusFilter === filter.value ? "default" : "outline"}
                            onClick={() => setStatusFilter(filter.value)}
                        >
                            {filter.label}
                            {filter.value === "pending" && pendingCount > 0 && (
                                <span className="ml-1.5 rounded-full bg-amber-500/20 px-1.5 text-[10px]">
                                    {pendingCount}
                                </span>
                            )}
                        </Button>
                    ))}
                </div>
            </div>

            <DataTable columns={columns} data={filtered} loading={loading} />

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>{editing?.id ? "Edit" : "Add"} Testimonial</DialogTitle>
                    </DialogHeader>
                    {editing && (
                        <div className="space-y-3">
                            <Input
                                placeholder="Customer name *"
                                value={editing.customer_name || ""}
                                onChange={(e) =>
                                    setEditing({ ...editing, customer_name: e.target.value })
                                }
                            />
                            <Input
                                placeholder="Title / role (optional)"
                                value={editing.customer_title || ""}
                                onChange={(e) =>
                                    setEditing({ ...editing, customer_title: e.target.value })
                                }
                            />
                            <Input
                                placeholder="Company (optional)"
                                value={editing.company || ""}
                                onChange={(e) =>
                                    setEditing({ ...editing, company: e.target.value })
                                }
                            />
                            <textarea
                                className="w-full border rounded-md px-3 py-2 text-sm min-h-[120px]"
                                placeholder="Review text *"
                                value={editing.content || ""}
                                onChange={(e) =>
                                    setEditing({ ...editing, content: e.target.value })
                                }
                            />
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="text-xs text-muted-foreground mb-1 block">
                                        Rating (1–5)
                                    </label>
                                    <Input
                                        type="number"
                                        min={1}
                                        max={5}
                                        value={editing.rating ?? ""}
                                        onChange={(e) =>
                                            setEditing({
                                                ...editing,
                                                rating: e.target.value
                                                    ? Number.parseInt(e.target.value, 10)
                                                    : null,
                                            })
                                        }
                                    />
                                </div>
                                <div>
                                    <label className="text-xs text-muted-foreground mb-1 block">
                                        Display order
                                    </label>
                                    <Input
                                        type="number"
                                        min={1}
                                        placeholder={editing.id ? "Order" : "Auto on save"}
                                        value={editing.display_order && editing.display_order > 0 ? editing.display_order : ""}
                                        onChange={(e) =>
                                            setEditing({
                                                ...editing,
                                                display_order: e.target.value
                                                    ? Number.parseInt(e.target.value, 10)
                                                    : undefined,
                                            })
                                        }
                                    />
                                    {!editing.id && (
                                        <p className="text-[10px] text-muted-foreground mt-1">
                                            Leave empty to append after existing reviews.
                                        </p>
                                    )}
                                </div>
                            </div>
                            <div>
                                <label className="text-xs text-muted-foreground mb-1 block">
                                    Status
                                </label>
                                <select
                                    className="w-full border rounded-md px-3 py-2 text-sm"
                                    value={editing.status ?? "pending"}
                                    onChange={(e) =>
                                        setEditing({
                                            ...editing,
                                            status: e.target.value as Testimonial["status"],
                                        })
                                    }
                                >
                                    <option value="pending">Pending</option>
                                    <option value="approved">Approved</option>
                                    <option value="rejected">Rejected</option>
                                </select>
                            </div>
                            <label className="flex items-center gap-2 text-sm">
                                <input
                                    type="checkbox"
                                    checked={editing.is_active ?? true}
                                    onChange={(e) =>
                                        setEditing({ ...editing, is_active: e.target.checked })
                                    }
                                />
                                Active on website (when approved)
                            </label>
                            <div className="flex justify-end">
                                <Button onClick={save}>Save</Button>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </AdminLayout>
    );
}
