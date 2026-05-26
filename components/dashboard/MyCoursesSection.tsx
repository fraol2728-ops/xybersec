"use client";

import Link from "next/link";
import { useRef } from "react";
import { ChevronRight, ChevronLeft, Play } from "lucide-react";

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
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const inProgress = courses.filter((c) => (courseProgressMap[c._id]?.progressPercent ?? 0) > 0);
  const sectionTitle = inProgress.length > 0 ? "Explore More Courses" : "Popular Courses";

  function scrollLeft() {
    scrollContainerRef.current?.scrollBy({
      left: -280,
      behavior: "smooth",
    });
  }

  function scrollRight() {
    scrollContainerRef.current?.scrollBy({
      left: 280,
      behavior: "smooth",
    });
  }

  return (
    <div>
      {inProgress.length > 0 && (
        <section className="mb-10">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-bold text-foreground">Modules In Progress</h2>
            <Link href="/courses" className="text-sm text-primary hover:opacity-80 transition-opacity">
              View all →
            </Link>
          </div>

          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory">
            {inProgress.map((course) => {
              const progress = courseProgressMap[course._id];
              const percent = progress?.progressPercent ?? 0;
              const completed = progress?.completedLessons ?? 0;
              const total = progress?.totalLessons ?? 0;

              return (
                <Link key={course._id} href={`/courses/${course.slug}`} className="flex-shrink-0 w-64 snap-start group">
                  <div className="rounded-2xl border border-border bg-muted overflow-hidden hover:border-primary/40 hover:shadow-xl hover:shadow-primary/10 transition-all duration-300">
                    <div className="relative aspect-video bg-background overflow-hidden">
                      <div className="absolute top-2 left-2 z-10">
                        <span className="text-xs font-bold px-2 py-1 rounded-md bg-primary/90 text-background backdrop-blur-sm">
                          In Progress
                        </span>
                      </div>

                      {course.thumbnail?.asset?.url ? (
                        <img
                          src={course.thumbnail.asset.url}
                          alt={course.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 via-background to-secondary/20">
                          <div className="w-16 h-16 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                            <span className="text-3xl">🛡️</span>
                          </div>
                        </div>
                      )}

                      <div className="absolute inset-0 flex items-center justify-center bg-background/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center shadow-lg shadow-primary/30">
                          <Play className="w-5 h-5 text-background ml-0.5" />
                        </div>
                      </div>
                    </div>

                    <div className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <span
                          className={`text-xs font-bold px-1.5 py-0.5 rounded ${
                            course.tier === "free" ? "bg-primary/10 text-primary" : "bg-secondary/10 text-secondary"
                          }`}
                        >
                          {course.tier === "free" ? "FREE" : "PRO"}
                        </span>
                        <span className="text-xs text-muted-foreground">COURSE</span>
                      </div>

                      <h3 className="text-sm font-bold text-foreground mb-3 line-clamp-2 group-hover:text-primary transition-colors leading-snug">
                        {course.title}
                      </h3>

                      <div className="w-full h-1.5 bg-background rounded-full overflow-hidden mb-2">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-primary to-secondary transition-all duration-700"
                          style={{ width: `${percent}%` }}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">
                          {completed}/{total} · {percent}%
                        </span>
                        <ChevronRight className="w-4 h-4 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      <section>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold text-foreground">{sectionTitle}</h2>
          <div className="flex items-center gap-2">
            <button
              onClick={scrollLeft}
              className="w-8 h-8 rounded-lg border border-border bg-muted flex items-center justify-center hover:border-primary/50 hover:bg-muted/80 transition-all"
            >
              <ChevronLeft className="w-4 h-4 text-muted-foreground" />
            </button>
            <button
              onClick={scrollRight}
              className="w-8 h-8 rounded-lg border border-border bg-muted flex items-center justify-center hover:border-primary/50 hover:bg-muted/80 transition-all"
            >
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </button>
            <Link href="/courses" className="text-sm text-primary hover:opacity-80 transition-opacity ml-2">
              View all →
            </Link>
          </div>
        </div>

        <div ref={scrollContainerRef} className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory">
          {courses.map((course) => {
            const progress = courseProgressMap[course._id];
            const percent = progress?.progressPercent ?? 0;
            const hasProgress = percent > 0;

            return (
              <Link key={course._id} href={`/courses/${course.slug}`} className="flex-shrink-0 w-56 snap-start group">
                <div className="rounded-2xl border border-border bg-muted overflow-hidden hover:border-primary/40 hover:shadow-lg hover:shadow-primary/10 transition-all duration-300 h-full">
                  <div className="relative aspect-video bg-background overflow-hidden">
                    {hasProgress && (
                      <div className="absolute top-2 left-2 z-10">
                        <span className="text-xs font-bold px-2 py-1 rounded-md bg-primary/90 text-background">
                          In Progress
                        </span>
                      </div>
                    )}

                    {course.thumbnail?.asset?.url ? (
                      <img
                        src={course.thumbnail.asset.url}
                        alt={course.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 via-background to-secondary/10">
                        <span className="text-4xl">{course.tier === "pro" ? "🔐" : "🛡️"}</span>
                      </div>
                    )}

                    <div className="absolute inset-0 flex items-center justify-center bg-background/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
                        <Play className="w-4 h-4 text-background ml-0.5" />
                      </div>
                    </div>
                  </div>

                  <div className="p-3">
                    <div className="flex items-center gap-1.5 mb-2">
                      <span
                        className={`text-xs font-bold px-1.5 py-0.5 rounded ${
                          course.tier === "free" ? "bg-primary/10 text-primary" : "bg-secondary/10 text-secondary"
                        }`}
                      >
                        {course.tier === "free" ? "FREE" : "PRO"}
                      </span>
                    </div>

                    <h3 className="text-xs font-bold text-foreground line-clamp-2 mb-3 group-hover:text-primary transition-colors leading-snug">
                      {course.title}
                    </h3>

                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{course.totalLessons ?? 0} lessons</span>
                      {hasProgress ? <span className="text-primary font-semibold">{percent}%</span> : <span>Start →</span>}
                    </div>

                    {hasProgress && (
                      <div className="w-full h-1 bg-background rounded-full overflow-hidden mt-2">
                        <div className="h-full rounded-full bg-primary" style={{ width: `${percent}%` }} />
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
