import React, { useState, useRef, useEffect } from "react";
import UIChatBubble from "../components/UIChatBubble";
import UITypingIndicator from "../components/UITypingIndicator";
import UIChatTextArea from "../components/UIChatTextArea";
import { useSettings } from "../context/SettingsContext";

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

function AIChatPage(): React.ReactElement {
  const { settings } = useSettings();
  const { darkMode } = settings;
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

    // Simulate AI response for now
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
      <div className={`flex flex-col ${darkMode ? "bg-dark" : "bg-white"}`} style={{ height: "calc(100vh - 64px)" }}>

        {/* Scrollable message area */}
        <div className={`flex-1 overflow-y-auto px-4 md:px-20 lg:px-40 py-6 ${darkMode ? "bg-dark" : "bg-white"}`}>
          {messages.map((msg) => (
            <UIChatBubble key={msg.id} message={msg.text} role={msg.role} darkMode={darkMode} />
          ))}

          {isTyping && <UITypingIndicator darkMode={darkMode} />}

          <div ref={bottomRef} />
        </div>

        {/* Input bar */}
        <UIChatTextArea
          value={input}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onSend={handleSend}
          disabled={isTyping}
          darkMode={darkMode}
        />
      </div>
    </React.Fragment>
  );
}

export default AIChatPage;