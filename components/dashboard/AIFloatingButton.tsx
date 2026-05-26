"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { Bot, Loader2, Send, X } from "lucide-react";

const QUICK_QUESTIONS = [
  "What should I learn next?",
  "Explain SQL injection",
  "What is a reverse shell?",
  "How does XSS work?",
];

type Message = { role: "user" | "assistant"; content: string };

export function AIFloatingButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hi! I'm your AI cybersecurity tutor. Ask me anything! 🛡️",
    },
  ]);
  const [isPending, startTransition] = useTransition();
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function handleSend(q?: string) {
    const question = q ?? input.trim();
    if (!question || isPending) return;

    const nextMessages = [...messages, { role: "user" as const, content: question }];
    setInput("");
    setMessages(nextMessages);

    startTransition(async () => {
      try {
        const res = await fetch("/api/ai/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: [
              {
                role: "system",
                content:
                  "You are an expert cybersecurity tutor for XyberSec Academy Ethiopia. Give SHORT practical answers (max 3 sentences). Be encouraging and clear.",
              },
              ...nextMessages,
            ],
          }),
        });
        const data = await res.json();
        const text = data?.content?.[0]?.text ?? data?.message ?? "Sorry, try again!";
        setMessages((prev) => [...prev, { role: "assistant", content: text }]);
      } catch {
        setMessages((prev) => [...prev, { role: "assistant", content: "Connection error. Try again!" }]);
      }
    });
  }

  return (
    <>
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-2xl bg-primary text-background shadow-xl shadow-primary/30 flex items-center justify-center hover:opacity-90 hover:scale-110 transition-all duration-200"
        >
          <Bot className="w-6 h-6" />
        </button>
      )}

      {isOpen && (
        <div
          className="fixed bottom-6 right-6 z-50 w-80 sm:w-96 flex flex-col rounded-2xl border border-border bg-background shadow-2xl shadow-black/50 overflow-hidden"
          style={{ height: "480px" }}
        >
          <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-muted">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-primary/20 flex items-center justify-center">
                <Bot className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="text-xs font-bold text-foreground">AI Tutor</p>
                <div className="flex items-center gap-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
                  <span className="text-xs text-muted-foreground">Online</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-muted-foreground hover:text-foreground transition-colors p-1 rounded-lg hover:bg-muted"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-3">
            {messages.map((msg, i) => (
              <div key={`${msg.role}-${i}`} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[85%] px-3 py-2 rounded-2xl text-xs leading-relaxed ${
                    msg.role === "user"
                      ? "bg-primary text-background rounded-tr-sm"
                      : "bg-muted border border-border text-foreground rounded-tl-sm"
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}
            {isPending && (
              <div className="flex justify-start">
                <div className="bg-muted border border-border rounded-2xl rounded-tl-sm px-3 py-2">
                  <Loader2 className="w-3 h-3 animate-spin text-muted-foreground" />
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {messages.length <= 1 && (
            <div className="px-3 pb-2 flex flex-wrap gap-1.5">
              {QUICK_QUESTIONS.map((q) => (
                <button
                  key={q}
                  onClick={() => handleSend(q)}
                  className="text-xs px-2.5 py-1 rounded-lg bg-muted border border-border text-muted-foreground hover:text-foreground hover:border-primary/50 transition-all"
                >
                  {q}
                </button>
              ))}
            </div>
          )}

          <div className="p-3 border-t border-border">
            <div className="flex gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSend();
                }}
                placeholder="Ask anything..."
                className="flex-1 bg-muted border border-border rounded-xl px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50 focus:border-primary transition-all"
              />
              <button
                onClick={() => handleSend()}
                disabled={!input.trim() || isPending}
                className="w-8 h-8 rounded-xl bg-primary text-background flex items-center justify-center hover:opacity-90 transition-all disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0"
              >
                <Send className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
