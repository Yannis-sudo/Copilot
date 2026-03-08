import React from "react";

interface UIIconButtonProps {
  onClick: () => void;
  icon: React.ReactNode;
  title: string;
  className?: string;
  variant?: "default" | "danger" | "success" | "dark";
}

export default function UIIconButton({
  onClick,
  icon,
  title,
  className = "",
  variant = "default",
}: UIIconButtonProps): React.ReactElement {
  const variantStyles = {
    default: "text-gray-400 hover:text-gray-700 hover:bg-gray-100",
    danger: "text-gray-400 hover:text-red-500 hover:bg-gray-100",
    success: "text-gray-400 hover:text-yellow-500 hover:bg-gray-100",
    dark: "bg-gray-900 text-white hover:bg-gray-700",
  };

  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={`w-9 h-9 flex items-center justify-center rounded-lg ${variantStyles[variant]} transition-colors ${className}`}
    >
      {icon}
    </button>
  );
}
