import { auth } from "@clerk/nextjs/server";
import { notFound } from "next/navigation";
import { CPPaywallOverlay } from "@/components/courses/CPPaywallOverlay";
import { LessonMainContent } from "@/components/lessons/LessonMainContent";
import { LessonRightPanel } from "@/components/lessons/LessonRightPanel";
import { LessonTopBar } from "@/components/lessons/LessonTopBar";
import { canUserAccessLesson } from "@/lib/course-access";
import { getLessonProgress } from "@/lib/actions/xp";
import { prisma } from "@/lib/prisma";
import { sanityFetch } from "@/sanity/lib/live";
import { LESSON_BY_SLUG_QUERY } from "@/sanity/lib/queries";

interface LessonPageProps { params: Promise<{ slug: string }>; }

export default async function LessonPage({ params }: LessonPageProps) {
  const { slug } = await params;
  const { userId } = await auth();
  const { data: lesson } = await sanityFetch({ query: LESSON_BY_SLUG_QUERY, params: { slug } });
  if (!lesson) notFound();


  const fallbackCourseIdFromCourses = lesson.courses?.find((course: any) =>
    (course.slug?.current ?? course.slug) === lesson.courseSlug,
  )?._id ?? lesson.courses?.[0]?._id;

  const resolvedCourseId = lesson.courseId?.trim() || fallbackCourseIdFromCourses || "";

  const accessResult = await canUserAccessLesson(
    resolvedCourseId,
    lesson.moduleId ?? "",
    lesson.moduleIsFree ?? false,
    lesson.moduleCpCost ?? 100,
  );

  if (!accessResult.canAccess) {
    return (
      <CPPaywallOverlay
        courseSlug={lesson.courseSlug ?? ""}
        moduleId={lesson.moduleId ?? ""}
        courseId={resolvedCourseId}
        moduleTitle={"This module"}
        cpCost={accessResult.cpCost ?? 100}
        userCPBalance={accessResult.userCPBalance ?? 0}
      />
    );
  }


  const progressData = userId ? await getLessonProgress(lesson._id) : null;

  let completedModuleLessons = 0;
  if (userId && lesson.moduleId) {
    const profile = await prisma.userProfile.findUnique({
      where: { clerkId: userId },
      select: { id: true },
    });

    if (profile) {
      const moduleLessonIds = lesson.courses
        ?.flatMap((c: any) => c.modules ?? [])
        .find((m: any) => m._id === lesson.moduleId)
        ?.lessons?.map((l: any) => l._id) ?? [];

      if (moduleLessonIds.length > 0) {
        completedModuleLessons = await prisma.lessonProgress.count({
          where: {
            userId: profile.id,
            lessonId: { in: moduleLessonIds },
            completed: true,
          },
        });
      }
    }
  }

  return (
    <div data-lesson-page="true" className="dark min-h-screen bg-background text-foreground">
      <LessonTopBar lessonTitle={lesson.title ?? ""} moduleIsFree={lesson.moduleIsFree ?? false} />
      <div className="flex h-[calc(100vh-56px)] pt-[56px]">
        <main className="flex-1 overflow-y-auto">
          <LessonMainContent lesson={lesson} userId={userId} moduleIsFree={lesson?.moduleIsFree ?? false} />
        </main>
        <aside className="lesson-panel-aside w-80 border-l border-border overflow-y-auto flex-shrink-0 hidden lg:flex flex-col relative">
          <LessonRightPanel
            lessonId={lesson._id}
            lessonTitle={lesson.title ?? ""}
            lessonDescription={lesson.description}
            courseId={resolvedCourseId}
            lessonSlug={lesson.slug?.current ?? ""}
            moduleId={lesson.moduleId ?? ""}
            totalModuleLessons={lesson.moduleTotalLessons ?? 0}
            completedModuleLessons={completedModuleLessons}
            initialProgress={progressData}
          />
        </aside>
      </div>
    </div>
  );
}
