import { currentUser } from "@clerk/nextjs/server";
import { BookOpen } from "lucide-react";
import { redirect } from "next/navigation";
import { MyCoursesGrid } from "@/components/dashboard/MyCoursesGrid";
import { sanityFetch } from "@/sanity/lib/live";
import { DASHBOARD_COURSES_QUERY } from "@/sanity/lib/queries";
import type { DASHBOARD_COURSES_QUERYResult } from "@/sanity.types";

export default async function MyCoursesPage() {
  const user = await currentUser();

  if (!user) {
    redirect("/");
  }

  const { data: courses } = (await sanityFetch({
    query: DASHBOARD_COURSES_QUERY,
    params: { userId: user.id },
  })) as { data: DASHBOARD_COURSES_QUERYResult };

  // Calculate completion for each course and filter to started ones
  type Course = (typeof courses)[number];
  type CourseWithProgress = Course & {
    totalLessons: number;
    completedLessons: number;
  };

  const startedCourses = courses.reduce<CourseWithProgress[]>((acc, course) => {
    const { total, completed } = (course.modules ?? []).reduce(
      (stats, m) =>
        (m.lessons ?? []).reduce(
          (s, l) => ({
            total: s.total + 1,
            completed: s.completed + (l.completedBy?.includes(user.id) ? 1 : 0),
          }),
          stats,
        ),
      { total: 0, completed: 0 },
    );

    if (completed > 0) {
      acc.push({ ...course, totalLessons: total, completedLessons: completed });
    }
    return acc;
  }, []);

  const dashboardCourses = startedCourses.map((course) => {
    const estimatedHours = Math.max(1, Math.ceil(course.totalLessons / 3));

    return {
      id: course._id,
      title: course.title ?? "Untitled Course",
      description: course.description,
      thumbnailUrl: course.thumbnail?.asset?.url,
      lessonCount: course.totalLessons,
      completedLessons: course.completedLessons,
      href: `/courses/${course.slug?.current ?? ""}`,
      level: course.tier
        ? `${course.tier.charAt(0).toUpperCase()}${course.tier.slice(1).toLowerCase()}`
        : null,
      category: course.category?.title ?? null,
      estimatedTime: `${estimatedHours} ${estimatedHours === 1 ? "hour" : "hours"}`,
    };
  });

  return (
    <div className="min-h-screen bg-[#09090b] text-white overflow-hidden">
      {/* Animated gradient mesh background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-violet-600/15 rounded-full blur-[120px] animate-pulse" />
        <div
          className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-fuchsia-600/10 rounded-full blur-[100px] animate-pulse"
          style={{ animationDelay: "1s" }}
        />
        <div
          className="absolute top-[40%] right-[20%] w-[400px] h-[400px] bg-cyan-500/10 rounded-full blur-[80px] animate-pulse"
          style={{ animationDelay: "2s" }}
        />
      </div>

      {/* Noise texture overlay */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.015]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Navigation */}

      {/* Main Content */}
      <main className="relative z-10 px-6 lg:px-12 py-12 max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">My Courses</h1>
          <p className="text-zinc-400">
            Courses you&apos;ve started learning. Pick up where you left off.
          </p>
        </div>

        {dashboardCourses.length > 0 ? (
          <MyCoursesGrid courses={dashboardCourses} />
        ) : (
          <div className="text-center py-16">
            <div className="w-16 h-16 rounded-2xl bg-zinc-800/50 flex items-center justify-center mx-auto mb-4">
              <BookOpen className="w-8 h-8 text-zinc-500" />
            </div>
            <h3 className="text-xl font-semibold mb-2">
              No courses started yet
            </h3>
            <p className="text-zinc-400 max-w-md mx-auto">
              Browse our course catalog and start learning. Your progress will
              appear here once you complete your first lesson.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
