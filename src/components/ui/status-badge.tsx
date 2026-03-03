"use client";

/**
 * Reusable StatusBadge component for displaying assignment statuses.
 */
import type { ReactNode } from "react";
import { STATUS_CONFIG } from "@/lib/constants";
import styles from "./status-badge.module.css";

interface StatusBadgeProps {
    status: string;
    children?: ReactNode;
}

export function StatusBadge({ status, children }: StatusBadgeProps): ReactNode {
    const config = STATUS_CONFIG[status] ?? { label: status, className: "" };

    return (
        <span className={`${styles.badge} ${config.className}`}>
            <span className={styles.dot} />
            {children ?? config.label}
        </span>
    );
}
