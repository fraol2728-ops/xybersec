import { notFound } from "next/navigation";
import { groq } from "next-sanity";
import { CertificateView } from "@/components/certificate/CertificateView";
import { getCertificateByCode } from "@/lib/actions/certificates";
import { sanityFetch } from "@/sanity/lib/live";

export default async function CertificatePage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;

  const certificate = await getCertificateByCode(code);
  if (!certificate) notFound();

  const { data: courseData } = await sanityFetch({
    query: groq`*[_type == "course" && _id == $courseId][0] { title, "slug": slug.current }`,
    params: { courseId: certificate.courseId },
  });

  return (
    <CertificateView
      certificate={{
        code: certificate.certificateCode,
        issuedAt: certificate.issuedAt,
        username: certificate.user.username ?? "Student",
        courseTitle: courseData?.title ?? "Cybersecurity Course",
        courseSlug: courseData?.slug ?? "",
      }}
    />
  );
}
