"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export async function saveOnboardingStep0(username: string, birthdate: string) {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
  if (!usernameRegex.test(username)) {
    return {
      error:
        "Username must be 3-20 characters, letters, numbers and underscores only",
    };
  }

  const existing = await prisma.userProfile.findUnique({
    where: { username: username.toLowerCase() },
  });
  if (existing && existing.clerkId !== userId) {
    return { error: "Username already taken" };
  }

  await prisma.userProfile.upsert({
    where: { clerkId: userId },
    update: {
      username: username.toLowerCase(),
      birthdate: new Date(birthdate),
      onboardingStep: 1,
    },
    create: {
      clerkId: userId,
      username: username.toLowerCase(),
      birthdate: new Date(birthdate),
      onboardingStep: 1,
    },
  });

  revalidatePath("/onboarding");
  return { success: true };
}

export async function checkUsernameAvailability(username: string) {
  const { userId } = await auth();
  if (!userId) return { available: false };
  if (!username || username.length < 3) return { available: false };

  const existing = await prisma.userProfile.findUnique({
    where: { username: username.toLowerCase() },
  });

  if (!existing) return { available: true };
  if (existing.clerkId === userId) return { available: true };
  return { available: false };
}

export async function saveOnboardingStep1(howDidYouHear: string) {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  await prisma.userProfile.update({
    where: { clerkId: userId },
    data: { howDidYouHear, onboardingStep: 2 },
  });

  revalidatePath("/onboarding/step-1");
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

  revalidatePath("/onboarding/step-2");
  return { success: true };
}

export async function saveOnboardingStep3(learningGoals: string[]) {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  await prisma.userProfile.update({
    where: { clerkId: userId },
    data: { learningGoals, onboardingStep: 4, onboardingComplete: true },
  });

  // Update Clerk publicMetadata so middleware can
  // check onboarding status without a DB call
  // and without relying on cookies
  try {
    const { clerkClient } = await import("@clerk/nextjs/server");
    const client = await clerkClient();
    await client.users.updateUserMetadata(userId, {
      publicMetadata: {
        onboardingComplete: true,
      },
    });
  } catch (error) {
    // Don't fail the action if metadata update fails
    // Prisma is the source of truth
    console.error("Failed to update Clerk metadata:", error);
  }

  const { cookies } = await import("next/headers");
  const cookieStore = await cookies();
  cookieStore.set("onboarding_complete", "true", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 365,
    path: "/",
  });

  revalidatePath("/onboarding/step-3");
  return { success: true };
}

export async function getFirstFreeCourseSlug() {
  const { createClient } = await import("next-sanity");

  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "";
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "";

  const client = createClient({
    projectId,
    dataset,
    apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? "2024-01-01",
    useCdn: false,
  });

  const result = await client.fetch(
    `*[_type == "course" && tier == "free"]
    | order(_createdAt asc) [0] {
      "slug": slug.current,
      title,
      "firstLessonSlug": modules[0]->.lessons[0]->.slug.current
    }`,
  );

  return {
    slug: result?.slug ?? null,
    title: result?.title ?? null,
    firstLessonSlug: result?.firstLessonSlug ?? null,
  };
}

export async function getOnboardingUsername() {
  const { userId } = await auth();
  if (!userId) return null;
  const profile = await prisma.userProfile.findUnique({
    where: { clerkId: userId },
    select: { username: true },
  });
  return profile?.username ?? null;
}


export async function checkAndBackfillOnboarding() {
  const { userId } = await auth();
  if (!userId) return;

  const profile = await prisma.userProfile.findUnique({
    where: { clerkId: userId },
    select: { onboardingComplete: true },
  });

  if (!profile?.onboardingComplete) return;

  try {
    const { clerkClient } = await import("@clerk/nextjs/server");
    const client = await clerkClient();

    const user = await client.users.getUser(userId);
    const meta = user.publicMetadata as {
      onboardingComplete?: boolean;
    };

    if (!meta?.onboardingComplete) {
      await client.users.updateUserMetadata(userId, {
        publicMetadata: {
          ...user.publicMetadata,
          onboardingComplete: true,
        },
      });
    }
  } catch (error) {
    console.error("Backfill failed:", error);
  }
}
