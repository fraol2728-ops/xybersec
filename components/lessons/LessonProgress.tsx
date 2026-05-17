"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import {
  getCourseProgress,
  progressEventName,
} from "@/components/lessons/progress-storage";

interface LessonProgressProps {
  courseId: string;
  totalLessons: number;
}

export function LessonProgress({
  courseId,
  totalLessons,
}: LessonProgressProps) {
  const [percentage, setPercentage] = useState(0);

  useEffect(() => {
    let isMounted = true;

    const syncProgress = async () => {
      const progress = await getCourseProgress(courseId);
      if (!isMounted) {
        return;
      }

      const fallbackPercentage =
        totalLessons > 0
          ? Math.round(
              (progress.completedLessonIds.length / totalLessons) * 100,
            )
          : 0;

      setPercentage(progress.progress || fallbackPercentage);
    };

    const handleProgressUpdate = (event: Event) => {
      const customEvent = event as CustomEvent<{ courseId: string }>;
      if (customEvent.detail?.courseId === courseId) {
        void syncProgress();
      }
    };

    void syncProgress();
    window.addEventListener(progressEventName, handleProgressUpdate);

    return () => {
      isMounted = false;
      window.removeEventListener(progressEventName, handleProgressUpdate);
    };
  }, [courseId, totalLessons]);

  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border border-cyan-500/30 bg-[#061222]/80 p-4 shadow-[0_0_30px_rgba(6,182,212,0.2)]"
    >
      <div className="mb-2 flex items-center justify-between text-sm text-cyan-100">
        <span className="font-medium">Lesson Progress</span>
        <span>{percentage}% complete</span>
      </div>
      <div className="h-3 overflow-hidden rounded-full bg-zinc-800">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          className="h-full rounded-full bg-cyan-400"
        />
      </div>
    </motion.section>
  );
}
