import { TrendingUp } from "lucide-react";

interface StatsRowProps {
  xpPoints: number;
  currentStreak: number;
  lessonsCompleted: number;
  userRank: number;
}

const baseCardClass =
  "relative overflow-hidden rounded-2xl border border-border/70 bg-card/70 p-5 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:glow-soft";

export function StatsRow({ xpPoints, currentStreak, lessonsCompleted, userRank }: StatsRowProps) {
  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between border-b border-border/60 pb-2">
        <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-primary/90">Operational Metrics</h3>
        <span className="mono-cyber text-xs text-muted-foreground">LIVE • REFRESH 5s</span>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className={baseCardClass}>
          <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">XP Throughput</p>
          <p className="mono-cyber mt-2 text-3xl font-bold text-primary">{xpPoints.toLocaleString()}</p>
          <div className="mt-3 flex items-center gap-1 text-[11px] text-primary/80"><TrendingUp className="h-3.5 w-3.5" />+12.4% this week</div>
        </div>

        <div className={baseCardClass}>
          <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">Streak Integrity</p>
          <p className="mono-cyber mt-2 text-3xl font-bold text-orange-300">{currentStreak}d</p>
          <p className="mt-3 text-[11px] text-muted-foreground">Maintain daily activity to keep bonus multipliers.</p>
        </div>

        <div className={baseCardClass}>
          <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">Completed Lessons</p>
          <p className="mono-cyber mt-2 text-3xl font-bold text-secondary">{lessonsCompleted}</p>
          <p className="mt-3 text-[11px] text-muted-foreground">Pipeline progress across all active modules.</p>
        </div>

        <div className={baseCardClass}>
          <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">Regional Rank</p>
          <p className="mono-cyber mt-2 text-3xl font-bold text-amber-300">{userRank > 0 ? `#${userRank}` : "—"}</p>
          <p className="mt-3 text-[11px] text-muted-foreground">Leaderboard: Ethiopia shard.</p>
        </div>
      </div>
    </section>
  );
}
