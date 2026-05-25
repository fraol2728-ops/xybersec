import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function getUserCourseAccess(courseId: string) {
  const { userId } = await auth();

  if (!userId) {
    return {
      isAuthenticated: false,
      isEnrolled: false,
      canAccessFreeContent: true,
    };
  }

  const profile = await prisma.userProfile.findUnique({
    where: { clerkId: userId },
    include: {
      enrollments: {
        where: { courseId },
      },
    },
  });

  const isEnrolled = (profile?.enrollments?.length ?? 0) > 0;

  return {
    isAuthenticated: true,
    isEnrolled,
    canAccessFreeContent: true,
    profileId: profile?.id,
  };
}

export async function canUserAccessLesson(
  courseId: string,
  moduleId: string,
  moduleIsFree: boolean,
  cpCost?: number,
): Promise<{
  canAccess: boolean;
  reason: "free" | "enrolled" | "unlocked" | "locked" | "unauthenticated";
  cpCost?: number;
  userCPBalance?: number;
}> {
  if (moduleIsFree || (cpCost ?? 0) === 0) {
    return { canAccess: true, reason: "free" };
  }

  const { userId } = await auth();
  if (!userId) {
    return { canAccess: false, reason: "unauthenticated" };
  }

  const moduleUnlock = await prisma.moduleUnlock.findUnique({
    where: {
      userId_moduleId: { userId, moduleId },
    },
  });

  if (moduleUnlock) {
    return { canAccess: true, reason: "unlocked" };
  }

  const profile = await prisma.userProfile.findUnique({
    where: { clerkId: userId },
    select: {
      id: true,
      cpBalance: true,
      enrollments: {
        where: { courseId },
      },
    },
  });

  if ((profile?.enrollments?.length ?? 0) > 0) {
    return { canAccess: true, reason: "enrolled" };
  }

  return {
    canAccess: false,
    reason: "locked",
    cpCost: cpCost ?? 100,
    userCPBalance: profile?.cpBalance ?? 0,
  };
}

export async function getUserTier(): Promise<"free" | "pro" | "ultra"> {
  const { has } = await auth();

  if (has({ plan: "ultra" })) return "ultra";
  if (has({ plan: "pro" })) return "pro";

  return "free";
}
