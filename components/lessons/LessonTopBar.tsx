import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

interface LessonTopBarProps {
  lessonTitle: string;
  courseTitle: string;
  moduleIsFree: boolean;
}

export function LessonTopBar({ lessonTitle, courseTitle, moduleIsFree }: LessonTopBarProps) {
  return (
    <div className="h-[52px] fixed top-0 left-0 right-0 z-40 bg-background/95 backdrop-blur-sm border-b border-border flex items-center justify-between px-4 lg:px-6">
      <div className="flex items-center gap-2 text-sm min-w-0">
        <Link href="/courses" className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors"><ChevronLeft className="w-4 h-4" />Courses</Link>
        <ChevronRight className="w-3 h-3 text-muted-foreground" />
        <span className="text-muted-foreground truncate">{courseTitle}</span>
        <ChevronRight className="w-3 h-3 text-muted-foreground" />
        <span className="text-foreground font-medium truncate">{lessonTitle}</span>
      </div>
      <div className="flex items-center gap-2">{moduleIsFree && <span className="text-xs font-semibold px-2 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">FREE</span>}<div className="w-6 h-6 rounded-md bg-muted border border-border flex items-center justify-center text-[10px] font-bold text-primary">XS</div></div>
    </div>
  );
}
