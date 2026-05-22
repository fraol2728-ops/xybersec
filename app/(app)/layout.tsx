import { Header } from "@/components/Header";
import { ClientClerkProvider } from "@/components/providers/clerk-provider";
import { TutorWidget } from "@/components/tutor";
import { SanityLive } from "@/sanity/lib/live";

function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClientClerkProvider>
      <div className="[&:has([data-lesson-page='true'])_header]:hidden [&:has([data-lesson-page='true'])_.app-content]:pt-0">
        <Header />
        <div className="app-content pt-20">{children}</div>
      </div>
      <SanityLive />
      <TutorWidget />
    </ClientClerkProvider>
  );
}

export default AppLayout;
