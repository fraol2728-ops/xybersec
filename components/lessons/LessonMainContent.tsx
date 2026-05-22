import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import type { LESSON_BY_ID_QUERYResult } from "@/sanity.types";
import { LessonContent } from "./LessonContent";
import { MuxVideoPlayer } from "./MuxVideoPlayer";

export function LessonMainContent({ lesson, moduleIsFree }: { lesson: NonNullable<LESSON_BY_ID_QUERYResult>; userId: string | null; moduleIsFree: boolean }) {
  const modules = lesson.courses?.[0]?.modules ?? [];
  const allLessons = modules.flatMap((m) => (m.lessons ?? []).map((l) => ({ slug: l.slug?.current ?? "", title: l.title ?? "Untitled", id: l._id })));
  const idx = allLessons.findIndex((l) => l.id === lesson._id);
  const prevLesson = idx > 0 ? allLessons[idx - 1] : null;
  const nextLesson = idx >= 0 && idx < allLessons.length - 1 ? allLessons[idx + 1] : null;

  return <div className="max-w-4xl mx-auto px-6 py-8 pb-24"><div className="mb-6">{moduleIsFree && <span className="text-xs font-semibold px-2 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">FREE</span>}<h1 className="text-3xl font-bold text-foreground mb-2 mt-3">{lesson.title}</h1><p className="text-muted-foreground">{lesson.description}</p></div><div className="rounded-2xl overflow-hidden border border-border mb-8 bg-muted aspect-video"><MuxVideoPlayer playbackId={lesson.video?.asset?.playbackId} title={lesson.title ?? undefined} /></div><div className="prose prose-invert max-w-none"><LessonContent content={lesson.content} /></div><div className="flex justify-between items-center mt-12 pt-6 border-t border-border">{prevLesson && <Link href={`/lessons/${prevLesson.slug}`} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors group"><ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /><div><p className="text-xs text-muted-foreground">Previous</p><p className="font-medium truncate max-w-[200px]">{prevLesson.title}</p></div></Link>}{nextLesson && <Link href={`/lessons/${nextLesson.slug}`} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors group ml-auto"><div className="text-right"><p className="text-xs text-muted-foreground">Next</p><p className="font-medium truncate max-w-[200px]">{nextLesson.title}</p></div><ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" /></Link>}</div></div>;
}
