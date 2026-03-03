"use client";

/**
 * Reusable DataTable component for consistent listing.
 */
import type { ReactNode } from "react";
import styles from "./data-table.module.css";

interface Column<T> {
    header: string;
    accessor: keyof T | ((item: T) => ReactNode);
    className?: string;
}

interface DataTableProps<T> {
    columns: Column<T>[];
    data: T[];
    isLoading?: boolean;
    emptyMessage?: string;
}

export function DataTable<T extends { id: string }>({
    columns,
    data,
    isLoading = false,
    emptyMessage = "No records found",
}: DataTableProps<T>): ReactNode {
    return (
        <div className={styles.container}>
            <table className={styles.table}>
                <thead className={styles.thead}>
                    <tr>
                        {columns.map((col, idx) => (
                            <th key={idx} className={`${styles.th} ${col.className ?? ""}`}>
                                {col.header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className={styles.tbody}>
                    {isLoading ? (
                        <tr>
                            <td colSpan={columns.length} className={styles.loading}>
                                <div className={styles.skeleton} />
                            </td>
                        </tr>
                    ) : data.length === 0 ? (
                        <tr>
                            <td colSpan={columns.length} className={styles.empty}>
                                {emptyMessage}
                            </td>
                        </tr>
                    ) : (
                        data.map((item) => (
                            <tr key={item.id} className={styles.tr}>
                                {columns.map((col, idx) => (
                                    <td key={idx} className={`${styles.td} ${col.className ?? ""}`}>
                                        {typeof col.accessor === "function"
                                            ? col.accessor(item)
                                            : (item[col.accessor] as ReactNode)}
                                    </td>
                                ))}
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
}
