import { Suspense } from "react";
import { PaymentSuccessContent } from "@/components/payment/PaymentSuccessContent";

export default function PaymentSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-muted-foreground">Verifying payment...</div>
        </div>
      }
    >
      <PaymentSuccessContent />
    </Suspense>
  );
}
