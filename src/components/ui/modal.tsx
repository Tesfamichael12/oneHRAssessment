"use client";

/**
 * Reusable Modal component with backdrop blur, sticky header, and close button.
 */
import { useEffect, useCallback, type ReactNode } from "react";
import { X } from "lucide-react";
import styles from "./modal.module.css";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    size?: "md" | "lg" | "xl" | "5xl";
    children: ReactNode;
    footer?: ReactNode;
}

export function Modal({ isOpen, onClose, title, size = "lg", children, footer }: ModalProps): ReactNode {
    const handleEscape = useCallback((e: KeyboardEvent): void => {
        if (e.key === "Escape") {
            onClose();
        }
    }, [onClose]);

    useEffect(() => {
        if (isOpen) {
            document.addEventListener("keydown", handleEscape);
            document.body.style.overflow = "hidden";
        }
        return () => {
            document.removeEventListener("keydown", handleEscape);
            document.body.style.overflow = "";
        };
    }, [isOpen, handleEscape]);

    if (!isOpen) {
        return null;
    }

    return (
        <div className={styles.overlay} onClick={onClose} role="dialog" aria-modal="true" aria-label={title}>
            <div
                className={`${styles.modal} ${styles[size]} animate-scale-in`}
                onClick={(e) => e.stopPropagation()}
            >
                <div className={styles.header}>
                    <h2 className={styles.title}>{title}</h2>
                    <button
                        className={styles.closeButton}
                        onClick={onClose}
                        aria-label="Close modal"
                        type="button"
                    >
                        <X size={20} />
                    </button>
                </div>
                <div className={styles.body}>
                    {children}
                </div>
                {footer !== undefined && footer !== null ? (
                    <div className={styles.footer}>
                        {footer}
                    </div>
                ) : null}
            </div>
        </div>
    );
}
