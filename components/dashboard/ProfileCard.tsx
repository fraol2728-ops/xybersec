interface ProfileCardProps {
  username?: string | null;
  xpPoints: number;
  currentStreak: number;
  userRank: number;
  firstName: string;
  imageUrl?: string;
}

export function ProfileCard({ username, xpPoints, currentStreak, userRank, firstName, imageUrl }: ProfileCardProps) {
  return (
    <div className="rounded-2xl border border-border bg-muted p-5 text-center">
      <div className="relative inline-block mb-3">
        <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-primary/50 bg-background mx-auto">
          {imageUrl ? <img src={imageUrl} alt={firstName} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-2xl bg-muted">👤</div>}
        </div>
        <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-400 border-2 border-background rounded-full" />
      </div>

      <h3 className="font-bold text-foreground mb-0.5">{username ? `@${username}` : firstName}</h3>
      {userRank > 0 && <p className="text-xs text-primary mb-3">🇪🇹 Rank #{userRank} in Ethiopia</p>}

      <div className="flex gap-2 justify-center mb-4">
        <div className="flex-1 bg-background rounded-lg p-2 border border-border">
          <p className="text-sm font-bold text-primary">{xpPoints.toLocaleString()}</p>
          <p className="text-xs text-muted-foreground">XP</p>
        </div>
        <div className="flex-1 bg-background rounded-lg p-2 border border-border">
          <p className="text-sm font-bold text-orange-400">🔥 {currentStreak}</p>
          <p className="text-xs text-muted-foreground">Streak</p>
        </div>
      </div>

      <a href="/dashboard" className="block w-full py-2 rounded-lg border border-border text-sm text-muted-foreground hover:text-foreground hover:border-primary/50 transition-all">View Profile</a>
    </div>
  );
}
