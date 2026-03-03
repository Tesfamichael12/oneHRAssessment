"use client";

/**
 * Reusable StatCard component — displays a key metric with icon and label.
 */
import type { ReactNode } from "react";
import styles from "./stat-card.module.css";

interface StatCardProps {
    icon: ReactNode;
    label: string;
    value: string | number;
    iconColorClass: string;
    animationDelay?: string;
}

export function StatCard({ icon, label, value, iconColorClass, animationDelay }: StatCardProps): ReactNode {
    return (
        <div
            className={`${styles.card} animate-fade-in`}
            style={{ animationDelay: animationDelay ?? "0ms" }}
        >
            <div className={`${styles.iconContainer} ${iconColorClass}`}>
                {icon}
            </div>
            <div className={styles.content}>
                <span className={styles.label}>{label}</span>
                <span className={styles.value}>{value}</span>
            </div>
        </div>
    );
}
