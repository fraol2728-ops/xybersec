"use client";

import { useState, useTransition } from "react";
import { Zap, ShoppingCart, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { unlockModuleWithCP } from "@/lib/actions/cp";
import { useRouter } from "next/navigation";

interface CPPaywallOverlayProps {
  courseSlug: string;
  moduleId: string;
  courseId: string;
  moduleTitle: string;
  cpCost: number;
  userCPBalance: number;
}

export function CPPaywallOverlay({ courseSlug, moduleId, courseId, moduleTitle, cpCost, userCPBalance }: CPPaywallOverlayProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [balance] = useState(userCPBalance);

  const hasEnoughCP = balance >= cpCost;
  const shortfall = cpCost - balance;

  function handleUnlock() {
    if (!hasEnoughCP) {
      router.push("/store");
      return;
    }

    startTransition(async () => {
      setError(null);
      const result = await unlockModuleWithCP(moduleId, courseId, cpCost, moduleTitle);

      if ((result as any).error === "insufficient_cp") {
        setError(`You need ${(result as any).shortfall} more CP`);
        return;
      }

      if ((result as any).error) {
        setError((result as any).error);
        return;
      }

      if ((result as any).success) router.refresh();
    });
  }

  return <div />;
}
