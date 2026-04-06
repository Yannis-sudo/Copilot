import React from "react";
import useTheme from "../hooks/useTheme";

interface UIChatBubbleProps {
    message: string;
    role: "user" | "ai";
    darkMode?: boolean;
    isUser?: boolean;
}

export default function UIChatBubble({
    message,
    role,
}: UIChatBubbleProps): React.ReactElement {
    const theme = useTheme();
    const isUserFromRole = role === "user";

    // AI message: left-aligned bubble in gray
    if (!isUserFromRole) {
        return (
            <div className="flex w-full justify-start mb-4">
                <div className="max-w-[75%] px-4 py-2.5 rounded-2xl rounded-bl-sm text-sm leading-relaxed shadow-sm bg-gray-100 text-gray-800">
                    {message}
                </div>
            </div>
        );
    }

    // User message: right-aligned bubble in brand teal
    return (
        <div className="flex w-full justify-end mb-4">
            <div 
                className="max-w-[75%] px-4 py-2.5 rounded-2xl rounded-br-sm text-sm leading-relaxed shadow-sm text-white"
                style={{ backgroundColor: theme.colors.primary }}
            >
                {message}
            </div>
        </div>
    );
}