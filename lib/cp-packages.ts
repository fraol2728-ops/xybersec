export interface CPPackage {
  id: string;
  name: string;
  cp: number;
  priceETB: number;
  popular?: boolean;
  badge?: string;
  perCP: number;
  savingPercent?: number;
}

export const CP_PACKAGES: CPPackage[] = [
  {
    id: "starter",
    name: "Starter Pack",
    cp: 100,
    priceETB: 299,
    perCP: 2.99,
    badge: "Get started",
  },
  {
    id: "popular",
    name: "Popular Pack",
    cp: 300,
    priceETB: 699,
    perCP: 2.33,
    popular: true,
    savingPercent: 22,
    badge: "🔥 Most Popular",
  },
  {
    id: "pro",
    name: "Pro Pack",
    cp: 700,
    priceETB: 1299,
    perCP: 1.86,
    savingPercent: 38,
    badge: "⚡ Best Value",
  },
  {
    id: "elite",
    name: "Elite Pack",
    cp: 2000,
    priceETB: 2999,
    perCP: 1.5,
    savingPercent: 50,
    badge: "💎 Elite",
  },
];

export const WELCOME_BONUS_CP = 50;

export const CP_COSTS = {
  CERTIFICATE: 500,
} as const;
