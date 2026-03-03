"use client";

/**
 * PageHeader component — teal hero banner with title, subtitle, optional action button,
 * and decorative orange accent blob.
 */
import type { ReactNode } from "react";
import styles from "./page-header.module.css";

interface PageHeaderProps {
    title: string;
    subtitle: string;
    action?: ReactNode;
}

export function PageHeader({ title, subtitle, action }: PageHeaderProps): ReactNode {
    return (
        <div className={styles.header}>
            {/* Decorative blob */}
            <svg
                className={styles.blob}
                viewBox="0 0 200 200"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
            >
                <path
                    fill="#F97316"
                    fillOpacity="0.6"
                    d="M44.7,-76.4C58.8,-69.2,71.8,-59.1,79.6,-45.8C87.4,-32.5,90,-16.3,88.2,-1.1C86.3,14.1,80,28.2,71.8,40.8C63.6,53.4,53.5,64.5,41,72.3C28.5,80.1,14.2,84.5,-0.9,86.1C-16.1,87.7,-32.2,86.4,-45.4,79.1C-58.6,71.9,-68.9,58.7,-76.3,44.4C-83.7,30.1,-88.2,15.1,-87.3,0.5C-86.4,-14.1,-80.1,-28.2,-72,-41.1C-63.9,-54,-54,-65.7,-41.5,-73.6C-29,-81.5,-14.5,-85.6,0.5,-86.5C15.5,-87.4,30.7,-83.5,44.7,-76.4Z"
                    transform="translate(100 100)"
                />
            </svg>
            <div className={styles.content}>
                <div>
                    <h1 className={styles.title}>{title}</h1>
                    <p className={styles.subtitle}>{subtitle}</p>
                </div>
                {action !== undefined && action !== null ? (
                    <div className={styles.action}>
                        {action}
                    </div>
                ) : null}
            </div>
        </div>
    );
}
