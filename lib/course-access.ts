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
  moduleIsFree: boolean,
): Promise<boolean> {
  if (moduleIsFree) return true;

  const { userId } = await auth();
  if (!userId) return false;

  const profile = await prisma.userProfile.findUnique({
    where: { clerkId: userId },
    include: {
      enrollments: {
        where: { courseId },
      },
    },
  });

  return (profile?.enrollments?.length ?? 0) > 0;
}

export async function getUserTier(): Promise<"free" | "pro" | "ultra"> {
  const { has } = await auth();

  if (has({ plan: "ultra" })) return "ultra";
  if (has({ plan: "pro" })) return "pro";

  return "free";
}
