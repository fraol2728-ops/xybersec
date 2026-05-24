interface PopularCoursesSectionProps {
  courses: any[];
}

function getDifficulty(course: any): string {
  const tier = course.tier;
  if (tier === "free") return "Beginner";
  if (tier === "pro") return "Intermediate";
  if (tier === "ultra") return "Advanced";
  return "Beginner";
}

export function PopularCoursesSection({ courses }: PopularCoursesSectionProps) {
  if (!courses.length) return null;

  return (
    <section>
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-semibold text-foreground">Popular Courses</h2>
        <a href="/courses" className="text-xs text-primary hover:opacity-80 transition-opacity">
          Browse all →
        </a>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-white/[0.06]">
        {courses.map((course) => (
          <a
            key={course._id}
            href={`/courses/${course.slug}`}
            className="group bg-[#080C14] hover:bg-white/[0.04] transition-colors overflow-hidden"
          >
            <div className="aspect-video relative overflow-hidden">
              {course.thumbnail?.asset?.url ? (
                <img
                  src={course.thumbnail.asset.url}
                  alt={course.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center">
                  <span className="text-4xl">🛡️</span>
                </div>
              )}

              <div className="absolute top-2 left-2 flex gap-1.5">
                <span
                  className={`text-xs font-semibold px-2 py-0.5 backdrop-blur-sm ${course.tier === "free" ? "bg-primary/80 text-background" : "bg-secondary/80 text-background"}`}
                >
                  {course.tier === "free" ? "FREE" : "PRO"}
                </span>
                {getDifficulty(course) && (
                  <span className="text-xs font-semibold px-2 py-0.5 bg-black/60 text-white backdrop-blur-sm">
                    {getDifficulty(course)}
                  </span>
                )}
              </div>
            </div>

            <div className="p-4">
              <h3 className="text-sm font-semibold text-foreground mb-1 line-clamp-2 group-hover:text-primary transition-colors">
                {course.title}
              </h3>
              <p className="text-xs text-muted-foreground line-clamp-1 mb-2">{course.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">{course.totalLessons ?? 0} lessons</span>
                <span className="text-xs text-primary opacity-0 group-hover:opacity-100 transition-opacity">Start →</span>
              </div>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
