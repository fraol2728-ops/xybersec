import Image from "next/image";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

const pathToStep: Record<string, number> = {
  "/onboarding": 1,
  "/onboarding/step-1": 2,
  "/onboarding/step-2": 3,
  "/onboarding/step-3": 4,
  "/onboarding/welcome": 4,
};

export default async function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const profile = await prisma.userProfile.findUnique({
    where: { clerkId: userId },
    select: { onboardingComplete: true },
  });

  if (profile?.onboardingComplete) redirect("/dashboard");

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="fixed left-0 right-0 top-0 z-50 h-1 bg-border/50">
        <div
          id="onboarding-progress-fill"
          className="h-full bg-primary transition-all duration-150 ease-in-out"
        />
      </div>
      <div className="px-6 pt-6">
        <Image src="/logo.png" alt="XyberSec" width={128} height={36} priority />
      </div>
      <main
        className="mx-auto flex min-h-[calc(100vh-72px)] w-full max-w-[560px] items-center justify-center px-4 py-10"
        data-step-map={JSON.stringify(pathToStep)}
      >
        {children}
      </main>
      <script
        dangerouslySetInnerHTML={{
          __html: `(() => {
            const map = ${JSON.stringify(pathToStep)};
            const p = window.location.pathname;
            const step = map[p] ?? 1;
            const width = Math.min(100, Math.max(25, (step/4)*100));
            const el = document.getElementById('onboarding-progress-fill');
            if (el) el.style.width = width + '%';
          })();`,
        }}
      />
    </div>
  );
}
