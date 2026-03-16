import { useState, useRef, useEffect, useCallback } from "react";
import { MessageCircle, X, Send, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";
import { toast } from "sonner";
import { useIsMobile } from "@/hooks/use-mobile";
import LeadCaptureForm from "./LeadCaptureForm";

type Message = {
  role: "user" | "assistant";
  content: string;
};

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/leadership-chat`;
const MAX_MESSAGES = 50;

const OPENING_MESSAGE = "Hi — I'm here to help you figure out if Leader as Coach is right for your organisation. What's bringing you to the site today?";

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: OPENING_MESSAGE },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [messageCount, setMessageCount] = useState(0);
  const [showLeadForm, setShowLeadForm] = useState(false);
  const [leadCaptured, setLeadCaptured] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const isMobile = useIsMobile();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, showLeadForm]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const getChatSummary = useCallback(() => {
    return messages
      .filter((m) => m.role === "user")
      .map((m) => m.content)
      .slice(0, 5)
      .join(" | ");
  }, [messages]);

  const handleLeadSubmit = async (data: {
    first_name: string;
    last_name: string;
    email: string;
    organisation: string;
  }) => {
    try {
      await fetch(CHAT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          action: "capture_lead",
          leadData: { ...data, chat_summary: getChatSummary() },
        }),
      });

      setShowLeadForm(false);
      setLeadCaptured(true);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Perfect — Kevin will be in touch within one business day. In the meantime, you might want to take our free [LAC Diagnostic](/leader-as-coach-diagnostic) to see where your organisation sits.",
        },
      ]);
    } catch {
      toast.error("Something went wrong saving your details. Please email kevin@kevinbritz.com");
    }
  };

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;
    if (messageCount >= MAX_MESSAGES) {
      toast.error("You've reached the message limit for this session.");
      return;
    }

    const userMessage: Message = { role: "user", content: input.trim() };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);
    setMessageCount((c) => c + 1);

    let assistantContent = "";

    const updateAssistant = (chunk: string) => {
      assistantContent += chunk;
      // Check for lead capture signal
      const cleanContent = assistantContent.replace(/\[LEAD_CAPTURE\]/g, "").trim();
      setMessages((prev) => {
        const last = prev[prev.length - 1];
        if (last?.role === "assistant" && prev.length > 1 && prev[prev.length - 2]?.role === "user") {
          return prev.map((m, i) => (i === prev.length - 1 ? { ...m, content: cleanContent } : m));
        }
        return [...prev, { role: "assistant", content: cleanContent }];
      });
    };

    try {
      const resp = await fetch(CHAT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          messages: [...messages, userMessage].map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      if (!resp.ok || !resp.body) {
        throw new Error("Failed to start stream");
      }

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let textBuffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        textBuffer += decoder.decode(value, { stream: true });

        let newlineIndex: number;
        while ((newlineIndex = textBuffer.indexOf("\n")) !== -1) {
          let line = textBuffer.slice(0, newlineIndex);
          textBuffer = textBuffer.slice(newlineIndex + 1);
          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (!line.startsWith("data: ")) continue;
          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") break;
          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content as string | undefined;
            if (content) updateAssistant(content);
          } catch {
            textBuffer = line + "\n" + textBuffer;
            break;
          }
        }
      }

      // Check if lead capture was triggered
      if (assistantContent.includes("[LEAD_CAPTURE]") && !leadCaptured) {
        setShowLeadForm(true);
      }
    } catch (error) {
      console.error("Chat error:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Sorry, I'm having a moment — drop us an email at kevin@kevinbritz.com and we'll come back to you.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      {/* Chat Toggle Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="fixed bottom-6 right-6 z-50"
          >
            <button
              onClick={() => setIsOpen(true)}
              className="rounded-full w-14 h-14 shadow-lg flex items-center justify-center transition-transform hover:scale-105"
              style={{ backgroundColor: "#0F1F2E" }}
              aria-label="Open chat"
            >
              <MessageCircle className="w-6 h-6" style={{ color: "#2A7B88" }} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className={cn(
              "fixed z-50 flex flex-col overflow-hidden shadow-2xl",
              isMobile
                ? "inset-0 rounded-none"
                : "bottom-6 right-6 w-[380px] max-w-[calc(100vw-48px)] h-[520px] max-h-[calc(100vh-100px)] rounded-2xl"
            )}
            style={{ backgroundColor: "#FFFFFF", border: "1px solid #E5E7EB" }}
          >
            {/* Header */}
            <div
              className="px-4 py-3 flex items-center justify-between shrink-0"
              style={{ backgroundColor: "#0F1F2E" }}
            >
              <div className="flex flex-col">
                <span
                  className="font-semibold text-white text-[15px]"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  Talk to Kevin's team
                </span>
                <span className="text-xs" style={{ color: "#2A7B88" }}>
                  Usually replies instantly
                </span>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white/70 hover:text-white transition-colors p-1"
                aria-label="Close chat"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={cn(
                    "flex",
                    message.role === "user" ? "justify-end" : "justify-start"
                  )}
                >
                  <div
                    className={cn(
                      "max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed",
                      message.role === "user"
                        ? "rounded-br-md"
                        : "rounded-bl-md"
                    )}
                    style={
                      message.role === "user"
                        ? { backgroundColor: "#F8F6F1", color: "#0F1F2E" }
                        : { backgroundColor: "#0F1F2E", color: "#FFFFFF" }
                    }
                  >
                    {message.role === "assistant" ? (
                      <div className="prose prose-sm max-w-none prose-invert prose-p:my-1 prose-ul:my-1 prose-li:my-0 prose-a:text-[#2A7B88] prose-a:underline">
                        <ReactMarkdown>{message.content}</ReactMarkdown>
                      </div>
                    ) : (
                      message.content
                    )}
                  </div>
                </div>
              ))}

              {isLoading && messages[messages.length - 1]?.role === "user" && (
                <div className="flex justify-start">
                  <div
                    className="rounded-2xl rounded-bl-md px-4 py-3 flex gap-1"
                    style={{ backgroundColor: "#0F1F2E" }}
                  >
                    <span className="w-2 h-2 rounded-full bg-white/50 animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-2 h-2 rounded-full bg-white/50 animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-2 h-2 rounded-full bg-white/50 animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              )}

              {showLeadForm && !leadCaptured && (
                <LeadCaptureForm onSubmit={handleLeadSubmit} />
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-3 border-t shrink-0" style={{ borderColor: "#E5E7EB" }}>
              <div className="flex gap-2">
                <input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask me anything about Leader as Coach..."
                  className="flex-1 h-10 rounded-lg border px-3 text-sm focus:outline-none focus:ring-1"
                  style={{
                    borderColor: "#E5E7EB",
                    color: "#0F1F2E",
                    backgroundColor: "#FFFFFF",
                  }}
                  disabled={isLoading || messageCount >= MAX_MESSAGES}
                />
                <button
                  onClick={sendMessage}
                  disabled={!input.trim() || isLoading || messageCount >= MAX_MESSAGES}
                  className="shrink-0 w-10 h-10 rounded-lg flex items-center justify-center text-white transition-opacity disabled:opacity-40"
                  style={{ backgroundColor: "#2A7B88" }}
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
