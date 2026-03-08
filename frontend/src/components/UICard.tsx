import React from "react";

interface UICardProps {
  children: React.ReactNode;
  className?: string;
  padding?: "small" | "medium" | "large";
  darkMode?: boolean;
}

export default function UICard({
  children,
  className = "",
  padding = "medium",
  darkMode = false,
}: UICardProps): React.ReactElement {
  const paddingStyles = {
    small: "p-4",
    medium: "p-8",
    large: "p-12",
  };

  return (
    <div
      className={`${
        darkMode
          ? "bg-gray-800 outline-primary-900"
          : "bg-white outline-primary-200"
      } rounded-2xl shadow-lg outline outline-2 ${paddingStyles[padding]} ${className}`}
    >
      {children}
    </div>
  );
}
