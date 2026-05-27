"use client";

import { Download, Share2, ExternalLink, Shield, CheckCircle2, Award } from "lucide-react";

interface CertificateViewProps {
  certificate: {
    code: string;
    issuedAt: Date;
    username: string;
    courseTitle: string;
    courseSlug: string;
  };
  isOwner?: boolean;
}

export function CertificateView({ certificate }: CertificateViewProps) {
  const formattedDate = new Date(certificate.issuedAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "";
  const verifyUrl = `${appUrl}/verify/${certificate.code}`;

  function handlePrint() {
    window.print();
  }

  async function handleShare() {
    if (navigator.share) {
      await navigator.share({
        title: "My XyberSec Certificate",
        text: `I completed ${certificate.courseTitle} on XyberSec Academy!`,
        url: verifyUrl,
      });
      return;
    }

    await navigator.clipboard.writeText(verifyUrl);
    alert("Certificate link copied to clipboard!");
  }

  return (
    <div className="dark min-h-screen bg-background text-foreground">
      <div className="print:hidden max-w-4xl mx-auto px-4 py-6 flex items-center justify-between">
        <a href="/dashboard" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
          ← Dashboard
        </a>
        <div className="flex items-center gap-3">
          <button onClick={handleShare} className="flex items-center gap-2 px-4 py-2 rounded-xl border border-border text-sm text-muted-foreground hover:text-foreground hover:border-primary/50 transition-all"><Share2 className="w-4 h-4" />Share</button>
          <button onClick={handlePrint} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-background text-sm font-semibold hover:opacity-90 transition-all"><Download className="w-4 h-4" />Download PDF</button>
        </div>
      </div>
      <div className="max-w-4xl mx-auto px-4 pb-16">
        <div className="certificate-print relative bg-[#050a14] border-4 border-primary/40 rounded-3xl p-12 sm:p-16 text-center shadow-[0_0_80px_rgba(34,211,238,0.15)] print:shadow-none print:border-2 overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-center justify-center gap-3 mb-8"><div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/30 flex items-center justify-center"><Shield className="w-6 h-6 text-primary" /></div><div className="text-left"><p className="text-xs font-mono text-primary tracking-widest uppercase">XyberSec Academy</p><p className="text-xs text-muted-foreground">Ethiopia's Cybersecurity Academy</p></div></div>
            <p className="text-xs font-mono text-primary tracking-[0.3em] uppercase mb-4 opacity-80">Certificate of Completion</p>
            <div className="flex items-center gap-4 mb-8"><div className="flex-1 h-px bg-gradient-to-r from-transparent to-primary/40" /><Award className="w-5 h-5 text-primary" /><div className="flex-1 h-px bg-gradient-to-l from-transparent to-primary/40" /></div>
            <p className="text-muted-foreground text-sm mb-3">This is to certify that</p>
            <h1 className="text-4xl sm:text-5xl font-black text-foreground mb-2 tracking-tight">@{certificate.username}</h1>
            <p className="text-muted-foreground text-sm mb-6">has successfully completed</p>
            <div className="inline-block px-6 py-3 rounded-2xl border border-primary/30 bg-primary/5 mb-8"><h2 className="text-xl sm:text-2xl font-bold text-primary">{certificate.courseTitle}</h2></div>
            <div className="grid grid-cols-2 gap-8 mb-10"><div><p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Date Issued</p><p className="text-sm font-semibold text-foreground">{formattedDate}</p></div><div><p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Certificate ID</p><p className="text-sm font-mono text-primary">{certificate.code}</p></div></div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-muted border border-border"><ExternalLink className="w-3 h-3 text-muted-foreground flex-shrink-0" /><p className="text-xs text-muted-foreground font-mono break-all">Verify: {verifyUrl}</p></div>
          </div>
        </div>
        <div className="flex items-center justify-center gap-2 mt-6 print:hidden"><CheckCircle2 className="w-4 h-4 text-green-400" /><p className="text-sm text-muted-foreground">This certificate is verified and tamper-proof</p></div>
      </div>
    </div>
  );
}
