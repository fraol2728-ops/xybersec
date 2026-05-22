import { UserButton } from "@clerk/nextjs";

interface LessonTopBarProps {
  lessonTitle: string;
  moduleIsFree?: boolean;
}

export function LessonTopBar({ lessonTitle, moduleIsFree = false }: LessonTopBarProps) {
  return (
    <div className="fixed top-0 left-0 right-0 z-50 h-14 bg-background/95 backdrop-blur-md border-b border-border">
      <div className="h-full flex justify-between items-center px-4">
        <a href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <img src="/logo.png" alt="XyberSec" className="w-7 h-7" />
          <span className="font-bold text-sm text-foreground hidden sm:block">XyberSec</span>
        </a>

        <div className="flex items-center gap-2 max-w-xs lg:max-w-md">
          <span className="text-sm text-muted-foreground truncate">{lessonTitle}</span>
          {moduleIsFree && (
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 flex-shrink-0">
              FREE
            </span>
          )}
        </div>

        <div className="flex items-center gap-3">
          <a
            href="/dashboard"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors hidden sm:block"
          >
            Dashboard
          </a>
          <div className="w-px h-4 bg-border" />
          <UserButton afterSignOutUrl="/" />
        </div>
      </div>
    </div>
  );
}
