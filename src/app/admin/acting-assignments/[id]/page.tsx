"use client";
import { useState, useMemo, type ReactNode } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Briefcase,
  Clock,
  ChevronRight,
  TrendingUp,
  CalendarDays,
  Edit,
} from "lucide-react";
import { AdminLayout } from "@/components/layout/admin-layout";
import { StatusBadge } from "@/components/ui/status-badge";
import { TabBar } from "@/components/ui/tab-bar";
import {
  EditAssignmentModal,
  TerminateEarlyModal,
  ConvertToPermanentModal,
  ExtendAssignmentModal,
} from "@/components/acting/action-modals";
import { useActingAssignments } from "@/hooks/use-acting-assignments";
import {
  formatDate,
  formatTimestamp,
  daysBetween,
  daysRemaining,
} from "@/lib/dayjs-format";
import { REASON_LABELS, COMPENSATION_TYPE_LABELS } from "@/lib/constants";
import {
  calculateMonthlyCompensationAddition,
  calculateTotalCompensationCost,
} from "@/lib/acting-assignment-utils";
import styles from "./assignment-detail.module.css";

export default function AssignmentDetailPage(): ReactNode {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const {
    assignments,
    isLoading,
    updateAssignment,
    terminateAssignment,
    convertAssignment,
    extendAssignment,
  } = useActingAssignments();

  const [activeTab, setActiveTab] = useState<string>("compensation");

  const [isTerminateOpen, setIsTerminateOpen] = useState<boolean>(false);
  const [isConvertOpen, setIsConvertOpen] = useState<boolean>(false);
  const [isExtendOpen, setIsExtendOpen] = useState<boolean>(false);
  const [isEditOpen, setIsEditOpen] = useState<boolean>(false);

  const assignment = useMemo(
    () => assignments.find((a) => a.id === id),
    [assignments, id],
  );

  if (isLoading) {
    return (
      <AdminLayout>
        <div className={styles.loading}>Loading assignment details...</div>
      </AdminLayout>
    );
  }

  if (assignment === undefined || assignment === null) {
    return (
      <AdminLayout>
        <div className={styles.error}>Assignment not found</div>
      </AdminLayout>
    );
  }

  const totalDays = Math.max(
    daysBetween(assignment.startDate, assignment.endDate),
    1,
  );
  const elapsedDays = daysBetween(assignment.startDate, new Date());
  const progressPercent = Math.min(
    100,
    Math.max(0, (elapsedDays / totalDays) * 100),
  );
  const monthlyAddition = calculateMonthlyCompensationAddition(
    assignment.compensation,
    assignment.baseSalary,
  );
  const totalDurationCost = calculateTotalCompensationCost(assignment);
  const updatedMonthlySalary = assignment.baseSalary + monthlyAddition;
  const percentageDelta =
    assignment.baseSalary > 0
      ? (monthlyAddition / assignment.baseSalary) * 100
      : 0;

  return (
    <AdminLayout>
      <div className={styles.page}>
        <button
          className={styles.backButton}
          onClick={() => router.back()}
          type="button"
        >
          <ArrowLeft size={18} /> Back to Acting Assignments
        </button>

        <div className={styles.headerCard}>
          <div className={styles.headerLeft}>
            <div className={styles.avatarLarge}>
              {assignment.employeeName.charAt(0)}
            </div>
            <div className={styles.empInfo}>
              <h2 className={styles.empName}>{assignment.employeeName}</h2>
              <span className={styles.empID}>
                Employee ID: {assignment.employeeID}
              </span>

              <div className={styles.positionsRow}>
                <div className={styles.posItem}>
                  <span className={styles.posLabel}>Current</span>
                  <span className={styles.posValue}>
                    {assignment.currentPosition}
                  </span>
                </div>
                <div className={styles.posArrow}>
                  <ChevronRight size={16} />
                </div>
                <div className={styles.posItem}>
                  <span className={styles.posLabel}>Acting</span>
                  <span className={styles.posValueActing}>
                    {assignment.actingPosition}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.headerRight}>
            <div className={styles.statusRow}>
              <StatusBadge status={assignment.status} />
              <span className={styles.reasonBadge}>
                {REASON_LABELS[assignment.reason]}
              </span>
            </div>
            <div className={styles.durationInfo}>
              <div className={styles.dateLabel}>
                {formatDate(assignment.startDate)} —{" "}
                {formatDate(assignment.endDate)}
              </div>
              <div className={styles.progressContainer}>
                <div className={styles.progressHeader}>
                  <span>
                    Days Remaining: {daysRemaining(assignment.endDate)}
                  </span>
                  <span>{Math.round(progressPercent)}%</span>
                </div>
                <div className={styles.progressBar}>
                  <div
                    className={styles.progressFill}
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.actionsRow}>
          <button
            className={styles.secondaryAction}
            onClick={() => setIsEditOpen(true)}
            disabled={assignment.status !== "ACTIVE"}
            type="button"
          >
            <Edit size={16} /> Edit Assignment
          </button>
          <button
            className={styles.secondaryAction}
            onClick={() => setIsExtendOpen(true)}
            disabled={assignment.status !== "ACTIVE"}
          >
            Extend
          </button>
          <button
            className={styles.dangerAction}
            onClick={() => setIsTerminateOpen(true)}
            disabled={assignment.status !== "ACTIVE"}
          >
            Terminate Early
          </button>
          <button
            className={styles.primaryAction}
            onClick={() => setIsConvertOpen(true)}
            disabled={assignment.status !== "ACTIVE"}
          >
            Convert to Permanent
          </button>
        </div>

        <div className={styles.contentContainer}>
          <TabBar
            activeTab={activeTab}
            onTabChange={setActiveTab}
            tabs={[
              { id: "compensation", label: "Compensation" },
              { id: "timeline", label: "Timeline" },
              { id: "activity", label: "Activity Log" },
            ]}
          />

          <div className={styles.tabContent}>
            {activeTab === "compensation" && (
              <div className={styles.compensationGrid}>
                <div className={styles.compCard}>
                  <h3 className={styles.cardTitle}>Compensation Summary</h3>
                  <div className={styles.compRow}>
                    <span>Adjustment Type</span>
                    <span className={styles.compValue}>
                      {COMPENSATION_TYPE_LABELS[assignment.compensation.type]}
                    </span>
                  </div>
                  <div className={styles.compRow}>
                    <span>Monthly Addition</span>
                    <span className={styles.compSum}>
                      ETB {monthlyAddition.toLocaleString()}
                    </span>
                  </div>
                  <div className={styles.compRow}>
                    <span>Total Duration Cost</span>
                    <span className={styles.compSum}>
                      ETB{" "}
                      {totalDurationCost.toLocaleString(undefined, {
                        maximumFractionDigits: 0,
                      })}
                    </span>
                  </div>
                </div>

                <div className={styles.compCard}>
                  <h3 className={styles.cardTitle}>
                    Before & After Comparison
                  </h3>
                  <div className={styles.compareRow}>
                    <div className={styles.compareItem}>
                      <span className={styles.compareLabel}>Base Salary</span>
                      <div className={styles.compareValues}>
                        <span className={styles.oldVal}>
                          ETB {assignment.baseSalary.toLocaleString()}
                        </span>
                        <span className={styles.newVal}>
                          ETB {updatedMonthlySalary.toLocaleString()}{" "}
                          <TrendingUp size={14} /> (+
                          {percentageDelta.toFixed(1)}%)
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className={styles.totalRow}>
                    <span>Total Monthly</span>
                    <div className={styles.totalValues}>
                      <span className={styles.oldTotal}>
                        ETB {assignment.baseSalary.toLocaleString()}
                      </span>
                      <span className={styles.newTotal}>
                        ETB {updatedMonthlySalary.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "timeline" && (
              <div className={styles.timelineTab}>
                <div className={styles.timelineBarContainer}>
                  <div className={styles.timelineBar}>
                    <div
                      className={`${styles.marker} ${styles.markerStart}`}
                      title="Start Date"
                    >
                      <div className={styles.markerDot} />
                      <span className={styles.markerLabel}>
                        {formatDate(assignment.startDate)}
                      </span>
                    </div>
                    <div
                      className={`${styles.marker} ${styles.markerToday}`}
                      title="Today"
                      style={{ left: `${progressPercent}%` }}
                    >
                      <div
                        className={`${styles.markerDot} ${styles.markerDotToday}`}
                      />
                      <span className={styles.markerLabel}>Today</span>
                    </div>
                    <div
                      className={`${styles.marker} ${styles.markerEnd}`}
                      title="End Date"
                    >
                      <div className={styles.markerDot} />
                      <span className={styles.markerLabel}>
                        {formatDate(assignment.endDate)}
                      </span>
                    </div>
                  </div>
                </div>
                <div className={styles.timelineStats}>
                  <div className={styles.timelineStatItem}>
                    <CalendarDays size={20} />
                    <span>
                      Days Elapsed: <strong>{elapsedDays}</strong>
                    </span>
                  </div>
                  <div className={styles.timelineStatItem}>
                    <Clock size={20} />
                    <span>
                      Days Remaining:{" "}
                      <strong>{daysRemaining(assignment.endDate)}</strong>
                    </span>
                  </div>
                  <div className={styles.timelineStatItem}>
                    <Briefcase size={20} />
                    <span>
                      Total Duration: <strong>{totalDays} days</strong>
                    </span>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "activity" && (
              <div className={styles.activityLog}>
                {assignment.activityLog.map((log) => (
                  <div key={log.id} className={styles.logItem}>
                    <div className={styles.logDot} />
                    <div className={styles.logContent}>
                      <div className={styles.logHeader}>
                        <span className={styles.logAction}>{log.action}</span>
                        <span className={styles.logTime}>
                          {formatTimestamp(log.date)}
                        </span>
                      </div>
                      <div className={styles.logActor}>by {log.actor}</div>
                      {log.details !== null && (
                        <div className={styles.logDetails}>{log.details}</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Lifecycle Modals */}
        <EditAssignmentModal
          isOpen={isEditOpen}
          onClose={() => setIsEditOpen(false)}
          assignment={assignment}
          onConfirm={updateAssignment}
        />

        <TerminateEarlyModal
          isOpen={isTerminateOpen}
          onClose={() => setIsTerminateOpen(false)}
          assignment={assignment}
          onConfirm={terminateAssignment}
        />

        <ConvertToPermanentModal
          isOpen={isConvertOpen}
          onClose={() => setIsConvertOpen(false)}
          assignment={assignment}
          onConfirm={convertAssignment}
        />

        <ExtendAssignmentModal
          isOpen={isExtendOpen}
          onClose={() => setIsExtendOpen(false)}
          assignment={assignment}
          onConfirm={extendAssignment}
        />
      </div>
    </AdminLayout>
  );
}
