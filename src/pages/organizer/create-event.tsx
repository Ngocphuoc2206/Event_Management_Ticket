import Head from "next/head";

import {
  OrganizerCreateEventContent,
  OrganizerLayout,
} from "@/features/organizer";

export default function OrganizerCreateEventPage() {
  return (
    <>
      <Head>
        <title>Create Event | EventHub</title>
      </Head>

      <OrganizerLayout title="Create Event" activeLabel="Events">
        <OrganizerCreateEventContent />
      </OrganizerLayout>
    </>
  );
}
