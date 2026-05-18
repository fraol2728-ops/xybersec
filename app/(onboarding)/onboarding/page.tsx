"use client";

import { CheckCircle2, Loader2, XCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState, useTransition } from "react";
import {
  checkUsernameAvailability,
  saveOnboardingStep0,
} from "@/lib/actions/onboarding";

export default function OnboardingPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [day, setDay] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [status, setStatus] = useState<
    "idle" | "invalid" | "checking" | "taken" | "available"
  >("idle");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const valid = useMemo(
    () => /^[a-zA-Z0-9_]{3,20}$/.test(username),
    [username],
  );

  useEffect(() => {
    if (username.length < 3) return setStatus("idle");
    if (!valid) return setStatus("invalid");
    setStatus("checking");
    const t = setTimeout(async () => {
      const res = await checkUsernameAvailability(username);
      setStatus(res.available ? "available" : "taken");
    }, 500);
    return () => clearTimeout(t);
  }, [username, valid]);

  const birthdate =
    year && month && day
      ? `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`
      : "";
  const canContinue = status === "available" && !!birthdate;
  const years = Array.from({ length: 2010 - 1970 + 1 }, (_, i) =>
    String(2010 - i),
  );

  return (
    <div className="mx-auto w-full max-w-md py-12">
      <p className="mb-3 text-sm font-medium tracking-wide text-primary">
        PROFILE SETUP
      </p>
      <h1 className="mb-2 text-3xl font-bold text-foreground">
        Set up your profile
      </h1>
      <p className="mb-8 text-muted-foreground">
        Choose how the world will know you on XyberSec
      </p>

      <div className="space-y-5">
        <div>
          <label
            htmlFor="username"
            className="mb-1.5 block text-sm text-muted-foreground"
          >
            Username
          </label>
          <div className="relative">
            <input
              id="username"
              value={username}
              placeholder="e.g. xhacker_eth"
              onChange={(e) => setUsername(e.target.value.toLowerCase())}
              className="w-full rounded-lg border border-border bg-muted px-4 py-3 pr-11 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all duration-200"
            />
            <div className="absolute inset-y-0 right-3 flex items-center">
              {status === "checking" && (
                <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
              )}
              {status === "available" && (
                <CheckCircle2 className="h-5 w-5 text-green-400" />
              )}
              {status === "taken" && (
                <XCircle className="h-5 w-5 text-red-400" />
              )}
            </div>
          </div>
          <p className="mt-2 text-sm">
            {status === "available" && (
              <span className="text-green-400">✓ Username available</span>
            )}
            {status === "taken" && (
              <span className="text-red-400">✗ Username already taken</span>
            )}
            {status === "invalid" && (
              <span className="text-red-400">
                Only letters, numbers and underscores
              </span>
            )}
          </p>
        </div>

        <div>
          <label
            htmlFor="birth-day"
            className="mb-1.5 block text-sm text-muted-foreground"
          >
            Date of birth
          </label>
          <div className="grid grid-cols-3 gap-3">
            <select
              id="birth-day"
              className="cursor-pointer rounded-lg border border-border bg-muted px-3 py-3 text-foreground transition-all duration-200 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/50"
              value={day}
              onChange={(e) => setDay(e.target.value)}
            >
              <option value="">Day</option>
              {Array.from({ length: 31 }, (_, i) => (
                <option key={`day-${i + 1}`} value={String(i + 1)}>
                  {i + 1}
                </option>
              ))}
            </select>
            <select
              className="cursor-pointer rounded-lg border border-border bg-muted px-3 py-3 text-foreground transition-all duration-200 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/50"
              value={month}
              onChange={(e) => setMonth(e.target.value)}
            >
              <option value="">Month</option>
              {Array.from({ length: 12 }, (_, i) => (
                <option key={`day-${i + 1}`} value={String(i + 1)}>
                  {i + 1}
                </option>
              ))}
            </select>
            <select
              className="cursor-pointer rounded-lg border border-border bg-muted px-3 py-3 text-foreground transition-all duration-200 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/50"
              value={year}
              onChange={(e) => setYear(e.target.value)}
            >
              <option value="">Year</option>
              {years.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>
        </div>

        {error && <p className="text-sm text-red-400">{error}</p>}
        <button
          type="button"
          className="mt-8 w-full rounded-lg bg-primary py-3.5 text-sm font-semibold text-background transition-all duration-200 hover:opacity-90 hover:shadow-lg hover:shadow-primary/25 disabled:cursor-not-allowed disabled:opacity-40"
          disabled={!canContinue || isPending}
          onClick={() =>
            startTransition(async () => {
              setError(null);
              const res = await saveOnboardingStep0(username, birthdate);
              if (res?.error) {
                setError(res.error);
                return;
              }
              router.push("/onboarding/step-1");
            })
          }
        >
          {isPending ? (
            <span className="inline-flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              Saving...
            </span>
          ) : (
            "Continue →"
          )}
        </button>

        <div className="mt-8 border-t border-border pt-6">
          <p className="text-center text-xs text-muted-foreground">
            You can update your profile anytime in settings
          </p>
        </div>
      </div>
    </div>
  );
}
