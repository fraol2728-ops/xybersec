"use client";

import { motion } from "framer-motion";
import { ArrowRight, BookOpen, Clock3 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

interface CourseCardProps {
  title: string;
  thumbnailUrl?: string | null;
  lessonCount: number;
  completedLessons: number;
  href: string;
  level?: string | null;
  category?: string | { title?: string | null } | null;
  estimatedTime?: string;
}

export function CourseCard({
  title,
  thumbnailUrl,
  lessonCount,
  completedLessons,
  href,
  level,
  category,
  estimatedTime,
}: CourseCardProps) {
  const safeTotal = Math.max(lessonCount, 0);
  const safeCompleted = Math.min(Math.max(completedLessons, 0), safeTotal || 0);
  const progress =
    safeTotal > 0 ? Math.round((safeCompleted / safeTotal) * 100) : 0;

  const difficultyLabel = level ?? "All Levels";
  const categoryLabel =
    typeof category === "string"
      ? category
      : typeof category?.title === "string"
        ? category.title
        : "General";
  const estimatedDuration =
    estimatedTime ?? `${Math.max(1, Math.ceil(safeTotal / 3))} hours`;

  const [animatedProgress, setAnimatedProgress] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setAnimatedProgress(progress), 120);
    return () => clearTimeout(timer);
  }, [progress]);

  return (
    <motion.article
      className="group overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/70 shadow-sm transition duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-violet-500/20"
      whileHover={{ y: -4 }}
    >
      <div className="relative aspect-video overflow-hidden rounded-t-2xl bg-zinc-800">
        {thumbnailUrl ? (
          <Image
            src={thumbnailUrl}
            alt={title}
            fill
            className="object-cover transition duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 25vw"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-zinc-800 to-zinc-900 text-zinc-500">
            <BookOpen className="h-8 w-8" />
          </div>
        )}
      </div>

      <div className="space-y-4 p-5">
        <h3 className="line-clamp-2 text-lg font-semibold text-white">
          {title}
        </h3>

        <div className="flex flex-wrap items-center gap-2 text-xs">
          <Badge className="border border-cyan-400/30 bg-cyan-500/10 text-cyan-200">
            {difficultyLabel}
          </Badge>
          <Badge
            variant="outline"
            className="border-zinc-700 bg-zinc-800/80 text-zinc-200"
          >
            {categoryLabel}
          </Badge>
        </div>

        <div className="flex items-center gap-2 text-sm text-zinc-300">
          <Clock3 className="h-4 w-4 text-violet-300" />
          <span>{estimatedDuration}</span>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-zinc-300">
            <span>Progress</span>
            <span>{progress}%</span>
          </div>
          <Progress
            value={animatedProgress}
            className="h-2 bg-zinc-800 [&_[data-slot=progress-indicator]]:bg-gradient-to-r [&_[data-slot=progress-indicator]]:from-violet-500 [&_[data-slot=progress-indicator]]:to-fuchsia-500 [&_[data-slot=progress-indicator]]:duration-1000"
          />
        </div>

        <Button
          asChild
          variant="outline"
          className="w-full border-violet-400/30 bg-violet-500/10 text-violet-200 hover:border-violet-300/50 hover:bg-violet-500/20 hover:text-white hover:shadow-[0_0_20px_rgba(139,92,246,0.35)]"
        >
          <Link href={href}>
            Continue Course
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>
    </motion.article>
  );
}
