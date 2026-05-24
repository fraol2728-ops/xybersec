interface StatsRowProps {
  xpPoints: number;
  currentStreak: number;
  lessonsCompleted: number;
  userRank: number;
  longestStreak: number;
  certificatesEarned: number;
}

export function StatsRow({ xpPoints, currentStreak, lessonsCompleted, userRank, longestStreak, certificatesEarned }: StatsRowProps) {
  const stats = [
    { icon: "⚡", value: xpPoints.toLocaleString(), label: "Total XP", color: "text-primary" },
    { icon: "🔥", value: `${currentStreak} days`, label: "Current Streak", color: "text-orange-400" },
    { icon: "📚", value: lessonsCompleted.toString(), label: "Lessons Done", color: "text-secondary" },
    { icon: "🏆", value: userRank > 0 ? `#${userRank}` : "—", label: "Ethiopia Rank", color: "text-amber-400" },
    { icon: "💪", value: `${longestStreak} days`, label: "Best Streak", color: "text-foreground" },
    { icon: "🎓", value: certificatesEarned.toString(), label: "Certificates", color: "text-green-400" },
  ];

  return (
    <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
      {stats.map((stat) => (
        <div key={stat.label} className="flex flex-col items-center justify-center p-4 rounded-xl border border-border bg-muted">
          <span className="text-xl mb-1">{stat.icon}</span>
          <p className={`text-lg font-bold ${stat.color}`}>{stat.value}</p>
          <p className="text-xs text-muted-foreground">{stat.label}</p>
        </div>
      ))}
    </div>
  );
}
