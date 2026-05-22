"use client"

import { SignedIn, SignedOut } from "@clerk/nextjs"
import Link from "next/link"

export function FoundingMembers() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-12">
      <div className="max-w-3xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-secondary/30 bg-secondary/5 mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse" />
          <span className="text-xs font-semibold text-secondary tracking-wide">FOUNDING MEMBERS</span>
        </div>
        <h2 className="text-3xl font-bold text-foreground mb-4">Be Among the First 100 Students</h2>
        <p className="text-muted-foreground text-lg mb-8 leading-relaxed">XyberSec Academy is Ethiopia&apos;s newest cybersecurity platform. Join as a founding member and help shape the future of cybersecurity education in Africa.</p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          {[
            { icon: "🏅", title: "Founding Badge", desc: "Exclusive badge on your profile forever" },
            { icon: "💬", title: "Direct Access", desc: "Talk directly to the founders and shape the curriculum" },
            { icon: "🔒", title: "Locked-in Price", desc: "Keep ETB 299/month forever even as prices rise" },
          ].map((benefit) => (
            <div key={benefit.title} className="flex flex-col items-center p-4 rounded-xl border border-border bg-muted/50">
              <span className="text-3xl mb-2">{benefit.icon}</span>
              <p className="text-sm font-semibold text-foreground mb-1">{benefit.title}</p>
              <p className="text-xs text-muted-foreground text-center">{benefit.desc}</p>
            </div>
          ))}
        </div>

        <div className="inline-flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <div className="flex -space-x-1">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="w-7 h-7 rounded-full bg-muted border-2 border-background flex items-center justify-center text-xs">🧑</div>
            ))}
          </div>
          <span><strong className="text-foreground">Spots filling up</strong> — join free today</span>
        </div>

        <div>
          <SignedOut>
            <Link href="/sign-up" className="inline-flex px-8 py-4 rounded-xl bg-primary text-background font-semibold hover:opacity-90 hover:shadow-xl hover:shadow-primary/25 transition-all">Claim Your Founding Spot →</Link>
          </SignedOut>
          <SignedIn>
            <Link href="/dashboard" className="inline-flex px-8 py-4 rounded-xl bg-primary text-background font-semibold hover:opacity-90 transition-all">Go to Dashboard →</Link>
          </SignedIn>
        </div>
      </div>
    </section>
  )
}
