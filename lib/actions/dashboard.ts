"use server";

import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export interface DashboardStats {
  username: string | null;
  xpPoints: number;
  currentStreak: number;
  longestStreak: number;
  lessonsCompleted: number;
  enrolledCourseIds: string[];
  lastCompletedLessonId: string | null;
  lastCompletedAt: Date | null;
  userRank: number;
  leaderboard: {
    id: string;
    username: string | null;
    xpPoints: number;
  }[];
}

export async function getDashboardData(): Promise<DashboardStats | null> {
  const { userId } = await auth();
  if (!userId) return null;

  try {
    const profile = await prisma.userProfile.findUnique({
      where: { clerkId: userId },
      select: {
        id: true,
        username: true,
        xpPoints: true,
        currentStreak: true,
        longestStreak: true,
        lastActivityAt: true,
        enrollments: {
          where: { status: "ACTIVE" },
          select: { courseId: true },
        },
        progress: {
          where: { completed: true },
          orderBy: { completedAt: "desc" },
          select: { lessonId: true, completedAt: true },
        },
      },
    });

    if (!profile) return null;

    const now = new Date();
    let currentStreak = profile.currentStreak;

    if (profile.lastActivityAt) {
      const hoursSinceActivity = (now.getTime() - profile.lastActivityAt.getTime()) / (1000 * 60 * 60);
      if (hoursSinceActivity > 48) {
        await prisma.userProfile.update({ where: { id: profile.id }, data: { currentStreak: 0 } });
        currentStreak = 0;
      }
    }

    const leaderboard = await prisma.userProfile.findMany({
      where: { xpPoints: { gt: 0 } },
      orderBy: { xpPoints: "desc" },
      take: 5,
      select: { id: true, username: true, xpPoints: true },
    });

    const higherRankedCount = await prisma.userProfile.count({
      where: { xpPoints: { gt: profile.xpPoints } },
    });

    const userRank = profile.xpPoints > 0 ? higherRankedCount + 1 : 0;
    const lastProgress = profile.progress[0] ?? null;

    return {
      username: profile.username,
      xpPoints: profile.xpPoints,
      currentStreak,
      longestStreak: profile.longestStreak,
      lessonsCompleted: profile.progress.length,
      enrolledCourseIds: profile.enrollments.map((e) => e.courseId),
      lastCompletedLessonId: lastProgress?.lessonId ?? null,
      lastCompletedAt: lastProgress?.completedAt ?? null,
      userRank,
      leaderboard,
    };
  } catch (error) {
    console.error("getDashboardData error:", error);
    return null;
  }
}

export async function getCourseProgress(
  courseId: string,
  totalLessons: number,
): Promise<{ completedLessons: number; progressPercent: number }> {
  const { userId } = await auth();
  if (!userId) return { completedLessons: 0, progressPercent: 0 };

  const profile = await prisma.userProfile.findUnique({ where: { clerkId: userId }, select: { id: true } });
  if (!profile) return { completedLessons: 0, progressPercent: 0 };

  const completedLessons = await prisma.lessonProgress.count({
    where: { userId: profile.id, courseId, completed: true },
  });

  const progressPercent = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;
  return { completedLessons, progressPercent };
}

export async function getCourseProgressBatch(
  courseIds: { id: string; totalLessons: number }[],
): Promise<Record<string, { completedLessons: number; progressPercent: number; totalLessons: number }>> {
  const { userId } = await auth();
  if (!userId) return {};

  const profile = await prisma.userProfile.findUnique({ where: { clerkId: userId }, select: { id: true } });
  if (!profile) return {};

  const result: Record<string, { completedLessons: number; progressPercent: number; totalLessons: number }> = {};

  await Promise.all(
    courseIds.map(async ({ id, totalLessons }) => {
      const completedLessons = await prisma.lessonProgress.count({
        where: { userId: profile.id, courseId: id, completed: true },
      });

      result[id] = {
        completedLessons,
        progressPercent: totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0,
        totalLessons,
      };
    }),
  );

  return result;
}
