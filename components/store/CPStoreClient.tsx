"use client";

import { useEffect, useState, useTransition } from "react";
import {
  Zap,
  ShoppingCart,
  Loader2,
  CheckCircle2,
  Shield,
  Star,
  TrendingUp,
  Gift,
} from "lucide-react";
import { initializeCPPurchase } from "@/lib/actions/cp";
import { CP_PACKAGES } from "@/lib/cp-packages";

interface CPStoreClientProps {
  initialBalance: number;
}

const FAQS = [
  {
    q: "What are CyberPoints?",
    a: "CyberPoints (CP) are XyberSec Academy's virtual currency. Use them to unlock course modules and certificates. 1 CP unlocks a specific module based on its difficulty.",
  },
  {
    q: "Do CyberPoints expire?",
    a: "No. CyberPoints never expire. Once purchased, they stay in your account until you use them.",
  },
  {
    q: "How do I unlock a module?",
    a: "Go to any course page or click on a locked lesson. You'll see the CP cost to unlock that module. Click 'Unlock' and your CP balance will be deducted instantly.",
  },
  {
    q: "What payment methods are accepted?",
    a: "We accept Telebirr, CBE Birr, bank transfer, and debit/credit cards through Chapa — Ethiopia's leading payment gateway.",
  },
  {
    q: "Can I get a refund?",
    a: "CP purchases are non-refundable once used to unlock modules. Unused CP can be refunded within 7 days of purchase — contact support.",
  },
];

