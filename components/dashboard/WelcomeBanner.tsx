interface WelcomeBannerProps {
  firstName: string;
  username?: string | null;
  lessonsCompleted: number;
  streakStatus?: "active" | "at_risk" | "broken";
  xpPoints: number;
}

export function WelcomeBanner({ firstName, username, lessonsCompleted, streakStatus }: WelcomeBannerProps) {
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  const message =
    lessonsCompleted === 0
      ? "Start your first lesson and begin your journey 🚀"
      : streakStatus === "active"
        ? "You're on fire! Keep your streak going 🔥"
        : streakStatus === "at_risk"
          ? "⚠️ Complete a lesson today to keep your streak!"
          : "Welcome back! Ready to start a new streak?";

  return (
    <div className="rounded-2xl border border-border bg-muted p-6">
      <p className="text-primary text-sm font-semibold uppercase mb-1">{greeting}</p>
      <h1 className="text-2xl font-bold text-foreground">{username ? `@${username}` : firstName} 👋</h1>
      <p className="text-muted-foreground text-sm mt-1">{message}</p>
    </div>
  );
}
