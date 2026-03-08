import React from "react";

interface UITypingIndicatorProps {
  darkMode?: boolean;
}

export default function UITypingIndicator({ darkMode = false }: UITypingIndicatorProps): React.ReactElement {
  return (
    <div className={`flex items-center gap-1.5 px-4 py-3 outline outline-2 rounded-2xl rounded-bl-sm w-fit shadow-sm mb-4 ${
      darkMode
        ? "bg-gray-700 outline-gray-600"
        : "bg-gray-100 outline-gray-200"
    }`}>
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className={`w-2 h-2 rounded-full animate-bounce ${
            darkMode ? "bg-gray-400" : "bg-gray-600"
          }`}
          style={{ animationDelay: `${i * 0.15}s` }}
        />
      ))}
    </div>
  );
}
