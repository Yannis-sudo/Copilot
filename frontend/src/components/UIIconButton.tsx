import React from "react";

interface UIIconButtonProps {
  onClick: () => void;
  icon: React.ReactNode;
  title: string;
  className?: string;
  variant?: "default" | "danger" | "success" | "dark";
  darkMode?: boolean;
}

export default function UIIconButton({
  onClick,
  icon,
  title,
  className = "",
  variant = "default",
  darkMode = false,
}: UIIconButtonProps): React.ReactElement {
  const variantStyles = {
    default: darkMode
      ? "text-gray-400 hover:text-primary-400 hover:bg-gray-800"
      : "text-gray-400 hover:text-gray-700 hover:bg-gray-100",
    danger: darkMode
      ? "text-gray-400 hover:text-red-400 hover:bg-gray-800"
      : "text-gray-400 hover:text-red-500 hover:bg-gray-100",
    success: darkMode
      ? "text-gray-400 hover:text-yellow-400 hover:bg-gray-800"
      : "text-gray-400 hover:text-yellow-500 hover:bg-gray-100",
    dark: "bg-primary-600 text-white hover:bg-primary-700",
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
