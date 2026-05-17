import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { OnboardingProgressHeader } from "@/components/onboarding/progress-header";
import { prisma } from "@/lib/prisma";

export default async function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = await auth();

  if (!userId) {
    redirect("/dashboard");
  }

  const profile = await prisma.userProfile.findUnique({
    where: { clerkId: userId },
    select: { onboardingComplete: true },
  });

  if (profile?.onboardingComplete) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <OnboardingProgressHeader />
      <main className="mx-auto flex min-h-[calc(100vh-73px)] w-full max-w-3xl items-center justify-center px-4 py-8 sm:px-6">
        {children}
      </main>
    </div>
  );
}
