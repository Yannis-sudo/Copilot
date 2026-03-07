import React, { useState, useRef, useEffect } from "react";

// Message shape
interface Message {
  id: number;
  role: "user" | "ai";
  text: string;
}

// Initial placeholder message
const INITIAL_MESSAGES: Message[] = [
  {
    id: 1,
    role: "ai",
    text: "Hey! I'm your AI assistant. How can I help you today?",
  },
];

// Single chat message - AI responses are plain text, user messages are bubbles
function ChatBubble({ message }: { message: Message }) {
  const isUser = message.role === "user";

  // AI response: no bubble, plain text centered in the chat area
  if (!isUser) {
    return (
      <div className="w-full max-w-2xl mx-auto mb-6 px-4">
        <p className="text-sm text-gray-700 leading-relaxed">{message.text}</p>
      </div>
    );
  }

  // User message: right-aligned dark bubble
  return (
    <div className="flex w-full justify-end mb-4">
      <div className="max-w-[75%] px-4 py-2.5 rounded-2xl rounded-br-sm text-sm leading-relaxed shadow-sm bg-gray-900 text-white">
        {message.text}
      </div>
    </div>
  );
}

// Animated typing indicator
function TypingIndicator() {
  return (
    <div className="flex items-center gap-1.5 px-4 py-3 bg-gray-100 outline outline-2 outline-gray-200 rounded-2xl rounded-bl-sm w-fit shadow-sm mb-4">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="w-2 h-2 bg-gray-600 rounded-full animate-bounce"
          style={{ animationDelay: `${i * 0.15}s` }}
        />
      ))}
    </div>
  );
}

function AIChatPage(): React.ReactElement {
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSend = async (): Promise<void> => {
    const trimmed = input.trim();
    if (!trimmed) return;

    const userMessage: Message = {
      id: Date.now(),
      role: "user",
      text: trimmed,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    // TODO: Replace with a real call to your FastAPI backend.
    // Example:
    //   const res = await fetch("/api/chat", {
    //     method: "POST",
    //     headers: { "Content-Type": "application/json" },
    //     body: JSON.stringify({ message: trimmed }),
    //   });
    //   const data = await res.json();
    //   const aiText = data.reply;
    await new Promise((res) => setTimeout(res, 1200));

    const aiMessage: Message = {
      id: Date.now() + 1,
      role: "ai",
      text: "This is a placeholder response. Wire me up to your FastAPI backend!",
    };

    setMessages((prev) => [...prev, aiMessage]);
    setIsTyping(false);
  };

  // Enter sends, Shift+Enter inserts newline
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>): void => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Auto-grow textarea up to a max height
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>): void => {
    setInput(e.target.value);
    e.target.style.height = "auto";
    e.target.style.height = `${Math.min(e.target.scrollHeight, 160)}px`;
  };

  return (
    <React.Fragment>
      <div className="flex flex-col bg-white" style={{ height: "calc(100vh - 64px)" }}>

        {/* Scrollable message area */}
        <div className="flex-1 overflow-y-auto px-4 md:px-20 lg:px-40 py-6">
          {messages.map((msg) => (
            <ChatBubble key={msg.id} message={msg} />
          ))}

          {isTyping && <TypingIndicator />}

          <div ref={bottomRef} />
        </div>

        {/* Input bar - white with a light top border as separator */}
        <div className="bg-white border-t border-gray-200 px-4 md:px-20 lg:px-40 py-4 shrink-0">
          <div className="flex items-center gap-3 bg-white border-2 border-blue-200 rounded-2xl px-4 py-2 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 transition-all">
            <textarea
              rows={1}
              value={input}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder="Type a message..."
              className="flex-1 bg-transparent resize-none text-sm text-gray-800 placeholder-gray-400 focus:outline-none leading-relaxed self-center"
              style={{ maxHeight: "160px" }}
            />

            {/* Send button */}
            <button
              onClick={handleSend}
              disabled={!input.trim() || isTyping}
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
      </div>
    </React.Fragment>
  );
}

export default AIChatPage;