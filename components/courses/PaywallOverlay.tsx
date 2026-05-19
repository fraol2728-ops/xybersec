"use client";

import { CheckCircle2, Lock } from "lucide-react";

interface PaywallOverlayProps {
  courseSlug: string;
}

export function PaywallOverlay({ courseSlug }: PaywallOverlayProps) {
  return (
    <div className="dark min-h-screen bg-background flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
        <div className="w-20 h-20 rounded-full bg-muted border border-border flex items-center justify-center mx-auto mb-6">
          <Lock className="w-8 h-8 text-muted-foreground" />
        </div>

        <h1 className="text-3xl font-bold text-foreground text-center mb-3">
          This lesson is locked
        </h1>
        <p className="text-muted-foreground text-center mb-8">
          Complete Module 1 for free, then unlock the full course to continue
          your journey.
        </p>

        <div className="bg-muted border border-border rounded-xl p-5 mb-6">
          <p className="text-sm font-semibold text-foreground mb-3">
            Full access includes:
          </p>
          {[
            "All course modules and lessons",
            "Hands-on CTF lab challenges",
            "AI tutor for instant help",
            "Course completion certificate",
            "XyberSec community access",
            "New content every month",
          ].map((item) => (
            <div
              key={item}
              className="flex items-center gap-2 text-sm text-muted-foreground py-1.5"
            >
              <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" />
              {item}
            </div>
          ))}
        </div>

        <div className="text-center mb-6">
          <p className="text-4xl font-bold text-foreground">ETB 299</p>
          <p className="text-muted-foreground text-sm">per month</p>
          <p className="text-primary text-sm mt-1">or ETB 2,499/year · save 30%</p>
        </div>

        <a
          href="/pricing"
          className="block w-full py-4 rounded-xl bg-primary text-background font-semibold text-center hover:opacity-90 hover:shadow-xl hover:shadow-primary/20 transition-all duration-200"
        >
          Unlock Full Access →
        </a>

        <a
          href={`/courses/${courseSlug}`}
          className="block text-center text-sm text-muted-foreground hover:text-foreground transition-colors mt-4"
        >
          ← Back to course overview
        </a>
      </div>
    </div>
  );
}
