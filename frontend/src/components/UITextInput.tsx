import React from "react";
import useTheme from "../hooks/useTheme";

interface UITextInputProps
    extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    darkMode?: boolean;
}

export default function UITextInput({
    label,
    error,
    className = "",
    id,
    darkMode = false,
    ...props
}: UITextInputProps): React.ReactElement {
    const theme = useTheme();
    const uniqueId = id || `input-${Math.random()}`;

    const getInputStyle = (): React.CSSProperties => ({
        backgroundColor: theme.colors.alpha08,
        borderColor: error ? "#ef4444" : theme.colors.primary,
        color: darkMode ? "white" : "#1f2937",
    });

    const getFocusStyle = (): React.CSSProperties => ({
        outline: "none",
        borderColor: theme.colors.primary,
        boxShadow: `0 0 0 2px ${theme.colors.primary}`,
        backgroundColor: theme.colors.alpha18,
    });

    return (
        <div className="w-full">
            {label && (
                <label
                    htmlFor={uniqueId}
                    className={`block text-sm font-medium mb-1 ${darkMode ? "text-gray-300" : "text-gray-700"}`}
                >
                    {label}
                </label>
            )}

            <input
                id={uniqueId}
                className={`w-full px-4 py-2 rounded-lg border text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-0 ${error ? "border-red-500" : ""} ${className}`}
                style={getInputStyle()}
                onFocus={(e) => {
                    Object.assign((e.target as HTMLInputElement).style, getFocusStyle());
                }}
                onBlur={(e) => {
                    Object.assign((e.target as HTMLInputElement).style, getInputStyle());
                }}
                {...props}
            />

            {error && (
                <p className="text-red-500 text-xs font-medium mt-1.5 flex items-center gap-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                    </svg>
                    {error}
                </p>
            )}
        </div>
    );
}