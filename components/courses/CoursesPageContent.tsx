import { NewCoursesClient } from "@/components/courses/NewCoursesClient";
import { sanityFetch } from "@/sanity/lib/live";
import { ALL_CATEGORIES_QUERY, ALL_COURSES_QUERY } from "@/sanity/lib/queries";

export async function CoursesPageContent() {
  const [{ data: courses }, { data: categories }] = await Promise.all([
    sanityFetch({ query: ALL_COURSES_QUERY }),
    sanityFetch({ query: ALL_CATEGORIES_QUERY }),
  ]);

  const normalizedCourses = (courses ?? []).map((course: any) => ({
    ...course,
    slug:
      typeof course.slug === "string"
        ? course.slug
        : course.slug?.current ?? "",
    category: course.category ?? null,
    thumbnail: course.thumbnail ?? null,
    lessonCount: course.lessonCount ?? 0,
    estimatedHours: course.estimatedHours ?? 0,
    totalLessons: course.totalLessons ?? 0,
  }));

  return (
    <div className="dark min-h-screen bg-background text-foreground">
      <NewCoursesClient
        courses={normalizedCourses}
        categories={categories ?? []}
      />
    </div>
  );
}
