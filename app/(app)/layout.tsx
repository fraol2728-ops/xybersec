import { ConditionalHeader } from "@/components/layout/ConditionalHeader";
import { ClientClerkProvider } from "@/components/providers/clerk-provider";
import { TutorWidget } from "@/components/tutor";
import { SanityLive } from "@/sanity/lib/live";

function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClientClerkProvider>
      <div>
        <ConditionalHeader />
        <div className="app-content pt-20">{children}</div>
      </div>
      <SanityLive />
      <TutorWidget />
    </ClientClerkProvider>
  );
}

export default AppLayout;
