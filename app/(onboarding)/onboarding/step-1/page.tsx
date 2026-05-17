"use client";
import { Check, GraduationCap, Users, BookOpen, Briefcase, Sparkles, Play, Linkedin, Instagram } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { saveOnboardingStep1 } from "@/lib/actions/onboarding";
const options=[
{icon:Play,title:"Online Videos",desc:"YouTube, tutorials, online courses"},
{icon:Play,title:"Tiktok",desc:"Short-form creator content"},
{icon:Instagram,title:"Instagram",desc:"Learning from creators and clips"},
{icon:Linkedin,title:"linkedin",desc:"Professional learning network"},
{icon:GraduationCap,title:"University / School",desc:"Formal education or bootcamp"},
{icon:Users,title:"Friend or Colleague",desc:"Someone introduced me to it"},
{icon:BookOpen,title:"Self-taught",desc:"Books, docs, and experimentation"},
{icon:Briefcase,title:"Work / Career",desc:"Professional or job requirement"},
{icon:Sparkles,title:"Just Curious",desc:"I wanted to explore something new"},];
export default function Page(){const [selected,setSelected]=useState("");const [isPending,startTransition]=useTransition();const router=useRouter();
return <div className="w-full rounded-2xl border border-primary/20 bg-card/70 p-6 sm:p-8"><p className="text-sm text-muted-foreground">Step 2 of 4</p><h1 className="mt-2 text-3xl font-semibold">How did you get into cybersecurity?</h1><p className="mt-2 text-muted-foreground">We&apos;ll use this to personalize your learning path</p><div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">{options.map((o)=>{const I=o.icon;const active=selected===o.title;return <button key={o.title} onClick={()=>setSelected(o.title)} className={`relative rounded-xl border p-4 text-left transition-all duration-150 ease-in-out ${active?"border-primary bg-primary/10":"border-border hover:brightness-110"}`}><I className="h-5 w-5 text-primary"/><p className="mt-2 font-medium">{o.title}</p><p className="text-sm text-muted-foreground">{o.desc}</p>{active&&<Check className="absolute right-3 top-3 h-4 w-4 text-primary"/>}</button>;})}</div><Button className="mt-6 w-full bg-primary text-primary-foreground" disabled={!selected||isPending} onClick={()=>startTransition(async()=>{await saveOnboardingStep1(selected);router.push('/onboarding/step-2');})}>Continue</Button></div>}
