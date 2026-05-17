import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { CoursesGrid, type CatalogCourse } from "@/components/courses/CoursesGrid";
import { sanityFetch } from "@/sanity/lib/live";
import { ALL_COURSES_QUERY, COURSES_CATEGORIES_QUERY } from "@/sanity/lib/queries";

interface CourseResult {
  _id: string;
  title: string | null;
  slug: { current: string | null } | null;
  description: string | null;
  tier: string | null;
  thumbnail: { asset: { url: string | null } | null } | null;
  lessonCount: number | null;
}

interface CategoryResult {
  _id: string;
  title: string | null;
}

const inferDifficulty = (
  tier: string | null | undefined,
): CatalogCourse["difficulty"] => {
  if (tier === "ultra") return "Advanced";
  if (tier === "pro") return "Intermediate";
  return "Beginner";
};

export async function CoursesPageContent() {
  const [{ data: coursesData }, { data: categoriesData }] = (await Promise.all([
    sanityFetch({ query: ALL_COURSES_QUERY }) as Promise<{ data: CourseResult[] }>,
    sanityFetch({ query: COURSES_CATEGORIES_QUERY }) as Promise<{
      data: CategoryResult[];
    }>,
  ])) as [{ data: CourseResult[] }, { data: CategoryResult[] }];

  const courses: CatalogCourse[] = coursesData
    .filter((course) => Boolean(course.slug?.current))
    .map((course) => {
      const lessonCount = course.lessonCount ?? 0;
      const estimatedHours = Math.max(1, Math.ceil(lessonCount / 4));

      return {
        id: course._id,
        title: course.title ?? "Untitled Course",
        slug: course.slug?.current ?? "course",
        instructor: "Next Xybersec Instructor",
        difficulty: inferDifficulty(course.tier),
        category:
          course.tier === "ultra"
            ? "Advanced Track"
            : course.tier === "pro"
              ? "Intermediate Track"
              : "Beginner Track",
        lessonCount,
        durationLabel: `${estimatedHours} ${estimatedHours === 1 ? "Hour" : "Hours"}`,
        thumbnailUrl: course.thumbnail?.asset?.url ?? undefined,
      };
    });

  const categories = categoriesData
    .filter((category) => Boolean(category.title))
    .map((category) => ({ id: category._id, title: category.title ?? "General" }));

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      <main className="mx-auto max-w-7xl space-y-10 px-4 py-12 sm:px-6 lg:px-10">
        <section className="relative overflow-hidden rounded-3xl border border-cyan-400/30 bg-gradient-to-br from-[#15152a] via-[#100f1e] to-[#0a0a0f] p-8 shadow-[0_0_80px_-35px_rgba(34,211,238,0.6)] sm:p-12">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(56,189,248,0.16),_transparent_45%),linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:auto,28px_28px,28px_28px] opacity-55" />
          <div className="relative z-10 max-w-3xl">
            <p className="font-mono text-xs uppercase tracking-[0.26em] text-cyan-200/90">
              Xybersec Academy
            </p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-5xl">
              Cybersecurity Courses
            </h1>
            <p className="mt-4 text-base leading-7 text-zinc-300 sm:text-lg">
              Explore beginner to advanced tracks in ethical hacking, defense,
              and practical security skills.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                href="#courses-grid"
                className="rounded-xl border border-cyan-300/50 bg-cyan-400/10 px-5 py-2.5 font-mono text-sm font-medium text-cyan-100 transition hover:bg-cyan-400/20"
              >
                Browse Courses
              </Link>
              <Badge className="rounded-full border border-cyan-300/40 bg-cyan-400/10 px-4 py-2 text-cyan-100">
                {courses.length} Courses Available
              </Badge>
            </div>
          </div>
        </section>

        <section id="courses-grid" className="space-y-6">
          <CoursesGrid courses={courses} categories={categories} hrefBase="/courses" />
        </section>
      </main>
    </div>
  );
}
