import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getCourseProgressBatch, getDashboardData } from "@/lib/actions/dashboard";
import { sanityFetch } from "@/sanity/lib/live";
import { DASHBOARD_COURSES_QUERY } from "@/sanity/lib/queries";
import { DashboardTopBar } from "@/components/dashboard/DashboardTopBar";
import { WelcomeBanner } from "@/components/dashboard/WelcomeBanner";
import { StatsRow } from "@/components/dashboard/StatsRow";
import { ContinueLearningCard } from "@/components/dashboard/ContinueLearningCard";
import { MyCoursesSection } from "@/components/dashboard/MyCoursesSection";
import { ProfileCard } from "@/components/dashboard/ProfileCard";
import { MiniLeaderboard } from "@/components/dashboard/MiniLeaderboard";
import { AchievementsCard } from "@/components/dashboard/AchievementsCard";
import { WeeklyStreakWidget } from "@/components/dashboard/WeeklyStreakWidget";
import { SkillTracksCard } from "@/components/dashboard/SkillTracksCard";
import { AIDashboardWidget } from "@/components/dashboard/AIDashboardWidget";

export default async function DashboardPage() {
  const user = await currentUser();
  if (!user) redirect("/sign-in");

  const [dashboardData, { data: courses }] = await Promise.all([
    getDashboardData(),
    sanityFetch({ query: DASHBOARD_COURSES_QUERY }),
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

  const activeCourse = normalizedCourses
    .filter((c) => dashboardData?.enrolledCourseIds.includes(c._id) || c.tier === "free")
    .map((c) => ({
      ...c,
      ...courseProgressMap[c._id],
    }))
    .sort((a, b) => (a.progressPercent ?? 0) - (b.progressPercent ?? 0))
    .find((c) => (courseProgressMap[c._id]?.progressPercent ?? 0) < 100);

  return (
    <div className="dark min-h-screen bg-background text-foreground">
      <DashboardTopBar
        username={dashboardData?.username}
        xpPoints={dashboardData?.xpPoints ?? 0}
        currentStreak={dashboardData?.currentStreak ?? 0}
        userRank={dashboardData?.userRank ?? 0}
        levelTitle={dashboardData?.level.title ?? "Rookie"}
        firstName={user.firstName ?? ""}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
        <WelcomeBanner
          firstName={user.firstName ?? "Hacker"}
          username={dashboardData?.username}
          lessonsCompleted={dashboardData?.lessonsCompleted ?? 0}
          currentStreak={dashboardData?.currentStreak ?? 0}
          levelTitle={dashboardData?.level.title ?? "Rookie"}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          <div className="lg:col-span-2 space-y-6">
            <ContinueLearningCard activeCourse={activeCourse ?? null} />

            <StatsRow
              xpPoints={dashboardData?.xpPoints ?? 0}
              currentStreak={dashboardData?.currentStreak ?? 0}
              lessonsCompleted={dashboardData?.lessonsCompleted ?? 0}
              userRank={dashboardData?.userRank ?? 0}
            />

            <SkillTracksCard
              skillProgress={dashboardData?.skillProgress ?? {}}
              learningGoals={dashboardData?.learningGoals ?? []}
            />

            <MyCoursesSection courses={normalizedCourses} courseProgressMap={courseProgressMap} />
          </div>

          <div className="space-y-6">
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

            <AIDashboardWidget />

            <AchievementsCard
              lessonsCompleted={dashboardData?.lessonsCompleted ?? 0}
              currentStreak={dashboardData?.currentStreak ?? 0}
              coursesCompleted={Object.values(courseProgressMap).filter((p) => p.progressPercent >= 100).length}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
