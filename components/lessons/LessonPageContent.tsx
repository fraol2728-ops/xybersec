"use client";

import { useEffect, useState } from "react";
import { GatedFallback } from "@/components/courses/GatedFallback";
import {
  getCompletedLessonIds,
  progressEventName,
} from "@/components/lessons/progress-storage";
import { hasTierAccess, useUserTier } from "@/lib/hooks/use-user-tier";
import type { LESSON_BY_ID_QUERYResult } from "@/sanity.types";
import { LessonLayout } from "./LessonLayout";
import { LessonPlayer } from "./LessonPlayer";
import { LessonSidebar } from "./LessonSidebar";

interface LessonPageContentProps {
  lesson: NonNullable<LESSON_BY_ID_QUERYResult>;
  userId: string | null;
}

export function LessonPageContent({
  lesson,
  userId: _userId,
}: LessonPageContentProps) {
  const userTier = useUserTier();
  const courses = lesson.courses ?? [];
  const accessibleCourse = courses.find((course) =>
    hasTierAccess(userTier, course.tier),
  );
  const hasAccess = !!accessibleCourse;
  const activeCourse = accessibleCourse ?? courses[0];

  const modules = activeCourse?.modules;
  const [completedLessonIds, setCompletedLessonIds] = useState<string[]>([]);

  let nextLesson: { slug: string; title: string } | null = null;
  let prevLesson: { slug: string; title: string } | null = null;
  let currentLessonIndex = 0;
  const allLessons: Array<{ id: string; slug: string; title: string }> = [];

  if (modules) {
    for (const module of modules) {
      for (const nestedLesson of module.lessons ?? []) {
        allLessons.push({
          id: nestedLesson._id,
          slug: nestedLesson.slug?.current ?? "",
          title: nestedLesson.title ?? "Untitled Lesson",
        });
      }
    }

    const currentIndex = allLessons.findIndex((item) => item.id === lesson._id);
    currentLessonIndex = currentIndex >= 0 ? currentIndex : 0;

    nextLesson =
      currentIndex < allLessons.length - 1
        ? {
            slug: allLessons[currentIndex + 1].slug,
            title: allLessons[currentIndex + 1].title,
          }
        : null;

    prevLesson =
      currentIndex > 0
        ? {
            slug: allLessons[currentIndex - 1].slug,
            title: allLessons[currentIndex - 1].title,
          }
        : null;
  }

  useEffect(() => {
    if (!activeCourse?._id) {
      return;
    }

    let isMounted = true;

    const syncCompleted = async () => {
      const completed = await getCompletedLessonIds(activeCourse._id);
      if (isMounted) {
        setCompletedLessonIds(completed);
      }
    };

    const handleProgressUpdate = (event: Event) => {
      const customEvent = event as CustomEvent<{ courseId: string }>;
      if (customEvent.detail?.courseId === activeCourse._id) {
        void syncCompleted();
      }
    };

    void syncCompleted();
    window.addEventListener(progressEventName, handleProgressUpdate);

    return () => {
      isMounted = false;
      window.removeEventListener(progressEventName, handleProgressUpdate);
    };
  }, [activeCourse?._id]);

  if (!hasAccess) {
    return <GatedFallback requiredTier={activeCourse?.tier} />;
  }

  return (
    <LessonLayout
      sidebar={
        activeCourse && (
          <LessonSidebar
            courseSlug={activeCourse.slug?.current ?? ""}
            courseTitle={activeCourse.title}
            modules={activeCourse.modules ?? null}
            currentLessonId={lesson._id}
            completedLessonIds={completedLessonIds}
          />
        )
      }
      content={
        <LessonPlayer
          lesson={lesson}
          courseId={activeCourse?._id ?? "default-course"}
          totalLessons={allLessons.length}
          currentLessonIndex={currentLessonIndex}
          prevLesson={prevLesson}
          nextLesson={nextLesson}
        />
      }
    />
  );
}
