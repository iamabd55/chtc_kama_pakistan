"use client";

import { useEffect, useState, useCallback } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import {
    BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
    XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
    FunnelChart, Funnel, LabelList,
} from "recharts";
import {
    TrendingUp, MessageSquare, PieChart as PieIcon,
    Filter, MapPin, Clock, RefreshCw,
} from "lucide-react";
import type { Inquiry } from "@/lib/supabase/types";

// ─── colour palette ───────────────────────────────────────────────────────────
const BLUE   = "#0e5cbe";
const GOLD   = "#d6923b";
const GREEN  = "#16a34a";
const ROSE   = "#e11d48";
const PURPLE = "#7c3aed";
const CYAN   = "#0891b2";

const TYPE_COLORS: Record<string, string> = {
    purchase: BLUE,
    quote:    GOLD,
    brochure: GREEN,
    parts:    ROSE,
    service:  PURPLE,
    general:  CYAN,
};

const STATUS_ORDER = ["new", "contacted", "in-progress", "converted", "closed"];
const STATUS_COLORS: Record<string, string> = {
    new:          "#64748b",
    contacted:    BLUE,
    "in-progress": GOLD,
    converted:    GREEN,
    closed:       "#94a3b8",
};

// ─── helpers ─────────────────────────────────────────────────────────────────
function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString("en-PK", { day: "2-digit", month: "short" });
}

function formatDuration(hours: number) {
    if (!Number.isFinite(hours) || hours <= 0) {
        return "0m";
    }

    const totalMinutes = Math.round(hours * 60);
    const days = Math.floor(totalMinutes / 1440);
    const remainingAfterDays = totalMinutes % 1440;
    const hrs = Math.floor(remainingAfterDays / 60);
    const mins = remainingAfterDays % 60;

    if (days > 0) {
        return `${days}d ${hrs}h`;
    }

    if (hrs > 0) {
        return `${hrs}h ${mins}m`;
    }

    return `${mins}m`;
}

function groupByDay(inquiries: Inquiry[], days: number) {
    const result: Record<string, number> = {};
    const now = new Date();
    for (let i = days - 1; i >= 0; i--) {
        const d = new Date(now);
        d.setDate(d.getDate() - i);
        result[d.toISOString().slice(0, 10)] = 0;
    }
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - days);
    inquiries.forEach((inq) => {
        const day = inq.created_at.slice(0, 10);
        if (day in result) result[day] = (result[day] || 0) + 1;
    });
    return Object.entries(result).map(([date, count]) => ({
        date: formatDate(date + "T00:00:00"),
        count,
    }));
}

// ─── component ───────────────────────────────────────────────────────────────
type Range = 30 | 60 | 90;

