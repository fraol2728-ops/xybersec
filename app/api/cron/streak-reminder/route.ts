import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendEmail, getUserEmail } from "@/lib/email";
import { streakReminderEmailTemplate } from "@/lib/email-templates";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const now = new Date();
    const twentyHoursAgo = new Date(now.getTime() - 20 * 60 * 60 * 1000);
    const fortyEightHoursAgo = new Date(now.getTime() - 48 * 60 * 60 * 1000);

    const usersAtRisk = await prisma.userProfile.findMany({
      where: { currentStreak: { gt: 0 }, lastActivityAt: { gte: fortyEightHoursAgo, lte: twentyHoursAgo }, emailNotifications: true },
      select: { clerkId: true, username: true, currentStreak: true, lastActivityAt: true, progress: { orderBy: { completedAt: "desc" }, take: 1, select: { courseId: true } } },
      take: 100,
    });

    let sent = 0;
    let failed = 0;
    for (const user of usersAtRisk) {
      try {
        const email = await getUserEmail(user.clerkId);
        if (!email) continue;
        const hoursElapsed = (now.getTime() - user.lastActivityAt!.getTime()) / (1000 * 60 * 60);
        const hoursLeft = Math.max(1, Math.floor(48 - hoursElapsed));
        const { subject, html } = streakReminderEmailTemplate({ username: user.username ?? "Student", currentStreak: user.currentStreak, hoursLeft });
        const result = await sendEmail({ to: email, subject, html });
        if (result.success) sent++; else failed++;
      } catch {
        failed++;
      }
    }

    return NextResponse.json({ success: true, usersAtRisk: usersAtRisk.length, sent, failed, timestamp: now.toISOString() });
  } catch (err) {
    console.error("Streak cron error:", err);
    return NextResponse.json({ error: "Cron job failed" }, { status: 500 });
  }
}
