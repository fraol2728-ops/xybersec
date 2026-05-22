import { auth } from "@clerk/nextjs/server";
import { notFound } from "next/navigation";
import { PaywallOverlay } from "@/components/courses/PaywallOverlay";
import { AITutorCard } from "@/components/lessons/AITutorCard";
import { LessonMainContent } from "@/components/lessons/LessonMainContent";
import { LessonTopBar } from "@/components/lessons/LessonTopBar";
import { ProgressCard } from "@/components/lessons/ProgressCard";
import { XPStreakCard } from "@/components/lessons/XPStreakCard";
import { canUserAccessLesson } from "@/lib/course-access";
import { getLessonProgress } from "@/lib/actions/xp";
import { sanityFetch } from "@/sanity/lib/live";
import { LESSON_BY_SLUG_QUERY } from "@/sanity/lib/queries";

interface LessonPageProps { params: Promise<{ slug: string }>; }

export default async function LessonPage({ params }: LessonPageProps) {
  const { slug } = await params;
  const { userId } = await auth();
  const { data: lesson } = await sanityFetch({ query: LESSON_BY_SLUG_QUERY, params: { slug } });
  if (!lesson) notFound();

  const moduleIsFree = lesson?.moduleIsFree ?? false;
  const courseId = lesson?.courseId ?? "";
  const courseSlug = lesson?.courseSlug ?? "";
  const canAccess = await canUserAccessLesson(courseId, moduleIsFree);

  if (!canAccess) return <PaywallOverlay courseSlug={courseSlug} />;

  const progressData = userId ? await getLessonProgress(lesson._id) : null;

  return (
    <div data-lesson-page="true" className="dark min-h-screen bg-background text-foreground">
      <LessonTopBar lessonTitle={lesson.title ?? "Lesson"} courseTitle={lesson.courses?.[0]?.title ?? "Course"} moduleIsFree={moduleIsFree} />
      <div className="flex h-[calc(100vh-52px)] pt-[52px]">
        <main className="flex-1 overflow-y-auto">
          <LessonMainContent lesson={lesson} userId={userId} moduleIsFree={moduleIsFree} />
        </main>
        <aside className="w-80 border-l border-border overflow-y-auto flex-shrink-0 hidden lg:flex flex-col gap-4 p-4">
          <ProgressCard lessonId={lesson._id} courseId={lesson.courseId} lessonSlug={lesson.slug?.current ?? ""} initialData={progressData} />
          <XPStreakCard initialData={progressData} />
          <AITutorCard lessonTitle={lesson.title ?? "Lesson"} lessonDescription={lesson.description ?? undefined} />
        </aside>
      </div>
    </div>
  );
}
