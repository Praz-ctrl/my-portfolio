"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  AgentMessage,
  getAgentResponse,
  getWelcomeMessage,
  scrollToSection,
  generateId,
} from "@/lib/agent";

export default function AIAgent() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<AgentMessage[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Initialize with welcome message
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setIsTyping(true);
      const timer = setTimeout(() => {
        setMessages([getWelcomeMessage()]);
        setIsTyping(false);
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [isOpen, messages.length]);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => inputRef.current?.focus(), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Auto-prompt after 8 seconds on first visit
  useEffect(() => {
    if (hasInteracted) return;
    const timer = setTimeout(() => {
      setHasInteracted(true);
    }, 8000);
    return () => clearTimeout(timer);
  }, [hasInteracted]);

  const sendMessage = useCallback(
    (text: string) => {
      if (!text.trim()) return;

      const userMsg: AgentMessage = {
        id: generateId(),
        role: "user",
        content: text.trim(),
        timestamp: Date.now(),
      };

      setMessages((prev) => [...prev, userMsg]);
      setInput("");
      setIsTyping(true);

      // Simulate thinking delay
      const delay = 400 + Math.random() * 600;
      setTimeout(() => {
        const response = getAgentResponse(text);
        const agentMsg: AgentMessage = {
          id: generateId(),
          role: "agent",
          content: response.content,
          actions: response.actions,
          timestamp: Date.now(),
        };
        setMessages((prev) => [...prev, agentMsg]);
        setIsTyping(false);
      }, delay);
    },
    []
  );

  const handleAction = useCallback(
    (action: { label: string; type: string; target?: string }) => {
      if (action.type === "navigate" && action.target) {
        scrollToSection(action.target);

        const userMsg: AgentMessage = {
          id: generateId(),
          role: "user",
          content: action.label,
          timestamp: Date.now(),
        };
        setMessages((prev) => [...prev, userMsg]);

        setIsTyping(true);
        setTimeout(() => {
          const agentMsg: AgentMessage = {
            id: generateId(),
            role: "agent",
            content: `Navigating you to the ${action.label.replace("Go to ", "").replace("View ", "").replace("Back to ", "")} section. Enjoy the journey. ✦`,
            timestamp: Date.now(),
          };
          setMessages((prev) => [...prev, agentMsg]);
          setIsTyping(false);
        }, 500);

        // Don't auto-close so users can continue chatting
      }
    },
    []
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  return (
    <>
      {/* Floating Orb Button */}
      <motion.button
        className="fixed bottom-8 right-8 z-[200] w-14 h-14 rounded-full flex items-center justify-center group"
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, scale: 0, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ delay: 3, type: "spring", stiffness: 200, damping: 15 }}
      >
        {/* Outer glow ring */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#c9a96e] to-[#8b5cf6] opacity-20 blur-md group-hover:opacity-40 transition-opacity duration-500" />

        {/* Button body */}
        <div className="absolute inset-0 rounded-full bg-[#141414] border border-[rgba(201,169,110,0.3)] group-hover:border-[rgba(201,169,110,0.6)] transition-colors duration-300" />

        {/* Icon */}
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.svg
              key="close"
              className="relative z-10 w-5 h-5 text-[#c9a96e]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </motion.svg>
          ) : (
            <motion.svg
              key="open"
              className="relative z-10 w-5 h-5 text-[#c9a96e]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z"
              />
            </motion.svg>
          )}
        </AnimatePresence>

        {/* Pulse indicator when not interacted */}
        {!hasInteracted && !isOpen && (
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-[#c9a96e]"
            initial={{ scale: 1, opacity: 0.6 }}
            animate={{ scale: 1.6, opacity: 0 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeOut" }}
          />
        )}
      </motion.button>

      {/* Chat Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed bottom-28 right-8 z-[199] w-[380px] max-w-[calc(100vw-2rem)] rounded-2xl overflow-hidden"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            {/* Glassmorphism background */}
            <div className="absolute inset-0 bg-[#0a0a0a]/90 backdrop-blur-2xl border border-[rgba(255,255,255,0.06)] rounded-2xl" />

            {/* Glow effect top */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-[1px] bg-gradient-to-r from-transparent via-[#c9a96e]/40 to-transparent" />

            <div className="relative z-10 flex flex-col h-[500px] max-h-[70vh]">
              {/* Header */}
              <div className="flex items-center gap-3 px-5 py-4 border-b border-[rgba(255,255,255,0.06)]">
                {/* Agent avatar */}
                <div className="relative w-8 h-8 rounded-full bg-gradient-to-br from-[#c9a96e]/20 to-[#8b5cf6]/20 flex items-center justify-center border border-[rgba(201,169,110,0.2)]">
                  <svg
                    className="w-4 h-4 text-[#c9a96e]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z"
                    />
                  </svg>
                  {/* Online indicator */}
                  <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-[#c9a96e] border-2 border-[#0a0a0a]" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-[#fafafa] tracking-[-0.01em]">
                    Prajwal AI
                  </h3>
                  <p className="text-[0.65rem] text-[#525252] tracking-[0.05em]">
                    AI-Powered Assistant
                  </p>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4 scrollbar-thin">
                {messages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[85%] ${
                        msg.role === "user"
                          ? "bg-[#c9a96e]/10 border border-[#c9a96e]/20 text-[#fafafa]"
                          : "bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.06)] text-[#d4d4d4]"
                      } rounded-2xl px-4 py-3 ${
                        msg.role === "user" ? "rounded-br-md" : "rounded-bl-md"
                      }`}
                    >
                      <p className="text-[0.82rem] leading-relaxed">{msg.content}</p>

                      {/* Action buttons */}
                      {msg.actions && msg.actions.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-3">
                          {msg.actions.map((action, i) => (
                            <button
                              key={i}
                              onClick={() => handleAction(action)}
                              className="text-[0.7rem] px-3 py-1.5 rounded-full border border-[rgba(201,169,110,0.2)] text-[#c9a96e] hover:bg-[rgba(201,169,110,0.1)] hover:border-[rgba(201,169,110,0.4)] transition-all duration-300 tracking-[0.02em]"
                            >
                              {action.type === "navigate" && (
                                <span className="mr-1">→</span>
                              )}
                              {action.label}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}

                {/* Typing indicator */}
                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex justify-start"
                  >
                    <div className="bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.06)] rounded-2xl rounded-bl-md px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <motion.div
                          className="w-1.5 h-1.5 rounded-full bg-[#c9a96e]"
                          animate={{ opacity: [0.3, 1, 0.3] }}
                          transition={{ duration: 1.2, repeat: Infinity, delay: 0 }}
                        />
                        <motion.div
                          className="w-1.5 h-1.5 rounded-full bg-[#c9a96e]"
                          animate={{ opacity: [0.3, 1, 0.3] }}
                          transition={{ duration: 1.2, repeat: Infinity, delay: 0.2 }}
                        />
                        <motion.div
                          className="w-1.5 h-1.5 rounded-full bg-[#c9a96e]"
                          animate={{ opacity: [0.3, 1, 0.3] }}
                          transition={{ duration: 1.2, repeat: Infinity, delay: 0.4 }}
                        />
                      </div>
                    </div>
                  </motion.div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Input area */}
              <form
                onSubmit={handleSubmit}
                className="px-4 py-3 border-t border-[rgba(255,255,255,0.06)]"
              >
                <div className="flex items-center gap-2 bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.06)] rounded-xl px-4 py-2.5 focus-within:border-[rgba(201,169,110,0.3)] transition-colors duration-300">
                  <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask me anything..."
                    className="flex-1 bg-transparent text-[0.82rem] text-[#fafafa] placeholder-[#525252] outline-none"
                  />
                  <button
                    type="submit"
                    disabled={!input.trim() || isTyping}
                    className="w-7 h-7 rounded-lg bg-[#c9a96e]/10 hover:bg-[#c9a96e]/20 disabled:opacity-30 flex items-center justify-center transition-all duration-300 shrink-0"
                  >
                    <svg
                      className="w-3.5 h-3.5 text-[#c9a96e]"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
                      />
                    </svg>
                  </button>
                </div>
                <p className="text-[0.6rem] text-[#3a3a3a] text-center mt-2 tracking-[0.05em]">
                  Prajwal AI • Assistant
                </p>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
