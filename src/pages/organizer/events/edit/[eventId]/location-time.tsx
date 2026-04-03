import Head from "next/head";
import {
  OrganizerDashboardSidebar,
  getOrganizerNavigationItems,
  organizerProfile,
} from "@/features/organizer";

import { OrganizerEditEventStepTwoContent } from "@/features/organizer/editEvent/OrganizerEditEventStepTwoContent";

export default function OrganizerEditEventStepTwoPage() {
  return (
    <>
      <Head>
        <title>Edit Event - Date & Venue | EventHub</title>
      </Head>

      <main className="min-h-screen w-full bg-slate-50 text-slate-900">
        <div className="flex min-h-screen w-full flex-col lg:flex-row">
          <OrganizerDashboardSidebar navigationItems={getOrganizerNavigationItems("Events")} profile={organizerProfile} />
          <OrganizerEditEventStepTwoContent />
        </div>
      </main>
    </>
  );
}
