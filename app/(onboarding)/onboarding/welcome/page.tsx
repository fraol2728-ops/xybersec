"use client";

import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import {
  getFirstFreeCourseSlug,
  getOnboardingUsername,
} from "@/lib/actions/onboarding";

export default function WelcomePage() {
  const router = useRouter();
  const [username, setUsername] = useState("hacker");
  const [courseSlug, setCourseSlug] = useState<string | null>(null);
  const [courseName, setCourseName] = useState<string | null>(null);
  const [firstLessonSlug, setFirstLessonSlug] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [count, setCount] = useState(5);

  const destination = useMemo(
    () =>
      firstLessonSlug
        ? `/lessons/${firstLessonSlug}`
        : courseSlug
          ? `/courses/${courseSlug}`
          : "/dashboard",
    [courseSlug, firstLessonSlug],
  );

  useEffect(() => {
    (async () => {
      const [name, course] = await Promise.all([
        getOnboardingUsername(),
        getFirstFreeCourseSlug(),
      ]);
      const { slug, title, firstLessonSlug } = course ?? {
        slug: null,
        title: null,
        firstLessonSlug: null,
      };
      setUsername(name ?? "hacker");
      setCourseSlug(slug);
      setCourseName(title);
      setFirstLessonSlug(firstLessonSlug);
      setLoading(false);
    })();
  }, []);

  useEffect(() => {
    if (loading) return;

    const interval = setInterval(() => {
      setCount((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          router.push(destination);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [destination, loading, router]);

  const handleBegin = () => {
    router.push(destination);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 relative overflow-hidden">
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 text-center">
        <style>{`
          @keyframes fadeUp {
            from { opacity: 0; transform: translateY(24px); }
            to   { opacity: 1; transform: translateY(0); }
          }
          .fade-up { animation: fadeUp 0.6s ease forwards; opacity: 0; }
          .d1 { animation-delay: 0.1s; }
          .d2 { animation-delay: 0.4s; }
          .d3 { animation-delay: 0.7s; }
          .d4 { animation-delay: 1.0s; }
          .d5 { animation-delay: 1.3s; }
        `}</style>

        {/* biome-ignore lint/performance/noImgElement: required by onboarding welcome design spec */}
        <img
          src="/logo.png"
          className="w-16 h-16 mx-auto mb-6 drop-shadow-[0_0_24px_rgba(34,211,238,0.5)] fade-up d1"
          alt="XyberSec"
        />

        <p className="fade-up d2 text-primary text-sm font-semibold tracking-widest uppercase mb-4">
          Welcome to XyberSec Academy
        </p>

        <h1 className="fade-up d3 text-5xl font-bold text-foreground mb-4">
          @{username}
        </h1>

        <p className="fade-up d4 text-muted-foreground text-lg max-w-sm mx-auto mb-10">
          Your cybersecurity journey starts now. Ethiopia&apos;s #1 security
          academy.
        </p>

        <div className="fade-up d5 bg-muted border border-border rounded-xl p-4 max-w-xs w-full mx-auto mb-8 text-left">
          <p className="text-xs text-muted-foreground mb-1">Starting with</p>
          <p className="text-foreground font-semibold text-sm">
            {courseName ?? "Cybersecurity Fundamentals"}
          </p>
          <p className="text-xs text-primary mt-1">Free • Beginner friendly</p>
        </div>

        <button
          type="button"
          onClick={handleBegin}
          className="fade-up d5 px-8 py-4 bg-primary text-background font-semibold rounded-xl hover:opacity-90 hover:shadow-xl hover:shadow-primary/30 transition-all duration-200 text-sm mb-4"
        >
          Begin Your Journey →
        </button>

        <p className="fade-up d5 text-muted-foreground text-sm">
          Starting automatically in {count}s...
        </p>
      </div>
    </div>
  );
}
