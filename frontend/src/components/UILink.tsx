import React from "react";
import { Link } from "react-router-dom";

interface UILinkProps {
  href: string;
  children: React.ReactNode;
  external?: boolean;
  className?: string;
  [key: string]: any;
}

export default function UILink({
  href,
  children,
  external = false,
  className = "",
  ...props
}: UILinkProps): React.ReactElement {
  const baseStyles =
    "text-blue-600 font-medium hover:underline transition-colors";

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
