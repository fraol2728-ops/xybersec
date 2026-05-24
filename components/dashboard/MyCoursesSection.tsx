interface MyCoursesProps {
  courses: any[];
  courseProgressMap: Record<
    string,
    {
      completedLessons: number;
      progressPercent: number;
      totalLessons: number;
    }
  >;
}

export function MyCoursesSection({ courses, courseProgressMap }: MyCoursesProps) {
  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-foreground">My Courses</h2>
        <a href="/courses" className="text-sm text-primary hover:opacity-80 transition-opacity">
          Browse more →
        </a>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {courses.map((course) => {
          const progress = courseProgressMap[course._id] ?? {
            completedLessons: 0,
            progressPercent: 0,
            totalLessons: course.totalLessons ?? 0,
          };

          return (
            <a
              key={course._id}
              href={`/courses/${course.slug}`}
              className="flex flex-col p-4 rounded-xl border border-border bg-muted hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5 transition-all duration-200 group"
            >
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2 flex-1">
                  {course.title}
                </h3>
                <span
                  className={`text-xs font-semibold px-2 py-0.5 rounded-full ml-2 flex-shrink-0 ${course.tier === "free" ? "bg-primary/10 text-primary border border-primary/20" : "bg-secondary/10 text-secondary border border-secondary/20"}`}
                >
                  {course.tier === "free" ? "FREE" : "PRO"}
                </span>
              </div>

              <div className="w-full h-1.5 bg-background rounded-full overflow-hidden mb-2">
                <div className="h-full bg-primary rounded-full" style={{ width: `${progress.progressPercent}%` }} />
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">
                  {progress.completedLessons} of {progress.totalLessons} lessons
                </span>
                <span className="text-xs text-primary">{progress.progressPercent}%</span>
              </div>
            </a>
          );
        })}
      </div>
    </section>
  );
}
