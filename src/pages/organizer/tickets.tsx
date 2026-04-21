import Head from "next/head";

import {
  OrganizerLayout,
  OrganizerTicketsContent,
} from "@/features/organizer";

export default function OrganizerTicketsPage() {
  return (
    <>
      <Head>
        <title>Organizer Tickets | EventHub</title>
      </Head>

      <OrganizerLayout title="Tickets Management" activeLabel="Tickets">
        <OrganizerTicketsContent />
      </OrganizerLayout>
    </>
  );
}
