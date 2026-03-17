import { LucideIcon } from "lucide-react";

interface StatsCardProps {
    title: string;
    value: string | number;
    icon: LucideIcon;
    trend?: string;
    trendUp?: boolean;
    color?: "blue" | "gold" | "green" | "red";
}

const colorMap = {
    blue: {
        shell: "border-blue-200/50 bg-[linear-gradient(155deg,#f8fbff_0%,#eef5ff_100%)]",
        icon: "text-blue-700 bg-blue-500/10 border-blue-300/50",
        glow: "from-blue-500/20 to-blue-500/0",
    },
    gold: {
        shell: "border-amber-200/50 bg-[linear-gradient(155deg,#fffcf5_0%,#fef6e3_100%)]",
        icon: "text-amber-700 bg-amber-500/12 border-amber-300/50",
        glow: "from-amber-500/20 to-amber-500/0",
    },
    green: {
        shell: "border-emerald-200/60 bg-[linear-gradient(155deg,#f6fffb_0%,#eafaf3_100%)]",
        icon: "text-emerald-700 bg-emerald-500/12 border-emerald-300/50",
        glow: "from-emerald-500/20 to-emerald-500/0",
    },
    red: {
        shell: "border-rose-200/50 bg-[linear-gradient(155deg,#fff8f8_0%,#fff0f2_100%)]",
        icon: "text-rose-700 bg-rose-500/12 border-rose-300/50",
        glow: "from-rose-500/20 to-rose-500/0",
    },
};

const StatsCard = ({
    title,
    value,
    icon: Icon,
    trend,
    trendUp,
    color = "blue",
}: StatsCardProps) => {
    const theme = colorMap[color];

    return (
        <div className={`group relative overflow-hidden rounded-3xl border p-5 md:p-6 shadow-[0_12px_32px_rgba(13,35,67,0.08)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_40px_rgba(13,35,67,0.13)] ${theme.shell}`}>
            <div className={`pointer-events-none absolute -top-16 -right-16 h-44 w-44 rounded-full bg-gradient-to-br ${theme.glow} blur-2xl`} />
            <div className="relative flex items-start justify-between gap-4">
                <div className="min-w-0">
                    <p className="text-[12px] uppercase tracking-[0.22em] font-semibold text-slate-500/95">{title}</p>
                    <p className="mt-3 text-[2rem] md:text-[2.2rem] font-semibold leading-none text-slate-900 tabular-nums">
                        {value}
                    </p>
                    {trend && (
                        <span className={`inline-flex items-center gap-1.5 mt-4 px-2.5 py-1 rounded-full text-[11px] font-semibold border ${trendUp ? "text-emerald-800 bg-emerald-100/70 border-emerald-300/70" : "text-rose-800 bg-rose-100/70 border-rose-300/70"}`}>
                            <span className="text-[10px] leading-none">{trendUp ? "▲" : "▼"}</span>
                            {trend}
                        </span>
                    )}
                </div>
                <div className={`h-14 w-14 shrink-0 rounded-2xl border backdrop-blur-sm flex items-center justify-center shadow-[inset_0_1px_0_rgba(255,255,255,0.45)] ${theme.icon}`}>
                    <Icon className="w-6 h-6" strokeWidth={2.1} />
                </div>
            </div>
        </div>
    );
};

export default StatsCard;
