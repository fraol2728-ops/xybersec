"use client";

import { motion } from "framer-motion";
import { Rocket, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import { GetStartedButton } from "@/components/landing/GetStartedButton";
import { Button } from "@/components/ui/button";
import { glowTokenClass, heroGradientTokenClass } from "@/lib/theme";

const containerVariants = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.55,
      staggerChildren: 0.12,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45 } },
};

export function HeroSection() {
  return (
    <section
      className="relative overflow-hidden border-b border-border/70"
      id="hero"
    >
      <div className="absolute inset-0 opacity-35 [background-image:linear-gradient(rgb(var(--primary)/0.12)_1px,transparent_1px),linear-gradient(90deg,rgb(var(--primary)/0.1)_1px,transparent_1px)] [background-size:48px_48px]" />
      <div className={`absolute inset-0 ${heroGradientTokenClass}`} />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        className="relative mx-auto max-w-7xl px-6 pb-24 pt-24 text-center lg:px-12 lg:pb-32 lg:pt-28"
      >
        <motion.div
          variants={itemVariants}
          className={`mx-auto inline-flex items-center gap-2 rounded-full border border-primary/35 bg-primary/12 px-4 py-2 text-xs uppercase tracking-[0.24em] text-foreground/85 ${glowTokenClass}`}
        >
          <ShieldCheck className="h-4 w-4" />
          Cybersecurity Academy Platform
        </motion.div>

        <motion.h1
          variants={itemVariants}
          className="mx-auto mt-7 max-w-4xl text-4xl font-black leading-tight text-foreground sm:text-5xl lg:text-6xl"
        >
          Master Cybersecurity Through Real-World Training
        </motion.h1>

        <motion.p
          variants={itemVariants}
          className="mx-auto mt-6 max-w-2xl text-base text-muted-foreground sm:text-lg"
        >
          Learn ethical hacking, penetration testing, and cyber defense through
          structured courses.
        </motion.p>

        <motion.div
          variants={itemVariants}
          className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center"
        >
          <SignedOut><Link href="/sign-up"><Button className="h-11 w-full px-8 font-semibold sm:w-auto">Start Learning</Button></Link></SignedOut>
          <SignedIn><Button className="h-11 w-full px-8 font-semibold sm:w-auto"><GetStartedButton /></Button></SignedIn>
          <Link href="/#courses">
            <Button variant="outline" className="h-11 w-full px-8 sm:w-auto">
              Explore Courses
            </Button>
          </Link>
        </motion.div>

        <motion.div
          aria-hidden
          initial={{ y: 0, rotate: -8, opacity: 0.7 }}
          animate={{
            y: [-8, 8, -8],
            rotate: [-8, 3, -8],
            opacity: [0.6, 0.95, 0.6],
          }}
          transition={{ duration: 5.8, repeat: Number.POSITIVE_INFINITY }}
          className="pointer-events-none absolute right-[6%] top-[18%] hidden rounded-full border border-primary/35 bg-background/60 p-3 text-primary shadow-[0_0_20px_rgb(var(--primary)/0.3)] backdrop-blur md:block motion-reduce:hidden"
        >
          <Rocket className="h-6 w-6" />
        </motion.div>
      </motion.div>
    </section>
  );
}
