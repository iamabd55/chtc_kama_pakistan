"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import AdminLayout from "@/components/admin/AdminLayout";
import StatsCard from "@/components/admin/StatsCard";
import StatusBadge from "@/components/admin/StatusBadge";
import AvatarLabel from "@/components/admin/AvatarLabel";
import { adminDb } from "@/lib/supabase/adminClient";
import {
    Package,
    MessageSquare,
    Newspaper,
    MapPin,
    Briefcase,
    FileText,
    Users,
    TrendingUp,
    Megaphone,
    Save,
    Clock3,
    Database,
    Shield,
    Activity,
    Settings,
} from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/hooks/use-toast";
import type { Inquiry } from "@/lib/supabase/types";

const AdminDashboard = () => {
    const [stats, setStats] = useState({
        products: 0,
        inquiries: 0,
        inquiriesToday: 0,
        news: 0,
        dealers: 0,
        careers: 0,
        applications: 0,
        categories: 0,
    });
    const [recentInquiries, setRecentInquiries] = useState<Inquiry[]>([]);
    const [loading, setLoading] = useState(true);

    // Announcement banner quick-edit state
    const [bannerEnabled, setBannerEnabled] = useState(false);
    const [bannerMessage, setBannerMessage] = useState("");
    const [bannerSaving, setBannerSaving] = useState(false);

    useEffect(() => {
        const fetchStats = async () => {
            const startOfToday = new Date();
            startOfToday.setHours(0, 0, 0, 0);

            const [
                products,
                news,
                dealers,
                careers,
                applications,
                categories,
                siteSettings,
                inquiriesResponse,
            ] = await Promise.all([
                adminDb.from("products").select("id", { count: "exact", head: true }),
                adminDb
                    .from("news_posts")
                    .select("id", { count: "exact", head: true }),
                adminDb.from("dealers").select("id", { count: "exact", head: true }),
                adminDb
                    .from("career_posts")
                    .select("id", { count: "exact", head: true }),
                adminDb
                    .from("job_applications")
                    .select("id", { count: "exact", head: true }),
                adminDb
                    .from("categories")
                    .select("id", { count: "exact", head: true }),
                adminDb
                    .from("site_settings")
                    .select("announcement_banner_enabled, announcement_banner_message")
                    .eq("id", 1)
                    .single(),
                fetch("/api/admin/inquiries", {
                    credentials: "same-origin",
                }),
            ]);

            const inquiriesPayload = await inquiriesResponse.json().catch(() => ({}));
            const inquiriesList = inquiriesResponse.ok
                ? ((inquiriesPayload.inquiries as Inquiry[]) || [])
                : [];
            const inquiriesToday = inquiriesList.filter(
                (inquiry) => new Date(inquiry.created_at) >= startOfToday
            ).length;
            const recent = inquiriesList.slice(0, 5);

            setStats({
                products: products.count || 0,
                inquiries: inquiriesList.length,
                inquiriesToday,
                news: news.count || 0,
                dealers: dealers.count || 0,
                careers: careers.count || 0,
                applications: applications.count || 0,
                categories: categories.count || 0,
            });
            setRecentInquiries(recent);

            if (siteSettings.data) {
                setBannerEnabled(siteSettings.data.announcement_banner_enabled ?? false);
                setBannerMessage(siteSettings.data.announcement_banner_message ?? "");
            }

            setLoading(false);
        };
        fetchStats();
    }, []);

    const handleSaveBanner = async () => {
        if (bannerEnabled && !bannerMessage.trim()) {
            toast({
                title: "Message required",
                description: "Enter a banner message before enabling it.",
                variant: "destructive",
            });
            return;
        }
        setBannerSaving(true);
        const { error } = await adminDb
            .from("site_settings")
            .update({
                announcement_banner_enabled: bannerEnabled,
                announcement_banner_message: bannerMessage || null,
                updated_at: new Date().toISOString(),
            })
            .eq("id", 1);
        if (error) {
            toast({ title: "Error", description: error.message, variant: "destructive" });
        } else {
            toast({ title: "Banner updated", description: bannerEnabled ? "Banner is now live." : "Banner is now hidden." });
        }
        setBannerSaving(false);
    };

    return (
        <AdminLayout
            title="Dashboard"
            subtitle="Mission control for operations, sales pipeline, and content"
            useContentCard={false}
        >
            <div className="space-y-5">
                {/* Quick Actions */}
                <section className="rounded-2xl border border-slate-200 bg-white p-4 md:p-5 shadow-[0_12px_28px_rgba(11,29,58,0.08)]">
                    <p className="text-[10px] uppercase tracking-[0.22em] text-slate-500 font-semibold mb-3">Quick Actions</p>
                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4">
                        {[
                            { label: "Add Product", href: "/admin/products", icon: Package, color: "text-blue-600 bg-blue-50 border-blue-100" },
                            { label: "Publish News", href: "/admin/news", icon: Newspaper, color: "text-emerald-600 bg-emerald-50 border-emerald-100" },
                            { label: "Review Inquiries", href: "/admin/inquiries", icon: MessageSquare, color: "text-sky-600 bg-sky-50 border-sky-100" },
                            { label: "Update Site Settings", href: "/admin/settings", icon: Settings, color: "text-amber-600 bg-amber-50 border-amber-100" },
                        ].map((action) => (
                            <Link key={action.label} href={action.href} className="group flex items-center gap-3 rounded-xl border border-slate-200 px-3 py-2.5 hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm" prefetch={false}>
                                <span className={`w-9 h-9 shrink-0 rounded-lg flex items-center justify-center border ${action.color}`}>
                                    <action.icon className="w-4 h-4" />
                                </span>
                                <span className="text-[13px] font-semibold text-slate-700 group-hover:text-slate-900">
                                    {action.label}
                                </span>
                            </Link>
                        ))}
                    </div>
                </section>

                {/* Stats Grid — Row 1 */}
                <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
                    <StatsCard
                        title="Total Products"
                        value={stats.products}
                        icon={Package}
                        color="blue"
                    />
                    <StatsCard
                        title="Inquiries Today"
                        value={stats.inquiriesToday}
                        icon={MessageSquare}
                        color="gold"
                        trend={`${stats.inquiries} total`}
                        trendUp
                    />
                    <StatsCard
                        title="News Posts"
                        value={stats.news}
                        icon={Newspaper}
                        color="green"
                    />
                    <StatsCard
                        title="Active Dealers"
                        value={stats.dealers}
                        icon={MapPin}
                        color="blue"
                    />
                </div>

                {/* Stats Grid — Row 2 */}
                <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
                    <StatsCard
                        title="Categories"
                        value={stats.categories}
                        icon={Users}
                        color="blue"
                    />
                    <StatsCard
                        title="Career Posts"
                        value={stats.careers}
                        icon={Briefcase}
                        color="gold"
                    />
                    <StatsCard
                        title="Job Applications"
                        value={stats.applications}
                        icon={FileText}
                        color="green"
                    />
                    <StatsCard
                        title="Total Inquiries"
                        value={stats.inquiries}
                        icon={TrendingUp}
                        color="gold"
                    />
                </div>

                {/* Bottom row: Recent Inquiries + Sidebar */}
                <div className="grid grid-cols-1 gap-5 xl:grid-cols-[1.25fr_0.95fr]">
                    {/* Recent Inquiries */}
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                        <div className="px-5 py-4 border-b border-slate-100">
                            <h2 className="font-display text-[17px] font-bold text-slate-900">
                                Recent Inquiries
                            </h2>
                        </div>
                        <div className="divide-y divide-slate-100">
                            {loading ? (
                                <div className="p-8 text-center text-sm text-muted-foreground">
                                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto" />
                                </div>
                            ) : recentInquiries.length === 0 ? (
                                <div className="py-10 text-center text-sm text-slate-400">
                                    No inquiries yet
                                </div>
                            ) : (
                                recentInquiries.map((inq) => (
                                    <Link key={inq.id}
                                        href={`/admin/inquiries?inquiryId=${inq.id}`}
                                        className="px-5 py-3.5 flex items-center justify-between hover:bg-slate-50 transition-colors"
                                        prefetch={false}>
                                        <AvatarLabel
                                            name={inq.full_name}
                                            subtitle={`${inq.city} · ${inq.inquiry_type} · ${inq.phone}`}
                                        />
                                        <div className="flex items-center gap-3">
                                            <StatusBadge status={inq.status} />
                                            <span className="text-xs text-slate-400">
                                                {new Date(inq.created_at).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </Link>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Sidebar panels */}
                    <aside className="space-y-4">
                        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                            <h3 className="font-display text-[16px] font-bold text-slate-900 mb-3">System Health</h3>
                            <div className="space-y-2 text-sm">
                                <div className="flex items-center justify-between rounded-lg border border-slate-100 bg-slate-50/60 px-3 py-2.5">
                                    <span className="flex items-center gap-2 text-slate-700"><Database className="w-4 h-4 text-primary" /> Data Sync</span>
                                    <StatusBadge status="active" />
                                </div>
                                <div className="flex items-center justify-between rounded-lg border border-slate-100 bg-slate-50/60 px-3 py-2.5">
                                    <span className="flex items-center gap-2 text-slate-700"><Shield className="w-4 h-4 text-primary" /> Auth Session</span>
                                    <StatusBadge status="active" />
                                </div>
                                <div className="flex items-center justify-between rounded-lg border border-slate-100 bg-slate-50/60 px-3 py-2.5">
                                    <span className="flex items-center gap-2 text-slate-700"><Activity className="w-4 h-4 text-primary" /> API Workers</span>
                                    <StatusBadge status="active" />
                                </div>
                            </div>
                        </div>

                        {/* Announcement Banner Quick Control */}
                        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                            <div className="flex items-center justify-between mb-3">
                                <h3 className="font-display text-[16px] font-bold text-slate-900 flex items-center gap-2">
                                    <Megaphone className="w-4 h-4 text-amber-500" />
                                    Announcement
                                </h3>
                                <div className="flex items-center gap-2">
                                    <Switch
                                        checked={bannerEnabled}
                                        onCheckedChange={setBannerEnabled}
                                        id="dashboard-banner-toggle"
                                    />
                                    <label
                                        htmlFor="dashboard-banner-toggle"
                                        className={`text-xs font-semibold cursor-pointer ${
                                            bannerEnabled ? "text-amber-600" : "text-slate-400"
                                        }`}
                                    >
                                        {bannerEnabled ? "Live" : "Off"}
                                    </label>
                                </div>
                            </div>
                            <textarea
                                className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-800 placeholder:text-slate-400 resize-none focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400 transition min-h-[72px]"
                                placeholder="e.g. Eid holiday closure — reopening Monday."
                                value={bannerMessage}
                                onChange={(e) => setBannerMessage(e.target.value)}
                            />
                            <button
                                onClick={handleSaveBanner}
                                disabled={bannerSaving}
                                className="mt-2.5 w-full inline-flex items-center justify-center gap-2 rounded-lg bg-amber-500 hover:bg-amber-600 disabled:opacity-60 text-white text-sm font-semibold px-4 py-2 transition-colors"
                            >
                                <Save className="w-3.5 h-3.5" />
                                {bannerSaving ? "Saving…" : "Save Banner"}
                            </button>
                            <p className="text-[11px] text-slate-400 mt-2 text-center">
                                Full settings →{" "}
                                <a href="/admin/settings" className="underline hover:text-slate-600">Site Settings</a>
                            </p>
                        </div>
                    </aside>
                </div>
            </div>
        </AdminLayout>
    );
};

export default AdminDashboard;

