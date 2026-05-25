"use server";

import { auth } from "@clerk/nextjs/server";
import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { initializePayment, generateTxRef } from "@/lib/chapa";
import { CP_PACKAGES, WELCOME_BONUS_CP } from "@/lib/cp-packages";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function getCPBalance(): Promise<number> {
  const { userId } = await auth();
  if (!userId) return 0;

  const profile = await prisma.userProfile.findUnique({
    where: { clerkId: userId },
    select: { cpBalance: true },
  });

  return profile?.cpBalance ?? 0;
}

export async function initializeCPPurchase(packageId: string) {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const user = await currentUser();
  if (!user) redirect("/sign-in");

  const pkg = CP_PACKAGES.find((p) => p.id === packageId);
  if (!pkg) return { error: "Invalid package" };

  const txRef = generateTxRef(userId, `cp-${packageId}`);
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

  await prisma.cPTransaction.create({
    data: {
      userId,
      type: "PURCHASE",
      amount: pkg.cp,
      packageId: pkg.id,
      amountPaid: pkg.priceETB,
      currency: "ETB",
      chapaRef: txRef,
      description: `Purchased ${pkg.cp} CP — ${pkg.name}`,
    },
  });

  try {
    const response = await initializePayment({
      amount: pkg.priceETB,
      currency: "ETB",
      email: user.emailAddresses[0]?.emailAddress ?? `${userId}@xybersec.com`,
      firstName: user.firstName ?? "Student",
      lastName: user.lastName ?? "User",
      txRef,
      callbackUrl: `${appUrl}/api/payments/webhook`,
      returnUrl: `${appUrl}/payment/success?tx_ref=${txRef}&type=cp`,
      title: "XyberSec CyberPoints",
      description: `${pkg.cp} CyberPoints — ${pkg.name}`,
      meta: {
        userId,
        type: "cp_purchase",
        packageId: pkg.id,
        cpAmount: pkg.cp.toString(),
      },
    });

    return {
      success: true,
      checkoutUrl: response.data.checkout_url,
      txRef,
    };
  } catch {
    await prisma.cPTransaction.deleteMany({
      where: { chapaRef: txRef },
    });
    return {
      error: "Payment initialization failed.",
    };
  }
}

export async function unlockModuleWithCP(moduleId: string, courseId: string, cpCost: number, moduleTitle: string) {
  const { userId } = await auth();
  if (!userId) return { error: "Not authenticated" };

  const existing = await prisma.moduleUnlock.findUnique({
    where: {
      userId_moduleId: { userId, moduleId },
    },
  });

  if (existing) {
    return { alreadyUnlocked: true };
  }

  const profile = await prisma.userProfile.findUnique({
    where: { clerkId: userId },
    select: { id: true, cpBalance: true },
  });

  if (!profile) return { error: "Profile not found" };

  if (profile.cpBalance < cpCost) {
    return {
      error: "insufficient_cp",
      currentCP: profile.cpBalance,
      required: cpCost,
      shortfall: cpCost - profile.cpBalance,
    };
  }

  await prisma.$transaction([
    prisma.userProfile.update({
      where: { id: profile.id },
      data: { cpBalance: { decrement: cpCost } },
    }),
    prisma.moduleUnlock.create({
      data: {
        userId,
        moduleId,
        courseId,
        cpSpent: cpCost,
      },
    }),
    prisma.cPTransaction.create({
      data: {
        userId,
        type: "MODULE_UNLOCK",
        amount: -cpCost,
        moduleId,
        courseId,
        description: `Unlocked: ${moduleTitle}`,
      },
    }),
  ]);

  revalidatePath("/dashboard");
  revalidatePath("/lessons");
  revalidatePath("/courses");

  return {
    success: true,
    newBalance: profile.cpBalance - cpCost,
  };
}

export async function checkModuleUnlock(moduleId: string): Promise<boolean> {
  const { userId } = await auth();
  if (!userId) return false;

  const unlock = await prisma.moduleUnlock.findUnique({
    where: {
      userId_moduleId: { userId, moduleId },
    },
  });

  return !!unlock;
}

export async function checkModuleUnlocks(moduleIds: string[]): Promise<Record<string, boolean>> {
  const { userId } = await auth();
  if (!userId) return {};

  const unlocks = await prisma.moduleUnlock.findMany({
    where: {
      userId,
      moduleId: { in: moduleIds },
    },
    select: { moduleId: true },
  });

  const result: Record<string, boolean> = {};
  moduleIds.forEach((id) => {
    result[id] = unlocks.some((u) => u.moduleId === id);
  });

  return result;
}

export async function grantWelcomeBonus() {
  const { userId } = await auth();
  if (!userId) return;

  const profile = await prisma.userProfile.findUnique({
    where: { clerkId: userId },
    select: { id: true, cpBalance: true },
  });

  if (!profile) return;

  const existingBonus = await prisma.cPTransaction.findFirst({
    where: {
      userId,
      type: "WELCOME_BONUS",
    },
  });

  if (existingBonus) return;

  await prisma.$transaction([
    prisma.userProfile.update({
      where: { id: profile.id },
      data: {
        cpBalance: { increment: WELCOME_BONUS_CP },
      },
    }),
    prisma.cPTransaction.create({
      data: {
        userId,
        type: "WELCOME_BONUS",
        amount: WELCOME_BONUS_CP,
        description: `Welcome bonus: ${WELCOME_BONUS_CP} CP`,
      },
    }),
  ]);

  revalidatePath("/dashboard");
}
