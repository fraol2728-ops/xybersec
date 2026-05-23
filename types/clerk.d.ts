export {};

declare global {
  interface CustomJwtSessionClaims {
    publicMetadata?: {
      role?: string;
      onboardingComplete?: boolean;
    };
  }
}
