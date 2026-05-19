"use client";

import { motion } from "framer-motion";
import { BookOpen, CheckCircle2, Circle, Play } from "lucide-react";
import Link from "next/link";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Progress } from "@/components/ui/progress";
import type { COURSE_WITH_MODULES_QUERYResult } from "@/sanity.types";

type Module = NonNullable<
  NonNullable<COURSE_WITH_MODULES_QUERYResult>["modules"]
>[number];
type Lesson = NonNullable<Module["lessons"]>[number];

interface ModuleAccordionProps {
  modules: Module[] | null;
  userId?: string | null;
  isEnrolled?: boolean;
}

export function ModuleAccordion({ modules, userId, isEnrolled = false }: ModuleAccordionProps) {
  if (!modules?.length) {
    return (
      <div className="py-12 text-center text-zinc-500">
        <BookOpen className="mx-auto mb-4 h-12 w-12 opacity-50" />
        <p>No modules available yet.</p>
      </div>
    );
  }

  const isLessonCompleted = (lesson: Lesson) =>
    !!(userId && lesson.completedBy?.includes(userId));

  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
    >
      <h2 className="mb-6 text-2xl font-bold">Modules</h2>

      <Accordion type="multiple" className="space-y-3">
        {modules.map((module, index) => {
          const total = module.lessons?.length ?? 0;
          const completed =
            module.lessons?.filter((lesson) => isLessonCompleted(lesson))
              .length ?? 0;

          return (
            <motion.div
              key={module._id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.35 }}
              transition={{ delay: index * 0.06, duration: 0.35 }}
            >
              <AccordionItem
                value={module._id}
                className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/55 data-[state=open]:border-cyan-500/30"
              >
                <AccordionTrigger className="px-5 py-4 hover:bg-zinc-800/40 hover:no-underline">
                  <div className="flex flex-1 items-center gap-4 text-left">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-500/15 text-sm font-bold text-cyan-300">
                      {index + 1}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-semibold text-white">
                        Module {index + 1} — {module.title ?? "Untitled"}
                      </h3>
                      <p className="mt-1 text-xs text-zinc-500">
                        {completed}/{total} completed
                      </p>
                    </div>
                    <div className="hidden items-center gap-2 sm:flex">
                      {(module as any).isFree ? (
                        <span className="rounded-full border border-primary/30 bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
                          FREE
                        </span>
                      ) : !isEnrolled ? (
                        <span className="rounded-full border border-border bg-muted px-2 py-0.5 text-xs font-semibold text-muted-foreground">
                          🔒 LOCKED
                        </span>
                      ) : null}
                    </div>
                    <div className="hidden w-40 items-center gap-3 sm:flex">
                      <Progress
                        value={total ? (completed / total) * 100 : 0}
                        className="h-2 bg-zinc-800 [&>div]:bg-cyan-400"
                      />
                      {completed === total && total > 0 && (
                        <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                      )}
                    </div>
                  </div>
                </AccordionTrigger>

                <AccordionContent className="px-5 pb-4 pt-1">
                  <div className="space-y-1 border-l border-zinc-700 pl-3">
                    {module.lessons?.map((lesson) => {
                      const completedState = isLessonCompleted(lesson);

                      const isLocked = !(module as any).isFree && !isEnrolled;
                      const lessonClassName = `flex items-center gap-2.5 rounded-md px-2 py-2 text-sm text-zinc-300 transition ${
                        isLocked ? "opacity-50" : "hover:bg-zinc-800/50"
                      }`;

                      if (isLocked) {
                        return (
                          <div key={lesson._id} className={lessonClassName}>
                            {completedState ? (
                              <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
                            ) : (
                              <Circle className="h-4 w-4 shrink-0 text-zinc-600" />
                            )}
                            <span className="flex-1">
                              {lesson.title ?? "Untitled Lesson"}
                            </span>
                            <Play className="h-4 w-4 text-cyan-400" />
                          </div>
                        );
                      }

                      return (
                        <Link
                          key={lesson._id}
                          href={`/lessons/${lesson.slug}`}
                          className={lessonClassName}
                        >
                          {completedState ? (
                            <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
                          ) : (
                            <Circle className="h-4 w-4 shrink-0 text-zinc-600" />
                          )}
                          <span className="flex-1">
                            {lesson.title ?? "Untitled Lesson"}
                          </span>
                          <Play className="h-4 w-4 text-cyan-400" />
                        </Link>
                      );
                    })}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </motion.div>
          );
        })}
      </Accordion>
    </motion.section>
  );
}
