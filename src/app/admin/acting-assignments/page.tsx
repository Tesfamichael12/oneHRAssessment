"use client";
import { useState, useMemo, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import {
  Users,
  Timer,
  FileText,
  TrendingUp,
  Plus,
  Search,
  ChevronRight,
} from "lucide-react";
import { AdminLayout } from "@/components/layout/admin-layout";
import { PageHeader } from "@/components/ui/page-header";
import { StatCard } from "@/components/ui/stat-card";
import { TabBar } from "@/components/ui/tab-bar";
import { DataTable } from "@/components/ui/data-table";
import { StatusBadge } from "@/components/ui/status-badge";
import { CreateActingAssignmentModal } from "@/components/acting/create-assignment-modal";
import { useActingAssignments } from "@/hooks/use-acting-assignments";
import { formatDate, daysRemaining } from "@/lib/dayjs-format";
import {
  calculateMonthlyCompensationAddition,
  shouldNotifyExpiry,
} from "@/lib/acting-assignment-utils";
import type { ActingAssignmentModel } from "@/models/acting-assignment";
import styles from "./dashboard.module.css";

export default function ActingAssignmentDashboard(): ReactNode {
  const router = useRouter();
  const { assignments, isLoading, createAssignment } = useActingAssignments();
  const [activeTab, setActiveTab] = useState<string>("active");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");

  const stats = useMemo(() => {
    const active = assignments.filter((a) => a.status === "ACTIVE");
    const expiring = active.filter((a) => shouldNotifyExpiry(a) === true);
    const converted = assignments.filter((a) => a.status === "CONVERTED");

    return [
      {
        label: "Active Assignments",
        value: active.length,
        icon: <Users size={24} />,
        iconColorClass: "bg-primary/10 text-primary",
      },
      {
        label: "Expiring Soon",
        value: expiring.length,
        icon: <Timer size={24} />,
        iconColorClass: "bg-warning/10 text-warning",
      },
      {
        label: "Total This Year",
        value: assignments.length,
        icon: <FileText size={24} />,
        iconColorClass: "bg-info/10 text-info",
      },
      {
        label: "Converted to Perm",
        value: converted.length,
        icon: <TrendingUp size={24} />,
        iconColorClass: "bg-success/10 text-success",
      },
    ];
  }, [assignments]);

  const filteredAssignments = useMemo(() => {
    let result = assignments;

    if (activeTab === "active") {
      result = result.filter((a) => a.status === "ACTIVE");
    } else if (activeTab === "expiring") {
      result = result.filter((a) => shouldNotifyExpiry(a) === true);
    } else if (activeTab === "archive") {
      result = result.filter((a) => a.status !== "ACTIVE");
    }

    if (searchQuery !== "") {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (a) =>
          a.employeeName.toLowerCase().includes(query) ||
          a.employeeID.toLowerCase().includes(query) ||
          a.actingPosition.toLowerCase().includes(query),
      );
    }

    return result;
  }, [assignments, activeTab, searchQuery]);

  const columns = [
    {
      header: "Employee",
      accessor: (a: ActingAssignmentModel) => (
        <div className={styles.employeeCell}>
          <div className={styles.avatar}>{a.employeeName.charAt(0)}</div>
          <div>
            <span className={styles.empName}>{a.employeeName}</span>
            <span className={styles.empID}>{a.employeeID}</span>
          </div>
        </div>
      ),
    },
    {
      header: "Current / Acting Position",
      accessor: (a: ActingAssignmentModel) => (
        <div>
          <div className={styles.currentPos}>{a.currentPosition}</div>
          <div className={styles.actingPos}>{a.actingPosition}</div>
        </div>
      ),
    },
    {
      header: "Dept",
      accessor: (a: ActingAssignmentModel) => a.actingDepartment,
    },
    {
      header: "Period",
      accessor: (a: ActingAssignmentModel) => (
        <div>
          <div className={styles.dateRange}>
            {formatDate(a.startDate)} — {formatDate(a.endDate)}
          </div>
          <div className={styles.daysLeft}>
            {a.status === "ACTIVE"
              ? `${daysRemaining(a.endDate)} days left`
              : ""}
          </div>
        </div>
      ),
    },
    {
      header: "Status",
      accessor: (a: ActingAssignmentModel) => <StatusBadge status={a.status} />,
    },
    {
      header: "Comp.",
      accessor: (a: ActingAssignmentModel) => {
        const monthlyAddition = calculateMonthlyCompensationAddition(
          a.compensation,
          a.baseSalary,
        );
        return `+ETB ${monthlyAddition.toLocaleString()}`;
      },
    },
    {
      header: "",
      className: styles.actionsCell,
      accessor: (a: ActingAssignmentModel) => (
        <div className={styles.actions}>
          <button
            className={styles.viewBtn}
            aria-label="View details"
            onClick={() => router.push(`/admin/acting-assignments/${a.id}`)}
            type="button"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <AdminLayout>
      <div className={styles.page}>
        <PageHeader
          title="Acting Assignments"
          subtitle="Manage temporary role assignments and compensation adjustments"
          action={
            <button
              className={styles.headerAction}
              onClick={() => setIsCreateModalOpen(true)}
              type="button"
            >
              <Plus size={18} /> New Assignment
            </button>
          }
        />

        <div className={styles.statsGrid}>
          {stats.map((stat, idx) => (
            <StatCard
              key={stat.label}
              {...stat}
              animationDelay={`${idx * 100}ms`}
            />
          ))}
        </div>

        <div className={styles.container}>
          <div className={styles.tableHeader}>
            <TabBar
              activeTab={activeTab}
              onTabChange={setActiveTab}
              tabs={[
                {
                  id: "active",
                  label: "Active",
                  count: assignments.filter((a) => a.status === "ACTIVE")
                    .length,
                },
                {
                  id: "expiring",
                  label: "Expiring Soon",
                  count: assignments.filter(
                    (a) => shouldNotifyExpiry(a) === true,
                  ).length,
                },
                { id: "all", label: "All" },
                { id: "archive", label: "Archive" },
              ]}
            />

            <div className={styles.searchBar}>
              <Search size={18} className={styles.searchIcon} />
              <input
                type="text"
                placeholder="Search employee or role..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={styles.searchInput}
              />
            </div>
          </div>

          <DataTable
            columns={columns}
            data={filteredAssignments}
            isLoading={isLoading}
          />
        </div>

        <CreateActingAssignmentModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onSubmit={createAssignment}
        />
      </div>
    </AdminLayout>
  );
}
