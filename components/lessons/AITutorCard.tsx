"use client";

import { Bot, Loader2, Send } from "lucide-react";
import { useEffect, useRef, useState, useTransition } from "react";

interface AITutorCardProps {
  lessonTitle: string;
  lessonDescription?: string;
}

interface Message {
  role: "user" | "assistant";
  content: string;
}

export function AITutorCard({ lessonTitle, lessonDescription }: AITutorCardProps) {
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: `Hi! I'm your AI tutor for "${lessonTitle}". Ask me anything about this lesson!` },
  ]);
  const [input, setInput] = useState("");
  const [isPending, startTransition] = useTransition();
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  async function handleSend() {
    if (!input.trim() || isPending) return;
    const userMessage = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);

    startTransition(async () => {
      try {
        const response = await fetch("/api/ai/chat", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ messages: [{ role: "system", content: `You are an expert cybersecurity tutor for XyberSec Academy, an Ethiopian cybersecurity learning platform. You are helping a student with the lesson: "${lessonTitle}". ${lessonDescription ? `Lesson context: ${lessonDescription}` : ""} Be concise, friendly, and practical. Use simple English. Give short answers.` }, ...messages, { role: "user", content: userMessage }] }) });
        const text = await response.text();
        const chunks = text.split("\n").filter((line) => line.startsWith("data: "));
        let assembled = "";
        for (const line of chunks) {
          const payload = line.replace(/^data: /, "").trim();
          if (payload === "[DONE]") break;
          try {
            const parsed = JSON.parse(payload);
            if (parsed?.type === "text-delta") assembled += parsed.delta ?? "";
          } catch {}
        }
        const assistantMessage = assembled || "Sorry, I couldn't process that. Try again.";
        setMessages((prev) => [...prev, { role: "assistant", content: assistantMessage }]);
      } catch {
        setMessages((prev) => [...prev, { role: "assistant", content: "Connection error. Please try again." }]);
      }
    });
  }

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return <div className="bg-muted border border-border rounded-xl flex flex-col flex-1 min-h-0"><div className="flex items-center gap-2 p-4 border-b border-border"><Bot className="w-4 h-4 text-primary" /><p className="text-xs font-semibold text-muted-foreground tracking-wider uppercase">AI Tutor</p><div className="w-1.5 h-1.5 rounded-full bg-green-400 ml-auto" /></div><div className="flex-1 overflow-y-auto p-3 space-y-3 min-h-[200px] max-h-[300px]">{messages.map((message, index) => <div key={`${message.role}-${index}`} className={message.role === "user" ? "flex justify-end" : "flex justify-start"}><div className={message.role === "user" ? "bg-primary text-background text-xs rounded-2xl rounded-tr-sm px-3 py-2 max-w-[85%]" : "bg-background border border-border text-foreground text-xs rounded-2xl rounded-tl-sm px-3 py-2 max-w-[85%]"}>{message.content}</div></div>)}{isPending && <div className="flex justify-start"><div className="bg-background border border-border rounded-2xl rounded-tl-sm px-3 py-2"><Loader2 className="w-3 h-3 animate-spin text-muted-foreground" /></div></div>}<div ref={messagesEndRef} /></div><div className="p-3 border-t border-border"><div className="flex gap-2"><input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()} placeholder="Ask about this lesson..." className="flex-1 bg-background border border-border rounded-lg px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50 focus:border-primary transition-all" /><button onClick={handleSend} disabled={!input.trim() || isPending} className="w-8 h-8 rounded-lg bg-primary text-background flex items-center justify-center hover:opacity-90 transition-all disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0"><Send className="w-3 h-3" /></button></div></div></div>;
}
