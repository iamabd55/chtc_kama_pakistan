interface AvatarLabelProps {
    name: string;
    subtitle?: string | null;
    size?: "sm" | "md";
    className?: string;
}

const getInitials = (name: string) =>
    name
        .split(" ")
        .map((part) => part.trim())
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase() || "")
        .join("") || "U";

export default function AvatarLabel({
    name,
    subtitle,
    size = "md",
    className = "",
}: AvatarLabelProps) {
    const avatarSize = size === "sm" ? "h-7 w-7 text-[10px]" : "h-8 w-8 text-xs";

    return (
        <div className={`flex items-center gap-2.5 ${className}`}>
            <div className={`${avatarSize} rounded-full border border-slate-200 bg-slate-100 text-slate-600 flex items-center justify-center font-semibold`}>
                {getInitials(name)}
            </div>
            <div>
                <p className="font-medium">{name}</p>
                {subtitle !== undefined && (
                    <p className="text-xs text-muted-foreground">{subtitle || "—"}</p>
                )}
            </div>
        </div>
    );
}
