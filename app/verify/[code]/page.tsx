import { getCertificateByCode } from "@/lib/actions/certificates";

export default async function VerifyPage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;
  const certificate = await getCertificateByCode(code);

  if (!certificate) {
    return <div className="dark min-h-screen bg-background flex items-center justify-center px-4"><div className="text-center max-w-md"><h1 className="text-2xl font-bold text-foreground mb-2">Certificate Not Found</h1><p className="text-muted-foreground mb-5">The certificate code <span className="font-mono text-primary">{code}</span> does not exist or has been revoked.</p></div></div>;
  }

  const formattedDate = new Date(certificate.issuedAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });

  return <div className="dark min-h-screen bg-background flex items-center justify-center px-4 py-16"><div className="max-w-lg w-full text-center"><h1 className="text-3xl font-bold text-foreground mb-2">Certificate Verified</h1><p className="text-muted-foreground mb-8">This is an authentic XyberSec Academy certificate.</p><div className="bg-muted border border-border rounded-2xl p-6 text-left mb-6"><div className="space-y-4"><div className="flex justify-between items-center pb-3 border-b border-border"><span className="text-xs text-muted-foreground uppercase tracking-wider">Awarded to</span><span className="font-bold text-foreground">@{certificate.user.username}</span></div><div className="flex justify-between items-center pb-3 border-b border-border"><span className="text-xs text-muted-foreground uppercase tracking-wider">Certificate ID</span><span className="font-mono text-primary text-sm">{certificate.certificateCode}</span></div><div className="flex justify-between items-center"><span className="text-xs text-muted-foreground uppercase tracking-wider">Issued on</span><span className="text-foreground text-sm">{formattedDate}</span></div></div></div></div></div>;
}
