import type { Metadata } from "next";
import Link from "next/link";
import {
  type CareerPath,
  FAQSection,
  type ProgramCourse,
  RoadmapSection,
} from "@/components/programs";
import { StructuredData } from "@/components/seo/StructuredData";
import { Badge } from "@/components/ui/badge";
import { buildMetadata, siteConfig } from "@/lib/seo";
import { sanityFetch } from "@/sanity/lib/live";
import {
  COURSES_CATEGORIES_QUERY,
  PROGRAMS_CAREER_PATHS_QUERY,
} from "@/sanity/lib/queries";

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({
    title:
      "Cybersecurity Courses in Ethiopia | Learn Ethical Hacking Free - Xybersec",
    description:
      "Join Xybersec to learn cybersecurity in Ethiopia. مجانية ethical hacking courses, red team, blue team, and penetration testing training for beginners.",
    path: "/programs",
    keywords: [
      "cybersecurity course in Ethiopia",
      "ethical hacking Ethiopia",
      "free cybersecurity course Ethiopia",
      "learn hacking Addis Ababa",
    ],
  });
}

interface CategoryResult {
  _id: string;
  title: string | null;
}

interface CareerPathResult {
  _id: string;
  title: string | null;
  slug: { current: string | null } | null;
  description: string | null;
  tier: string | null;
  thumbnail: { asset: { url: string | null } | null } | null;
  lessonCount: number | null;
  modules: Array<{
    _id: string;
    title: string | null;
    description: string | null;
    lessonsCount: number | null;
  }> | null;
}
const inferDifficulty = (
  tier: string | null | undefined,
): ProgramCourse["difficulty"] => {
  if (tier === "ultra") return "Advanced";
  if (tier === "pro") return "Intermediate";
  return "Beginner";
};

