import React from "react";

interface UIHeadlineProps {
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  children: React.ReactNode;
  className?: string;
}

export default function UIHeadline({
  level = 2,
  children,
  className = "",
}: UIHeadlineProps): React.ReactElement {
  const baseStyles = "font-bold text-gray-800";

  const sizeStyles = {
    1: "text-4xl",
    2: "text-2xl",
    3: "text-xl",
    4: "text-lg",
    5: "text-base",
    6: "text-sm",
  };

  const HeadlineTag: React.ElementType = `h${level}` as React.ElementType;

  return (
    <HeadlineTag className={`${baseStyles} ${sizeStyles[level]} ${className}`}>
      {children}
    </HeadlineTag>
  );
}
