"use client";
import { useState, useMemo, type ReactNode } from "react";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Modal } from "@/components/ui/modal";
import { InputField, SelectField } from "@/components/ui/form-field";
import {
  COMPENSATION_TYPES,
  ACTING_REASONS,
  DEFAULT_EXPIRY_REMINDER_DAYS,
  DEPARTMENTS,
  POSITIONS,
} from "@/lib/constants";
import { daysBetween, todayInputFormat } from "@/lib/dayjs-format";
import type {
  CreateActingAssignmentDTO,
  CompensationAdjustment,
  AllowanceItem,
} from "@/models/acting-assignment";
import styles from "./create-assignment-modal.module.css";

interface CreateActingAssignmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateActingAssignmentDTO) => Promise<boolean>;
}

export function CreateActingAssignmentModal({
  isOpen,
  onClose,
  onSubmit,
}: CreateActingAssignmentModalProps): ReactNode {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const [employeeName, setEmployeeName] = useState<string>("");
  const [employeeID, setEmployeeID] = useState<string>("");
  const [currentPosition, setCurrentPosition] = useState<string>("");
  const [actingPosition, setActingPosition] = useState<string>("");
  const [actingDepartment, setActingDepartment] = useState<string>("");
  const [reason, setReason] = useState<string>("");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [expiryReminderDays, setExpiryReminderDays] = useState<string>(
    DEFAULT_EXPIRY_REMINDER_DAYS.toString(),
  );
  const [baseSalary, setBaseSalary] = useState<string>("30000");

  const [adjType, setAdjType] =
    useState<CompensationAdjustment["type"]>("FIXED_INCREMENT");
  const [fixedAmount, setFixedAmount] = useState<string>("");
  const [percentage, setPercentage] = useState<string>("");
  const [allowanceAmount, setAllowanceAmount] = useState<string>("");
  const [allowances, setAllowances] = useState<AllowanceItem[]>([]);

  const previewAddition = useMemo((): number => {
    const salaryNum = parseFloat(baseSalary) || 0;
    switch (adjType) {
      case "FIXED_INCREMENT":
        return parseFloat(fixedAmount) || 0;
      case "PERCENTAGE_INCREASE":
        const p = parseFloat(percentage) || 0;
        return (salaryNum * p) / 100;
      case "ACTING_ALLOWANCE":
        return parseFloat(allowanceAmount) || 0;
      case "MULTIPLE_ALLOWANCES":
        return allowances.reduce((sum, item) => sum + (item.amount || 0), 0);
      default:
        return 0;
    }
  }, [
    adjType,
    fixedAmount,
    percentage,
    allowanceAmount,
    allowances,
    baseSalary,
  ]);

  const handleAddAllowance = (): void => {
    setAllowances([
      ...allowances,
      { id: Date.now().toString(), name: "", amount: 0 },
    ]);
  };

  const handleUpdateAllowance = (
    id: string,
    field: "name" | "amount",
    value: string | number,
  ): void => {
    setAllowances(
      allowances.map((a) => (a.id === id ? { ...a, [field]: value } : a)),
    );
  };

  const handleRemoveAllowance = (id: string): void => {
    setAllowances(allowances.filter((a) => a.id !== id));
  };

  const handleFormSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();

    if (daysBetween(startDate, endDate) < 0) {
      toast.error("Expected end date must be on or after start date.");
      return;
    }

    if (daysBetween(todayInputFormat(), startDate) > 365) {
      toast.error("Start date is too far in the future.");
      return;
    }

    const reminderDays = parseInt(expiryReminderDays, 10);
    if (Number.isNaN(reminderDays) || reminderDays < 1 || reminderDays > 60) {
      toast.error("Reminder days must be between 1 and 60.");
      return;
    }

    setIsSubmitting(true);

    const dto: CreateActingAssignmentDTO = {
      employeeID,
      employeeName,
      currentPosition,
      actingPosition,
      actingDepartment,
      startDate,
      endDate,
      reason: reason as CreateActingAssignmentDTO["reason"],
      expiryReminderDays: reminderDays,
      baseSalary: parseFloat(baseSalary),
      compensation: {
        type: adjType,
        fixedAmount:
          adjType === "FIXED_INCREMENT" ? parseFloat(fixedAmount) : null,
        percentageIncrease:
          adjType === "PERCENTAGE_INCREASE" ? parseFloat(percentage) : null,
        allowanceAmount:
          adjType === "ACTING_ALLOWANCE" ? parseFloat(allowanceAmount) : null,
        allowances: adjType === "MULTIPLE_ALLOWANCES" ? allowances : [],
      },
    };

    const success = await onSubmit(dto);
    setIsSubmitting(false);
    if (success === true) {
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create Acting Assignment"
      size="xl"
      footer={
        <>
          <button
            className={styles.secondaryButton}
            type="button"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className={styles.primaryButton}
            type="submit"
            disabled={isSubmitting}
            form="create-assignment-form"
          >
            {isSubmitting ? "Creating..." : "Create Assignment"}
          </button>
        </>
      }
    >
      <form
        id="create-assignment-form"
        className={styles.form}
        onSubmit={handleFormSubmit}
      >
        <div className={styles.grid}>
          <InputField
            label="Employee Name"
            required
            value={employeeName}
            onChange={(e) => setEmployeeName(e.target.value)}
            placeholder="Search or enter name"
          />
          <InputField
            label="Employee ID"
            required
            value={employeeID}
            onChange={(e) => setEmployeeID(e.target.value)}
            placeholder="e.g. EMP-001"
          />
          <InputField
            label="Current Position"
            value={currentPosition}
            onChange={(e) => setCurrentPosition(e.target.value)}
            placeholder="Current role"
          />
          <SelectField
            label="Acting Position"
            required
            options={POSITIONS.map((p) => ({ value: p, label: p }))}
            value={actingPosition}
            onChange={(e) => setActingPosition(e.target.value)}
          />
          <SelectField
            label="Acting Department"
            required
            options={DEPARTMENTS.map((d) => ({ value: d, label: d }))}
            value={actingDepartment}
            onChange={(e) => setActingDepartment(e.target.value)}
          />
          <SelectField
            label="Reason for Acting"
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
            label="Expected End Date"
            type="date"
            required
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
          <InputField
            label="Expiry Reminder (days before end date)"
            type="number"
            required
            value={expiryReminderDays}
            onChange={(e) => setExpiryReminderDays(e.target.value)}
            helperText="Configurable reminder window for HR notifications"
          />
          <InputField
            label="Employee Base Salary (ETB)"
            type="number"
            required
            value={baseSalary}
            onChange={(e) => setBaseSalary(e.target.value)}
          />
        </div>

        <div className={styles.compensationSection}>
          <h3 className={styles.sectionTitle}>Compensation Adjustment</h3>

          <div className={styles.typeSelector}>
            {COMPENSATION_TYPES.map((type) => (
              <button
                key={type.value}
                type="button"
                className={`${styles.typeCard} ${adjType === type.value ? styles.typeCardSelected : ""}`}
                onClick={() => setAdjType(type.value)}
                aria-pressed={adjType === type.value}
              >
                <span className={styles.typeName}>{type.label}</span>
              </button>
            ))}
          </div>

          <div className={styles.dynamicFields}>
            {adjType === "FIXED_INCREMENT" && (
              <InputField
                label="Fixed Increment Amount (ETB)"
                type="number"
                required
                value={fixedAmount}
                onChange={(e) => setFixedAmount(e.target.value)}
              />
            )}

            {adjType === "PERCENTAGE_INCREASE" && (
              <InputField
                label="Percentage Increase (%)"
                type="number"
                required
                value={percentage}
                onChange={(e) => setPercentage(e.target.value)}
              />
            )}

            {adjType === "ACTING_ALLOWANCE" && (
              <InputField
                label="Allowance Amount (ETB)"
                type="number"
                required
                value={allowanceAmount}
                onChange={(e) => setAllowanceAmount(e.target.value)}
              />
            )}

            {adjType === "MULTIPLE_ALLOWANCES" && (
              <div className={styles.multiAllowances}>
                {allowances.map((alw) => (
                  <div key={alw.id} className={styles.allowanceRow}>
                    <InputField
                      label="Allowance Name"
                      value={alw.name}
                      onChange={(e) =>
                        handleUpdateAllowance(alw.id, "name", e.target.value)
                      }
                    />
                    <InputField
                      label="Amount (ETB)"
                      type="number"
                      value={alw.amount.toString()}
                      onChange={(e) =>
                        handleUpdateAllowance(
                          alw.id,
                          "amount",
                          parseFloat(e.target.value) || 0,
                        )
                      }
                    />
                    <button
                      type="button"
                      className={styles.removeButton}
                      onClick={() => handleRemoveAllowance(alw.id)}
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  className={styles.addButton}
                  onClick={handleAddAllowance}
                >
                  <Plus size={16} /> Add Allowance
                </button>
              </div>
            )}
          </div>

          <div className={styles.preview}>
            <div className={styles.previewItem}>
              <span className={styles.previewLabel}>Monthly Addition:</span>
              <span className={styles.previewValue}>
                ETB {previewAddition.toLocaleString()}
              </span>
            </div>
            <div className={styles.previewItem}>
              <span className={styles.previewLabel}>Total Monthly:</span>
              <span className={styles.previewValue}>
                ETB{" "}
                {(parseFloat(baseSalary) + previewAddition).toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </form>
    </Modal>
  );
}
