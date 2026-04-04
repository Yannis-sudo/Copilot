import React from "react";

interface ModalProps {
    children: React.ReactNode;
    onClose: () => void;
}

// Reusable modal overlay — clicking the backdrop closes the modal
function Modal({ children, onClose }: ModalProps) {
    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(0,0,0,0.60)] backdrop-blur-sm"
            onClick={onClose}
        >
            <div
                className="w-full max-w-lg mx-4 p-6 rounded-2xl border border-[rgba(124,58,237,0.25)] bg-[rgba(20,20,20,0.96)] shadow-[0_0_60px_rgba(124,58,237,0.20)]"
                onClick={(e) => e.stopPropagation()}
            >
                {children}
            </div>
        </div>
    );
}

export default Modal;
