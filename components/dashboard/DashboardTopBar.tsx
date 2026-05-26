import Link from "next/link";
import Image from "next/image";
import { UserButton } from "@clerk/nextjs";
import { Zap } from "lucide-react";

interface DashboardTopBarProps {
  username?: string | null;
  xpPoints: number;
  currentStreak: number;
  userRank: number;
  firstName: string;
  levelTitle: string;
  cpBalance: number;
}

export function DashboardTopBar({ xpPoints, currentStreak, userRank, levelTitle, cpBalance }: DashboardTopBarProps) {
  return (
    <div className="fixed top-0 left-0 right-0 z-50 h-16 border-b border-border/70 bg-background/90 backdrop-blur-xl cyber-grid-overlay">
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
                className="rounded-lg px-3 py-1.5 text-sm text-muted-foreground transition-all duration-300 hover:bg-primary/10 hover:text-primary hover:glow-soft"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="hidden sm:flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-muted border border-border">
            <span className="text-sm">⚡</span>
            <span className="mono-cyber text-xs font-bold text-primary">{xpPoints.toLocaleString()} XP</span>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-muted border border-border">
            <span className="text-sm">🔥</span>
            <span className="text-xs font-bold text-foreground">{currentStreak} day streak</span>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-secondary/10 border border-secondary/20">
            <span className="text-xs font-bold text-secondary">{levelTitle}</span>
          </div>
          <Link
            href="/store"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/10 border border-primary/20 hover:bg-primary/20 transition-colors"
          >
            <Zap className="w-3.5 h-3.5 text-primary" />
            <span className="mono-cyber text-xs font-bold text-primary">{cpBalance} CP</span>
          </Link>

          {userRank > 0 && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/10 border border-primary/20">
              <span className="text-sm">🇪🇹</span>
              <span className="mono-cyber text-xs font-bold text-primary">#{userRank} Ethiopia</span>
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