export default function AnalyticsPage() {
    const [inquiries, setInquiries] = useState<Inquiry[]>([]);
    const [loading,   setLoading]   = useState(true);
    const [range,     setRange]     = useState<Range>(30);

    const load = useCallback(async () => {
        setLoading(true);
        const response = await fetch("/api/admin/inquiries", {
            credentials: "same-origin",
        });

        const payload = await response.json().catch(() => ({}));

        if (response.ok) {
            setInquiries((payload.inquiries as Inquiry[]) || []);
        } else {
            setInquiries([]);
        }

        setLoading(false);
    }, []);

    useEffect(() => { load(); }, [load]);

    // ── derived data ──────────────────────────────────────────────────────────
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - range);
    const filtered = inquiries.filter(
        (i) => new Date(i.created_at) >= cutoffDate
    );

    // 1. Daily volume
    const dailyData = groupByDay(filtered, range);

    // 2. Type breakdown
    const typeCounts: Record<string, number> = {};
    filtered.forEach((i) => {
        typeCounts[i.inquiry_type] = (typeCounts[i.inquiry_type] || 0) + 1;
    });
    const typeData = Object.entries(typeCounts).map(([name, value]) => ({ name, value }));

    // 3. Conversion funnel
    const statusCounts: Record<string, number> = {};
    STATUS_ORDER.forEach((s) => { statusCounts[s] = 0; });
    filtered.forEach((i) => {
        if (i.status in statusCounts) statusCounts[i.status]++;
    });
    const funnelData = STATUS_ORDER.map((s) => ({
        name: s.charAt(0).toUpperCase() + s.slice(1),
        value: statusCounts[s],
        fill: STATUS_COLORS[s],
    }));

    // 4. Top cities
    const cityCounts: Record<string, number> = {};
    filtered.forEach((i) => {
        const c = i.city?.trim();
        if (c) cityCounts[c] = (cityCounts[c] || 0) + 1;
    });
    const cityData = Object.entries(cityCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 8)
        .map(([city, count]) => ({ city, count }));

    const responseTimeData = STATUS_ORDER
        .filter((status) => status !== "new")
        .map((status) => {
            const statusRows = filtered.filter((inquiry) => inquiry.status === status);
            const responseHours = statusRows
                .map((inquiry) => {
                    const createdAt = new Date(inquiry.created_at).getTime();
                    const updatedAt = new Date(inquiry.updated_at).getTime();
                    return (updatedAt - createdAt) / (1000 * 60 * 60);
                })
                .filter((hours) => Number.isFinite(hours) && hours >= 0);

            const averageHours =
                responseHours.length > 0
                    ? responseHours.reduce((sum, hours) => sum + hours, 0) / responseHours.length
                    : 0;

            return {
                status,
                label: status.charAt(0).toUpperCase() + status.slice(1),
                hours: averageHours,
                formatted: formatDuration(averageHours),
                count: statusRows.length,
            };
        });

    // 5. Status breakdown bar
    const statusBarData = STATUS_ORDER.map((s) => ({
        status: s.charAt(0).toUpperCase() + s.slice(1),
        count: statusCounts[s],
    }));

    // ── summary cards ─────────────────────────────────────────────────────────
    const total       = filtered.length;
    const converted   = statusCounts["converted"] || 0;
    const convRate    = total > 0 ? ((converted / total) * 100).toFixed(1) : "0.0";
    const newCount    = statusCounts["new"] || 0;

    const cards = [
        { label: "Total Inquiries",   value: total,           icon: MessageSquare, color: "text-blue-600  bg-blue-50  border-blue-100"  },
        { label: "Converted",         value: converted,       icon: TrendingUp,    color: "text-green-600 bg-green-50 border-green-100" },
        { label: "Conversion Rate",   value: `${convRate}%`,  icon: PieIcon,       color: "text-amber-600 bg-amber-50 border-amber-100" },
        { label: "Pending (New)",     value: newCount,        icon: Clock,         color: "text-rose-600  bg-rose-50  border-rose-100"  },
    ];

    return (
        <AdminLayout
            title="Inquiry Analytics"
            subtitle="Sales intelligence from your existing inquiry data — no extra setup required"
            useContentCard={false}
            actions={
                <button
                    onClick={load}
                    disabled={loading}
                    className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 disabled:opacity-60 transition-colors"
                >
                    <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
                    Refresh
                </button>
            }
        >
            <div className="space-y-5">

                {/* Range selector */}
                <div className="flex items-center gap-3">
                    <Filter className="w-4 h-4 text-slate-500" />
                    <span className="text-sm font-medium text-slate-600">Period:</span>
                    {([30, 60, 90] as Range[]).map((r) => (
                        <button
                            key={r}
                            onClick={() => setRange(r)}
                            className={`px-4 py-1.5 rounded-full text-sm font-semibold border transition-all ${
                                range === r
                                    ? "bg-primary text-white border-primary shadow"
                                    : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"
                            }`}
                        >
                            {r}d
                        </button>
                    ))}
                </div>

                {/* Summary cards */}
                <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
                    {cards.map((c) => (
                        <div
                            key={c.label}
                            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm flex items-center gap-4"
                        >
                            <span className={`w-10 h-10 shrink-0 rounded-xl border flex items-center justify-center ${c.color}`}>
                                <c.icon className="w-5 h-5" />
                            </span>
                            <div>
                                <p className="text-xs text-slate-500 font-medium">{c.label}</p>
                                <p className="text-2xl font-black text-slate-900 font-display leading-tight">
                                    {loading ? "—" : c.value}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Row 1 — Daily volume + Type pie */}
                <div className="grid grid-cols-1 gap-5 xl:grid-cols-[1.6fr_1fr]">

                    {/* Daily Volume */}
                    <ChartCard title="Inquiries Per Day" icon={TrendingUp} loading={loading}>
                        <ResponsiveContainer width="100%" height={260}>
                            <LineChart data={dailyData} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                                <XAxis
                                    dataKey="date"
                                    tick={{ fontSize: 11, fill: "#94a3b8" }}
                                    interval={range === 30 ? 4 : range === 60 ? 9 : 13}
                                />
                                <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} allowDecimals={false} />
                                <Tooltip
                                    contentStyle={{ borderRadius: 10, fontSize: 13, border: "1px solid #e2e8f0" }}
                                    labelStyle={{ fontWeight: 700, color: "#0f172a" }}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="count"
                                    stroke={BLUE}
                                    strokeWidth={2.5}
                                    dot={false}
                                    activeDot={{ r: 5 }}
                                    name="Inquiries"
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </ChartCard>

                    {/* Type Pie */}
                    <ChartCard title="Inquiry Type Breakdown" icon={PieIcon} loading={loading}>
                        <ResponsiveContainer width="100%" height={260}>
                            <PieChart>
                                <Pie
                                    data={typeData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={62}
                                    outerRadius={100}
                                    paddingAngle={3}
                                    dataKey="value"
                                    nameKey="name"
                                >
                                    {typeData.map((entry) => (
                                        <Cell
                                            key={entry.name}
                                            fill={TYPE_COLORS[entry.name] ?? "#94a3b8"}
                                        />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{ borderRadius: 10, fontSize: 13, border: "1px solid #e2e8f0" }}
                                    formatter={(v: number, name: string) => [v, name]}
                                />
                                <Legend
                                    formatter={(value) => (
                                        <span style={{ fontSize: 12, color: "#475569", textTransform: "capitalize" }}>
                                            {value}
                                        </span>
                                    )}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </ChartCard>
                </div>

                {/* Row 2 — Funnel + Top Cities */}
                <div className="grid grid-cols-1 gap-5 xl:grid-cols-[1fr_1.4fr]">

                    {/* Conversion Funnel */}
                    <ChartCard title="Conversion Funnel" icon={Filter} loading={loading}>
                        <ResponsiveContainer width="100%" height={260}>
                            <FunnelChart>
                                <Tooltip
                                    contentStyle={{ borderRadius: 10, fontSize: 13, border: "1px solid #e2e8f0" }}
                                />
                                <Funnel dataKey="value" data={funnelData} isAnimationActive>
                                    <LabelList
                                        position="right"
                                        fill="#64748b"
                                        stroke="none"
                                        dataKey="name"
                                        style={{ fontSize: 12, fontWeight: 600 }}
                                    />
                                    <LabelList
                                        position="center"
                                        fill="#fff"
                                        stroke="none"
                                        dataKey="value"
                                        style={{ fontSize: 13, fontWeight: 700 }}
                                    />
                                </Funnel>
                            </FunnelChart>
                        </ResponsiveContainer>
                        {/* legend */}
                        <div className="flex flex-wrap gap-x-4 gap-y-1.5 mt-1 justify-center">
                            {STATUS_ORDER.map((s) => (
                                <span key={s} className="flex items-center gap-1.5 text-[11px] text-slate-500 font-medium">
                                    <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ background: STATUS_COLORS[s] }} />
                                    {s.charAt(0).toUpperCase() + s.slice(1)}
                                </span>
                            ))}
                        </div>
                    </ChartCard>

                    {/* Top Cities */}
                    <ChartCard title="Top Cities by Inquiry Volume" icon={MapPin} loading={loading}>
                        <ResponsiveContainer width="100%" height={260}>
                            <BarChart
                                data={cityData}
                                layout="vertical"
                                margin={{ top: 0, right: 12, left: 0, bottom: 0 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
                                <XAxis type="number" tick={{ fontSize: 11, fill: "#94a3b8" }} allowDecimals={false} />
                                <YAxis
                                    type="category"
                                    dataKey="city"
                                    tick={{ fontSize: 11, fill: "#475569" }}
                                    width={82}
                                />
                                <Tooltip
                                    contentStyle={{ borderRadius: 10, fontSize: 13, border: "1px solid #e2e8f0" }}
                                    cursor={{ fill: "#f8fafc" }}
                                />
                                <Bar dataKey="count" name="Inquiries" radius={[0, 6, 6, 0]}>
                                    {cityData.map((_, i) => (
                                        <Cell
                                            key={i}
                                            fill={i === 0 ? BLUE : i === 1 ? GOLD : i === 2 ? GREEN : "#cbd5e1"}
                                        />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </ChartCard>
                </div>

                {/* Row 3 — Status bar chart */}
                <ChartCard title="Status Distribution" icon={MessageSquare} loading={loading}>
                    <ResponsiveContainer width="100%" height={220}>
                        <BarChart data={statusBarData} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                            <XAxis dataKey="status" tick={{ fontSize: 12, fill: "#475569" }} />
                            <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} allowDecimals={false} />
                            <Tooltip
                                contentStyle={{ borderRadius: 10, fontSize: 13, border: "1px solid #e2e8f0" }}
                                cursor={{ fill: "#f8fafc" }}
                            />
                            <Bar dataKey="count" name="Inquiries" radius={[6, 6, 0, 0]}>
                                {statusBarData.map((entry) => (
                                    <Cell
                                        key={entry.status}
                                        fill={STATUS_COLORS[entry.status.toLowerCase()] ?? "#94a3b8"}
                                    />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </ChartCard>

                {/* Row 4 — Response time proxy */}
                <ChartCard
                    title="Average Response Time by Status"
                    icon={Clock}
                    loading={loading}
                >
                    <p className="mb-3 text-xs text-slate-500">
                        Derived from created_at to the latest status update for each inquiry.
                        With the current schema, this is the safest available proxy for response timing.
                    </p>
                    <ResponsiveContainer width="100%" height={240}>
                        <BarChart data={responseTimeData} layout="vertical" margin={{ top: 0, right: 24, left: 0, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
                            <XAxis
                                type="number"
                                tick={{ fontSize: 11, fill: "#94a3b8" }}
                                tickFormatter={(value) => `${Math.round(value)}h`}
                                allowDecimals={false}
                            />
                            <YAxis
                                type="category"
                                dataKey="label"
                                tick={{ fontSize: 11, fill: "#475569" }}
                                width={88}
                            />
                            <Tooltip
                                contentStyle={{ borderRadius: 10, fontSize: 13, border: "1px solid #e2e8f0" }}
                                formatter={(value: number, _name, entry) => [
                                    `${formatDuration(value)} average`,
                                    `${(entry as { payload?: { count?: number } }).payload?.count || 0} inquiries`,
                                ]}
                            />
                            <Bar dataKey="hours" name="Average response time" radius={[0, 6, 6, 0]}>
                                <LabelList dataKey="formatted" position="right" fill="#475569" style={{ fontSize: 12, fontWeight: 600 }} />
                                {responseTimeData.map((entry) => (
                                    <Cell
                                        key={entry.status}
                                        fill={STATUS_COLORS[entry.status] ?? "#94a3b8"}
                                    />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </ChartCard>

            </div>
        </AdminLayout>
    );
}

// ─── shared chart card wrapper ────────────────────────────────────────────────
function ChartCard({
    title, icon: Icon, loading, children,
}: {
    title: string;
    icon: React.ElementType;
    loading: boolean;
    children: React.ReactNode;
}) {
    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
                <Icon className="w-4 h-4 text-primary" />
                <h2 className="font-display text-[15px] font-bold text-slate-900">{title}</h2>
            </div>
            {loading ? (
                <div className="flex items-center justify-center h-[260px]">
                    <div className="animate-spin rounded-full h-7 w-7 border-b-2 border-primary" />
                </div>
            ) : (
                children
            )}
        </div>
    );
}
