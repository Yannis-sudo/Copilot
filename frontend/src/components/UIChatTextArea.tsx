import React from "react";

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
    return (
        <div className="px-4 md:px-20 lg:px-40 py-4 shrink-0">

            {/* Textarea wrapper with purple brand border and transparent background */}
            <div className="flex items-center gap-3 bg-[rgba(124,58,237,0.08)] border border-[#7c3aed] rounded-2xl px-4 py-2 focus-within:ring-2 focus-within:ring-[#7c3aed] focus-within:border-[#7c3aed] transition-all">
                <textarea
                    rows={1}
                    value={value}
                    onChange={onChange}
                    onKeyDown={onKeyDown}
                    placeholder={placeholder}
                    disabled={disabled}
                    className={`flex-1 bg-transparent resize-none text-sm focus:outline-none leading-relaxed self-center disabled:opacity-50 placeholder:text-[rgba(124,58,237,0.45)] ${darkMode ? "text-gray-100" : "text-gray-800"}`}
                    style={{ maxHeight: "160px" }}
                />

                {/* Send button */}
                <button
                    onClick={onSend}
                    disabled={!value.trim() || disabled}
                    className="w-9 h-9 rounded-xl bg-[#7c3aed] text-white flex items-center justify-center hover:bg-[#6d28d9] disabled:opacity-30 disabled:cursor-not-allowed transition-colors shrink-0"
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