import { auth } from "@clerk/nextjs/server";
import { Zap } from "lucide-react";
import { redirect } from "next/navigation";
import { getCPBalance } from "@/lib/actions/cp";
import { CPStoreClient } from "@/components/store/CPStoreClient";

export default async function StorePage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const cpBalance = await getCPBalance();

  return (
    <div data-store-page="true" className="dark min-h-screen bg-background text-foreground">
      <div className="fixed top-0 left-0 right-0 z-50 h-14 bg-background/95 backdrop-blur-md border-b border-border flex items-center px-6">
        <a
          href="/dashboard"
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          ← Back to Dashboard
        </a>
        <div className="ml-auto flex items-center gap-2">
          <Zap className="w-4 h-4 text-primary" />
          <span className="text-sm font-bold text-primary">{cpBalance} CP</span>
        </div>
      </div>
      <CPStoreClient initialBalance={cpBalance} />
    </div>
  );
}
