"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CheckCircle2, ChevronDown, ChevronUp, Loader2, Lock, Play, Zap } from "lucide-react";
import { unlockModuleWithCP } from "@/lib/actions/cp";

interface CourseModuleListProps {
  course: any;
  unlockedModules: Record<string, boolean>;
  cpBalance: number;
  userId: string | null;
}

export function CourseModuleList({ course, unlockedModules, cpBalance }: CourseModuleListProps) {
  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set([course.modules?.[0]?._id].filter(Boolean)));
  const [unlocking, setUnlocking] = useState<string | null>(null);
  const [localUnlocked, setLocalUnlocked] = useState<Record<string, boolean>>(unlockedModules);
  const [localBalance, setLocalBalance] = useState(cpBalance);
  const [, startTransition] = useTransition();
  const router = useRouter();

  function toggleModule(moduleId: string) { setExpandedModules((prev) => { const next = new Set(prev); next.has(moduleId) ? next.delete(moduleId) : next.add(moduleId); return next; }); }

  function handleUnlock(moduleId: string, cpCost: number, moduleTitle: string, courseId: string) {
    if (localBalance < cpCost) { router.push("/store"); return; }
    setUnlocking(moduleId);
    startTransition(async () => {
      const result = await unlockModuleWithCP(moduleId, courseId, cpCost, moduleTitle);
      if ((result as any).success) {
        setLocalUnlocked((prev) => ({ ...prev, [moduleId]: true }));
        setLocalBalance((prev) => prev - cpCost);
        setExpandedModules((prev) => new Set([...prev, moduleId]));
        setTimeout(() => router.push("/dashboard"), 1500);
      }
      if ((result as any).error === "insufficient_cp") router.push("/store");
      setUnlocking(null);
    });
  }

  return <div><div className="mb-6"><h2 className="text-2xl font-bold text-foreground mb-1">Course Content</h2><p className="text-muted-foreground text-sm">{course.totalModules ?? 0} modules · {course.totalLessons ?? 0} lessons · ~{course.estimatedHours ?? 0}h total</p></div>{(course.modules ?? []).map((module: any, index: number) => {const isFree = module.isFree || (module.cpCost ?? 0) === 0; const isUnlocked = isFree || localUnlocked[module._id]; const cpCost = module.cpCost ?? 100; const isExpanded = expandedModules.has(module._id); const isUnlocking = unlocking === module._id; return (<div key={module._id} className={`rounded-2xl border overflow-hidden mb-3 transition-all duration-200 ${isUnlocked ? "border-border bg-muted" : "border-border/50 bg-muted/50"}`}><div className="flex items-center justify-between p-5 cursor-pointer hover:bg-background/30 transition-colors" onClick={() => toggleModule(module._id)}><div className="flex items-center gap-4"><div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-black flex-shrink-0 ${isUnlocked ? "bg-primary/10 text-primary border border-primary/20" : "bg-muted-foreground/10 text-muted-foreground border border-border"}`}>{index + 1}</div><div><h3 className={`font-semibold ${isUnlocked ? "text-foreground" : "text-muted-foreground"}`}>{module.title}</h3><div className="flex items-center gap-3 mt-0.5"><span className="text-xs text-muted-foreground">{module.lessonCount ?? module.lessons?.length ?? 0} lessons</span><span className="text-xs text-muted-foreground">~{Math.round((((module.lessonCount ?? module.lessons?.length ?? 0) * 15) / 60) * 10) / 10}h</span></div></div></div><div className="flex items-center gap-3">{isFree ? <span className="text-xs font-bold px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">FREE</span> : isUnlocked ? <span className="text-xs font-bold px-3 py-1 rounded-full bg-green-500/10 text-green-400 border border-green-500/20 flex items-center gap-1"><CheckCircle2 className="w-3 h-3" />Unlocked</span> : <div className="flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full bg-muted-foreground/10 text-muted-foreground border border-border"><Zap className="w-3 h-3" />{cpCost} CP</div>}{isExpanded ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}</div></div>{isExpanded && <div className="border-t border-border">{module.description && <p className="px-5 py-3 text-sm text-muted-foreground border-b border-border">{module.description}</p>}{isUnlocked ? <div className="divide-y divide-border">{(module.lessons ?? []).map((lesson: any) => (<Link key={lesson._id} href={`/lessons/${lesson.slug}`} className="flex items-center gap-4 px-5 py-3 hover:bg-background/50 transition-colors group"><div className="w-7 h-7 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors"><Play className="w-3 h-3 text-primary" /></div><span className="text-sm text-foreground group-hover:text-primary transition-colors flex-1 truncate">{lesson.title}</span><span className="text-xs text-muted-foreground flex-shrink-0">~15 min</span></Link>))}</div> : <div className="px-5 py-6 text-center"><Lock className="w-8 h-8 text-muted-foreground mx-auto mb-3 opacity-50" /><p className="text-sm text-muted-foreground mb-1">{module.lessons?.length ?? 0} lessons locked</p><p className="text-xs text-muted-foreground mb-4">Unlock this module to access all lessons</p><button onClick={() => handleUnlock(module._id, cpCost, module.title, course._id)} disabled={isUnlocking} className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all disabled:opacity-60 ${localBalance >= cpCost ? "bg-primary text-background hover:opacity-90 hover:shadow-lg hover:shadow-primary/25" : "bg-muted border border-border text-muted-foreground hover:border-primary/50"}`}>{isUnlocking ? <><Loader2 className="w-4 h-4 animate-spin" />Unlocking...</> : localBalance >= cpCost ? <><Zap className="w-4 h-4" />Unlock for {cpCost} CP</> : <><Zap className="w-4 h-4" />Need {cpCost - localBalance} more CP</>}</button>{localBalance < cpCost && <a href="/store" className="block mt-2 text-xs text-primary hover:opacity-80 transition-opacity">Buy CyberPoints →</a>}</div>}</div>}</div>);})}</div>;
}
