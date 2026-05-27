import { Flame, ShieldCheck, TrendingUp, Trophy, Zap } from "lucide-react";

interface StatsRowProps {
  xpPoints: number;
  currentStreak: number;
  lessonsCompleted: number;
  userRank: number;
}

const baseCardClass =
  "group relative overflow-hidden rounded-2xl border border-cyan-200/15 bg-slate-900/35 p-5 backdrop-blur-lg cyber-elevated transition-all duration-300 hover:-translate-y-1.5 hover:border-cyan-300/35 hover:glow-soft";

const iconWrapClass =
  "metric-icon-glow flex h-11 w-11 items-center justify-center rounded-xl border border-cyan-200/20 bg-cyan-400/10 text-primary transition-all duration-300 group-hover:metric-icon-glow-boost";

const valueClass = "mono-cyber mt-2 text-[2.6rem] font-black leading-none text-white glow-pulse";

export function StatsRow({ xpPoints, currentStreak, lessonsCompleted, userRank }: StatsRowProps) {
  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between border-b border-border/60 pb-2">
        <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-primary/90">Operational Metrics</h3>
        <span className="mono-cyber text-xs text-muted-foreground">LIVE • REFRESH 5s</span>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className={baseCardClass}>
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-cyan-300/10 via-transparent to-blue-500/5 opacity-70 transition-opacity duration-300 group-hover:opacity-100" />
          <div className="flex items-center justify-between">
            <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">XP Throughput</p>
            <span className={iconWrapClass}><Zap className="metric-icon-float h-6 w-6 text-cyan-200" /></span>
          </div>
          <p className={valueClass}>{xpPoints.toLocaleString()}</p>
          <div className="mt-3 flex items-center gap-1 text-[11px] text-primary/85"><TrendingUp className="h-3.5 w-3.5" />+12.4% this week</div>
        </div>

        <div className={baseCardClass}>
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-cyan-300/10 via-transparent to-blue-500/5 opacity-70 transition-opacity duration-300 group-hover:opacity-100" />
          <div className="flex items-center justify-between">
            <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">Streak Integrity</p>
            <span className={iconWrapClass}><Flame className="metric-icon-float h-6 w-6 text-cyan-200" /></span>
          </div>
          <p className={valueClass}>{currentStreak}d</p>
          <p className="mt-3 text-[11px] text-muted-foreground">Maintain daily activity to keep bonus multipliers.</p>
        </div>

        <div className={baseCardClass}>
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-cyan-300/10 via-transparent to-blue-500/5 opacity-70 transition-opacity duration-300 group-hover:opacity-100" />
          <div className="flex items-center justify-between">
            <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">Completed Lessons</p>
            <span className={iconWrapClass}><ShieldCheck className="metric-icon-float h-6 w-6 text-cyan-200" /></span>
          </div>
          <p className={valueClass}>{lessonsCompleted}</p>
          <p className="mt-3 text-[11px] text-muted-foreground">Pipeline progress across all active modules.</p>
        </div>

        <div className={baseCardClass}>
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-cyan-300/10 via-transparent to-blue-500/5 opacity-70 transition-opacity duration-300 group-hover:opacity-100" />
          <div className="flex items-center justify-between">
            <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">Regional Rank</p>
            <span className={iconWrapClass}><Trophy className="metric-icon-float h-6 w-6 text-cyan-200" /></span>
          </div>
          <p className={valueClass}>{userRank > 0 ? `#${userRank}` : "—"}</p>
          <p className="mt-3 text-[11px] text-muted-foreground">Leaderboard: Ethiopia shard.</p>
        </div>
      </div>
    </section>
  );
}
