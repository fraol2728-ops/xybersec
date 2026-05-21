"use client";

import { CheckCircle2, Circle, Loader2 } from "lucide-react";
import { useState, useTransition } from "react";
import { markLessonComplete } from "@/lib/actions/xp";

interface ProgressCardProps {
  lessonId: string;
  courseId: string;
  lessonSlug: string;
  initialData: {
    isCompleted: boolean;
    lessonsCompleted: number;
  } | null;
}

export function ProgressCard({ lessonId, courseId, lessonSlug, initialData }: ProgressCardProps) {
  const [isCompleted, setIsCompleted] = useState(initialData?.isCompleted ?? false);
  const [lessonsCompleted, setLessonsCompleted] = useState(initialData?.lessonsCompleted ?? 0);
  const [showXPToast, setShowXPToast] = useState(false);
  const [isPending, startTransition] = useTransition();

  return (
    <>
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
            disabled={isPending}
            onClick={() => startTransition(async () => {
              const result = await markLessonComplete(lessonId, lessonSlug, courseId);
              if (result && "success" in result && result.success) {
                setIsCompleted(true);
                setLessonsCompleted((prev) => prev + 1);
                setShowXPToast(true);
                setTimeout(() => setShowXPToast(false), 3000);
              }
            })}
            className="w-full py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 bg-primary text-background hover:opacity-90 hover:shadow-lg hover:shadow-primary/20 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {isPending ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : "Mark Complete"}
          </button>
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
