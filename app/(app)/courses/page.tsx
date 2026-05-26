import { CoursesPageClient } from "@/components/courses/CoursesPageClient";
import { sanityFetch } from "@/sanity/lib/live";
import { ALL_CATEGORIES_QUERY, ALL_COURSES_QUERY } from "@/sanity/lib/queries";

export default async function CoursesPage() {
  const [{ data: courses }, { data: categories }] = await Promise.all([
    sanityFetch({ query: ALL_COURSES_QUERY }),
    sanityFetch({ query: ALL_CATEGORIES_QUERY }),
  ]);

  return (
    <div className="dark min-h-screen bg-background text-foreground">
      <CoursesPageClient courses={courses ?? []} categories={categories ?? []} />
    </div>
  );
}
