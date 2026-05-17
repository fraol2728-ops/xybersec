"use server";

import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

// Get or create a user profile from Clerk session
export async function getOrCreateUserProfile() {
  const { userId } = await auth();
  if (!userId) return null;

  let profile = await prisma.userProfile.findUnique({
    where: { clerkId: userId },
  });

  if (!profile) {
    profile = await prisma.userProfile.create({
      data: {
        clerkId: userId,
        username: `user_${userId.slice(-8)}`,
        onboardingComplete: false,
        onboardingStep: 0,
      },
    });
  }

  return profile;
}

// Check if user has completed onboarding
export async function checkOnboardingStatus() {
  const { userId } = await auth();
  if (!userId) return { complete: false, step: 0 };

  const profile = await prisma.userProfile.findUnique({
    where: { clerkId: userId },
    select: { onboardingComplete: true, onboardingStep: true },
  });

  return {
    complete: profile?.onboardingComplete ?? false,
    step: profile?.onboardingStep ?? 0,
  };
}

// Check if user is enrolled in a course
export async function checkCourseEnrollment(courseId: string) {
  const { userId } = await auth();
  if (!userId) return false;

  const profile = await prisma.userProfile.findUnique({
    where: { clerkId: userId },
    select: { id: true },
  });
  if (!profile) return false;

  const enrollment = await prisma.enrollment.findUnique({
    where: {
      userId_courseId: {
        userId: profile.id,
        courseId,
      },
    },
  });

  return !!enrollment;
}
