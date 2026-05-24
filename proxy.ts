import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isProtectedRoute = createRouteMatcher([
  "/dashboard(.*)",
  "/lessons(.*)",
  "/onboarding(.*)",
]);
const isAdminRoute = createRouteMatcher(["/admin(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  if (isAdminRoute(req)) {
    const { userId, sessionClaims } = await auth();

    if (!userId) {
      return NextResponse.redirect(new URL("/sign-in", req.url));
    }

    const role = (sessionClaims?.publicMetadata as { role?: string })?.role;

    if (role !== "admin") {
      return NextResponse.redirect(
        new URL("/dashboard?error=unauthorized", req.url),
      );
    }

    return;
  }

  if (isProtectedRoute(req)) {
    await auth.protect();
  }

  // Read onboarding status from Clerk session claims
  // This works on any device, any browser, forever
  // No cookie dependency
  const { userId, sessionClaims } = await auth();
  const isLoggedIn = Boolean(userId);
  const pathname = req.nextUrl.pathname;

  // Check onboarding status from Clerk session claims
  const claimsComplete =
    (sessionClaims?.publicMetadata as {
      onboardingComplete?: boolean;
    })?.onboardingComplete ?? false;

  // Only run DB check on /dashboard route for logged-in users
  // when claims say incomplete. This handles stale session claims.
  if (isLoggedIn && !claimsComplete && pathname === "/dashboard") {
    try {
      const { prisma } = await import("@/lib/prisma");
      const profile = await prisma.userProfile.findUnique({
        where: { clerkId: userId! },
        select: { onboardingComplete: true },
      });

      // If DB says complete, allow dashboard access.
      if (profile?.onboardingComplete) {
        return NextResponse.next();
      }

      // DB also says incomplete, redirect to onboarding.
      return NextResponse.redirect(new URL("/onboarding", req.url));
    } catch (error) {
      // If DB check fails, don't block the user.
      console.error("Middleware DB check failed:", error);
      return NextResponse.next();
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
