import React from "react";
import useTheme from "../hooks/useTheme";

interface UICheckboxProps
    extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    darkMode?: boolean;
}

export default function UICheckbox({
    label,
    id,
    className = "",
    darkMode = false,
    ...props
}: UICheckboxProps): React.ReactElement {
    const theme = useTheme();
    const uniqueId = id || `checkbox-${Math.random()}`;

    return (
        <label htmlFor={uniqueId} className="flex items-center space-x-2 cursor-pointer group">
            <input
                id={uniqueId}
                type="checkbox"
                className={`rounded cursor-pointer focus:ring-2 focus:ring-offset-0 ${className}`}
                style={{
                    borderColor: theme.colors.primary,
                    color: theme.colors.primary,
                    accentColor: theme.colors.primary,
                    outlineColor: theme.colors.primary,
                }}
                {...props}
            />
            {label && (
                <span className={`text-sm transition-colors ${darkMode ? "text-gray-300 group-hover:text-white" : "text-gray-600 group-hover:text-gray-800"}`}>
                    {label}
                </span>
            )}
        </label>
    );
}