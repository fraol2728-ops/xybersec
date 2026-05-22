"use client"

import { SignedIn, SignedOut } from "@clerk/nextjs"
import Link from "next/link"
import { useEffect, useState } from "react"

const terminalLines = [
  { delay: 0, color: "text-muted-foreground", text: "$ xybersec --initialize" },
  { delay: 800, color: "text-primary", text: "✓ Loading cybersecurity fundamentals..." },
  { delay: 1600, color: "text-primary", text: "✓ AI tutor initialized..." },
  { delay: 2400, color: "text-primary", text: "✓ Setting up lab environment..." },
  { delay: 3200, color: "text-secondary", text: "✓ 3 courses available" },
  { delay: 4000, color: "text-secondary", text: "✓ Community: 50+ students" },
  { delay: 4800, color: "text-foreground", text: "→ Welcome to XyberSec Academy 🛡️" },
  { delay: 5600, color: "text-primary", text: "$ _" },
]

export function Hero() {
  const [visibleCount, setVisibleCount] = useState(0)

  useEffect(() => {
    const timers = terminalLines.map((line, index) =>
      setTimeout(() => setVisibleCount(index + 1), line.delay),
    )

    return () => timers.forEach((timer) => clearTimeout(timer))
  }, [])

  return (
    <section className="relative min-h-screen flex items-center px-4 sm:px-6 lg:px-12 py-24 overflow-hidden">
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/8 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary/8 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/30 bg-primary/5 mb-6">
            <span className="text-sm">🇪🇹</span>
            <span className="text-xs font-semibold text-primary tracking-wide">Ethiopia&apos;s #1 Cybersecurity Academy</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-4">
            Learn Ethical <span className="text-primary">Hacking.</span>
            <br />
            Get Certified. <span className="text-secondary">Get Hired.</span>
          </h1>

          <p className="text-muted-foreground text-lg leading-relaxed mb-8 max-w-lg">
            Master penetration testing, network security, and ethical hacking with hands-on labs and an AI tutor — in English and Amharic. Built for Ethiopia.
          </p>

          <div className="flex flex-wrap gap-3 mb-8">
            <SignedOut>
              <Link href="/sign-up" className="px-6 py-3 rounded-xl bg-primary text-background font-semibold text-sm hover:opacity-90 hover:shadow-xl hover:shadow-primary/25 transition-all">
                Start Learning Free →
              </Link>
              <Link href="/courses" className="px-6 py-3 rounded-xl border border-border text-muted-foreground text-sm hover:border-primary/50 hover:text-foreground transition-all">
                View Courses
              </Link>
            </SignedOut>
            <SignedIn>
              <Link href="/dashboard" className="px-6 py-3 rounded-xl bg-primary text-background font-semibold text-sm hover:opacity-90 transition-all">
                Continue Learning →
              </Link>
            </SignedIn>
          </div>

          <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
            {[
              "No credit card required",
              "First module always free",
              "ETB 299/month full access",
            ].map((item) => (
              <span key={item} className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                {item}
              </span>
            ))}
          </div>
        </div>

        <div className="relative rounded-2xl border border-border bg-muted overflow-hidden">
          <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-background/50">
            <div className="w-3 h-3 rounded-full bg-red-500/70" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
            <div className="w-3 h-3 rounded-full bg-green-500/70" />
            <span className="ml-2 text-xs text-muted-foreground font-mono">xybersec@academy:~</span>
          </div>
          <div className="p-5 font-mono text-sm min-h-[220px]">
            {terminalLines.slice(0, visibleCount).map((line, i) => (
              <div key={i} className={`${line.color} mb-1 transition-opacity duration-300 ${line.text === "$ _" ? "animate-pulse" : ""}`}>
                {line.text}
              </div>
            ))}
          </div>
          <div className="absolute -inset-1 bg-primary/5 rounded-2xl blur-xl -z-10" />
        </div>
      </div>
    </section>
  )
}
