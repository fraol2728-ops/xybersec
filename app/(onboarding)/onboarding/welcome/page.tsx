"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  getFirstFreeCourseSlug,
  getOnboardingUsername,
} from "@/lib/actions/onboarding";

export default function WelcomePage() {
  const router = useRouter();
  const [username, setUsername] = useState("hacker");
  const [slug, setSlug] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(4);

  useEffect(() => {
    (async () => {
      setUsername((await getOnboardingUsername()) ?? "hacker");
      setSlug(await getFirstFreeCourseSlug());
    })();
  }, []);

  useEffect(() => {
    const i = setInterval(() => setCountdown((c) => Math.max(0, c - 1)), 1000);
    const t = setTimeout(
      () => router.push(slug ? `/courses/${slug}` : "/dashboard"),
      4000,
    );
    return () => {
      clearInterval(i);
      clearTimeout(t);
    };
  }, [router, slug]);

  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-background px-4">
      <div className="pointer-events-none absolute left-1/4 top-1/4 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
      <div className="pointer-events-none absolute bottom-1/4 right-1/4 h-96 w-96 rounded-full bg-secondary/10 blur-3xl" />

      <div className="relative z-10 flex w-full max-w-sm flex-col items-center">
        <Image
          src="/logo.png"
          width={72}
          height={72}
          alt="XyberSec"
          className="fade-up delay-1 mb-6 drop-shadow-[0_0_24px_rgba(34,211,238,0.4)]"
          priority
        />
        <p className="fade-up delay-2 mb-3 text-center text-sm font-medium uppercase tracking-widest text-primary">
          Welcome to XyberSec Academy
        </p>
        <h1 className="fade-up delay-3 mb-4 text-center text-5xl font-bold text-foreground">
          @{username}
        </h1>
        <p className="fade-up delay-4 mb-10 max-w-sm text-center text-lg text-muted-foreground">
          Your cybersecurity journey starts now. Ethiopia&apos;s #1 security
          academy.
        </p>

        <div className="fade-up delay-5 mb-8 w-full max-w-sm rounded-xl border border-border bg-muted p-4 text-left">
          <p className="mb-1 text-xs text-muted-foreground">Starting with</p>
          <p className="font-semibold text-foreground">
            Your first free course
          </p>
          <p className="mt-1 text-xs text-primary">Free • Beginner friendly</p>
        </div>

        <button
          type="button"
          onClick={() => router.push(slug ? `/courses/${slug}` : "/dashboard")}
          className="fade-up delay-5 rounded-xl bg-primary px-8 py-4 text-sm font-semibold text-background transition-all duration-200 hover:opacity-90 hover:shadow-xl hover:shadow-primary/30"
        >
          Begin Your Journey →
        </button>
        <p className="fade-up delay-5 mt-6 text-sm text-muted-foreground">
          Starting automatically in {countdown}s...
        </p>
      </div>

      <style jsx>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .fade-up { animation: fadeUp 0.6s ease forwards; opacity: 0; }
        .delay-1 { animation-delay: 0.2s; }
        .delay-2 { animation-delay: 0.5s; }
        .delay-3 { animation-delay: 0.8s; }
        .delay-4 { animation-delay: 1.1s; }
        .delay-5 { animation-delay: 1.4s; }
      `}</style>
    </div>
  );
}
