export interface AssignmentStatus {
  value: AssignmentStatusValue;
  label: string;
}

export interface AssignmentReminderConfig {
  expiryReminderDays: number;
}

export type AssignmentStatusValue =
  | "ACTIVE"
  | "EXPIRED"
  | "TERMINATED_EARLY"
  | "CONVERTED";
export type CompensationTypeValue =
  | "FIXED_INCREMENT"
  | "PERCENTAGE_INCREASE"
  | "ACTING_ALLOWANCE"
  | "MULTIPLE_ALLOWANCES";
export type ActingReasonValue =
  | "VACANCY"
  | "MATERNITY_LEAVE"
  | "RESTRUCTURING"
  | "TRAINING"
  | "MEDICAL_LEAVE"
  | "OTHER";

export interface CompensationAdjustmentType {
  value: CompensationTypeValue;
  label: string;
}

export interface ActingReason {
  value: ActingReasonValue;
  label: string;
}

export interface AllowanceItem {
  id: string;
  name: string;
  amount: number;
}

export interface CompensationAdjustment {
  type: CompensationTypeValue;
  fixedAmount: number | null;
  percentageIncrease: number | null;
  allowanceAmount: number | null;
  allowances: AllowanceItem[];
}

export interface ActivityLogEntry {
  id: string;
  date: string;
  action: string;
  actor: string;
  details: string | null;
}

export interface ActingAssignmentModel {
  id: string;
  employeeID: string;
  employeeName: string;
  currentPosition: string;
  actingPosition: string;
  actingDepartment: string;
  startDate: string;
  endDate: string;
  reason: ActingReasonValue;
  status: AssignmentStatusValue;
  expiryReminderDays: number;
  compensation: CompensationAdjustment;
  baseSalary: number;
  terminationDate: string | null;
  terminationReason: string | null;
  conversionDate: string | null;
  conversionNotes: string | null;
  newPermanentSalary: number | null;
  activityLog: ActivityLogEntry[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateActingAssignmentDTO {
  employeeID: string;
  employeeName: string;
  currentPosition: string;
  actingPosition: string;
  actingDepartment: string;
  startDate: string;
  endDate: string;
  reason: ActingReasonValue;
  expiryReminderDays: number;
  compensation: CompensationAdjustment;
  baseSalary: number;
}

export interface TerminateAssignmentDTO {
  terminationDate: string;
  terminationReason: string;
}

export interface ConvertAssignmentDTO {
  effectiveDate: string;
  newPermanentSalary: number;
  notes: string | null;
}

export interface ExtendAssignmentDTO {
  newEndDate: string;
  extensionReason: string;
  additionalNotes: string | null;
}

export interface UpdateAssignmentDTO {
  currentPosition: string;
  actingPosition: string;
  actingDepartment: string;
  startDate: string;
  endDate: string;
  reason: ActingReasonValue;
  baseSalary: number;
  expiryReminderDays: number;
}
