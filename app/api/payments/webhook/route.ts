import { NextRequest, NextResponse } from "next/server";
import { verifyPayment } from "@/lib/chapa";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const txRef = body.tx_ref ?? body.trx_ref;

    if (!txRef) return NextResponse.json({ error: "No tx_ref" }, { status: 400 });

    const verification = await verifyPayment(txRef);
    if (verification.data.status !== "success") return NextResponse.json({ error: "Payment not successful" }, { status: 200 });

    const payment = await prisma.payment.findUnique({ where: { chapaReference: txRef } });
    if (!payment || payment.status === "SUCCESS") return NextResponse.json({ message: "Already processed" }, { status: 200 });

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
    }

    const cpTransaction = await prisma.cPTransaction.findUnique({
      where: { chapaRef: txRef },
    });

    if (cpTransaction && cpTransaction.type === "PURCHASE" && cpTransaction.amount > 0) {
      const profile = await prisma.userProfile.findUnique({
        where: { clerkId: cpTransaction.userId },
      });

      if (profile) {
        await prisma.userProfile.update({
          where: { id: profile.id },
          data: {
            cpBalance: {
              increment: cpTransaction.amount,
            },
          },
        });
      }
    }

    return NextResponse.json({ message: "Webhook processed" }, { status: 200 });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
  }
}
