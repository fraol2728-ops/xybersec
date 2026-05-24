interface ProfileCardProps {
  username?: string | null;
  xpPoints: number;
  currentStreak: number;
  longestStreak: number;
  userRank: number;
  firstName: string;
  imageUrl?: string;
  lessonsCompleted: number;
  certificatesEarned: number;
}

export function ProfileCard({ username, xpPoints, currentStreak, userRank, firstName, imageUrl, lessonsCompleted, certificatesEarned }: ProfileCardProps) {
  return (
    <div className="rounded-2xl border border-border bg-muted p-5 text-center">
      <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-primary/50 bg-background mx-auto mb-3">
        {imageUrl ? <img src={imageUrl} alt={firstName} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-2xl bg-muted">👤</div>}
      </div>
      <h3 className="font-bold text-foreground mb-0.5">{username ? `@${username}` : firstName}</h3>
      <p className="text-xs text-primary mb-3">Rank #{userRank} in Ethiopia 🇪🇹</p>

      <div className="flex gap-2 justify-center mb-2">
        <div className="flex-1 bg-background rounded-lg p-2 border border-border">
          <p className="text-sm font-bold text-primary">{xpPoints.toLocaleString()}</p>
          <p className="text-xs text-muted-foreground">XP</p>
        </div>
        <div className="flex-1 bg-background rounded-lg p-2 border border-border">
          <p className="text-sm font-bold text-orange-400">🔥 {currentStreak}</p>
          <p className="text-xs text-muted-foreground">Streak</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 mt-3">
        <div className="bg-background rounded-lg p-2 border border-border text-center">
          <p className="text-sm font-bold text-secondary">{lessonsCompleted}</p>
          <p className="text-xs text-muted-foreground">Lessons</p>
        </div>
        <div className="bg-background rounded-lg p-2 border border-border text-center">
          <p className="text-sm font-bold text-green-400">{certificatesEarned}</p>
          <p className="text-xs text-muted-foreground">Certs</p>
        </div>
      </div>
    </div>
  );
}
