import React from "react";

interface UIErrorMessageProps {
  message: string;
  className?: string;
  darkMode?: boolean;
}

export default function UIErrorMessage({
  message,
  className = "",
  darkMode = false,
}: UIErrorMessageProps): React.ReactElement {
  if (!message) return <></>;

  return (
    <div
      className={`text-sm font-medium p-3 rounded-lg border ${
        darkMode
          ? "text-red-400 bg-red-950 border-red-800"
          : "text-red-600 bg-red-50 border-red-200"
      } ${className}`}
    >
      {message}
    </div>
  );
}
