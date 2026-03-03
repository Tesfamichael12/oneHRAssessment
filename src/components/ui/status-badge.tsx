"use client";

import type { ReactNode } from "react";
import type { AssignmentStatusValue } from "@/models/acting-assignment";
import { STATUS_CONFIG } from "@/lib/constants";
import styles from "./status-badge.module.css";

interface StatusBadgeProps {
  status: AssignmentStatusValue | string;
  children?: ReactNode;
}

function isAssignmentStatusValue(
  status: string,
): status is AssignmentStatusValue {
  return status in STATUS_CONFIG;
}

export function StatusBadge({ status, children }: StatusBadgeProps): ReactNode {
  const config = isAssignmentStatusValue(status)
    ? STATUS_CONFIG[status]
    : { label: status, className: "" };

  return (
    <span className={`${styles.badge} ${config.className}`}>
      <span className={styles.dot} />
      {children ?? config.label}
    </span>
  );
}
