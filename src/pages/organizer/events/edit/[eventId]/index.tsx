import Head from "next/head";

import {
  OrganizerLayout,
} from "@/features/organizer";
import { OrganizerEditEventStepOneContent } from "@/features/organizer/editEvent/OrganizerEditEventStepOneContent";

export default function OrganizerEditEventStepOnePage() {
  return (
    <>
      <Head>
        <title>Edit Event - Basic Information | EventHub</title>
      </Head>

      <OrganizerLayout title="Edit Event - Basic Information" activeLabel="Events">
        <OrganizerEditEventStepOneContent />
      </OrganizerLayout>
    </>
  );
}
