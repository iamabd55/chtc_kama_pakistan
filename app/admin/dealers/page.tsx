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
import type { Dealer } from "@/lib/supabase/types";

const provinces = [
    "Punjab",
    "Sindh",
    "KPK",
    "Balochistan",
    "AJK",
    "GB",
    "ICT",
] as const;
const dealerTypes = ["sales", "service", "both"] as const;

const serializeBrands = (brands?: string[]) => (brands ?? []).join(", ");

const parseBrands = (value: string): string[] =>
    value
        .split(",")
        .map((b) => b.trim())
        .filter(Boolean);

const extractCoordsFromGoogleMapsUrl = (urlValue?: string | null) => {
    if (!urlValue) return null;

    const value = urlValue.trim();
    if (!value) return null;

    const toCoords = (latRaw: string, lngRaw: string) => {
        const lat = Number(latRaw);
        const lng = Number(lngRaw);
        if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;
        if (lat < -90 || lat > 90 || lng < -180 || lng > 180) return null;
        return { lat, lng };
    };

    // Matches .../@31.5204,74.3587,...
    const atMatch = value.match(/@(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)/);
    if (atMatch) {
        return toCoords(atMatch[1], atMatch[2]);
    }

    try {
        const parsed = new URL(value);

        // Matches ...?q=31.5204,74.3587 or ...?query=31.5204,74.3587
        const q = parsed.searchParams.get("q") || parsed.searchParams.get("query");
        if (q) {
            const qMatch = q.match(/(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)/);
            if (qMatch) {
                const coords = toCoords(qMatch[1], qMatch[2]);
                if (coords) return coords;
            }
        }

        // Matches ...?ll=31.5204,74.3587
        const ll = parsed.searchParams.get("ll");
        if (ll) {
            const llMatch = ll.match(/(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)/);
            if (llMatch) {
                const coords = toCoords(llMatch[1], llMatch[2]);
                if (coords) return coords;
            }
        }

        // Matches long map links containing !3d31.5204!4d74.3587
        const longMatch = parsed.href.match(/!3d(-?\d+(?:\.\d+)?)!4d(-?\d+(?:\.\d+)?)/);
        if (longMatch) {
            return toCoords(longMatch[1], longMatch[2]);
        }
    } catch {
        return null;
    }

    return null;
};

