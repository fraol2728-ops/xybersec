"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Award, Loader2, CheckCircle2, Zap, ExternalLink } from "lucide-react";
import { claimCertificateWithCP } from "@/lib/actions/certificates";
import { CP_COSTS } from "@/lib/cp-packages";

interface CertificateClaimCardProps {
  courseId: string;
  courseTitle: string;
  totalLessons: number;
  completedLessons: number;
  cpBalance: number;
  existingCertificate?: {
    certificateCode: string;
    issuedAt: Date;
  } | null;
}

export function CertificateClaimCard(props: CertificateClaimCardProps) {
  const { courseId, courseTitle, totalLessons, completedLessons, cpBalance, existingCertificate } = props;
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [claimed, setClaimed] = useState(!!existingCertificate);
  const [certCode, setCertCode] = useState(existingCertificate?.certificateCode ?? null);

  const isComplete = completedLessons >= totalLessons && totalLessons > 0;
  const cpCost = CP_COSTS.CERTIFICATE;
  const hasEnoughCP = cpBalance >= cpCost;

  function handleClaim() {
    startTransition(async () => {
      setError(null);
      const result = await claimCertificateWithCP(courseId, courseTitle);
      if (result?.error === "insufficient_cp") return setError(`Need ${result.shortfall} more CP`);
      if (result?.error) return setError(result.error);
      if (result?.success && result.certificate) {
        setClaimed(true);
        setCertCode(result.certificate.certificateCode);
        router.refresh();
      }
    });
  }

  if (claimed && certCode) {
    return <div className="rounded-2xl border border-border bg-muted p-5"><h3 className="text-sm font-bold text-foreground mb-4">Course Certificate</h3><a href={`/certificate/${certCode}`} className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-primary text-background text-sm font-semibold mb-2"><Award className="w-4 h-4" />View Certificate</a><a href={`/verify/${certCode}`} target="_blank" className="flex items-center justify-center gap-2 w-full py-2 rounded-xl border border-border text-xs text-muted-foreground"><ExternalLink className="w-3 h-3" />Verify Certificate</a></div>;
  }

  return <div className="rounded-2xl border border-border bg-muted p-5"><div className="flex items-center gap-2 mb-4"><Award className="w-5 h-5 text-primary" /><h3 className="text-sm font-bold text-foreground">Course Certificate</h3></div>{!isComplete ? <p className="text-xs text-muted-foreground">Complete all lessons to earn your certificate ({completedLessons}/{totalLessons})</p> : <><div className="flex items-center justify-between mb-4"><span className="text-sm text-muted-foreground">Certificate cost</span><div className="flex items-center gap-1.5"><Zap className="w-3.5 h-3.5 text-primary" /><span className="text-sm font-bold text-primary">{cpCost} CP</span></div></div>{error && <p className="text-red-400 text-xs text-center mb-3">{error}</p>}<button onClick={handleClaim} disabled={isPending || !hasEnoughCP} className="w-full py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 bg-primary text-background disabled:opacity-60">{isPending ? <><Loader2 className="w-4 h-4 animate-spin" />Claiming...</> : <><CheckCircle2 className="w-4 h-4" />Claim Certificate</>}</button></>}</div>;
}
