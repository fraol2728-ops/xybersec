"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, Search, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";

interface NewCoursesClientProps {
  courses: any[];
  categories: any[];
}

function getDescriptionText(description: unknown): string {
  if (typeof description === "string") return description;

  if (Array.isArray(description)) {
    return description
      .flatMap((block) => {
        if (!block || typeof block !== "object") return [];
        const children = (block as { children?: unknown }).children;
        if (!Array.isArray(children)) return [];
        return children
          .map((child) =>
            child && typeof child === "object" && "text" in child
              ? (child as { text?: unknown }).text
              : "",
          )
          .filter(
            (text): text is string =>
              typeof text === "string" && text.length > 0,
          );
      })
      .join(" ")
      .trim();
  }

  return "";
}

export function NewCoursesClient({
  courses,
  categories,
}: NewCoursesClientProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedTier, setSelectedTier] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
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

    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  const filtered = useMemo(() => {
    let r = [...courses];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      r = r.filter(
        (c) =>
          c.title?.toLowerCase().includes(q) ||
          getDescriptionText(c.description).toLowerCase().includes(q) ||
          c.category?.title?.toLowerCase().includes(q),
      );
    }

    if (selectedCategory !== "all") {
      r = r.filter((c) => c.category?._id === selectedCategory);
    }

    if (selectedTier !== "all") {
      r = r.filter((c) => c.tier === selectedTier);
    }

    if (sortBy === "newest") r = [...r].reverse();
    if (sortBy === "most_lessons") {
      r.sort((a, b) => (b.lessonCount ?? 0) - (a.lessonCount ?? 0));
    }
    if (sortBy === "title_az") {
      r.sort((a, b) => (a.title ?? "").localeCompare(b.title ?? ""));
    }

    return r;
  }, [courses, searchQuery, selectedCategory, selectedTier, sortBy]);

  const hasFilters =
    searchQuery || selectedCategory !== "all" || selectedTier !== "all";

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <section className="relative overflow-hidden rounded-3xl border border-primary/30 bg-gradient-to-br from-muted via-background to-background p-8 sm:p-12 mb-10 shadow-[0_0_80px_-35px_rgba(34,211,238,0.4)]">
        <div
          className="pointer-events-none absolute inset-0 opacity-40"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />

        <div className="relative z-10">
          <p className="text-primary text-xs font-mono uppercase tracking-widest mb-3">
            XyberSec Academy
          </p>
          <h1 className="text-4xl sm:text-5xl font-black text-foreground mb-3">
            Cybersecurity <span className="text-primary">Courses</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mb-6">
            From complete beginner to professional penetration tester. Built for
            Ethiopian cybersecurity students.
          </p>
          <div className="flex flex-wrap gap-3">
            <span className="text-sm text-muted-foreground flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-primary inline-block" />
              {courses.length} courses
            </span>
            <span className="text-sm text-muted-foreground flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block" />
              {courses.filter((c) => c.tier === "free").length} free
            </span>
            <span className="text-sm text-muted-foreground flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-secondary inline-block" />
              First module always free
            </span>
          </div>
        </div>
      </section>

      <div
        className={`flex items-center gap-3 px-5 py-4 rounded-2xl border bg-muted mb-6 transition-all duration-200 ${
          searchQuery
            ? "border-primary shadow-lg shadow-primary/10"
            : "border-border hover:border-primary/40"
        }`}
      >
        <Search
          className={`w-5 h-5 flex-shrink-0 ${
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
        />
        {searchQuery && (
          <button onClick={() => setSearchQuery("")}>
            <X className="w-4 h-4 text-muted-foreground hover:text-foreground" />
          </button>
        )}
        <div className="hidden sm:flex items-center gap-1 text-xs text-muted-foreground">
          <kbd className="px-1.5 py-0.5 rounded bg-background border border-border font-mono text-xs">
            /
          </kbd>
          <span>to search</span>
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2 mb-5 scrollbar-hide">
        <button
          onClick={() => setSelectedCategory("all")}
          className={`flex-shrink-0 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
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
            className={`flex-shrink-0 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
              selectedCategory === cat._id
                ? "bg-primary text-background shadow-lg shadow-primary/20"
                : "bg-muted border border-border text-muted-foreground hover:text-foreground hover:border-primary/40"
            }`}
          >
            {cat.title}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-3 mb-5">
        {["all", "free", "pro"].map((t) => (
          <button
            key={t}
            onClick={() => setSelectedTier(t)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all capitalize ${
              selectedTier === t
                ? t === "free"
                  ? "bg-primary/20 text-primary border border-primary/30"
                  : t === "pro"
                    ? "bg-secondary/20 text-secondary border border-secondary/30"
                    : "bg-foreground/10 text-foreground border border-border"
                : "bg-muted border border-border text-muted-foreground hover:border-primary/40"
            }`}
          >
            {t === "all" ? "All Tiers" : t}
          </button>
        ))}

        <div className="flex-1" />

        <div className="relative">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="appearance-none bg-muted border border-border rounded-xl px-4 py-2 pr-8 text-sm text-foreground cursor-pointer focus:outline-none focus:border-primary/50"
          >
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="most_lessons">Most Lessons</option>
            <option value="title_az">A → Z</option>
          </select>
          <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
        </div>

        {hasFilters && (
          <button
            onClick={() => {
              setSearchQuery("");
              setSelectedCategory("all");
              setSelectedTier("all");
              setSortBy("newest");
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border border-border text-muted-foreground hover:border-red-500/30 hover:text-red-400 transition-all"
          >
            <X className="w-3 h-3" />
            Clear
          </button>
        )}
      </div>

      <p className="text-sm text-muted-foreground mb-5">
        {filtered.length === courses.length
          ? `${courses.length} courses`
          : `${filtered.length} of ${courses.length} courses`}
        {searchQuery && ` for "${searchQuery}"`}
      </p>

      <AnimatePresence mode="popLayout">
        {filtered.length === 0 ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center py-24 text-center col-span-3"
          >
            <div className="w-20 h-20 rounded-2xl bg-muted border border-border flex items-center justify-center mb-5">
              <Search className="w-8 h-8 text-muted-foreground opacity-50" />
            </div>
            <h3 className="text-lg font-bold text-foreground mb-2">
              No courses found
            </h3>
            <p className="text-sm text-muted-foreground mb-5">
              Try different search terms or filters
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("all");
                setSelectedTier("all");
              }}
              className="px-5 py-2.5 rounded-xl bg-primary text-background text-sm font-semibold hover:opacity-90"
            >
              Clear all filters
            </button>
          </motion.div>
        ) : (
          <motion.div
            key="grid"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
          >
            {filtered.map((course, i) => (
              <motion.div
                key={course._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3, delay: i * 0.04, ease: "easeOut" }}
              >
                <CourseCardNew course={course} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function CourseCardNew({ course }: { course: any }) {
  return (
    <Link
      href={`/courses/${course.slug}`}
      className="group flex flex-col rounded-2xl border border-border bg-muted overflow-hidden hover:border-primary/40 hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 h-full"
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
        {course.category?.title && (
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
            {course.category.title}
          </p>
        )}
        <h3 className="text-base font-bold text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors">
          {course.title}
        </h3>
        <p className="text-sm text-muted-foreground line-clamp-2 mb-4 flex-1">
          {getDescriptionText(course.description)}
        </p>
        <div className="flex items-center justify-between pt-3 border-t border-border">
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span>📚 {course.lessonCount ?? 0} lessons</span>
            <span>⏱️ {course.estimatedHours ?? 0}h</span>
          </div>
          <span className="text-xs font-semibold text-primary opacity-0 group-hover:opacity-100 transition-opacity">
            Start →
          </span>
        </div>
      </div>
    </Link>
  );
}
