"use client";

interface WeeklyStreakWidgetProps {
  weeklyActivity: Record<string, boolean>;
  currentStreak: number;
  longestStreak: number;
}

const DAY_LABELS = ["S", "M", "T", "W", "T", "F", "S"];

export function WeeklyStreakWidget({ weeklyActivity, currentStreak, longestStreak }: WeeklyStreakWidgetProps) {
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    const dateStr = date.toISOString().split("T")[0];
    const dayOfWeek = date.getDay();

    return {
      dateStr,
      label: DAY_LABELS[dayOfWeek],
      active: weeklyActivity[dateStr] ?? false,
      isToday: i === 6,
    };
  });

  return (
    <div className="rounded-2xl border border-border bg-muted p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">🔥 Weekly Streak</h3>
        <span className="text-xs font-bold text-orange-400">
          {currentStreak} day{currentStreak !== 1 ? "s" : ""}
        </span>
      </div>

      <div className="grid grid-cols-7 gap-1.5 mb-3">
        {last7Days.map((day, i) => (
          <div key={i} className="flex flex-col items-center gap-1">
            <div
              className={`w-full aspect-square rounded-md transition-all duration-200 ${
                day.active
                  ? "bg-primary shadow-sm shadow-primary/30"
                  : day.isToday
                    ? "bg-muted-foreground/20 border border-dashed border-border"
                    : "bg-background border border-border"
              }`}
            />
            <span className="text-xs text-muted-foreground">{day.label}</span>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-border">
        <div className="text-center">
          <p className="text-sm font-bold text-orange-400">🔥 {currentStreak}</p>
          <p className="text-xs text-muted-foreground">Current</p>
        </div>
        <div className="text-center">
          <p className="text-sm font-bold text-foreground">🏆 {longestStreak}</p>
          <p className="text-xs text-muted-foreground">Best</p>
        </div>
        <div className="text-center">
          <p className="text-sm font-bold text-primary">{last7Days.filter((d) => d.active).length}/7</p>
          <p className="text-xs text-muted-foreground">This week</p>
        </div>
      </div>

      <div className="mt-3 text-center">
        {currentStreak === 0 && (
          <p className="text-xs text-muted-foreground">Complete a lesson today to start your streak! 💪</p>
        )}
        {currentStreak >= 1 && currentStreak < 7 && (
          <p className="text-xs text-primary">{7 - currentStreak} more days to complete your first week! 🎯</p>
        )}
        {currentStreak >= 7 && (
          <p className="text-xs text-orange-400 font-semibold">🔥 Incredible! {currentStreak}-day streak!</p>
        )}
      </div>
    </div>
  );
}
