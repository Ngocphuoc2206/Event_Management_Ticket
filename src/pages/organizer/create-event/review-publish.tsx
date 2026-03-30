import Head from "next/head";

import {
  OrganizerCreateEventStepFiveContent,
  OrganizerDashboardSidebar,
  getOrganizerNavigationItems,
  organizerProfile,
} from "@/features/organizer";

export default function OrganizerCreateEventReviewPublishPage() {
  return (
    <>
      <Head>
        <title>Create Event - Review & Publish | EventHub</title>
      </Head>

      <main className="min-h-screen w-full bg-slate-50 text-slate-900">
        <div className="flex min-h-screen w-full flex-col lg:flex-row">
          <OrganizerDashboardSidebar
            navigationItems={getOrganizerNavigationItems("Create Event")}
            profile={organizerProfile}
          />
          <OrganizerCreateEventStepFiveContent />
        </div>
      </main>
    </>
  );
}
