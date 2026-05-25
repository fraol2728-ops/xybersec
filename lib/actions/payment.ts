"use server";

import { auth, currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { generateTxRef, initializePayment, verifyPayment } from "@/lib/chapa";
import { PRICING } from "@/lib/constants";
import { prisma } from "@/lib/prisma";

export async function initializeCoursePayment(courseId: string, courseTitle: string, plan: "monthly" | "yearly" = "monthly") {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const user = await currentUser();
  if (!user) redirect("/sign-in");

  const profile = await prisma.userProfile.findUnique({
    where: { clerkId: userId },
    include: { enrollments: { where: { courseId } } },
  });

  if ((profile?.enrollments?.length ?? 0) > 0) return { error: "Already enrolled in this course" };

  const amount = plan === "yearly" ? PRICING.COURSE_YEARLY : PRICING.COURSE_MONTHLY;
  const txRef = generateTxRef(userId, courseId);
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

  await prisma.payment.create({
    data: { userId, courseId, chapaReference: txRef, amount, currency: PRICING.CURRENCY, status: "PENDING", type: "COURSE" },
  });

  try {
    const response = await initializePayment({
      amount,
      currency: PRICING.CURRENCY,
      email: user.emailAddresses[0]?.emailAddress ?? `${userId}@xybersec.com`,
      firstName: user.firstName ?? "Student",
      lastName: user.lastName ?? "User",
      txRef,
      callbackUrl: `${appUrl}/api/payments/webhook`,
      returnUrl: `${appUrl}/payment/success?tx_ref=${txRef}`,
      title: "XyberSec Academy",
      description: `Full access to ${courseTitle}`,
      meta: { userId, courseId, plan },
    });

    return { success: true, checkoutUrl: response.data.checkout_url, txRef };
  } catch {
    await prisma.payment.deleteMany({ where: { chapaReference: txRef } });
    return { error: "Payment initialization failed. Please try again." };
  }
}

export async function initializeCertificatePayment(courseId: string, courseTitle: string) {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const user = await currentUser();
  if (!user) redirect("/sign-in");

  const profile = await prisma.userProfile.findUnique({
    where: { clerkId: userId },
    include: { enrollments: { where: { courseId } }, certificates: { where: { courseId } } },
  });

  if ((profile?.enrollments?.length ?? 0) === 0) return { error: "You must enroll first" };
  if ((profile?.certificates?.length ?? 0) > 0) return { error: "Certificate already issued" };

  const txRef = generateTxRef(userId, `cert-${courseId}`);
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

  await prisma.payment.create({
    data: {
      userId,
      courseId,
      chapaReference: txRef,
      amount: PRICING.CERTIFICATE,
      currency: PRICING.CURRENCY,
      status: "PENDING",
      type: "CERTIFICATE",
    },
  });

  try {
    const response = await initializePayment({
      amount: PRICING.CERTIFICATE,
      currency: PRICING.CURRENCY,
      email: user.emailAddresses[0]?.emailAddress ?? `${userId}@xybersec.com`,
      firstName: user.firstName ?? "Student",
      lastName: user.lastName ?? "User",
      txRef,
      callbackUrl: `${appUrl}/api/payments/webhook`,
      returnUrl: `${appUrl}/payment/success?tx_ref=${txRef}`,
      title: "XyberSec Certificate",
      description: `Certificate for ${courseTitle}`,
      meta: { userId, courseId, type: "certificate" },
    });

    return { success: true, checkoutUrl: response.data.checkout_url, txRef };
  } catch {
    await prisma.payment.deleteMany({ where: { chapaReference: txRef } });
    return { error: "Payment initialization failed." };
  }
}

export async function verifyAndFulfillPayment(txRef: string) {
  if (!txRef) return { error: "No transaction reference" };

  try {
    const verification = await verifyPayment(txRef);
    if (verification.data.status !== "success") return { error: "Payment not successful", status: verification.data.status };

    const cpTransaction = await prisma.cPTransaction.findUnique({ where: { chapaRef: txRef } });
    if (cpTransaction && cpTransaction.type === "PURCHASE" && cpTransaction.amount > 0) {
      const profile = await prisma.userProfile.findUnique({ where: { clerkId: cpTransaction.userId } });
      if (profile) {
        await prisma.userProfile.update({
          where: { id: profile.id },
          data: { cpBalance: { increment: cpTransaction.amount } },
        });
      }
      revalidatePath("/dashboard");
      revalidatePath("/store");
      return { success: true, type: "CP_PURCHASE" };
    }

    const payment = await prisma.payment.findUnique({ where: { chapaReference: txRef } });
    if (!payment) return { error: "Payment record not found" };
    if (payment.status === "SUCCESS") return { alreadyProcessed: true, type: payment.type };

    await prisma.payment.update({ where: { chapaReference: txRef }, data: { status: "SUCCESS" } });

    if (payment.type === "COURSE" && payment.courseId) {
      const profile = await prisma.userProfile.findUnique({ where: { clerkId: payment.userId } });
      if (profile) {
        await prisma.enrollment.upsert({
          where: { userId_courseId: { userId: profile.id, courseId: payment.courseId } },
          update: { status: "ACTIVE", paymentId: payment.id, amountPaid: payment.amount },
          create: {
            userId: profile.id,
            courseId: payment.courseId,
            status: "ACTIVE",
            paymentId: payment.id,
            amountPaid: payment.amount,
            currency: payment.currency,
          },
        });
      }

      revalidatePath("/dashboard");
      revalidatePath("/courses");
      return { success: true, type: "COURSE", courseId: payment.courseId };
    }

    if (payment.type === "CERTIFICATE" && payment.courseId) {
      const profile = await prisma.userProfile.findUnique({ where: { clerkId: payment.userId } });
      if (profile) {
        await prisma.certificate.create({
          data: {
            userId: profile.id,
            courseId: payment.courseId,
            certificateCode: crypto.randomUUID(),
            paid: true,
            paymentId: payment.id,
          },
        });
      }

      revalidatePath("/dashboard");
      return { success: true, type: "CERTIFICATE" };
    }

    return { success: true };
  } catch (error) {
    console.error("Payment verification error:", error);
    return { error: "Verification failed. Contact support." };
  }
}
