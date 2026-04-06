import React from "react";
import { Link } from "react-router-dom";
import useTheme from "../hooks/useTheme";

interface NavLink {
    label: string;
    href: string;
    active: boolean;
    available: boolean;
    shown: boolean;
}

interface UINavbarProps {
    links: NavLink[];
    title?: string;
    darkMode?: boolean;
    onToggleDarkMode?: () => void;
}

export default function UINavbar({
    links,
    title = "Copilot",
    darkMode = false,
    onToggleDarkMode,
}: UINavbarProps): React.ReactElement {
    const theme = useTheme();
    return (
        <nav style={{ backgroundColor: theme.colors.primary, color: "white" }}>
            <div className="max-w-7xl mx-auto px-4">
                <div className="relative flex h-16 items-center justify-between">

                    {/* Left: Logo */}
                    <div className="text-xl font-bold">{title}</div>

                    {/* Center: Links */}
                    <div className="hidden md:flex space-x-6 items-center">
                        {links.map((link) => {
                            if (!link.available) {
                                return (
                                    <span
                                        key={link.href}
                                        style={{ color: "rgba(255,255,255,0.35)" }}
                                        className="select-none"
                                        title="Not available"
                                    >
                                        {link.label}
                                    </span>
                                );
                            }

                            return (
                                <Link
                                    key={link.href}
                                    to={link.href}
                                    className="transition-colors"
                                    style={{
                                        color: link.active ? "white" : "rgba(255,255,255,0.70)",
                                        fontWeight: link.active ? "600" : "normal",
                                        borderBottom: link.active ? "2px solid white" : "none"
                                    }}
                                    onMouseEnter={(e) => {
                                        if (!link.active) {
                                            (e.target as HTMLAnchorElement).style.color = "white";
                                        }
                                    }}
                                    onMouseLeave={(e) => {
                                        if (!link.active) {
                                            (e.target as HTMLAnchorElement).style.color = "rgba(255,255,255,0.70)";
                                        }
                                    }}
                                >
                                    {link.label}
                                </Link>
                            );
                        })}
                    </div>

                    {/* Right: Dark Mode Toggle */}
                    <button
                        onClick={onToggleDarkMode}
                        className="ml-auto md:ml-0 p-2 rounded-lg hover:bg-[rgba(255,255,255,0.15)] transition-colors"
                        title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
                    >
                        {darkMode ? (
                            // Sun icon for light mode
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l-2.12-2.12a.5.5 0 00-.708.708l2.12 2.12a.5.5 0 00.708-.708zM2.05 6.464l2.12 2.12a.5.5 0 00.708-.708L2.757 5.756a.5.5 0 00-.708.708zm12.728 0l2.12 2.12a.5.5 0 10.708-.708l-2.12-2.12a.5.5 0 00-.708.708zM10 18a1 1 0 01-1-1v-1a1 1 0 112 0v1a1 1 0 01-1 1zM4.464 15.536l-2.12 2.12a.5.5 0 00.708.708l2.12-2.12a.5.5 0 00-.708-.708zm11.072 0l-2.12 2.12a.5.5 0 10.708.708l2.12-2.12a.5.5 0 00-.708-.708zM1 10a1 1 0 011-1h1a1 1 0 110 2H2a1 1 0 01-1-1zm16 0a1 1 0 011-1h1a1 1 0 110 2h-1a1 1 0 01-1-1z" clipRule="evenodd" />
                            </svg>
                        ) : (
                            // Moon icon for dark mode
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                            </svg>
                        )}
                    </button>

                </div>
            </div>
        </nav>
    );
}