interface StatsRowProps {
  xpPoints: number;
  currentStreak: number;
  lessonsCompleted: number;
  userRank: number;
}

const baseCardClass =
  "relative flex flex-col items-center justify-center p-5 rounded-2xl backdrop-blur-md border transition-all duration-300 hover:scale-105 hover:shadow-2xl";

export function StatsRow({ xpPoints, currentStreak, lessonsCompleted, userRank }: StatsRowProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
      <div className={`${baseCardClass} bg-primary/10 border-primary/30 hover:shadow-primary/20`}>
        <div className="absolute inset-0 rounded-2xl bg-primary/5 blur-xl -z-10 pointer-events-none" />
        <span className="text-2xl mb-1">⚡</span>
        <p className="text-3xl font-black text-primary drop-shadow-[0_0_12px_rgb(34,211,238,0.6)]">{xpPoints.toLocaleString()}</p>
        <p className="text-xs text-muted-foreground mt-1">Total XP</p>
      </div>

      <div className={`${baseCardClass} bg-orange-500/10 border-orange-500/30 hover:shadow-orange-500/25`}>
        <div className="absolute inset-0 rounded-2xl bg-orange-500/10 blur-xl -z-10 animate-pulse pointer-events-none" />
        {currentStreak >= 7 && (
          <span className="absolute -top-2 -right-2 text-xs font-black px-2 py-0.5 rounded-full bg-orange-500 text-white animate-bounce">
            HOT
          </span>
        )}
        <p className="text-3xl font-black text-orange-400 drop-shadow-[0_0_16px_rgba(249,115,22,0.7)]">🔥 {currentStreak}</p>
        <p className="text-xs text-muted-foreground mt-1">Day Streak</p>
      </div>

      <div className={`${baseCardClass} bg-secondary/10 border-secondary/30 hover:shadow-secondary/20`}>
        <div className="absolute inset-0 rounded-2xl bg-secondary/5 blur-xl -z-10 pointer-events-none" />
        <span className="text-2xl mb-1">📚</span>
        <p className="text-3xl font-black text-secondary drop-shadow-[0_0_12px_rgba(129,140,248,0.6)]">{lessonsCompleted}</p>
        <p className="text-xs text-muted-foreground mt-1">Lessons Done</p>
      </div>

      <div className={`${baseCardClass} bg-amber-500/10 border-amber-500/30 hover:shadow-amber-500/20`}>
        <div className="absolute inset-0 rounded-2xl bg-amber-500/5 blur-xl -z-10 pointer-events-none" />
        <span className="text-2xl mb-1">🏆</span>
        <p className="text-3xl font-black text-amber-400 drop-shadow-[0_0_12px_rgba(245,158,11,0.6)]">{userRank > 0 ? `#${userRank}` : "—"}</p>
        <p className="text-xs text-muted-foreground mt-1">🇪🇹 Ethiopia</p>
      </div>
    </div>
  );
}
