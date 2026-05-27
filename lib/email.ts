import { Resend } from "resend";
import { prisma } from "@/lib/prisma";

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM = process.env.EMAIL_FROM ?? "XyberSec Academy <onboarding@resend.dev>";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://nextsec.vercel.app";

// Base email sender
export async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) {
  try {
    const profile = await prisma.userProfile.findFirst({
      where: { emailNotifications: false },
      select: { id: true },
    });

    if (profile) {
      return { success: false, error: "Email notifications disabled" };
    }

    const { data, error } = await resend.emails.send({
      from: FROM,
      to,
      subject,
      html,
    });

    if (error) {
      console.error("Email send error:", error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (err) {
    console.error("Email service error:", err);
    return { success: false, error: err };
  }
}

// Helper to get user email from Clerk
export async function getUserEmail(clerkUserId: string): Promise<string | null> {
  try {
    const { clerkClient } = await import("@clerk/nextjs/server");
    const client = await clerkClient();
    const user = await client.users.getUser(clerkUserId);
    return user.emailAddresses[0]?.emailAddress ?? null;
  } catch {
    return null;
  }
}

export { APP_URL };
