import React from "react";
import { Link } from "react-router-dom";
import useTheme from "../hooks/useTheme";

interface UILinkProps {
    href?: string;
    children: React.ReactNode;
    external?: boolean;
    className?: string;
    darkMode?: boolean;
    onClick?: () => void;
    [key: string]: any;
}

export default function UILink({
    href,
    children,
    external = false,
    className = "",
    darkMode = false,
    onClick,
    ...props
}: UILinkProps): React.ReactElement {
    const theme = useTheme();
    const linkStyle = {
        color: darkMode ? theme.colors.primaryLight : theme.colors.primary,
    };

    if (external) {
        return (
            <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className={`font-medium hover:underline transition-colors ${className}`}
                style={linkStyle}
                {...props}
            >
                {children}
            </a>
        );
    }

    if (href) {
        return (
            <Link 
                to={href} 
                className={`font-medium hover:underline transition-colors ${className}`}
                style={linkStyle}
            >
                {children}
            </Link>
        );
    }

    return (
        <button
            onClick={onClick}
            className={`font-medium hover:underline transition-colors ${className}`}
            style={linkStyle}
            {...props}
        >
            {children}
        </button>
    );
}