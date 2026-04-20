import Head from "next/head";

import {
  OrganizerCreateEventStepFourContent,
  OrganizerLayout,
} from "@/features/organizer";

export default function OrganizerCreateEventTicketsPricingPage() {
  return (
    <>
      <Head>
        <title>Create Event - Tickets & Pricing | EventHub</title>
      </Head>

      <OrganizerLayout title="Create Event - Tickets & Pricing" activeLabel="Events">
        <OrganizerCreateEventStepFourContent />
      </OrganizerLayout>
    </>
  );
}
