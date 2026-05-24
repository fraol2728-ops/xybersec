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
      <div className="bg-white/[0.04] backdrop-blur-md border border-white/[0.08] rounded-lg p-6 text-center">
        <div className="w-12 h-12 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-3">
          <span className="text-2xl">🛡️</span>
        </div>
        <h3 className="font-semibold text-foreground mb-1">Start your cybersecurity journey</h3>
        <p className="text-sm text-muted-foreground mb-4">Pick a course below and begin your first lesson for free.</p>
        <a href="/courses" className="inline-flex px-4 py-2 rounded-lg bg-primary/10 border border-primary/20 text-primary text-sm font-semibold hover:bg-primary/20 transition-all">
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
    <div className="relative bg-cyan-400/[0.04] backdrop-blur-md border border-cyan-400/20 rounded-lg p-5 overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-primary via-secondary to-transparent" />

      <div className="flex items-start justify-between mb-3">
        <div>
          <p className="text-xs font-semibold text-primary tracking-wider uppercase flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            Continue Learning
          </p>
          <h3 className="text-lg font-bold text-foreground mt-1">{activeCourse.title}</h3>
          <p className="text-xs text-muted-foreground">
            {activeCourse.completedLessons} of {activeCourse.totalLessons} lessons
          </p>
        </div>
        <span className="text-xs font-bold text-primary bg-primary/10 border border-primary/20 px-2 py-1 rounded-md">
          {activeCourse.progressPercent}%
        </span>
      </div>

      <div className="w-full h-1.5 bg-white/[0.06] rounded-full overflow-hidden mb-4">
        <div className="h-full rounded-full bg-gradient-to-r from-primary to-secondary" style={{ width: `${activeCourse.progressPercent}%` }} />
      </div>

      <a href={continueHref} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/10 border border-primary/20 text-primary text-sm font-semibold hover:bg-primary/20 transition-all">
        {activeCourse.progressPercent === 0 ? "Start Now →" : "Continue →"}
      </a>
    </div>
  );
}
