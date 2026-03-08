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
            <div className="bg-card rounded-xl border overflow-hidden">
                <div className="p-12 text-center text-muted-foreground">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-3" />
                    Loading...
                </div>
            </div>
        );
    }

    return (
        <div className="bg-card rounded-xl border overflow-hidden shadow-sm">
            <Table>
                <TableHeader>
                    <TableRow className="bg-muted/50 hover:bg-muted/50">
                        {columns.map((col, i) => (
                            <TableHead
                                key={i}
                                className={`font-display font-semibold text-foreground ${col.className || ""}`}
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
                                className="text-center py-12 text-muted-foreground"
                            >
                                {emptyMessage}
                            </TableCell>
                        </TableRow>
                    ) : (
                        data.map((row) => (
                            <TableRow
                                key={row.id}
                                className={onRowClick ? "cursor-pointer" : ""}
                                onClick={() => onRowClick?.(row)}
                            >
                                {columns.map((col, i) => (
                                    <TableCell key={i} className={col.className}>
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
    );
}

export default DataTable;
