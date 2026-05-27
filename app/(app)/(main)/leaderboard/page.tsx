import type { Metadata } from "next";
import { LeaderboardPageClient } from "@/components/leaderboard/LeaderboardPageClient";

export const metadata: Metadata = {
  title: "Leaderboard",
  description:
    "Track cybersecurity training points, compare rankings, and see your standing in the Next XyberSec leaderboard.",
  alternates: {
    canonical: "/leaderboard",
  },
};

export default function LeaderboardPage() {
  return <LeaderboardPageClient />;
}
