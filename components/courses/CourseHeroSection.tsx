"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { BookOpen, ChevronRight, Clock, Loader2, Star, Trophy, Users, Zap } from "lucide-react";
import { unlockModuleWithCP } from "@/lib/actions/cp";

interface CourseHeroSectionProps {
  course: any;
  cpBalance: number;
  unlockedModules: Record<string, boolean>;
  userId: string | null;
}

export function CourseHeroSection({ course, cpBalance, unlockedModules }: CourseHeroSectionProps) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const firstFreeModule = course.modules?.find((m: any) => m.isFree || (m.cpCost ?? 0) === 0);
  const firstFreeLesson = firstFreeModule?.lessons?.[0];
  const firstLockedModule = course.modules?.find(
    (m: any) => !m.isFree && (m.cpCost ?? 0) > 0 && !unlockedModules[m._id],
  );

  function handleUnlockFirst() {
    if (!firstLockedModule) return;

    startTransition(async () => {
      const cpCost = firstLockedModule.cpCost ?? 100;
      if (cpBalance < cpCost) {
        router.push("/store");
        return;
      }

      const result = await unlockModuleWithCP(firstLockedModule._id, course._id, cpCost, firstLockedModule.title);
      if ((result as any).success) {
        router.refresh();
      }
      if ((result as any).error === "insufficient_cp") {
        router.push("/store");
      }
    });
  }

  return (
    <div className="bg-muted border-b border-border">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
              <a href="/courses" className="hover:text-foreground transition-colors">Courses</a>
              <ChevronRight className="w-3 h-3" />
              <span className="text-foreground">{course.category?.title ?? "Cybersecurity"}</span>
            </nav>
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="text-xs font-semibold px-2 py-1 rounded bg-primary/20 text-primary border border-primary/30">🎯 CYBERSECURITY</span>
              {course.tier === "free" && <span className="text-xs font-semibold px-2 py-1 rounded bg-green-500/20 text-green-400 border border-green-500/30">FREE TIER</span>}
              <span className="text-xs font-semibold px-2 py-1 rounded bg-muted text-muted-foreground border border-border">BEGINNER FRIENDLY</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-black text-foreground leading-tight mb-4">{course.title}</h1>
            <p className="text-muted-foreground text-lg leading-relaxed mb-6 max-w-2xl">{course.description}</p>
            <div className="flex flex-wrap gap-6 mb-8 text-sm text-muted-foreground">
              <div className="flex items-center gap-1.5"><BookOpen className="w-4 h-4 text-primary" /><span>{course.totalLessons ?? 0} lessons</span></div>
              <div className="flex items-center gap-1.5"><Clock className="w-4 h-4 text-primary" /><span>~{course.estimatedHours ?? 0}h estimated</span></div>
              <div className="flex items-center gap-1.5"><Trophy className="w-4 h-4 text-primary" /><span>Certificate available</span></div>
              <div className="flex items-center gap-1.5"><Star className="w-4 h-4 text-amber-400" /><span className="text-amber-400 font-semibold">5.0</span><span>rating</span></div>
              <div className="flex items-center gap-1.5"><Users className="w-4 h-4 text-primary" /><span>Student favorite</span></div>
            </div>
            <div className="flex flex-wrap gap-3">
              {firstFreeLesson?.slug && (
                <a href={`/lessons/${firstFreeLesson.slug}`} className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-primary text-background font-bold text-sm hover:opacity-90 hover:shadow-xl hover:shadow-primary/25 transition-all">Start Free Module →</a>
              )}
              {firstLockedModule && (
                <button onClick={handleUnlockFirst} disabled={isPending} className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl border border-primary text-primary font-bold text-sm hover:bg-primary/10 transition-all disabled:opacity-70">
                  {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}Unlock Full Course
                </button>
              )}
            </div>
          </div>
          <div className="relative">
            {course.thumbnail?.asset?.url ? (
              <img src={course.thumbnail.asset.url} alt={course.title} className="w-full rounded-2xl border border-border shadow-2xl" />
            ) : (
              <div className="w-full aspect-video rounded-2xl border border-border bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center"><span className="text-7xl">🛡️</span></div>
            )}
            <div className="absolute -bottom-4 -left-4 bg-background border border-border rounded-xl p-3 shadow-xl">
              <div className="flex items-center gap-2"><Zap className="w-4 h-4 text-primary" /><div><p className="text-xs font-bold text-foreground">Your Balance</p><p className="text-sm font-black text-primary">{cpBalance} CP</p></div></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
