import React from "react";

interface UICheckboxProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export default function UICheckbox({
  label,
  id,
  className = "",
  ...props
}: UICheckboxProps): React.ReactElement {
  const uniqueId = id || `checkbox-${Math.random()}`;

  return (
    <label htmlFor={uniqueId} className="flex items-center space-x-2 cursor-pointer">
      <input
        id={uniqueId}
        type="checkbox"
        className={`rounded border-gray-300 text-blue-600 focus:ring-blue-500 accent-blue-600 ${className}`}
        {...props}
      />
      {label && <span className="text-gray-600 text-sm">{label}</span>}
    </label>
  );
}
