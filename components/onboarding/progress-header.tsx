"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Progress } from "@/components/ui/progress";

const stepMap: Record<string, number> = {
  "/onboarding": 1,
  "/onboarding/step-1": 2,
  "/onboarding/step-2": 3,
  "/onboarding/step-3": 4,
};

export function OnboardingProgressHeader() {
  const pathname = usePathname();
  const step = stepMap[pathname] ?? 1;
  const progress = (step / 4) * 100;

  return (
    <div className="w-full border-b border-border/60 bg-background/95 px-4 py-4 sm:px-8">
      <div className="mx-auto flex w-full max-w-5xl items-center gap-4">
        <Link href="/" className="text-lg font-semibold tracking-tight text-foreground">
          XyberSec
        </Link>
        <div className="flex-1">
          <Progress value={progress} className="h-1.5 bg-muted" />
        </div>
      </div>
    </div>
  );
}
