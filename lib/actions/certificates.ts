"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { CP_COSTS } from "@/lib/cp-packages";

export async function checkCertificateEligibility(courseId: string, totalLessons: number): Promise<{
  eligible: boolean;
  completedLessons: number;
  totalLessons: number;
  alreadyIssued: boolean;
  certificate?: {
    id: string;
    certificateCode: string;
    issuedAt: Date;
  };
}> {
  const { userId } = await auth();
  if (!userId) return { eligible: false, completedLessons: 0, totalLessons, alreadyIssued: false };

  const profile = await prisma.userProfile.findUnique({
    where: { clerkId: userId },
    select: {
      id: true,
      certificates: { where: { courseId } },
    },
  });

  if (!profile) return { eligible: false, completedLessons: 0, totalLessons, alreadyIssued: false };

  if (profile.certificates.length > 0) {
    const cert = profile.certificates[0];
    return {
      eligible: true,
      completedLessons: totalLessons,
      totalLessons,
      alreadyIssued: true,
      certificate: {
        id: cert.id,
        certificateCode: cert.certificateCode,
        issuedAt: cert.issuedAt,
      },
    };
  }

  const completedLessons = await prisma.lessonProgress.count({
    where: {
      userId: profile.id,
      courseId,
      completed: true,
    },
  });

  const eligible = totalLessons > 0 && completedLessons >= totalLessons;

  return { eligible, completedLessons, totalLessons, alreadyIssued: false };
}

export async function claimCertificateWithCP(courseId: string, courseTitle: string) {
  const { userId } = await auth();
  if (!userId) return { error: "Not authenticated" };

  const cpCost = CP_COSTS.CERTIFICATE;

  const profile = await prisma.userProfile.findUnique({
    where: { clerkId: userId },
    select: { id: true, cpBalance: true, username: true },
  });

  if (!profile) return { error: "Profile not found" };

  const existing = await prisma.certificate.findFirst({ where: { userId: profile.id, courseId } });
  if (existing) return { alreadyIssued: true, certificate: existing };

  if (profile.cpBalance < cpCost) {
    return {
      error: "insufficient_cp",
      currentCP: profile.cpBalance,
      required: cpCost,
      shortfall: cpCost - profile.cpBalance,
    };
  }

  const certCode = crypto.randomUUID().replace(/-/g, "").substring(0, 16).toUpperCase();

  const [, certificate] = await prisma.$transaction([
    prisma.userProfile.update({
      where: { id: profile.id },
      data: { cpBalance: { decrement: cpCost } },
    }),
    prisma.certificate.create({
      data: {
        userId: profile.id,
        courseId,
        certificateCode: certCode,
        paid: true,
        paymentType: "cp",
        issuedAt: new Date(),
      },
    }),
    prisma.cPTransaction.create({
      data: {
        userId,
        type: "MODULE_UNLOCK",
        amount: -cpCost,
        courseId,
        description: `Certificate: ${courseTitle}`,
      },
    }),
  ]);

  revalidatePath("/dashboard");
  revalidatePath(`/certificate/${certCode}`);

  return {
    success: true,
    certificate,
    newCPBalance: profile.cpBalance - cpCost,
  };
}

export async function getUserCertificates() {
  const { userId } = await auth();
  if (!userId) return [];

  const profile = await prisma.userProfile.findUnique({
    where: { clerkId: userId },
    select: {
      id: true,
      username: true,
      certificates: {
        orderBy: { issuedAt: "desc" },
      },
    },
  });

  return profile?.certificates ?? [];
}

export async function getCertificateByCode(code: string) {
  return prisma.certificate.findUnique({
    where: { certificateCode: code },
    include: {
      user: {
        select: {
          username: true,
          createdAt: true,
        },
      },
    },
  });
}
