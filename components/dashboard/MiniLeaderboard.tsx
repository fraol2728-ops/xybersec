interface MiniLeaderboardProps {
  students: {
    id: string;
    username: string | null;
    xpPoints: number;
  }[];
  currentUsername: string;
}

export function MiniLeaderboard({ students, currentUsername }: MiniLeaderboardProps) {
  return (
    <div className="rounded-2xl border border-border bg-card/80 cyber-elevated p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">🏆 Competitive Zone</h3>
        <a href="/leaderboard" className="text-xs text-primary hover:opacity-80 transition-opacity">View all →</a>
      </div>

      <div className="space-y-2">
        {students.map((student, index) => {
          const isCurrentUser = student.username === currentUsername;
          const medals = ["🥇", "🥈", "🥉"];
          const medal = medals[index] ?? `#${index + 1}`;

          return (
            <div key={student.id} className={`flex items-center justify-between p-2.5 rounded-lg transition-all duration-300 ${isCurrentUser ? "bg-primary/12 border border-primary/40 glow-soft -translate-y-0.5" : "bg-background/85 border border-border hover:-translate-y-0.5 hover:border-primary/25"}`}>
              <div className="flex items-center gap-2.5">
                <span className="text-sm w-6 text-center">{medal}</span>
                <span className={`text-sm font-medium ${isCurrentUser ? "text-primary" : "text-foreground"}`}>@{student.username ?? "anonymous"}</span>
                {isCurrentUser && <span className="text-xs text-primary bg-primary/10 px-1.5 py-0.5 rounded">you</span>}
              </div>
              <span className="mono-cyber text-xs font-bold text-muted-foreground">⚡ {student.xpPoints.toLocaleString()}</span>
            </div>
          );
        })}

        {students.length === 0 && (
          <p className="text-xs text-muted-foreground text-center py-4">Be the first on the leaderboard!</p>
        )}
      </div>
    </div>
  );
}
