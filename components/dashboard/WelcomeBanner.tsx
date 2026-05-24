interface WelcomeBannerProps {
  firstName: string;
  username?: string | null;
  lessonsCompleted: number;
}

export function WelcomeBanner({ firstName, username, lessonsCompleted }: WelcomeBannerProps) {
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
              : `You've completed ${lessonsCompleted} lessons. Keep going!`}
          </p>
        </div>
        <div className="hidden sm:block text-right">
          <p className="text-xs text-muted-foreground">Current time in Addis Ababa</p>
          <p className="text-sm font-mono text-primary">🇪🇹 Ethiopia</p>
        </div>
      </div>
    </div>
  );
}
