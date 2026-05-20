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

  const { userId } = await auth();
  const isLoggedIn = Boolean(userId);
  const pathname = req.nextUrl.pathname;
  const onboardingComplete = req.cookies.get("onboarding_complete")?.value;

  const isOnboardingFlowPath = [
    "/onboarding/welcome",
    "/onboarding/step-1",
    "/onboarding/step-2",
    "/onboarding/step-3",
  ].includes(pathname);
  const isCoursePath = pathname.startsWith("/courses/");

  if (
    !onboardingComplete &&
    isLoggedIn &&
    pathname === "/dashboard" &&
    !isOnboardingFlowPath &&
    !isCoursePath
  ) {
    return NextResponse.redirect(new URL("/onboarding", req.url));
  }
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
