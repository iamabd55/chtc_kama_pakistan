import { Badge } from "@/components/ui/badge";

const statusColors: Record<string, string> = {
    new: "bg-blue-500/15 text-blue-400 border-blue-500/20",
    contacted: "bg-amber-500/15 text-amber-400 border-amber-500/20",
    "in-progress": "bg-indigo-500/15 text-indigo-400 border-indigo-500/20",
    converted: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20",
    closed: "bg-white/10 text-white/50 border-white/10",
    draft: "bg-white/10 text-white/50 border-white/10",
    published: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20",
    received: "bg-blue-500/15 text-blue-400 border-blue-500/20",
    reviewed: "bg-amber-500/15 text-amber-400 border-amber-500/20",
    shortlisted: "bg-indigo-500/15 text-indigo-400 border-indigo-500/20",
    rejected: "bg-rose-500/15 text-rose-400 border-rose-500/20",
    hired: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20",
    active: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20",
    inactive: "bg-white/10 text-white/50 border-white/10",
    pending: "bg-amber-500/15 text-amber-400 border-amber-500/20",
    approved: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20",
};

const statusLabels: Record<string, string> = {
    new: "Received",
    contacted: "In Review",
    "in-progress": "In Review",
    converted: "Responded",
    closed: "Responded",
};

const StatusBadge = ({ status }: { status: string }) => {
    const colors =
        statusColors[status] || "bg-white/10 text-white/50 border-white/10";
    return (
        <Badge
            variant="outline"
            className={`capitalize text-[10px] font-semibold px-2 py-0.5 border whitespace-nowrap ${colors}`}
        >
            {statusLabels[status] || status.replace("-", " ")}
        </Badge>
    );
};

export default StatusBadge;
