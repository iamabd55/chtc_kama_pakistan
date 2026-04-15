"use client";
import Image from 'next/image';
import { useEffect, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import DataTable from "@/components/admin/DataTable";
import StatusBadge from "@/components/admin/StatusBadge";
import { adminDb } from "@/lib/supabase/adminClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import type { ClientLogo } from "@/lib/supabase/types";
import { getStorageUrl } from "@/lib/supabase/storage";

export default function AdminClientsPage() {
    const [items, setItems] = useState<ClientLogo[]>([]);
    const [loading, setLoading] = useState(true);
    const [open, setOpen] = useState(false);
    const [editing, setEditing] = useState<Partial<ClientLogo> | null>(null);
    const [logoFile, setLogoFile] = useState<File | null>(null);
    const [saving, setSaving] = useState(false);

    const resolveLogoUrl = (logoUrl: string) => (logoUrl.startsWith("/") ? logoUrl : getStorageUrl(logoUrl));

    const uploadLogo = async (file: File) => {
        const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
        const uploadPath = `clients/logos/${Date.now()}-${safeName}`;

        const { error } = await adminDb.storage
            .from("images")
            .upload(uploadPath, file, {
                contentType: file.type || "application/octet-stream",
                upsert: false,
            });

        if (error) throw new Error(error.message);
        return uploadPath;
    };

    const fetchData = async () => {
        setLoading(true);
        const { data } = await adminDb.from("client_logos").select("*").order("display_order");
        setItems((data as ClientLogo[]) || []);
        setLoading(false);
    };

    useEffect(() => { fetchData(); }, []);

    const save = async () => {
        if (!editing?.name || (!editing?.logo_url && !logoFile)) {
            toast({ title: "Client name and logo are required", variant: "destructive" });
            return;
        }

        setSaving(true);

        let logoPath = editing.logo_url || "";

        try {
            if (logoFile) {
                logoPath = await uploadLogo(logoFile);
            }
        } catch (error) {
            setSaving(false);
            toast({
                title: "Logo upload failed",
                description: error instanceof Error ? error.message : "Could not upload logo",
                variant: "destructive",
            });
            return;
        }

        const payload = {
            name: editing.name,
            logo_url: logoPath,
            website_url: editing.website_url || null,
            display_order: editing.display_order || 0,
            is_active: editing.is_active ?? true,
            updated_at: new Date().toISOString(),
        };
        const { error } = editing.id
            ? await adminDb.from("client_logos").update(payload).eq("id", editing.id)
            : await adminDb.from("client_logos").insert(payload);

        if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
        else {
            toast({ title: editing.id ? "Client updated" : "Client added" });
            setOpen(false);
            setLogoFile(null);
            fetchData();
        }

        setSaving(false);
    };

    const remove = async (id: string) => {
        if (!confirm("Delete this logo?")) return;
        const { error } = await adminDb.from("client_logos").delete().eq("id", id);
        if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
        else { toast({ title: "Client deleted" }); fetchData(); }
    };

    const columns = [
        {
            header: "Client",
            accessor: (row: ClientLogo) => (
                <div className="flex items-center gap-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <Image src={resolveLogoUrl(row.logo_url)} alt={row.name} className="w-12 h-12 rounded-md object-cover bg-muted"  width={800} height={600}  loading="lazy" />
                    <div>
                        <p className="font-medium">{row.name}</p>
                        <p className="text-xs text-muted-foreground">{row.website_url || "—"}</p>
                    </div>
                </div>
            ),
        },
        { header: "Order", accessor: "display_order" as keyof ClientLogo },
        { header: "Status", accessor: (row: ClientLogo) => <StatusBadge status={row.is_active ? "active" : "inactive"} /> },
        {
            header: "Actions",
            accessor: (row: ClientLogo) => (
                <div className="flex gap-2">
                    <Button size="sm" variant="ghost" onClick={() => { setEditing(row); setLogoFile(null); setOpen(true); }}><Pencil className="w-4 h-4" /></Button>
                    <Button size="sm" variant="ghost" className="text-destructive" onClick={() => remove(row.id)}><Trash2 className="w-4 h-4" /></Button>
                </div>
            ),
        },
    ];

    return (
        <AdminLayout title="Client Logos" subtitle={`${items.length} logos`} actions={<Button onClick={() => { setEditing({ is_active: true, display_order: 0 }); setLogoFile(null); setOpen(true); }}><Plus className="w-4 h-4 mr-2" />Add Logo</Button>}>
            <DataTable columns={columns} data={items} loading={loading} />
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="w-[calc(100vw-1.5rem)] max-w-lg max-h-[88vh] p-4 sm:p-6 overflow-hidden">
                    <DialogHeader><DialogTitle>{editing?.id ? "Edit" : "Add"} Client</DialogTitle></DialogHeader>
                    {editing && (
                        <div className="space-y-4 overflow-y-auto pr-1 pb-1 max-h-[calc(88vh-4.5rem)]">
                            <div className="space-y-2">
                                <label htmlFor="client_name" className="text-sm font-medium">Client Name</label>
                                <Input id="client_name" placeholder="e.g. ABC Logistics" value={editing.name || ""} onChange={(e) => setEditing({ ...editing, name: e.target.value })} />
                            </div>
                            <div className="space-y-2">
                                <label htmlFor="client_logo_url" className="text-sm font-medium">Logo Path / URL</label>
                                <Input id="client_logo_url" placeholder="e.g. clients/logos/abc.png or /images/clients/abc.png" value={editing.logo_url || ""} onChange={(e) => setEditing({ ...editing, logo_url: e.target.value })} />
                                <label htmlFor="client_logo_file" className="text-sm font-medium">Or Upload Logo</label>
                                <Input id="client_logo_file" type="file" accept="image/*" onChange={(e) => setLogoFile(e.target.files?.[0] ?? null)} />
                                <p className="text-xs text-muted-foreground">This logo appears on the public About Clients page.</p>
                                {(logoFile || editing.logo_url) && (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <Image
                                        src={logoFile ? URL.createObjectURL(logoFile) : resolveLogoUrl(editing.logo_url || "")}
                                        alt="Client logo preview"
                                        className="h-12 w-12 rounded-md object-cover bg-muted border"
                                     width={800} height={600}  loading="lazy" />
                                )}
                            </div>
                            <div className="space-y-2">
                                <label htmlFor="client_website_url" className="text-sm font-medium">Website URL (optional)</label>
                                <Input id="client_website_url" placeholder="https://example.com" value={editing.website_url || ""} onChange={(e) => setEditing({ ...editing, website_url: e.target.value })} />
                            </div>
                            <div className="space-y-2">
                                <label htmlFor="client_display_order" className="text-sm font-medium">Display Order</label>
                                <Input id="client_display_order" type="number" value={editing.display_order || 0} onChange={(e) => setEditing({ ...editing, display_order: Number.parseInt(e.target.value || "0", 10) })} />
                                <p className="text-xs text-muted-foreground">Lower number appears first.</p>
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
