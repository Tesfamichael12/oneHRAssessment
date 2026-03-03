"use client";
import { useState, type ReactNode } from "react";
import { Modal } from "@/components/ui/modal";
import {
  InputField,
  TextareaField,
  SelectField,
} from "@/components/ui/form-field";
import {
  ACTING_REASONS,
  DEPARTMENTS,
  EXTENSION_REASONS,
  POSITIONS,
} from "@/lib/constants";
import type {
  TerminateAssignmentDTO,
  ConvertAssignmentDTO,
  ExtendAssignmentDTO,
  ActingAssignmentModel,
  UpdateAssignmentDTO,
} from "@/models/acting-assignment";

interface TerminateModalProps {
  isOpen: boolean;
  onClose: () => void;
  assignment: ActingAssignmentModel;
  onConfirm: (id: string, dto: TerminateAssignmentDTO) => Promise<boolean>;
}

export function TerminateEarlyModal({
  isOpen,
  onClose,
  assignment,
  onConfirm,
}: TerminateModalProps): ReactNode {
  const [date, setDate] = useState<string>("");
  const [reason, setReason] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setIsSubmitting(true);
    const success = await onConfirm(assignment.id, {
      terminationDate: date,
      terminationReason: reason,
    });
    setIsSubmitting(false);
    if (success === true) onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Terminate Assignment Early"
      size="lg"
      footer={
        <>
          <button
            onClick={onClose}
            style={{
              padding: "8px 16px",
              border: "1px solid #E5E7EB",
              borderRadius: "8px",
              background: "white",
              cursor: "pointer",
            }}
          >
            Cancel
          </button>
          <button
            form="terminate-form"
            type="submit"
            disabled={isSubmitting}
            style={{
              padding: "8px 16px",
              background: "#DC2626",
              color: "white",
              border: "none",
              borderRadius: "8px",
              fontWeight: "600",
              cursor: "pointer",
            }}
          >
            {isSubmitting ? "Terminating..." : "Confirm Termination"}
          </button>
        </>
      }
    >
      <form
        id="terminate-form"
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: "16px" }}
      >
        <p style={{ fontSize: "14px", color: "#6B7280" }}>
          Are you sure you want to terminate{" "}
          <strong>{assignment.employeeName}</strong>&apos;s acting assignment as{" "}
          <strong>{assignment.actingPosition}</strong>? This action will
          automatically expire the compensation adjustment.
        </p>
        <InputField
          label="Termination Effective Date"
          type="date"
          required
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
        <TextareaField
          label="Reason for Early Termination"
          required
          placeholder="e.g., Original position holder returned early"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
        />
      </form>
    </Modal>
  );
}

interface ConvertModalProps {
  isOpen: boolean;
  onClose: () => void;
  assignment: ActingAssignmentModel;
  onConfirm: (id: string, dto: ConvertAssignmentDTO) => Promise<boolean>;
}

export function ConvertToPermanentModal({
  isOpen,
  onClose,
  assignment,
  onConfirm,
}: ConvertModalProps): ReactNode {
  const [date, setDate] = useState<string>("");
  const [salary, setSalary] = useState<string>(
    assignment.baseSalary.toString(),
  );
  const [notes, setNotes] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setIsSubmitting(true);
    const success = await onConfirm(assignment.id, {
      effectiveDate: date,
      newPermanentSalary: parseFloat(salary),
      notes,
    });
    setIsSubmitting(false);
    if (success === true) onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Convert to Permanent Promotion"
      size="lg"
      footer={
        <>
          <button
            onClick={onClose}
            style={{
              padding: "8px 16px",
              border: "1px solid #E5E7EB",
              borderRadius: "8px",
              background: "white",
              cursor: "pointer",
            }}
          >
            Cancel
          </button>
          <button
            form="convert-form"
            type="submit"
            disabled={isSubmitting}
            style={{
              padding: "8px 16px",
              background: "#0F766E",
              color: "white",
              border: "none",
              borderRadius: "8px",
              fontWeight: "600",
              cursor: "pointer",
            }}
          >
            {isSubmitting ? "Converting..." : "Confirm Promotion"}
          </button>
        </>
      }
    >
      <form
        id="convert-form"
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: "16px" }}
      >
        <p style={{ fontSize: "14px", color: "#6B7280" }}>
          Confirming the permanent promotion of{" "}
          <strong>{assignment.employeeName}</strong> to the position of{" "}
          <strong>{assignment.actingPosition}</strong>.
        </p>
        <InputField
          label="Promotion Effective Date"
          type="date"
          required
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
        <InputField
          label="New Permanent Salary (ETB)"
          type="number"
          required
          value={salary}
          onChange={(e) => setSalary(e.target.value)}
        />
        <TextareaField
          label="Promotion Notes"
          placeholder="Enter any additional details about the promotion"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
      </form>
    </Modal>
  );
}

interface ExtendModalProps {
  isOpen: boolean;
  onClose: () => void;
  assignment: ActingAssignmentModel;
  onConfirm: (id: string, dto: ExtendAssignmentDTO) => Promise<boolean>;
}

