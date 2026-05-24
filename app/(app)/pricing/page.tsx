import { CheckCircle2, Code2, Sparkles } from "lucide-react";
import Link from "next/link";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Pricing",
  description: "Compare Xybersec plans for cybersecurity training in Ethiopia and pick the right access level for your learning journey.",
  path: "/pricing",
  keywords: ["xybersec pricing", "xybersec course"],
});

const PLANS = [
  {
    name: "FREE",
    price: "ETB 0",
    period: "forever",
    cta: "Start Free",
    href: "/courses",
    badge: "Beginner Access",
    features: ["Module 1 preview lessons", "Community updates", "Basic dashboard progress"],
  },
  {
    name: "PRO Monthly",
    price: "ETB 299",
    period: "per month",
    cta: "Enroll Now",
    href: "/courses",
    badge: "Most Popular",
    features: ["All lessons + CTF labs", "AI tutor support", "Certificate eligibility", "Priority new content"],
  },
  {
    name: "PRO Yearly",
    price: "ETB 2,499",
    period: "per year",
    cta: "Best Value",
    href: "/courses",
    badge: "Save 30%",
    features: ["Everything in Pro Monthly", "Lower yearly cost", "Best for long-term mastery"],
  },
];

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-[#09090b] text-white overflow-hidden">
      <main className="relative z-10 px-6 lg:px-12 py-12 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-500/10 border border-violet-500/20 mb-6">
            <Sparkles className="w-4 h-4 text-violet-400" />
            <span className="text-sm text-violet-300">Simple, transparent pricing</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-6">Choose your plan</h1>
          <p className="text-lg text-zinc-400 max-w-2xl mx-auto">Pick a plan, then choose a course on the Courses page. Payment is securely handled when you unlock a specific course.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-14">
          {PLANS.map((plan) => (
            <div key={plan.name} className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6">
              <p className="text-xs uppercase tracking-wide text-violet-300 mb-3">{plan.badge}</p>
              <h2 className="text-2xl font-bold mb-1">{plan.name}</h2>
              <p className="text-3xl font-black">{plan.price}</p>
              <p className="text-sm text-zinc-400 mb-5">{plan.period}</p>
              <ul className="space-y-2 mb-6">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-sm text-zinc-300">
                    <CheckCircle2 className="w-4 h-4 mt-0.5 text-violet-400" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Link href={plan.href} className="block w-full text-center py-3 rounded-xl bg-primary text-background font-semibold hover:opacity-90 transition-all">
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>
      </main>

      <footer className="relative z-10 px-6 lg:px-12 py-12 border-t border-zinc-800/50 max-w-7xl mx-auto mt-20">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-600 flex items-center justify-center">
              <Code2 className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold">Sonny&apos;s Academy</span>
          </div>
          <div className="flex items-center gap-8 text-sm text-zinc-500">
            <Link href="#" className="hover:text-white transition-colors">
              Privacy
            </Link>
            <Link href="#" className="hover:text-white transition-colors">
              Terms
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
