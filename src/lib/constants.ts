import type {
  AssignmentStatus,
  AssignmentStatusValue,
  CompensationAdjustmentType,
  CompensationTypeValue,
  ActingReason,
  ActingReasonValue,
} from "@/models/acting-assignment";

export const ASSIGNMENT_STATUSES: AssignmentStatus[] = [
  { value: "ACTIVE", label: "Active" },
  { value: "EXPIRED", label: "Expired" },
  { value: "TERMINATED_EARLY", label: "Terminated Early" },
  { value: "CONVERTED", label: "Converted to Permanent" },
];

export const COMPENSATION_TYPES: CompensationAdjustmentType[] = [
  { value: "FIXED_INCREMENT", label: "Fixed Salary Increment" },
  { value: "PERCENTAGE_INCREASE", label: "Percentage Increase" },
  { value: "ACTING_ALLOWANCE", label: "Acting Allowance" },
  { value: "MULTIPLE_ALLOWANCES", label: "Multiple Allowances" },
];

export const ACTING_REASONS: ActingReason[] = [
  { value: "VACANCY", label: "Vacancy" },
  { value: "MATERNITY_LEAVE", label: "Maternity Leave" },
  { value: "RESTRUCTURING", label: "Restructuring" },
  { value: "TRAINING", label: "Training / Development" },
  { value: "MEDICAL_LEAVE", label: "Medical Leave" },
  { value: "OTHER", label: "Other" },
];

export const EXTENSION_REASONS: string[] = [
  "Ongoing vacancy",
  "Performance review pending",
  "Replacement not found",
  "Extended project requirements",
  "Other",
];

export const EXPIRY_WARNING_DAYS = 7;
export const DEFAULT_EXPIRY_REMINDER_DAYS = 14;

export const ITEMS_PER_PAGE = 10;

export const STATUS_CONFIG: Record<
  AssignmentStatusValue,
  { label: string; className: string }
> = {
  ACTIVE: { label: "Active", className: "badge-active" },
  EXPIRED: { label: "Expired", className: "badge-expired" },
  TERMINATED_EARLY: {
    label: "Terminated Early",
    className: "badge-terminated",
  },
  CONVERTED: { label: "Converted", className: "badge-converted" },
};

export const REASON_LABELS: Record<ActingReasonValue, string> = {
  VACANCY: "Vacancy",
  MATERNITY_LEAVE: "Maternity Leave",
  RESTRUCTURING: "Restructuring",
  TRAINING: "Training / Development",
  MEDICAL_LEAVE: "Medical Leave",
  OTHER: "Other",
};

export const COMPENSATION_TYPE_LABELS: Record<CompensationTypeValue, string> = {
  FIXED_INCREMENT: "Fixed Salary Increment",
  PERCENTAGE_INCREASE: "Percentage Increase",
  ACTING_ALLOWANCE: "Acting Allowance",
  MULTIPLE_ALLOWANCES: "Multiple Allowances",
};

export const DEPARTMENTS: string[] = [
  "Finance & Accounting",
  "Human Resources",
  "Engineering",
  "Sales & Marketing",
  "Operations",
  "Legal",
  "IT",
  "Executive",
];

export const POSITIONS: string[] = [
  "Department Head",
  "Team Lead",
  "Senior Manager",
  "Manager",
  "Senior Analyst",
  "Analyst",
  "Officer",
  "Coordinator",
  "Specialist",
  "Director",
  "VP",
  "CFO",
  "CTO",
  "COO",
];