export function ExtendAssignmentModal({
  isOpen,
  onClose,
  assignment,
  onConfirm,
}: ExtendModalProps): ReactNode {
  const [date, setDate] = useState<string>("");
  const [reason, setReason] = useState<string>("");
  const [notes, setNotes] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setIsSubmitting(true);
    const success = await onConfirm(assignment.id, {
      newEndDate: date,
      extensionReason: reason,
      additionalNotes: notes,
    });
    setIsSubmitting(false);
    if (success === true) onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Extend Assignment"
      size="md"
      footer={
        <>
          <button
            onClick={onClose}
            style={{
              padding: "8px 16px",
              border: "1px solid #E5E7EB",
              borderRadius: "8px",
              background: "white",
              cursor: "pointer",
            }}
          >
            Cancel
          </button>
          <button
            form="extend-form"
            type="submit"
            disabled={isSubmitting}
            style={{
              padding: "8px 16px",
              background: "#F97316",
              color: "white",
              border: "none",
              borderRadius: "8px",
              fontWeight: "600",
              cursor: "pointer",
            }}
          >
            {isSubmitting ? "Extending..." : "Confirm Extension"}
          </button>
        </>
      }
    >
      <form
        id="extend-form"
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: "16px" }}
      >
        <div
          style={{
            padding: "12px",
            background: "#FEF3C7",
            border: "1px solid #F59E0B",
            borderRadius: "8px",
            fontSize: "13px",
            color: "#92400E",
          }}
        >
          Current End Date: <strong>{assignment.endDate}</strong>
        </div>
        <InputField
          label="New Expected End Date"
          type="date"
          required
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
        <SelectField
          label="Reason for Extension"
          required
          options={EXTENSION_REASONS.map((r) => ({ value: r, label: r }))}
          value={reason}
          onChange={(e) => setReason(e.target.value)}
        />
        <TextareaField
          label="Additional Notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
      </form>
    </Modal>
  );
}

interface EditModalProps {
  isOpen: boolean;
  onClose: () => void;
  assignment: ActingAssignmentModel;
  onConfirm: (id: string, dto: UpdateAssignmentDTO) => Promise<boolean>;
}

export function EditAssignmentModal({
  isOpen,
  onClose,
  assignment,
  onConfirm,
}: EditModalProps): ReactNode {
  const [currentPosition, setCurrentPosition] = useState<string>(
    assignment.currentPosition,
  );
  const [actingPosition, setActingPosition] = useState<string>(
    assignment.actingPosition,
  );
  const [actingDepartment, setActingDepartment] = useState<string>(
    assignment.actingDepartment,
  );
  const [startDate, setStartDate] = useState<string>(assignment.startDate);
  const [endDate, setEndDate] = useState<string>(assignment.endDate);
  const [reason, setReason] = useState<string>(assignment.reason);
  const [baseSalary, setBaseSalary] = useState<string>(
    assignment.baseSalary.toString(),
  );
  const [expiryReminderDays, setExpiryReminderDays] = useState<string>(
    assignment.expiryReminderDays.toString(),
  );
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setIsSubmitting(true);
    const success = await onConfirm(assignment.id, {
      currentPosition,
      actingPosition,
      actingDepartment,
      startDate,
      endDate,
      reason: reason as UpdateAssignmentDTO["reason"],
      baseSalary: parseFloat(baseSalary),
      expiryReminderDays: parseInt(expiryReminderDays, 10),
    });
    setIsSubmitting(false);
    if (success === true) {
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Edit Assignment"
      size="xl"
      footer={
        <>
          <button
            onClick={onClose}
            style={{
              padding: "8px 16px",
              border: "1px solid #E5E7EB",
              borderRadius: "8px",
              background: "white",
              cursor: "pointer",
            }}
          >
            Cancel
          </button>
          <button
            form="edit-form"
            type="submit"
            disabled={isSubmitting}
            style={{
              padding: "8px 16px",
              background: "#0F766E",
              color: "white",
              border: "none",
              borderRadius: "8px",
              fontWeight: "600",
              cursor: "pointer",
            }}
          >
            {isSubmitting ? "Saving..." : "Save Changes"}
          </button>
        </>
      }
    >
      <form
        id="edit-form"
        onSubmit={handleSubmit}
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
          gap: "16px",
        }}
      >
        <InputField
          label="Current Position"
          required
          value={currentPosition}
          onChange={(e) => setCurrentPosition(e.target.value)}
        />
        <SelectField
          label="Acting Position"
          required
          options={POSITIONS.map((positionValue) => ({
            value: positionValue,
            label: positionValue,
          }))}
          value={actingPosition}
          onChange={(e) => setActingPosition(e.target.value)}
        />
        <SelectField
          label="Acting Department"
          required
          options={DEPARTMENTS.map((departmentValue) => ({
            value: departmentValue,
            label: departmentValue,
          }))}
          value={actingDepartment}
          onChange={(e) => setActingDepartment(e.target.value)}
        />
        <SelectField
          label="Reason"
          required
          options={ACTING_REASONS}
          value={reason}
          onChange={(e) => setReason(e.target.value)}
        />
        <InputField
          label="Start Date"
          type="date"
          required
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
        <InputField
          label="End Date"
          type="date"
          required
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
        <InputField
          label="Base Salary (ETB)"
          type="number"
          required
          value={baseSalary}
          onChange={(e) => setBaseSalary(e.target.value)}
        />
        <InputField
          label="Expiry Reminder (days)"
          type="number"
          required
          value={expiryReminderDays}
          onChange={(e) => setExpiryReminderDays(e.target.value)}
        />
      </form>
    </Modal>
  );
}
