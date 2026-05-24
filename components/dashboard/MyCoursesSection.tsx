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
  if (!courses.length) return null;

  return (
    <section>
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-semibold text-foreground">My Courses</h2>
        <a href="/courses" className="text-xs text-primary hover:opacity-80 transition-opacity">
          View all →
        </a>
      </div>

      <div className="bg-white/[0.04] backdrop-blur-md border border-white/[0.08] rounded-lg overflow-hidden">
        {courses.map((course, i) => {
          const prog = courseProgressMap[course._id];
          return (
            <a
              key={course._id}
              href={`/courses/${course.slug}`}
              className={`flex items-center gap-3 p-4 hover:bg-white/[0.04] transition-colors group ${i < courses.length - 1 ? "border-b border-white/[0.06]" : ""}`}
            >
              <div className="w-10 h-10 rounded-lg bg-white/[0.06] border border-white/[0.08] flex items-center justify-center flex-shrink-0 text-lg">
                🛡️
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate group-hover:text-primary transition-colors">{course.title}</p>
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex-1 h-1 bg-white/[0.06] rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full" style={{ width: `${prog?.progressPercent ?? 0}%` }} />
                  </div>
                  <span className="text-xs text-muted-foreground flex-shrink-0">
                    {prog?.completedLessons ?? 0}/{prog?.totalLessons ?? 0}
                  </span>
                </div>
              </div>

              <span className={`text-xs font-semibold px-2 py-0.5 rounded flex-shrink-0 ${course.tier === "free" ? "bg-primary/10 text-primary" : "bg-secondary/10 text-secondary"}`}>
                {course.tier === "free" ? "FREE" : "PRO"}
              </span>
            </a>
          );
        })}
      </div>
    </section>
  );
}
