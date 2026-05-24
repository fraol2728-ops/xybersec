interface AchievementsCardProps {
  lessonsCompleted: number;
  currentStreak: number;
  coursesCompleted: number;
}

export function AchievementsCard({ lessonsCompleted, currentStreak, coursesCompleted }: AchievementsCardProps) {
  const achievements = [
    { id: "first_lesson", icon: "🎯", title: "First Strike", desc: "Complete your first lesson", unlocked: lessonsCompleted >= 1, progress: Math.min(lessonsCompleted, 1), total: 1 },
    { id: "five_lessons", icon: "⚡", title: "On a Roll", desc: "Complete 5 lessons", unlocked: lessonsCompleted >= 5, progress: Math.min(lessonsCompleted, 5), total: 5 },
    { id: "ten_lessons", icon: "🔥", title: "Hacker Mode", desc: "Complete 10 lessons", unlocked: lessonsCompleted >= 10, progress: Math.min(lessonsCompleted, 10), total: 10 },
    { id: "streak_3", icon: "💪", title: "Consistent", desc: "3-day learning streak", unlocked: currentStreak >= 3, progress: Math.min(currentStreak, 3), total: 3 },
    { id: "streak_7", icon: "🏆", title: "Unstoppable", desc: "7-day learning streak", unlocked: currentStreak >= 7, progress: Math.min(currentStreak, 7), total: 7 },
    { id: "first_course", icon: "🎓", title: "Graduate", desc: "Complete a full course", unlocked: coursesCompleted >= 1, progress: Math.min(coursesCompleted, 1), total: 1 },
  ];

  return (
    <div className="bg-white/[0.04] backdrop-blur-md border border-white/[0.08] rounded-lg p-4">
      <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
        🎖️ Achievements
        <span className="text-xs text-muted-foreground font-normal">{achievements.filter((a) => a.unlocked).length}/{achievements.length} unlocked</span>
      </h3>

      <div className="grid grid-cols-3 gap-2">
        {achievements.map((achievement) => (
          <div key={achievement.id} className={`flex flex-col items-center p-3 rounded-xl border text-center transition-all ${achievement.unlocked ? "border-primary/30 bg-primary/5" : "border-white/[0.08] bg-white/[0.04] opacity-60"}`}>
            <span className={`text-xl mb-1 ${achievement.unlocked ? "" : "grayscale opacity-50"}`}>{achievement.icon}</span>
            <p className={`${achievement.unlocked ? "text-foreground" : "text-muted-foreground"} text-xs font-semibold mb-0.5`}>{achievement.title}</p>
            {!achievement.unlocked && (
              <div className="w-full mt-1">
                <div className="w-full h-1 bg-white/[0.06] rounded-full overflow-hidden">
                  <div className="h-full bg-primary/50 rounded-full" style={{ width: `${(achievement.progress / achievement.total) * 100}%` }} />
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">{achievement.progress}/{achievement.total}</p>
              </div>
            )}
            {achievement.unlocked && <span className="text-xs text-primary font-semibold">Unlocked ✓</span>}
          </div>
        ))}
      </div>
    </div>
  );
}
