"use client";

import { useState, useTransition } from "react";
import { Send, Bot, Loader2 } from "lucide-react";

const QUICK_QUESTIONS = [
  "What should I learn next?",
  "Explain SQL injection",
  "What is a reverse shell?",
  "How does XSS work?",
];

export function AIDashboardWidget() {
  const [input, setInput] = useState("");
  const [response, setResponse] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  async function handleAsk(question?: string) {
    const q = question ?? input.trim();
    if (!q || isPending) return;

    setInput("");
    setResponse(null);

    startTransition(async () => {
      try {
        const res = await fetch("/api/ai/chat", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            messages: [
              {
                role: "system",
                content:
                  "You are an expert cybersecurity tutor for XyberSec Academy, an Ethiopian platform. Give SHORT, practical answers (max 3 sentences). Be encouraging.",
              },
              { role: "user", content: q },
            ],
          }),
        });

        const data = await res.json();
        const text = data?.content?.[0]?.text ?? data?.message ?? data?.text ?? "Sorry, try again.";

        setResponse(text);
      } catch {
        setResponse("Connection error. Try again!");
      }
    });
  }

  return (
    <div className="bg-white/[0.04] backdrop-blur-md border border-white/[0.08] rounded-lg p-4">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-7 h-7 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
          <Bot className="w-4 h-4 text-primary" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-foreground">AI Tutor</h3>
          <div className="flex items-center gap-1">
            <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            <span className="text-xs text-muted-foreground">Online</span>
          </div>
        </div>
      </div>

      {!response && !isPending && (
        <p className="text-xs text-muted-foreground mb-3 leading-relaxed">
          Ask me anything about cybersecurity, ethical hacking, or your current course.
        </p>
      )}

      {isPending && (
        <div className="flex items-center gap-2 mb-3 p-3 bg-white/[0.04] rounded-lg border border-white/[0.08]">
          <Loader2 className="w-3 h-3 text-primary animate-spin flex-shrink-0" />
          <span className="text-xs text-muted-foreground">Thinking...</span>
        </div>
      )}

      {response && !isPending && (
        <div className="mb-3 p-3 bg-white/[0.04] rounded-lg border border-white/[0.08]">
          <p className="text-xs text-foreground leading-relaxed">{response}</p>
          <button
            onClick={() => setResponse(null)}
            className="text-xs text-muted-foreground hover:text-foreground mt-2 transition-colors"
          >
            Clear ×
          </button>
        </div>
      )}

      {!response && !isPending && (
        <div className="flex flex-wrap gap-1.5 mb-3">
          {QUICK_QUESTIONS.map((q) => (
            <button
              key={q}
              onClick={() => handleAsk(q)}
              className="text-xs px-2 py-1 rounded-md bg-white/[0.04] border border-white/[0.08] text-muted-foreground hover:text-foreground hover:border-primary/50 transition-all"
            >
              {q}
            </button>
          ))}
        </div>
      )}

      <div className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleAsk();
          }}
          placeholder="Ask a question..."
          className="flex-1 bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50 focus:border-primary transition-all"
        />
        <button
          onClick={() => handleAsk()}
          disabled={!input.trim() || isPending}
          className="w-8 h-8 rounded-lg bg-primary text-background flex items-center justify-center hover:opacity-90 transition-all flex-shrink-0 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <Send className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
}
