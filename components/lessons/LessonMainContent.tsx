import { ChevronLeft, ChevronRight } from "lucide-react";
import type { LESSON_BY_ID_QUERYResult } from "@/sanity.types";
import { LessonContent } from "./LessonContent";
import { MuxVideoPlayer } from "./MuxVideoPlayer";

export function LessonMainContent({ lesson, moduleIsFree }: { lesson: NonNullable<LESSON_BY_ID_QUERYResult>; userId: string | null; moduleIsFree: boolean }) {
  const modules = lesson.courses?.[0]?.modules ?? [];
  const allLessons = modules.flatMap((m) => (m.lessons ?? []).map((l) => ({ slug: l.slug?.current ?? "", title: l.title ?? "Untitled", id: l._id })));
  const idx = allLessons.findIndex((l) => l.id === lesson._id);
  const prevLesson = idx > 0 ? allLessons[idx - 1] : null;
  const nextLesson = idx >= 0 && idx < allLessons.length - 1 ? allLessons[idx + 1] : null;

  return <div className="max-w-4xl mx-auto px-6 py-8 pb-24"><div className="mb-6">{moduleIsFree && <span className="text-xs font-semibold px-2 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">FREE</span>}<h1 className="text-3xl font-bold text-foreground mb-2 mt-3">{lesson.title}</h1><p className="text-muted-foreground">{lesson.description}</p></div><div className="rounded-2xl overflow-hidden border border-border mb-8 bg-muted aspect-video"><MuxVideoPlayer playbackId={lesson.video?.asset?.playbackId} title={lesson.title ?? undefined} /></div><div className="prose prose-invert max-w-none"><LessonContent content={lesson.content} /></div><div className="flex justify-between items-center mt-16 pt-6 border-t border-border">{prevLesson ? (<a href={`/lessons/${prevLesson.slug}`} className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border text-muted-foreground hover:text-foreground hover:border-primary/50 hover:bg-muted transition-all duration-200 group"><ChevronLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform duration-200" /><span className="text-sm font-medium">Previous</span></a>) : (<div />)}{nextLesson ? (<a href={`/lessons/${nextLesson.slug}`} className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border text-muted-foreground hover:text-foreground hover:border-primary/50 hover:bg-muted transition-all duration-200 group"><span className="text-sm font-medium">Next</span><ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-200" /></a>) : (<div />)}</div></div>;
}
