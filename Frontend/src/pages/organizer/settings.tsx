import Head from "next/head";

import {
  OrganizerDashboardSidebar,
  OrganizerSettingsContent,
  getOrganizerNavigationItems,
  organizerProfile,
} from "@/features/organizer";

export default function OrganizerSettingsPage() {
  return (
    <>
      <Head>
        <title>Organizer Settings | EventHub</title>
      </Head>

      <main className="min-h-screen w-full bg-[#FDFDFF] text-slate-900">
        <div className="flex min-h-screen w-full flex-col lg:flex-row">
          <OrganizerDashboardSidebar
            navigationItems={getOrganizerNavigationItems("Settings")}
            profile={organizerProfile}
          />
          <OrganizerSettingsContent />
        </div>
      </main>
    </>
  );
}
