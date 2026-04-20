import Head from "next/head";
import { useRouter } from "next/router";
import {
  OrganizerDashboardSidebar,
  OrganizerTicketsContent,
  getOrganizerNavigationItems,
  organizerProfile,
} from "@/features/organizer";

export default function OrganizerEditEventStepThreePage() {
  const router = useRouter();
  const eventIdRaw = router.query.eventId;
  const eventId = Array.isArray(eventIdRaw) ? eventIdRaw[0] : eventIdRaw;

  return (
    <>
      <Head>
        <title>Edit Event - Ticket Types | EventHub</title>
      </Head>

      <main className="min-h-screen w-full bg-slate-50 text-slate-900">
        <div className="flex min-h-screen w-full flex-col lg:flex-row">
          <OrganizerDashboardSidebar navigationItems={getOrganizerNavigationItems("Events")} profile={organizerProfile} />
          <OrganizerTicketsContent initialEventId={eventId} lockEventSelection />
        </div>
      </main>
    </>
  );
}
