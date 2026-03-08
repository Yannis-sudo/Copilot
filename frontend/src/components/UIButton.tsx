import React from "react";

interface UIButtonProps {
    children: React.ReactNode;
    onClick?: () => void;
    type?: "button" | "submit" | "reset";
    disabled?: boolean;
    variant?: "primary" | "secondary" | "danger";
    className?: string;
    darkMode?: boolean;
}

export default function UIButton({
    children,
    onClick,
    type = "button",
    disabled = false,
    variant = "primary",
    className = "",
    darkMode = false,
}: UIButtonProps): React.ReactElement {
    const baseStyles =
        "px-4 py-2 rounded-lg font-semibold transition-colors text-sm flex items-center justify-center gap-2";

    const variantStyles = {
        // Use arbitrary value syntax for the custom purple brand color
        primary: "bg-[#7c3aed] text-white hover:bg-[#6d28d9] disabled:opacity-50 text-center",
        secondary: darkMode
            ? "bg-gray-700 text-gray-100 border border-gray-600 hover:bg-gray-600 disabled:opacity-50 text-center"
            : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 disabled:opacity-50 text-center",
        danger: "bg-red-600 text-white hover:bg-red-700 disabled:opacity-50 text-center",
    };

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`${baseStyles} ${variantStyles[variant]} ${className}`}
        >
            {children}
        </button>
    );
}