import React from "react";
import useTheme from "../hooks/useTheme";

interface ModalProps {
    children: React.ReactNode;
    onClose: () => void;
}

// Reusable modal overlay — clicking the backdrop closes the modal
function Modal({ children, onClose }: ModalProps) {
    const theme = useTheme();
    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(0,0,0,0.60)] backdrop-blur-sm"
            onClick={onClose}
        >
            <div
                className="w-full max-w-lg mx-4 p-6 rounded-2xl border"
                style={{
                    borderColor: theme.colors.border,
                    backgroundColor: "rgba(20,20,20,0.96)",
                    boxShadow: `0 0 60px ${theme.colors.shadow}`
                }}
                onClick={(e) => e.stopPropagation()}
            >
                {children}
            </div>
        </div>
    );
}

export default Modal;
