"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ProgramShowcaseData {
  _id: string;
  title: string | null;
  description: string | null;
  slug?: { current?: string | null } | null;
  tier?: "free" | "pro" | "ultra" | null;
  category?: string | null;
  level?: string | null;
  thumbnail?: {
    asset?: {
      url?: string | null;
    } | null;
  } | null;
  image?: string | null;
}

interface ProgramShowcaseProps {
  program: ProgramShowcaseData;
  reverse?: boolean;
}

const tierToLevel: Record<NonNullable<ProgramShowcaseData["tier"]>, string> = {
  free: "Beginner",
  pro: "Intermediate",
  ultra: "Advanced",
};

export function ProgramShowcase({
  program,
  reverse = false,
}: ProgramShowcaseProps) {
  const title = program.title ?? "Untitled Program";
  const description =
    program.description ??
    "Hands-on cybersecurity training built for practical growth.";
  const level =
    program.level ?? (program.tier ? tierToLevel[program.tier] : "All Levels");
  const categoryName =
    typeof program.category === "string" ? program.category : "Cybersecurity";
  const imageUrl = program.image ?? program.thumbnail?.asset?.url;
  const descriptionPoints = description
    .split(".")
    .map((sentence) => sentence.trim())
    .filter(Boolean);

  return (
    <motion.section
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6 }}
      className="border-b border-slate-700/60 bg-[#0f172a] py-14 md:py-20"
    >
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 md:grid-cols-2 lg:px-12">
        <div
          className={cn(
            "space-y-6 rounded-2xl border border-slate-700/70 bg-[#111827] p-6 shadow-[0_18px_45px_rgba(6,182,212,0.12)] md:p-8",
            reverse && "md:order-2",
          )}
        >
          <h2 className="text-3xl font-bold tracking-tight text-[#e5e7eb] md:text-4xl">
            {title}
          </h2>
          <motion.ul
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={{
              hidden: {},
              visible: {
                transition: {
                  staggerChildren: 0.12,
                },
              },
            }}
            className="max-w-xl space-y-2 text-base leading-relaxed text-[#9ca3af] md:text-lg"
          >
            {descriptionPoints.map((point, index) => (
              <motion.li
                key={`${program._id}-point-${index}`}
                variants={{
                  hidden: { opacity: 0, x: -14 },
                  visible: { opacity: 1, x: 0 },
                }}
                transition={{ duration: 0.35, ease: "easeOut" }}
                className="flex items-start gap-3"
              >
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-300/90" />
                <span>{point}.</span>
              </motion.li>
            ))}
          </motion.ul>
          <div className="flex flex-wrap gap-3">
            <Badge
              variant="secondary"
              className="border border-slate-600/80 bg-slate-800/70 px-3 py-1 text-[#9ca3af]"
            >
              {level}
            </Badge>
            <Badge
              variant="secondary"
              className="border border-cyan-400/30 bg-cyan-500/15 px-3 py-1 text-cyan-200"
            >
              {categoryName}
            </Badge>
          </div>
          <Button
            asChild
            size="lg"
            className="group border border-cyan-300/30 bg-gradient-to-r from-cyan-500/80 to-sky-500/80 text-[#e5e7eb] hover:from-cyan-400 hover:to-sky-400"
          >
            <Link
              href={
                program.slug?.current ? `/courses/${program.slug.current}` : "#"
              }
            >
              Start Program
              <span className="transition-transform duration-200 group-hover:translate-x-1">
                →
              </span>
            </Link>
          </Button>
        </div>

        <div className={cn("relative", reverse && "md:order-1")}>
          <div className="relative aspect-[16/10] overflow-hidden rounded-2xl border border-slate-700/80 bg-[#111827] shadow-[0_16px_40px_rgba(15,23,42,0.65)]">
            {imageUrl ? (
              <>
                <Image
                  src={imageUrl}
                  alt={title}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a]/90 via-[#0f172a]/35 to-transparent" />
              </>
            ) : (
              <div className="h-full w-full bg-gradient-to-br from-cyan-500/25 via-slate-800/60 to-[#0f172a]" />
            )}
          </div>
        </div>
      </div>
    </motion.section>
  );
}
