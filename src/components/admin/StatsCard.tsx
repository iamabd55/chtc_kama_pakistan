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
    blue: "bg-primary/10 text-primary",
    gold: "bg-accent/10 text-accent",
    green: "bg-emerald-500/10 text-emerald-600",
    red: "bg-destructive/10 text-destructive",
};

const StatsCard = ({
    title,
    value,
    icon: Icon,
    trend,
    trendUp,
    color = "blue",
}: StatsCardProps) => {
    return (
        <div className="bg-card rounded-xl border p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-sm font-medium text-muted-foreground">{title}</p>
                    <p className="text-3xl font-display font-bold text-foreground mt-1">
                        {value}
                    </p>
                    {trend && (
                        <p
                            className={`text-xs mt-2 font-medium ${trendUp ? "text-emerald-600" : "text-destructive"}`}
                        >
                            {trendUp ? "↑" : "↓"} {trend}
                        </p>
                    )}
                </div>
                <div className={`p-3 rounded-lg ${colorMap[color]}`}>
                    <Icon className="w-6 h-6" />
                </div>
            </div>
        </div>
    );
};

export default StatsCard;
