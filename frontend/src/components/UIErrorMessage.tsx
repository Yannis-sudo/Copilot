import React from "react";

interface UIErrorMessageProps {
  message: string;
  className?: string;
}

export default function UIErrorMessage({
  message,
  className = "",
}: UIErrorMessageProps): React.ReactElement {
  if (!message) return <></>;

  return (
    <div
      className={`text-red-600 text-sm font-medium bg-red-50 p-3 rounded-lg border border-red-200 ${className}`}
    >
      {message}
    </div>
  );
}
