import { ReactNode } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

interface Column<T> {
    header: string;
    accessor: keyof T | ((row: T) => ReactNode);
    className?: string;
}

interface DataTableProps<T> {
    columns: Column<T>[];
    data: T[];
    onRowClick?: (row: T) => void;
    emptyMessage?: string;
    loading?: boolean;
}

function DataTable<T extends { id: string }>({
    columns,
    data,
    onRowClick,
    emptyMessage = "No data found",
    loading = false,
}: DataTableProps<T>) {
    if (loading) {
        return (
            <div className="bg-white/85 rounded-2xl border border-slate-200 overflow-hidden shadow-[0_10px_24px_rgba(11,29,58,0.08)]">
                <div className="p-12 text-center text-slate-500">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-3" />
                    Loading records...
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white/90 rounded-2xl border border-slate-200 overflow-hidden shadow-[0_10px_24px_rgba(11,29,58,0.08)]">
            <div className="max-h-[72vh] overflow-auto">
                <Table>
                    <TableHeader className="sticky top-0 z-10 backdrop-blur bg-slate-50/95">
                        <TableRow className="hover:bg-transparent border-b border-slate-200">
                        {columns.map((col, i) => (
                            <TableHead
                                key={i}
                                className={`font-display font-semibold text-slate-700 uppercase tracking-[0.08em] text-[11px] ${col.className || ""}`}
                            >
                                {col.header}
                            </TableHead>
                        ))}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data.length === 0 ? (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className="text-center py-14 text-slate-500"
                                >
                                    {emptyMessage}
                                </TableCell>
                            </TableRow>
                        ) : (
                            data.map((row) => (
                                <TableRow
                                    key={row.id}
                                    className={`${onRowClick ? "cursor-pointer" : ""} border-slate-100 hover:bg-primary/5 transition-colors`}
                                    onClick={() => onRowClick?.(row)}
                                >
                                    {columns.map((col, i) => (
                                        <TableCell key={i} className={`${col.className || ""} text-slate-800`}>
                                            {typeof col.accessor === "function"
                                                ? col.accessor(row)
                                                : (row[col.accessor] as ReactNode)}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}

export default DataTable;
