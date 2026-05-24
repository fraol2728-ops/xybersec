import { auth } from "@clerk/nextjs/server"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export const runtime = "nodejs"

export async function GET(request: Request) {
  // Prevent middleware from calling this 
  // route recursively
  const isMiddlewareCall = 
    request.headers.get("x-middleware-check")
  
  // (No special handling needed — the bypass
  // route matcher handles /api/* already)
  void isMiddlewareCall

  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json(
        { complete: false },
        { status: 200 }
      )
    }

    const profile = await prisma.userProfile.findUnique({
      where: { clerkId: userId },
      select: { onboardingComplete: true },
    })

    return NextResponse.json({
      complete: profile?.onboardingComplete ?? false,
    })
  } catch (error) {
    console.error("Onboarding status check failed:", error)
    // Fail open — don't block users if DB is down
    return NextResponse.json(
      { complete: true },
      { status: 200 }
    )
  }
}
