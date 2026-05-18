"use client";

import { CheckCircle2, Code2, GraduationCap, Shield, Zap } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { saveOnboardingStep2 } from "@/lib/actions/onboarding";

const roles = [
  {
    icon: GraduationCap,
    label: "Student",
    value: "student",
    sub: "Currently studying",
  },
  {
    icon: Shield,
    label: "IT Professional",
    value: "it_professional",
    sub: "Working in tech/IT",
  },
  { icon: Code2, label: "Developer", value: "developer", sub: "I write code" },
  {
    icon: Zap,
    label: "Total Beginner",
    value: "beginner",
    sub: "Brand new to this",
  },
];

const levels = [
  { label: "High School", value: "high_school", sub: "Secondary education" },
  {
    label: "Undergraduate",
    value: "undergraduate",
    sub: "Currently in university",
  },
  { label: "Graduate", value: "graduate", sub: "Masters or PhD" },
  { label: "Self-taught", value: "self_taught", sub: "I learn on my own" },
];

export default function Page() {
  const [role, setRole] = useState("");
  const [education, setEducation] = useState("");
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const cardBase =
    "group relative flex flex-col gap-2 rounded-xl border border-border bg-muted p-4 text-left transition-all duration-200 hover:border-primary/50 hover:bg-muted/80";

  return (
    <div className="mx-auto w-full max-w-lg py-12">
      <p className="mb-3 text-sm font-medium tracking-wide text-primary">
        ABOUT YOU
      </p>
      <h1 className="mb-2 text-3xl font-bold text-foreground">
        Tell us about yourself
      </h1>
      <p className="mb-8 text-muted-foreground">
        We&apos;ll recommend the perfect starting point for you
      </p>

      <p className="mb-3 text-sm font-semibold text-foreground">
        What best describes you?
      </p>
      <div className="grid grid-cols-2 gap-3">
        {roles.map((o) => {
          const I = o.icon;
          const active = role === o.value;
          return (
            <button
              type="button"
              key={o.value}
              onClick={() => setRole(o.value)}
              className={`${cardBase} ${active ? "border-primary bg-primary/5 shadow-lg shadow-primary/10" : ""}`}
            >
              {active && (
                <div className="absolute right-3 top-3">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                </div>
              )}
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-background transition-colors duration-200 group-hover:bg-primary/10">
                <I className="h-5 w-5 text-primary" />
              </div>
              <p className="text-sm font-semibold text-foreground">{o.label}</p>
              <p className="mt-0.5 text-xs text-muted-foreground">{o.sub}</p>
            </button>
          );
        })}
      </div>

      <p className="mb-3 mt-6 text-sm font-semibold text-foreground">
        Education level
      </p>
      <div className="grid grid-cols-2 gap-3">
        {levels.map((o) => {
          const active = education === o.value;
          return (
            <button
              type="button"
              key={o.value}
              onClick={() => setEducation(o.value)}
              className={`${cardBase} ${active ? "border-primary bg-primary/5 shadow-lg shadow-primary/10" : ""}`}
            >
              {active && (
                <div className="absolute right-3 top-3">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                </div>
              )}
              <p className="text-sm font-semibold text-foreground">{o.label}</p>
              <p className="mt-0.5 text-xs text-muted-foreground">{o.sub}</p>
            </button>
          );
        })}
      </div>

      <button
        type="button"
        className="mt-8 w-full rounded-lg bg-primary py-3.5 text-sm font-semibold text-background transition-all duration-200 hover:opacity-90 hover:shadow-lg hover:shadow-primary/25 disabled:cursor-not-allowed disabled:opacity-40"
        disabled={!role || !education || isPending}
        onClick={() =>
          startTransition(async () => {
            await saveOnboardingStep2(role, education);
            router.push("/onboarding/step-3");
          })
        }
      >
        Continue →
      </button>
      <div className="text-center">
        <button
          type="button"
          onClick={() => router.push("/onboarding/step-1")}
          className="mt-4 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          ← Back
        </button>
      </div>
    </div>
  );
}
