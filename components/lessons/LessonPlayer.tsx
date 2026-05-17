"use client";

import { ArrowLeft, ArrowRight, BookText, NotebookPen } from "lucide-react";
import Link from "next/link";
import { AchievementTracker } from "@/components/achievements/AchievementTracker";
import { CompleteButton } from "@/components/lessons/CompleteButton";
import { LessonProgress } from "@/components/lessons/LessonProgress";
import { LessonResources } from "@/components/lessons/LessonResources";
import { Button } from "@/components/ui/button";
import type { LESSON_BY_ID_QUERYResult } from "@/sanity.types";
import { LessonContent } from "./LessonContent";
import { MuxVideoPlayer } from "./MuxVideoPlayer";

interface LessonPlayerProps {
  lesson: NonNullable<LESSON_BY_ID_QUERYResult>;
  courseId: string;
  totalLessons: number;
  currentLessonIndex: number;
  prevLesson: { slug: string; title: string } | null;
  nextLesson: { slug: string; title: string } | null;
}

export function LessonPlayer({
  lesson,
  courseId,
  totalLessons,
  currentLessonIndex,
  prevLesson,
  nextLesson,
}: LessonPlayerProps) {
  return (
    <>
      <AchievementTracker courseId={courseId} totalLessons={totalLessons} />
      <div className="space-y-6 pb-8">
        <LessonProgress courseId={courseId} totalLessons={totalLessons} />

        <section className="overflow-hidden rounded-3xl border border-cyan-300/25 bg-[#04080f]">
          <div className="relative">
            <MuxVideoPlayer
              playbackId={lesson.video?.asset?.playbackId}
              title={lesson.title ?? undefined}
            />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/95 via-black/45 to-transparent p-4 sm:p-6">
              <p className="text-xs uppercase tracking-[0.2em] text-cyan-300/90">
                Live Lab Briefing
              </p>
              <h1 className="mt-2 text-xl font-semibold text-white sm:text-2xl">
                {lesson.title ?? "Untitled Lesson"}
              </h1>
            </div>
          </div>
        </section>

        <section className="rounded-3xl border border-white/10 bg-[#0c1322] p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-300/80">
                Lesson brief
              </p>
              <h2 className="mt-3 text-2xl font-bold text-white sm:text-3xl">
                {lesson.title ?? "Untitled Lesson"}
              </h2>
              {lesson.description && (
                <p className="mt-4 leading-relaxed text-zinc-300">
                  {lesson.description}
                </p>
              )}
            </div>

            <div className="rounded-xl border border-cyan-400/20 bg-[#070d19] px-4 py-3 text-sm text-zinc-200">
              Progress:{" "}
              <span className="font-semibold text-cyan-300">
                {Math.min(currentLessonIndex + 1, totalLessons)}
              </span>{" "}
              / {totalLessons || 1}
            </div>
          </div>
        </section>

        {lesson.content && (
          <section className="rounded-3xl border border-white/10 bg-[#0a101c] p-6">
            <div className="mb-5 flex items-center gap-3">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-cyan-300/20 bg-cyan-400/10 text-cyan-200">
                <NotebookPen className="h-4 w-4" />
              </span>
              <div>
                <h3 className="font-semibold text-white">Notes</h3>
                <p className="text-sm text-zinc-400">
                  Study notes, commands, and walkthrough references.
                </p>
              </div>
            </div>
            <LessonContent content={lesson.content} />
          </section>
        )}

        <section className="rounded-3xl border border-white/10 bg-[#0a101c] p-6">
          <div className="mb-4 flex items-center gap-3">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-cyan-300/20 bg-cyan-400/10 text-cyan-200">
              <BookText className="h-4 w-4" />
            </span>
            <h3 className="font-semibold text-white">Lesson Resources</h3>
          </div>
          <LessonResources lesson={lesson} />
        </section>

        <section className="rounded-3xl border border-white/10 bg-[#0a101c] p-4 sm:p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex gap-2">
              {prevLesson ? (
                <Link href={`/lessons/${prevLesson.slug}`}>
                  <Button
                    variant="outline"
                    className="border-zinc-700 bg-transparent text-zinc-200 hover:bg-zinc-900"
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Previous
                  </Button>
                </Link>
              ) : (
                <Button
                  variant="outline"
                  disabled
                  className="border-zinc-800 text-zinc-500"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Previous
                </Button>
              )}

              {nextLesson ? (
                <Link href={`/lessons/${nextLesson.slug}`}>
                  <Button className="bg-cyan-400 text-[#031019] hover:bg-cyan-300">
                    Next
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              ) : (
                <Button disabled className="bg-zinc-800 text-zinc-400">
                  Next
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              )}
            </div>

            <CompleteButton courseId={courseId} lessonId={lesson._id} />
          </div>
        </section>
      </div>
    </>
  );
}
