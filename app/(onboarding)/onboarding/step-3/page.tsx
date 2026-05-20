"use client";

import {
  Bug,
  CheckCircle2,
  DollarSign,
  Flag,
  Globe,
  Network,
  Search,
  Terminal,
  UserX,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { saveOnboardingStep3 } from "@/lib/actions/onboarding";

const goals = [
  {
    icon: Globe,
    label: "Web App Hacking",
    value: "web_hacking",
    sub: "Bug bounty, XSS, SQLi",
  },
  {
    icon: Network,
    label: "Network Security",
    value: "network_pentesting",
    sub: "Pentesting, protocols",
  },
  {
    icon: Bug,
    label: "Malware Analysis",
    value: "malware_analysis",
    sub: "Reverse engineering",
  },
  {
    icon: Search,
    label: "Digital Forensics",
    value: "digital_forensics",
    sub: "Investigation & analysis",
  },
  {
    icon: UserX,
    label: "Social Engineering",
    value: "social_engineering",
    sub: "Human hacking",
  },
  {
    icon: Flag,
    label: "CTF Challenges",
    value: "ctf",
    sub: "Competitions & flags",
  },
  {
    icon: DollarSign,
    label: "Bug Bounty",
    value: "bug_bounty",
    sub: "Get paid to hack",
  },
  {
    icon: Terminal,
    label: "Linux & CLI",
    value: "linux",
    sub: "Command line mastery",
  },
];

export default function Page() {
  const [selected, setSelected] = useState<string[]>([]);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const toggle = (v: string) =>
    setSelected((p) => (p.includes(v) ? p.filter((i) => i !== v) : [...p, v]));

  return (
    <div className="mx-auto w-full max-w-lg py-12">
      <p className="mb-3 text-sm font-medium tracking-wide text-primary">
        LEARNING GOALS
      </p>
      <h1 className="mb-2 text-3xl font-bold text-foreground">
        What do you want to learn?
      </h1>
      <p className="mb-8 text-muted-foreground">
        Select everything that interests you — pick as many as you want
      </p>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {goals.map((o) => {
          const I = o.icon;
          const active = selected.includes(o.value);
          return (
            <button
              type="button"
              key={o.value}
              onClick={() => toggle(o.value)}
              className={`group relative flex flex-col gap-2 rounded-xl border border-border bg-muted p-4 text-left transition-all duration-200 hover:border-primary/50 hover:bg-muted/80 ${active ? "border-primary bg-primary/5 shadow-lg shadow-primary/10" : ""}`}
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

      <button
        type="button"
        className="mt-8 w-full rounded-lg bg-primary py-4 text-sm font-semibold text-background transition-all duration-200 hover:opacity-90 hover:shadow-xl hover:shadow-primary/20 disabled:cursor-not-allowed disabled:opacity-40"
        disabled={selected.length < 1 || isPending}
        onClick={() =>
          startTransition(async () => {
            const result = await saveOnboardingStep3(selected);
            if (result?.success) {
              router.push("/onboarding/welcome");
            }
          })
        }
      >
        Start Learning →
      </button>
      <div className="text-center">
        <button
          type="button"
          onClick={() => router.push("/onboarding/step-2")}
          className="mt-4 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          ← Back
        </button>
      </div>
    </div>
  );
}
