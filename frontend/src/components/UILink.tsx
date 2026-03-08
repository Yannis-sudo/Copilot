import React from "react";
import { Link } from "react-router-dom";

interface UILinkProps {
  href: string;
  children: React.ReactNode;
  external?: boolean;
  className?: string;
  darkMode?: boolean;
  [key: string]: any;
}

export default function UILink({
  href,
  children,
  external = false,
  className = "",
  darkMode = false,
  ...props
}: UILinkProps): React.ReactElement {
  const baseStyles =
    `font-medium hover:underline transition-colors ${darkMode ? "text-primary-400" : "text-primary-600"}`;

  if (external) {
    return (
      <a href={href} className={`${baseStyles} ${className}`} {...props}>
        {children}
      </a>
    );
  }

  return (
    <Link to={href} className={`${baseStyles} ${className}`}>
      {children}
    </Link>
  );
}
