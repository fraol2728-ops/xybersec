"use client";

interface XPStreakCardProps {
  initialData: {
    xpPoints: number;
    currentStreak: number;
    longestStreak: number;
  } | null;
}

export function XPStreakCard({ initialData }: XPStreakCardProps) {
  if (!initialData) {
    return <div className="bg-muted border border-border rounded-xl p-4"><p className="text-xs text-muted-foreground text-center py-4">Sign in to track your XP and streak</p></div>;
  }

  const { xpPoints, currentStreak, longestStreak } = initialData;

  return (
    <div className="bg-muted border border-border rounded-xl p-4">
      <p className="text-xs font-semibold text-muted-foreground tracking-wider uppercase mb-3">Stats</p>
      <div className="flex items-center justify-between py-2 border-b border-border"><div className="flex items-center gap-2"><span className="text-lg">⚡</span><span className="text-sm text-muted-foreground">Total XP</span></div><span className="text-sm font-bold text-primary">{xpPoints.toLocaleString()} XP</span></div>
      <div className="flex items-center justify-between py-2 border-b border-border"><div className="flex items-center gap-2"><span className="text-lg">🔥</span><span className="text-sm text-muted-foreground">Current Streak</span></div><span className="text-sm font-bold text-foreground">{currentStreak} days</span></div>
      <div className="flex items-center justify-between py-2"><div className="flex items-center gap-2"><span className="text-lg">🏆</span><span className="text-sm text-muted-foreground">Best Streak</span></div><span className="text-sm font-bold text-foreground">{longestStreak} days</span></div>
      {currentStreak === 0 && <p className="text-xs text-muted-foreground mt-3 text-center">Complete a lesson to start your streak!</p>}
      {currentStreak >= 1 && currentStreak < 7 && <p className="text-xs text-primary mt-3 text-center">🔥 Keep going! You're on a {currentStreak}-day streak!</p>}
      {currentStreak >= 7 && <p className="text-xs text-primary mt-3 text-center font-semibold">🏆 Amazing! {currentStreak}-day streak! You're unstoppable!</p>}
    </div>
  );
}
