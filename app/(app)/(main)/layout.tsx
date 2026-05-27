import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { getCPBalance } from "@/lib/actions/cp";
import { getDashboardData } from "@/lib/actions/dashboard";

export default async function MainLayout({ children }: { children: React.ReactNode }) {
  const user = await currentUser();
  if (!user) redirect("/sign-in");

  const [dashboardData, cpBalance] = await Promise.all([getDashboardData(), getCPBalance()]);

  return (
    <div data-main-layout="true" className="dark cyber-command-shell min-h-screen bg-background text-foreground">
      <Navbar
        xpPoints={dashboardData?.xpPoints ?? 0}
        currentStreak={dashboardData?.currentStreak ?? 0}
        userRank={dashboardData?.userRank ?? 0}
        levelTitle={dashboardData?.level.title ?? "Rookie"}
        cpBalance={cpBalance}
      />
      <div className="pt-8">{children}</div>
    </div>
  );
}
