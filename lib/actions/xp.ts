"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getLevelFromXP } from "@/lib/levels";

const XP_PER_LESSON = 50;

export async function markLessonComplete(
  lessonId: string,
  lessonSlug: string,
  courseId: string,
  moduleId: string,
  totalLessonsInModule: number,
) {
  void moduleId;
  void totalLessonsInModule;
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
  let newStreak = 1;

  if (lastActivity) {
    const todayStr = now.toISOString().split("T")[0];
    const lastStr = lastActivity.toISOString().split("T")[0];

    const today = new Date(todayStr);
    const last = new Date(lastStr);

    const diffDays = Math.round((today.getTime() - last.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      newStreak = profile.currentStreak || 1;
    } else if (diffDays === 1) {
      newStreak = (profile.currentStreak || 0) + 1;
    } else {
      newStreak = 1;
    }
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

  const todayStr = new Date().toISOString().split("T")[0];
  const currentActivity = (updatedProfile.weeklyActivity as Record<string, boolean> | null) ?? {};
  currentActivity[todayStr] = true;

  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const thirtyDaysAgoStr = thirtyDaysAgo.toISOString().split("T")[0];

  const trimmedActivity = Object.fromEntries(Object.entries(currentActivity).filter(([date]) => date >= thirtyDaysAgoStr));

  await prisma.userProfile.update({
    where: { id: profile.id },
    data: {
      weeklyActivity: trimmedActivity,
      level: getLevelFromXP(updatedProfile.xpPoints).level,
    },
  });

  revalidatePath(`/lessons/${lessonSlug}`);
  revalidatePath("/dashboard");
  revalidatePath("/lessons");

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
