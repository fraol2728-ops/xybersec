import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { DashboardTopBar } from "@/components/dashboard/DashboardTopBar";
import { WelcomeBanner } from "@/components/dashboard/WelcomeBanner";
import { ContinueLearningCard } from "@/components/dashboard/ContinueLearningCard";
import { StatsRow } from "@/components/dashboard/StatsRow";
import { MyCoursesSection } from "@/components/dashboard/MyCoursesSection";
import { ProfileCard } from "@/components/dashboard/ProfileCard";
import { MiniLeaderboard } from "@/components/dashboard/MiniLeaderboard";
import { AchievementsCard } from "@/components/dashboard/AchievementsCard";
import { getDashboardData } from "@/lib/actions/dashboard";
import { sanityFetch } from "@/sanity/lib/live";
import { DASHBOARD_COURSES_QUERY } from "@/sanity/lib/queries";

export default async function DashboardPage() {
  const user = await currentUser();
  if (!user) redirect("/sign-in");

  const [dashboardData, { data: courses }] = await Promise.all([
    getDashboardData(),
    sanityFetch({ query: DASHBOARD_COURSES_QUERY, params: { userId: user.id } }),
  ]);

  const coursesWithProgress = (courses ?? [])
    .map((course: any) => {
      const allLessons = (course.modules ?? []).flatMap((m: any) => m.lessons ?? []);
      const totalLessons = allLessons.length;
      const completedLessons = allLessons.filter((lesson: any) => lesson.completedBy?.includes(user.id)).length;
      const progress = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;
      const nextLesson = allLessons.find((lesson: any) => !lesson.completedBy?.includes(user.id));
      const firstLesson = course.modules?.[0]?.lessons?.[0];

      return {
        ...course,
        totalLessons,
        completedLessons,
        progress,
        nextLessonSlug: nextLesson?.slug ?? firstLesson?.slug ?? null,
        nextLessonTitle: nextLesson?.title ?? firstLesson?.title ?? null,
        continueHref: nextLesson?.slug ? `/lessons/${nextLesson.slug}` : `/courses/${course.slug}`,
        isEnrolled: dashboardData?.profile.enrolledCourseIds.includes(course._id) ?? course.tier === "free",
      };
    })
    .filter((c: any) => c.isEnrolled || c.tier === "free");

  const activeCourse = coursesWithProgress.find((c: any) => c.progress < 100) ?? coursesWithProgress[0] ?? null;

  return (
    <div className="dark min-h-screen bg-background text-foreground">
      <DashboardTopBar
        username={dashboardData?.profile.username}
        xpPoints={dashboardData?.profile.xpPoints ?? 0}
        currentStreak={dashboardData?.profile.currentStreak ?? 0}
        userRank={dashboardData?.userRank ?? 0}
        firstName={user.firstName ?? ""}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
        <WelcomeBanner
          firstName={user.firstName ?? user.username ?? "Hacker"}
          username={dashboardData?.profile.username}
          lessonsCompleted={dashboardData?.profile.lessonsCompleted ?? 0}
          streakStatus={dashboardData?.streakStatus}
          xpPoints={dashboardData?.profile.xpPoints ?? 0}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          <div className="lg:col-span-2 space-y-6">
            <ContinueLearningCard course={activeCourse} />
            <StatsRow
              xpPoints={dashboardData?.profile.xpPoints ?? 0}
              currentStreak={dashboardData?.profile.currentStreak ?? 0}
              lessonsCompleted={dashboardData?.profile.lessonsCompleted ?? 0}
              userRank={dashboardData?.userRank ?? 0}
              longestStreak={dashboardData?.profile.longestStreak ?? 0}
              certificatesEarned={dashboardData?.profile.certificatesEarned ?? 0}
            />
            <MyCoursesSection courses={coursesWithProgress} />
          </div>

          <div className="space-y-6">
            <ProfileCard
              username={dashboardData?.profile.username}
              xpPoints={dashboardData?.profile.xpPoints ?? 0}
              currentStreak={dashboardData?.profile.currentStreak ?? 0}
              longestStreak={dashboardData?.profile.longestStreak ?? 0}
              userRank={dashboardData?.userRank ?? 0}
              firstName={user.firstName ?? ""}
              imageUrl={user.imageUrl}
              lessonsCompleted={dashboardData?.profile.lessonsCompleted ?? 0}
              certificatesEarned={dashboardData?.profile.certificatesEarned ?? 0}
            />
            <MiniLeaderboard students={dashboardData?.leaderboard ?? []} currentUsername={dashboardData?.profile.username ?? ""} />
            <AchievementsCard
              lessonsCompleted={dashboardData?.profile.lessonsCompleted ?? 0}
              currentStreak={dashboardData?.profile.currentStreak ?? 0}
              coursesCompleted={dashboardData?.profile.certificatesEarned ?? 0}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
