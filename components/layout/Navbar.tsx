"use client";

import Image from "next/image";
import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import { Menu, X, Zap } from "lucide-react";
import { usePathname } from "next/navigation";
import { useState } from "react";

interface NavbarProps {
  xpPoints: number;
  currentStreak: number;
  userRank: number;
  levelTitle: string;
  cpBalance: number;
}

const navLinks = [
  { label: "Dashboard", href: "/dashboard", match: (pathname: string) => pathname.startsWith("/dashboard") },
  { label: "Courses", href: "/courses", match: (pathname: string) => pathname.startsWith("/courses") },
  { label: "Leaderboard", href: "/leaderboard", match: (pathname: string) => pathname.startsWith("/leaderboard") },
];

export function Navbar({ xpPoints, currentStreak, userRank, levelTitle, cpBalance }: NavbarProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const linkClasses = (isActive: boolean) =>
    `rounded-lg px-3 py-1.5 text-sm transition-all duration-300 ${
      isActive
        ? "bg-primary/10 text-primary glow-soft border border-primary/20"
        : "text-muted-foreground hover:bg-primary/10 hover:text-primary hover:glow-soft"
    }`;

  return (
    <div className="sticky top-0 left-0 right-0 z-50 h-16 border-b border-border/70 bg-background/90 backdrop-blur-xl cyber-grid-overlay">
      <div className="max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/logo.png" width={28} height={28} alt="XyberSec" />
            <span className="font-bold text-sm text-foreground hidden sm:block">XyberSec</span>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} className={linkClasses(link.match(pathname))}>
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

        <div className="flex items-center gap-2">
          <button
            type="button"
            className="md:hidden p-2 rounded-lg border border-border text-muted-foreground"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
          <UserButton afterSignOutUrl="/" />
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-border/70 bg-background/95 backdrop-blur-xl px-4 py-3 space-y-2">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className={`block ${linkClasses(link.match(pathname))}`} onClick={() => setMobileOpen(false)}>
              {link.label}
            </Link>
          ))}
          <Link
            href="/store"
            className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-primary/10 border border-primary/20"
            onClick={() => setMobileOpen(false)}
          >
            <Zap className="w-3.5 h-3.5 text-primary" />
            <span className="mono-cyber text-xs font-bold text-primary">{cpBalance} CP</span>
          </Link>
        </div>
      )}
    </div>
  );
}
