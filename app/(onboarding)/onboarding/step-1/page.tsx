"use client";

import {
  CheckCircle2,
  GraduationCap,
  Instagram,
  Search,
  Sparkles,
  Users,
  Youtube,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { saveOnboardingStep1 } from "@/lib/actions/onboarding";

const options = [
  {
    icon: Youtube,
    value: "youtube",
    title: "YouTube / TikTok",
    sub: "Found a video or short",
  },
  {
    icon: Users,
    value: "friend",
    title: "Friend or Colleague",
    sub: "Someone recommended it",
  },
  {
    icon: Search,
    value: "google",
    title: "Google Search",
    sub: "Searched and found us",
  },
  {
    icon: GraduationCap,
    value: "university",
    title: "University / School",
    sub: "Teacher or classmate",
  },
  {
    icon: Instagram,
    value: "social_media",
    title: "Social Media",
    sub: "Instagram, Telegram, Twitter",
  },
  {
    icon: Sparkles,
    value: "other",
    title: "Somewhere Else",
    sub: "Another way entirely",
  },
];

export default function Page() {
  const [selected, setSelected] = useState("");
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  return (
    <div className="mx-auto w-full max-w-lg py-12">
      <p className="mb-3 text-sm font-medium tracking-wide text-primary">
        DISCOVERY
      </p>
      <h1 className="mb-2 text-3xl font-bold text-foreground">
        Where did you hear about XyberSec Academy?
      </h1>
      <p className="mb-8 text-muted-foreground">
        This helps us understand how to reach more Ethiopian cybersecurity
        students
      </p>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {options.map((o) => {
          const I = o.icon;
          const active = selected === o.value;
          return (
            <button
              type="button"
              key={o.value}
              onClick={() => setSelected(o.value)}
              className={`group relative flex flex-col gap-2 rounded-xl border border-border bg-muted p-4 text-left transition-all duration-200 hover:border-primary/50 hover:bg-muted/80 ${
                active
                  ? "border-primary bg-primary/5 shadow-lg shadow-primary/10"
                  : ""
              }`}
            >
              {active && (
                <div className="absolute right-3 top-3">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                </div>
              )}
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-background transition-colors duration-200 group-hover:bg-primary/10">
                <I className="h-5 w-5 text-primary" />
              </div>
              <p className="text-sm font-semibold text-foreground">{o.title}</p>
              <p className="mt-0.5 text-xs text-muted-foreground">{o.sub}</p>
            </button>
          );
        })}
      </div>

      <button
        type="button"
        className="mt-8 w-full rounded-lg bg-primary py-3.5 text-sm font-semibold text-background transition-all duration-200 hover:opacity-90 hover:shadow-lg hover:shadow-primary/25 disabled:cursor-not-allowed disabled:opacity-40"
        disabled={!selected || isPending}
        onClick={() =>
          startTransition(async () => {
            await saveOnboardingStep1(selected);
            router.push("/onboarding/step-2");
          })
        }
      >
        Continue →
      </button>

      <div className="text-center">
        <button
          type="button"
          onClick={() => router.push("/onboarding")}
          className="mt-4 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          ← Back
        </button>
      </div>
    </div>
  );
}
