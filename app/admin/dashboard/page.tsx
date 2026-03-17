"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import AdminLayout from "@/components/admin/AdminLayout";
import StatsCard from "@/components/admin/StatsCard";
import StatusBadge from "@/components/admin/StatusBadge";
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
    ArrowRight,
    Zap,
    Clock3,
    Database,
    Shield,
    Activity,
    Settings,
} from "lucide-react";
import type { Inquiry } from "@/lib/supabase/types";

const AdminDashboard = () => {
    const [stats, setStats] = useState({
        products: 0,
        inquiries: 0,
        newInquiries: 0,
        news: 0,
        dealers: 0,
        careers: 0,
        applications: 0,
        categories: 0,
    });
    const [recentInquiries, setRecentInquiries] = useState<Inquiry[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            const [
                products,
                inquiries,
                newInq,
                news,
                dealers,
                careers,
                applications,
                categories,
                recent,
            ] = await Promise.all([
                adminDb.from("products").select("id", { count: "exact", head: true }),
                adminDb.from("inquiries").select("id", { count: "exact", head: true }),
                adminDb
                    .from("inquiries")
                    .select("id", { count: "exact", head: true })
                    .eq("status", "new"),
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
                    .from("inquiries")
                    .select("*")
                    .order("created_at", { ascending: false })
                    .limit(5),
            ]);

            setStats({
                products: products.count || 0,
                inquiries: inquiries.count || 0,
                newInquiries: newInq.count || 0,
                news: news.count || 0,
                dealers: dealers.count || 0,
                careers: careers.count || 0,
                applications: applications.count || 0,
                categories: categories.count || 0,
            });
            setRecentInquiries((recent.data as Inquiry[]) || []);
            setLoading(false);
        };
        fetchStats();
    }, []);

    return (
        <AdminLayout
            title="Dashboard"
            subtitle="Mission control for operations, sales pipeline, and content"
        >
            <div className="grid grid-cols-1 lg:grid-cols-[1.6fr_1fr] gap-6 mb-8">
                <section className="relative overflow-hidden rounded-2xl border border-slate-200 bg-[linear-gradient(145deg,#0b2a54_0%,#113d74_55%,#0f3c72_100%)] text-white px-6 py-6 md:px-8 md:py-8 shadow-[0_20px_40px_rgba(11,43,86,0.28)]">
                    <div className="absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_12%_20%,rgba(255,255,255,0.22),transparent_36%),radial-gradient(circle_at_90%_10%,rgba(214,146,59,0.30),transparent_30%)]" />
                    <div className="relative">
                        <p className="text-[10px] uppercase tracking-[0.25em] text-white/70 font-semibold mb-2">Operations Cockpit</p>
                        <h2 className="font-display text-2xl md:text-3xl font-black leading-tight mb-3">Everything important. One command surface.</h2>
                        <p className="text-white/75 max-w-2xl text-sm md:text-base mb-2">Track new leads, update product catalog, publish company updates, and monitor hiring from a single workspace.</p>
                        <p className="text-white/90 text-sm md:text-base font-semibold mb-6">For CHTC Kama Pakistan nationwide operations.</p>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <div className="rounded-xl border border-white/20 bg-white/10 px-3 py-3">
                                <p className="text-white/70 text-[11px] uppercase tracking-[0.12em]">Lead Queue</p>
                                <p className="text-xl font-black mt-1">{stats.newInquiries}</p>
                            </div>
                            <div className="rounded-xl border border-white/20 bg-white/10 px-3 py-3">
                                <p className="text-white/70 text-[11px] uppercase tracking-[0.12em]">Published News</p>
                                <p className="text-xl font-black mt-1">{stats.news}</p>
                            </div>
                            <div className="rounded-xl border border-white/20 bg-white/10 px-3 py-3">
                                <p className="text-white/70 text-[11px] uppercase tracking-[0.12em]">Dealer Network</p>
                                <p className="text-xl font-black mt-1">{stats.dealers}</p>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="rounded-2xl border border-slate-200 bg-white/85 p-5 shadow-[0_12px_28px_rgba(11,29,58,0.08)]">
                    <p className="text-[10px] uppercase tracking-[0.22em] text-slate-500 font-semibold mb-3">Quick Actions</p>
                    <div className="space-y-2.5">
                        {[
                            { label: "Add Product", href: "/admin/products", icon: Package },
                            { label: "Publish News", href: "/admin/news", icon: Newspaper },
                            { label: "Review Inquiries", href: "/admin/inquiries", icon: MessageSquare },
                            { label: "Update Site Settings", href: "/admin/settings", icon: Settings },
                        ].map((action) => (
                            <Link key={action.label} href={action.href} className="group flex items-center justify-between rounded-xl border border-slate-200 px-3 py-2.5 hover:bg-slate-50 transition-colors">
                                <span className="flex items-center gap-2.5 text-sm font-medium text-slate-800">
                                    <span className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                                        <action.icon className="w-4 h-4" />
                                    </span>
                                    {action.label}
                                </span>
                                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
                            </Link>
                        ))}
                    </div>
                </section>
            </div>

            {/* Stats Grid — Row 1 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-5">
                <StatsCard
                    title="Total Products"
                    value={stats.products}
                    icon={Package}
                    color="blue"
                />
                <StatsCard
                    title="New Inquiries"
                    value={stats.newInquiries}
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
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

            <div className="grid grid-cols-1 xl:grid-cols-[1.3fr_1fr] gap-6">
                {/* Recent Inquiries */}
                <div className="bg-card rounded-xl border shadow-sm">
                <div className="px-6 py-4 border-b">
                    <h2 className="font-display text-lg font-bold text-foreground">
                        Recent Inquiries
                    </h2>
                </div>
                <div className="divide-y">
                    {loading ? (
                        <div className="p-8 text-center text-muted-foreground">
                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto" />
                        </div>
                    ) : recentInquiries.length === 0 ? (
                        <div className="p-8 text-center text-muted-foreground">
                            No inquiries yet
                        </div>
                    ) : (
                        recentInquiries.map((inq) => (
                            <div
                                key={inq.id}
                                className="px-6 py-4 flex items-center justify-between hover:bg-muted/30 transition-colors"
                            >
                                <div>
                                    <p className="font-medium text-foreground">{inq.full_name}</p>
                                    <p className="text-sm text-muted-foreground">
                                        {inq.city} · {inq.inquiry_type} · {inq.phone}
                                    </p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <StatusBadge status={inq.status} />
                                    <span className="text-xs text-muted-foreground">
                                        {new Date(inq.created_at).toLocaleDateString()}
                                    </span>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

                <aside className="space-y-6">
                    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                        <h3 className="font-display text-lg font-bold text-slate-900 mb-4">System Health</h3>
                        <div className="space-y-3 text-sm">
                            <div className="flex items-center justify-between rounded-lg border border-slate-200 px-3 py-2">
                                <span className="flex items-center gap-2 text-slate-700"><Database className="w-4 h-4 text-primary" /> Data Sync</span>
                                <StatusBadge status="active" />
                            </div>
                            <div className="flex items-center justify-between rounded-lg border border-slate-200 px-3 py-2">
                                <span className="flex items-center gap-2 text-slate-700"><Shield className="w-4 h-4 text-primary" /> Auth Session</span>
                                <StatusBadge status="active" />
                            </div>
                            <div className="flex items-center justify-between rounded-lg border border-slate-200 px-3 py-2">
                                <span className="flex items-center gap-2 text-slate-700"><Activity className="w-4 h-4 text-primary" /> API Workers</span>
                                <StatusBadge status="active" />
                            </div>
                        </div>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                        <h3 className="font-display text-lg font-bold text-slate-900 mb-4">Automation</h3>
                        <div className="space-y-2 text-sm text-slate-700">
                            <p className="flex items-center gap-2"><Zap className="w-4 h-4 text-amber-500" /> Lead intake tracking is live</p>
                            <p className="flex items-center gap-2"><Clock3 className="w-4 h-4 text-primary" /> Last dashboard refresh this session</p>
                            <p className="text-xs text-slate-500 mt-3">Tip: use Inquiries to schedule follow-up dates and maintain conversion momentum.</p>
                        </div>
                    </div>
                </aside>
            </div>
        </AdminLayout>
    );
};

export default AdminDashboard;
