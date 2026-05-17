"use server";

import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

export async function saveOnboardingStep0(username: string, birthdate: Date) {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const existing = await prisma.userProfile.findUnique({
    where: { username },
  });
  if (existing) {
    return { error: "Username already taken" };
  }

  await prisma.userProfile.upsert({
    where: { clerkId: userId },
    update: { username, birthdate, onboardingStep: 1 },
    create: {
      clerkId: userId,
      username,
      birthdate,
      onboardingStep: 1,
    },
  });

  return { success: true };
}

export async function saveOnboardingStep1(howDidYouHear: string) {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  await prisma.userProfile.update({
    where: { clerkId: userId },
    data: { howDidYouHear, onboardingStep: 2 },
  });

  return { success: true };
}

export async function saveOnboardingStep2(
  currentRole: string,
  educationLevel: string,
) {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  await prisma.userProfile.update({
    where: { clerkId: userId },
    data: { currentRole, educationLevel, onboardingStep: 3 },
  });

  return { success: true };
}

export async function saveOnboardingStep3(learningGoals: string[]) {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  await prisma.userProfile.update({
    where: { clerkId: userId },
    data: {
      learningGoals,
      onboardingStep: 4,
      onboardingComplete: true,
    },
  });

  const cookieStore = await cookies();
  cookieStore.set("onboarding_complete", "true", {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
  });

  return { success: true };
}

export async function checkUsernameAvailability(username: string) {
  const existing = await prisma.userProfile.findUnique({
    where: { username },
  });
  return { available: !existing };
}
