import Head from "next/head";

import {
  OrganizerAttendeesContent,
  OrganizerLayout,
} from "@/features/organizer";

export default function OrganizerAttendeesPage() {
  return (
    <>
      <Head>
        <title>Organizer Attendees | EventHub</title>
      </Head>

      <OrganizerLayout title="Attendee Management" activeLabel="Attendees">
        <OrganizerAttendeesContent />
      </OrganizerLayout>
    </>
  );
}
