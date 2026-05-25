import { Zap } from "lucide-react";

interface CourseSidebarProps {
  course: any;
  cpBalance: number;
}

export function CourseSidebar({ course, cpBalance }: CourseSidebarProps) {
  return (
    <div className="lg:sticky lg:top-6 space-y-4">
      <div className="rounded-2xl border border-border bg-muted p-5">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Your CP Balance</p>
        <div className="flex items-center gap-2 mb-4"><Zap className="w-6 h-6 text-primary" /><span className="text-3xl font-black text-primary">{cpBalance}</span><span className="text-lg font-bold text-muted-foreground">CP</span></div>
        <a href="/store" className="block w-full py-2.5 rounded-xl border border-border text-sm text-muted-foreground text-center hover:border-primary/50 hover:text-foreground transition-all">Buy More CP →</a>
      </div>

      <div className="rounded-2xl border border-border bg-muted p-5">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">This Course Includes</p>
        {[
          { icon: "📚", text: `${course.totalLessons ?? 0} lessons` },
          { icon: "⏱️", text: `~${course.estimatedHours ?? 0} hours` },
          { icon: "🤖", text: "AI tutor in every lesson" },
          { icon: "🏆", text: "Completion certificate" },
          { icon: "⚡", text: "XP points per lesson" },
          { icon: "♾️", text: "Lifetime access" },
        ].map((item) => (
          <div key={item.text} className="flex items-center gap-3 py-2 border-b border-border last:border-0"><span className="text-base">{item.icon}</span><span className="text-sm text-muted-foreground">{item.text}</span></div>
        ))}
      </div>

      <div className="rounded-2xl border border-border bg-muted p-5">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">Module Costs</p>
        {(course.modules ?? []).map((module: any, i: number) => {
          const isFree = module.isFree || (module.cpCost ?? 0) === 0;
          return <div key={module._id} className="flex items-center justify-between py-2 border-b border-border last:border-0"><span className="text-xs text-muted-foreground truncate flex-1 mr-2">{i + 1}. {module.title}</span>{isFree ? <span className="text-xs font-bold text-primary flex-shrink-0">FREE</span> : <span className="text-xs font-bold text-foreground flex-shrink-0">{module.cpCost ?? 100} CP</span>}</div>;
        })}
        <div className="flex items-center justify-between pt-3 mt-1"><span className="text-sm font-semibold text-foreground">Total (paid modules)</span><span className="text-sm font-black text-primary">{(course.modules ?? []).filter((m: any) => !m.isFree && (m.cpCost ?? 0) > 0).reduce((sum: number, m: any) => sum + (m.cpCost ?? 100), 0)} CP</span></div>
      </div>
    </div>
  );
}
