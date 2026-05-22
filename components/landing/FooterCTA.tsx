"use client"

import { SignedIn, SignedOut } from "@clerk/nextjs"
import Link from "next/link"

export function FooterCTA() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-12 border-t border-border bg-muted/20">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-3xl font-bold text-foreground mb-4">Ready to Start Your Cybersecurity Career?</h2>
        <p className="text-muted-foreground mb-8">Join XyberSec Academy today. First module is completely free. No credit card required.</p>

        <div className="flex flex-wrap gap-3 justify-center mb-6">
          <SignedOut>
            <Link href="/sign-up" className="px-6 py-3 rounded-xl bg-primary text-background font-semibold text-sm hover:opacity-90 transition-all">Start Learning Free →</Link>
            <Link href="/courses" className="px-6 py-3 rounded-xl border border-border text-muted-foreground text-sm hover:border-primary/50 hover:text-foreground transition-all">Browse Courses</Link>
          </SignedOut>
          <SignedIn>
            <Link href="/dashboard" className="px-6 py-3 rounded-xl bg-primary text-background font-semibold text-sm hover:opacity-90 transition-all">Continue Learning →</Link>
          </SignedIn>
        </div>

        <p className="text-xs text-muted-foreground">🇪🇹 Built in Ethiopia · ETB 299/month · Cancel anytime · First module always free</p>
      </div>
    </section>
  )
}
