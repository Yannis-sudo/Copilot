import React, { useState, useRef, useEffect } from "react";
import UIIconButton from "./UIIconButton";
import useTheme from "../hooks/useTheme";
import type { ListInfo } from "../types/api";

interface ListOptionsDropdownProps {
    list: ListInfo;
    onDelete: (listId: string, listName: string) => void;
    onDetails: (list: ListInfo) => void;
    isDisabled?: boolean;
}

export default function ListOptionsDropdown({
    list,
    onDelete,
    onDetails,
    isDisabled = false
}: ListOptionsDropdownProps): React.ReactElement {
    const theme = useTheme();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleDelete = () => {
        setIsOpen(false);
        onDelete(list.list_id, list.list_name);
    };

    const handleDetails = () => {
        setIsOpen(false);
        onDetails(list);
    };

    return (
        <div className="relative" ref={dropdownRef}>
            {/* Options Button */}
            <UIIconButton
                onClick={() => setIsOpen(!isOpen)}
                variant="default"
                disabled={isDisabled}
                icon={
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                    </svg>
                }
            />

            {/* Dropdown Menu */}
            {isOpen && (
                <div
                    className="absolute right-0 top-full mt-1 w-48 rounded-lg border shadow-lg z-50 py-1"
                    style={{
                        backgroundColor: theme.colors.surface,
                        borderColor: theme.colors.border,
                        boxShadow: theme.shadows.lg
                    }}
                >
                    {/* Delete Option */}
                    <button
                        type="button"
                        onClick={handleDelete}
                        className="w-full text-left px-3 py-2 text-sm transition-colors flex items-center gap-2"
                        style={{
                            color: "#dc2626"
                        }}
                        onMouseEnter={(e) => {
                            (e.target as HTMLButtonElement).style.backgroundColor = "rgba(220, 38, 38, 0.08)";
                        }}
                        onMouseLeave={(e) => {
                            (e.target as HTMLButtonElement).style.backgroundColor = "transparent";
                        }}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Delete
                    </button>

                    {/* Separator */}
                    <div 
                        className="my-1"
                        style={{ 
                            borderTop: `1px solid ${theme.colors.border}` 
                        }}
                    />

                    {/* Details Option */}
                    <button
                        type="button"
                        onClick={handleDetails}
                        className="w-full text-left px-3 py-2 text-sm transition-colors flex items-center gap-2"
                        style={{
                            color: theme.colors.textSecondary
                        }}
                        onMouseEnter={(e) => {
                            (e.target as HTMLButtonElement).style.backgroundColor = theme.colors.alpha08;
                        }}
                        onMouseLeave={(e) => {
                            (e.target as HTMLButtonElement).style.backgroundColor = "transparent";
                        }}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        Details
                    </button>
                </div>
            )}
        </div>
    );
}
