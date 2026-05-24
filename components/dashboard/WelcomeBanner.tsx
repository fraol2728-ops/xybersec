interface WelcomeBannerProps {
  firstName: string;
  username?: string | null;
  lessonsCompleted: number;
  currentStreak: number;
  levelTitle: string;
}

export function WelcomeBanner({ firstName, username, lessonsCompleted, currentStreak, levelTitle }: WelcomeBannerProps) {
  return (
    <div className="rounded-2xl border border-border bg-muted p-6 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-secondary/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex items-center justify-between">
        <div>
          <p className="text-primary text-sm font-semibold tracking-wider uppercase mb-1">Welcome back</p>
          <h1 className="text-2xl font-bold text-foreground">{username ? `@${username}` : firstName} 👋</h1>
          <p className="text-muted-foreground text-sm mt-1">
            {lessonsCompleted === 0
              ? "Start your first lesson and begin your journey"
              : currentStreak >= 7
                ? `🏆 ${currentStreak}-day streak! You're unstoppable!`
                : currentStreak >= 3
                  ? `🔥 ${currentStreak}-day streak! Keep the momentum!`
                  : currentStreak >= 1
                    ? `🔥 You're on a ${currentStreak}-day streak!`
                    : "Complete a lesson today to start a new streak!"}
          </p>
        </div>
        <div className="hidden sm:flex flex-col items-end gap-1">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-secondary/10 border border-secondary/20">
            <span className="text-xs font-bold text-secondary">{levelTitle}</span>
          </div>
          <p className="text-xs text-muted-foreground">🇪🇹 Built for Ethiopia</p>
        </div>
      </div>
    </div>
  );
}
