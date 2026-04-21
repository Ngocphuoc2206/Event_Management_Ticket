import Head from "next/head";

import {
  OrganizerCreateEventStepFiveContent,
  OrganizerLayout,
} from "@/features/organizer";

export default function OrganizerCreateEventReviewPublishPage() {
  return (
    <>
      <Head>
        <title>Create Event - Review & Publish | EventHub</title>
      </Head>

      <OrganizerLayout title="Create Event - Review & Publish" activeLabel="Events">
        <OrganizerCreateEventStepFiveContent />
      </OrganizerLayout>
    </>
  );
}
