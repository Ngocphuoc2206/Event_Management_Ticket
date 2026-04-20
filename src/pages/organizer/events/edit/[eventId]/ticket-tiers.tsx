import Head from "next/head";
import {
  OrganizerLayout,
} from "@/features/organizer";
import { OrganizerEditEventStepThreeContent } from "@/features/organizer/editEvent/OrganizerEditEventStepThreeContent";

export default function OrganizerEditEventStepThreePage() {
  return (
    <>
      <Head>
        <title>Edit Event - Media | EventHub</title>
      </Head>

      <OrganizerLayout title="Edit Event - Media" activeLabel="Events">
        <OrganizerEditEventStepThreeContent />
      </OrganizerLayout>
    </>
  );
}
