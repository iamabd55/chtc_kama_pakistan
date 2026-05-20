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
        border: "border-l-blue-500",
        icon: "text-blue-400 bg-blue-500/15",
    },
    gold: {
        border: "border-l-amber-500",
        icon: "text-amber-400 bg-amber-500/15",
    },
    green: {
        border: "border-l-emerald-500",
        icon: "text-emerald-400 bg-emerald-500/15",
    },
    red: {
        border: "border-l-rose-500",
        icon: "text-rose-400 bg-rose-500/15",
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
        <div className={`group relative overflow-hidden rounded-xl border border-white/[0.06] border-l-[3px] ${theme.border} bg-[#1e2230] p-3 md:p-5 transition-all duration-200 hover:bg-[#242838]`}>
            <div className="relative flex items-start justify-between gap-2">
                <div className="min-w-0">
                    <p className="text-[9px] sm:text-[11px] uppercase tracking-[0.15em] sm:tracking-[0.18em] font-semibold text-white/35 leading-tight">{title}</p>
                    <p className="mt-1.5 md:mt-2 text-[1.5rem] md:text-[2rem] font-bold leading-none text-white tabular-nums">
                        {value}
                    </p>
                    {trend && (
                        <span className={`inline-flex items-center gap-1 mt-1.5 md:mt-2 text-[10px] md:text-[11px] font-medium ${trendUp ? "text-emerald-400" : "text-rose-400"}`}>
                            <span className="text-[9px]">{trendUp ? "▲" : "▼"}</span>
                            {trend}
                        </span>
                    )}
                </div>
                <div className={`h-9 w-9 md:h-11 md:w-11 shrink-0 rounded-xl flex items-center justify-center ${theme.icon}`}>
                    <Icon className="w-4 h-4 md:w-5 md:h-5" strokeWidth={1.8} />
                </div>
            </div>
        </div>
    );
};

export default StatsCard;
