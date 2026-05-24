type DashboardCourse = {
  _id: string;
  title?: string | null;
  slug?: { current?: string | null } | null;
  modules?: { lessons?: { completedBy?: string[] | null }[] | null }[] | null;
};

interface ContinueLearningCardProps {
  courses: DashboardCourse[];
  userId?: string | null;
}

export function ContinueLearningCard({ courses, userId }: ContinueLearningCardProps) {
  const courseProgress = (courses ?? []).map((course) => {
    const lessons = (course.modules ?? []).flatMap((module) => module.lessons ?? []);
    const totalLessons = lessons.length;
    const completedLessons = lessons.filter((lesson) => lesson.completedBy?.includes(userId ?? "")).length;
    const progress = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

    return {
      title: course.title ?? "Untitled Course",
      progress,
      completedLessons,
      totalLessons,
      continueHref: `/courses/${course.slug?.current ?? ""}`,
    };
  });

  const activeCourse = courseProgress.find((course) => course.progress < 100);

  if (!courses?.length || !activeCourse) {
    return (
      <div className="rounded-2xl border border-border bg-muted p-6 text-center">
        <p className="text-2xl mb-3">🛡️</p>
        <h3 className="font-semibold text-foreground mb-2">Ready to start learning?</h3>
        <p className="text-sm text-muted-foreground mb-4">Begin your cybersecurity journey with our free fundamentals course.</p>
        <a href="/courses" className="inline-flex px-4 py-2 rounded-lg bg-primary text-background text-sm font-semibold hover:opacity-90 transition-all">Browse Courses →</a>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-primary/30 bg-muted p-6 relative overflow-hidden hover:border-primary/50 transition-colors group">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-secondary" />
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-xs font-semibold text-primary tracking-wider uppercase mb-2 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            Continue Learning
          </p>
          <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">{activeCourse.title}</h3>
        </div>
        <span className="text-xs font-semibold px-2 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 flex-shrink-0 ml-4">{activeCourse.progress}% done</span>
      </div>
      <div className="w-full h-2 bg-background rounded-full mb-4 overflow-hidden">
        <div className="h-full bg-gradient-to-r from-primary to-secondary rounded-full transition-all duration-500" style={{ width: `${activeCourse.progress}%` }} />
      </div>
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{activeCourse.completedLessons} of {activeCourse.totalLessons} lessons completed</p>
        <a href={activeCourse.continueHref} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-background text-sm font-semibold hover:opacity-90 hover:shadow-lg hover:shadow-primary/25 transition-all duration-200">Continue →</a>
      </div>
    </div>
  );
}
