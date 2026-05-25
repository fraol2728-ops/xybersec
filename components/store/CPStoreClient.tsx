"use client";
import { useState, useTransition } from "react";
import { ShoppingCart, Loader2 } from "lucide-react";
import { initializeCPPurchase } from "@/lib/actions/cp";
import { CP_PACKAGES } from "@/lib/cp-packages";

interface CPStoreClientProps { initialBalance: number }
export function CPStoreClient({ initialBalance }: CPStoreClientProps) {
  const [isPending, startTransition] = useTransition();
  const [selectedPkg, setSelectedPkg] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  function handleBuy(packageId: string) {
    setSelectedPkg(packageId);
    setError(null);
    startTransition(async () => {
      const result = await initializeCPPurchase(packageId);
      if ((result as any).error) { setError((result as any).error); setSelectedPkg(null); return; }
      if ((result as any).checkoutUrl) window.location.href = (result as any).checkoutUrl;
    });
  }
  return <div>{initialBalance}{CP_PACKAGES.map((p)=><button key={p.id} onClick={()=>handleBuy(p.id)} disabled={isPending}>{selectedPkg===p.id?<Loader2/>:<ShoppingCart/>}{p.name}</button>)}{error}</div>;
}
