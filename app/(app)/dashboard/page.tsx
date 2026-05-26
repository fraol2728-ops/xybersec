import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getCourseProgressBatch, getDashboardData } from "@/lib/actions/dashboard";
import { sanityFetch } from "@/sanity/lib/live";
import { DASHBOARD_COURSES_QUERY } from "@/sanity/lib/queries";
import { DashboardTopBar } from "@/components/dashboard/DashboardTopBar";
import { WelcomeBanner } from "@/components/dashboard/WelcomeBanner";
import { ContinueLearningCard } from "@/components/dashboard/ContinueLearningCard";
import { ActiveModuleLessons } from "@/components/dashboard/ActiveModuleLessons";
import { MyCoursesSection } from "@/components/dashboard/MyCoursesSection";
import { ProfileCard } from "@/components/dashboard/ProfileCard";
import { MiniLeaderboard } from "@/components/dashboard/MiniLeaderboard";
import { WeeklyStreakWidget } from "@/components/dashboard/WeeklyStreakWidget";
import { AIFloatingButton } from "@/components/dashboard/AIFloatingButton";
import { getCPBalance, grantWelcomeBonus } from "@/lib/actions/cp";

export default async function DashboardPage() {
  const user = await currentUser();
  if (!user) redirect("/sign-in");
  grantWelcomeBonus().catch(console.error);

  const [dashboardData, { data: courses }, cpBalance] = await Promise.all([
    getDashboardData(),
    sanityFetch({ query: DASHBOARD_COURSES_QUERY }),
    getCPBalance(),
  ]);

  const normalizedCourses = (courses ?? []) as any[];

  const courseProgressMap = dashboardData
    ? await getCourseProgressBatch(
        normalizedCourses.map((c) => ({
          id: c._id,
          totalLessons: c.totalLessons ?? 0,
        })),
      )
    : {};

  const activeCourse = (() => {
    const allCourses = normalizedCourses ?? [];

    if (dashboardData?.activeCourseId) {
      const found = allCourses.find((c: any) => c._id === dashboardData.activeCourseId);
      if (found) {
        const courseLessonIds = found.modules?.flatMap((m: any) => m.lessons ?? []).map((l: any) => l._id) ?? [];
        const completedInCourse = (dashboardData?.completedLessonIds ?? []).filter((id) =>
          courseLessonIds.includes(id),
        ).length;
        const totalLessons = found.totalLessons ?? 0;
        return {
          ...found,
          completedLessons: completedInCourse,
          progressPercent: totalLessons > 0 ? Math.round((completedInCourse / totalLessons) * 100) : 0,
          totalLessons,
        };
      }
    }

    const freeCourse = allCourses.find((c: any) => c.tier === "free");
    if (freeCourse) {
      return {
        ...freeCourse,
        completedLessons: 0,
        progressPercent: 0,
        totalLessons: freeCourse.totalLessons ?? 0,
      };
    }

    return null;
  })();

  return (
    <div className="dark min-h-screen bg-background text-foreground">
      <DashboardTopBar
        username={dashboardData?.username}
        xpPoints={dashboardData?.xpPoints ?? 0}
        currentStreak={dashboardData?.currentStreak ?? 0}
        userRank={dashboardData?.userRank ?? 0}
        levelTitle={dashboardData?.level?.title ?? "Rookie"}
        cpBalance={cpBalance}
        firstName={user.firstName ?? ""}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        <WelcomeBanner
          firstName={user.firstName ?? "Hacker"}
          username={dashboardData?.username}
          lessonsCompleted={dashboardData?.lessonsCompleted ?? 0}
          currentStreak={dashboardData?.currentStreak ?? 0}
          levelTitle={dashboardData?.level?.title ?? "Rookie"}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          <div className="lg:col-span-2 space-y-6">
            <ContinueLearningCard
              activeCourse={activeCourse ?? null}
              completedLessonIds={dashboardData?.completedLessonIds ?? []}
            />

            <ActiveModuleLessons
              activeCourse={activeCourse ?? null}
              completedLessonIds={dashboardData?.completedLessonIds ?? []}
              unlockedModuleIds={dashboardData?.unlockedModuleIds ?? []}
            />

            <MyCoursesSection courses={normalizedCourses} courseProgressMap={courseProgressMap} />
          </div>

          <div className="space-y-5">
            <ProfileCard
              username={dashboardData?.username}
              xpPoints={dashboardData?.xpPoints ?? 0}
              currentStreak={dashboardData?.currentStreak ?? 0}
              userRank={dashboardData?.userRank ?? 0}
              firstName={user.firstName ?? ""}
              imageUrl={user.imageUrl}
              level={
                dashboardData?.level ?? {
                  level: 1,
                  title: "Rookie",
                  progressPercent: 0,
                  xpToNext: 1000,
                  minXP: 0,
                  maxXP: 999,
                }
              }
            />

            <WeeklyStreakWidget
              weeklyActivity={dashboardData?.weeklyActivity ?? {}}
              currentStreak={dashboardData?.currentStreak ?? 0}
              longestStreak={dashboardData?.longestStreak ?? 0}
            />

            <MiniLeaderboard
              students={dashboardData?.leaderboard ?? []}
              currentUsername={dashboardData?.username ?? ""}
            />
          </div>
        </div>
      </main>

      <AIFloatingButton />
    </div>
  );
}
