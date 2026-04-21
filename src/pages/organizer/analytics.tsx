import Head from "next/head";

import {
  OrganizerAnalyticsContent,
  OrganizerLayout,
} from "@/features/organizer";

export default function OrganizerAnalyticsPage() {
  return (
    <>
      <Head>
        <title>Organizer Analytics | EventHub</title>
      </Head>

      <OrganizerLayout title="Analytics" activeLabel="Analytics">
        <OrganizerAnalyticsContent />
      </OrganizerLayout>
    </>
  );
}
