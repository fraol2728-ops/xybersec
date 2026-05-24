type DashboardCourse = {
  _id: string;
  title?: string | null;
  slug?: { current?: string | null } | null;
  tier?: string | null;
  modules?: { lessons?: { completedBy?: string[] | null }[] | null }[] | null;
};

interface MyCoursesSectionProps {
  courses: DashboardCourse[];
  userId?: string | null;
}

export function MyCoursesSection({ courses, userId }: MyCoursesSectionProps) {
  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-foreground">My Courses</h2>
        <a href="/courses" className="text-sm text-primary hover:opacity-80 transition-opacity">Browse more →</a>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {courses.map((course) => {
          const lessons = (course.modules ?? []).flatMap((module) => module.lessons ?? []);
          const totalLessons = lessons.length;
          const completedLessons = lessons.filter((lesson) => lesson.completedBy?.includes(userId ?? "")).length;
          const progress = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

          return (
            <a key={course._id} href={`/courses/${course.slug?.current}`} className="flex flex-col p-4 rounded-xl border border-border bg-muted hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5 transition-all duration-200 group">
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2 flex-1">{course.title}</h3>
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ml-2 flex-shrink-0 ${course.tier === "free" ? "bg-primary/10 text-primary border border-primary/20" : "bg-secondary/10 text-secondary border border-secondary/20"}`}>
                  {course.tier === "free" ? "FREE" : "PRO"}
                </span>
              </div>

              <div className="w-full h-1.5 bg-background rounded-full overflow-hidden mb-2">
                <div className="h-full bg-primary rounded-full" style={{ width: `${progress}%` }} />
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">{progress}% complete</span>
                <span className="text-xs text-primary opacity-0 group-hover:opacity-100 transition-opacity">Continue →</span>
              </div>
            </a>
          );
        })}
      </div>
    </section>
  );
}
