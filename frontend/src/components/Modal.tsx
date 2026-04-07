import React from "react";
import useTheme from "../hooks/useTheme";

interface ModalProps {
    children: React.ReactNode;
    onClose: () => void;
    isOpen: boolean;
    title?: string;
}

// Reusable modal overlay — clicking backdrop closes modal
function Modal({ children, onClose, isOpen, title }: ModalProps) {
    const theme = useTheme();
    
    if (!isOpen) {
        return null;
    }
    
    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(0,0,0,0.60)] backdrop-blur-sm p-4"
            onClick={onClose}
        >
            <div
                className="w-full max-h-[80vh] max-w-[80vw] p-6 rounded-2xl border overflow-y-auto"
                style={{
                    borderColor: theme.colors.border,
                    backgroundColor: theme.colors.surface,
                    boxShadow: `0 0 60px ${theme.colors.shadow}`,
                    minHeight: '300px'
                }}
                onClick={(e) => e.stopPropagation()}
            >
                {title && (
                    <h2 
                        className="text-xl font-semibold mb-4"
                        style={{ color: theme.colors.textPrimary }}
                    >
                        {title}
                    </h2>
                )}
                <div className="w-full">
                    {children}
                </div>
            </div>
        </div>
    );
}

export default Modal;
