interface WelcomeStatsRowProps {
  firstName: string;
  username?: string | null;
  xpPoints: number;
  currentStreak: number;
  lessonsCompleted: number;
  userRank: number;
  levelTitle: string;
}

export function WelcomeStatsRow({
  firstName,
  username,
  xpPoints,
  currentStreak,
  lessonsCompleted,
  userRank,
  levelTitle,
}: WelcomeStatsRowProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-6">
      <div>
        <p className="text-xs font-semibold text-primary tracking-wider uppercase mb-0.5">Welcome back</p>
        <h1 className="text-2xl font-bold text-foreground">{username ? `@${username}` : firstName} 👋</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          {currentStreak > 0
            ? `🔥 ${currentStreak}-day streak · ${levelTitle}`
            : `Let's start a streak today · ${levelTitle}`}
        </p>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        <div className="flex flex-col items-center px-4 py-2.5 rounded-lg bg-cyan-400/[0.08] border border-cyan-400/20 backdrop-blur-md min-w-[64px]">
          <span className="text-lg">⚡</span>
          <p className="text-base font-bold text-cyan-400 leading-none">{xpPoints.toLocaleString()}</p>
          <p className="text-xs text-muted-foreground">XP</p>
        </div>

        <div className="flex flex-col items-center px-4 py-2.5 rounded-lg bg-orange-400/[0.08] border border-orange-400/20 backdrop-blur-md min-w-[64px]">
          <span className="text-lg">🔥</span>
          <p className="text-base font-bold text-orange-400 leading-none">{currentStreak}</p>
          <p className="text-xs text-muted-foreground">Streak</p>
        </div>

        <div className="flex flex-col items-center px-4 py-2.5 rounded-lg bg-purple-400/[0.08] border border-purple-400/20 backdrop-blur-md min-w-[64px]">
          <span className="text-lg">📚</span>
          <p className="text-base font-bold text-purple-400 leading-none">{lessonsCompleted}</p>
          <p className="text-xs text-muted-foreground">Lessons</p>
        </div>

        <div className="flex flex-col items-center px-4 py-2.5 rounded-lg bg-amber-400/[0.08] border border-amber-400/20 backdrop-blur-md min-w-[64px]">
          <span className="text-lg">🇪🇹</span>
          <p className="text-base font-bold text-amber-400 leading-none">{userRank > 0 ? `#${userRank}` : "—"}</p>
          <p className="text-xs text-muted-foreground">Rank</p>
        </div>
      </div>
    </div>
  );
}
