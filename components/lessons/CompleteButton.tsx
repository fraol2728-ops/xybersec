"use client";

import { motion } from "framer-motion";
import { Check, Circle, Loader2 } from "lucide-react";
import { useEffect, useState, useTransition } from "react";
import {
  getCompletedLessonIds,
  progressEventName,
  saveCompletedLessonIds,
} from "@/components/lessons/progress-storage";
import { Button } from "@/components/ui/button";

interface CompleteButtonProps {
  courseId: string;
  lessonId: string;
}

export function CompleteButton({ courseId, lessonId }: CompleteButtonProps) {
  const [isCompleted, setIsCompleted] = useState(false);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    let isMounted = true;

    const syncState = async () => {
      const completedLessons = await getCompletedLessonIds(courseId);
      if (isMounted) {
        setIsCompleted(completedLessons.includes(lessonId));
      }
    };

    const handleProgressUpdate = (event: Event) => {
      const customEvent = event as CustomEvent<{ courseId: string }>;
      if (customEvent.detail?.courseId === courseId) {
        void syncState();
      }
    };

    void syncState();
    window.addEventListener(progressEventName, handleProgressUpdate);

    return () => {
      isMounted = false;
      window.removeEventListener(progressEventName, handleProgressUpdate);
    };
  }, [courseId, lessonId]);

  const markAsComplete = () => {
    if (isCompleted || isPending) {
      return;
    }

    startTransition(async () => {
      const progress = await saveCompletedLessonIds(courseId, lessonId);
      setIsCompleted(progress.completedLessonIds.includes(lessonId));
    });
  };

  return (
    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.99 }}>
      <Button
        onClick={markAsComplete}
        disabled={isCompleted || isPending}
        className={
          isCompleted
            ? "rounded-xl border border-emerald-400/30 bg-emerald-500/10 text-emerald-300"
            : "rounded-xl border border-cyan-400/30 bg-cyan-500/10 text-cyan-200 shadow-[0_0_18px_rgba(34,211,238,0.35)] hover:bg-cyan-500/20"
        }
      >
        {isPending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
          </>
        ) : isCompleted ? (
          <>
            <Check className="mr-2 h-4 w-4" /> Completed ✔
          </>
        ) : (
          <>
            <Circle className="mr-2 h-4 w-4" /> Mark Lesson as Complete
          </>
        )}
      </Button>
    </motion.div>
  );
}
