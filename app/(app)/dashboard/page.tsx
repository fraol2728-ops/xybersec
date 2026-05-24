import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getCourseProgressBatch, getDashboardData } from "@/lib/actions/dashboard";
import { sanityFetch } from "@/sanity/lib/live";
import { DASHBOARD_COURSES_QUERY } from "@/sanity/lib/queries";
import { DashboardTopBar } from "@/components/dashboard/DashboardTopBar";
import { WelcomeStatsRow } from "@/components/dashboard/WelcomeStatsRow";
import { ContinueLearningCard } from "@/components/dashboard/ContinueLearningCard";
import { MyCoursesSection } from "@/components/dashboard/MyCoursesSection";
import { PopularCoursesSection } from "@/components/dashboard/PopularCoursesSection";
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

  const startedCourses = (normalizedCourses ?? []).filter(
    (c) => (courseProgressMap[c._id]?.completedLessons ?? 0) > 0,
  );

  const notStartedCourses = (normalizedCourses ?? [])
    .filter((c) => (courseProgressMap[c._id]?.completedLessons ?? 0) === 0)
    .slice(0, 6);

  const activeCourse =
    startedCourses
      .map((c) => ({
        ...c,
        ...courseProgressMap[c._id],
      }))
      .find((c) => (courseProgressMap[c._id]?.progressPercent ?? 0) < 100) ?? null;

  return (
    <div className="dark min-h-screen bg-[#080C14] text-foreground">
      <DashboardTopBar
        username={dashboardData?.username}
        xpPoints={dashboardData?.xpPoints ?? 0}
        currentStreak={dashboardData?.currentStreak ?? 0}
        userRank={dashboardData?.userRank ?? 0}
        levelTitle={dashboardData?.level.title ?? "Rookie"}
        firstName={user.firstName ?? ""}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-12">
        <WelcomeStatsRow
          firstName={user.firstName ?? "Hacker"}
          username={dashboardData?.username}
          xpPoints={dashboardData?.xpPoints ?? 0}
          currentStreak={dashboardData?.currentStreak ?? 0}
          lessonsCompleted={dashboardData?.lessonsCompleted ?? 0}
          userRank={dashboardData?.userRank ?? 0}
          levelTitle={dashboardData?.level.title ?? "Rookie"}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mt-5">
          <div className="lg:col-span-2 flex flex-col gap-5">
            <ContinueLearningCard activeCourse={activeCourse} />
            <MyCoursesSection courses={startedCourses} courseProgressMap={courseProgressMap} />
            <PopularCoursesSection courses={notStartedCourses} />
          </div>

          <div className="flex flex-col gap-4">
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

            <SkillTracksCard
              skillProgress={dashboardData?.skillProgress ?? {}}
              learningGoals={dashboardData?.learningGoals ?? []}
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
