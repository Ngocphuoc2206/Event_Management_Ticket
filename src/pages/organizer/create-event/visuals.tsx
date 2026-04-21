import Head from "next/head";

import {
  OrganizerCreateEventStepThreeContent,
  OrganizerLayout,
} from "@/features/organizer";

export default function OrganizerCreateEventVisualsPage() {
  return (
    <>
      <Head>
        <title>Create Event - Visuals | EventHub</title>
      </Head>

      <OrganizerLayout title="Create Event - Visuals" activeLabel="Events">
        <OrganizerCreateEventStepThreeContent />
      </OrganizerLayout>
    </>
  );
}
