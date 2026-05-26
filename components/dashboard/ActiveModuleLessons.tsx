interface ActiveModuleLessonsProps {
  activeCourse: {
    _id: string;
    title: string;
    slug: string;
    modules?: {
      _id: string;
      title: string;
      isFree: boolean;
      cpCost?: number;
      lessons: {
        _id: string;
        title: string;
        slug: string;
      }[];
    }[];
  } | null;
  completedLessonIds: string[];
  unlockedModuleIds: string[];
}

export function ActiveModuleLessons({ activeCourse, completedLessonIds, unlockedModuleIds }: ActiveModuleLessonsProps) {
  if (!activeCourse?.modules?.length) return null;

  const activeModule = (() => {
    if (!activeCourse?.modules) return null;

    for (const module of activeCourse.modules) {
      const isFree = module.isFree || (module.cpCost ?? 0) === 0;
      const isUnlocked = isFree || unlockedModuleIds.includes(module._id);
      if (!isUnlocked) continue;

      const lessons = module.lessons ?? [];
      const allDone = lessons.length > 0 && lessons.every((l) => completedLessonIds.includes(l._id));
      if (!allDone) return module;
    }

    return null;
  })();

  if (!activeModule) {
    return (
      <div className="rounded-2xl border border-border bg-muted p-6">
        <h3 className="text-sm font-bold text-foreground mb-1">You&apos;ve completed all unlocked modules!</h3>
        <p className="text-sm text-muted-foreground mb-3">Unlock the next module to keep progressing.</p>
        <a href="/courses" className="text-sm font-semibold text-primary hover:opacity-80 transition-opacity">Browse courses and unlock next module →</a>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-border bg-muted overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-border">
        <div>
          <p className="text-xs font-semibold text-muted-foreground tracking-wider uppercase mb-0.5">Current Module</p>
          <h3 className="text-sm font-bold text-foreground">{activeModule?.title ?? "Loading..."}</h3>
        </div>
        <div className="flex items-center gap-2">
          {activeModule?.isFree && <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">FREE</span>}
          <span className="text-xs text-muted-foreground">{activeModule?.lessons.filter((l) => completedLessonIds.includes(l._id)).length ?? 0}/{activeModule?.lessons.length ?? 0} done</span>
        </div>
      </div>
      <div className="divide-y divide-border">
        {(activeModule?.lessons ?? []).map((lesson, index) => {
          const isCompleted = completedLessonIds.includes(lesson._id);
          const isNext = !isCompleted && (activeModule?.lessons ?? []).slice(0, index).every((l) => completedLessonIds.includes(l._id));
          return (
            <a key={lesson._id} href={`/lessons/${lesson.slug}`} className={`flex items-center gap-4 px-5 py-3.5 transition-all hover:bg-background/50 group ${isNext ? "bg-primary/5" : ""}`}>
              <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold transition-all ${isCompleted ? "bg-primary/20 text-primary border border-primary/40" : isNext ? "bg-primary text-background shadow-lg shadow-primary/30 animate-pulse" : "bg-muted-foreground/10 text-muted-foreground border border-border"}`}>{isCompleted ? "✓" : isNext ? "▶" : index + 1}</div>
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-medium truncate transition-colors ${isCompleted ? "text-muted-foreground line-through" : isNext ? "text-primary" : "text-foreground group-hover:text-primary"}`}>{lesson.title}</p>
                {isNext && <p className="text-xs text-primary/70 mt-0.5">Up next</p>}
                {isCompleted && <p className="text-xs text-muted-foreground mt-0.5">Completed ✓</p>}
              </div>
              {!isCompleted && <span className={`text-xs flex-shrink-0 transition-colors ${isNext ? "text-primary" : "text-muted-foreground group-hover:text-foreground"}`}>→</span>}
            </a>
          );
        })}
      </div>
    </div>
  );
}
