interface ProfileCardProps {
  username?: string | null;
  xpPoints: number;
  currentStreak: number;
  userRank: number;
  firstName: string;
  imageUrl?: string;
  level: {
    level: number;
    title: string;
    progressPercent: number;
    xpToNext: number;
    minXP: number;
    maxXP: number;
  };
}

export function ProfileCard({ username, xpPoints, currentStreak, userRank, firstName, imageUrl, level }: ProfileCardProps) {
  return (
    <div className="bg-white/[0.04] backdrop-blur-md border border-white/[0.08] rounded-lg p-4 text-center">
      <div className="relative inline-block mb-3">
        <div className="w-16 h-16 rounded-full border-2 border-primary/50 shadow-lg shadow-primary/20 overflow-hidden bg-background mx-auto">
          {imageUrl ? <img src={imageUrl} alt={firstName} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-2xl bg-muted">👤</div>}
        </div>
        <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-400 border-2 border-background rounded-full" />
      </div>

      <h3 className="font-bold text-foreground mb-0.5">{username ? `@${username}` : firstName}</h3>
      {userRank > 0 && <p className="text-xs text-primary mb-3">🇪🇹 Rank #{userRank} in Ethiopia</p>}

      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary/10 border border-secondary/20 mb-3">
        <span className="text-xs font-bold text-secondary">Lvl {level.level}</span>
        <span className="text-xs text-muted-foreground">{level.title}</span>
      </div>

      <div className="mt-3 p-3 rounded-lg bg-white/[0.04] border border-white/[0.06]">
        <div className="flex justify-between text-xs text-muted-foreground mb-1.5">
          <span>Lvl {level.level} · {level.title}</span>
          <span>{xpPoints}/{level.maxXP} XP</span>
        </div>
        <div className="w-full h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
          <div className="h-full rounded-full bg-gradient-to-r from-primary to-secondary" style={{ width: `${level.progressPercent}%` }} />
        </div>
        <p className="text-xs text-muted-foreground mt-1">{level.xpToNext.toLocaleString()} XP to Level {level.level + 1}</p>
      </div>

      <div className="flex gap-2 justify-center mb-4 mt-3">
        <div className="flex-1 bg-white/[0.04] rounded-lg p-2 border border-white/[0.08]">
          <p className="text-sm font-bold text-primary">{xpPoints.toLocaleString()}</p>
          <p className="text-xs text-muted-foreground">XP</p>
        </div>
        <div className="flex-1 bg-white/[0.04] rounded-lg p-2 border border-white/[0.08]">
          <p className="text-sm font-bold text-orange-400">🔥 {currentStreak}</p>
          <p className="text-xs text-muted-foreground">Streak</p>
        </div>
      </div>

      <a href="/dashboard" className="block w-full py-2 rounded-lg border border-white/[0.08] text-sm text-muted-foreground hover:text-foreground hover:border-primary/50 transition-all">View Profile</a>
    </div>
  );
}
