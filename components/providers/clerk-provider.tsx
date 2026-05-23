"use client";

import { ClerkProvider } from "@clerk/nextjs";

export function ClientClerkProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider
      afterSignUpUrl="/onboarding"
      afterSignInUrl="/dashboard"
      afterSignOutUrl="/"
    >
      {children}
    </ClerkProvider>
  );
}
