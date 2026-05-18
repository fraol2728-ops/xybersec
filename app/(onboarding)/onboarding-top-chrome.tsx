"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";

const widths: Record<string, number> = {
  "/onboarding": 25,
  "/onboarding/step-1": 50,
  "/onboarding/step-2": 75,
  "/onboarding/step-3": 100,
  "/onboarding/welcome": 100,
};

const steps: Record<string, string> = {
  "/onboarding": "Step 1 of 4",
  "/onboarding/step-1": "Step 2 of 4",
  "/onboarding/step-2": "Step 3 of 4",
  "/onboarding/step-3": "Step 4 of 4",
  "/onboarding/welcome": "Step 4 of 4",
};

export function OnboardingTopChrome() {
  const pathname = usePathname();
  const progress = widths[pathname] ?? 25;
  const stepText = steps[pathname] ?? "Step 1 of 4";

  return (
    <>
      <div className="fixed left-0 top-0 z-50 h-[3px] w-full bg-border">
        <div
          className="h-full transition-all duration-500 ease-in-out"
          style={{
            width: `${progress}%`,
            background:
              "linear-gradient(90deg, rgb(34, 211, 238), rgb(129, 140, 248))",
          }}
        />
      </div>

      <header className="fixed left-0 top-0 z-40 w-full border-b border-border/60 bg-background/80 pt-3 backdrop-blur-md">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-5 py-3">
          <div className="flex items-center gap-2">
            <Image
              src="/logo.png"
              width={32}
              height={32}
              alt="XyberSec"
              priority
            />
            <span className="text-sm font-semibold text-foreground">
              XyberSec Academy
            </span>
          </div>
          <p className="text-sm text-muted-foreground">{stepText}</p>
        </div>
      </header>
    </>
  );
}
