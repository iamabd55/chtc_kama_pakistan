"use client";

import { useEffect, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { adminDb } from "@/lib/supabase/adminClient";
import { Save } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import type { SiteSettings } from "@/lib/supabase/types";

const AdminSettings = () => {
    const [settings, setSettings] = useState<Partial<SiteSettings>>({});
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const fetchSettings = async () => {
            const { data } = await adminDb
                .from("site_settings")
                .select("*")
                .eq("id", 1)
                .single();
            if (data) setSettings(data as SiteSettings);
            setLoading(false);
        };
        fetchSettings();
    }, []);

    const handleSave = async () => {
        setSaving(true);
        const payload = {
            whatsapp_number: settings.whatsapp_number || "",
            sales_email: settings.sales_email || "",
            support_email: settings.support_email || null,
            office_phone: settings.office_phone || null,
            office_address: settings.office_address || null,
            google_maps_embed: settings.google_maps_embed || null,
            social_links: settings.social_links || {},
            company_tagline: settings.company_tagline || null,
            footer_text: settings.footer_text || null,
            updated_at: new Date().toISOString(),
        };

        const { error } = await adminDb
            .from("site_settings")
            .upsert({ id: 1, ...payload });
        if (error)
            toast({ title: "Error", description: error.message, variant: "destructive" });
        else toast({ title: "Settings saved" });
        setSaving(false);
    };

    if (loading) {
        return (
            <AdminLayout
                title="Site Settings"
                subtitle="Manage global configuration"
            >
                <div className="flex items-center justify-center py-20">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout
            title="Site Settings"
            subtitle="Manage global configuration"
            actions={
                <Button
                    onClick={handleSave}
                    disabled={saving}
                    className="font-display font-semibold"
                >
                    <Save className="w-4 h-4 mr-2" />
                    {saving ? "Saving..." : "Save Changes"}
                </Button>
            }
        >
            <div className="max-w-2xl space-y-8">
                {/* Contact Information */}
                <div className="bg-card rounded-xl border p-6 shadow-sm">
                    <h2 className="font-display text-lg font-bold text-foreground mb-4">
                        Contact Information
                    </h2>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm font-medium mb-1 block">
                                WhatsApp Number *
                            </label>
                            <Input
                                value={settings.whatsapp_number || ""}
                                onChange={(e) =>
                                    setSettings({ ...settings, whatsapp_number: e.target.value })
                                }
                            />
                        </div>
                        <div>
                            <label className="text-sm font-medium mb-1 block">
                                Sales Email *
                            </label>
                            <Input
                                value={settings.sales_email || ""}
                                onChange={(e) =>
                                    setSettings({ ...settings, sales_email: e.target.value })
                                }
                            />
                        </div>
                        <div>
                            <label className="text-sm font-medium mb-1 block">
                                Support Email
                            </label>
                            <Input
                                value={settings.support_email || ""}
                                onChange={(e) =>
                                    setSettings({ ...settings, support_email: e.target.value })
                                }
                            />
                        </div>
                        <div>
                            <label className="text-sm font-medium mb-1 block">
                                Office Phone
                            </label>
                            <Input
                                value={settings.office_phone || ""}
                                onChange={(e) =>
                                    setSettings({ ...settings, office_phone: e.target.value })
                                }
                            />
                        </div>
                    </div>
                </div>

                {/* Location */}
                <div className="bg-card rounded-xl border p-6 shadow-sm">
                    <h2 className="font-display text-lg font-bold text-foreground mb-4">
                        Location
                    </h2>
                    <div className="space-y-4">
                        <div>
                            <label className="text-sm font-medium mb-1 block">
                                Office Address
                            </label>
                            <Input
                                value={settings.office_address || ""}
                                onChange={(e) =>
                                    setSettings({ ...settings, office_address: e.target.value })
                                }
                            />
                        </div>
                        <div>
                            <label className="text-sm font-medium mb-1 block">
                                Google Maps Embed URL
                            </label>
                            <Input
                                value={settings.google_maps_embed || ""}
                                onChange={(e) =>
                                    setSettings({ ...settings, google_maps_embed: e.target.value })
                                }
                            />
                        </div>
                    </div>
                </div>

                {/* Branding */}
                <div className="bg-card rounded-xl border p-6 shadow-sm">
                    <h2 className="font-display text-lg font-bold text-foreground mb-4">
                        Branding
                    </h2>
                    <div className="space-y-4">
                        <div>
                            <label className="text-sm font-medium mb-1 block">
                                Company Tagline
                            </label>
                            <Input
                                value={settings.company_tagline || ""}
                                onChange={(e) =>
                                    setSettings({ ...settings, company_tagline: e.target.value })
                                }
                            />
                        </div>
                        <div>
                            <label className="text-sm font-medium mb-1 block">Footer Text</label>
                            <textarea
                                className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm min-h-[60px]"
                                value={settings.footer_text || ""}
                                onChange={(e) =>
                                    setSettings({ ...settings, footer_text: e.target.value })
                                }
                            />
                        </div>
                    </div>
                </div>

                {/* Social Links */}
                <div className="bg-card rounded-xl border p-6 shadow-sm">
                    <h2 className="font-display text-lg font-bold text-foreground mb-4">
                        Social Links
                    </h2>
                    <div className="grid grid-cols-2 gap-4">
                        {(["facebook", "instagram", "linkedin", "youtube"] as const).map(
                            (platform) => (
                                <div key={platform}>
                                    <label className="text-sm font-medium mb-1 block capitalize">
                                        {platform}
                                    </label>
                                    <Input
                                        value={
                                            (
                                                settings.social_links as Record<string, string>
                                            )?.[platform] || ""
                                        }
                                        onChange={(e) =>
                                            setSettings({
                                                ...settings,
                                                social_links: {
                                                    ...(settings.social_links as Record<string, string>),
                                                    [platform]: e.target.value,
                                                },
                                            })
                                        }
                                        placeholder={`https://${platform}.com/...`}
                                    />
                                </div>
                            )
                        )}
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default AdminSettings;
