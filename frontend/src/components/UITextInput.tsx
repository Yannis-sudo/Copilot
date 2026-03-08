import React from "react";

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
    const uniqueId = id || `input-${Math.random()}`;

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
                className={`
                    w-full px-4 py-2 rounded-lg
                    bg-[rgba(124,58,237,0)]
                    border border-[#7c3aed]
                    text-sm
                    transition-all duration-200
                    placeholder:text-[rgba(124,58,237,0.45)]
                    focus:outline-none
                    focus:ring-2 focus:ring-[#7c3aed]
                    focus:ring-offset-0
                    focus:bg-[rgba(124,58,237,0.15)]
                    ${darkMode ? "text-white" : "text-gray-800"}
                    ${error ? "border-red-500 focus:ring-red-400 bg-[rgba(220,38,38,0.07)]" : ""}
                    ${className}
                `}
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