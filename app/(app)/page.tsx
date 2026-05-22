import type { Metadata } from "next";
import { FooterCTA } from "@/components/landing/FooterCTA";
import { Footer } from "@/components/landing/Footer";
import { FoundingMembers } from "@/components/landing/FoundingMembers";
import { Hero } from "@/components/landing/Hero";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { FeaturedCourses } from "@/components/landing/FeaturedCourses";
import { SkillsGrid } from "@/components/landing/SkillsGrid";
import { StatsBar } from "@/components/landing/StatsBar";
import { StructuredData } from "@/components/seo/StructuredData";
import { buildMetadata, siteConfig } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({
    title: "Xybersec Academy Cybersecurity Learning Platform",
    description:
      "Xybersec Academy by DevFraol teaches cybersecurity through structured Xybersec roadmaps, hands-on labs, and guided tracks for red team, blue team, and web pentesting.",
    path: "/",
    keywords: [
      "xybersec academy",
      "xybersec",
      "cybersecurity platform",
      "red team roadmap",
      "blue team roadmap",
      "web pentesting",
    ],
  });
}

export default async function HomePage() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What is Xybersec?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Xybersec is a cybersecurity learning platform for mastering offensive and defensive skills through structured roadmaps and practical labs.",
        },
      },
      {
        "@type": "Question",
        name: "Does Xybersec offer online cybersecurity training?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. The platform offers online tech and cybersecurity courses tailored for learners in Ethiopia, including hands-on content and guided learning paths.",
        },
      },
    ],
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
    ],
  };

  return (
    <div className="dark min-h-screen bg-background">
      <StructuredData data={faqSchema} />
      <StructuredData data={breadcrumbSchema} />
      <main aria-label="Xybersec homepage">
        <Hero />
        <StatsBar />
        <FeaturedCourses />
        <HowItWorks />
        <SkillsGrid />
        <FoundingMembers />
        <FooterCTA />
      </main>
      <Footer />
    </div>
  );
}
