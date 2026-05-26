interface WelcomeBannerProps {
  firstName: string;
  username?: string | null;
  lessonsCompleted: number;
  currentStreak: number;
  levelTitle: string;
}

export function WelcomeBanner({ firstName, username, lessonsCompleted, currentStreak }: WelcomeBannerProps) {
  return (
    <div className="mb-2">
      <h1 className="text-2xl font-bold text-foreground">
        Welcome back,{" "}
        <span className="text-primary">{username ? `@${username}` : firstName}</span> 👋
      </h1>
      <p className="text-sm text-muted-foreground mt-1">
        {currentStreak > 0
          ? `🔥 ${currentStreak}-day streak · ${lessonsCompleted} lessons completed`
          : `${lessonsCompleted} lessons completed · Start your streak today`}
      </p>
    </div>
  );
}
