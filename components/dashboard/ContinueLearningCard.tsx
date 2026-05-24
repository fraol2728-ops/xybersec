interface ContinueLearningCardProps {
  course: {
    _id: string;
    title: string;
    slug: string;
    tier: string;
    progress: number;
    completedLessons: number;
    totalLessons: number;
    nextLessonSlug: string | null;
    nextLessonTitle: string | null;
    continueHref: string;
    thumbnail?: any;
  } | null;
}

export function ContinueLearningCard({ course }: ContinueLearningCardProps) {
  if (!course) {
    return (
      <div className="rounded-2xl border border-border bg-muted p-6 text-center">
        <h3 className="font-semibold text-foreground mb-2">Start your first course</h3>
        <a href="/courses" className="inline-flex px-4 py-2 rounded-lg bg-primary text-background text-sm font-semibold">Browse Courses →</a>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-primary/30 bg-muted p-6">
      <p className="text-xs font-semibold text-primary uppercase mb-2">Continue Learning</p>
      <h3 className="text-xl font-bold text-foreground">{course.title}</h3>
      <p className="text-sm text-muted-foreground mt-2">{course.completedLessons} of {course.totalLessons} lessons completed</p>
      <div className="w-full h-2 bg-background rounded-full mt-3 mb-3 overflow-hidden">
        <div className="h-full bg-gradient-to-r from-primary to-secondary rounded-full" style={{ width: `${course.progress}%` }} />
      </div>
      <p className="text-sm text-muted-foreground mb-4">Next: {course.nextLessonTitle ?? "Course overview"}</p>
      <a href={course.continueHref} className="inline-flex px-4 py-2 rounded-lg bg-primary text-background text-sm font-semibold">Continue →</a>
    </div>
  );
}
