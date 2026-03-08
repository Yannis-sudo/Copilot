import React from "react";

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
    const uniqueId = id || `checkbox-${Math.random()}`;

    return (
        <label htmlFor={uniqueId} className="flex items-center space-x-2 cursor-pointer group">
            <input
                id={uniqueId}
                type="checkbox"
                className={`
                    rounded border-[#7c3aed]
                    text-[#7c3aed]
                    accent-[#7c3aed]
                    focus:ring-[#7c3aed]
                    focus:ring-offset-0
                    cursor-pointer
                    ${className}
                `}
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