"use client";

import Link from "next/link";
import { ChevronDown, Search, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

interface CoursesPageClientProps {
  courses: any[];
  categories: any[];
}

const DIFFICULTIES = [
  { id: "all", label: "All Levels" },
  { id: "beginner", label: "Beginner" },
  { id: "intermediate", label: "Intermediate" },
  { id: "advanced", label: "Advanced" },
];

const TIERS = [
  { id: "all", label: "All" },
  { id: "free", label: "Free" },
  { id: "pro", label: "Pro" },
];

const SORT_OPTIONS = [
  { id: "newest", label: "Newest First" },
  { id: "oldest", label: "Oldest First" },
  { id: "most_lessons", label: "Most Lessons" },
  { id: "title_az", label: "A → Z" },
];

export function CoursesPageClient({ courses, categories }: CoursesPageClientProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("all");
  const [selectedTier, setSelectedTier] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("newest");
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (
        e.key === "/" &&
        document.activeElement?.tagName !== "INPUT" &&
        document.activeElement?.tagName !== "TEXTAREA"
      ) {
        e.preventDefault();
        searchRef.current?.focus();
      }
      if (e.key === "Escape") {
        setSearchQuery("");
        searchRef.current?.blur();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  const filteredCourses = useMemo(() => {
    let result = [...courses];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (c) =>
          c.title?.toLowerCase().includes(q) ||
          c.description?.toLowerCase().includes(q) ||
          c.category?.title?.toLowerCase().includes(q),
      );
    }

    if (selectedCategory !== "all") {
      result = result.filter((c) => c.category?._id === selectedCategory);
    }

    if (selectedTier !== "all") {
      result = result.filter((c) => c.tier === selectedTier);
    }

    switch (sortBy) {
      case "oldest":
        break;
      case "newest":
        result = result.reverse();
        break;
      case "most_lessons":
        result.sort((a, b) => (b.totalLessons ?? 0) - (a.totalLessons ?? 0));
        break;
      case "title_az":
        result.sort((a, b) => (a.title ?? "").localeCompare(b.title ?? ""));
        break;
    }

    return result;
  }, [courses, searchQuery, selectedCategory, selectedDifficulty, selectedTier, sortBy]);

  const hasActiveFilters =
    searchQuery || selectedCategory !== "all" || selectedTier !== "all";

  function clearFilters() {
    setSearchQuery("");
    setSelectedCategory("all");
    setSelectedTier("all");
    setSortBy("newest");
    setSelectedDifficulty("all");
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-10">
        <p className="text-primary text-sm font-semibold tracking-wider uppercase mb-2">
          XYBERSEC ACADEMY
        </p>
        <h1 className="text-4xl sm:text-5xl font-black text-foreground mb-3">
          Cybersecurity <span className="text-primary">Courses</span>
        </h1>
        <p className="text-muted-foreground text-lg max-w-2xl">
          From complete beginner to professional penetration tester. Hands-on courses built
          for Ethiopian cybersecurity students.
        </p>

        <div className="flex flex-wrap gap-4 mt-4">
          <span className="text-sm text-muted-foreground flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-primary" />
            {courses.length} courses available
          </span>
          <span className="text-sm text-muted-foreground flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
            {courses.filter((c) => c.tier === "free").length} free courses
          </span>
          <span className="text-sm text-muted-foreground flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
            First module always free
          </span>
        </div>
      </div>

      <div className="relative mb-6">
        <div
          className={`flex items-center gap-3 px-5 py-4 rounded-2xl border bg-muted transition-all duration-200 ${
            searchQuery
              ? "border-primary shadow-lg shadow-primary/10"
              : "border-border hover:border-primary/40"
          }`}
        >
          <Search
            className={`w-5 h-5 flex-shrink-0 transition-colors ${
              searchQuery ? "text-primary" : "text-muted-foreground"
            }`}
          />

          <input
            ref={searchRef}
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search courses, topics, skills..."
            className="flex-1 bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none text-base"
            autoComplete="off"
          />

          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="text-muted-foreground hover:text-foreground transition-colors flex-shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          <div className="hidden sm:flex items-center gap-1 text-xs text-muted-foreground flex-shrink-0">
            <kbd className="px-1.5 py-0.5 rounded bg-background border border-border font-mono text-xs">
              /
            </kbd>
            <span>to search</span>
          </div>
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2 mb-6 scrollbar-hide">
        <button
          onClick={() => setSelectedCategory("all")}
          className={`flex-shrink-0 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
            selectedCategory === "all"
              ? "bg-primary text-background shadow-lg shadow-primary/20"
              : "bg-muted border border-border text-muted-foreground hover:text-foreground hover:border-primary/40"
          }`}
        >
          All Courses
        </button>

        {categories.map((cat) => (
          <button
            key={cat._id}
            onClick={() => setSelectedCategory(cat._id)}
            className={`flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
              selectedCategory === cat._id
                ? "bg-primary text-background shadow-lg shadow-primary/20"
                : "bg-muted border border-border text-muted-foreground hover:text-foreground hover:border-primary/40"
            }`}
          >
            {cat.icon && <span className="text-base">{cat.icon}</span>}
            {cat.title}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-3 mb-6">
        <div className="flex items-center gap-2">
          {TIERS.map((tier) => (
            <button
              key={tier.id}
              onClick={() => setSelectedTier(tier.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                selectedTier === tier.id
                  ? tier.id === "free"
                    ? "bg-primary/20 text-primary border border-primary/30"
                    : tier.id === "pro"
                      ? "bg-secondary/20 text-secondary border border-secondary/30"
                      : "bg-foreground text-background"
                  : "bg-muted border border-border text-muted-foreground hover:border-primary/40"
              }`}
            >
              {tier.label}
            </button>
          ))}
        </div>

        <div className="flex-1" />

        <div className="relative">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="appearance-none bg-muted border border-border rounded-xl px-4 py-2 pr-8 text-sm text-foreground focus:outline-none focus:border-primary/50 cursor-pointer"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.id} value={opt.id}>
                {opt.label}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
        </div>

        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-muted-foreground hover:text-foreground border border-border hover:border-red-500/30 hover:text-red-400 transition-all"
          >
            <X className="w-3 h-3" />
            Clear filters
          </button>
        )}
      </div>

      <div className="flex items-center justify-between mb-5">
        <p className="text-sm text-muted-foreground">
          {filteredCourses.length === courses.length
            ? `${courses.length} courses`
            : `${filteredCourses.length} of ${courses.length} courses`}
          {searchQuery && <span> for "{searchQuery}"</span>}
        </p>
      </div>

      {filteredCourses.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="w-20 h-20 rounded-2xl bg-muted border border-border flex items-center justify-center mb-5">
            <Search className="w-8 h-8 text-muted-foreground opacity-50" />
          </div>
          <h3 className="text-lg font-bold text-foreground mb-2">No courses found</h3>
          <p className="text-sm text-muted-foreground mb-5 max-w-sm">
            Try adjusting your search or filters to find what you&apos;re looking for.
          </p>
          <button
            onClick={clearFilters}
            className="px-5 py-2.5 rounded-xl bg-primary text-background text-sm font-semibold hover:opacity-90 transition-all"
          >
            Clear all filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredCourses.map((course) => (
            <CourseCard key={course._id} course={course} />
          ))}
        </div>
      )}
    </div>
  );
}

function CourseCard({ course }: { course: any }) {
  return (
    <Link
      href={`/courses/${course.slug}`}
      className="group flex flex-col rounded-2xl border border-border bg-muted overflow-hidden hover:border-primary/40 hover:shadow-xl hover:shadow-primary/10 transition-all duration-300"
    >
      <div className="relative aspect-video bg-background overflow-hidden">
        {course.thumbnail?.asset?.url ? (
          <img
            src={course.thumbnail.asset.url}
            alt={course.title ?? ""}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 via-background to-secondary/10">
            <span className="text-5xl">🛡️</span>
          </div>
        )}

        <div className="absolute inset-0 bg-background/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
          <div className="px-4 py-2 rounded-xl bg-primary text-background text-sm font-bold shadow-lg">
            View Course →
          </div>
        </div>

        <div className="absolute top-3 left-3">
          <span
            className={`text-xs font-bold px-2.5 py-1 rounded-lg backdrop-blur-sm border ${
              course.tier === "free"
                ? "bg-primary/20 text-primary border-primary/30"
                : "bg-secondary/20 text-secondary border-secondary/30"
            }`}
          >
            {course.tier === "free" ? "FREE" : "PRO"}
          </span>
        </div>

        {course.featured && (
          <div className="absolute top-3 right-3">
            <span className="text-xs font-bold px-2 py-1 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30 backdrop-blur-sm">
              ⭐ Featured
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-col flex-1 p-5">
        {course.category && (
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
            {course.category.title}
          </p>
        )}

        <h3 className="text-base font-bold text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors leading-snug">
          {course.title}
        </h3>

        <p className="text-sm text-muted-foreground line-clamp-2 mb-4 flex-1 leading-relaxed">
          {course.description}
        </p>

        <div className="flex items-center justify-between pt-3 border-t border-border">
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">📚 {course.totalLessons ?? 0} lessons</span>
            <span className="flex items-center gap-1">⏱️ {course.estimatedHours ?? 0}h</span>
          </div>
          <span className="text-xs font-semibold text-primary opacity-0 group-hover:opacity-100 transition-opacity">
            Start →
          </span>
        </div>
      </div>
    </Link>
  );
}
