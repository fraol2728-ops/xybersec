import Link from "next/link";
import Image from "next/image";
import { UserButton } from "@clerk/nextjs";

interface DashboardTopBarProps {
  username?: string | null;
  xpPoints: number;
  currentStreak: number;
  userRank: number;
  firstName: string;
}

export function DashboardTopBar({ xpPoints, currentStreak, userRank }: DashboardTopBarProps) {
  return (
    <div className="fixed top-0 left-0 right-0 z-50 h-16 bg-background/95 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/logo.png" width={28} height={28} alt="XyberSec" />
            <span className="font-bold text-sm text-foreground hidden sm:block">XyberSec</span>
          </Link>
          <nav className="hidden md:flex items-center gap-1">
            {[
              { label: "Dashboard", href: "/dashboard" },
              { label: "Courses", href: "/courses" },
              { label: "Leaderboard", href: "/leaderboard" },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-3 py-1.5 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="hidden sm:flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-muted border border-border">
            <span className="text-sm">⚡</span>
            <span className="text-xs font-bold text-primary">{xpPoints.toLocaleString()} XP</span>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-muted border border-border">
            <span className="text-sm">🔥</span>
            <span className="text-xs font-bold text-foreground">{currentStreak} day streak</span>
          </div>

          {userRank > 0 && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/10 border border-primary/20">
              <span className="text-sm">🇪🇹</span>
              <span className="text-xs font-bold text-primary">#{userRank} Ethiopia</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-3">
          <UserButton afterSignOutUrl="/" />
        </div>
      </div>
    </div>
  );
}
