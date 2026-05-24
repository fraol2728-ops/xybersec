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

  const clerkUserId = user.id;

  const [resolvedUser, dashboardData, { data: courses }] = await Promise.all([
    currentUser(),
    getDashboardData(),
    sanityFetch({ query: DASHBOARD_COURSES_QUERY, params: { userId: clerkUserId } }),
  ]);

  if (!resolvedUser) redirect("/sign-in");

  return (
    <div data-dashboard-page="true" className="dark min-h-screen bg-background text-foreground">
      <DashboardTopBar
        username={dashboardData?.profile.username}
        xpPoints={dashboardData?.profile.xpPoints ?? 0}
        currentStreak={dashboardData?.profile.currentStreak ?? 0}
        userRank={dashboardData?.userRank ?? 0}
        firstName={resolvedUser.firstName ?? ""}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
        <WelcomeBanner
          firstName={resolvedUser.firstName ?? resolvedUser.username ?? "Hacker"}
          username={dashboardData?.profile.username}
          lessonsCompleted={dashboardData?.profile.lessonsCompleted ?? 0}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          <div className="lg:col-span-2 space-y-6">
            <ContinueLearningCard courses={(courses as any[]) ?? []} userId={resolvedUser.id} />
            <StatsRow
              xpPoints={dashboardData?.profile.xpPoints ?? 0}
              currentStreak={dashboardData?.profile.currentStreak ?? 0}
              lessonsCompleted={dashboardData?.profile.lessonsCompleted ?? 0}
              userRank={dashboardData?.userRank ?? 0}
            />
            <MyCoursesSection courses={(courses as any[]) ?? []} userId={resolvedUser.id} />
          </div>

          <div className="space-y-6">
            <ProfileCard
              username={dashboardData?.profile.username}
              xpPoints={dashboardData?.profile.xpPoints ?? 0}
              currentStreak={dashboardData?.profile.currentStreak ?? 0}
              userRank={dashboardData?.userRank ?? 0}
              firstName={resolvedUser.firstName ?? ""}
              imageUrl={resolvedUser.imageUrl}
            />
            <MiniLeaderboard
              students={dashboardData?.leaderboard ?? []}
              currentUserId={dashboardData?.profile.username ?? ""}
            />
            <AchievementsCard
              lessonsCompleted={dashboardData?.profile.lessonsCompleted ?? 0}
              currentStreak={dashboardData?.profile.currentStreak ?? 0}
              coursesCompleted={0}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
