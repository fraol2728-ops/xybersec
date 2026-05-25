"use client";

import { useAuth } from "@clerk/nextjs";
import { hasTierAccess, useUserTier } from "@/lib/hooks/use-user-tier";
import type { COURSE_WITH_MODULES_QUERYResult } from "@/sanity.types";
import { Skeleton } from "../ui/skeleton";
import { CourseCompleteButton } from "./CourseCompleteButton";
import { CourseHero } from "./CourseHero";
import { CourseProgress } from "./CourseProgress";
import { GatedFallback } from "./GatedFallback";
import { ModuleAccordion } from "./ModuleAccordion";

interface CourseContentProps {
  course: NonNullable<COURSE_WITH_MODULES_QUERYResult>;
  userId: string | null;
  isEnrolled: boolean;
  unlockedModules?: Record<string, boolean>;
}

export function CourseContent({ course, userId, isEnrolled, unlockedModules = {} }: CourseContentProps) {
  const { isLoaded: isAuthLoaded } = useAuth();
  const userTier = useUserTier();
  const hasAccess = hasTierAccess(userTier, course.tier);

  const lessons = (course.modules ?? []).flatMap(
    (module) => module.lessons ?? [],
  );
  const totalLessons = lessons.length;
  const completedLessons = lessons.filter((lesson) =>
    userId ? lesson.completedBy?.includes(userId) : false,
  ).length;
  const progressPercent =
    totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

  const firstLessonSlug = (lessons[0]?.slug as any)?.current ?? (lessons[0]?.slug as any);
  const firstIncompleteLesson = lessons.find((lesson) =>
    userId ? !lesson.completedBy?.includes(userId) : true,
  );
  const firstIncompleteLessonSlug =
    (firstIncompleteLesson?.slug as any)?.current ??
    (firstIncompleteLesson?.slug as any);

  const courseHref = `/courses/${course.slug?.current}`;
  const startHref = firstLessonSlug
    ? `/lessons/${firstLessonSlug}`
    : courseHref;
  const continueHref = firstIncompleteLessonSlug
    ? `/lessons/${firstIncompleteLessonSlug}`
    : startHref;

  const isCourseCompleted = userId
    ? (course.completedBy?.includes(userId) ?? false)
    : false;

  if (!isAuthLoaded) {
    return <Skeleton className="h-full w-full" />;
  }

  return (
    <>
      <CourseHero
        title={course.title}
        description={course.description ?? null}
        thumbnail={course.thumbnail ?? null}
        tier={course.tier}
        moduleCount={course.moduleCount}
        lessonCount={course.lessonCount}
        startHref={startHref}
        continueHref={continueHref}
      />

      {hasAccess ? (
        <div className="space-y-8">
          <CourseProgress progress={progressPercent} />

          {userId && (
            <CourseCompleteButton
              courseId={course._id}
              courseSlug={course.slug?.current ?? ""}
              isCompleted={isCourseCompleted}
              completedLessons={completedLessons}
              totalLessons={totalLessons}
            />
          )}

          <ModuleAccordion
            modules={course.modules ?? null}
            userId={userId}
            isEnrolled={isEnrolled}
            unlockedModules={unlockedModules}
          />
        </div>
      ) : (
        <GatedFallback requiredTier={course.tier} />
      )}
    </>
  );
}
