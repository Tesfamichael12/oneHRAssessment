import type {
  ActingAssignmentModel,
  CreateActingAssignmentDTO,
  TerminateAssignmentDTO,
  ConvertAssignmentDTO,
  ExtendAssignmentDTO,
  UpdateAssignmentDTO,
} from "@/models/acting-assignment";
import {
  synchronizeAssignmentLifecycle,
  validateCreateAssignmentDTO,
} from "@/lib/acting-assignment-utils";
import { isOnOrBeforeToday } from "@/lib/dayjs-format";

function generateID(): string {
  return `ACT-${Date.now()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
}

let mockAssignments: ActingAssignmentModel[] = [
  {
    id: "ACT-2026-001",
    employeeID: "EMP-2024-0156",
    employeeName: "Abebe Kebede",
    currentPosition: "Senior Financial Analyst",
    actingPosition: "Department Head",
    actingDepartment: "Finance & Accounting",
    startDate: "2026-01-15",
    endDate: "2026-04-15",
    reason: "VACANCY",
    status: "ACTIVE",
    expiryReminderDays: 7,
    compensation: {
      type: "PERCENTAGE_INCREASE",
      fixedAmount: null,
      percentageIncrease: 15,
      allowanceAmount: null,
      allowances: [],
    },
    baseSalary: 35000,
    terminationDate: null,
    terminationReason: null,
    conversionDate: null,
    conversionNotes: null,
    newPermanentSalary: null,
    activityLog: [
      {
        id: "LOG-001",
        date: "2026-01-15T09:00:00",
        action: "Assignment Created",
        actor: "HR Admin",
        details: "Acting assignment created for vacancy in Finance department",
      },
      {
        id: "LOG-002",
        date: "2026-01-15T09:00:00",
        action: "Assignment Activated",
        actor: "System",
        details: "Automatically activated on start date",
      },
    ],
    createdAt: "2026-01-14T14:30:00",
    updatedAt: "2026-01-15T09:00:00",
  },
  {
    id: "ACT-2026-002",
    employeeID: "EMP-2024-0089",
    employeeName: "Sara Tesfaye",
    currentPosition: "HR Officer",
    actingPosition: "HR Manager",
    actingDepartment: "Human Resources",
    startDate: "2026-02-01",
    endDate: "2026-03-31",
    reason: "MATERNITY_LEAVE",
    status: "ACTIVE",
    expiryReminderDays: 10,
    compensation: {
      type: "ACTING_ALLOWANCE",
      fixedAmount: null,
      percentageIncrease: null,
      allowanceAmount: 5000,
      allowances: [],
    },
    baseSalary: 28000,
    terminationDate: null,
    terminationReason: null,
    conversionDate: null,
    conversionNotes: null,
    newPermanentSalary: null,
    activityLog: [
      {
        id: "LOG-003",
        date: "2026-02-01T08:00:00",
        action: "Assignment Created",
        actor: "HR Admin",
        details: "Covering for maternity leave of HR Manager",
      },
      {
        id: "LOG-004",
        date: "2026-02-01T08:00:00",
        action: "Assignment Activated",
        actor: "System",
        details: null,
      },
    ],
    createdAt: "2026-01-30T10:00:00",
    updatedAt: "2026-02-01T08:00:00",
  },
  {
    id: "ACT-2026-003",
    employeeID: "EMP-2024-0234",
    employeeName: "Dawit Hailu",
    currentPosition: "Senior Designer",
    actingPosition: "Team Lead",
    actingDepartment: "Engineering",
    startDate: "2025-12-10",
    endDate: "2026-02-28",
    reason: "RESTRUCTURING",
    status: "EXPIRED",
    expiryReminderDays: 7,
    compensation: {
      type: "FIXED_INCREMENT",
      fixedAmount: 8000,
      percentageIncrease: null,
      allowanceAmount: null,
      allowances: [],
    },
    baseSalary: 32000,
    terminationDate: null,
    terminationReason: null,
    conversionDate: null,
    conversionNotes: null,
    newPermanentSalary: null,
    activityLog: [
      {
        id: "LOG-005",
        date: "2025-12-10T09:00:00",
        action: "Assignment Created",
        actor: "HR Admin",
        details: "Team restructuring — temporary team lead role",
      },
      {
        id: "LOG-006",
        date: "2026-02-28T23:59:59",
        action: "Assignment Expired",
        actor: "System",
        details: "Automatically expired on end date",
      },
    ],
    createdAt: "2025-12-08T11:00:00",
    updatedAt: "2026-02-28T23:59:59",
  },
  {
    id: "ACT-2026-004",
    employeeID: "EMP-2024-0312",
    employeeName: "Meron Alemu",
    currentPosition: "Marketing Specialist",
    actingPosition: "Senior Manager",
    actingDepartment: "Sales & Marketing",
    startDate: "2025-11-01",
    endDate: "2026-01-31",
    reason: "VACANCY",
    status: "CONVERTED",
    expiryReminderDays: 14,
    compensation: {
      type: "PERCENTAGE_INCREASE",
      fixedAmount: null,
      percentageIncrease: 20,
      allowanceAmount: null,
      allowances: [],
    },
    baseSalary: 30000,
    terminationDate: null,
    terminationReason: null,
    conversionDate: "2026-01-20",
    conversionNotes:
      "Excellent performance during acting period. Promoted permanently.",
    newPermanentSalary: 36000,
    activityLog: [
      {
        id: "LOG-007",
        date: "2025-11-01T09:00:00",
        action: "Assignment Created",
        actor: "HR Admin",
        details: null,
      },
      {
        id: "LOG-008",
        date: "2026-01-20T10:00:00",
        action: "Converted to Permanent",
        actor: "HR Director",
        details: "Promoted to Senior Manager permanently",
      },
    ],
    createdAt: "2025-10-29T14:00:00",
    updatedAt: "2026-01-20T10:00:00",
  },
  {
    id: "ACT-2026-005",
    employeeID: "EMP-2024-0198",
    employeeName: "Kidist Wondimu",
    currentPosition: "Legal Counsel",
    actingPosition: "Director",
    actingDepartment: "Legal",
    startDate: "2026-01-05",
    endDate: "2026-02-05",
    reason: "MEDICAL_LEAVE",
    status: "TERMINATED_EARLY",
    expiryReminderDays: 5,
    compensation: {
      type: "MULTIPLE_ALLOWANCES",
      fixedAmount: null,
      percentageIncrease: null,
      allowanceAmount: null,
      allowances: [
        { id: "ALW-001", name: "Position Allowance", amount: 6000 },
        { id: "ALW-002", name: "Transport Allowance", amount: 2000 },
      ],
    },
    baseSalary: 40000,
    terminationDate: "2026-01-25",
    terminationReason:
      "Original position holder returned earlier than expected",
    conversionDate: null,
    conversionNotes: null,
    newPermanentSalary: null,
    activityLog: [
      {
        id: "LOG-009",
        date: "2026-01-05T09:00:00",
        action: "Assignment Created",
        actor: "HR Admin",
        details: null,
      },
      {
        id: "LOG-010",
        date: "2026-01-25T15:00:00",
        action: "Terminated Early",
        actor: "HR Director",
        details: "Original position holder returned earlier than expected",
      },
    ],
    createdAt: "2026-01-03T09:00:00",
    updatedAt: "2026-01-25T15:00:00",
  },
  {
    id: "ACT-2026-006",
    employeeID: "EMP-2024-0045",
    employeeName: "Tewodros Mengistu",
    currentPosition: "IT Support Specialist",
    actingPosition: "IT Manager",
    actingDepartment: "IT",
    startDate: "2026-02-15",
    endDate: "2026-03-10",
    reason: "TRAINING",
    status: "ACTIVE",
    expiryReminderDays: 7,
    compensation: {
      type: "FIXED_INCREMENT",
      fixedAmount: 6000,
      percentageIncrease: null,
      allowanceAmount: null,
      allowances: [],
    },
    baseSalary: 25000,
    terminationDate: null,
    terminationReason: null,
    conversionDate: null,
    conversionNotes: null,
    newPermanentSalary: null,
    activityLog: [
      {
        id: "LOG-011",
        date: "2026-02-15T09:00:00",
        action: "Assignment Created",
        actor: "HR Admin",
        details: "IT Manager attending overseas training programme",
      },
    ],
    createdAt: "2026-02-13T11:00:00",
    updatedAt: "2026-02-15T09:00:00",
  },
];

async function simulateDelay(): Promise<void> {
  await new Promise<void>((resolve) => {
    setTimeout(resolve, 300);
  });
}

function synchronizeLifecycleForStore(): void {
  let hasUpdates = false;
  const synchronizedAssignments = mockAssignments.map((assignment) => {
    const syncResult = synchronizeAssignmentLifecycle(assignment);
    if (syncResult.statusChanged === true) {
      hasUpdates = true;
    }
    return syncResult.assignment;
  });

  if (hasUpdates === true) {
    mockAssignments = synchronizedAssignments;
  }
}

export const actingAssignmentService = {
  getAll: async (): Promise<ActingAssignmentModel[]> => {
    await simulateDelay();
    synchronizeLifecycleForStore();
    return [...mockAssignments];
  },

  getByID: async (id: string): Promise<ActingAssignmentModel | null> => {
    await simulateDelay();
    synchronizeLifecycleForStore();
    return mockAssignments.find((a) => a.id === id) ?? null;
  },

  create: async (
    dto: CreateActingAssignmentDTO,
  ): Promise<ActingAssignmentModel> => {
    await simulateDelay();
    const validationMessage = validateCreateAssignmentDTO(dto);
    if (validationMessage !== null) {
      throw new Error(validationMessage);
    }

    const now = new Date().toISOString();
    const shouldAutoActivate = isOnOrBeforeToday(dto.startDate);
    const newAssignment: ActingAssignmentModel = {
      id: generateID(),
      ...dto,
      status: "ACTIVE",
      terminationDate: null,
      terminationReason: null,
      conversionDate: null,
      conversionNotes: null,
      newPermanentSalary: null,
      activityLog: [
        {
          id: `LOG-${Date.now()}`,
          date: now,
          action: "Assignment Created",
          actor: "HR Admin",
          details: `Acting assignment created — ${dto.employeeName} as ${dto.actingPosition}`,
        },
        ...(shouldAutoActivate === true
          ? [
              {
                id: `LOG-${Date.now()}-AUTO-ACTIVATE`,
                date: now,
                action: "Assignment Activated",
                actor: "System",
                details: `Automatically activated on ${dto.startDate}`,
              },
            ]
          : []),
      ],
      createdAt: now,
      updatedAt: now,
    };
    mockAssignments = [newAssignment, ...mockAssignments];
    return newAssignment;
  },

  terminate: async (
    id: string,
    dto: TerminateAssignmentDTO,
  ): Promise<ActingAssignmentModel> => {
    await simulateDelay();
    synchronizeLifecycleForStore();
    const index = mockAssignments.findIndex((a) => a.id === id);
    if (index === -1) {
      throw new Error("Assignment not found");
    }
    if (mockAssignments[index].status !== "ACTIVE") {
      throw new Error("Only active assignments can be terminated.");
    }
    const now = new Date().toISOString();
    const updated: ActingAssignmentModel = {
      ...mockAssignments[index],
      status: "TERMINATED_EARLY",
      terminationDate: dto.terminationDate,
      terminationReason: dto.terminationReason,
      updatedAt: now,
      activityLog: [
        ...mockAssignments[index].activityLog,
        {
          id: `LOG-${Date.now()}`,
          date: now,
          action: "Terminated Early",
          actor: "HR Admin",
          details: dto.terminationReason,
        },
      ],
    };
    mockAssignments[index] = updated;
    return updated;
  },

  convert: async (
    id: string,
    dto: ConvertAssignmentDTO,
  ): Promise<ActingAssignmentModel> => {
    await simulateDelay();
    synchronizeLifecycleForStore();
    const index = mockAssignments.findIndex((a) => a.id === id);
    if (index === -1) {
      throw new Error("Assignment not found");
    }
    if (mockAssignments[index].status !== "ACTIVE") {
      throw new Error("Only active assignments can be converted.");
    }
    const now = new Date().toISOString();
    const updated: ActingAssignmentModel = {
      ...mockAssignments[index],
      status: "CONVERTED",
      conversionDate: dto.effectiveDate,
      conversionNotes: dto.notes,
      newPermanentSalary: dto.newPermanentSalary,
      updatedAt: now,
      activityLog: [
        ...mockAssignments[index].activityLog,
        {
          id: `LOG-${Date.now()}`,
          date: now,
          action: "Converted to Permanent",
          actor: "HR Admin",
          details: `Promoted permanently with salary ETB ${dto.newPermanentSalary.toLocaleString()}`,
        },
      ],
    };
    mockAssignments[index] = updated;
    return updated;
  },

  extend: async (
    id: string,
    dto: ExtendAssignmentDTO,
  ): Promise<ActingAssignmentModel> => {
    await simulateDelay();
    synchronizeLifecycleForStore();
    const index = mockAssignments.findIndex((a) => a.id === id);
    if (index === -1) {
      throw new Error("Assignment not found");
    }
    if (mockAssignments[index].status !== "ACTIVE") {
      throw new Error("Only active assignments can be extended.");
    }
    const now = new Date().toISOString();
    const updated: ActingAssignmentModel = {
      ...mockAssignments[index],
      endDate: dto.newEndDate,
      updatedAt: now,
      activityLog: [
        ...mockAssignments[index].activityLog,
        {
          id: `LOG-${Date.now()}`,
          date: now,
          action: "Assignment Extended",
          actor: "HR Admin",
          details:
            dto.additionalNotes ??
            `Extended to ${dto.newEndDate}. Reason: ${dto.extensionReason}`,
        },
      ],
    };
    mockAssignments[index] = updated;
    return updated;
  },

  update: async (
    id: string,
    dto: UpdateAssignmentDTO,
  ): Promise<ActingAssignmentModel> => {
    await simulateDelay();
    synchronizeLifecycleForStore();
    const index = mockAssignments.findIndex((a) => a.id === id);
    if (index === -1) {
      throw new Error("Assignment not found");
    }

    const now = new Date().toISOString();
    const updated: ActingAssignmentModel = {
      ...mockAssignments[index],
      currentPosition: dto.currentPosition,
      actingPosition: dto.actingPosition,
      actingDepartment: dto.actingDepartment,
      startDate: dto.startDate,
      endDate: dto.endDate,
      reason: dto.reason,
      baseSalary: dto.baseSalary,
      expiryReminderDays: dto.expiryReminderDays,
      updatedAt: now,
      activityLog: [
        ...mockAssignments[index].activityLog,
        {
          id: `LOG-${Date.now()}-EDIT`,
          date: now,
          action: "Assignment Updated",
          actor: "HR Admin",
          details: "Assignment details were updated.",
        },
      ],
    };

    mockAssignments[index] = synchronizeAssignmentLifecycle(updated).assignment;
    return mockAssignments[index];
  },
};
