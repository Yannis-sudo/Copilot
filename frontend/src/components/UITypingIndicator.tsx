import React from "react";
import useTheme from "../hooks/useTheme";

interface UITypingIndicatorProps {
    darkMode?: boolean;
}

export default function UITypingIndicator({ darkMode = false }: UITypingIndicatorProps): React.ReactElement {
    const theme = useTheme();
    const wrapperStyle = darkMode ? { backgroundColor: "#1f1f1f", borderColor: "rgba(255,255,255,0.15)" } : { backgroundColor: theme.colors.alpha08 };
    return (
        <div 
            className="flex items-center gap-1.5 px-4 py-3 rounded-2xl rounded-bl-sm w-fit shadow-sm mb-4 border"
            style={{
                ...wrapperStyle,
                borderColor: theme.colors.border
            }}
        >
            {[0, 1, 2].map((i) => (
                <span
                    key={i}
                    className="w-2 h-2 rounded-full animate-bounce"
                    style={{ 
                        backgroundColor: theme.colors.primary,
                        animationDelay: `${i * 0.15}s` 
                    }}
                />
            ))}
        </div>
    );
}