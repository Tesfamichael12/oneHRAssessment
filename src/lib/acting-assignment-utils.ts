import {
  daysBetween,
  daysRemaining,
  formatDate,
  isOnOrBeforeToday,
  isPast,
  isWithinDays,
} from "@/lib/dayjs-format";
import type {
  ActingAssignmentModel,
  AssignmentStatusValue,
  CompensationAdjustment,
  CreateActingAssignmentDTO,
} from "@/models/acting-assignment";

interface LifecycleSyncResult {
  assignment: ActingAssignmentModel;
  statusChanged: boolean;
}

/**
 * Calculates the total monthly compensation addition for an acting assignment.
 */
export function calculateMonthlyCompensationAddition(
  compensation: CompensationAdjustment,
  baseSalary: number,
): number {
  if (compensation.type === "FIXED_INCREMENT") {
    return compensation.fixedAmount ?? 0;
  }

  if (compensation.type === "PERCENTAGE_INCREASE") {
    const percentageValue = compensation.percentageIncrease ?? 0;
    return (baseSalary * percentageValue) / 100;
  }

  if (compensation.type === "ACTING_ALLOWANCE") {
    return compensation.allowanceAmount ?? 0;
  }

  return compensation.allowances.reduce((sum, allowance) => {
    return sum + allowance.amount;
  }, 0);
}

/**
 * Calculates total additional compensation cost over assignment duration.
 * Uses a 30-day payroll month approximation for consistency.
 */
export function calculateTotalCompensationCost(
  assignment: ActingAssignmentModel,
): number {
  const monthlyAddition = calculateMonthlyCompensationAddition(
    assignment.compensation,
    assignment.baseSalary,
  );
  const totalDays = Math.max(
    daysBetween(assignment.startDate, assignment.endDate),
    0,
  );
  const monthFactor = totalDays / 30;
  return monthlyAddition * monthFactor;
}

/**
 * Checks whether an assignment should trigger an expiry reminder notification.
 */
export function shouldNotifyExpiry(assignment: ActingAssignmentModel): boolean {
  return (
    assignment.status === "ACTIVE" &&
    isWithinDays(assignment.endDate, assignment.expiryReminderDays) &&
    daysRemaining(assignment.endDate) >= 0
  );
}

/**
 * Creates a standard reminder key to prevent duplicate notifications in-session.
 */
export function getExpiryReminderKey(
  assignment: ActingAssignmentModel,
): string {
  return `${assignment.id}-${assignment.endDate}-${assignment.expiryReminderDays}`;
}

/**
 * Synchronizes a single assignment lifecycle according to current date.
 * - Expire active assignments that have passed end date.
 * - Log activation when start date has been reached.
 */
export function synchronizeAssignmentLifecycle(
  assignment: ActingAssignmentModel,
): LifecycleSyncResult {
  const currentDateISO = new Date().toISOString();
  const updatedActivityLog = [...assignment.activityLog];
  let nextStatus: AssignmentStatusValue = assignment.status;
  let statusChanged = false;

  if (assignment.status === "ACTIVE" && isPast(assignment.endDate) === true) {
    nextStatus = "EXPIRED";
    statusChanged = true;
    updatedActivityLog.push({
      id: `LOG-${Date.now()}-${assignment.id}`,
      date: currentDateISO,
      action: "Assignment Expired",
      actor: "System",
      details: `Automatically expired on ${formatDate(assignment.endDate)}`,
    });
  }

  if (
    assignment.status === "ACTIVE" &&
    isOnOrBeforeToday(assignment.startDate) === true
  ) {
    const activationLogged = assignment.activityLog.some(
      (entry) => entry.action === "Assignment Activated",
    );
    if (activationLogged === false) {
      updatedActivityLog.push({
        id: `LOG-${Date.now()}-ACT-${assignment.id}`,
        date: currentDateISO,
        action: "Assignment Activated",
        actor: "System",
        details: `Automatically activated on ${formatDate(assignment.startDate)}`,
      });
      statusChanged = true;
    }
  }

  if (statusChanged === false) {
    return {
      assignment,
      statusChanged,
    };
  }

  return {
    assignment: {
      ...assignment,
      status: nextStatus,
      activityLog: updatedActivityLog,
      updatedAt: currentDateISO,
    },
    statusChanged,
  };
}

/**
 * Validates assignment creation payload business rules.
 */
export function validateCreateAssignmentDTO(
  dto: CreateActingAssignmentDTO,
): string | null {
  if (dto.employeeID.trim() === "" || dto.employeeName.trim() === "") {
    return "Employee name and employee ID are required.";
  }

  if (dto.currentPosition.trim() === "" || dto.actingPosition.trim() === "") {
    return "Current position and acting position are required.";
  }

  if (dto.actingDepartment.trim() === "") {
    return "Acting department is required.";
  }

  if (dto.startDate === "" || dto.endDate === "") {
    return "Start and end dates are required.";
  }

  if (daysBetween(dto.startDate, dto.endDate) < 0) {
    return "Expected end date must be on or after start date.";
  }

  if (dto.expiryReminderDays < 1 || dto.expiryReminderDays > 60) {
    return "Expiry reminder must be between 1 and 60 days.";
  }

  if (dto.baseSalary <= 0) {
    return "Base salary must be greater than zero.";
  }

  if (
    dto.compensation.type === "FIXED_INCREMENT" &&
    (dto.compensation.fixedAmount ?? 0) <= 0
  ) {
    return "Fixed increment must be greater than zero.";
  }

  if (dto.compensation.type === "PERCENTAGE_INCREASE") {
    const percentageValue = dto.compensation.percentageIncrease ?? 0;
    if (percentageValue <= 0 || percentageValue > 100) {
      return "Percentage increase must be between 0 and 100.";
    }
  }

  if (
    dto.compensation.type === "ACTING_ALLOWANCE" &&
    (dto.compensation.allowanceAmount ?? 0) <= 0
  ) {
    return "Acting allowance amount must be greater than zero.";
  }

  if (dto.compensation.type === "MULTIPLE_ALLOWANCES") {
    const hasInvalidAllowance = dto.compensation.allowances.some(
      (allowance) => {
        return allowance.name.trim() === "" || allowance.amount <= 0;
      },
    );
    if (
      dto.compensation.allowances.length === 0 ||
      hasInvalidAllowance === true
    ) {
      return "Provide at least one allowance with name and amount greater than zero.";
    }
  }

  return null;
}
