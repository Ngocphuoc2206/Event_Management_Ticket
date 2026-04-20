import Head from "next/head";
import {
  OrganizerLayout,
} from "@/features/organizer";

import { OrganizerEditEventStepTwoContent } from "@/features/organizer/editEvent/OrganizerEditEventStepTwoContent";

export default function OrganizerEditEventStepTwoPage() {
  return (
    <>
      <Head>
        <title>Edit Event - Date & Venue | EventHub</title>
      </Head>

      <OrganizerLayout title="Edit Event - Date & Venue" activeLabel="Events">
        <OrganizerEditEventStepTwoContent />
      </OrganizerLayout>
    </>
  );
}
