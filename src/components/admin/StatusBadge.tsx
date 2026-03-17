import { Badge } from "@/components/ui/badge";

const statusColors: Record<string, string> = {
    new: "bg-gradient-to-r from-blue-100 to-blue-50 text-blue-700 border-blue-200",
    contacted: "bg-gradient-to-r from-amber-100 to-amber-50 text-amber-700 border-amber-200",
    "in-progress": "bg-gradient-to-r from-indigo-100 to-indigo-50 text-indigo-700 border-indigo-200",
    converted: "bg-gradient-to-r from-emerald-100 to-emerald-50 text-emerald-700 border-emerald-200",
    closed: "bg-gradient-to-r from-slate-100 to-slate-50 text-slate-600 border-slate-200",
    draft: "bg-gradient-to-r from-slate-100 to-slate-50 text-slate-600 border-slate-200",
    published: "bg-gradient-to-r from-emerald-100 to-emerald-50 text-emerald-700 border-emerald-200",
    received: "bg-gradient-to-r from-blue-100 to-blue-50 text-blue-700 border-blue-200",
    reviewed: "bg-gradient-to-r from-amber-100 to-amber-50 text-amber-700 border-amber-200",
    shortlisted: "bg-gradient-to-r from-indigo-100 to-indigo-50 text-indigo-700 border-indigo-200",
    rejected: "bg-gradient-to-r from-rose-100 to-rose-50 text-rose-700 border-rose-200",
    hired: "bg-gradient-to-r from-emerald-100 to-emerald-50 text-emerald-700 border-emerald-200",
    active: "bg-gradient-to-r from-emerald-100 to-emerald-50 text-emerald-700 border-emerald-200",
    inactive: "bg-gradient-to-r from-slate-100 to-slate-50 text-slate-600 border-slate-200",
};

const StatusBadge = ({ status }: { status: string }) => {
    const colors =
        statusColors[status] || "bg-muted text-muted-foreground border-border";
    return (
        <Badge
            variant="outline"
            className={`capitalize text-[11px] font-semibold px-2.5 py-1 border ${colors}`}
        >
            {status.replace("-", " ")}
        </Badge>
    );
};

export default StatusBadge;