export default async function ProgramsPage() {
  const [{ data: pathsData }, { data: categoriesData }] = (await Promise.all([
    sanityFetch({
      query: PROGRAMS_CAREER_PATHS_QUERY,
    }) as Promise<{ data: CareerPathResult[] }>,
    sanityFetch({
      query: COURSES_CATEGORIES_QUERY,
    }) as Promise<{ data: CategoryResult[] }>,
  ])) as [{ data: CareerPathResult[] }, { data: CategoryResult[] }];

  const categories = categoriesData
    .filter((category) => Boolean(category.title))
    .map((category) => category.title ?? "General");

  const careerPaths: CareerPath[] = pathsData
    .filter((path) => Boolean(path.slug?.current))
    .map((path) => ({
      id: path._id,
      slug: path.slug?.current ?? "path",
      title: path.title ?? "Untitled Program",
      description: path.description ?? "Roadmap details coming soon.",
      difficulty: inferDifficulty(path.tier),
      thumbnailUrl: path.thumbnail?.asset?.url ?? undefined,
      lessonCount: path.lessonCount ?? 0,
      phases: (path.modules ?? []).map((phase) => ({
        id: phase._id,
        title: phase.title ?? "Untitled Phase",
        description: phase.description ?? undefined,
        lessonsCount: phase.lessonsCount ?? 0,
      })),
    }));

  const courses: ProgramCourse[] = careerPaths.map((path) => {
    const estimatedHours = Math.max(1, Math.ceil(path.lessonCount / 4));

    return {
      id: path.id,
      slug: path.slug,
      title: path.title,
      difficulty: path.difficulty,
      category: "Career Path",
      lessonCount: path.lessonCount,
      durationLabel: `${estimatedHours} ${estimatedHours === 1 ? "Hour" : "Hours"}`,
      description: path.description,
    };
  });

  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Xybersec programs",
    itemListElement: courses.map((course, index) => ({
      "@type": "Course",
      position: index + 1,
      name: course.title,
      provider: {
        "@type": "Organization",
        name: siteConfig.name,
      },
      url: `${siteConfig.url}/programs/${course.slug}`,
      educationalLevel: course.difficulty,
    })),
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: siteConfig.url,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Programs",
        item: `${siteConfig.url}/programs`,
      },
    ],
  };

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    name: "Xybersec",
    areaServed: "Ethiopia",
    address: {
      "@type": "PostalAddress",
      addressCountry: "ET",
    },
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Is this free?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. Xybersec includes free starter content, and you can unlock deeper path modules as you progress.",
        },
      },
      {
        "@type": "Question",
        name: "Do I need experience?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "No prior experience is required. The academy starts from fundamentals and guides you into advanced tracks.",
        },
      },
      {
        "@type": "Question",
        name: "Can I learn cybersecurity in Ethiopia?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Absolutely. Xybersec is built for Ethiopian learners with online-first access and structured local relevance.",
        },
      },
      {
        "@type": "Question",
        name: "Is ethical hacking legal?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Ethical hacking is legal only with explicit authorization and within applicable laws. Always test systems you are permitted to assess.",
        },
      },
    ],
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      <StructuredData data={itemListSchema} />
      <StructuredData data={breadcrumbSchema} />
      <StructuredData data={organizationSchema} />
      <StructuredData data={faqSchema} />

      <main className="mx-auto max-w-7xl space-y-10 px-4 py-12 sm:px-6 lg:px-10">
        <section className="relative overflow-hidden rounded-3xl border border-cyan-400/30 bg-gradient-to-br from-[#15152a] via-[#100f1e] to-[#0a0a0f] p-8 shadow-[0_0_80px_-35px_rgba(34,211,238,0.6)] sm:p-12">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(56,189,248,0.16),_transparent_45%),linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:auto,28px_28px,28px_28px] opacity-55" />
          <div className="relative z-10 max-w-3xl">
            <p className="font-mono text-xs uppercase tracking-[0.26em] text-cyan-200/90">
              Xybersec Academy
            </p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-5xl">
              Cybersecurity Career Paths
            </h1>
            <p className="mt-4 text-base leading-7 text-zinc-300 sm:text-lg">
              Follow structured roadmaps to become a Red Teamer, Blue Teamer, or
              Security Specialist.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                href="#roadmaps"
                className="rounded-xl border border-cyan-300/50 bg-cyan-400/10 px-5 py-2.5 font-mono text-sm font-medium text-cyan-100 transition hover:bg-cyan-400/20"
              >
                Start Your Journey
              </Link>
              <Link
                href="/academy"
                className="rounded-xl border border-white/15 bg-white/5 px-5 py-2.5 font-mono text-sm text-zinc-200 transition hover:bg-white/10"
              >
                Enter Academy
              </Link>
            </div>
          </div>
        </section>

        <RoadmapSection paths={careerPaths} />

        <section className="rounded-3xl border border-white/10 bg-[#10101a] p-6 sm:p-8">
          <h2 className="font-mono text-2xl font-semibold sm:text-3xl">
            Why Xybersec?
          </h2>
          <p className="mt-2 text-zinc-300">
            Practical, local, and path-based cybersecurity training designed for
            real career progression.
          </p>
          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <article className="rounded-2xl border border-white/10 bg-black/20 p-5">
              <p className="text-2xl">🇪🇹</p>
              <h3 className="mt-3 font-semibold text-cyan-200">
                Built for Ethiopian learners
              </h3>
              <p className="mt-2 text-sm text-zinc-300">
                Localized learning context and community-driven support.
              </p>
            </article>
            <article className="rounded-2xl border border-white/10 bg-black/20 p-5">
              <p className="text-2xl">🗺️</p>
              <h3 className="mt-3 font-semibold text-cyan-200">
                Structured learning paths
              </h3>
              <p className="mt-2 text-sm text-zinc-300">
                No guessing. Follow clear phases from fundamentals to mastery.
              </p>
            </article>
            <article className="rounded-2xl border border-white/10 bg-black/20 p-5">
              <p className="text-2xl">🧪</p>
              <h3 className="mt-3 font-semibold text-cyan-200">
                Hands-on cybersecurity skills
              </h3>
              <p className="mt-2 text-sm text-zinc-300">
                Build applied skills with practical lessons and technical
                workflows.
              </p>
            </article>
            <article className="rounded-2xl border border-white/10 bg-black/20 p-5">
              <p className="text-2xl">📈</p>
              <h3 className="mt-3 font-semibold text-cyan-200">
                Beginner → Advanced progression
              </h3>
              <p className="mt-2 text-sm text-zinc-300">
                Advance at your pace through role-focused tracks and milestones.
              </p>
            </article>
          </div>
          <div className="mt-6 flex flex-wrap gap-2">
            {categories.slice(0, 8).map((categoryName) => (
              <Badge
                key={categoryName}
                variant="secondary"
                className="rounded-full border border-white/15 bg-white/5 px-3 py-1 font-mono text-zinc-200"
              >
                {categoryName}
              </Badge>
            ))}
          </div>
        </section>

        <FAQSection />
      </main>
    </div>
  );
}
