import React from "react";

interface UIChatBubbleProps {
  message: string;
  role: "user" | "ai";
}

export default function UIChatBubble({
  message,
  role,
}: UIChatBubbleProps): React.ReactElement {
  const isUser = role === "user";

  // AI response: no bubble, plain text
  if (!isUser) {
    return (
      <div className="w-full max-w-2xl mx-auto mb-6 px-4">
        <p className="text-sm text-gray-700 leading-relaxed">{message}</p>
      </div>
    );
  }

  // User message: right-aligned dark bubble
  return (
    <div className="flex w-full justify-end mb-4">
      <div className="max-w-[75%] px-4 py-2.5 rounded-2xl rounded-br-sm text-sm leading-relaxed shadow-sm bg-gray-900 text-white">
        {message}
      </div>
    </div>
  );
}
