import { auth } from "@clerk/nextjs/server";
import { notFound } from "next/navigation";
import { CourseHeroSection } from "@/components/courses/CourseHeroSection";
import { CourseModuleList } from "@/components/courses/CourseModuleList";
import { CourseSidebar } from "@/components/courses/CourseSidebar";
import { checkModuleUnlocks, getCPBalance } from "@/lib/actions/cp";
import { getUserCourseAccess } from "@/lib/course-access";
import { sanityFetch } from "@/sanity/lib/live";
import { COURSE_WITH_MODULES_QUERY } from "@/sanity/lib/queries";

export default async function CoursePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { userId } = await auth();

  const { data: course } = await sanityFetch({
    query: COURSE_WITH_MODULES_QUERY,
    params: { slug, userId: userId ?? null },
  });

  if (!course) notFound();

  await getUserCourseAccess(course._id);

  const moduleIds = course.modules?.map((m: any) => m._id) ?? [];

  const [unlockedModules, cpBalance] = await Promise.all([
    moduleIds.length > 0 ? checkModuleUnlocks(moduleIds) : Promise.resolve({}),
    getCPBalance(),
  ]);

  return (
    <div className="dark min-h-screen bg-background text-foreground">
      <CourseHeroSection
        course={course}
        cpBalance={cpBalance}
        unlockedModules={unlockedModules}
        userId={userId}
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <CourseModuleList
              course={course}
              unlockedModules={unlockedModules}
              cpBalance={cpBalance}
              userId={userId}
            />
          </div>

          <div className="lg:col-span-1">
            <CourseSidebar course={course} cpBalance={cpBalance} />
          </div>
        </div>
      </div>
    </div>
  );
}
