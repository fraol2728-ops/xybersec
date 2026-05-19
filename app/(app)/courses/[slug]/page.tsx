import { auth } from "@clerk/nextjs/server";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CourseContent } from "@/components/courses";
import { StructuredData } from "@/components/seo/StructuredData";
import { absoluteUrl, siteConfig } from "@/lib/seo";
import { prisma } from "@/lib/prisma";
import { sanityFetch } from "@/sanity/lib/live";
import { COURSE_WITH_MODULES_QUERY } from "@/sanity/lib/queries";

interface CoursePageProps {
  params: Promise<{ slug: string }>;
}

async function getCourse(slug: string, userId?: string | null) {
  const { data: course } = await sanityFetch({
    query: COURSE_WITH_MODULES_QUERY,
    params: { slug, userId: userId ?? null },
  });

  return course;
}

export async function generateMetadata({
  params,
}: CoursePageProps): Promise<Metadata> {
  const { slug } = await params;
  const course = await getCourse(slug);

  if (!course) {
    return {
      title: "Course Not Found",
      description: "The requested cybersecurity course could not be found.",
    };
  }

  const title = `${course.title ?? "Course"} | Xybersec Course`;
  const description =
    course.description ??
    "Explore this Xybersec cybersecurity course and build practical skills in ethical hacking, Linux, networking, and defense.";
  const thumbnailUrl = course.thumbnail?.asset?.url;

  return {
    title,
    description,
    keywords: [
      "xybersec course",
      course.title ?? "cybersecurity course Ethiopia",
      course.category?.title ?? "ethical hacking Ethiopia",
    ],
    alternates: {
      canonical: `/courses/${slug}`,
    },
    openGraph: {
      title,
      description,
      type: "article",
      url: absoluteUrl(`/courses/${slug}`),
      images: thumbnailUrl
        ? [
            {
              url: thumbnailUrl,
              alt: `${course.title ?? "Course"} thumbnail`,
            },
          ]
        : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: thumbnailUrl ? [thumbnailUrl] : undefined,
    },
  };
}

export default async function CoursePage({ params }: CoursePageProps) {
  const { slug } = await params;
  const { userId } = await auth();
  const course = await getCourse(slug, userId);

  if (!course) {
    notFound();
  }

  let isEnrolled = false;
  if (userId) {
    const profile = await prisma.userProfile.findUnique({
      where: { clerkId: userId },
      include: {
        enrollments: {
          where: { courseId: course._id },
        },
      },
    });
    isEnrolled = (profile?.enrollments?.length ?? 0) > 0;
  }

  const courseSchema = {
    "@context": "https://schema.org",
    "@type": "Course",
    name: course.title ?? "Xybersec course",
    description:
      course.description ??
      "A structured cybersecurity course from Xybersec.",
    provider: {
      "@type": "Organization",
      name: siteConfig.name,
      sameAs: siteConfig.url,
    },
    educationalLevel:
      course.tier === "ultra"
        ? "Advanced"
        : course.tier === "pro"
          ? "Intermediate"
          : "Beginner",
    about: [
      course.category?.title ?? "Cybersecurity",
      "Ethical Hacking",
      "Linux",
      "Networking",
    ],
    url: absoluteUrl(`/courses/${slug}`),
    image: course.thumbnail?.asset?.url ?? undefined,
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: siteConfig.url },
      {
        "@type": "ListItem",
        position: 2,
        name: "Courses",
        item: `${siteConfig.url}/courses`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: course.title ?? "Course",
        item: absoluteUrl(`/courses/${slug}`),
      },
    ],
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-white overflow-hidden">
      <StructuredData data={courseSchema} />
      <StructuredData data={breadcrumbSchema} />
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-violet-600/15 rounded-full blur-[120px] animate-pulse" />
        <div
          className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-fuchsia-600/10 rounded-full blur-[100px] animate-pulse"
          style={{ animationDelay: "1s" }}
        />
        <div
          className="absolute top-[40%] right-[20%] w-[400px] h-[400px] bg-cyan-500/10 rounded-full blur-[80px] animate-pulse"
          style={{ animationDelay: "2s" }}
        />
      </div>

      <div
        className="fixed inset-0 pointer-events-none opacity-[0.015]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      <main className="relative z-10 px-6 lg:px-12 py-12 max-w-7xl mx-auto">
        <CourseContent course={course} userId={userId} isEnrolled={isEnrolled} />
      </main>
    </div>
  );
}