const AdminDealers = () => {
    const [dealers, setDealers] = useState<Dealer[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editing, setEditing] = useState<Partial<Dealer> | null>(null);
    const [saving, setSaving] = useState(false);

    const fetchData = async () => {
        setLoading(true);
        const { data } = await adminDb.from("dealers").select("*").order("city");
        setDealers((data as Dealer[]) || []);
        setLoading(false);
    };

    useEffect(() => {
        fetchData();
    }, []);

    const filtered = dealers.filter(
        (d) =>
            d.name.toLowerCase().includes(search.toLowerCase()) ||
            d.city.toLowerCase().includes(search.toLowerCase())
    );

    const openNew = () => {
        setEditing({ province: "Punjab", dealer_type: "both", is_active: true, brands: [] });
        setDialogOpen(true);
    };
    const openEdit = (d: Dealer) => {
        setEditing({ ...d });
        setDialogOpen(true);
    };

    const handleSave = async () => {
        if (
            !editing?.name ||
            !editing?.city ||
            !editing?.address ||
            !editing?.phone
        ) {
            toast({ title: "Missing required fields", variant: "destructive" });
            return;
        }
        setSaving(true);
        const extractedCoords = extractCoordsFromGoogleMapsUrl(editing.google_maps_url);
        const payload = {
            name: editing.name,
            city: editing.city,
            province: editing.province || "Punjab",
            address: editing.address,
            phone: editing.phone,
            whatsapp: editing.whatsapp || null,
            email: editing.email || null,
            google_maps_url: editing.google_maps_url || null,
            lat: editing.lat ?? extractedCoords?.lat ?? null,
            lng: editing.lng ?? extractedCoords?.lng ?? null,
            dealer_type: editing.dealer_type || "both",
            brands: editing.brands || [],
            working_hours: editing.working_hours || null,
            is_active: editing.is_active ?? true,
        };

        if (editing.id) {
            const { error } = await adminDb
                .from("dealers")
                .update(payload)
                .eq("id", editing.id);
            if (error)
                toast({ title: "Error", description: error.message, variant: "destructive" });
            else toast({ title: "Dealer updated" });
        } else {
            const { error } = await adminDb.from("dealers").insert(payload);
            if (error)
                toast({ title: "Error", description: error.message, variant: "destructive" });
            else toast({ title: "Dealer created" });
        }
        setSaving(false);
        setDialogOpen(false);
        fetchData();
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Delete this dealer?")) return;
        const { error } = await adminDb.from("dealers").delete().eq("id", id);
        if (error)
            toast({ title: "Error", description: error.message, variant: "destructive" });
        else {
            toast({ title: "Deleted" });
            fetchData();
        }
    };

    const columns = [
        {
            header: "Dealer",
            accessor: (r: Dealer) => (
                <div>
                    <p className="font-medium">{r.name}</p>
                    <p className="text-xs text-muted-foreground">
                        {r.city}, {r.province}
                    </p>
                </div>
            ),
        },
        { header: "Phone", accessor: "phone" as keyof Dealer },
        {
            header: "Type",
            accessor: (r: Dealer) => (
                <span className="capitalize text-sm">{r.dealer_type}</span>
            ),
        },
        {
            header: "Brands",
            accessor: (r: Dealer) => (
                <span className="text-xs">{r.brands?.join(", ") || "—"}</span>
            ),
        },
        {
            header: "Status",
            accessor: (r: Dealer) => (
                <StatusBadge status={r.is_active ? "active" : "inactive"} />
            ),
        },
        {
            header: "Actions",
            accessor: (r: Dealer) => (
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
            title="Dealers"
            subtitle={`${dealers.length} dealers`}
            actions={
                <Button onClick={openNew} className="font-display font-semibold">
                    <Plus className="w-4 h-4 mr-2" /> Add Dealer
                </Button>
            }
        >
            <div className="mb-6 max-w-sm relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                    placeholder="Search dealers..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-10"
                />
            </div>

            <DataTable columns={columns} data={filtered} loading={loading} />

            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="font-display">
                            {editing?.id ? "Edit" : "Add"} Dealer
                        </DialogTitle>
                    </DialogHeader>
                    {editing && (
                        <div className="grid grid-cols-2 gap-4 mt-4">
                            <div className="col-span-2">
                                <label className="text-sm font-medium mb-1 block">Name *</label>
                                <Input
                                    value={editing.name || ""}
                                    onChange={(e) =>
                                        setEditing({ ...editing, name: e.target.value })
                                    }
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium mb-1 block">City *</label>
                                <Input
                                    value={editing.city || ""}
                                    onChange={(e) =>
                                        setEditing({ ...editing, city: e.target.value })
                                    }
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium mb-1 block">Province</label>
                                <select
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                    value={editing.province || "Punjab"}
                                    onChange={(e) =>
                                        setEditing({
                                            ...editing,
                                            province: e.target.value as Dealer["province"],
                                        })
                                    }
                                >
                                    {provinces.map((p) => (
                                        <option key={p} value={p}>
                                            {p}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="col-span-2">
                                <label className="text-sm font-medium mb-1 block">
                                    Address *
                                </label>
                                <Input
                                    value={editing.address || ""}
                                    onChange={(e) =>
                                        setEditing({ ...editing, address: e.target.value })
                                    }
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium mb-1 block">Phone *</label>
                                <Input
                                    value={editing.phone || ""}
                                    onChange={(e) =>
                                        setEditing({ ...editing, phone: e.target.value })
                                    }
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium mb-1 block">WhatsApp</label>
                                <Input
                                    value={editing.whatsapp || ""}
                                    onChange={(e) =>
                                        setEditing({ ...editing, whatsapp: e.target.value })
                                    }
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium mb-1 block">Email</label>
                                <Input
                                    value={editing.email || ""}
                                    onChange={(e) =>
                                        setEditing({ ...editing, email: e.target.value })
                                    }
                                />
                            </div>
                            <div className="col-span-2">
                                <label className="text-sm font-medium mb-1 block">Google Maps URL</label>
                                <Input
                                    value={editing.google_maps_url || ""}
                                    onChange={(e) => {
                                        const nextUrl = e.target.value;
                                        const coords = extractCoordsFromGoogleMapsUrl(nextUrl);

                                        setEditing({
                                            ...editing,
                                            google_maps_url: nextUrl,
                                            lat: coords?.lat ?? editing.lat ?? null,
                                            lng: coords?.lng ?? editing.lng ?? null,
                                        });
                                    }}
                                    placeholder="https://www.google.com/maps/place/..."
                                />
                                <p className="text-xs text-muted-foreground mt-1">
                                    If this URL contains coordinates, latitude and longitude will auto-fill.
                                </p>
                            </div>
                            <div>
                                <label className="text-sm font-medium mb-1 block">Type</label>
                                <select
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                    value={editing.dealer_type || "both"}
                                    onChange={(e) =>
                                        setEditing({
                                            ...editing,
                                            dealer_type: e.target.value as Dealer["dealer_type"],
                                        })
                                    }
                                >
                                    {dealerTypes.map((t) => (
                                        <option key={t} value={t} className="capitalize">
                                            {t}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="text-sm font-medium mb-1 block">Latitude</label>
                                <Input
                                    type="number"
                                    step="any"
                                    value={editing.lat ?? ""}
                                    onChange={(e) =>
                                        setEditing({
                                            ...editing,
                                            lat: e.target.value === "" ? null : Number(e.target.value),
                                        })
                                    }
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium mb-1 block">Longitude</label>
                                <Input
                                    type="number"
                                    step="any"
                                    value={editing.lng ?? ""}
                                    onChange={(e) =>
                                        setEditing({
                                            ...editing,
                                            lng: e.target.value === "" ? null : Number(e.target.value),
                                        })
                                    }
                                />
                            </div>
                            <div className="col-span-2">
                                <label className="text-sm font-medium mb-1 block">Brands (comma separated)</label>
                                <Input
                                    value={serializeBrands(editing.brands)}
                                    onChange={(e) =>
                                        setEditing({ ...editing, brands: parseBrands(e.target.value) })
                                    }
                                    placeholder="kama, kinwin, chtc"
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium mb-1 block">
                                    Working Hours
                                </label>
                                <Input
                                    value={editing.working_hours || ""}
                                    onChange={(e) =>
                                        setEditing({ ...editing, working_hours: e.target.value })
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

export default AdminDealers;
