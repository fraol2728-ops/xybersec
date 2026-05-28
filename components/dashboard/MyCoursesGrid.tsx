"use client";

import { motion } from "framer-motion";
import { BookOpen } from "lucide-react";
import { useMemo, useState } from "react";
import { CourseCard } from "@/components/dashboard/CourseCard";
import { CourseSearch } from "@/components/dashboard/CourseSearch";

interface DashboardCourse {
  id: string;
  title: string;
  description?: string | null;
  thumbnailUrl?: string | null;
  lessonCount: number;
  completedLessons: number;
  href: string;
  level?: string | null;
  category?: string | { title?: string | null } | null;
  estimatedTime?: string;
}

interface MyCoursesGridProps {
  courses: DashboardCourse[];
}

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export function MyCoursesGrid({ courses }: MyCoursesGridProps) {
  const [query, setQuery] = useState("");

  const filteredCourses = useMemo(() => {
    const normalized = query.trim().toLowerCase();

    if (!normalized) {
      return courses;
    }

    return courses.filter((course) => {
      const title = course.title.toLowerCase();
      const description = (course.description ?? "").toLowerCase();
      return title.includes(normalized) || description.includes(normalized);
    });
  }, [courses, query]);

  return (
    <div className="space-y-6">
      <CourseSearch value={query} onChange={setQuery} />

      {filteredCourses.length > 0 ? (
        <motion.div
          className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4"
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          {filteredCourses.map((course) => {
            const categoryLabel =
              typeof course.category === "string"
                ? course.category
                : typeof course.category?.title === "string"
                  ? course.category.title
                  : null;

            return (
              <motion.div key={course.id} variants={itemVariants}>
                <CourseCard
                  title={course.title}
                  thumbnailUrl={course.thumbnailUrl}
                  lessonCount={course.lessonCount}
                  completedLessons={course.completedLessons}
                  href={course.href}
                  level={course.level}
                  category={categoryLabel}
                  estimatedTime={course.estimatedTime}
                />
              </motion.div>
            );
          })}
        </motion.div>
      ) : (
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 py-16 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-zinc-800/70">
            <BookOpen className="h-7 w-7 text-zinc-500" />
          </div>
          <h3 className="text-lg font-semibold text-white">
            No matching courses
          </h3>
          <p className="mt-2 text-sm text-zinc-400">
            Try a different keyword to find your course.
          </p>
        </div>
      )}
    </div>
  );
}
