interface MiniLeaderboardProps {
  students: {
    id: string;
    username: string | null;
    xpPoints: number;
  }[];
  currentUsername: string;
}

export function MiniLeaderboard({ students, currentUsername }: MiniLeaderboardProps) {
  const topFive = students.slice(0, 5);

  return (
    <div className="rounded-2xl border border-border bg-muted p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-xs font-semibold text-foreground flex items-center gap-1.5">🏆 Top Students</h3>
        <a href="/leaderboard" className="text-[11px] text-primary hover:opacity-80 transition-opacity">View all →</a>
      </div>

      <div className="space-y-1.5">
        {topFive.map((student, index) => {
          const isCurrentUser = student.username === currentUsername;
          const medals = ["🥇", "🥈", "🥉"];
          const medal = medals[index] ?? `#${index + 1}`;

          return (
            <div key={student.id} className={`flex items-center justify-between p-2 rounded-lg transition-colors ${isCurrentUser ? "bg-primary/10 border border-primary/20" : "bg-background border border-border"}`}>
              <div className="flex items-center gap-2">
                <span className="text-xs w-5 text-center">{medal}</span>
                <span className={`text-xs font-medium ${isCurrentUser ? "text-primary" : "text-foreground"}`}>@{student.username ?? "anonymous"}</span>
                {isCurrentUser && <span className="text-[10px] text-primary bg-primary/10 px-1.5 py-0.5 rounded">you</span>}
              </div>
              <span className="text-[11px] font-bold text-muted-foreground">⚡ {student.xpPoints.toLocaleString()}</span>
            </div>
          );
        })}

        {topFive.length === 0 && <p className="text-xs text-muted-foreground text-center py-3">Be the first on the leaderboard!</p>}
      </div>
    </div>
  );
}
