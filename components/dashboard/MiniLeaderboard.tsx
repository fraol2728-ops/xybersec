interface MiniLeaderboardProps {
  students: {
    id: string;
    username: string | null;
    xpPoints: number;
    currentStreak: number;
  }[];
  currentUsername: string;
}

export function MiniLeaderboard({ students, currentUsername }: MiniLeaderboardProps) {
  const hasActivity = students.some((s) => s.xpPoints > 0);

  if (!hasActivity) {
    return (
      <div className="rounded-2xl border border-border bg-muted p-5">
        <h3 className="text-sm font-semibold text-foreground mb-2">🏆 Top Students</h3>
        <p className="text-xs text-muted-foreground">You haven't earned XP yet</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-border bg-muted p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-foreground">🏆 Top Students</h3>
        <a href="/leaderboard" className="text-xs text-primary">View all →</a>
      </div>
      <div className="space-y-2">
        {students.map((student, index) => {
          const isCurrentUser = student.username === currentUsername;
          return (
            <div key={student.id} className={`flex items-center justify-between p-2.5 rounded-lg ${isCurrentUser ? "bg-primary/10 border border-primary/20" : "bg-background border border-border"}`}>
              <div className="flex items-center gap-2">
                <span className="text-sm">#{index + 1}</span>
                <span className={`text-sm ${isCurrentUser ? "text-primary font-semibold" : "text-foreground"}`}>@{student.username ?? "anonymous"}</span>
                <span className="text-xs text-orange-400">🔥{student.currentStreak}</span>
              </div>
              <span className="text-xs font-bold text-muted-foreground">⚡ {student.xpPoints.toLocaleString()}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
