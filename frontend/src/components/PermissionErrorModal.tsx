import React from "react";
import Modal from "./Modal";
import UIButton from "./UIButton";
import useTheme from "../hooks/useTheme";

interface PermissionErrorModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    message: string;
    suggestion?: string;
}

export default function PermissionErrorModal({
    isOpen,
    onClose,
    title,
    message,
    suggestion
}: PermissionErrorModalProps): React.ReactElement {
    const theme = useTheme();

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={title}>
            <div className="space-y-4">
                <div 
                    className="p-4 rounded-lg text-center"
                    style={{ 
                        backgroundColor: `${theme.colors.primary}10`,
                        border: `1px solid ${theme.colors.border}`
                    }}
                >
                    <div 
                        className="w-12 h-12 mx-auto mb-4 rounded-full flex items-center justify-center"
                        style={{ 
                            backgroundColor: `${theme.colors.primary}20`,
                            color: theme.colors.primary
                        }}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                        </svg>
                    </div>
                    
                    <h3 
                        className="text-lg font-semibold mb-2"
                        style={{ color: theme.colors.textPrimary }}
                    >
                        {message}
                    </h3>
                    
                    {suggestion && (
                        <p 
                            className="text-sm mb-4"
                            style={{ color: theme.colors.textSecondary }}
                        >
                            {suggestion}
                        </p>
                    )}
                </div>
                
                <div className="flex gap-3">
                    <UIButton
                        onClick={onClose}
                        variant="secondary"
                        className="flex-1"
                    >
                        Close
                    </UIButton>
                    
                    {suggestion && (
                        <UIButton
                            onClick={() => {
                                // TODO: Implement contact admin functionality
                                console.log("Contact admin for permissions");
                            }}
                            variant="primary"
                            className="flex-1"
                        >
                            Contact Admin
                        </UIButton>
                    )}
                </div>
            </div>
        </Modal>
    );
}
