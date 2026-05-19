import { auth } from "@clerk/nextjs/server";
import { notFound } from "next/navigation";
import { PaywallOverlay } from "@/components/courses/PaywallOverlay";
import { LessonPageContent } from "@/components/lessons";
import { canUserAccessLesson } from "@/lib/course-access";
import { sanityFetch } from "@/sanity/lib/live";
import { LESSON_BY_SLUG_QUERY } from "@/sanity/lib/queries";

interface LessonPageProps {
  params: Promise<{ slug: string }>;
}

export default async function LessonPage({ params }: LessonPageProps) {
  const { slug } = await params;
  const { userId } = await auth();
  const { data: lesson } = await sanityFetch({
    query: LESSON_BY_SLUG_QUERY,
    params: { slug },
  });

  if (!lesson) {
    notFound();
  }

  const parentCourse = lesson.courses?.[0];
  const parentModule = parentCourse?.modules?.find((module: any) =>
    module.lessons?.some((item: any) => item._id === lesson._id),
  );
  const moduleIsFree = parentModule?.isFree ?? false;
  const courseId = parentCourse?._id ?? "";
  const canAccess = await canUserAccessLesson(courseId, moduleIsFree);

  if (!canAccess) {
    return <PaywallOverlay courseSlug={parentCourse?.slug?.current ?? "courses"} />;
  }

  return (
    <div className="h-screen overflow-hidden bg-[#050816] text-white">
      <main className="relative z-10 h-full px-4 py-4 sm:px-6 lg:px-8 lg:py-8">
        <div className="mx-auto h-full max-w-[96rem]">
          <LessonPageContent lesson={lesson} userId={userId} />
        </div>
      </main>
    </div>
  );
}
