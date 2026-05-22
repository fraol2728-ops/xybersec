"use client";

import { CheckCircle2, Circle, Loader2, Maximize2, Minimize2, Send, Terminal } from "lucide-react";
import { useEffect, useRef, useState, useTransition } from "react";
import { markLessonComplete } from "@/lib/actions/xp";

interface LessonRightPanelProps {
  lessonId: string;
  lessonTitle: string;
  lessonDescription?: string;
  courseId: string;
  lessonSlug: string;
  initialProgress: {
    isCompleted: boolean;
    xpPoints: number;
    currentStreak: number;
    longestStreak: number;
    lessonsCompleted: number;
  } | null;
}

interface Message {
  role: "user" | "assistant";
  content: string;
}

const tabs = [
  { id: "progress", label: "Progress", icon: "📊" },
  { id: "xp", label: "XP", icon: "⚡" },
  { id: "ai", label: "AI", icon: "🤖" },
  { id: "lab", label: "LAB", icon: "🧪" },
] as const;

export function LessonRightPanel({ lessonId, lessonTitle, lessonDescription, courseId, lessonSlug, initialProgress }: LessonRightPanelProps) {
  const [activeTab, setActiveTab] = useState<"progress" | "xp" | "ai" | "lab">("progress");
  const [aiExpanded, setAiExpanded] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [isCompleted, setIsCompleted] = useState(initialProgress?.isCompleted ?? false);
  const [lessonsCompleted, setLessonsCompleted] = useState(initialProgress?.lessonsCompleted ?? 0);
  const [showXPToast, setShowXPToast] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: `Hi! I'm your AI tutor for "${lessonTitle}". Ask me anything about this lesson!` },
  ]);
  const [isPendingProgress, startProgressTransition] = useTransition();
  const [isPendingAI, startAITransition] = useTransition();
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  async function handleSend() {
    if (!input.trim() || isPendingAI) return;
    const userMessage = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);

    startAITransition(async () => {
      try {
        const response = await fetch("/api/ai/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: [
              {
                role: "system",
                content: `You are an expert cybersecurity tutor for XyberSec Academy, an Ethiopian cybersecurity learning platform. You are helping a student with the lesson: "${lessonTitle}". ${lessonDescription ? `Lesson context: ${lessonDescription}` : ""} Be concise, friendly, and practical. Use simple English. Give short answers.`,
              },
              ...messages,
              { role: "user", content: userMessage },
            ],
          }),
        });
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

  return (
    <>
      <div className="relative flex flex-col h-full gap-3 p-4">
        <div className="flex bg-muted rounded-xl p-1 gap-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-1 py-2 px-2 rounded-lg text-xs font-semibold transition-all duration-200 ${
                activeTab === tab.id ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <span>{tab.icon}</span>
              <span className="hidden sm:block">{tab.label}</span>
            </button>
          ))}
        </div>

        {activeTab === "progress" && (
          <div className="bg-muted border border-border rounded-xl p-4">
            <p className="text-xs font-semibold text-muted-foreground tracking-wider uppercase mb-3">Your Progress</p>
            {isCompleted ? (
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle2 className="w-5 h-5 text-primary" />
                <span className="text-sm font-medium text-primary">Lesson Complete</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 mb-3">
                <Circle className="w-5 h-5 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Not completed yet</span>
              </div>
            )}
            <p className="text-xs text-muted-foreground mb-3">{lessonsCompleted} lessons completed total</p>
            {!isCompleted && (
              <button
                type="button"
                disabled={isPendingProgress}
                onClick={() =>
                  startProgressTransition(async () => {
                    const result = await markLessonComplete(lessonId, lessonSlug, courseId);
                    if (result && "success" in result && result.success) {
                      setIsCompleted(true);
                      setLessonsCompleted((prev) => prev + 1);
                      setShowXPToast(true);
                      setTimeout(() => setShowXPToast(false), 3000);
                    }
                  })
                }
                className="w-full py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 bg-primary text-background hover:opacity-90 hover:shadow-lg hover:shadow-primary/20 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {isPendingProgress ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : "Mark Complete"}
              </button>
            )}
          </div>
        )}

        {activeTab === "xp" && (
          <div className="bg-muted border border-border rounded-xl p-4">
            {!initialProgress ? (
              <p className="text-xs text-muted-foreground text-center py-4">Sign in to track your XP and streak</p>
            ) : (
              <>
                <p className="text-xs font-semibold text-muted-foreground tracking-wider uppercase mb-3">Stats</p>
                <div className="flex items-center justify-between py-2 border-b border-border"><div className="flex items-center gap-2"><span className="text-lg">⚡</span><span className="text-sm text-muted-foreground">Total XP</span></div><span className="text-lg font-bold text-primary">{initialProgress.xpPoints.toLocaleString()}</span></div>
                <div className="flex items-center justify-between py-2 border-b border-border"><div className="flex items-center gap-2"><span className="text-lg">🔥</span><span className="text-sm text-muted-foreground">Current Streak</span></div><span className="text-sm font-bold text-foreground">{initialProgress.currentStreak} days</span></div>
                <div className="flex items-center justify-between py-2"><div className="flex items-center gap-2"><span className="text-lg">🏆</span><span className="text-sm text-muted-foreground">Best Streak</span></div><span className="text-sm font-bold text-foreground">{initialProgress.longestStreak} days</span></div>
                {initialProgress.currentStreak === 0 && <p className="text-xs text-muted-foreground mt-3 text-center">Complete a lesson to start your streak!</p>}
                {initialProgress.currentStreak >= 1 && initialProgress.currentStreak < 7 && <p className="text-xs text-primary mt-3 text-center">🔥 Keep going! You're on a {initialProgress.currentStreak}-day streak!</p>}
                {initialProgress.currentStreak >= 7 && <p className="text-xs text-primary mt-3 text-center font-semibold">🏆 Amazing! {initialProgress.currentStreak}-day streak! You're unstoppable!</p>}
              </>
            )}
          </div>
        )}

        {activeTab === "ai" && (
          <div
            className={`${
              aiExpanded
                ? "absolute inset-0 z-10 bg-background/95 backdrop-blur-sm flex flex-col rounded-none border-l border-border"
                : "flex flex-col bg-muted border border-border rounded-xl"
            }`}
          >
            <div className="flex items-center justify-between p-3 border-b border-border">
              <div className="flex items-center gap-2">
                <span className="text-sm">🤖</span>
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">AI Tutor</span>
                <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              </div>
              <button
                onClick={() => setAiExpanded(!aiExpanded)}
                className="text-muted-foreground hover:text-foreground transition-colors p-1 rounded-md hover:bg-muted"
                title={aiExpanded ? "Minimize" : "Expand"}
              >
                {aiExpanded ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
              </button>
            </div>

            <div className={`overflow-y-auto p-3 space-y-3 ${aiExpanded ? "flex-1" : "h-48"}`}>
              {(aiExpanded ? messages : messages.slice(-3)).map((message, index) => (
                <div key={`${message.role}-${index}`} className={message.role === "user" ? "flex justify-end" : "flex justify-start"}>
                  <div
                    className={
                      message.role === "user"
                        ? "bg-primary text-background text-xs rounded-2xl rounded-tr-sm px-3 py-2 max-w-[85%]"
                        : "bg-background border border-border text-foreground text-xs rounded-2xl rounded-tl-sm px-3 py-2 max-w-[85%]"
                    }
                  >
                    {message.content}
                  </div>
                </div>
              ))}
              {isPendingAI && (
                <div className="flex justify-start">
                  <div className="bg-background border border-border rounded-2xl rounded-tl-sm px-3 py-2">
                    <Loader2 className="w-3 h-3 animate-spin text-muted-foreground" />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="p-3 border-t border-border">
              <div
                className={`flex gap-2 items-end rounded-xl border transition-all duration-200 ${
                  isFocused ? "border-primary shadow-sm shadow-primary/20" : "border-border"
                } bg-background p-2`}
              >
                <textarea
                  value={input}
                  onChange={(e) => {
                    setInput(e.target.value);
                    e.target.style.height = "auto";
                    e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px";
                  }}
                  onFocus={() => {
                    setIsFocused(true);
                    setAiExpanded(true);
                  }}
                  onBlur={() => setIsFocused(false)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                  placeholder="Ask about this lesson..."
                  rows={1}
                  className="flex-1 bg-transparent text-xs text-foreground placeholder:text-muted-foreground focus:outline-none resize-none leading-relaxed max-h-[120px] overflow-y-auto"
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim() || isPendingAI}
                  className="w-7 h-7 rounded-lg bg-primary text-background flex items-center justify-center hover:opacity-90 transition-all flex-shrink-0 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {isPendingAI ? <Loader2 className="w-3 h-3 animate-spin" /> : <Send className="w-3 h-3" />}
                </button>
              </div>
              <p className="text-xs text-muted-foreground mt-1.5 text-center">Press Enter to send · Shift+Enter for new line</p>
            </div>
          </div>
        )}

        {activeTab === "lab" && (
          <div className="bg-muted border border-border rounded-xl p-4">
            <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
              <div className="w-16 h-16 rounded-2xl bg-muted border border-border flex items-center justify-center mb-4">
                <Terminal className="w-7 h-7 text-muted-foreground" />
              </div>
              <h3 className="text-sm font-semibold text-foreground mb-2">Lab Environment</h3>
              <p className="text-xs text-muted-foreground mb-6 leading-relaxed">Hands-on hacking labs are coming soon. Practice real attack and defense scenarios directly in your browser.</p>
              <div className="w-full space-y-2">
                {["Browser-based Kali Linux", "Real CTF challenges", "Vulnerable VMs to hack", "Flag submission system"].map((feature) => (
                  <div key={feature} className="flex items-center gap-2 text-xs text-muted-foreground bg-muted rounded-lg px-3 py-2">
                    <div className="w-1 h-1 rounded-full bg-primary flex-shrink-0" />
                    {feature}
                  </div>
                ))}
              </div>
              <div className="mt-6 px-3 py-1.5 rounded-full border border-primary/30 bg-primary/5">
                <span className="text-xs font-semibold text-primary">Coming in Phase 2</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {showXPToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-primary text-background px-4 py-3 rounded-xl shadow-xl shadow-primary/30 font-semibold text-sm flex items-center gap-2 animate-bounce">
          ⚡ +50 XP earned!
        </div>
      )}
    </>
  );
}
