"use client";

/**
 * Custom hook for managing acting assignments state.
 * Handles fetching, filtering, and CRUD operations.
 */
import { useState, useEffect, useCallback, useRef } from "react";
import { toast } from "sonner";
import type {
  ActingAssignmentModel,
  CreateActingAssignmentDTO,
  TerminateAssignmentDTO,
  ConvertAssignmentDTO,
  ExtendAssignmentDTO,
  UpdateAssignmentDTO,
} from "@/models/acting-assignment";
import { actingAssignmentService } from "@/services/acting-assignment-service";
import {
  getExpiryReminderKey,
  shouldNotifyExpiry,
} from "@/lib/acting-assignment-utils";
import { daysRemaining } from "@/lib/dayjs-format";

interface UseActingAssignmentsReturn {
  assignments: ActingAssignmentModel[];
  isLoading: boolean;
  error: string | null;
  fetchAssignments: () => Promise<void>;
  createAssignment: (dto: CreateActingAssignmentDTO) => Promise<boolean>;
  terminateAssignment: (
    id: string,
    dto: TerminateAssignmentDTO,
  ) => Promise<boolean>;
  convertAssignment: (
    id: string,
    dto: ConvertAssignmentDTO,
  ) => Promise<boolean>;
  extendAssignment: (id: string, dto: ExtendAssignmentDTO) => Promise<boolean>;
  updateAssignment: (id: string, dto: UpdateAssignmentDTO) => Promise<boolean>;
}

export function useActingAssignments(): UseActingAssignmentsReturn {
  const [assignments, setAssignments] = useState<ActingAssignmentModel[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const notifiedReminderKeysRef = useRef<Set<string>>(new Set<string>());

  const notifyExpiringAssignments = useCallback(
    (items: ActingAssignmentModel[]): void => {
      items.forEach((assignment) => {
        if (shouldNotifyExpiry(assignment) === false) {
          return;
        }

        const reminderKey = getExpiryReminderKey(assignment);
        if (notifiedReminderKeysRef.current.has(reminderKey) === true) {
          return;
        }

        const daysUntilExpiry = daysRemaining(assignment.endDate);
        toast.warning(
          `${assignment.employeeName}'s acting assignment expires in ${daysUntilExpiry} day(s).`,
        );
        notifiedReminderKeysRef.current.add(reminderKey);
      });
    },
    [],
  );

  const fetchAssignments = useCallback(async (): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await actingAssignmentService.getAll();
      setAssignments(data);
      notifyExpiringAssignments(data);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to fetch assignments";
      setError(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  }, [notifyExpiringAssignments]);

  useEffect(() => {
    fetchAssignments();
  }, [fetchAssignments]);

  const createAssignment = useCallback(
    async (dto: CreateActingAssignmentDTO): Promise<boolean> => {
      try {
        await actingAssignmentService.create(dto);
        toast.success("Acting assignment created successfully");
        await fetchAssignments();
        return true;
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to create assignment";
        toast.error(message);
        return false;
      }
    },
    [fetchAssignments],
  );

  const terminateAssignment = useCallback(
    async (id: string, dto: TerminateAssignmentDTO): Promise<boolean> => {
      try {
        await actingAssignmentService.terminate(id, dto);
        toast.success("Assignment terminated successfully");
        await fetchAssignments();
        return true;
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to terminate assignment";
        toast.error(message);
        return false;
      }
    },
    [fetchAssignments],
  );

  const convertAssignment = useCallback(
    async (id: string, dto: ConvertAssignmentDTO): Promise<boolean> => {
      try {
        await actingAssignmentService.convert(id, dto);
        toast.success("Assignment converted to permanent promotion");
        await fetchAssignments();
        return true;
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to convert assignment";
        toast.error(message);
        return false;
      }
    },
    [fetchAssignments],
  );

  const extendAssignment = useCallback(
    async (id: string, dto: ExtendAssignmentDTO): Promise<boolean> => {
      try {
        await actingAssignmentService.extend(id, dto);
        toast.success("Assignment extended successfully");
        await fetchAssignments();
        return true;
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to extend assignment";
        toast.error(message);
        return false;
      }
    },
    [fetchAssignments],
  );

  const updateAssignment = useCallback(
    async (id: string, dto: UpdateAssignmentDTO): Promise<boolean> => {
      try {
        await actingAssignmentService.update(id, dto);
        toast.success("Assignment updated successfully");
        await fetchAssignments();
        return true;
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to update assignment";
        toast.error(message);
        return false;
      }
    },
    [fetchAssignments],
  );

  return {
    assignments,
    isLoading,
    error,
    fetchAssignments,
    createAssignment,
    terminateAssignment,
    convertAssignment,
    extendAssignment,
    updateAssignment,
  };
}
