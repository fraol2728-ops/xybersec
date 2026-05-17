"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getFirstFreeCourseSlug, getOnboardingUsername } from "@/lib/actions/onboarding";

export default function WelcomePage(){
  const router=useRouter();
  const [username,setUsername]=useState("hacker");
  const [slug,setSlug]=useState<string | null>(null);
  const [countdown,setCountdown]=useState(3);
  useEffect(()=>{(async()=>{setUsername((await getOnboardingUsername()) ?? "hacker");setSlug(await getFirstFreeCourseSlug());})();},[]);
  useEffect(()=>{const i=setInterval(()=>setCountdown((c)=>Math.max(1,c-1)),1000);const t=setTimeout(()=>router.push(slug?`/courses/${slug}`:'/dashboard'),3500);return()=>{clearInterval(i);clearTimeout(t)};},[router,slug]);
  return <div className="w-full text-center"><div className="mx-auto w-full max-w-xl"><Image src="/logo.png" alt="XyberSec" width={80} height={80} className="mx-auto animate-fade-in"/><h1 className="mt-5 animate-fade-in text-4xl font-bold" style={{animationDelay:"0ms"}}>Welcome to XyberSec</h1><p className="mt-2 animate-fade-in text-2xl text-primary" style={{animationDelay:"500ms"}}>@{username}</p><p className="mt-2 animate-fade-in text-muted-foreground" style={{animationDelay:"1000ms"}}>Your cybersecurity journey starts now.</p><div className="mt-6 animate-fade-in rounded-xl border border-primary/25 bg-card/70 p-4" style={{animationDelay:"1500ms"}}><p className="text-sm text-muted-foreground">Starting with:</p><p className="mt-1 text-lg font-semibold text-foreground">Your first free course</p><button onClick={()=>router.push(slug?`/courses/${slug}`:'/dashboard')} className="mt-3 text-primary">Begin Your Journey →</button></div><p className="mt-8 text-sm text-muted-foreground">Starting in {countdown}... {Math.max(1,countdown-1)}... {Math.max(1,countdown-2)}...</p></div></div>
}
