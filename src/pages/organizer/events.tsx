import Head from "next/head";

import {
  OrganizerLayout,
  OrganizerEventsContent,
} from "@/features/organizer";

export default function OrganizerEventsPage() {
  return (
    <>
      <Head>
        <title>Organizer Events | EventHub</title>
      </Head>

      <OrganizerLayout title="Events Management" activeLabel="Events">
        <OrganizerEventsContent />
      </OrganizerLayout>
    </>
  );
}