export function CPStoreClient({ initialBalance }: CPStoreClientProps) {
  const [isPending, startTransition] = useTransition();
  const [selectedPkg, setSelectedPkg] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    if (!error) return;
    const t = setTimeout(() => setError(null), 5000);
    return () => clearTimeout(t);
  }, [error]);

  function handleBuy(packageId: string) {
    setSelectedPkg(packageId);
    setError(null);
    startTransition(async () => {
      const result = await initializeCPPurchase(packageId);
      if ((result as any).error) {
        setError((result as any).error);
        setSelectedPkg(null);
        return;
      }
      if ((result as any).checkoutUrl) window.location.href = (result as any).checkoutUrl;
    });
  }

  return (
    <div className="dark min-h-screen bg-background text-foreground relative overflow-hidden pt-14">
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-primary/8 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed top-1/3 right-0 w-80 h-80 bg-secondary/8 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-0 left-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 py-16">
        <div className="text-center mb-16">
          <div className="relative inline-block mb-6">
            <div className="w-20 h-20 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto shadow-2xl shadow-primary/20">
              <Zap className="w-10 h-10 text-primary" />
            </div>
            <div className="absolute inset-0 rounded-2xl border border-primary/30 animate-ping opacity-20" />
          </div>

          <h1 className="text-5xl sm:text-6xl font-black text-foreground mb-4 leading-tight">
            Buy <span className="text-primary drop-shadow-[0_0_30px_rgba(34,211,238,0.5)]">CyberPoints</span>
          </h1>

          <p className="text-muted-foreground text-lg max-w-xl mx-auto mb-6 leading-relaxed">
            Unlock course modules and advance your cybersecurity career. Points never expire.
          </p>

          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20">
            <Gift className="w-4 h-4 text-green-400" />
            <span className="text-sm font-semibold text-green-400">New users get 50 CP free on signup</span>
          </div>
        </div>

        <div className="flex items-center justify-between p-5 rounded-2xl border border-primary/20 bg-primary/5 backdrop-blur-sm mb-12">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
              <Zap className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Your current balance</p>
              <p className="text-2xl font-black text-primary">{initialBalance} CP</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs text-muted-foreground">Enough to unlock</p>
            <p className="text-sm font-semibold text-foreground">
              {initialBalance >= 200
                ? "Advanced modules"
                : initialBalance >= 100
                  ? "Intermediate modules"
                  : initialBalance >= 50
                    ? "Beginner modules"
                    : "Top up to unlock content"}
            </p>
          </div>
        </div>

        <div className="mb-12">
          <p className="text-center text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-5">What CyberPoints unlock</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { icon: "📗", cp: "50 CP", label: "Beginner Module", color: "border-green-500/20 bg-green-500/5", textColor: "text-green-400" },
              { icon: "📘", cp: "100 CP", label: "Intermediate Module", color: "border-blue-500/20 bg-blue-500/5", textColor: "text-blue-400" },
              { icon: "📕", cp: "200 CP", label: "Advanced Module", color: "border-orange-500/20 bg-orange-500/5", textColor: "text-orange-400" },
              { icon: "🎓", cp: "500 CP", label: "Certificate", color: "border-purple-500/20 bg-purple-500/5", textColor: "text-purple-400" },
            ].map((item) => (
              <div
                key={item.cp}
                className={`flex flex-col items-center p-4 rounded-2xl border ${item.color} backdrop-blur-sm text-center hover:scale-105 transition-transform duration-200`}
              >
                <span className="text-3xl mb-2">{item.icon}</span>
                <p className={`text-sm font-black ${item.textColor} mb-0.5`}>{item.cp}</p>
                <p className="text-xs text-muted-foreground">{item.label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-12">
          <p className="text-center text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-8">Choose your package</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {CP_PACKAGES.map((pkg) => {
              const isPopular = pkg.popular;
              const isSelected = selectedPkg === pkg.id;
              const isLoading = isPending && isSelected;

              return (
                <div
                  key={pkg.id}
                  className={`relative flex flex-col p-6 rounded-2xl border transition-all duration-300 cursor-pointer group ${isPopular ? "border-primary bg-primary/5 shadow-2xl shadow-primary/10" : "border-border bg-muted/50 hover:border-primary/40 hover:bg-muted"} ${isSelected && !isLoading ? "scale-[1.02]" : ""}`}
                  onClick={() => !isPending && handleBuy(pkg.id)}
                >
                  {isPopular && <div className="absolute inset-0 rounded-2xl bg-primary/3 blur-xl -z-10" />}

                  {pkg.badge && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                      <span
                        className={`text-xs font-black px-4 py-1.5 rounded-full whitespace-nowrap shadow-lg ${isPopular ? "bg-primary text-background shadow-primary/30" : "bg-muted border border-border text-muted-foreground"}`}
                      >
                        {pkg.badge}
                      </span>
                    </div>
                  )}

                  <p className="text-sm font-semibold text-muted-foreground mb-3 mt-2">{pkg.name}</p>

                  <div className="flex items-baseline gap-2 mb-2">
                    <span className={`text-5xl font-black leading-none ${isPopular ? "text-primary drop-shadow-[0_0_20px_rgba(34,211,238,0.4)]" : "text-foreground"}`}>
                      {pkg.cp.toLocaleString()}
                    </span>
                    <span className={`text-xl font-bold ${isPopular ? "text-primary" : "text-muted-foreground"}`}>CP</span>
                  </div>

                  <div className="flex items-baseline gap-2 mb-3">
                    <span className="text-2xl font-bold text-foreground">ETB {pkg.priceETB.toLocaleString()}</span>
                  </div>

                  <p className="text-xs text-muted-foreground mb-3">ETB {pkg.perCP.toFixed(2)} per CP</p>

                  {pkg.savingPercent ? (
                    <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-green-500/10 border border-green-500/20 mb-5 self-start">
                      <TrendingUp className="w-3 h-3 text-green-400" />
                      <span className="text-xs font-bold text-green-400">Save {pkg.savingPercent}%</span>
                    </div>
                  ) : (
                    <div className="mb-5" />
                  )}

                  <button
                    disabled={isPending}
                    className={`w-full py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 mt-auto transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-60 ${isPopular ? "bg-primary text-background hover:opacity-90 hover:shadow-xl hover:shadow-primary/30" : "bg-background border border-border text-foreground hover:border-primary/60 hover:bg-muted group-hover:border-primary/60"}`}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Preparing checkout...
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="w-4 h-4" />
                        Buy {pkg.cp.toLocaleString()} CP
                      </>
                    )}
                  </button>

                  <p className="text-xs text-center text-muted-foreground mt-3 flex items-center justify-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    Paid securely via Chapa
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">
          {[
            {
              icon: <Shield className="w-5 h-5" />,
              title: "Secure Payment",
              desc: "Powered by Chapa. Telebirr, bank transfer and cards accepted.",
              color: "text-primary",
              bg: "bg-primary/10 border-primary/20",
            },
            {
              icon: <Zap className="w-5 h-5" />,
              title: "Instant Unlock",
              desc: "CyberPoints are added instantly after payment confirmation.",
              color: "text-secondary",
              bg: "bg-secondary/10 border-secondary/20",
            },
            {
              icon: <Star className="w-5 h-5" />,
              title: "Never Expire",
              desc: "Your CyberPoints never expire. Use them at your own pace.",
              color: "text-amber-400",
              bg: "bg-amber-400/10 border-amber-400/20",
            },
          ].map((item) => (
            <div key={item.title} className={`flex flex-col items-center text-center p-5 rounded-2xl border ${item.bg}`}>
              <div className={`${item.color} mb-3`}>{item.icon}</div>
              <p className={`text-sm font-bold ${item.color} mb-1`}>{item.title}</p>
              <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>

        <div className="mb-12">
          <h2 className="text-xl font-bold text-foreground text-center mb-6">Frequently Asked Questions</h2>
          <div className="space-y-2">
            {FAQS.map((faq, i) => (
              <div key={faq.q} className="border border-border rounded-xl overflow-hidden bg-background/40 backdrop-blur-sm">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-muted transition-colors"
                >
                  <span className="text-sm font-semibold text-foreground">{faq.q}</span>
                  <span className={`text-muted-foreground transition-transform duration-200 ${openFaq === i ? "rotate-45" : ""}`}>+</span>
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-4 border-t border-border bg-muted/30">
                    <p className="text-sm text-muted-foreground pt-3 leading-relaxed">{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="text-center pt-8 border-t border-border">
          <p className="text-sm text-muted-foreground mb-2">🇪🇹 Built for Ethiopian cybersecurity students</p>
          <p className="text-xs text-muted-foreground">
            Questions? Contact us at
            <a href="mailto:support@xybersec.com" className="text-primary hover:opacity-80 ml-1">
              support@xybersec.com
            </a>
          </p>
        </div>
      </div>

      {error && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-xl bg-red-500/10 border border-red-500/30 backdrop-blur-sm flex items-center gap-2 shadow-xl">
          <span className="text-sm text-red-400">{error}</span>
          <button onClick={() => setError(null)} className="text-red-400 hover:text-red-300 ml-2">
            ×
          </button>
        </div>
      )}
    </div>
  );
}
