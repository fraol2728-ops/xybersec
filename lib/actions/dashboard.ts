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
      country: true,
      enrollments: {
        select: {
          courseId: true,
          enrolledAt: true,
          status: true,
          completedAt: true,
        },
      },
      progress: {
        where: { completed: true },
        select: {
          lessonId: true,
          courseId: true,
          completedAt: true,
          xpEarned: true,
        },
        orderBy: { completedAt: "desc" },
      },
      certificates: {
        select: {
          courseId: true,
          issuedAt: true,
          certificateCode: true,
        },
      },
    },
  });

  if (!profile) return null;

  const lessonsCompleted = profile.progress.length;
  const lastCompletedLesson = profile.progress[0] ?? null;
  const enrolledCourseIds = profile.enrollments.map((e) => e.courseId);

  const topStudents = await prisma.userProfile.findMany({
    orderBy: { xpPoints: "desc" },
    take: 5,
    select: {
      id: true,
      username: true,
      xpPoints: true,
      currentStreak: true,
    },
  });

  const higherRanked = await prisma.userProfile.count({
    where: {
      xpPoints: { gt: profile.xpPoints },
    },
  });
  const userRank = higherRanked + 1;

  const recentActivity = profile.progress.slice(0, 5).map((p) => ({
    lessonId: p.lessonId,
    courseId: p.courseId,
    completedAt: p.completedAt,
    xpEarned: p.xpEarned,
  }));

  const now = new Date();
  const lastActivity = profile.lastActivityAt;
  let streakStatus: "active" | "at_risk" | "broken" = "broken";

  if (lastActivity) {
    const hoursSince = (now.getTime() - lastActivity.getTime()) / (1000 * 60 * 60);
    if (hoursSince < 24) streakStatus = "active";
    else if (hoursSince < 48) streakStatus = "at_risk";
    else streakStatus = "broken";
  }

  return {
    profile: {
      username: profile.username,
      xpPoints: profile.xpPoints,
      currentStreak: profile.currentStreak,
      longestStreak: profile.longestStreak,
      lessonsCompleted,
      enrolledCourseIds,
      learningGoals: profile.learningGoals,
      country: profile.country,
      lastActivityAt: profile.lastActivityAt,
      certificatesEarned: profile.certificates.length,
      totalXpFromLessons: profile.progress.reduce((sum, p) => sum + (p.xpEarned ?? 0), 0),
      lastCompletedLesson,
    },
    leaderboard: topStudents,
    userRank,
    recentActivity,
    streakStatus,
  };
}
