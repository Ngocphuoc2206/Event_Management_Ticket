import Head from "next/head";
import {
  OrganizerDashboardSidebar,
  getOrganizerNavigationItems,
  organizerProfile,
} from "@/features/organizer";
import { OrganizerEditEventStepThreeContent } from "@/features/organizer/editEvent/OrganizerEditEventStepThreeContent";

export default function OrganizerEditEventStepThreePage() {
  return (
    <>
      <Head>
        <title>Edit Event - Media | EventHub</title>
      </Head>

      <main className="min-h-screen w-full bg-[#FDFDFF] text-slate-900">
        <div className="flex min-h-screen w-full flex-col lg:flex-row">
          <OrganizerDashboardSidebar navigationItems={getOrganizerNavigationItems("Events")} profile={organizerProfile} />
          <OrganizerEditEventStepThreeContent />
        </div>
      </main>
    </>
  );
}
