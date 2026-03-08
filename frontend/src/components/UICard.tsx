import React from "react";

interface UICardProps {
  children: React.ReactNode;
  className?: string;
  padding?: "small" | "medium" | "large";
}

export default function UICard({
  children,
  className = "",
  padding = "medium",
}: UICardProps): React.ReactElement {
  const paddingStyles = {
    small: "p-4",
    medium: "p-8",
    large: "p-12",
  };

  return (
    <div
      className={`bg-white rounded-2xl shadow-lg outline outline-2 outline-blue-200 ${paddingStyles[padding]} ${className}`}
    >
      {children}
    </div>
  );
}
