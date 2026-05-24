"use client";

import { CheckCircle2, Loader2, XCircle } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { verifyAndFulfillPayment } from "@/lib/actions/payment";

export function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const txRef = searchParams.get("tx_ref");

  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("");
  const [courseId, setCourseId] = useState<string | null>(null);

  useEffect(() => {
    if (!txRef) {
      setStatus("error");
      setMessage("Invalid payment reference");
      return;
    }

    verifyAndFulfillPayment(txRef).then((result) => {
      if (result.success || result.alreadyProcessed) {
        setStatus("success");
        setMessage(result.type === "CERTIFICATE" ? "Certificate payment confirmed!" : "Enrollment confirmed! You now have full access.");
        if ("courseId" in result && result.courseId) setCourseId(result.courseId as string);
      } else {
        setStatus("error");
        setMessage(result.error ?? "Payment verification failed");
      }
    });
  }, [txRef]);

  return (
    <div className="dark min-h-screen bg-background flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        {status === "loading" && (
          <>
            <Loader2 className="w-16 h-16 text-primary mx-auto mb-6 animate-spin" />
            <h1 className="text-2xl font-bold text-foreground mb-2">Verifying Payment</h1>
            <p className="text-muted-foreground">Please wait while we confirm your payment...</p>
          </>
        )}
        {status === "success" && (
          <>
            <div className="w-20 h-20 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-10 h-10 text-primary" />
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-3">Payment Successful! 🎉</h1>
            <p className="text-muted-foreground mb-8">{message}</p>
            <div className="space-y-3">
              <button onClick={() => router.push("/dashboard")} className="block w-full py-3 rounded-xl bg-primary text-background font-semibold hover:opacity-90 transition-all">
                Go to Dashboard →
              </button>
              {courseId && (
                <button
                  onClick={() => router.push(`/courses`)}
                  className="block w-full py-3 rounded-xl border border-border text-muted-foreground hover:text-foreground hover:border-primary/50 transition-all"
                >
                  Start Learning Now →
                </button>
              )}
            </div>
          </>
        )}
        {status === "error" && (
          <>
            <div className="w-20 h-20 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center mx-auto mb-6">
              <XCircle className="w-10 h-10 text-red-400" />
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-3">Payment Issue</h1>
            <p className="text-muted-foreground mb-8">{message}</p>
            <div className="space-y-3">
              <button onClick={() => router.push("/pricing")} className="block w-full py-3 rounded-xl bg-primary text-background font-semibold hover:opacity-90 transition-all">
                Try Again
              </button>
              <button
                onClick={() => router.push("/dashboard")}
                className="block w-full py-3 rounded-xl border border-border text-muted-foreground hover:text-foreground transition-all"
              >
                Back to Dashboard
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
