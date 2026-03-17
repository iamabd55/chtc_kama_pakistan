"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { adminDb } from "@/lib/supabase/adminClient";
import { Save } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import type { SiteSettings } from "@/lib/supabase/types";

const ease = [0.25, 0.4, 0, 1] as const;

const AdminSettings = () => {
    const [settings, setSettings] = useState<Partial<SiteSettings>>({});
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [heroSlidesJson, setHeroSlidesJson] = useState("[]");

    useEffect(() => {
        const fetchSettings = async () => {
            const { data } = await adminDb
                .from("site_settings")
                .select("*")
                .eq("id", 1)
                .single();
            if (data) {
                const typed = data as SiteSettings;
                setSettings(typed);
                setHeroSlidesJson(JSON.stringify(typed.hero_slides ?? [], null, 2));
            }
            setLoading(false);
        };
        fetchSettings();
    }, []);

    const handleSave = async () => {
        let parsedHeroSlides: SiteSettings["hero_slides"] = [];
        try {
            parsedHeroSlides = JSON.parse(heroSlidesJson || "[]");
            if (!Array.isArray(parsedHeroSlides)) {
                throw new Error("Hero slides must be a JSON array");
            }
        } catch {
            toast({
                title: "Invalid Hero Slides JSON",
                description: "Please provide a valid JSON array for hero slides.",
                variant: "destructive",
            });
            return;
        }

        setSaving(true);
        const payload = {
            whatsapp_number: settings.whatsapp_number || "",
            sales_email: settings.sales_email || "",
            support_email: settings.support_email || null,
            office_phone: settings.office_phone || null,
            office_address: settings.office_address || null,
            google_maps_embed: settings.google_maps_embed || null,
            social_links: settings.social_links || {},
            hero_slides: parsedHeroSlides,
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
                <div className="max-w-2xl space-y-8">
                    {/* Contact Information skeleton */}
                    <div className="bg-card rounded-xl border p-6 shadow-sm">
                        <Skeleton className="h-6 w-44 mb-4" />
                        <div className="grid grid-cols-2 gap-4">
                            {Array.from({ length: 4 }).map((_, i) => (
                                <div key={i}>
                                    <Skeleton className="h-4 w-28 mb-1" />
                                    <Skeleton className="h-10 w-full rounded-md" />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Location skeleton */}
                    <div className="bg-card rounded-xl border p-6 shadow-sm">
                        <Skeleton className="h-6 w-24 mb-4" />
                        <div className="space-y-4">
                            <div>
                                <Skeleton className="h-4 w-28 mb-1" />
                                <Skeleton className="h-10 w-full rounded-md" />
                            </div>
                            <div>
                                <Skeleton className="h-4 w-44 mb-1" />
                                <Skeleton className="h-10 w-full rounded-md" />
                            </div>
                        </div>
                    </div>

                    {/* Branding skeleton */}
                    <div className="bg-card rounded-xl border p-6 shadow-sm">
                        <Skeleton className="h-6 w-24 mb-4" />
                        <div className="space-y-4">
                            <div>
                                <Skeleton className="h-4 w-32 mb-1" />
                                <Skeleton className="h-10 w-full rounded-md" />
                            </div>
                            <div>
                                <Skeleton className="h-4 w-24 mb-1" />
                                <Skeleton className="h-[60px] w-full rounded-md" />
                            </div>
                        </div>
                    </div>

                    {/* Social Links skeleton */}
                    <div className="bg-card rounded-xl border p-6 shadow-sm">
                        <Skeleton className="h-6 w-28 mb-4" />
                        <div className="grid grid-cols-2 gap-4">
                            {Array.from({ length: 4 }).map((_, i) => (
                                <div key={i}>
                                    <Skeleton className="h-4 w-20 mb-1" />
                                    <Skeleton className="h-10 w-full rounded-md" />
                                </div>
                            ))}
                        </div>
                    </div>
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
                <motion.div
                    className="bg-card rounded-xl border p-6 shadow-sm"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, ease }}
                >
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
                </motion.div>

                {/* Location */}
                <motion.div
                    className="bg-card rounded-xl border p-6 shadow-sm"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.1, ease }}
                >
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
                </motion.div>

                {/* Branding */}
                <motion.div
                    className="bg-card rounded-xl border p-6 shadow-sm"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.2, ease }}
                >
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
                </motion.div>

                {/* Social Links */}
                <motion.div
                    className="bg-card rounded-xl border p-6 shadow-sm"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.3, ease }}
                >
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
                </motion.div>

                {/* Hero Slides */}
                <motion.div
                    className="bg-card rounded-xl border p-6 shadow-sm"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.4, ease }}
                >
                    <h2 className="font-display text-lg font-bold text-foreground mb-4">
                        Hero Slides
                    </h2>
                    <p className="text-xs text-muted-foreground mb-3">
                        JSON array with fields: imageUrl, title, subtitle, ctaText, ctaLink
                    </p>
                    <textarea
                        className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm min-h-[220px] font-mono"
                        value={heroSlidesJson}
                        onChange={(e) => setHeroSlidesJson(e.target.value)}
                    />
                </motion.div>
            </div>
        </AdminLayout>
    );
};

export default AdminSettings;
