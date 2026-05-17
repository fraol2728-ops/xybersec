"use client";

import { Check } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { saveOnboardingStep3 } from "@/lib/actions/onboarding";

const options = [
  "Web Application Hacking",
  "Network Penetration Testing",
  "Malware Analysis",
  "Digital Forensics",
  "Social Engineering",
  "CTF Challenges",
  "Bug Bounty Hunting",
  "Linux & Command Line",
];

export default function Step3Page() {
  const [selected, setSelected] = useState<string[]>([]);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const toggle = (item: string) => {
    setSelected((prev) => (prev.includes(item) ? prev.filter((p) => p !== item) : [...prev, item]));
  };

  return (
    <div className="w-full rounded-2xl border border-border/70 bg-card/60 p-6 sm:p-10">
      <h1 className="text-3xl font-bold sm:text-4xl">What do you want to learn?</h1>
      <p className="mt-2 text-muted-foreground">Select all that apply — you can always change this later</p>
      <div className="mt-8 grid gap-3 sm:grid-cols-2">
        {options.map((option) => {
          const active = selected.includes(option);
          return (
            <button key={option} onClick={() => toggle(option)} className={`flex items-center justify-between rounded-xl border p-4 text-left ${active ? "border-cyan-400 bg-cyan-500/10" : "border-border hover:border-cyan-400/50"}`}>
              <span>{option}</span>
              {active ? <Check className="h-4 w-4 text-cyan-300" /> : null}
            </button>
          );
        })}
      </div>
      <div className="mt-8 flex items-center gap-4">
        <Button disabled={selected.length < 1 || isPending} onClick={() => startTransition(async ()=>{ await saveOnboardingStep3(selected); router.push('/dashboard'); })}>Start Learning</Button>
        <Link href="/onboarding/step-2" className="text-sm text-muted-foreground hover:text-foreground">Back</Link>
      </div>
    </div>
  );
}
