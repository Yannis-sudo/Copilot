import React from "react";
import useTheme from "../hooks/useTheme";

interface UIChatTextAreaProps {
    value: string;
    onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    onKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
    onSend: () => void;
    disabled?: boolean;
    placeholder?: string;
    darkMode?: boolean;
}

export default function UIChatTextArea({
    value,
    onChange,
    onKeyDown,
    onSend,
    disabled = false,
    placeholder = "Type a message...",
    darkMode = false,
}: UIChatTextAreaProps): React.ReactElement {
    const theme = useTheme();
    
    return (
        <div className="px-4 md:px-20 lg:px-40 py-4 shrink-0">

            {/* Textarea wrapper with teal brand border and transparent background */}
            <div 
                className="flex items-center gap-3 rounded-2xl px-4 py-2 transition-all border focus-within:ring-2"
                style={{
                    backgroundColor: theme.colors.alpha08,
                    borderColor: theme.colors.primary,
                    outlineColor: theme.colors.primary,
                }}
            >
                <textarea
                    rows={1}
                    value={value}
                    onChange={onChange}
                    onKeyDown={onKeyDown}
                    placeholder={placeholder}
                    disabled={disabled}
                    className={`flex-1 bg-transparent resize-none text-sm focus:outline-none leading-relaxed self-center disabled:opacity-50 ${darkMode ? "text-gray-100" : "text-gray-800"}`}
                    style={{ 
                        maxHeight: "160px",
                        color: theme.colors.textSecondary
                    }}
                />

                {/* Send button */}
                <button
                    onClick={onSend}
                    disabled={!value.trim() || disabled}
                    className="w-9 h-9 rounded-xl text-white flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed transition-colors shrink-0"
                    style={{
                        backgroundColor: theme.colors.primary,
                    }}
                    onMouseEnter={(e) => {
                        if (!disabled) {
                            (e.target as HTMLButtonElement).style.backgroundColor = theme.colors.primaryDarker;
                        }
                    }}
                    onMouseLeave={(e) => {
                        if (!disabled) {
                            (e.target as HTMLButtonElement).style.backgroundColor = theme.colors.primary;
                        }
                    }}
                    aria-label="Send message"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="w-4 h-4"
                    >
                        <path d="M3.478 2.405a.75.75 0 0 0-.926.94l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.405Z" />
                    </svg>
                </button>
            </div>

            <p className="text-center text-xs text-gray-400 mt-2">
                Press{" "}
                <kbd className={`px-1 py-0.5 rounded border text-gray-500 ${darkMode ? "bg-gray-700 border-gray-600" : "bg-[rgba(124,58,237,0.08)] border-[rgba(124,58,237,0.30)]"}`}>
                    Enter
                </kbd>{" "}
                to send,{" "}
                <kbd className={`px-1 py-0.5 rounded border text-gray-500 ${darkMode ? "bg-gray-700 border-gray-600" : "bg-[rgba(124,58,237,0.08)] border-[rgba(124,58,237,0.30)]"}`}>
                    Shift+Enter
                </kbd>{" "}
                for a new line
            </p>

        </div>
    );
}