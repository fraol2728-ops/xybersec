"use client";

import { usePathname } from "next/navigation";
import { Header } from "@/components/Header";

export function ConditionalHeader() {
  const pathname = usePathname();
  const hideOn = ["/dashboard", "/lessons"];
  const shouldHide = hideOn.some((path) => pathname.startsWith(path));

  if (shouldHide) return null;
  return <Header />;
}
