"use client";

import { CheckCircle2, Loader2, XCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { saveOnboardingStep0, checkUsernameAvailability } from "@/lib/actions/onboarding";

export default function OnboardingPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [day, setDay] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [status, setStatus] = useState<"idle"|"invalid"|"checking"|"taken"|"available">("idle");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const valid = useMemo(()=>/^[a-zA-Z0-9_]{3,20}$/.test(username),[username]);

  useEffect(()=>{
    if (username.length < 3) return setStatus("idle");
    if (!valid) return setStatus("invalid");
    setStatus("checking");
    const t = setTimeout(async ()=> {
      const res = await checkUsernameAvailability(username);
      setStatus(res.available ? "available" : "taken");
    },500);
    return ()=>clearTimeout(t);
  },[username,valid]);

  const birthdate = year && month && day ? `${year}-${month.padStart(2,"0")}-${day.padStart(2,"0")}` : "";
  const canContinue = status === "available" && !!birthdate;
  const years = Array.from({length: 2010-1970+1},(_,i)=>String(2010-i));

  return <div className="w-full rounded-2xl border border-primary/20 bg-card/70 p-6 transition-all duration-150 ease-in-out sm:p-8">
    <p className="text-sm text-muted-foreground">Step 1 of 4</p>
    <h1 className="mt-2 text-3xl font-semibold">Set up your profile</h1>
    <p className="mt-2 text-muted-foreground">Choose how the world will know you on XyberSec</p>
    <div className="mt-6 space-y-4">
      <div><label className="mb-2 block text-sm">Username</label><Input value={username} placeholder="e.g. xhacker_eth" onChange={(e)=>setUsername(e.target.value.toLowerCase())} /></div>
      <p className="text-sm">{status==="invalid"&&"Only letters, numbers and underscores"}{status==="checking"&&<span className="inline-flex items-center gap-1 text-muted-foreground"><Loader2 className="h-4 w-4 animate-spin"/>Checking...</span>}{status==="taken"&&<span className="inline-flex items-center gap-1 text-red-400"><XCircle className="h-4 w-4"/>Username taken</span>}{status==="available"&&<span className="inline-flex items-center gap-1 text-emerald-400"><CheckCircle2 className="h-4 w-4"/>Available</span>}</p>
      <div>
        <label className="mb-2 block text-sm">Date of birth</label>
        <div className="grid grid-cols-3 gap-2">
          <select className="rounded-md border border-border bg-background p-2" value={day} onChange={(e)=>setDay(e.target.value)}><option value="">Day</option>{Array.from({length:31},(_,i)=><option key={i+1} value={String(i+1)}>{i+1}</option>)}</select>
          <select className="rounded-md border border-border bg-background p-2" value={month} onChange={(e)=>setMonth(e.target.value)}><option value="">Month</option>{Array.from({length:12},(_,i)=><option key={i+1} value={String(i+1)}>{i+1}</option>)}</select>
          <select className="rounded-md border border-border bg-background p-2" value={year} onChange={(e)=>setYear(e.target.value)}><option value="">Year</option>{years.map((y)=><option key={y} value={y}>{y}</option>)}</select>
        </div>
      </div>
      {error && <p className="text-sm text-red-400">{error}</p>}
      <Button className="w-full bg-primary text-primary-foreground" disabled={!canContinue || isPending} onClick={()=>startTransition(async()=>{setError(null);const res=await saveOnboardingStep0(username,birthdate);if(res?.error){setError(res.error);return;}router.push('/onboarding/step-1');})}>{isPending?<Loader2 className="h-4 w-4 animate-spin"/>:"Continue"}</Button>
    </div>
  </div>;
}
