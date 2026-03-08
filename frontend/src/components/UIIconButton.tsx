import React from "react";

interface UIIconButtonProps {
    onClick: () => void;
    icon: React.ReactNode;
    title: string;
    className?: string;
    variant?: "default" | "danger" | "success" | "dark";
    darkMode?: boolean;
}

export default function UIIconButton({
    onClick,
    icon,
    title,
    className = "",
    variant = "default",
    darkMode = false,
}: UIIconButtonProps): React.ReactElement {
    const variantStyles = {
        default: "text-gray-400 hover:text-[#a78bfa] hover:bg-[rgba(124,58,237,0.12)]",
        danger:  "text-gray-400 hover:text-red-400 hover:bg-[rgba(124,58,237,0.08)]",
        success: "text-gray-400 hover:text-yellow-400 hover:bg-[rgba(124,58,237,0.08)]",
        dark:    "bg-[#7c3aed] text-white hover:bg-[#6d28d9]",
    };

    return (
        <button
            type="button"
            onClick={onClick}
            title={title}
            className={`w-9 h-9 flex items-center justify-center rounded-lg transition-colors ${variantStyles[variant]} ${className}`}
        >
            {icon}
        </button>
    );
}