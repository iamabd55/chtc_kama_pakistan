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
        inquiriesToday: 0,
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
            const startOfToday = new Date();
            startOfToday.setHours(0, 0, 0, 0);

            const [
                products,
                inquiries,
                todayInquiries,
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
                    .gte("created_at", startOfToday.toISOString()),
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
                inquiriesToday: todayInquiries.count || 0,
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
            <div className="mb-8">
                <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_12px_28px_rgba(11,29,58,0.08)]">
                    <p className="text-[10px] uppercase tracking-[0.22em] text-slate-500 font-semibold mb-4">Quick Actions</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {[
                            { label: "Add Product", href: "/admin/products", icon: Package, color: "text-blue-600 bg-blue-50 border-blue-100" },
                            { label: "Publish News", href: "/admin/news", icon: Newspaper, color: "text-emerald-600 bg-emerald-50 border-emerald-100" },
                            { label: "Review Inquiries", href: "/admin/inquiries", icon: MessageSquare, color: "text-sky-600 bg-sky-50 border-sky-100" },
                            { label: "Update Site Settings", href: "/admin/settings", icon: Settings, color: "text-amber-600 bg-amber-50 border-amber-100" },
                        ].map((action) => (
                            <Link key={action.label} href={action.href} className="group flex items-center gap-3 rounded-xl border border-slate-200 p-3 hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm">
                                <span className={`w-10 h-10 shrink-0 rounded-lg flex items-center justify-center border ${action.color}`}>
                                    <action.icon className="w-5 h-5" />
                                </span>
                                <span className="text-sm font-semibold text-slate-700 group-hover:text-slate-900">
                                    {action.label}
                                </span>
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
                                <Link
                                    key={inq.id}
                                    href={`/admin/inquiries?inquiryId=${inq.id}`}
                                    className="px-6 py-4 flex items-center justify-between hover:bg-muted/30 transition-colors"
                                >
                                    <AvatarLabel
                                        name={inq.full_name}
                                        subtitle={`${inq.city} · ${inq.inquiry_type} · ${inq.phone}`}
                                    />
                                    <div className="flex items-center gap-3">
                                        <StatusBadge status={inq.status} />
                                        <span className="text-xs text-muted-foreground">
                                            {new Date(inq.created_at).toLocaleDateString()}
                                        </span>
                                    </div>
                                </Link>
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

