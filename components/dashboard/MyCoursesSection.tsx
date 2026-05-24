interface Course {
  _id: string;
  title: string;
  slug: string;
  tier: string;
  progress: number;
  completedLessons: number;
  totalLessons: number;
  continueHref: string;
  thumbnail?: any;
}

interface MyCoursesSectionProps {
  courses: Course[];
}

export function MyCoursesSection({ courses }: MyCoursesSectionProps) {
  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-foreground">My Courses</h2>
        <a href="/courses" className="text-sm text-primary">Browse more →</a>
      </div>

      {courses.length === 0 ? (
        <div className="rounded-xl border border-border bg-muted p-5 text-center">
          <p className="text-muted-foreground mb-3">No courses yet</p>
          <a href="/courses" className="text-sm text-primary">Go to courses →</a>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {courses.map((course) => (
            <a key={course._id} href={course.continueHref} className="flex flex-col p-4 rounded-xl border border-border bg-muted">
              {course.thumbnail?.asset?.url ? (
                <img src={course.thumbnail.asset.url} alt={course.title} className="w-full h-28 object-cover rounded-lg mb-3" />
              ) : (
                <div className="w-full h-28 rounded-lg mb-3 bg-gradient-to-r from-primary/20 to-secondary/20" />
              )}
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-sm font-semibold text-foreground line-clamp-2">{course.title}</h3>
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ml-2 ${course.tier === "free" ? "bg-primary/10 text-primary" : "bg-secondary/10 text-secondary"}`}>
                  {course.tier === "free" ? "FREE" : "PRO"}
                </span>
              </div>
              <div className="w-full h-1.5 bg-background rounded-full overflow-hidden mb-2">
                <div className="h-full bg-primary rounded-full" style={{ width: `${course.progress}%` }} />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">{course.completedLessons} of {course.totalLessons} lessons</span>
                <span className="text-xs text-primary">Continue →</span>
              </div>
            </a>
          ))}
        </div>
      )}
    </section>
  );
}
