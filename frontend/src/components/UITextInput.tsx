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
        <label htmlFor={uniqueId} className={`block text-sm font-medium mb-1 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
          {label}
        </label>
      )}
      <input
        id={uniqueId}
        className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors ${
          error
            ? "border-red-500"
            : darkMode
            ? "border-gray-700 bg-gray-800 text-white"
            : "border-gray-300 bg-white text-gray-900"
        } ${className}`}
        {...props}
      />
      {error && <p className="text-red-600 text-sm font-medium mt-1">{error}</p>}
    </div>
  );
}
