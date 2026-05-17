import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function UnauthorizedPage() {
  return (
    <main className="mx-auto flex min-h-[60vh] w-full max-w-3xl items-center justify-center px-4 py-16">
      <section className="w-full rounded-3xl border border-white/10 bg-[#08111f]/80 p-8 text-center shadow-[0_22px_55px_rgba(2,6,23,0.24)] backdrop-blur-xl">
        <h1 className="text-3xl font-bold text-white">Access Denied</h1>
        <p className="mt-3 text-zinc-300">
          You don&apos;t have permission to access this area
        </p>
        <div className="mt-8">
          <Button asChild>
            <Link href="/dashboard">Back to Dashboard</Link>
          </Button>
        </div>
      </section>
    </main>
  );
}
