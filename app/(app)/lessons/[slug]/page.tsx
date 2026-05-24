import { auth } from "@clerk/nextjs/server";
import { notFound } from "next/navigation";
import { PaywallOverlay } from "@/components/courses/PaywallOverlay";
import { LessonMainContent } from "@/components/lessons/LessonMainContent";
import { LessonRightPanel } from "@/components/lessons/LessonRightPanel";
import { LessonTopBar } from "@/components/lessons/LessonTopBar";
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

  if (!canAccess) return <PaywallOverlay courseSlug={courseSlug} courseId={lesson.courseId ?? ""} courseTitle={lesson.title ?? "This course"} />;

  const progressData = userId ? await getLessonProgress(lesson._id) : null;

  return (
    <div data-lesson-page="true" className="dark min-h-screen bg-background text-foreground">
      <LessonTopBar lessonTitle={lesson.title ?? ""} moduleIsFree={lesson.moduleIsFree ?? false} />
      <div className="flex h-[calc(100vh-56px)] pt-[56px]">
        <main className="flex-1 overflow-y-auto">
          <LessonMainContent lesson={lesson} userId={userId} moduleIsFree={moduleIsFree} />
        </main>
        <aside className="lesson-panel-aside w-80 border-l border-border overflow-y-auto flex-shrink-0 hidden lg:flex flex-col relative">
          <LessonRightPanel
            lessonId={lesson._id}
            lessonTitle={lesson.title ?? ""}
            lessonDescription={lesson.description}
            courseId={lesson.courseId ?? ""}
            lessonSlug={lesson.slug?.current ?? ""}
            initialProgress={progressData}
          />
        </aside>
      </div>
    </div>
  );
}
