import React from "react";
import UIButton from "./UIButton";
import useTheme from "../hooks/useTheme";

interface ConfirmDialogProps {
    isOpen: boolean;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    onConfirm: () => void;
    onCancel: () => void;
    isDangerous?: boolean;
}

export default function ConfirmDialog({
    isOpen,
    title,
    message,
    confirmText = "Confirm",
    cancelText = "Cancel",
    onConfirm,
    onCancel,
    isDangerous = false
}: ConfirmDialogProps): React.ReactElement | null {
    const theme = useTheme();

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(0,0,0,0.60)] backdrop-blur-sm"
            onClick={onCancel}
        >
            <div
                className="w-full max-w-md mx-4 p-6 rounded-2xl border"
                style={{
                    borderColor: theme.colors.border,
                    backgroundColor: theme.colors.surface,
                    boxShadow: theme.shadows.lg
                }}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="space-y-4">
                    {/* Title */}
                    <h2 
                        className="text-xl font-semibold leading-tight"
                        style={{ color: theme.colors.textPrimary }}
                    >
                        {title}
                    </h2>

                    {/* Message */}
                    <p 
                        className="text-sm leading-relaxed"
                        style={{ color: theme.colors.textSecondary }}
                    >
                        {message}
                    </p>

                    {/* Actions */}
                    <div className="flex gap-3 pt-2">
                        <UIButton
                            onClick={onCancel}
                            variant="secondary"
                            className="flex-1"
                        >
                            {cancelText}
                        </UIButton>
                        <UIButton
                            onClick={onConfirm}
                            variant={isDangerous ? "danger" : "primary"}
                            className="flex-1"
                        >
                            {confirmText}
                        </UIButton>
                    </div>
                </div>
            </div>
        </div>
    );
}
