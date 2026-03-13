import React from "react";

interface UITypingIndicatorProps {
    darkMode?: boolean;
}

export default function UITypingIndicator({ darkMode = false }: UITypingIndicatorProps): React.ReactElement {
    const wrapperStyle = darkMode ? "bg-[#1f1f1f] border-[rgba(255,255,255,0.15)]" : "bg-[rgba(124,58,237,0.08)]";
    return (
        <div className={`flex items-center gap-1.5 px-4 py-3 rounded-2xl rounded-bl-sm w-fit shadow-sm mb-4 border border-[rgba(124,58,237,0.25)] ${wrapperStyle}`}>
            {[0, 1, 2].map((i) => (
                <span
                    key={i}
                    className="w-2 h-2 rounded-full animate-bounce bg-[#7c3aed]"
                    style={{ animationDelay: `${i * 0.15}s` }}
                />
            ))}
        </div>
    );
}