import Head from "next/head";

import {
  OrganizerCreateEventStepTwoContent,
  OrganizerLayout,
} from "@/features/organizer";

export default function OrganizerCreateEventLocationTimePage() {
  return (
    <>
      <Head>
        <title>Create Event - Location & Time | EventHub</title>
      </Head>

      <OrganizerLayout title="Create Event - Location & Time" activeLabel="Events">
        <OrganizerCreateEventStepTwoContent />
      </OrganizerLayout>
    </>
  );
}
