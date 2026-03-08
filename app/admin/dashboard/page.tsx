"use client";

import { useEffect, useState } from "react";
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
            subtitle="Welcome back — here's your overview"
        >
            {/* Stats Grid — Row 1 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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
        </AdminLayout>
    );
};

export default AdminDashboard;
