"use server";

import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { getLevelFromXP } from "@/lib/levels";

export interface DashboardStats {
  username: string | null;
  xpPoints: number;
  currentStreak: number;
  longestStreak: number;
  lessonsCompleted: number;
  enrolledCourseIds: string[];
  lastCompletedLessonId: string | null;
  userRank: number;
  activeCourseId: string | null;
  recentCourseIds: string[];
  completedLessonIds: string[];
  unlockedModuleIds: string[];
  leaderboard: {
    id: string;
    username: string | null;
    xpPoints: number;
  }[];
  level: {
    level: number;
    title: string;
    progressPercent: number;
    xpToNext: number;
    minXP: number;
    maxXP: number;
  };
  weeklyActivity: Record<string, boolean>;
  skillProgress: Record<string, number>;
  learningGoals: string[];
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
        learningGoals: true,
        enrollments: {
          where: { status: "ACTIVE" },
          select: { courseId: true },
        },
        progress: {
          where: { completed: true },
          orderBy: { completedAt: "desc" },
          select: { lessonId: true, courseId: true, completedAt: true },
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

    const levelData = getLevelFromXP(profile.xpPoints);

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const recentProgress = await prisma.lessonProgress.findMany({
      where: {
        userId: profile.id,
        completed: true,
        completedAt: { gte: sevenDaysAgo },
      },
      select: { completedAt: true },
    });

    const weeklyActivity: Record<string, boolean> = {};
    const today = new Date();

    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split("T")[0];

      const wasActive = recentProgress.some((p) => {
        const pDate = p.completedAt?.toISOString().split("T")[0];
        return pDate === dateStr;
      });

      weeklyActivity[dateStr] = wasActive;
    }

    const skillProgress: Record<string, number> = {};

    const goalToCategoryMap: Record<string, string> = {
      web_hacking: "Web Application Hacking",
      network_pentesting: "Network Security",
      linux: "Linux & CLI",
      malware_analysis: "Malware Analysis",
      digital_forensics: "Digital Forensics",
      ctf: "CTF Challenges",
      bug_bounty: "Bug Bounty",
      social_engineering: "Social Engineering",
    };
    void goalToCategoryMap;

    const userGoals = profile.learningGoals ?? [];
    for (const goal of userGoals) {
      skillProgress[goal] = 0;
    }

    if (userGoals.length > 0 && profile.progress.length > 0) {
      const progressPerGoal = Math.floor((profile.progress.length * 5) / userGoals.length);
      userGoals.forEach((goal) => {
        skillProgress[goal] = Math.min(progressPerGoal, 100);
      });
    }

    const userRank = profile.xpPoints > 0 ? higherRankedCount + 1 : 0;
    const mostRecentProgress = profile.progress[0] ?? null;
    const activeCourseId = mostRecentProgress?.courseId ?? null;
    const lastCompletedLessonId = mostRecentProgress?.lessonId ?? null;
    const activeCourseIds = [...new Set(profile.progress.map((p) => p.courseId))];

    let activeUnlockedModules: string[] = [];

    if (activeCourseIds[0]) {
      const unlocks = await prisma.moduleUnlock.findMany({
        where: {
          userId,
          courseId: activeCourseIds[0],
        },
        select: { moduleId: true },
      });
      activeUnlockedModules = unlocks.map((u) => u.moduleId);
    }

    return {
      username: profile.username,
      xpPoints: profile.xpPoints,
      currentStreak,
      longestStreak: profile.longestStreak,
      lessonsCompleted: profile.progress.length,
      enrolledCourseIds: profile.enrollments.map((e) => e.courseId),
      lastCompletedLessonId,
      userRank,
      activeCourseId,
      recentCourseIds: activeCourseIds.slice(0, 3),
      completedLessonIds: profile.progress.map((p) => p.lessonId),
      unlockedModuleIds: activeUnlockedModules,
      leaderboard,
      level: {
        level: levelData.level,
        title: levelData.title,
        progressPercent: levelData.progressPercent,
        xpToNext: levelData.xpToNext,
        minXP: levelData.minXP,
        maxXP: levelData.maxXP,
      },
      weeklyActivity,
      skillProgress,
      learningGoals: userGoals,
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
