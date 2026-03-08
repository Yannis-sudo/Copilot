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
    <label htmlFor={uniqueId} className="flex items-center space-x-2 cursor-pointer">
      <input
        id={uniqueId}
        type="checkbox"
        className={`rounded border-gray-300 text-primary-600 focus:ring-primary-500 accent-primary-600 ${className}`}
        {...props}
      />
      {label && <span className={`text-sm ${darkMode ? "text-gray-300" : "text-gray-600"}`}>{label}</span>}
    </label>
  );
}
