import { sanityFetch } from "@/sanity/lib/live"
import { FEATURED_COURSES_QUERY } from "@/sanity/lib/queries"

export async function FeaturedCourses() {
  const { data: courses } = await sanityFetch({ query: FEATURED_COURSES_QUERY })

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-12">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-primary text-sm font-semibold tracking-wider uppercase mb-3">COURSES</p>
          <h2 className="text-3xl font-bold text-foreground mb-4">Start Your Journey Today</h2>
          <p className="text-muted-foreground max-w-xl mx-auto">Hands-on cybersecurity courses built for Ethiopian students. Start free, pay only when you&apos;re ready to go deeper.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {((courses ?? []) as any[]).slice(0, 3).map((course) => (
            <a key={course._id} href={`/courses/${course.slug?.current}`} className="group flex flex-col rounded-2xl border border-border bg-muted overflow-hidden hover:border-primary/40 hover:shadow-xl hover:shadow-primary/10 transition-all duration-300">
              <div className="aspect-video bg-background relative overflow-hidden">
                {course.thumbnail?.asset?.url ? (
                  <img src={course.thumbnail.asset.url} alt={course.title ?? "Course"} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-secondary/10"><span className="text-4xl">🛡️</span></div>
                )}
                <div className="absolute top-3 left-3">
                  {course.tier === "free" ? (
                    <span className="px-2 py-1 rounded-full text-xs font-semibold bg-primary/20 text-primary border border-primary/30 backdrop-blur-sm">FREE</span>
                  ) : (
                    <span className="px-2 py-1 rounded-full text-xs font-semibold bg-secondary/20 text-secondary border border-secondary/30 backdrop-blur-sm">PRO</span>
                  )}
                </div>
              </div>
              <div className="flex flex-col flex-1 p-5">
                <h3 className="font-semibold text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-2">{course.title}</h3>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2 flex-1">{course.description}</p>
                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <span className="text-xs text-muted-foreground">{course.moduleCount ?? 0} modules</span>
                  <span className="text-xs font-semibold text-primary group-hover:gap-2 transition-all flex items-center gap-1">Start Course →</span>
                </div>
              </div>
            </a>
          ))}
        </div>

        <div className="text-center mt-10">
          <a href="/courses" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors border border-border hover:border-primary/50 px-5 py-2.5 rounded-xl">View all courses →</a>
        </div>
      </div>
    </section>
  )
}
