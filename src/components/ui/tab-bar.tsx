"use client";

/**
 * TabBar component — pill-style tab navigation with active indicator.
 */
import type { ReactNode } from "react";
import styles from "./tab-bar.module.css";

interface TabItem {
    id: string;
    label: string;
    count?: number;
}

interface TabBarProps {
    tabs: TabItem[];
    activeTab: string;
    onTabChange: (tabID: string) => void;
}

export function TabBar({ tabs, activeTab, onTabChange }: TabBarProps): ReactNode {
    return (
        <div className={styles.container}>
            {tabs.map((tab) => (
                <button
                    key={tab.id}
                    className={`${styles.tab} ${activeTab === tab.id ? styles.active : ""}`}
                    onClick={() => onTabChange(tab.id)}
                    type="button"
                    aria-selected={activeTab === tab.id}
                    role="tab"
                >
                    {tab.label}
                    {tab.count !== undefined ? (
                        <span className={styles.count}>{tab.count}</span>
                    ) : null}
                </button>
            ))}
        </div>
    );
}
