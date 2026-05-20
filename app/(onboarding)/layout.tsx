import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { OnboardingTopChrome } from "./onboarding-top-chrome";

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

  // REMOVED: onboardingComplete redirect from layout.
  // Reason: this blocked /onboarding/welcome from rendering after step-3.

  return (
    <div className="dark min-h-screen bg-background text-foreground">
      <OnboardingTopChrome />
      <main className="flex min-h-screen items-center justify-center bg-background px-4 pt-20">
        {children}
      </main>
    </div>
  );
}
