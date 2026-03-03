"use client";

/**
 * Reusable FormField component for consistent input styling.
 */
import type { ReactNode, InputHTMLAttributes, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";
import styles from "./form-field.module.css";

interface BaseProps {
    label: string;
    error?: string;
    required?: boolean;
    helperText?: string;
}

interface InputProps extends BaseProps, InputHTMLAttributes<HTMLInputElement> {
    type?: "text" | "number" | "date" | "email" | "password";
}

interface SelectProps extends BaseProps, SelectHTMLAttributes<HTMLSelectElement> {
    options: { value: string; label: string }[];
}

interface TextareaProps extends BaseProps, TextareaHTMLAttributes<HTMLTextAreaElement> {}

export function InputField({ label, error, required, helperText, ...props }: InputProps): ReactNode {
    return (
        <div className={styles.container}>
            <label className={styles.label}>
                {label} {required === true && <span className={styles.required}>*</span>}
            </label>
            <input
                className={`${styles.input} ${error !== undefined && error !== "" ? styles.inputError : ""}`}
                {...props}
            />
            {error !== undefined && error !== "" ? (
                <span className={styles.errorText}>{error}</span>
            ) : helperText !== undefined && helperText !== "" ? (
                <span className={styles.helperText}>{helperText}</span>
            ) : null}
        </div>
    );
}

export function SelectField({ label, error, required, helperText, options, ...props }: SelectProps): ReactNode {
    return (
        <div className={styles.container}>
            <label className={styles.label}>
                {label} {required === true && <span className={styles.required}>*</span>}
            </label>
            <select
                className={`${styles.input} ${error !== undefined && error !== "" ? styles.inputError : ""}`}
                {...props}
            >
                <option value="">Select an option</option>
                {options.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                        {opt.label}
                    </option>
                ))}
            </select>
            {error !== undefined && error !== "" ? (
                <span className={styles.errorText}>{error}</span>
            ) : helperText !== undefined && helperText !== "" ? (
                <span className={styles.helperText}>{helperText}</span>
            ) : null}
        </div>
    );
}

export function TextareaField({ label, error, required, helperText, ...props }: TextareaProps): ReactNode {
    return (
        <div className={styles.container}>
            <label className={styles.label}>
                {label} {required === true && <span className={styles.required}>*</span>}
            </label>
            <textarea
                className={`${styles.textarea} ${error !== undefined && error !== "" ? styles.inputError : ""}`}
                rows={3}
                {...props}
            />
            {error !== undefined && error !== "" ? (
                <span className={styles.errorText}>{error}</span>
            ) : helperText !== undefined && helperText !== "" ? (
                <span className={styles.helperText}>{helperText}</span>
            ) : null}
        </div>
    );
}
