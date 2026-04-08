import Head from "next/head";

import {
  OrganizerDashboardSidebar,
  getOrganizerNavigationItems,
  organizerProfile,
} from "@/features/organizer";
import { OrganizerEditEventStepOneContent } from "@/features/organizer/editEvent/OrganizerEditEventStepOneContent";

export default function OrganizerEditEventStepOnePage() {
  return (
    <>
      <Head>
        <title>Edit Event - Basic Information | EventHub</title>
      </Head>

      <main className="min-h-screen w-full bg-slate-50 text-slate-900">
        <div className="flex min-h-screen w-full flex-col lg:flex-row">
          <OrganizerDashboardSidebar navigationItems={getOrganizerNavigationItems("Events")} profile={organizerProfile} />
          <OrganizerEditEventStepOneContent />
        </div>
      </main>
    </>
  );
}
