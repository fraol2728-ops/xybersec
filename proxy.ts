import { clerkMiddleware, createRouteMatcher } 
  from "@clerk/nextjs/server"
import { NextResponse } from "next/server"

const isProtectedRoute = createRouteMatcher([
  "/dashboard(.*)",
  "/lessons(.*)",
  "/onboarding(.*)",
])

const isAdminRoute = createRouteMatcher([
  "/admin(.*)"
])

// Routes that should NEVER trigger 
// onboarding redirect
const isOnboardingBypassRoute = createRouteMatcher([
  "/onboarding(.*)",
  "/courses(.*)",
  "/lessons(.*)",
  "/api(.*)",
])

export default clerkMiddleware(async (auth, req) => {
  const pathname = req.nextUrl.pathname

  // ── Admin protection ──────────────────────
  if (isAdminRoute(req)) {
    const { userId, sessionClaims } = await auth()

    if (!userId) {
      return NextResponse.redirect(
        new URL("/sign-in", req.url)
      )
    }

    const role = (
      sessionClaims?.publicMetadata as { 
        role?: string 
      }
    )?.role

    if (role !== "admin") {
      return NextResponse.redirect(
        new URL("/dashboard?error=unauthorized", req.url)
      )
    }

    return NextResponse.next()
  }

  // ── General route protection ───────────────
  if (isProtectedRoute(req)) {
    await auth.protect()
  }

  // ── Onboarding redirect check ──────────────
  // Only runs on exact /dashboard path
  // Skip entirely for bypass routes
  if (
    pathname !== "/dashboard" ||
    isOnboardingBypassRoute(req)
  ) {
    return NextResponse.next()
  }

  const { userId, sessionClaims } = await auth()
  
  if (!userId) {
    return NextResponse.next()
  }

  // Check session claims first (fast path)
  const claimsComplete = (
    sessionClaims?.publicMetadata as {
      onboardingComplete?: boolean
    }
  )?.onboardingComplete ?? false

  // Claims say complete — let them through
  if (claimsComplete) {
    return NextResponse.next()
  }

  // Claims say incomplete OR missing
  // Fall back to API route DB check
  // (Prisma can't run in Edge runtime directly)
  try {
    const statusUrl = new URL(
      "/api/onboarding-status",
      req.url
    )

    const response = await fetch(statusUrl.toString(), {
      method: "GET",
      headers: {
        // Forward auth cookies so the API route
        // can authenticate the request
        cookie: req.headers.get("cookie") ?? "",
        // Prevent infinite loops
        "x-middleware-check": "1",
      },
    })

    if (!response.ok) {
      // API route failed — fail open
      return NextResponse.next()
    }

    const data = await response.json()

    if (data.complete === true) {
      // DB says complete — let through
      return NextResponse.next()
    }

    // DB says incomplete — send to onboarding
    return NextResponse.redirect(
      new URL("/onboarding", req.url)
    )

  } catch (error) {
    // Network error — fail open, don't block user
    console.error("Onboarding check failed:", error)
    return NextResponse.next()
  }
})

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
}
