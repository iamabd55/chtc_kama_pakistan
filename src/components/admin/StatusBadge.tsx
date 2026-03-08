import { Badge } from "@/components/ui/badge";

const statusColors: Record<string, string> = {
    new: "bg-primary/15 text-primary border-primary/30",
    contacted: "bg-amber-500/15 text-amber-700 border-amber-500/30",
    "in-progress": "bg-blue-500/15 text-blue-700 border-blue-500/30",
    converted: "bg-emerald-500/15 text-emerald-700 border-emerald-500/30",
    closed: "bg-muted text-muted-foreground border-border",
    draft: "bg-muted text-muted-foreground border-border",
    published: "bg-emerald-500/15 text-emerald-700 border-emerald-500/30",
    received: "bg-primary/15 text-primary border-primary/30",
    reviewed: "bg-amber-500/15 text-amber-700 border-amber-500/30",
    shortlisted: "bg-blue-500/15 text-blue-700 border-blue-500/30",
    rejected: "bg-destructive/15 text-destructive border-destructive/30",
    hired: "bg-emerald-500/15 text-emerald-700 border-emerald-500/30",
    active: "bg-emerald-500/15 text-emerald-700 border-emerald-500/30",
    inactive: "bg-muted text-muted-foreground border-border",
};

const StatusBadge = ({ status }: { status: string }) => {
    const colors =
        statusColors[status] || "bg-muted text-muted-foreground border-border";
    return (
        <Badge
            variant="outline"
            className={`capitalize text-xs font-medium ${colors}`}
        >
            {status.replace("-", " ")}
        </Badge>
    );
};

export default StatusBadge;
