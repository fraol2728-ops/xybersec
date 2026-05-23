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

  const onboardingComplete =
    (sessionClaims?.publicMetadata as {
      onboardingComplete?: boolean;
    })?.onboardingComplete ?? false;

  // Only redirect to onboarding from exact /dashboard
  // Never redirect from /onboarding/* paths or /courses/*
  if (isLoggedIn && !onboardingComplete && pathname === "/dashboard") {
    return NextResponse.redirect(new URL("/onboarding", req.url));
  }
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
