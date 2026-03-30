import Head from "next/head";
import {
  OrganizerDashboardSidebar,
  getOrganizerNavigationItems,
  organizerProfile,
} from "@/features/organizer";
import { OrganizerEditEventStepFourContent } from "@/features/organizer/editEvent/OrganizerEditEventStepFourContent";

export default function OrganizerEditEventStepFourPage() {
  return (
    <>
      <Head>
        <title>Edit Event - Ticket Setup | EventHub</title>
      </Head>

      <main className="min-h-screen w-full bg-slate-50 text-slate-900">
        <div className="flex min-h-screen w-full flex-col lg:flex-row">
          <OrganizerDashboardSidebar navigationItems={getOrganizerNavigationItems("Events")} profile={organizerProfile} />
          <OrganizerEditEventStepFourContent />
        </div>
      </main>
    </>
  );
}
