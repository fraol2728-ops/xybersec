"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { saveOnboardingStep1 } from "@/lib/actions/onboarding";

const options = [
  "YouTube / Online Videos",
  "University or School",
  "Friend or Colleague",
  "Self-taught / Books",
  "Work / Professional need",
  "Just curious",
];

export default function Step1Page() {
  const [selected, setSelected] = useState("");
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  return (
    <div className="w-full rounded-2xl border border-border/70 bg-card/60 p-6 sm:p-10">
      <h1 className="text-3xl font-bold sm:text-4xl">How did you get into cybersecurity?</h1>
      <p className="mt-2 text-muted-foreground">We&apos;ll use this to personalize your experience</p>
      <div className="mt-8 grid gap-3 sm:grid-cols-2">
        {options.map((option) => (
          <button
            key={option}
            onClick={() => setSelected(option)}
            className={`rounded-xl border p-4 text-left transition ${selected === option ? "border-cyan-400 bg-cyan-500/10" : "border-border hover:border-cyan-400/50"}`}
          >
            {option}
          </button>
        ))}
      </div>

      <div className="mt-8 flex items-center gap-4">
        <Button
          disabled={!selected || isPending}
          onClick={() =>
            startTransition(async () => {
              await saveOnboardingStep1(selected);
              router.push("/onboarding/step-2");
            })
          }
        >
          Continue
        </Button>
        <Link href="/onboarding" className="text-sm text-muted-foreground hover:text-foreground">
          Back
        </Link>
      </div>
    </div>
  );
}
