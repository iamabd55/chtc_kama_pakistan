import { cn } from "@/lib/utils";

interface AvatarLabelProps {
    name: string;
    subtitle?: string | null;
    size?: "sm" | "md";
    className?: string;
}

const AvatarLabel = ({ name, subtitle, size = "md", className }: AvatarLabelProps) => {
    const initials = name
        .split(" ")
        .map((w) => w[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);

    return (
        <div className={cn("flex items-center gap-3 min-w-0", className)}>
            <div
                className={cn(
                    "shrink-0 rounded-full bg-[#e07a2f]/15 border border-[#e07a2f]/30 flex items-center justify-center text-[#e07a2f] font-semibold",
                    size === "sm" ? "h-7 w-7 text-[10px]" : "h-8 w-8 text-xs"
                )}
            >
                {initials}
            </div>
            <div className="min-w-0">
                <p className={cn("font-medium truncate text-white/85", size === "sm" ? "text-xs" : "text-sm")}>
                    {name}
                </p>
                {subtitle && (
                    <p className="text-[11px] text-white/40 truncate">{subtitle}</p>
                )}
            </div>
        </div>
    );
};

export default AvatarLabel;
