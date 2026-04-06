import React from "react";
import useTheme from "../hooks/useTheme";

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
    const theme = useTheme();
    const baseStyles =
        "px-4 py-2 rounded-lg font-semibold transition-colors text-sm flex items-center justify-center gap-2";

    const getButtonStyle = (): React.CSSProperties => {
        switch (variant) {
            case "primary":
                return {
                    backgroundColor: theme.colors.primary,
                    color: "white",
                };
            case "secondary":
                return darkMode
                    ? {
                        backgroundColor: "#374151",
                        color: "#f3f4f6",
                        border: "1px solid #4b5563",
                    }
                    : {
                        backgroundColor: "white",
                        color: "#374151",
                        border: "1px solid #d1d5db",
                    };
            case "danger":
                return {
                    backgroundColor: "#dc2626",
                    color: "white",
                };
            default:
                return {};
        }
    };

    const getHoverStyle = (): React.CSSProperties => {
        switch (variant) {
            case "primary":
                return {
                    backgroundColor: theme.colors.primaryDarker,
                };
            case "secondary":
                return darkMode
                    ? { backgroundColor: "#4b5563" }
                    : { backgroundColor: "#f9fafb" };
            case "danger":
                return {
                    backgroundColor: "#b91c1c",
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
            className={`${baseStyles} ${variant === "secondary" ? "border" : ""} ${disabled ? "opacity-50 cursor-not-allowed" : ""} ${className}`}
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
            {children}
        </button>
    );
}