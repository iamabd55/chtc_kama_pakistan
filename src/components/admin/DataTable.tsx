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
            <div className="rounded-xl border border-white/[0.06] bg-[#1e2230] overflow-hidden">
                <div className="p-10 text-center text-sm text-white/40">
                    <div className="animate-spin rounded-full h-7 w-7 border-2 border-[#e07a2f] border-t-transparent mx-auto mb-3" />
                    Loading records...
                </div>
            </div>
        );
    }

    return (
        <div className="rounded-xl border border-white/[0.06] bg-[#1e2230] overflow-hidden">
            <div className="max-h-[55vh] md:max-h-[68vh] overflow-auto">
                <Table>
                    <TableHeader className="sticky top-0 z-10 bg-[#171b26]">
                        <TableRow className="hover:bg-transparent border-b border-white/[0.06]">
                        {columns.map((col, i) => (
                            <TableHead
                                key={i}
                                className={`h-10 sm:h-11 font-display font-semibold text-white/40 uppercase tracking-[0.08em] text-[10px] ${col.className || ""}`}
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
                                    className="text-center py-10 text-white/30"
                                >
                                    {emptyMessage}
                                </TableCell>
                            </TableRow>
                        ) : (
                            data.map((row) => (
                                <TableRow
                                    key={row.id}
                                    className={`${onRowClick ? "cursor-pointer" : ""} h-12 border-white/[0.04] hover:bg-white/[0.02] transition-colors`}
                                    onClick={() => onRowClick?.(row)}
                                >
                                    {columns.map((col, i) => (
                                        <TableCell key={i} className={`${col.className || ""} px-3 py-2 sm:px-4 sm:py-3 text-sm align-middle text-white/75`}>
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
