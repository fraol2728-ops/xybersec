interface StatsRowProps {
  xpPoints: number;
  currentStreak: number;
  lessonsCompleted: number;
  userRank: number;
}

export function StatsRow({ xpPoints, currentStreak, lessonsCompleted, userRank }: StatsRowProps) {
  const stats = [
    { icon: "⚡", value: xpPoints.toLocaleString(), label: "Total XP", color: "text-primary", bg: "bg-primary/10", border: "border-primary/20" },
    { icon: "🔥", value: `${currentStreak} days`, label: "Current Streak", color: "text-orange-400", bg: "bg-orange-400/10", border: "border-orange-400/20" },
    { icon: "📚", value: lessonsCompleted.toString(), label: "Lessons Done", color: "text-secondary", bg: "bg-secondary/10", border: "border-secondary/20" },
    { icon: "🏆", value: userRank > 0 ? `#${userRank}` : "—", label: "Ethiopia Rank", color: "text-amber-400", bg: "bg-amber-400/10", border: "border-amber-400/20" },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <div key={stat.label} className={`flex flex-col items-center justify-center p-5 rounded-xl border ${stat.border} ${stat.bg} hover:scale-105 transition-transform duration-200 cursor-default`}>
          <span className="text-2xl mb-2">{stat.icon}</span>
          <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
          <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
        </div>
      ))}
    </div>
  );
}
