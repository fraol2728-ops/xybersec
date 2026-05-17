"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { saveOnboardingStep2 } from "@/lib/actions/onboarding";

const roleOptions = ["Student", "IT Professional", "Software Developer", "Complete Beginner"];
const educationOptions = ["High School", "Undergraduate", "Graduate / Postgrad", "Self-taught"];

export default function Step2Page() {
  const [role, setRole] = useState("");
  const [education, setEducation] = useState("");
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  return (
    <div className="w-full rounded-2xl border border-border/70 bg-card/60 p-6 sm:p-10">
      <h1 className="text-3xl font-bold sm:text-4xl">Tell us about yourself</h1>
      <p className="mt-2 text-muted-foreground">Help us tailor your learning path</p>
      <h2 className="mt-8 text-lg font-semibold">What best describes your current role?</h2>
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        {roleOptions.map((option) => (
          <button key={option} onClick={() => setRole(option)} className={`rounded-xl border p-4 text-left ${role===option?"border-cyan-400 bg-cyan-500/10":"border-border hover:border-cyan-400/50"}`}>{option}</button>
        ))}
      </div>
      <h2 className="mt-8 text-lg font-semibold">Your education level</h2>
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        {educationOptions.map((option) => (
          <button key={option} onClick={() => setEducation(option)} className={`rounded-xl border p-4 text-left ${education===option?"border-cyan-400 bg-cyan-500/10":"border-border hover:border-cyan-400/50"}`}>{option}</button>
        ))}
      </div>
      <div className="mt-8 flex items-center gap-4">
        <Button disabled={!role || !education || isPending} onClick={() => startTransition(async () => { await saveOnboardingStep2(role, education); router.push('/onboarding/step-3');})}>Continue</Button>
        <Link href="/onboarding/step-1" className="text-sm text-muted-foreground hover:text-foreground">Back</Link>
      </div>
    </div>
  );
}
