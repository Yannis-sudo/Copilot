import React from "react";
import useTheme from "../hooks/useTheme";

interface UIIconButtonProps {
    icon: React.ReactNode;
    onClick?: () => void;
    variant?: "default" | "danger" | "success" | "dark";
    className?: string;
    darkMode?: boolean;
    disabled?: boolean;
    type?: "button" | "submit" | "reset";
}

export default function UIIconButton({
    icon,
    onClick,
    variant = "default",
    className = "",
    darkMode = false,
    disabled = false,
    type = "button",
}: UIIconButtonProps): React.ReactElement {
    const theme = useTheme();

    const getButtonStyle = (): React.CSSProperties => {
        switch (variant) {
            case "default":
                return {
                    color: "#9ca3af",
                    backgroundColor: "transparent",
                };
            case "danger":
                return {
                    color: "#9ca3af",
                    backgroundColor: "transparent",
                };
            case "success":
                return {
                    color: "#9ca3af",
                    backgroundColor: "transparent",
                };
            case "dark":
                return {
                    backgroundColor: theme.colors.primary,
                    color: "white",
                };
            default:
                return {};
        }
    };

    const getHoverStyle = (): React.CSSProperties => {
        switch (variant) {
            case "default":
                return {
                    color: theme.colors.primaryLight,
                    backgroundColor: theme.colors.alpha12,
                };
            case "danger":
                return {
                    color: "#ef4444",
                    backgroundColor: "rgba(239, 68, 68, 0.08)",
                };
            case "success":
                return {
                    color: "#eab308",
                    backgroundColor: "rgba(234, 179, 8, 0.08)",
                };
            case "dark":
                return {
                    backgroundColor: theme.colors.primaryDarker,
                };
            default:
                return {};
        }
    };

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`p-2 rounded-lg transition-all duration-200 ${darkMode ? "border border-gray-600" : ""} ${disabled ? "opacity-50 cursor-not-allowed" : ""} ${className}`}
            style={getButtonStyle()}
            onMouseEnter={(e) => {
                if (!disabled) {
                    Object.assign((e.target as HTMLButtonElement).style, getHoverStyle());
                }
            }}
            onMouseLeave={(e) => {
                if (!disabled) {
                    Object.assign((e.target as HTMLButtonElement).style, getButtonStyle());
                }
            }}
        >
            {icon}
        </button>
    );
}