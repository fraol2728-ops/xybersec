import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getCPBalance } from "@/lib/actions/cp";
import { CPStoreClient } from "@/components/store/CPStoreClient";

export default async function StorePage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const cpBalance = await getCPBalance();

  return (
    <div className="dark min-h-screen bg-background text-foreground">
      <CPStoreClient initialBalance={cpBalance} />
    </div>
  );
}
