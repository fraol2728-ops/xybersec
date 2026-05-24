"use server";

import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function getDashboardData() {
  const { userId } = await auth();
  if (!userId) return null;

  const profile = await prisma.userProfile.findUnique({
    where: { clerkId: userId },
    select: {
      id: true,
      username: true,
      xpPoints: true,
      currentStreak: true,
      longestStreak: true,
      lastActivityAt: true,
      learningGoals: true,
      enrollments: {
        select: {
          courseId: true,
          enrolledAt: true,
          status: true,
        },
      },
      progress: {
        where: { completed: true },
        select: {
          lessonId: true,
          courseId: true,
          completedAt: true,
        },
      },
    },
  });

  if (!profile) return null;

  const lessonsCompleted = profile.progress.length;

  const topStudents = await prisma.userProfile.findMany({
    where: {
      xpPoints: { gt: 0 },
    },
    orderBy: { xpPoints: "desc" },
    take: 5,
    select: {
      id: true,
      username: true,
      xpPoints: true,
    },
  });

  const higherRanked = await prisma.userProfile.count({
    where: {
      xpPoints: { gt: profile.xpPoints },
    },
  });
  const userRank = higherRanked + 1;

  return {
    profile: {
      username: profile.username,
      xpPoints: profile.xpPoints,
      currentStreak: profile.currentStreak,
      longestStreak: profile.longestStreak,
      lessonsCompleted,
      enrolledCourseIds: profile.enrollments.map((e) => e.courseId),
    },
    leaderboard: topStudents,
    userRank,
  };
}
