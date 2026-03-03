"use client";
import type { ReactNode } from "react";
import { useState } from "react";
import {
  PanelLeft,
  X,
  ArrowLeftRight,
  LayoutDashboard,
  Bell,
  Search,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import styles from "./admin-layout.module.css";

interface AdminLayoutProps {
  children: ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps): ReactNode {
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);

  return (
    <div className={styles.layout}>
      <aside
        className={`${styles.sidebar} ${isSidebarOpen ? styles.open : styles.collapsed}`}
      >
        <div className={styles.logoArea}>
          {isSidebarOpen ? (
            <span className={styles.logoText}>oneHR</span>
          ) : (
            <span className={styles.logoIcon}>1H</span>
          )}
          <button
            className={styles.collapseButton}
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            type="button"
            aria-label={isSidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
          >
            {isSidebarOpen ? (
              <ChevronLeft size={18} />
            ) : (
              <ChevronRight size={18} />
            )}
          </button>
        </div>

        <nav className={styles.nav}>
          <div className={styles.navSection}>
            {isSidebarOpen ? (
              <span className={styles.navSectionLabel}>Main</span>
            ) : null}
            <a href="#" className={styles.navItem}>
              <LayoutDashboard size={20} />
              {isSidebarOpen ? <span>Dashboard</span> : null}
            </a>
          </div>

          <div className={styles.navSection}>
            {isSidebarOpen ? (
              <span className={styles.navSectionLabel}>HR Management</span>
            ) : null}
            <a href="#" className={`${styles.navItem} ${styles.active}`}>
              <ArrowLeftRight size={20} />
              {isSidebarOpen ? <span>Acting Assignments</span> : null}
            </a>
          </div>
        </nav>
      </aside>

      <div className={styles.mainWrapper}>
        <header className={styles.header}>
          <button
            className={styles.mobileMenuButton}
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            type="button"
            aria-label="Toggle sidebar"
          >
            {isSidebarOpen ? <X size={20} /> : <PanelLeft size={20} />}
          </button>

          <div className={styles.searchContainer}>
            <Search size={18} className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Search..."
              className={styles.searchInput}
              aria-label="Search"
            />
          </div>

          <div className={styles.headerRight}>
            <button
              className={styles.notificationButton}
              type="button"
              aria-label="Notifications"
            >
              <Bell size={20} />
              <span className={styles.notificationDot} />
            </button>
            <div className={styles.avatar} aria-label="User menu">
              <span>HR</span>
            </div>
          </div>
        </header>

        <main className={styles.content}>{children}</main>
      </div>
    </div>
  );
}
