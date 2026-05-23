import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Achievements } from "@/components/dashboard/Achievements";
import { ContinueLearning } from "@/components/dashboard/ContinueLearning";
import { CourseProgressCard } from "@/components/dashboard/CourseProgressCard";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { getUserTier } from "@/lib/course-access";
import { sanityFetch } from "@/sanity/lib/live";
import { DASHBOARD_COURSES_QUERY } from "@/sanity/lib/queries";
import type { DASHBOARD_COURSES_QUERYResult } from "@/sanity.types";

export default async function DashboardPage() {
  const user = await currentUser();

  if (!user) {
    redirect("/");
  }

  // Backfill Clerk metadata if onboarding is complete in DB
  // but not in session claims. This fixes stale claims silently.
  const clerkComplete =
    (user.publicMetadata as {
      onboardingComplete?: boolean;
    })?.onboardingComplete;

  if (!clerkComplete) {
    const { prisma } = await import("@/lib/prisma");
    const profile = await prisma.userProfile.findUnique({
      where: { clerkId: user.id },
      select: { onboardingComplete: true },
    });

    if (profile?.onboardingComplete) {
      import("@clerk/nextjs/server")
        .then(({ clerkClient }) => clerkClient())
        .then((client) =>
          client.users.updateUserMetadata(user.id, {
            publicMetadata: {
              ...user.publicMetadata,
              onboardingComplete: true,
            },
          }),
        )
        .catch(console.error);
    }
  }

  const [{ data: courses }, userTier] = await Promise.all([
    sanityFetch({
      query: DASHBOARD_COURSES_QUERY,
      params: { userId: user.id },
    }),
    getUserTier(),
  ]);

  const firstName = user.firstName ?? user.username ?? "Operator";

  const dashboardCourses = courses as DASHBOARD_COURSES_QUERYResult;

  const courseProgress = dashboardCourses.map((course) => {
    const lessons = (course.modules ?? []).flatMap(
      (module) => module.lessons ?? [],
    );
    const totalLessons = lessons.length;
    const completedLessons = lessons.filter((lesson) =>
      lesson.completedBy?.includes(user.id),
    ).length;
    const progress =
      totalLessons > 0
        ? Math.round((completedLessons / totalLessons) * 100)
        : 0;
    return {
      id: course._id,
      title: course.title ?? "Untitled Course",
      progress,
      courseHref: `/courses/${course.slug?.current ?? ""}`,
      nextLessonTitle:
        progress < 100 ? "Continue your next mission" : "Final review",
      lessonHref: `/courses/${course.slug?.current ?? ""}`,
    };
  });

  const activeCourse =
    courseProgress.find((course) => course.progress < 100) ?? courseProgress[0];

  return (
    <div className="min-h-screen bg-[#05080f] text-white">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(34,211,238,0.12),transparent_35%),radial-gradient(circle_at_80%_0%,rgba(59,130,246,0.1),transparent_35%)]" />
      <div className="relative mx-auto flex max-w-[1400px]">
        <DashboardSidebar />

        <main className="w-full px-5 pb-10 pt-24 lg:px-10 lg:pt-10">
          <section className="mb-8 rounded-2xl border border-cyan-500/20 bg-[#070d18]/80 p-6">
            <p className="text-sm uppercase tracking-[0.2em] text-cyan-400">
              Welcome back, {firstName}
            </p>
            <h1 className="mt-2 text-3xl font-bold text-white">
              Continue your cybersecurity training
            </h1>
            <p className="mt-2 text-zinc-400">
              Current access:{" "}
              <span className="capitalize text-cyan-300">{userTier}</span>
            </p>
          </section>

          <div className="space-y-8">
            {activeCourse && (
              <ContinueLearning
                title={activeCourse.title}
                lessonTitle={activeCourse.nextLessonTitle}
                progress={activeCourse.progress}
                resumeHref={activeCourse.lessonHref}
              />
            )}

            <section>
              <h3 className="mb-4 text-xl font-semibold text-white">
                My Courses
              </h3>
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {courseProgress.map((course, index) => (
                  <CourseProgressCard
                    key={course.id}
                    title={course.title}
                    progress={course.progress}
                    href={course.courseHref}
                    index={index}
                  />
                ))}
              </div>
            </section>

            <Achievements />
          </div>
        </main>
      </div>
    </div>
  );
}
