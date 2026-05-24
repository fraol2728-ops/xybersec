interface ActiveCourse {
  _id: string;
  title: string;
  slug: string;
  tier: string;
  completedLessons: number;
  progressPercent: number;
  totalLessons: number;
  firstLessonSlug?: string;
  modules?: {
    _id: string;
    title: string;
    isFree: boolean;
    lessons: {
      _id: string;
      title: string;
      slug: string;
    }[];
  }[];
}

interface ContinueLearningCardProps {
  activeCourse: ActiveCourse | null;
}

export function ContinueLearningCard({ activeCourse }: ContinueLearningCardProps) {
  if (!activeCourse) {
    return (
      <div className="rounded-2xl border border-border bg-muted p-6 text-center">
        <span className="text-4xl block mb-3">🛡️</span>
        <h3 className="font-semibold text-foreground mb-2">Ready to start learning?</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Begin your cybersecurity journey with our free fundamentals module.
        </p>
        <a
          href="/courses"
          className="inline-flex px-5 py-2.5 rounded-xl bg-primary text-background text-sm font-semibold hover:opacity-90 transition-all"
        >
          Browse Courses →
        </a>
      </div>
    );
  }

  const allLessons = activeCourse.modules?.flatMap((m) => m.lessons) ?? [];
  const nextLesson = allLessons.find((l) => l.slug);

  const continueHref = nextLesson?.slug
    ? `/lessons/${nextLesson.slug}`
    : activeCourse.firstLessonSlug
      ? `/lessons/${activeCourse.firstLessonSlug}`
      : `/courses/${activeCourse.slug}`;

  return (
    <div className="rounded-2xl border border-primary/30 bg-muted p-6 relative overflow-hidden hover:border-primary/50 transition-colors group">
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary to-secondary" />

      <div className="flex items-start justify-between mb-1">
        <p className="text-xs font-semibold text-primary tracking-wider uppercase flex items-center gap-1.5 mb-3">
          <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
          Continue Learning
        </p>
        <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full border border-primary/20">
          {activeCourse.progressPercent}%
        </span>
      </div>

      <h3 className="text-xl font-bold text-foreground mb-1 group-hover:text-primary transition-colors">{activeCourse.title}</h3>

      <p className="text-sm text-muted-foreground mb-4">
        {activeCourse.completedLessons} of {activeCourse.totalLessons} lessons completed
      </p>

      <div className="w-full h-2 bg-background rounded-full mb-5 overflow-hidden">
        <div
          className="h-full rounded-full bg-gradient-to-r from-primary to-secondary transition-all duration-700"
          style={{ width: `${activeCourse.progressPercent}%` }}
        />
      </div>

      <div className="flex items-center justify-between">
        <p className="text-xs text-muted-foreground">
          {activeCourse.progressPercent === 0
            ? "Start your first lesson"
            : activeCourse.progressPercent === 100
              ? "Course complete! 🎉"
              : "Keep going, you're doing great!"}
        </p>
        <a
          href={continueHref}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-background text-sm font-semibold hover:opacity-90 hover:shadow-lg hover:shadow-primary/25 transition-all"
        >
          {activeCourse.progressPercent === 0 ? "Start Now →" : "Continue →"}
        </a>
      </div>
    </div>
  );
}
