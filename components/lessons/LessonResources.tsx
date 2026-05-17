"use client";

import { motion } from "framer-motion";
import { Download, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

type ResourceType = "download" | "practice" | "lab" | "link";

interface LessonResource {
  _key: string;
  title?: string;
  type?: ResourceType;
  file?: {
    asset?: {
      url?: string;
    };
  };
  url?: string;
}

interface LessonResourcesProps {
  lesson: {
    _id: string;
    resources?: LessonResource[] | null;
  };
}

const RESOURCE_GROUPS: Array<{
  type: ResourceType;
  heading: string;
  icon: string;
}> = [
  { type: "download", heading: "Downloadable Files", icon: "📄" },
  { type: "practice", heading: "Practice Files", icon: "💻" },
  { type: "lab", heading: "Lab Setup", icon: "🧪" },
  { type: "link", heading: "External Links", icon: "🌐" },
];

export function LessonResources({ lesson }: LessonResourcesProps) {
  const resources = (lesson.resources ?? []).filter(
    (resource): resource is LessonResource & { type: ResourceType } =>
      Boolean(
        resource?.type &&
          RESOURCE_GROUPS.some((group) => group.type === resource.type),
      ),
  );

  if (!resources.length) {
    return null;
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className="rounded-[1.75rem] border border-white/10 bg-white/[0.04] p-6 shadow-[0_22px_55px_rgba(2,6,23,0.24)] backdrop-blur-xl"
    >
      <h2 className="mb-6 text-xl font-semibold text-white">
        Lesson Resources
      </h2>

      <div className="space-y-6">
        {RESOURCE_GROUPS.map((group, groupIndex) => {
          const groupItems = resources.filter(
            (resource) => resource.type === group.type,
          );

          if (!groupItems.length) {
            return null;
          }

          return (
            <div key={group.type} className="space-y-3">
              <h3 className="text-sm font-medium uppercase tracking-wide text-zinc-300">
                {group.heading}
              </h3>

              <motion.div
                className="space-y-3"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                variants={{
                  hidden: {},
                  visible: {
                    transition: {
                      staggerChildren: 0.07,
                      delayChildren: groupIndex * 0.08,
                    },
                  },
                }}
              >
                {groupItems.map((resource) => {
                  const href =
                    resource.type === "link"
                      ? resource.url
                      : resource.file?.asset?.url;

                  if (!href) {
                    return null;
                  }

                  return (
                    <motion.div
                      key={resource._key}
                      variants={{
                        hidden: { opacity: 0, y: 12 },
                        visible: { opacity: 1, y: 0 },
                      }}
                      whileHover={{ y: -3 }}
                      transition={{ duration: 0.2, ease: "easeOut" }}
                      className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-[#08111f]/70 p-4 shadow-[0_18px_45px_rgba(3,7,18,0.25)] transition-colors duration-300 hover:border-cyan-400/25 hover:bg-[#0b1629]/85 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-lg" aria-hidden="true">
                          {group.icon}
                        </span>
                        <p className="text-sm font-medium text-zinc-100">
                          {resource.title ?? "Untitled Resource"}
                        </p>
                      </div>

                      <Button asChild size="sm" className="w-full sm:w-auto">
                        <a
                          href={href}
                          target={resource.type === "link" ? "_blank" : "_self"}
                          rel={
                            resource.type === "link"
                              ? "noreferrer noopener"
                              : undefined
                          }
                          download={resource.type === "link" ? undefined : true}
                        >
                          {resource.type === "link" ? (
                            <>
                              Open Link{" "}
                              <ExternalLink className="ml-2 h-4 w-4" />
                            </>
                          ) : (
                            <>
                              Download <Download className="ml-2 h-4 w-4" />
                            </>
                          )}
                        </a>
                      </Button>
                    </motion.div>
                  );
                })}
              </motion.div>
            </div>
          );
        })}
      </div>
    </motion.section>
  );
}
