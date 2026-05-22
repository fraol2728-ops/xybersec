"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

const XP_PER_LESSON = 50;

export async function markLessonComplete(
  lessonId: string,
  lessonSlug: string,
  courseId: string,
) {
  const { userId } = await auth();
  if (!userId) return { error: "Not authenticated" };

  const profile = await prisma.userProfile.findUnique({
    where: { clerkId: userId },
  });
  if (!profile) return { error: "Profile not found" };

  const existing = await prisma.lessonProgress.findUnique({
    where: {
      userId_lessonId: {
        userId: profile.id,
        lessonId,
      },
    },
  });

  if (existing?.completed) {
    return { alreadyCompleted: true, xpEarned: 0 };
  }

  await prisma.lessonProgress.upsert({
    where: {
      userId_lessonId: {
        userId: profile.id,
        lessonId,
      },
    },
    update: {
      completed: true,
      completedAt: new Date(),
      xpEarned: XP_PER_LESSON,
      courseId,
    },
    create: {
      userId: profile.id,
      lessonId,
      courseId,
      completed: true,
      completedAt: new Date(),
      xpEarned: XP_PER_LESSON,
    },
  });

  const now = new Date();
  const lastActivity = profile.lastActivityAt;
  let newStreak = profile.currentStreak;

  if (lastActivity) {
    const diffHours = (now.getTime() - lastActivity.getTime()) / (1000 * 60 * 60);
    if (diffHours < 24) {
      newStreak = profile.currentStreak;
    } else if (diffHours < 48) {
      newStreak = profile.currentStreak + 1;
    } else {
      newStreak = 1;
    }
  } else {
    newStreak = 1;
  }

  const updatedProfile = await prisma.userProfile.update({
    where: { id: profile.id },
    data: {
      xpPoints: profile.xpPoints + XP_PER_LESSON,
      currentStreak: newStreak,
      longestStreak: Math.max(profile.longestStreak, newStreak),
      lastActivityAt: now,
    },
  });

  revalidatePath(`/lessons/${lessonSlug}`);

  return {
    success: true,
    xpEarned: XP_PER_LESSON,
    totalXp: updatedProfile.xpPoints,
    currentStreak: updatedProfile.currentStreak,
  };
}

export async function getLessonProgress(lessonId: string) {
  const { userId } = await auth();
  if (!userId) return null;

  const profile = await prisma.userProfile.findUnique({
    where: { clerkId: userId },
    select: {
      id: true,
      xpPoints: true,
      currentStreak: true,
      longestStreak: true,
      lastActivityAt: true,
    },
  });
  if (!profile) return null;

  const lessonProgress = await prisma.lessonProgress.findUnique({
    where: {
      userId_lessonId: {
        userId: profile.id,
        lessonId,
      },
    },
  });

  const courseProgress = await prisma.lessonProgress.count({
    where: {
      userId: profile.id,
      courseId: { not: "" },
      completed: true,
    },
  });

  return {
    isCompleted: lessonProgress?.completed ?? false,
    xpPoints: profile.xpPoints,
    currentStreak: profile.currentStreak,
    longestStreak: profile.longestStreak,
    lessonsCompleted: courseProgress,
  };
}
