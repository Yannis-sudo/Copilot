import React from "react";

interface UIChatTextAreaProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  onSend: () => void;
  disabled?: boolean;
  placeholder?: string;
}

export default function UIChatTextArea({
  value,
  onChange,
  onKeyDown,
  onSend,
  disabled = false,
  placeholder = "Type a message...",
}: UIChatTextAreaProps): React.ReactElement {
  return (
    <div className="bg-white border-t border-gray-200 px-4 md:px-20 lg:px-40 py-4 shrink-0">
      <div className="flex items-center gap-3 bg-white border-2 border-blue-200 rounded-2xl px-4 py-2 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 transition-all">
        <textarea
          rows={1}
          value={value}
          onChange={onChange}
          onKeyDown={onKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          className="flex-1 bg-transparent resize-none text-sm text-gray-800 placeholder-gray-400 focus:outline-none leading-relaxed self-center disabled:opacity-50"
          style={{ maxHeight: "160px" }}
        />

        {/* Send button */}
        <button
          onClick={onSend}
          disabled={!value.trim() || disabled}
          className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center hover:bg-blue-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors shrink-0"
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
        <kbd className="px-1 py-0.5 bg-gray-100 border border-gray-200 rounded text-gray-500">
          Enter
        </kbd>{" "}
        to send,{" "}
        <kbd className="px-1 py-0.5 bg-gray-100 border border-gray-200 rounded text-gray-500">
          Shift+Enter
        </kbd>{" "}
        for a new line
      </p>
    </div>
  );
}
