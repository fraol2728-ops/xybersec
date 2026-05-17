"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { AchievementPopup } from "@/components/achievements/AchievementPopup";
import {
  type AchievementDefinition,
  type AchievementRecord,
  achievementDefinitions,
} from "@/components/achievements/achievement-data";
import { syncAchievementsFromProgress } from "@/components/achievements/achievements-storage";
import {
  getAllCourseProgress,
  getCourseProgress,
  progressEventName,
} from "@/components/lessons/progress-storage";

interface AchievementTrackerProps {
  courseId: string;
  totalLessons: number;
}

export function AchievementTracker({
  courseId,
  totalLessons,
}: AchievementTrackerProps) {
  const [queuedAchievements, setQueuedAchievements] = useState<
    AchievementRecord[]
  >([]);
  const [activeAchievementId, setActiveAchievementId] = useState<string | null>(
    null,
  );

  const scanProgress = useCallback(async () => {
    const activeCourseProgress = await getCourseProgress(courseId);
    const cachedProgress = getAllCourseProgress().filter(
      (course) => course.courseId !== courseId,
    );
    const courseProgress = [...cachedProgress, activeCourseProgress].map(
      (course) => ({
        courseId: course.courseId,
        completedLessonIds: course.completedLessonIds,
        totalLessons:
          course.courseId === courseId
            ? totalLessons
            : course.completedLessonIds.length + 1,
      }),
    );

    const newAchievements = syncAchievementsFromProgress({ courseProgress });
    if (newAchievements.length > 0) {
      setQueuedAchievements((current) => [...current, ...newAchievements]);
    }
  }, [courseId, totalLessons]);

  useEffect(() => {
    void scanProgress();

    const handleProgressUpdate = (event: Event) => {
      const customEvent = event as CustomEvent<{ courseId: string }>;
      if (customEvent.detail?.courseId === courseId) {
        void scanProgress();
      }
    };

    window.addEventListener(progressEventName, handleProgressUpdate);
    return () => {
      window.removeEventListener(progressEventName, handleProgressUpdate);
    };
  }, [courseId, scanProgress]);

  useEffect(() => {
    if (activeAchievementId || queuedAchievements.length === 0) {
      return;
    }

    setActiveAchievementId(queuedAchievements[0].id);
    setQueuedAchievements((current) => current.slice(1));
  }, [activeAchievementId, queuedAchievements]);

  const activeAchievement = useMemo<AchievementDefinition | null>(() => {
    if (!activeAchievementId) {
      return null;
    }

    return (
      achievementDefinitions.find(
        (achievement) => achievement.id === activeAchievementId,
      ) ?? null
    );
  }, [activeAchievementId]);

  return (
    <AchievementPopup
      achievement={activeAchievement}
      open={!!activeAchievement}
      onClose={() => setActiveAchievementId(null)}
    />
  );
}
