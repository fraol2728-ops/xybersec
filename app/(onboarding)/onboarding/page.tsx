"use client";

import { CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { saveOnboardingStep0, checkUsernameAvailability } from "@/lib/actions/onboarding";

export default function OnboardingStep0Page() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [birthdate, setBirthdate] = useState("");
  const [usernameStatus, setUsernameStatus] = useState<"idle" | "checking" | "valid" | "invalid" | "taken">("idle");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const isUsernameFormatValid = useMemo(() => /^[a-zA-Z0-9_]{3,20}$/.test(username), [username]);

  useEffect(() => {
    if (!username) return setUsernameStatus("idle");
    if (!isUsernameFormatValid) return setUsernameStatus("invalid");

    setUsernameStatus("checking");
    const timeout = setTimeout(async () => {
      const result = await checkUsernameAvailability(username);
      setUsernameStatus(result.available ? "valid" : "taken");
    }, 350);

    return () => clearTimeout(timeout);
  }, [username, isUsernameFormatValid]);

  const canSubmit = usernameStatus === "valid" && Boolean(birthdate);

  const handleSubmit = () => {
    setError(null);
    startTransition(async () => {
      const result = await saveOnboardingStep0(username, new Date(birthdate));
      if (result?.error) return setError(result.error);
      router.push("/onboarding/step-1");
    });
  };

  return (
    <div className="w-full rounded-2xl border border-border/70 bg-card/60 p-6 sm:p-10">
      <h1 className="text-3xl font-bold text-foreground sm:text-4xl">Set up your profile</h1>
      <p className="mt-2 text-muted-foreground">This takes less than 2 minutes</p>

      <div className="mt-8 space-y-5">
        <div>
          <label className="mb-2 block text-sm text-muted-foreground">Choose a username</label>
          <Input value={username} onChange={(e) => setUsername(e.target.value.trim())} placeholder="xyber_hacker" />
          <p className="mt-2 text-sm text-muted-foreground">
            {usernameStatus === "invalid" && "Use letters, numbers, or underscores (3-20 chars)."}
            {usernameStatus === "checking" && "Checking username..."}
            {usernameStatus === "taken" && "This username is already taken."}
            {usernameStatus === "valid" && (
              <span className="inline-flex items-center gap-1 text-emerald-400">
                <CheckCircle2 className="h-4 w-4" /> Username is available
              </span>
            )}
          </p>
        </div>

        <div>
          <label className="mb-2 block text-sm text-muted-foreground">Birthdate</label>
          <Input type="date" value={birthdate} onChange={(e) => setBirthdate(e.target.value)} />
        </div>
      </div>

      {error ? <p className="mt-3 text-sm text-destructive">{error}</p> : null}
      <p className="mt-4 text-sm text-muted-foreground">You can change these later in settings</p>

      <Button disabled={!canSubmit || isPending} onClick={handleSubmit} className="mt-8 w-full sm:w-auto">
        Continue
      </Button>
    </div>
  );
}
